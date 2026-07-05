# Adaptive Document Preparation System

An AI-powered MCQ study system that ingests a PDF, generates questions via an LLM, scores user answers, and **adapts future sessions** to focus on historically weak topics.

---

## Project Overview

The system reads sections from `SLATEFALL_DOSSIER.pdf`, generates multiple-choice questions (MCQs) using Groq's LLaMA3-70b model, stores every session in a SQLite knowledge base, and on return visits intelligently biases question generation toward the learner's weakest areas.

### Architecture

```
adaptive-prep-system/
├── src/
│   ├── pdf_ingester.py    # PDF parsing and section extraction (PyMuPDF)
│   ├── llm_client.py      # Groq API wrapper for MCQ generation
│   ├── mcq_generator.py   # Adaptive prompt builder
│   ├── prep_engine.py     # Orchestrates the full 6-step prep flow
│   ├── simulator.py       # Simulates user answers for evaluation
│   └── kb/
│       ├── models.py      # SQLAlchemy ORM: Session, Question, Answer
│       ├── database.py    # DB engine and session factory
│       └── queries.py     # KB query functions
├── api/
│   ├── main.py            # FastAPI application (CORS-enabled)
│   └── routes.py          # REST endpoints
├── frontend/              # Next.js + React + Tailwind + Framer Motion UI
│   ├── app/               # Next.js App Router pages
│   ├── components/        # All UI components (navigation, hero, MCQ, timeline, KB, exports)
│   ├── lib/
│   │   ├── api.ts         # Typed API client — connects to FastAPI backend
│   │   ├── mock-data.ts   # Inline mock data (used when API_URL is not set)
│   │   └── animation-config.ts
│   └── .env.local.example # Copy to .env.local and set NEXT_PUBLIC_API_URL
├── cli.py                 # Click CLI entry point
├── streamlit_app.py       # Streamlit web UI
├── tests/                 # pytest test suite
└── outputs/               # Evaluation output JSON files
```

---

## Tech Stack & Reasoning

| Component | Choice | Why |
|-----------|--------|-----|
| Backend | **FastAPI** | Native async, Pydantic validation, auto OpenAPI docs — natural fit for AI/ML pipelines |
| LLM | **Groq (LLaMA3-70b)** | Free tier, fastest inference available, reliable JSON-mode output for structured MCQ generation |
| PDF Parsing | **PyMuPDF** | Fastest Python PDF library, simple API, excellent for machine-readable text — no OCR needed |
| Knowledge Base | **SQLite + SQLAlchemy** | Zero-server setup, one file, fully capable of all required query patterns (history, weak-topic aggregation, snapshots) |
| CLI | **Click** | Clean command composition, argument validation, `--help` generation |
| UI | **Streamlit** | Single-file UI with minimal boilerplate; renders forms and JSON natively |
| Tests | **pytest** | Standard Python test runner; mocks LLM and PDF to run offline |

**Why no vector store?** Section retrieval is structural (by ID), not semantic. SQLite handles all four KB query patterns (session history, question results, weak topics, snapshots) without additional infrastructure.

---

## Prerequisites

