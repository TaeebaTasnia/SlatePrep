"""
Core prep flow orchestrator.

Steps:
  1. Check KB for prior history
  2. Extract section texts from PDF
  3. Generate MCQs (adaptive if history exists)
  4. Score answers
  5. Persist session to KB
  6. Return scored results + KB snapshot
"""
import json
import logging
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from sqlalchemy.orm import Session as DBSession

from . import pdf_ingester, mcq_generator, simulator
from .kb import queries
from .kb.models import Session, Question, Answer
from .kb.database import get_session

logger = logging.getLogger(__name__)


def run_prep_session(
    section_ids: list[int],
    n_per_section: int = 5,
    user_answers: Optional[list[str]] = None,
    simulate_mode: Optional[str] = None,
    pdf_path: Optional[Path] = None,
) -> dict[str, Any]:
    """
    Execute a full prep session end-to-end.

    Args:
        section_ids:    List of section IDs to study.
        n_per_section:  MCQs to generate per section.
        user_answers:   List of answer letters (A/B/C/D) in question order.
                        If None, simulate_mode must be set.
        simulate_mode:  "mixed" | "correct" | "wrong" | "random".
                        Used when user_answers is None.
        pdf_path:       Override default PDF path.

    Returns:
        {session_id, sections, questions (scored), score, kb_snapshot}
    """
    db = get_session()
    try:
        # STEP 1: check history
        prior = queries.get_sessions_for_sections(db, section_ids)
        logger.info(
            "Session start: sections=%s, prior_sessions=%d", section_ids, len(prior)
        )

        # STEP 2: extract section text
        kwargs = {"pdf_path": pdf_path} if pdf_path else {}
        section_texts = pdf_ingester.extract_sections(section_ids, **kwargs)

        # STEP 3: generate MCQs
        mcqs = mcq_generator.generate(db, section_texts, n_per_section)

        # STEP 4: collect / simulate answers
        if user_answers is not None:
            if len(user_answers) != len(mcqs):
                raise ValueError(
                    f"Expected {len(mcqs)} answers, got {len(user_answers)}"
                )
            answered = [{**q, "user_answer": ua} for q, ua in zip(mcqs, user_answers)]
        else:
            mode = simulate_mode or "mixed"
            answered = simulator.simulate(mcqs, mode=mode)

        # Score
        scored = _score(answered)

        # STEP 5: persist
        session = _persist(db, section_ids, scored)

        # STEP 6: snapshot
        snapshot = queries.get_kb_snapshot(db)

        return {
            "session_id": session.session_id,
            "sections": section_ids,
            "is_first_run": len(prior) == 0,
            "questions": scored,
            "score": {
                "correct": session.correct_count,
                "total": session.total_q,
                "pct": round(session.correct_count / session.total_q * 100, 1) if session.total_q else 0,
            },
            "kb_snapshot": snapshot,
        }
    finally:
        db.close()


def _score(answered: list[dict]) -> list[dict]:
    """Add is_correct and (for wrong) show_clarification to each question."""
    results = []
    for q in answered:
        is_correct = q["user_answer"] == q["correct_answer"]
        item = {**q, "is_correct": is_correct}
        if not is_correct:
            item["clarification"] = (
                f"Correct answer: {q['correct_answer']}. {q['explanation']}"
            )
        results.append(item)
    return results


def _persist(db: DBSession, section_ids: list[int], scored: list[dict]) -> Session:
    correct_count = sum(1 for q in scored if q["is_correct"])
    session = Session(
        session_id=str(uuid.uuid4()),
        created_at=datetime.utcnow(),
        section_ids=json.dumps(sorted(section_ids)),
        total_q=len(scored),
        correct_count=correct_count,
    )
    db.add(session)
    db.flush()

    for q in scored:
        q_id = str(uuid.uuid4())
        q["question_id"] = q_id
        question = Question(
            question_id=q_id,
            session_id=session.session_id,
            section_id=q["section_id"],
            question_text=q["question"],
            choices=json.dumps(q["choices"]),
            correct_answer=q["correct_answer"],
            explanation=q["explanation"],
            topic_tags=json.dumps(q.get("topic_tags", [])),
        )
        db.add(question)
        db.flush()

        answer = Answer(
            answer_id=str(uuid.uuid4()),
            question_id=question.question_id,
            user_answer=q.get("user_answer"),
            is_correct=q["is_correct"],
        )
        db.add(answer)

    db.commit()
    db.refresh(session)
    logger.info(
        "Session persisted: id=%s score=%d/%d",
        session.session_id,
        correct_count,
        len(scored),
    )
    return session
