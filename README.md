# PrepWise AI

An AI-powered mock interview platform. Upload your resume, pick a role, and get a personalised interview with real-time question generation, answer evaluation, and a full performance report — all powered by IBM WatsonX.

---

## Features

- **Resume Analysis** — Parses your PDF resume and extracts skills, experience, and key topics
- **AI Interview Planning** — Builds a structured interview plan tailored to your resume and target role
- **Dynamic Question Generation** — Questions adapt in difficulty based on your answers
- **Answer Evaluation** — Each answer is scored against expected key points
- **Follow-up Questions** — The AI drills deeper when an answer is incomplete
- **Performance Report** — A detailed breakdown of scores, strengths, and areas to improve
- **Voice Input** — Speak your answers using the browser's speech recognition

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Python 3.11, Flask, Gunicorn |
| AI / LLM | IBM WatsonX — `meta-llama/llama-3-3-70b-instruct` |
| PDF Parsing | PyMuPDF (fitz) |
| Deployment | Docker, Render (or IBM Code Engine) |

---

## Project Structure

```
PrepWise AI/
├── backend/
│   ├── app.py                # Flask API — all routes
│   ├── watsonx_client.py     # IBM WatsonX API client
│   ├── interview_agent.py    # Orchestrates the full interview flow
│   ├── interview_engine.py   # Core interview loop logic
│   ├── interview_planner.py  # Builds the topic/question plan from resume
│   ├── interview_generator.py# Generates questions via LLM
│   ├── interview_decision.py # Decides next action (next Q / follow-up / end)
│   ├── answer_evaluator.py   # Scores answers against expected points
│   ├── followup_generator.py # Generates follow-up questions
│   ├── report_generator.py   # Produces the final performance report
│   ├── resume_analyzer.py    # Extracts profile from resume text
│   ├── resume_parser.py      # PDF → plain text (PyMuPDF)
│   ├── topic_selector.py     # Picks the next topic from the plan
│   ├── rule_engine.py        # Difficulty adjustment rules
│   ├── interview_state.py    # Shared state object across the session
│   ├── json_utils.py         # Safe JSON extraction from LLM responses
│   ├── logger.py             # Structured logging
│   └── prompts.py            # All LLM prompt templates
├── frontend/
│   ├── src/
│   │   ├── pages/            # Home, Interview, Report
│   │   ├── components/       # Navbar, Hero, UploadCard, etc.
│   │   ├── hooks/            # useSpeech (voice input)
│   │   └── services/api.js   # Axios client with session header
│   ├── index.html
│   └── vite.config.js        # Dev proxy → Flask :5000
├── Dockerfile                # Multi-stage build (Node → Python)
├── requirements.txt          # Python dependencies
└── DEPLOY.md                 # Deployment guide (Render + IBM Code Engine)
```

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- An IBM WatsonX account with an API key and project ID

### 1. Clone the repo

```bash
git clone https://github.com/your-username/prepwise-ai.git
cd prepwise-ai
```

### 2. Set up the backend

```bash
# Create and activate a virtual environment
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Create a `.env` file in the project root

```env
WATSONX_API_KEY=your_ibm_api_key_here
PROJECT_ID=your_watsonx_project_id_here
MODEL_ID=meta-llama/llama-3-3-70b-instruct
```

### 4. Run the backend

```bash
python -m flask --app backend.app run --debug
```

Flask will start on `http://localhost:5000`.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will start on `http://localhost:5173` and proxy API calls to Flask automatically.

---

## Deployment on Render

1. Push the repo to GitHub (`.env` must **not** be committed)
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo
3. Set **Environment** to **Docker**
4. Add these environment variables in Render's dashboard:

   | Key | Value |
   |---|---|
   | `WATSONX_API_KEY` | your IBM Cloud API key |
   | `PROJECT_ID` | your WatsonX project ID |
   | `MODEL_ID` | `meta-llama/llama-3-3-70b-instruct` |

5. Click **Deploy** — Render builds the Docker image and serves the app.

> See [`DEPLOY.md`](DEPLOY.md) for the full guide including IBM Code Engine deployment.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/upload_resume` | Upload a PDF resume, returns profile |
| `POST` | `/start_interview` | Start a new interview session |
| `GET` | `/next_question` | Get the next question |
| `POST` | `/submit_answer` | Submit an answer, returns evaluation |
| `GET` | `/report` | Get the full performance report |

All routes use the `X-Session-ID` header to identify the user's session.

---

## Environment Variables

| Variable | Description |
|---|---|
| `WATSONX_API_KEY` | IBM Cloud API key used to authenticate with WatsonX |
| `PROJECT_ID` | WatsonX project ID that hosts the model |
| `MODEL_ID` | Model to use (default: `meta-llama/llama-3-3-70b-instruct`) |

---

## License

MIT
