import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function Hero() {
    return (
        <section className="relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100"></div>

            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20"></div>

            <div className="relative max-w-7xl mx-auto px-8 py-24">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center"
                >

                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium mb-8">

                        <Sparkles size={18} />

                        AI Powered Technical Interview Platform

                    </div>

                    <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">

                        Ace Your

                        <br />

                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">

                            Technical Interviews

                        </span>

                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8 leading-9">

                        Upload your resume, experience adaptive AI interviews,
                        receive detailed technical feedback, and improve with
                        personalized learning recommendations.

                    </p>

                    <div className="mt-10 flex justify-center gap-6">

                        <button
                            onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-xl flex items-center gap-3 transition"
                        >
                            Start Interview
                            <ArrowRight size={20} />
                        </button>

                        <button
                            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                            className="border border-gray-300 bg-white hover:bg-gray-100 px-8 py-4 rounded-xl transition"
                        >
                            Learn More
                        </button>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}

export default Hero;