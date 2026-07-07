# ── Stage 1: Build React frontend ──────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ── Stage 2: Python backend + serve frontend as static files ───────────
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/


# Copy built frontend into a folder Flask will serve
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Create uploads folder
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Start with Gunicorn
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 2 --timeout 120 backend.app:app"]
