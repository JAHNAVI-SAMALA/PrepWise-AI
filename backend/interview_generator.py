import json

from backend.watsonx_client import ask_llm
from backend.json_utils import parse_llm_json

def generate_question(topic, difficulty, history=None):

    if history is None:
        history = []

    prompt = f"""
You are an experienced technical interviewer.

Topic:
{topic}

Difficulty:
{difficulty}

Previous Questions:
{json.dumps(history, indent=2)}

Generate ONE interview question.

Return ONLY valid JSON. No explanation. No markdown.

{{
    "question":"",
    "difficulty":"",
    "expected_answer_points":[""]
}}

Rules:
- Don't repeat previous questions.
- Make it suitable for a Software Engineer.
- If topic is Projects, ask about implementation.
- If topic is Behavioral, ask situational questions.
- If topic is HR, ask career-oriented questions.
"""

    last_error = None
    for attempt in range(3):
        try:
            response = ask_llm(prompt)
            result = parse_llm_json(response)
            if result and result.get("question", "").strip():
                return result
            print(f"[generate_question] Empty question on attempt {attempt + 1}, retrying...")
        except Exception as e:
            last_error = e
            print(f"[generate_question] Attempt {attempt + 1} failed: {e}")

    raise ValueError(f"generate_question failed after 3 attempts. Last error: {last_error}")

if __name__ == "__main__":

    question = generate_question(
        topic="Programming Fundamentals",
        difficulty="Medium"
    )

    print(json.dumps(question, indent=4))