"""
Integration tests for the full prep flow.
Uses mocks for PDF extraction and LLM to avoid external dependencies.
"""
import json
import os
import uuid
from pathlib import Path
from unittest.mock import patch, MagicMock

import pytest

os.environ["KB_DB_PATH"] = ":memory:"
os.environ["GROQ_API_KEY"] = "test-key"

# Patch the engine before any module imports database
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

_test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})

FAKE_MCQS = [
    {
        "question": f"Test question {i}",
        "choices": {"A": "opt1", "B": "opt2", "C": "opt3", "D": "opt4"},
        "correct_answer": "A",
        "explanation": "Because A.",
        "topic_tags": [f"topic{i}"],
        "section_id": 5,
    }
    for i in range(5)
]

FAKE_SECTION_TEXTS = {5: "Section 5 content about security protocols."}


@pytest.fixture(autouse=True)
def patch_db(monkeypatch):
    """Redirect all DB calls to an in-memory SQLite."""
    from src.kb import database, models
    models.Base.metadata.create_all(_test_engine)
    _Session = sessionmaker(bind=_test_engine)

    monkeypatch.setattr(database, "get_engine", lambda: _test_engine)
    monkeypatch.setattr(database, "get_session", lambda: _Session())
    yield
    # Clean tables between tests
    with _test_engine.connect() as conn:
        for table in reversed(models.Base.metadata.sorted_tables):
            conn.execute(table.delete())
        conn.commit()


@pytest.fixture
def mock_pdf(monkeypatch):
    from src import pdf_ingester
    monkeypatch.setattr(pdf_ingester, "extract_sections", lambda ids, **kw: {i: f"text for section {i}" for i in ids})


@pytest.fixture
def mock_llm(monkeypatch):
    from src import llm_client
    def fake_generate(section_text, section_id, n, adaptive_context=""):
        mcqs = []
        for i in range(n):
            mcqs.append({
                "question": f"Q{i} for section {section_id}",
                "choices": {"A": "correct", "B": "wrong1", "C": "wrong2", "D": "wrong3"},
                "correct_answer": "A",
                "explanation": "A is correct.",
                "topic_tags": [f"tag{i}"],
            })
        return mcqs
    monkeypatch.setattr(llm_client, "generate_mcqs", fake_generate)


class TestPrepEngineFlow:
    def test_cold_start_session_creates_db_records(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session
        from src.kb.database import get_session
        from src.kb.models import Session

        result = run_prep_session(section_ids=[5], n_per_section=3, simulate_mode="mixed")

        db = get_session()
        sessions = db.query(Session).all()
        assert len(sessions) == 1
        assert result["is_first_run"] is True
        assert len(result["questions"]) == 3
        db.close()

    def test_session_score_correct(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session

        result = run_prep_session(section_ids=[5], n_per_section=5, simulate_mode="correct")
        assert result["score"]["correct"] == 5
        assert result["score"]["total"] == 5

    def test_session_score_wrong(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session

        result = run_prep_session(section_ids=[5], n_per_section=5, simulate_mode="wrong")
        assert result["score"]["correct"] == 0

    def test_second_run_not_first_run(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session

        run_prep_session(section_ids=[5], n_per_section=3, simulate_mode="mixed")
        result2 = run_prep_session(section_ids=[5], n_per_section=3, simulate_mode="mixed")
        assert result2["is_first_run"] is False

    def test_wrong_answers_trigger_clarification(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session

        result = run_prep_session(section_ids=[5], n_per_section=5, simulate_mode="wrong")
        for q in result["questions"]:
            assert "clarification" in q

    def test_correct_answers_no_clarification(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session

        result = run_prep_session(section_ids=[5], n_per_section=5, simulate_mode="correct")
        for q in result["questions"]:
            assert "clarification" not in q

    def test_kb_snapshot_in_result(self, mock_pdf, mock_llm):
        from src.prep_engine import run_prep_session

        result = run_prep_session(section_ids=[5], n_per_section=3, simulate_mode="mixed")
        assert "kb_snapshot" in result
        assert "top_5_sessions" in result["kb_snapshot"]

    def test_adaptive_context_populated_on_second_run(self, mock_pdf, monkeypatch):
        from src.prep_engine import run_prep_session
        from src import mcq_generator

        captured_contexts = []
        original_generate = mcq_generator.generate

        def capturing_generate(db, section_texts, n_per_section=5):
            from src import llm_client
            context = mcq_generator.build_adaptive_context(db, list(section_texts.keys()))
            captured_contexts.append(context)
            # call real generate with a fake llm
            with patch.object(llm_client, "generate_mcqs") as mock_gen:
                mock_gen.side_effect = lambda section_text, section_id, n, adaptive_context="": [
                    {
                        "question": f"Q for {section_id}",
                        "choices": {"A": "a", "B": "b", "C": "c", "D": "d"},
                        "correct_answer": "A",
                        "explanation": "exp",
                        "topic_tags": ["t1"],
                    }
                ] * n
                return original_generate(db, section_texts, n_per_section)

        monkeypatch.setattr(mcq_generator, "generate", capturing_generate)

        run_prep_session(section_ids=[5], n_per_section=2, simulate_mode="wrong")
        run_prep_session(section_ids=[5], n_per_section=2, simulate_mode="wrong")

        assert captured_contexts[0] == ""         # first run: no context
        assert captured_contexts[1] != ""         # second run: adaptive context injected
