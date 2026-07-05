"""
Adaptive MCQ generator.

First run  → plain generation from section text.
Return run → inject weak-topic focus + mastered-question exclusions into the prompt.
"""
import json
import logging
from typing import Any
from . import llm_client
from .kb import queries
from sqlalchemy.orm import Session as DBSession

logger = logging.getLogger(__name__)

_WEAK_TOPIC_WEIGHT = 0.6  # fraction of questions to bias toward weak topics


def build_adaptive_context(
    db: DBSession,
    section_ids: list[int],
) -> str:
    """
    Query KB for weak topics and mastered questions, return a formatted
    context string to inject into the LLM prompt.
    Returns empty string if no history exists.
    """
    prior = queries.get_sessions_for_sections(db, section_ids)
    if not prior:
        return ""

    weak = queries.get_weak_topics(db, section_ids, limit=8)
    mastered = queries.get_mastered_questions(db, section_ids)[:10]
    wrong = queries.get_wrong_questions(db, section_ids)[:10]

    lines = [
        f"This learner has completed {len(prior)} prior session(s) on these sections.",
        "",
    ]

    if weak:
        lines.append(
            f"WEAK AREAS — generate at least {int(_WEAK_TOPIC_WEIGHT * 100)}% of questions on these topics:"
        )
        for topic, count in weak:
            lines.append(f"  - {topic} (answered wrong {count} time(s))")
        lines.append("")

    if mastered:
        lines.append("MASTERED — do NOT regenerate questions that test these exact concepts:")
        for q in mastered[:5]:
            lines.append(f"  - {q[:120]}")
        lines.append("")

    if wrong:
        lines.append("PREVIOUSLY MISSED — consider generating new questions on these topics:")
        for q in wrong[:5]:
            lines.append(f"  - {q[:120]}")

    return "\n".join(lines)


def generate(
    db: DBSession,
    section_texts: dict[int, str],
    n_per_section: int = 5,
) -> list[dict[str, Any]]:
    """
    Generate MCQs for all requested sections.
    Returns a flat list of MCQ dicts, each annotated with section_id.
    """
    section_ids = list(section_texts.keys())
    adaptive_ctx = build_adaptive_context(db, section_ids)

    if adaptive_ctx:
        logger.info("Adaptive mode: injecting history context for sections %s", section_ids)
    else:
        logger.info("Cold-start mode for sections %s", section_ids)

    all_mcqs = []
    for section_id, text in section_texts.items():
        mcqs = llm_client.generate_mcqs(
            section_text=text,
            section_id=section_id,
            n=n_per_section,
            adaptive_context=adaptive_ctx,
        )
        for mcq in mcqs:
            mcq["section_id"] = section_id
        all_mcqs.extend(mcqs)

    return all_mcqs
