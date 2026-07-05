import json
import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from src import pdf_ingester, prep_engine
from src.kb import queries
from src.kb.database import get_session

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Request / Response models ───────────────────────────────────────────────

class StartSessionRequest(BaseModel):
    section_ids: list[int] = Field(..., min_length=1)
    n_per_section: int = Field(5, ge=1, le=20)
    simulate_mode: Optional[str] = Field("mixed", description="mixed|correct|wrong|random")


class SubmitAnswersRequest(BaseModel):
    answers: list[str] = Field(..., description="List of answer letters A/B/C/D in question order")


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/sections")
def list_sections():
    """List all sections parsed from the PDF."""
    try:
        return {"sections": pdf_ingester.list_sections()}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Error listing sections")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions")
def start_session(req: StartSessionRequest):
    """
    Start a prep session. Returns session_id + generated MCQs.
    If simulate_mode is set, answers are auto-simulated and scored immediately.
    """
    try:
        result = prep_engine.run_prep_session(
            section_ids=req.section_ids,
            n_per_section=req.n_per_section,
            simulate_mode=req.simulate_mode,
        )
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("Error running prep session")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{session_id}/answers")
def submit_answers(session_id: str, req: SubmitAnswersRequest):
    """
    Submit human answers for a session that was started without simulation.
    NOTE: In the current flow, sessions are scored at creation time.
    This endpoint is provided for UI-driven interactive use.
    """
    db = get_session()
    try:
        from src.kb.models import Session, Question, Answer
        import uuid
        from datetime import datetime

        session = db.query(Session).filter(Session.session_id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        questions = session.questions
        if len(req.answers) != len(questions):
            raise HTTPException(
                status_code=400,
                detail=f"Expected {len(questions)} answers, got {len(req.answers)}",
            )

        scored = []
        correct_count = 0
        for q, user_ans in zip(questions, req.answers):
            if user_ans not in ("A", "B", "C", "D"):
                raise HTTPException(status_code=400, detail=f"Invalid answer: {user_ans}")
            is_correct = user_ans == q.correct_answer

            # upsert answer
            if q.answer:
                q.answer.user_answer = user_ans
                q.answer.is_correct = is_correct
            else:
                ans = Answer(
                    answer_id=str(uuid.uuid4()),
                    question_id=q.question_id,
                    user_answer=user_ans,
                    is_correct=is_correct,
                )
                db.add(ans)

            if is_correct:
                correct_count += 1

            item = {
                "question_id": q.question_id,
                "section_id": q.section_id,
                "question": q.question_text,
                "choices": json.loads(q.choices),
                "correct_answer": q.correct_answer,
                "user_answer": user_ans,
                "is_correct": is_correct,
            }
            if not is_correct:
                item["clarification"] = f"Correct answer: {q.correct_answer}. {q.explanation}"
            scored.append(item)

        session.correct_count = correct_count
        db.commit()

        return {
            "session_id": session_id,
            "score": {
                "correct": correct_count,
                "total": len(questions),
                "pct": round(correct_count / len(questions) * 100, 1),
            },
            "questions": scored,
        }
    finally:
        db.close()


@router.get("/sessions/{session_id}/snapshot")
def get_snapshot(session_id: str):
    """Return KB snapshot at the time of this session."""
    db = get_session()
    try:
        from src.kb.models import Session
        session = db.query(Session).filter(Session.session_id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return queries.get_kb_snapshot(db)
    finally:
        db.close()


@router.get("/sessions/{session_id}/history")
def get_history(session_id: str):
    """Return prior session history for the same sections as this session."""
    db = get_session()
    try:
        from src.kb.models import Session
        session = db.query(Session).filter(Session.session_id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        section_ids = json.loads(session.section_ids)
        prior = queries.get_sessions_for_sections(db, section_ids)
        # exclude current session
        prior = [s for s in prior if s.session_id != session_id]
        return {
            "sections": section_ids,
            "prior_session_count": len(prior),
            "weak_topics": queries.get_weak_topics(db, section_ids),
        }
    finally:
        db.close()
