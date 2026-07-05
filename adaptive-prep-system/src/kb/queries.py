import json
from collections import Counter
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session as DBSession
from .models import Session, Question, Answer


def get_sessions_for_sections(db: DBSession, section_ids: list[int]) -> list[Session]:
    """Return all past sessions that overlap with the given section IDs."""
    sessions = db.query(Session).order_by(Session.created_at.desc()).all()
    result = []
    for s in sessions:
        stored = set(json.loads(s.section_ids))
        if stored & set(section_ids):
            result.append(s)
    return result


def get_weak_topics(db: DBSession, section_ids: list[int], limit: int = 10) -> list[tuple[str, int]]:
    """Return (topic, wrong_count) pairs ranked by how often they were answered incorrectly."""
    sessions = get_sessions_for_sections(db, section_ids)
    topic_wrong: Counter = Counter()
    for session in sessions:
        for q in session.questions:
            if q.section_id not in section_ids:
                continue
            if q.answer and not q.answer.is_correct:
                for tag in json.loads(q.topic_tags):
                    topic_wrong[tag] += 1
    return topic_wrong.most_common(limit)


def get_mastered_questions(db: DBSession, section_ids: list[int]) -> list[str]:
    """Return question texts that have been answered correctly in any prior session."""
    sessions = get_sessions_for_sections(db, section_ids)
    mastered = []
    for session in sessions:
        for q in session.questions:
            if q.section_id in section_ids and q.answer and q.answer.is_correct:
                mastered.append(q.question_text)
    return mastered


def get_wrong_questions(db: DBSession, section_ids: list[int]) -> list[str]:
    """Return question texts answered incorrectly across any prior session."""
    sessions = get_sessions_for_sections(db, section_ids)
    wrong = []
    for session in sessions:
        for q in session.questions:
            if q.section_id in section_ids and q.answer and not q.answer.is_correct:
                wrong.append(q.question_text)
    return wrong


def save_session(db: DBSession, session: Session) -> None:
    db.add(session)
    db.commit()
    db.refresh(session)


def get_kb_snapshot(db: DBSession, limit: int = 5) -> dict:
    """Export the top-N most recent sessions with full question/answer detail."""
    sessions = db.query(Session).order_by(Session.created_at.desc()).limit(limit).all()
    total = db.query(Session).count()

    records = []
    for s in sessions:
        weak = get_weak_topics(db, json.loads(s.section_ids))
        q_records = []
        for q in s.questions:
            q_records.append({
                "question_id": q.question_id,
                "section_id": q.section_id,
                "text": q.question_text,
                "choices": json.loads(q.choices),
                "correct_answer": q.correct_answer,
                "explanation": q.explanation,
                "topic_tags": json.loads(q.topic_tags),
                "user_answer": q.answer.user_answer if q.answer else None,
                "is_correct": q.answer.is_correct if q.answer else None,
            })
        records.append({
            "session_id": s.session_id,
            "created_at": s.created_at.isoformat(),
            "sections": json.loads(s.section_ids),
            "score": f"{s.correct_count}/{s.total_q}",
            "weak_topics": [t for t, _ in weak[:5]],
            "questions": q_records,
        })

    return {
        "snapshot_at": datetime.utcnow().isoformat(),
        "total_sessions": total,
        "top_5_sessions": records,
    }
