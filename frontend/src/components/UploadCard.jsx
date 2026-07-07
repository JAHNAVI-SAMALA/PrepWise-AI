import { Upload, FileText, CheckCircle, Loader } from "lucide-react";

function UploadCard({
    file,
    setFile,
    role,
    setRole,
    uploadResume,
    startInterview,
    uploading,
    starting,
    uploaded,
    uploadError,
    startError,
}) {
    return (
        <section id="upload" className="relative -mt-8 pb-24">

            <div className="max-w-5xl mx-auto">

                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">

                    <h2 className="text-3xl font-bold text-center text-gray-900">
                        Start Your AI Interview
                    </h2>

                    <p className="text-center text-gray-500 mt-3">
                        Upload your resume and let PrepWise generate a personalized interview.
                    </p>

                    {/* Upload Box */}
                    <label className="mt-10 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl h-72 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition">

                        <Upload size={56} className="text-blue-600" />

                        <h3 className="mt-6 text-2xl font-semibold">
                            Drag & Drop Resume
                        </h3>

                        <p className="text-gray-500 mt-2">or click to browse PDF</p>

                        <p className="text-sm text-gray-400 mt-2">PDF • Max 5 MB</p>

                        <input
                            hidden
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                            }}
                        />

                    </label>

                    {/* Selected file */}
                    {file && !uploaded && (
                        <div className="mt-6 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <FileText className="text-blue-600" />
                            <span className="font-medium text-blue-800">{file.name}</span>
                        </div>
                    )}

                    {/* Upload success */}
                    {uploaded && (
                        <div className="mt-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                            <CheckCircle className="text-green-600" />
                            <span className="font-medium text-green-800">
                                {file.name} — uploaded successfully
                            </span>
                        </div>
                    )}

                    {/* Upload error */}
                    {uploadError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 font-medium">{uploadError}</p>
                        </div>
                    )}

                    {/* Role selector */}
                    <div className="mt-8">
                        <label className="font-semibold text-gray-700">Target Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>Software Engineer</option>
                            <option>Frontend Developer</option>
                            <option>Backend Developer</option>
                            <option>Full Stack Developer</option>
                        </select>
                    </div>

                    {/* Start error */}
                    {startError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 font-medium">{startError}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-5 mt-10">

                        <button
                            onClick={uploadResume}
                            disabled={uploading || !file}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl hover:bg-black disabled:bg-gray-400 transition font-semibold"
                        >
                            {uploading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : uploaded ? (
                                <>
                                    <CheckCircle size={18} />
                                    Uploaded
                                </>
                            ) : (
                                "Upload Resume"
                            )}
                        </button>

                        <button
                            onClick={startInterview}
                            disabled={starting || !uploaded}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
                        >
                            {starting ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                "Start AI Interview"
                            )}
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default UploadCard;
