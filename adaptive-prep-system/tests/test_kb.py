"""Tests for KB models, database, and query functions."""
import json
import os
import uuid
from datetime import datetime

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use in-memory SQLite for tests
os.environ["KB_DB_PATH"] = ":memory:"

from src.kb.models import Base, Session, Question, Answer
from src.kb import queries


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()


def _make_session(db, section_ids: list[int], correct: int = 3, total: int = 5) -> Session:
    s = Session(
        session_id=str(uuid.uuid4()),
        created_at=datetime.utcnow(),
        section_ids=json.dumps(sorted(section_ids)),
        total_q=total,
        correct_count=correct,
    )
    db.add(s)
    db.flush()
    return s


def _make_question(db, session: Session, section_id: int, correct: bool, tags: list[str]) -> Question:
    q = Question(
        question_id=str(uuid.uuid4()),
        session_id=session.session_id,
        section_id=section_id,
        question_text=f"Question about {tags[0] if tags else 'topic'}",
        choices=json.dumps({"A": "opt1", "B": "opt2", "C": "opt3", "D": "opt4"}),
        correct_answer="A",
        explanation="Because A is right.",
        topic_tags=json.dumps(tags),
    )
    db.add(q)
    db.flush()
    a = Answer(
        answer_id=str(uuid.uuid4()),
        question_id=q.question_id,
        user_answer="A" if correct else "B",
        is_correct=correct,
    )
    db.add(a)
    db.commit()
    return q


class TestGetSessionsForSections:
    def test_returns_matching_session(self, db):
        _make_session(db, [5, 8])
        result = queries.get_sessions_for_sections(db, [5])
        assert len(result) == 1

    def test_no_match_returns_empty(self, db):
        _make_session(db, [1, 2])
        result = queries.get_sessions_for_sections(db, [9])
        assert result == []

    def test_partial_overlap_matches(self, db):
        _make_session(db, [5, 8])
        result = queries.get_sessions_for_sections(db, [8, 9])
        assert len(result) == 1

    def test_multiple_sessions(self, db):
        _make_session(db, [5, 8])
        _make_session(db, [5, 9])
        result = queries.get_sessions_for_sections(db, [5])
        assert len(result) == 2


class TestWeakTopics:
    def test_wrong_answers_appear_in_weak_topics(self, db):
        s = _make_session(db, [5])
        _make_question(db, s, 5, correct=False, tags=["cryptography", "keys"])
        weak = queries.get_weak_topics(db, [5])
        topics = [t for t, _ in weak]
        assert "cryptography" in topics

    def test_correct_answers_not_in_weak_topics(self, db):
        s = _make_session(db, [5])
        _make_question(db, s, 5, correct=True, tags=["algorithms"])
        weak = queries.get_weak_topics(db, [5])
        topics = [t for t, _ in weak]
        assert "algorithms" not in topics

    def test_count_accumulates_across_sessions(self, db):
        for _ in range(3):
            s = _make_session(db, [5])
            _make_question(db, s, 5, correct=False, tags=["hashing"])
        weak = dict(queries.get_weak_topics(db, [5]))
        assert weak["hashing"] == 3


class TestMasteredQuestions:
    def test_correct_question_is_mastered(self, db):
        s = _make_session(db, [8])
        q = _make_question(db, s, 8, correct=True, tags=["networking"])
        mastered = queries.get_mastered_questions(db, [8])
        assert q.question_text in mastered

    def test_wrong_question_not_mastered(self, db):
        s = _make_session(db, [8])
        q = _make_question(db, s, 8, correct=False, tags=["networking"])
        mastered = queries.get_mastered_questions(db, [8])
        assert q.question_text not in mastered


class TestKBSnapshot:
    def test_snapshot_structure(self, db):
        s = _make_session(db, [5, 8])
        snap = queries.get_kb_snapshot(db)
        assert "snapshot_at" in snap
        assert "total_sessions" in snap
        assert "top_5_sessions" in snap
        assert snap["total_sessions"] == 1

    def test_snapshot_respects_limit(self, db):
        for _ in range(7):
            _make_session(db, [5])
        snap = queries.get_kb_snapshot(db, limit=5)
        assert len(snap["top_5_sessions"]) == 5
