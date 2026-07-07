import json
from backend.json_utils import parse_llm_json
from backend.watsonx_client import ask_llm
from backend.logger import logger

def create_interview_plan(profile, role="Software Engineer"):

    prompt = f"""
You are an expert technical interviewer.

Candidate:
Name: {profile.get("name", "")}

Role:
{role}

Skills:
{", ".join(profile.get("skills", []))}

Projects:
{", ".join(profile.get("projects", []))}

Experience:
{profile.get("experience_level", "")}

Create a 60-minute interview roadmap.

Return ONLY valid JSON.

{{
  "role":"",
  "difficulty":"Easy|Medium|Hard",
  "estimated_duration":"",
  "topics":[
    {{
      "topic":"",
      "questions":0,
      "reason":""
    }}
  ]
}}

Requirements:
- Choose exactly 6 topics.
- Include Introduction and Background.
- Include Programming Fundamentals.
- Include Data Structures and Algorithms.
- Include Projects.
- Include Behavioral.
- Include HR.
- Total questions should be around 10.
"""


    logger.info("Generating interview plan...")

    response = ask_llm(prompt)

    logger.info("Interview plan received.")
    return parse_llm_json(response)

if __name__ == "__main__":

    from backend.resume_analyzer import analyze_resume

    profile = analyze_resume("uploads/resume.pdf")

    plan = create_interview_plan(
        profile,
        "Software Engineer"
    )

    print(json.dumps(plan, indent=4))