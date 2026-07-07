import json
import re


def parse_llm_json(response):

    if not response:
        raise ValueError("Empty response from LLM")

    # Strip markdown fences
    response = (
        response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    print("\n===== RAW LLM RESPONSE =====")
    print(response)
    print("============================\n")

    # First attempt: direct parse
    data = _try_parse(response)

    # Second attempt: extract first {...} block if direct parse failed
    if data is None:
        match = re.search(r"\{.*\}", response, re.DOTALL)
        if match:
            data = _try_parse(match.group())

    if data is None:
        raise ValueError(f"Could not parse LLM response as JSON: {response[:200]}")

    # Unwrap one level deep: { "question": { "question": "...", ... } }
    if (
        isinstance(data, dict)
        and "question" in data
        and isinstance(data["question"], dict)
        and "expected_answer_points" in data["question"]
    ):
        data = data["question"]

    # Fallback alternate question keys
    if isinstance(data, dict) and not data.get("question"):
        for key in ("interview_question", "text", "q"):
            if data.get(key):
                data["question"] = data[key]
                break

    return data


def _try_parse(text):
    try:
        return json.loads(text)
    except (json.JSONDecodeError, ValueError):
        return None