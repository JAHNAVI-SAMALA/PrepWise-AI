import json
from backend.json_utils import parse_llm_json
from backend.watsonx_client import ask_llm

def generate_followup(question, answer, evaluation):

    prompt = f"""
You are an interviewer.

Original Question:
{question}

Candidate Answer:
{answer}

Weaknesses:
{evaluation["weaknesses"]}

Ask ONE follow-up question to help evaluate the missing concepts.

Return ONLY valid JSON. No explanation. No markdown.

{{
    "question":"",
    "difficulty":"Medium",
    "expected_answer_points":[]
}}
"""

    last_error = None
    for attempt in range(3):
        try:
            response = ask_llm(prompt)
            result = parse_llm_json(response)
            if result and result.get("question", "").strip():
                return result
            print(f"[generate_followup] Empty question on attempt {attempt + 1}, retrying...")
        except Exception as e:
            last_error = e
            print(f"[generate_followup] Attempt {attempt + 1} failed: {e}")

    raise ValueError(f"generate_followup failed after 3 attempts. Last error: {last_error}")