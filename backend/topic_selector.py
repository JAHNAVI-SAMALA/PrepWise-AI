import json

from backend.watsonx_client import ask_llm


def choose_next_topic(state):

    if not state.remaining_topics:
        return None

    prompt = f"""
You are an interview planner.

Resume Skills:
{state.profile["skills"]}

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

    response = response.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(response)
        return result
    except json.JSONDecodeError:
        # LLM returned malformed JSON — fall back to the first remaining topic
        return None