import { useRef, useState, useCallback, useEffect } from "react";

/**
 * useSpeech — wraps Web Speech API for TTS + STT.
 *
 * Returns:
 *   speak(text)   — read text aloud via SpeechSynthesis
 *   stopSpeaking  — cancel current speech
 *   isSpeaking    — true while TTS is active
 *   startListening(onTranscript) — start microphone STT
 *   stopListening — stop microphone
 *   isListening   — true while mic is active
 *   supported     — { tts: bool, stt: bool }
 */
export function useSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Stable ref — never changes, safe to use in useCallback deps
    const supportedRef = useRef({
        tts: typeof window !== "undefined" && "speechSynthesis" in window,
        stt: typeof window !== "undefined" &&
            ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
    });
    const supported = supportedRef.current;

    // ── TTS ───────────────────────────────────────────────────────────────

    const speak = useCallback((text) => {
        if (!supported.tts || !text) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Prefer a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
            (v) =>
                v.lang.startsWith("en") &&
                (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Neural"))
        );
        if (preferred) utterance.voice = preferred;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported.tts]);

    const stopSpeaking = useCallback(() => {
        if (supported.tts) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [supported.tts]);

    // Voices load async in some browsers — no-op effect to trigger re-render
    useEffect(() => {
        if (!supported.tts) return;
        const handler = () => {};
        window.speechSynthesis.addEventListener("voiceschanged", handler);
        return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
    }, [supported.tts]);

    // ── STT ───────────────────────────────────────────────────────────────

    const startListening = useCallback((onTranscript, onError) => {
        if (!supported.stt) return;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            let localFinal = "";
            let interim = "";
            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    localFinal += transcript + " ";
                } else {
                    interim += transcript;
                }
            }
            // Pass combined text back so textarea updates live
            onTranscript(localFinal + interim);
        };

        recognition.onerror = (e) => {
            console.error("[STT] Error:", e.error);
            setIsListening(false);
            if (onError) onError(e.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [supported.stt]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopSpeaking();
            stopListening();
        };
    }, [stopSpeaking, stopListening]);

    return {
        speak,
        stopSpeaking,
        isSpeaking,
        startListening,
        stopListening,
        isListening,
        supported,
    };
}