- Python 3.11+
- Node.js 18+ (for the frontend)
- A free Groq API key from [console.groq.com](https://console.groq.com/)
- `SLATEFALL_DOSSIER.pdf` placed in `data/`

---

## Setup (under 10 minutes)

### Backend

```bash
# 1. Clone the repository
git clone <repo-url>
cd adaptive-prep-system

# 2. Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env and set GROQ_API_KEY=your_key_here

# 5. Place the PDF
cp /path/to/SLATEFALL_DOSSIER.pdf data/
```

### Frontend (optional — runs on mock data without the backend)

```bash
cd frontend

# Install dependencies
npm install

# Option A: mock-data-only mode (no backend needed)
npm run dev

# Option B: wire up the real backend
cp .env.local.example .env.local
# Edit .env.local and set: NEXT_PUBLIC_API_URL=http://localhost:8001
# Start the backend first (see REST API section below), then:
npm run dev
```

Frontend runs at **http://localhost:3000**

---

## Running Evaluation Scenarios

### Scenario A — Cold-start prep over two sections

```bash
python cli.py scenario-a --sections 3,7
```

### Scenario B — Three consecutive adaptive iterations

```bash
python cli.py scenario-b
```

This runs:
- Iter 1: sections 5, 8
- Iter 2: sections 6, 8, 9 (adaptive — uses iter 1 history for section 8)
- Iter 3: section 8 (adaptive — uses iter 1 + 2 history)

Outputs saved to:
```
outputs/scenario_b_iter1/questions_iter1.json
outputs/scenario_b_iter1/kb_snapshot_iter1.json
outputs/scenario_b_iter2/questions_iter2.json
outputs/scenario_b_iter2/kb_snapshot_iter2.json
outputs/scenario_b_iter3/questions_iter3.json
outputs/scenario_b_iter3/kb_snapshot_iter3.json
```

### Custom prep session

```bash
# Simulate with mixed answers (default)
python cli.py prep --sections 5,8 --simulate

# All wrong (maximises adaptive effect on next run)
python cli.py prep --sections 5,8 --simulate --mode wrong

# Save outputs to a custom directory
python cli.py prep --sections 5,8 --simulate --output my_outputs/
```

---

## REST API

Start the server:
```bash
uvicorn api.main:app --port 8001
```

Docs available at `http://localhost:8001/docs`.

CORS is pre-configured for `http://localhost:3000` (the Next.js frontend).
To allow additional origins set `CORS_ORIGINS=http://host1,http://host2` in `.env`.

> **Windows note:** Port 8000 is often held by other processes. Use `--port 8001` (or any free port) and set `NEXT_PUBLIC_API_URL=http://localhost:8001` in `frontend/.env.local`. To kill a stale process on a port:
> ```powershell
> Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
> ```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/sections` | List all PDF sections |
| POST | `/sessions` | Start a prep session (returns MCQs + scores) |
| POST | `/sessions/{id}/answers` | Submit human answers |
| GET | `/sessions/{id}/snapshot` | KB snapshot for a session |
| GET | `/sessions/{id}/history` | Prior history for same sections |

Example request:
```bash
curl -X POST http://localhost:8000/sessions \
  -H "Content-Type: application/json" \
  -d '{"section_ids": [5, 8], "n_per_section": 5, "simulate_mode": "mixed"}'
```

---

## Streamlit UI

```bash
streamlit run streamlit_app.py
```

Opens at `http://localhost:8501`. Select sections, run prep, view scored answers and KB snapshot.

---

## Running Tests

```bash
pytest tests/ -v
```

Tests use an in-memory SQLite database and mock both the PDF parser and LLM — no API key required.

---

## Knowledge Base Schema

### `sessions`
| Column | Type | Description |
|--------|------|-------------|
| session_id | TEXT (UUID) | Primary key |
| created_at | DATETIME | UTC timestamp |
| section_ids | TEXT | JSON array of section IDs |
| total_q | INTEGER | Number of questions in session |
| correct_count | INTEGER | Number of correct answers |

### `questions`
| Column | Type | Description |
|--------|------|-------------|
| question_id | TEXT (UUID) | Primary key |
| session_id | TEXT | FK → sessions |
| section_id | INTEGER | Which section this question covers |
| question_text | TEXT | The question |
| choices | TEXT | JSON `{"A":…,"B":…,"C":…,"D":…}` |
| correct_answer | TEXT | "A" | "B" | "C" | "D" |
| explanation | TEXT | LLM-generated explanation |
| topic_tags | TEXT | JSON array of topic keywords |

### `answers`
| Column | Type | Description |
|--------|------|-------------|
| answer_id | TEXT (UUID) | Primary key |
| question_id | TEXT | FK → questions |
| user_answer | TEXT | The answer submitted |
| is_correct | BOOLEAN | Whether answer was correct |
| answered_at | DATETIME | UTC timestamp |

### Key Query Patterns

1. **Sessions for sections**: filter sessions where `section_ids` JSON overlaps with requested IDs
2. **Question-level results**: join questions + answers via session_id
3. **Weak topics**: group answers by topic_tags where is_correct=False, rank by count
4. **KB snapshot**: top-5 most recent sessions with full question/answer detail

---

## Adaptive Prompting Logic

On the first run for a set of sections, the system generates MCQs from the section text directly.

On return runs:
1. The KB is queried for all prior sessions covering the same sections
2. Weak topics are extracted (topics with the most wrong answers)
3. Mastered questions are identified (questions answered correctly before)
4. The LLM prompt is augmented with:
   - "Focus 60%+ of questions on these weak topics: [list]"
   - "Do NOT regenerate questions testing: [mastered question list]"
   - "Consider re-testing previously missed: [wrong question list]"

This adaptive context is visible in `kb_snapshot_iterN.json` — the `weak_topics` field per session shows what was fed into the prompt.

---
