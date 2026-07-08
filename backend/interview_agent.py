from backend.resume_analyzer import analyze_resume
from backend.interview_planner import create_interview_plan
from backend.interview_generator import generate_question
from backend.answer_evaluator import evaluate_answer
from backend.interview_state import InterviewState
from backend.interview_decision import decide_next_step
from backend.topic_selector import choose_next_topic
from backend.followup_generator import generate_followup
from backend.logger import logger


class InterviewAgent:

    def __init__(self, resume_path, role):

        profile = analyze_resume(resume_path)
        plan = create_interview_plan(profile, role)

        self.state = InterviewState(profile, plan)
        self.current_question = None

    def get_next_question(self):

        # If there is already an active question that hasn't been answered, return it
        if self.current_question is not None:
            return self.current_question

        # ---------- FOLLOW-UP ----------
        if self.state.follow_up_mode:

            last = self.state.history[-1]

            question = generate_followup(
                last["question"]["question"],
                last["answer"],
                last["evaluation"]
            )

            self.current_question = question
            self.state.follow_up_mode = False

            return question

        # ---------- INTERVIEW FINISHED ----------
        if not self.state.remaining_topics:
            return None

        # ---------- SELECT NEXT TOPIC ----------
        selected = choose_next_topic(self.state)

        if selected is None:

            topic = self.state.remaining_topics.pop(0)

        else:

            topic_name = selected["topic"]

            topic = None

            for t in self.state.remaining_topics:

                if t["topic"] == topic_name:
                    topic = t
                    break

            if topic is None:
                topic = self.state.remaining_topics[0]

            self.state.remaining_topics.remove(topic)

        # Reset follow-up counter for new topic
        self.state.follow_up_count = 0

        self.state.current_topic = topic

        question = generate_question(
            topic=topic["topic"],
            difficulty=self.state.current_difficulty,
            history=self.state.history
        )

        self.current_question = question

        return question

    def submit_answer(self, answer):

        if self.current_question is None:
            raise ValueError("No active question. Call get_next_question() first.")

        evaluation = evaluate_answer(
            self.current_question["question"],
            self.current_question.get("expected_answer_points", []),
            answer
        )

        self.state.add_result(
            self.current_question,
            answer,
            evaluation
        )

        decision = decide_next_step(
            self.state,
            evaluation
        )

        print("\n===== DECISION =====")
        logger.info("Decision: %s", decision["action"])
        print("====================")

        action = decision["action"]

        # ---------- ADAPTIVE DIFFICULTY ----------
        levels = ["Easy", "Medium", "Hard"]
        current = levels.index(self.state.current_difficulty)

        if action == "INCREASE_DIFFICULTY":

            if current < 2:
                self.state.current_difficulty = levels[current + 1]

        elif action == "DECREASE_DIFFICULTY":

            if current > 0:
                self.state.current_difficulty = levels[current - 1]

        # ---------- FOLLOW-UP ----------
        elif action == "FOLLOW_UP":

            if self.state.follow_up_count < 1:

                self.state.follow_up_mode = True
                self.state.follow_up_count += 1

            else:

                # Already asked one follow-up.
                # Move to next topic.
                self.state.follow_up_mode = False
                self.state.follow_up_count = 0

        # ---------- END ----------
        elif action == "END_INTERVIEW":

            self.state.remaining_topics = []
            self.state.current_topic = None

        # Clear the current question to prevent double submission
        self.current_question = None

        return {
            "evaluation": evaluation,
            "decision": decision,
            "average_score": self.state.average_score
        }

    def is_finished(self):

        return (
            len(self.state.remaining_topics) == 0
            and not self.state.follow_up_mode
        )


if __name__ == "__main__":

    agent = InterviewAgent(
        "uploads/resume.pdf",
        "Software Engineer"
    )

    while not agent.is_finished():

        question = agent.get_next_question()

        if question is None:
            break

        print("\n" + "=" * 60)
        print("TOPIC:", agent.state.current_topic["topic"])
        print("DIFFICULTY:", agent.state.current_difficulty)
        print("=" * 60)

        print("\nQuestion:")
        print(question["question"])

        print("\nYour Answer (type END on a new line to finish):")

        lines = []

        while True:

            line = input()

            if line.strip().upper() == "END":
                break

            lines.append(line)

        answer = "\n".join(lines)

        result = agent.submit_answer(answer)

        print("\nEvaluation")
        print(result["evaluation"])

        print("\nDecision")
        print(result["decision"])

        print("\nAverage Score:", result["average_score"])

    print("\nInterview Completed!")