class InterviewState:

    def __init__(self, profile, plan):

        self.profile = profile
        self.plan = plan

        self.remaining_topics = plan["topics"].copy()

        self.current_topic = None

        self.current_difficulty = plan["difficulty"]

        self.history = []

        self.strengths = []
        self.weaknesses = []

        self.total_score = 0
        self.questions_answered = 0

        self.statistics = {
            "technical": [],
            "communication": [],
            "confidence": [],
            "overall": []
        }
        self.follow_up_mode = False
        self.follow_up_count = 0

    def add_result(self, question, answer, evaluation):

        self.history.append({
            "topic": self.current_topic["topic"],
            "question": question,
            "answer": answer,
            "evaluation": evaluation
        })

        self.total_score += evaluation.get("overall_score", 0)
        self.questions_answered += 1

        self.statistics["technical"].append(
            evaluation.get("technical_score", 0)
        )

        self.statistics["communication"].append(
            evaluation.get("communication_score", 0)
        )

        self.statistics["confidence"].append(
            evaluation.get("confidence_score", 0)
        )

        self.statistics["overall"].append(
            evaluation.get("overall_score", 0)
        )

        self.strengths.extend(
            evaluation.get("strengths", [])
        )

        self.weaknesses.extend(
            evaluation.get("weaknesses", [])
        )

    @property
    def average_score(self):

        if self.questions_answered == 0:
            return 0

        return round(
            self.total_score /
            self.questions_answered,
            2
        )