"""
Groq LLM client for MCQ generation and clarification.
Falls back gracefully if GROQ_API_KEY is not set (raises RuntimeError).
"""
import json
import os
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

_GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
_MAX_TOKENS = int(os.environ.get("LLM_MAX_TOKENS", "4096"))
_TEMPERATURE = float(os.environ.get("LLM_TEMPERATURE", "0.7"))

_MCQ_SYSTEM_PROMPT = """\
You are an expert quiz writer. Given document text, generate multiple-choice questions (MCQs).

Each MCQ must have:
- A clear question
- Exactly 4 choices labeled A, B, C, D
- One correct answer (the letter only)
- A concise explanation (1–3 sentences) of why the answer is correct
- 2–4 topic_tags (short keywords summarising the concept tested)

Respond ONLY with a valid JSON array. No markdown, no explanation outside JSON.
Schema per item:
{
  "question": "string",
  "choices": {"A": "string", "B": "string", "C": "string", "D": "string"},
  "correct_answer": "A"|"B"|"C"|"D",
  "explanation": "string",
  "topic_tags": ["string", ...]
}
"""


def _get_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        # Try loading directly from the .env file as a fallback
        env_file = Path(__file__).resolve().parent.parent / ".env"
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                line = line.strip()
                if line.startswith("GROQ_API_KEY=") and not line.startswith("#"):
                    api_key = line.split("=", 1)[1].strip()
                    os.environ["GROQ_API_KEY"] = api_key
                    break
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY environment variable not set. "
            "Get a free key at https://console.groq.com/"
        )
    try:
        from groq import Groq
        return Groq(api_key=api_key)
    except ImportError:
        raise RuntimeError("groq package not installed. Run: pip install groq")


def generate_mcqs(
    section_text: str,
    section_id: int,
    n: int,
    adaptive_context: str = "",
) -> list[dict[str, Any]]:
    """
    Generate n MCQs for the given section text.
    adaptive_context is injected into the user prompt when history exists.
    """
    client = _get_client()

    user_prompt = f"Section {section_id} content:\n\n{section_text[:6000]}\n\n"
    if adaptive_context:
        user_prompt += f"ADAPTIVE CONTEXT (use this to guide question selection):\n{adaptive_context}\n\n"
    user_prompt += f"Generate exactly {n} MCQs based on the section content above."

    logger.info("Calling Groq (model=%s, section=%d, n=%d)", _GROQ_MODEL, section_id, n)

    response = client.chat.completions.create(
        model=_GROQ_MODEL,
        messages=[
            {"role": "system", "content": _MCQ_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=_TEMPERATURE,
        max_tokens=_MAX_TOKENS,
    )

    raw = response.choices[0].message.content.strip()
    logger.debug("Raw LLM response (section=%d): %s", section_id, raw[:300])

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    mcqs = json.loads(raw)
    if not isinstance(mcqs, list):
        raise ValueError(f"Expected JSON array from LLM, got: {type(mcqs)}")

    validated = []
    for item in mcqs:
        _validate_mcq(item)
        validated.append(item)

    return validated[:n]  # safety cap


def _validate_mcq(item: dict) -> None:
    required = {"question", "choices", "correct_answer", "explanation", "topic_tags"}
    missing = required - item.keys()
    if missing:
        raise ValueError(f"MCQ missing fields: {missing}. Got: {item}")
    if item["correct_answer"] not in ("A", "B", "C", "D"):
        raise ValueError(f"Invalid correct_answer: {item['correct_answer']}")
    choices = item["choices"]
    if not all(k in choices for k in ("A", "B", "C", "D")):
        raise ValueError(f"MCQ choices must have A,B,C,D. Got: {list(choices.keys())}")
