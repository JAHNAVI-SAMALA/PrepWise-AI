import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UploadCard from "../components/UploadCard";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import api from "../services/api";

function Home() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [role, setRole] = useState("Software Engineer");
    const [uploading, setUploading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [startError, setStartError] = useState("");

    const uploadResume = async () => {

        if (!file) {
            alert("Please select a resume.");
            return;
        }

        setUploading(true);
        setUploadError("");
        setUploaded(false);

        try {
            const formData = new FormData();
            formData.append("resume", file);
            const res = await api.post("/upload_resume", formData);
            if (res.data.error) {
                setUploadError(res.data.error);
            } else {
                // Store session ID so every subsequent request sends it
                sessionStorage.setItem("prepwise_sid", res.data.session_id);
                setUploaded(true);
            }
        } catch (err) {
            setUploadError(
                err.response?.data?.error || "Upload failed. Is the server running?"
            );
        } finally {
            setUploading(false);
        }
    };

    const startInterview = async () => {

        if (!uploaded) {
            alert("Please upload your resume first.");
            return;
        }

        setStarting(true);
        setStartError("");

        try {
            const res = await api.post("/start_interview", { role });
            navigate("/interview", {
                state: {
                    totalQuestions: res.data.total_questions || 10
                }
            });
        } catch (err) {
            setStartError(
                err.response?.data?.error || "Failed to start interview. Please try again."
            );
            setStarting(false);
        }
    };

    return (
        <div className="bg-slate-50">

            <Navbar />

            <Hero />

            <UploadCard
                file={file}
                setFile={setFile}
                role={role}
                setRole={setRole}
                uploadResume={uploadResume}
                startInterview={startInterview}
                uploading={uploading}
                starting={starting}
                uploaded={uploaded}
                uploadError={uploadError}
                startError={startError}
            />

            <Features />
            <DashboardPreview />

        </div>
    );
}

export default Home;