"""Tests for MCQ generation prompt logic (no LLM calls)."""
import json
import os
import uuid
from datetime import datetime

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ["KB_DB_PATH"] = ":memory:"

from src.kb.models import Base, Session, Question, Answer
from src.mcq_generator import build_adaptive_context


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()


def _populate(db, section_ids, correct_flags, tags_list):
    s = Session(
        session_id=str(uuid.uuid4()),
        created_at=datetime.utcnow(),
        section_ids=json.dumps(sorted(section_ids)),
        total_q=len(correct_flags),
        correct_count=sum(correct_flags),
    )
    db.add(s)
    db.flush()
    for is_correct, tags in zip(correct_flags, tags_list):
        q = Question(
            question_id=str(uuid.uuid4()),
            session_id=s.session_id,
            section_id=section_ids[0],
            question_text=f"Question on {tags[0]}",
            choices=json.dumps({"A": "a", "B": "b", "C": "c", "D": "d"}),
            correct_answer="A",
            explanation="explanation",
            topic_tags=json.dumps(tags),
        )
        db.add(q)
        db.flush()
        a = Answer(
            answer_id=str(uuid.uuid4()),
            question_id=q.question_id,
            user_answer="A" if is_correct else "B",
            is_correct=is_correct,
        )
        db.add(a)
    db.commit()


class TestBuildAdaptiveContext:
    def test_empty_db_returns_empty_string(self, db):
        ctx = build_adaptive_context(db, [5, 8])
        assert ctx == ""

    def test_context_mentions_weak_topic(self, db):
        _populate(db, [5], [False, False], [["encryption"], ["hashing"]])
        ctx = build_adaptive_context(db, [5])
        assert "encryption" in ctx or "hashing" in ctx

    def test_context_mentions_mastered(self, db):
        _populate(db, [5], [True], [["algorithms"]])
        ctx = build_adaptive_context(db, [5])
        assert "MASTERED" in ctx

    def test_context_mentions_session_count(self, db):
        _populate(db, [5], [True, False], [["A"], ["B"]])
        _populate(db, [5], [False], [["C"]])
        ctx = build_adaptive_context(db, [5])
        assert "2" in ctx  # "2 prior session(s)"

    def test_no_history_for_different_sections(self, db):
        _populate(db, [3], [False], [["something"]])
        ctx = build_adaptive_context(db, [7])
        assert ctx == ""
