from statistics import mean
from backend.watsonx_client import ask_llm
from backend.logger import logger
import json


class ReportGenerator:

    def __init__(self, state):
        self.state = state

    def generate(self):

        stats = self.state.statistics

        report = {
            "candidate": self.state.profile.get("name", "Unknown"),
            "role": self.state.plan["role"],

            "technical_score": round(mean(stats["technical"]), 2) if stats["technical"] else 0,

            "communication_score": round(mean(stats["communication"]), 2) if stats["communication"] else 0,

            "confidence_score": round(mean(stats["confidence"]), 2) if stats["confidence"] else 0,

            "overall_score": round(mean(stats["overall"]), 2) if stats["overall"] else 0,

            "topics": self._topic_summary(),

            "strengths": self._top_strengths(),

            "weaknesses": self._top_weaknesses(),

            "recommendation": self._recommendation(),

            "learning_path": self._learning_path(),

            "summary": self._ai_summary()
        }

        return report
    
    def _topic_summary(self):

        summary = {}

        for item in self.state.history:

            topic = item["topic"]

            score = item["evaluation"]["overall_score"]

            summary.setdefault(topic, []).append(score)

        return {
            topic: round(mean(scores), 2)
            for topic, scores in summary.items()
        }
    
    def _top_strengths(self):

        strengths = {}

        for s in self.state.strengths:
            strengths[s] = strengths.get(s, 0) + 1

        return sorted(
            strengths,
            key=strengths.get,
            reverse=True
        )[:5]
    
    def _top_weaknesses(self):

        weaknesses = {}

        for w in self.state.weaknesses:
            weaknesses[w] = weaknesses.get(w, 0) + 1

        return sorted(
            weaknesses,
            key=weaknesses.get,
            reverse=True
        )[:5]
    
    def _recommendation(self):

        score = self.state.average_score

        if score >= 8.5:
            return "Highly Recommended"

        if score >= 7:
            return "Recommended"

        if score >= 5:
            return "Recommended with Upskilling"

        return "Needs Improvement"
    
    def _learning_path(self):

        mapping = {
            "Data Structures": "Practice LeetCode Medium problems",
            "Algorithms": "Study graph and dynamic programming problems",
            "Communication": "Practice mock interviews",
            "SQL": "Learn query optimization",
            "System Design": "Study scalable backend architectures",
        }

        learning = []

        for weakness in self._top_weaknesses():

            for key in mapping:

                if key.lower() in weakness.lower():
                    learning.append(mapping[key])

        return list(dict.fromkeys(learning))
    
    def _ai_summary(self):

        prompt = f"""
Write a professional interview feedback summary in plain text.

Overall Score: {self.state.average_score}
Strengths: {self._top_strengths()}
Weaknesses: {self._top_weaknesses()}

Keep it under 150 words. Do not use markdown, bullet points, or headers.
"""

        text = ask_llm(prompt)
        # Strip any markdown the LLM may add anyway
        return (
            text.replace("**", "")
                .replace("##", "")
                .replace("# ", "")
                .strip()
        )
    
if __name__ == "__main__":

    from backend.interview_agent import InterviewAgent

    agent = InterviewAgent(
        "uploads/resume.pdf",
        "Software Engineer"
    )

    while not agent.is_finished():

        question = agent.get_next_question()

        if question is None:
            break

        print("\nQUESTION")
        print(question["question"])

        print("\nAnswer (type END on a new line):")

        lines = []

        while True:
            line = input()

            if line.strip().upper() == "END":
                break

            lines.append(line)

        answer = "\n".join(lines)

        agent.submit_answer(answer)

    generator = ReportGenerator(agent.state)

    report = generator.generate()
    logger.info("Generating interview report...")
    print("\n===== FINAL REPORT =====")
    print(json.dumps(report, indent=4))