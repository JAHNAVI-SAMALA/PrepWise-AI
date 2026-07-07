from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid

from backend.resume_analyzer import analyze_resume
from backend.interview_agent import InterviewAgent
from backend.report_generator import ReportGenerator

app = Flask(__name__, static_folder="frontend/dist", static_url_path="")
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# session_id -> { "agent": InterviewAgent, "resume_path": str }
sessions = {}


def get_session_id():
    """Read session ID from X-Session-ID header, or create a new one."""
    sid = request.headers.get("X-Session-ID")
    if not sid:
        sid = str(uuid.uuid4())
    return sid


@app.get("/health")
def health():
    return jsonify({"message": "PrepWise AI Backend Running"})


# Serve React frontend for all non-API routes
@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def serve_frontend(path):
    # API routes are handled above — this catches everything else
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


@app.post("/upload_resume")
def upload_resume():

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    sid = get_session_id()
    sessions.setdefault(sid, {})["resume_path"] = filepath

    try:
        profile = analyze_resume(filepath)
    except Exception as e:
        print(f"[upload_resume] analyze_resume failed: {e}")
        return jsonify({"error": "Failed to analyze resume. Please try again."}), 500

    return jsonify({
        "message": "Resume uploaded successfully",
        "session_id": sid,
        "resume_path": filepath,
        "profile": profile
    })


@app.post("/start_interview")
def start_interview():

    sid = get_session_id()
    data_store = sessions.get(sid, {})
    resume_path = data_store.get("resume_path")

    if resume_path is None:
        return jsonify({"error": "Please upload a resume first."}), 400

    data = request.get_json()
    role = data.get("role", "Software Engineer")

    agent = InterviewAgent(resume_path, role)
    sessions[sid]["agent"] = agent

    total_questions = sum(
        t.get("questions", 1)
        for t in agent.state.plan.get("topics", [])
    )

    return jsonify({
        "message": "Interview started successfully.",
        "role": role,
        "total_questions": total_questions
    })


@app.get("/next_question")
def next_question():

    sid = get_session_id()
    agent = sessions.get(sid, {}).get("agent")

    if agent is None:
        return jsonify({"error": "Interview has not been started."}), 400

    try:
        question = agent.get_next_question()

        if question is None:
            return jsonify({"message": "Interview completed."})

        question_text = (question.get("question") or "").strip()
        expected_points = question.get("expected_answer_points") or []

        if not question_text:
            return jsonify({"error": "LLM returned an empty question."}), 500

        return jsonify({
            "topic": agent.state.current_topic["topic"],
            "difficulty": agent.state.current_difficulty,
            "question": question_text,
            "expected_answer_points": expected_points
        })

    except Exception as e:
        print(f"[next_question] Error: {e}")
        return jsonify({"error": f"Failed to generate question: {str(e)}"}), 500


@app.post("/submit_answer")
def submit_answer():

    sid = get_session_id()
    agent = sessions.get(sid, {}).get("agent")

    if agent is None:
        return jsonify({"error": "Interview has not been started."}), 400

    data = request.get_json()
    answer = data.get("answer", "").strip()

    if answer == "":
        return jsonify({"error": "Answer cannot be empty."}), 400

    result = agent.submit_answer(answer)
    return jsonify(result)


@app.get("/report")
def report():

    sid = get_session_id()
    agent = sessions.get(sid, {}).get("agent")

    if agent is None:
        return jsonify({"error": "Interview has not been started."}), 400

    result = ReportGenerator(agent.state).generate()
    return jsonify(result)

@app.route("/<path:path>")
def serve_static(path):
    file_path = f"frontend/dist/{path}"
    try:
        return send_from_directory("frontend/dist", path)
    except:
        return send_from_directory("frontend/dist", "index.html")
if __name__ == "__main__":
    app.run(debug=True)