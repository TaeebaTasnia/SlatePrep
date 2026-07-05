"""
Simulates user answers for evaluation purposes.
Modes:
  mixed    — 60% correct, 40% wrong (default; shows adaptive behavior)
  correct  — all correct
  wrong    — all wrong
  random   — random correct/wrong
"""
import random
from typing import Any


def simulate(
    questions: list[dict[str, Any]],
    mode: str = "mixed",
    seed: int = 42,
) -> list[dict[str, Any]]:
    """
    Return the questions list with a 'user_answer' key added to each.
    Does not mutate the original dicts.
    """
    rng = random.Random(seed)
    results = []
    for q in questions:
        correct = q["correct_answer"]
        wrong_choices = [c for c in ("A", "B", "C", "D") if c != correct]

        if mode == "correct":
            answer = correct
        elif mode == "wrong":
            answer = rng.choice(wrong_choices)
        elif mode == "random":
            answer = rng.choice(["A", "B", "C", "D"])
        else:  # mixed
            answer = correct if rng.random() < 0.6 else rng.choice(wrong_choices)

        results.append({**q, "user_answer": answer})
    return results
