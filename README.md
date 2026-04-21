<div align="center">

# 🏗️ AI Architecture Generator

### Transform any project idea into a complete system architecture — instantly.

[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com)
[![Mermaid](https://img.shields.io/badge/Mermaid-10.9-FF3670?logo=mermaid&logoColor=white)](https://mermaid.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Powered by Google Gemini 2.5 Flash · Built with FastAPI + React · Visual Diagrams via Mermaid.js**

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [📖 Usage](#-usage) · [🔧 API Reference](#-api-reference) · [🐛 Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Overview

**AI Architecture Generator** is a full-stack, production-ready application that converts plain-English project descriptions into comprehensive software system designs. Describe your idea in a few sentences and receive a fully populated architecture blueprint — complete with prioritized features, normalized database schemas, REST API specs, interactive Mermaid diagrams, a phased development roadmap, budgetary analysis, and strategic technology guidance.

> **Example:** Type _"A blogging platform where users can write articles, comment, and subscribe"_ → Get a complete system design in under 30 seconds.

---

## ✨ Features

### 🎯 Core AI Generation
| Feature | Description |
|---------|-------------|
| **MoSCoW Feature Prioritization** | AI extracts and categorizes features into Must-have, Should-have, Could-have, and Won't-have with clear rationale |
| **Normalized Database Schema** | 3NF-compliant table designs with field types, primary keys, foreign keys, and indexes |
| **REST API Specification** | Complete endpoint catalog with HTTP methods, URL paths, request/response descriptions |
| **System Architecture Design** | Recommends architecture type (Monolith / Microservices / Serverless) with component breakdown and tech stack |
| **ER Diagram (Visual)** | Interactive entity-relationship diagram rendered via Mermaid.js |
| **Architecture Diagram (Visual)** | Data-flow system component diagram rendered via Mermaid.js |
| **Development Roadmap** | Phase-by-phase implementation plan with milestones and task checklists |
| **Budgetary Analysis** | Development hours, team composition, and cost range with AWS / Azure / GCP infrastructure breakdowns |
| **Strategic Intelligence** | Architecture substitutes comparison, defensive security strategy cards, and optimization vectors |

### 🔒 Security & Reliability
- **Rate Limiting** — 100 requests per 15-minute window per IP
- **Input Validation** — Server-side sanitization via Pydantic schemas
- **XSS & SQL Injection Prevention** — All inputs validated and escaped
- **Retry Logic** — Up to 2 automatic retries with exponential backoff on transient AI errors
- **Typed Error Handling** — `QuotaExceededError` / `AIServiceError` raised cleanly (no silent mock fallbacks)
- **Mermaid Sanitizer** — Auto-strips single/double quoted relationship labels to guarantee diagram rendering
- **Sentry Integration** — Error monitoring with distributed tracing and profiling
- **CORS Protection** — Strict origin allowlist for frontend ↔ backend communication
- **Security Headers** — Standard HTTP security headers applied on all responses

### 🖥️ User Interface
- **Dark Glassmorphic Theme** — Premium dark UI with glass-card components
- **Interactive Zoom** — Pinch/scroll zoom on all Mermaid diagrams
- **Copy Mermaid Code** — One-click copy of raw diagram source
- **Section Copy** — Copy any individual section to clipboard
- **Export as JSON** — Download the full architecture as structured JSON
- **Export as Markdown** — Download a formatted Markdown document
- **Generation History** — Stores last 10 generated architectures locally
- **AI Assistant Button** — Floating contextual help button
- **Responsive Layout** — Fully usable on desktop, tablet, and mobile

### 🧠 AI Intelligence
- **Gemini 2.5 Flash** — Google's latest high-speed reasoning model
- **Structured JSON Output** — AI constrained to output valid, schema-conforming JSON
- **Deterministic Mode** — Low temperature (0.4) for consistent, reliable results
- **Context-Aware Prompting** — System prompt enforces strict Mermaid syntax rules

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.13+ | Runtime |
| **FastAPI** | 0.115+ | Web framework + automatic OpenAPI docs |
| **Google Gemini API** | `gemini-2.5-flash` | AI architecture generation |
| **google-genai SDK** | ≥1.10.0 | Official Python client for Gemini |
| **SQLAlchemy** | 2.x | Database ORM |
| **SQLite** | — | Local persistent storage |
| **Pydantic** | v2 | Request/response validation |
| **Uvicorn** | — | ASGI server |
| **Alembic** | — | Database migrations |
| **Sentry SDK** | — | Error monitoring & tracing |
| **python-dotenv** | — | Environment variable management |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19 | UI component library |
| **Vite** | 6.x | Build tool & dev server with HMR |
| **React Router** | v7 | Client-side routing |
| **Mermaid.js** | 10.9.5 | ER & architecture diagram rendering |
| **Axios** | — | HTTP client with retry logic |
| **Vanilla CSS** | — | Custom dark glassmorphic design system |

---

## 📁 Project Structure

```
ai-architecture-generator/
├── backend/
│   ├── main.py                    # FastAPI app, routes, middleware
│   ├── ai_service.py              # Gemini API integration + Mermaid sanitizer
│   ├── schemas.py                 # Pydantic request/response models
│   ├── models.py                  # SQLAlchemy ORM models
│   ├── database.py                # DB config, session factory, migrations
│   ├── exceptions.py              # Typed exceptions (QuotaExceededError, AIServiceError)
│   ├── sentry_config.py           # Sentry initialization
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables (not committed)
│   ├── .env.example               # Template for environment variables
│   └── tests/
│       ├── test_e2e.py            # End-to-end API tests
│       ├── test_integration.py    # Integration tests
│       └── test_unit.py           # Unit tests
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Home / input page
│   │   │   ├── Home.jsx           # Generation form logic
│   │   │   └── Result.jsx         # Full results display page
│   │   ├── components/
│   │   │   ├── FeaturesSection.jsx        # MoSCoW prioritized features
│   │   │   ├── DatabaseSection.jsx        # Database schema tables
│   │   │   ├── APIsSection.jsx             # REST API endpoint list
│   │   │   ├── ArchitectureSection.jsx     # Architecture type + tech stack
│   │   │   ├── DiagramSection.jsx          # Mermaid ER + architecture diagrams
│   │   │   ├── RoadmapSection.jsx          # Phase-by-phase roadmap
│   │   │   ├── EstimationSection.jsx       # Budgetary analysis + cost matrix
│   │   │   └── StrategicSection.jsx        # Architecture alternatives + security
│   │   ├── services/
│   │   │   └── api.js             # Axios client with retry + error handling
│   │   ├── App.jsx                # Root component + route config
│   │   ├── main.jsx               # React DOM entry point
│   │   └── index.css              # Global CSS design system
│   ├── index.html                 # HTML shell
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite + HMR configuration
│   └── .env.example               # Frontend env template
│
├── start_backend.bat              # Windows: one-click backend start
├── start_frontend.bat             # Windows: one-click frontend start
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v22+ — [Download](https://nodejs.org)
- **Python** 3.13+ — [Download](https://python.org)
- **Google Gemini API Key** — [Get one free](https://aistudio.google.com/)

---

### Option A — Windows One-Click (Recommended)

```bat
# Terminal 1 — Start Backend
.\start_backend.bat

# Terminal 2 — Start Frontend
.\start_frontend.bat
```

Open **http://localhost:5173** and you're live. ✅

---

### Option B — Manual Setup

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

Edit `backend/.env`:
```env
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=sqlite:///./architecture_generator.db
SENTRY_DSN=                          # Optional: Sentry error tracking DSN
ENVIRONMENT=development
```

```bash
# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend API available at: **http://localhost:8000**  
Swagger docs at: **http://localhost:8000/docs**

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Default .env works out of the box — VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend available at: **http://localhost:5173**

---

## 📖 Usage

### Step-by-Step

1. **Open** `http://localhost:5173` in your browser
2. **Type** your project idea in the textarea (minimum 10 characters)
3. **Click** `Generate Architecture`
4. **Wait** 10–30 seconds while Gemini 2.5 Flash processes your idea
5. **Explore** the 9 generated sections:

| Section | What You Get |
|---------|-------------|
| 📋 **Features** | Must/Should/Could/Won't prioritized feature list |
| 🗄️ **Database Schema** | Normalized tables with fields, types, and FK relationships |
| 🌐 **REST APIs** | Endpoint catalog with methods and descriptions |
| 🏗️ **Architecture** | Recommended pattern, component list, and full tech stack |
| 📊 **ER Diagram** | Interactive Mermaid entity-relationship diagram |
| 🗺️ **Architecture Diagram** | Interactive Mermaid data-flow system component diagram |
| 📅 **Development Roadmap** | Phased plan with task checklists and timeline estimates |
| 💰 **Budgetary Analysis** | Hours, team size, budget range, and AWS/Azure/GCP cost matrix |
| 🔒 **Strategic Intelligence** | Alternative architectures, security hardening tips, optimization vectors |

6. **Export** your architecture:
   - `📋 Copy` — Copy any section to clipboard
   - `⬇️ Download JSON` — Full structured data export
   - `⬇️ Download Markdown` — Human-readable document export

### Example Prompts

```
A social media platform for pet owners where they can share photos,
connect with other owners, schedule vet appointments, and buy pet supplies.
```

```
An e-learning platform with video courses, quizzes, certificates,
instructor dashboards, and student progress tracking.
```

```
A real-time food delivery app with GPS tracking, restaurant management,
order notifications, and payment processing.
```

---

## 🔧 API Reference

**Base URL:** `http://localhost:8000/api/v1`

### `GET /`
Root health check.
```json
{ "message": "AI Architecture Generator API", "status": "running" }
```

### `GET /health`
Detailed service health status.
```json
{ "status": "healthy", "database": "connected", "ai_service": "ready" }
```

### `POST /api/v1/generate`
Generate a complete system architecture from a project idea.

**Request:**
```json
{
  "idea": "A blogging platform with commenting, tagging, and subscriptions"
}
```

**Response (200 OK):**
```json
{
  "features": [
    { "name": "User Authentication", "priority": "Must", "description": "..." }
  ],
  "database": [
    {
      "table": "users",
      "fields": ["id (PK)", "email", "password_hash", "created_at"],
      "relationships": ["FK -> posts", "FK -> comments"]
    }
  ],
  "apis": [
    { "method": "POST", "endpoint": "/api/auth/login", "description": "Authenticate user and return JWT" }
  ],
  "architecture": {
    "type": "Modular Monolith",
    "components": ["React Frontend", "Django REST API", "PostgreSQL", "Redis", "Celery"],
    "tech_stack": {
      "frontend": "React with Next.js",
      "backend": "Python / Django REST Framework",
      "database": "PostgreSQL",
      "cache": "Redis",
      "queue": "RabbitMQ / Celery"
    }
  },
  "erDiagram": "erDiagram\n    USERS ||--o{ POSTS : creates\n    ...",
  "architectureDiagram": "graph TD\n    Client --> API\n    ...",
  "roadmap": [
    {
      "phase": "Phase 1: Core MVP (2-3 months)",
      "tasks": ["User authentication", "Post creation", "Basic commenting"]
    }
  ],
  "estimation": {
    "hours": "1200-2000",
    "team_size": "3-4 developers",
    "cost": "USD 60,000 - 150,000"
  },
  "strategicIntelligence": {
    "architectureSubstitutes": [...],
    "defensiveStrategy": [...],
    "optimizationVectors": [...]
  }
}
```

**Error Responses:**
| Code | Meaning |
|------|---------|
| `400` | Idea too short (< 10 characters) |
| `422` | Validation error |
| `429` | Gemini API rate limit / quota exceeded |
| `500` | AI service error or JSON parse failure |

---

## ⚙️ Configuration

### Backend `.env` Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Your Google Gemini API key |
| `DATABASE_URL` | No | `sqlite:///./architecture_generator.db` | Database connection string |
| `SENTRY_DSN` | No | `""` | Sentry DSN for error tracking |
| `ENVIRONMENT` | No | `development` | `development` or `production` |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed frontend origins |

### Frontend `.env` Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

### Customizing the AI Model

Edit `backend/ai_service.py`:
```python
MODEL_ID = "gemini-2.5-flash"     # Change AI model here

config = types.GenerateContentConfig(
    temperature=0.4,               # 0.0 = deterministic, 1.0 = creative
    max_output_tokens=8192,        # Max response length
)
```

---

## 🐛 Troubleshooting

### Backend Issues

**❌ `401 Unauthorized` / "API key not valid"**
- Ensure `backend/.env` exists with a valid `GEMINI_API_KEY`
- Get a new key from [Google AI Studio](https://aistudio.google.com/)
- Restart the backend after updating the key

**❌ `429 Too Many Requests` / "Quota Exceeded"**
- Free tier limit: **20 requests/day, 5 requests/minute**
- Wait a few minutes and retry, or upgrade your Google AI plan
- Check [Google AI rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)

**❌ `500 Internal Server Error`**
- Check backend terminal logs for the root error
- Common cause: JSON parse failure from malformed AI response (retry usually resolves)

**❌ "Module not found"**
- Activate the virtual environment: `venv\Scripts\activate` (Windows)
- Reinstall: `pip install -r requirements.txt`

### Frontend Issues

**❌ "Network Error" / API calls failing**
- Verify backend is running on `http://localhost:8000`
- Confirm `VITE_API_URL` in `frontend/.env` matches backend port
- Check browser DevTools → Network tab for CORS errors

**❌ "Unable to render diagram"**
- The Mermaid sanitizer on the backend auto-fixes most syntax issues
- If persistent, regenerate — the AI may have produced unusual syntax
- Check browser console for Mermaid-specific error messages

**❌ WebSocket HMR failed in browser console**
- This is a Vite HMR warning only — the app still functions correctly
- It does not affect architecture generation or diagram rendering

---

## 📦 Production Deployment

### Backend (Production)
```bash
# Install production server
pip install gunicorn

# Run with multiple workers
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Set `ENVIRONMENT=production` in `.env` before deploying.

### Frontend (Production)
```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Deploy the dist/ folder to:
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod --dir dist
# - Any static host
```

---

## 🤝 Contributing & Extending

To add new features or sections:

1. **Add AI output field** — Update `SYSTEM_PROMPT` in `backend/ai_service.py`
2. **Add response schema** — Add field to `ArchitectureResponse` in `backend/schemas.py`
3. **Create UI component** — Add a new `.jsx` component in `frontend/src/components/`
4. **Register in Results page** — Import and render the component in `frontend/src/pages/Result.jsx`

---

## 📊 API Rate Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Requests per minute (RPM) | 5 |
| Requests per day (RPD) | 20 |
| Tokens per minute | 250,000 |

Upgrade at [Google AI Studio](https://aistudio.google.com/) for higher limits.

---

## 📄 License

**MIT License** — Free for personal and commercial use.

---

## 🙏 Acknowledgments

- **Google DeepMind** — Gemini 2.5 Flash API
- **FastAPI** — Modern Python web framework
- **React & Vite** — Fast frontend tooling
- **Mermaid.js** — Beautiful diagram rendering
- **Sentry** — Production error monitoring

---

<div align="center">

**Built with ❤️ and AI-powered architecture generation**

*Describe it. Generate it. Ship it.*

</div>
