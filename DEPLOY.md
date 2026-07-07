# PrepWise AI — Deployment Guide

---

## Option A — Render (Recommended, free tier available)

### Architecture
Single Docker container deployed on **Render**.
Flask (via Gunicorn) serves both the API and the built React frontend.

### Steps

1. **Push your code to GitHub** (make sure `.env` is in `.gitignore`).

2. **Create a new Web Service on [render.com](https://render.com)**:
   - Connect your GitHub repo
   - Environment: **Docker**
   - Branch: `main`

3. **Set environment variables** in Render dashboard → *Environment*:

   | Key | Value |
   |---|---|
   | `WATSONX_API_KEY` | your IBM Cloud API key |
   | `PROJECT_ID` | your WatsonX project ID |
   | `MODEL_ID` | `meta-llama/llama-3-3-70b-instruct` |

4. Click **Deploy** — Render builds the Docker image and starts the app.

5. Your live URL will be: `https://prepwise-ai.onrender.com` (or similar).

> **Note:** Free tier instances spin down after inactivity. Upgrade to a paid plan for always-on availability.

---

## Option B — IBM Code Engine

## Architecture
Single container deployed on **IBM Code Engine**.
Flask serves both the API and the built React frontend.

---

## Prerequisites

1. IBM Cloud account — [cloud.ibm.com](https://cloud.ibm.com)
2. IBM Cloud CLI installed — [ibm.com/cloud/cli](https://www.ibm.com/cloud/cli)
3. Docker Desktop installed and running
4. IBM Container Registry (ICR) access

---

## Step 1 — Install IBM Cloud CLI plugins

```bash
ibmcloud plugin install code-engine
ibmcloud plugin install container-registry
```

---

## Step 2 — Login to IBM Cloud

```bash
ibmcloud login
ibmcloud cr login
```

Select your region when prompted (e.g. `eu-gb` for London).

---

## Step 3 — Create a Container Registry namespace

```bash
ibmcloud cr namespace-add prepwise-ai
```

---

## Step 4 — Build and push the Docker image

```bash
# From the project root (c:\Desktop\PrepWise AI)

# Build the image
docker build -t prepwise-ai .

# Tag it for IBM Container Registry
docker tag prepwise-ai uk.icr.io/prepwise-ai/prepwise-ai:latest

# Push to IBM Container Registry
docker push uk.icr.io/prepwise-ai/prepwise-ai:latest
```

> Note: Replace `uk.icr.io` with your region's registry:
> - `us.icr.io` for us-south
> - `de.icr.io` for eu-de
> - `uk.icr.io` for eu-gb ← your WatsonX region

---

## Step 5 — Create a Code Engine project

```bash
ibmcloud ce project create --name prepwise-ai
ibmcloud ce project select --name prepwise-ai
```

---

## Step 6 — Create a registry secret (so Code Engine can pull your image)

```bash
ibmcloud ce secret create-registry \
  --name icr-secret \
  --server uk.icr.io \
  --username iamapikey \
  --password YOUR_IBM_API_KEY
```

Replace `YOUR_IBM_API_KEY` with your IBM Cloud API key.

---

## Step 7 — Deploy the app

```bash
ibmcloud ce app create \
  --name prepwise-ai \
  --image uk.icr.io/prepwise-ai/prepwise-ai:latest \
  --registry-secret icr-secret \
  --port 8080 \
  --cpu 1 \
  --memory 4G \
  --min-scale 0 \
  --max-scale 3 \
  --env WATSONX_API_KEY=your_watsonx_api_key \
  --env PROJECT_ID=your_project_id \
  --env MODEL_ID=meta-llama/llama-3-3-70b-instruct
```

Replace the `--env` values with your actual credentials from `.env`.

---

## Step 8 — Get your live URL

```bash
ibmcloud ce app get --name prepwise-ai
```

Look for the **URL** field — it will be something like:
```
https://prepwise-ai.xxxxxxxxx.eu-gb.codeengine.appdomain.cloud
```

That's your live app! Open it in the browser.

---

## Updating the app after code changes

```bash
# Rebuild and push
docker build -t prepwise-ai .
docker tag prepwise-ai uk.icr.io/prepwise-ai/prepwise-ai:latest
docker push uk.icr.io/prepwise-ai/prepwise-ai:latest

# Redeploy
ibmcloud ce app update --name prepwise-ai --image uk.icr.io/prepwise-ai/prepwise-ai:latest
```

---

## Local development (unchanged)

**Terminal 1 — Backend:**
```powershell
.\venv\Scripts\Activate.ps1
python -m flask --app backend.app run --debug
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`, API calls are proxied to `http://localhost:5000`.

---

## What each file does

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build — Node builds React, Python serves both |
| `.dockerignore` | Keeps image small — excludes venv, node_modules, .env |
| `requirements.txt` | Clean minimal Python deps for the container |
| `backend/app.py` | Flask serves React build at `/`, API at `/upload_resume` etc. |
| `frontend/vite.config.js` | Dev proxy routes API calls to Flask on port 5000 |
