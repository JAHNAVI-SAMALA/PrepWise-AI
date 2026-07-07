import json
from backend.watsonx_client import ask_llm
from backend.json_utils import parse_llm_json

def evaluate_answer(question, expected_points, candidate_answer):

    prompt = f"""
You are an expert technical interviewer.

Interview Question:
{question}

Expected Answer Points:
{expected_points}

Candidate Answer:
{candidate_answer}

Evaluate the answer.

Return ONLY valid JSON. No markdown. No explanation.

{{
    "technical_score": 0,
    "communication_score": 0,
    "confidence_score": 0,
    "overall_score": 0,
    "strengths": [],
    "weaknesses": [],
    "feedback": "",
    "follow_up_required": true,
    "recommended_next_topic": ""
}}

Scoring Rules:
- Scores should be between 0 and 10.
- Give constructive feedback.
- If the answer is weak, set follow_up_required to true.
"""

    last_error = None
    for attempt in range(3):
        try:
            response = ask_llm(prompt)
            result = parse_llm_json(response)
            if result and result.get("overall_score") is not None:
                return result
            print(f"[evaluate_answer] Invalid result on attempt {attempt + 1}, retrying...")
        except Exception as e:
            last_error = e
            print(f"[evaluate_answer] Attempt {attempt + 1} failed: {e}")

    raise ValueError(f"evaluate_answer failed after 3 attempts. Last error: {last_error}")

if __name__ == "__main__":

    result = evaluate_answer(
        question="What is the difference between a Python list and tuple?",
        expected_points=[
            "Mutability",
            "Performance",
            "Use cases"
        ],
        candidate_answer="""
Lists are mutable while tuples are immutable.
Lists are generally used when data changes frequently,
whereas tuples are used for fixed collections.
Tuples are slightly faster and consume less memory.
"""
    )

    print(json.dumps(result, indent=4))