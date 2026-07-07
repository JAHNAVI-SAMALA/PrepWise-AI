import {
    CircleCheck,
    Brain,
    MessageSquare,
    TrendingUp
} from "lucide-react";

function DashboardPreview() {

    return (

        <section className="py-24 bg-white">

            <div className="max-w-7xl mx-auto px-8">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}

                    <div>

                        <span className="text-blue-600 font-semibold">
                            LIVE PREVIEW
                        </span>

                        <h2 className="text-5xl font-bold mt-4 leading-tight">

                            Experience a Real AI Interview

                        </h2>

                        <p className="mt-8 text-xl text-gray-600 leading-9">

                            Every interview adapts to your resume,
                            evaluates your answers instantly,
                            and provides professional feedback.

                        </p>

                        <div className="space-y-6 mt-10">

                            <div className="flex items-center gap-4">

                                <CircleCheck className="text-green-500"/>

                                Resume-based Questions

                            </div>

                            <div className="flex items-center gap-4">

                                <CircleCheck className="text-green-500"/>

                                Instant AI Evaluation

                            </div>

                            <div className="flex items-center gap-4">

                                <CircleCheck className="text-green-500"/>

                                Personalized Learning Path

                            </div>

                        </div>

                    </div>

                    {/* Right Dashboard */}

                    <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 text-white">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-400">

                                    Question

                                </p>

                                <h3 className="text-3xl font-bold">

                                    4 / 10

                                </h3>

                            </div>

                            <div className="text-right">

                                <p className="text-gray-400">

                                    Overall Score

                                </p>

                                <h2 className="text-5xl font-bold text-green-400">

                                    8.8

                                </h2>

                            </div>

                        </div>

                        <div className="mt-10">

                            <div className="bg-slate-800 rounded-xl p-5">

                                <p className="text-gray-400 mb-2">

                                    Current Question

                                </p>

                                <h4 className="text-xl">

                                    Explain the difference between
                                    HashMap and ConcurrentHashMap.

                                </h4>

                            </div>

                        </div>

                        <div className="space-y-6 mt-10">

                            <ScoreBar
                                icon={<Brain size={20}/>}
                                title="Technical"
                                value={90}
                            />

                            <ScoreBar
                                icon={<MessageSquare size={20}/>}
                                title="Communication"
                                value={82}
                            />

                            <ScoreBar
                                icon={<TrendingUp size={20}/>}
                                title="Confidence"
                                value={87}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
}

function ScoreBar({icon,title,value}){

    return(

        <div>

            <div className="flex justify-between mb-2">

                <div className="flex gap-2 items-center">

                    {icon}

                    {title}

                </div>

                <span>{value}%</span>

            </div>

            <div className="bg-slate-700 h-3 rounded-full">

                <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{width:`${value}%`}}
                />

            </div>

        </div>

    );

}

export default DashboardPreview;