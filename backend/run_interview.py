from backend.interview_agent import InterviewAgent
from backend.report_generator import ReportGenerator

import json
import os


agent = InterviewAgent(
    "uploads/resume.pdf",
    "Software Engineer"
)

while not agent.is_finished():

    question = agent.get_next_question()

    if question is None:
        break

    print("\n")
    print("=" * 60)
    print("TOPIC:", agent.state.current_topic["topic"])
    print("DIFFICULTY:", agent.state.current_difficulty)
    print("=" * 60)

    print(question["question"])

    answer = input("\nYour Answer:\n")

    result = agent.submit_answer(answer)

    print("\nOverall Score:",
          result["average_score"])


report = ReportGenerator(agent.state).generate()

os.makedirs("reports", exist_ok=True)

with open(
    "reports/interview_report.json",
    "w",
    encoding="utf-8"
) as f:

    json.dump(report, f, indent=4)

print("\nInterview Finished!")

print("\nReport saved to reports/interview_report.json")