from backend.resume_parser import extract_resume_text
from backend.watsonx_client import ask_llm
from backend.json_utils import parse_llm_json


def analyze_resume(pdf_path):
    resume_text = extract_resume_text(pdf_path)

    prompt = f"""
You are an expert technical recruiter.

Analyze the following resume.

Return ONLY valid JSON. No markdown. No explanation.

{{
    "name": "",
    "email": "",
    "phone": "",
    "education": "",
    "skills": [],
    "projects": [],
    "certifications": [],
    "experience_level": "",
    "strengths": [],
    "recommended_topics": []
}}

Resume:

{resume_text}
"""

    last_error = None
    for attempt in range(3):
        try:
            response = ask_llm(prompt)
            result = parse_llm_json(response)
            if result and result.get("name") is not None:
                return result
            print(f"[analyze_resume] Invalid result on attempt {attempt + 1}, retrying...")
        except Exception as e:
            last_error = e
            print(f"[analyze_resume] Attempt {attempt + 1} failed: {e}")

    raise ValueError(f"analyze_resume failed after 3 attempts. Last error: {last_error}")


if __name__ == "__main__":
    import json
    result = analyze_resume("uploads/resume.pdf")
    print(json.dumps(result, indent=4))