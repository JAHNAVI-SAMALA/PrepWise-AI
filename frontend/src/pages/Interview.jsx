import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrainCircuit, Clock, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import api from "../services/api";
import { useSpeech } from "../hooks/useSpeech";

function Interview() {
    const navigate = useNavigate();
    const location = useLocation();

    const totalQuestions = location.state?.totalQuestions || 10;

    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [fetchError, setFetchError] = useState(false);

    const {
        speak,
        stopSpeaking,
        isSpeaking,
        startListening,
        stopListening,
        isListening,
        supported,
    } = useSpeech();

    // Track transcript separately so mic appends to existing typed text
    const baseAnswerRef = useRef("");

    // ── Fetch question ──────────────────────────────────────────────────

    const fetchQuestion = async () => {
        setLoading(true);
        setFetchError(false);
        stopListening();
        stopSpeaking();

        try {
            const res = await api.get("/next_question");

            if (res.data.message === "Interview completed.") {
                const report = await api.get("/report");
                navigate("/report", { state: { report: report.data } });
                return;
            }

            if (!res.data.question || res.data.question.trim() === "") {
                setFetchError(true);
            } else {
                setQuestion(res.data);
                setQuestionNumber((prev) => prev + 1);
                // Auto-speak the question after a short delay
                setTimeout(() => speak(res.data.question), 600);
            }
        } catch (err) {
            console.error(err);
            setFetchError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    // ── Mic toggle ──────────────────────────────────────────────────────

    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            // Stop TTS before listening
            stopSpeaking();
            // Remember current typed text so we append to it
            baseAnswerRef.current = answer;
            startListening(
                (transcript) => {
                    setAnswer(baseAnswerRef.current + transcript);
                },
                (error) => {
                    if (error === "not-allowed") {
                        alert("Microphone permission was denied. Please enable microphone access in your browser's address bar/settings and try again.");
                    } else if (error === "no-speech") {
                        console.warn("No speech was detected.");
                    } else {
                        alert(`Speech recognition error: ${error}`);
                    }
                }
            );
        }
    };

    // ── Submit ──────────────────────────────────────────────────────────

    const submitAnswer = async () => {
        if (!answer.trim()) {
            alert("Please enter an answer.");
            return;
        }

        stopListening();
        stopSpeaking();
        setSubmitting(true);

        try {
            const res = await api.post("/submit_answer", { answer });

            setAnswer("");
            baseAnswerRef.current = "";
            setEvaluation(res.data.evaluation);

            if (res.data.decision.action === "END_INTERVIEW") {
                setTimeout(async () => {
                    const report = await api.get("/report");
                    navigate("/report", { state: { report: report.data } });
                }, 2500);
                return;
            }

            setTimeout(async () => {
                setEvaluation(null);
                await fetchQuestion();
                setSubmitting(false);
            }, 2500);
        } catch (err) {
            console.error(err);
            alert("Failed to submit answer.");
            setSubmitting(false);
        }
    };

    // ── Progress ────────────────────────────────────────────────────────

    const progressPercent = Math.min(
        Math.round((questionNumber / totalQuestions) * 100),
        100
    );

    // ── Render ──────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
                <BrainCircuit size={48} className="text-blue-600 animate-pulse" />
                <h2 className="text-2xl font-bold text-blue-600">
                    Loading Question...
                </h2>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-6">
                <h2 className="text-2xl font-bold text-red-500">
                    Failed to load question.
                </h2>
                <p className="text-gray-500">
                    The AI couldn't generate a valid question. Try again.
                </p>
                <button
                    onClick={fetchQuestion}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <header className="bg-white shadow border-b">
                <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">

                    <div className="flex items-center gap-3">
                        <BrainCircuit size={36} className="text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold">PrepWise AI</h1>
                            <p className="text-gray-500 text-sm">AI Technical Interview</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">

                        <div className="text-center">
                            <p className="text-gray-500 text-sm">Question</p>
                            <h3 className="font-bold text-lg">
                                {questionNumber}
                                <span className="text-gray-400 font-normal text-sm">
                                    /{totalQuestions}
                                </span>
                            </h3>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500 text-sm">Difficulty</p>
                            <h3 className="font-semibold">{question?.difficulty}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="text-blue-600" />
                            <span className="font-semibold">Live</span>
                        </div>

                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto py-10 px-6">

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold">Interview Progress</span>
                        <span className="text-gray-500 text-sm">
                            {questionNumber} of {totalQuestions} questions
                        </span>
                    </div>
                    <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="text-right mt-1 text-xs text-gray-400">
                        {progressPercent}% complete
                    </div>
                </div>

                {/* Question card */}
                <div className="bg-white rounded-3xl shadow-xl p-10">

                    {/* Topic + difficulty + voice controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                                {question?.difficulty}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">
                                Topic: {question?.topic}
                            </span>
                        </div>

                        {/* TTS replay button */}
                        {supported.tts && (
                            <button
                                onClick={() =>
                                    isSpeaking
                                        ? stopSpeaking()
                                        : speak(question?.question)
                                }
                                title={isSpeaking ? "Stop reading" : "Read question aloud"}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition
                                    ${isSpeaking
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {isSpeaking ? (
                                    <><VolumeX size={16} /> Stop</>
                                ) : (
                                    <><Volume2 size={16} /> Replay</>
                                )}
                            </button>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold">Interview Question</h2>

                    <p className="mt-6 text-lg text-gray-700 leading-8">
                        {question?.question}
                    </p>

                    {/* Answer area */}
                    <div className="relative mt-10">
                        <textarea
                            value={answer}
                            onChange={(e) => {
                                setAnswer(e.target.value);
                                baseAnswerRef.current = e.target.value;
                            }}
                            placeholder={
                                isListening
                                    ? "Listening... speak your answer"
                                    : "Type your answer or use the mic below..."
                            }
                            className={`w-full border rounded-2xl p-5 h-56 outline-none resize-none transition
                                ${isListening
                                    ? "border-red-400 ring-2 ring-red-200 bg-red-50"
                                    : "focus:ring-2 focus:ring-blue-500"
                                }`}
                        />

                        {/* Live mic indicator inside textarea */}
                        {isListening && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                Listening
                            </div>
                        )}
                    </div>

                    {/* Action row */}
                    <div className="mt-6 flex gap-4">

                        {/* Mic button */}
                        {supported.stt && (
                            <button
                                onClick={toggleMic}
                                disabled={submitting}
                                title={isListening ? "Stop microphone" : "Start microphone"}
                                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold border transition
                                    ${isListening
                                        ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {isListening ? (
                                    <><MicOff size={20} /> Stop Mic</>
                                ) : (
                                    <><Mic size={20} /> Use Mic</>
                                )}
                            </button>
                        )}

                        {/* Submit button */}
                        <button
                            onClick={submitAnswer}
                            disabled={submitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition"
                        >
                            {submitting ? "Evaluating..." : "Submit Answer"}
                        </button>

                    </div>

                    {/* Browser support warnings */}
                    {!supported.tts && (
                        <p className="mt-4 text-xs text-gray-400 text-center">
                            Voice reading not supported in this browser.
                        </p>
                    )}
                    {!supported.stt && (
                        <p className="mt-2 text-xs text-gray-400 text-center">
                            Voice input not supported in this browser. Use Chrome for best experience.
                        </p>
                    )}

                </div>

                {/* Evaluation */}
                {evaluation && (
                    <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">

                        <h2 className="text-2xl font-bold mb-6 text-center">
                            AI Evaluation
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <ScoreCard title="Overall"       value={evaluation.overall_score} />
                            <ScoreCard title="Technical"     value={evaluation.technical_score} />
                            <ScoreCard title="Communication" value={evaluation.communication_score} />
                            <ScoreCard title="Confidence"    value={evaluation.confidence_score} />
                        </div>

                        {evaluation.feedback && (
                            <p className="mt-6 text-gray-600 text-center text-sm leading-7">
                                {evaluation.feedback}
                            </p>
                        )}

                    </div>
                )}

            </main>
        </div>
    );
}

function ScoreCard({ title, value }) {
    return (
        <div className="bg-slate-50 rounded-2xl p-6 text-center border">
            <h3 className="text-gray-500">{title}</h3>
            <p className="text-4xl font-bold text-blue-600 mt-3">{value}</p>
        </div>
    );
}

export default Interview;
