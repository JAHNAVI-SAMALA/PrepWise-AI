import { useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, CheckCircle, XCircle, BookOpen, MessageSquare, Star, Printer, Download } from "lucide-react";

function Report() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const report = state?.report;

    if (!report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
                <h2 className="text-2xl font-bold text-gray-700">No report found.</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const handleSave = () => {
        const lines = [];

        lines.push("PREPWISE AI — INTERVIEW ASSESSMENT REPORT");
        lines.push("=".repeat(50));
        lines.push("");
        lines.push(`Candidate   : ${report.candidate}`);
        lines.push(`Role        : ${report.role}`);
        lines.push(`Overall     : ${report.overall_score}/10`);
        lines.push(`Recommend.  : ${report.recommendation}`);
        lines.push("");
        lines.push("SCORES");
        lines.push("-".repeat(30));
        lines.push(`Technical     : ${report.technical_score}/10`);
        lines.push(`Communication : ${report.communication_score}/10`);
        lines.push(`Confidence    : ${report.confidence_score}/10`);
        lines.push("");
        lines.push("STRENGTHS");
        lines.push("-".repeat(30));
        report.strengths.forEach((s) => lines.push(`  • ${s}`));
        lines.push("");
        lines.push("AREAS TO IMPROVE");
        lines.push("-".repeat(30));
        report.weaknesses.forEach((w) => lines.push(`  • ${w}`));
        lines.push("");

        if (report.learning_path && report.learning_path.length > 0) {
            lines.push("LEARNING PATH");
            lines.push("-".repeat(30));
            report.learning_path.forEach((l, i) => lines.push(`  ${i + 1}. ${l}`));
            lines.push("");
        }

        if (report.topics && Object.keys(report.topics).length > 0) {
            lines.push("TOPIC SCORES");
            lines.push("-".repeat(30));
            Object.entries(report.topics).forEach(([t, s]) => lines.push(`  ${t} : ${s}/10`));
            lines.push("");
        }

        lines.push("AI FEEDBACK");
        lines.push("-".repeat(30));
        lines.push(report.summary);

        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PrepWise_Report_${report.candidate.replace(/\s+/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const recommendation = report.recommendation || "";
    const recColor =
        recommendation === "Highly Recommended" ? "text-green-600 bg-green-50 border-green-200" :
        recommendation === "Recommended"        ? "text-blue-600 bg-blue-50 border-blue-200" :
        recommendation === "Recommended with Upskilling" ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
        "text-red-600 bg-red-50 border-red-200";

    const scoreColor = (s) =>
        s >= 8 ? "text-green-600" : s >= 6 ? "text-blue-600" : s >= 4 ? "text-yellow-600" : "text-red-500";

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <header className="bg-white shadow border-b">
                <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BrainCircuit size={36} className="text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold">PrepWise AI</h1>
                            <p className="text-gray-500 text-sm">Interview Assessment Report</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 no-print">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-semibold transition"
                        >
                            <Download size={18} />
                            Save
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-semibold transition"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Start New Interview
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-10 px-6 space-y-6">

                {/* Hero card — candidate + overall */}
                <div className="bg-white rounded-3xl shadow-xl p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900">
                                {report.candidate}
                            </h2>
                            <p className="text-gray-500 mt-2 text-lg">{report.role}</p>
                            <span className={`inline-block mt-4 px-5 py-2 rounded-full border font-semibold text-sm ${recColor}`}>
                                {report.recommendation}
                            </span>
                        </div>

                        <div className="text-center bg-slate-50 rounded-2xl px-10 py-6 border">
                            <p className="text-gray-500 text-sm mb-1">Overall Score</p>
                            <p className={`text-7xl font-extrabold ${scoreColor(report.overall_score)}`}>
                                {report.overall_score}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">out of 10</p>
                        </div>

                    </div>
                </div>

                {/* Score breakdown */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold mb-6">Score Breakdown</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <ScoreBar label="Technical"     value={report.technical_score} />
                        <ScoreBar label="Communication" value={report.communication_score} />
                        <ScoreBar label="Confidence"    value={report.confidence_score} />
                    </div>
                </div>

                {/* Strengths + Weaknesses side by side */}
                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle size={24} className="text-green-500" />
                            <h3 className="text-2xl font-bold">Strengths</h3>
                        </div>
                        <ul className="space-y-3">
                            {report.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <XCircle size={24} className="text-red-400" />
                            <h3 className="text-2xl font-bold">Areas to Improve</h3>
                        </div>
                        <ul className="space-y-3">
                            {report.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Learning Path */}
                {report.learning_path && report.learning_path.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen size={24} className="text-blue-500" />
                            <h3 className="text-2xl font-bold">Learning Path</h3>
                        </div>
                        <ol className="space-y-4">
                            {report.learning_path.map((l, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                        {i + 1}
                                    </span>
                                    <p className="text-gray-700 mt-1">{l}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* AI Feedback */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare size={24} className="text-indigo-500" />
                        <h3 className="text-2xl font-bold">AI Feedback</h3>
                    </div>
                    <p className="text-gray-700 leading-8 text-lg">{report.summary}</p>
                </div>

                {/* Topic scores if available */}
                {report.topics && Object.keys(report.topics).length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Star size={24} className="text-yellow-500" />
                            <h3 className="text-2xl font-bold">Topic Scores</h3>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(report.topics).map(([topic, score]) => (
                                <div key={topic}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-700">{topic}</span>
                                        <span className={`font-bold ${scoreColor(score)}`}>{score}/10</span>
                                    </div>
                                    <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${(score / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

function ScoreBar({ label, value }) {
    const color =
        value >= 8 ? "bg-green-500" :
        value >= 6 ? "bg-blue-500" :
        value >= 4 ? "bg-yellow-400" : "bg-red-400";

    const textColor =
        value >= 8 ? "text-green-600" :
        value >= 6 ? "text-blue-600" :
        value >= 4 ? "text-yellow-600" : "text-red-500";

    return (
        <div className="bg-slate-50 rounded-2xl p-6 border">
            <div className="flex justify-between mb-3">
                <span className="font-semibold text-gray-700">{label}</span>
                <span className={`font-bold text-lg ${textColor}`}>{value}/10</span>
            </div>
            <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${(value / 10) * 100}%` }}
                />
            </div>
        </div>
    );
}

export default Report;
