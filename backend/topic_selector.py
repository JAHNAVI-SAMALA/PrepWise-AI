import json

from backend.watsonx_client import ask_llm
from backend.json_utils import parse_llm_json


def choose_next_topic(state):

    if not state.remaining_topics:
        return None

    prompt = f"""
You are an interview planner.

Resume Skills:
{", ".join(state.profile.get("skills", []))}


Strengths:
{state.strengths}

Weaknesses:
{state.weaknesses}

Average Score:
{state.average_score}

Remaining Topics:
{json.dumps(state.remaining_topics, indent=2)}

Choose exactly ONE topic.

Return JSON only.

{{
    "topic":""
}}
"""

    response = ask_llm(prompt)

    try:
        result = parse_llm_json(response)
        return result
    except Exception:
        # LLM returned malformed JSON — fall back to the first remaining topic
        return None