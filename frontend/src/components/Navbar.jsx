import { BrainCircuit } from "lucide-react";

function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                        <BrainCircuit className="text-white" size={28} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            PrepWise AI
                        </h1>

                        <p className="text-sm text-gray-500">
                            Powered by IBM watsonx
                        </p>
                    </div>

                </div>

                <div className="hidden md:flex items-center gap-8">

                    <a
                        href="#features"
                        className="text-gray-600 hover:text-blue-600 transition"
                    >
                        Features
                    </a>

                    <a
                        href="#about"
                        className="text-gray-600 hover:text-blue-600 transition"
                    >
                        About
                    </a>

                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg">
                        Get Started
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;