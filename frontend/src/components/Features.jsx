import FeatureCard from "./FeatureCard";
import { Brain, BarChart3, Target } from "lucide-react";

function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50">

            <div className="max-w-7xl mx-auto px-8">

                <div className="text-center">

                    <h2 className="text-5xl font-bold">
                        Why PrepWise AI?
                    </h2>

                    <p className="mt-5 text-xl text-gray-600">
                        Everything you need to crack your next technical interview.
                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">

                    <FeatureCard
                        icon={<Brain size={34} />}
                        title="Adaptive AI Questions"
                        description="Questions are generated based on your resume, skills, and target role for a realistic interview experience."
                    />

                    <FeatureCard
                        icon={<BarChart3 size={34} />}
                        title="Smart Evaluation"
                        description="Receive detailed scores for technical knowledge, communication, confidence, and problem-solving."
                    />

                    <FeatureCard
                        icon={<Target size={34} />}
                        title="Personalized Learning"
                        description="Get actionable feedback and a learning roadmap to improve your interview performance."
                    />

                </div>

            </div>

        </section>
    );
}

export default Features;