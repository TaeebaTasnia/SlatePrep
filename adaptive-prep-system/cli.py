#!/usr/bin/env python3
"""
Adaptive Document Preparation System — CLI

Usage examples:
  python cli.py prep --sections 5,8 --simulate
  python cli.py prep --sections 3,7 --simulate --mode correct
  python cli.py scenario-a --sections 1,4
  python cli.py scenario-b
  python cli.py snapshot --session-id <uuid>
"""
import json
import logging
import os
import sys
from pathlib import Path

import click
from dotenv import load_dotenv

load_dotenv()

# Ensure src/ is importable regardless of working directory
sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)

OUTPUTS_DIR = Path(__file__).parent / "outputs"


def _save_outputs(result: dict, out_dir: Path, iteration: int | None = None) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    suffix = f"_iter{iteration}" if iteration else ""

    q_file = out_dir / f"questions{suffix}.json"
    snap_file = out_dir / f"kb_snapshot{suffix}.json"

    q_data = {
        "session_id": result["session_id"],
        "sections": result["sections"],
        "is_first_run": result["is_first_run"],
        "score": result["score"],
        "questions": [
            {k: v for k, v in q.items() if k != "kb_snapshot"}
            for q in result["questions"]
        ],
    }
    if iteration:
        q_data["iteration"] = iteration

    q_file.write_text(json.dumps(q_data, indent=2), encoding="utf-8")
    snap_file.write_text(json.dumps(result["kb_snapshot"], indent=2), encoding="utf-8")

    click.echo(f"  Saved: {q_file}")
    click.echo(f"  Saved: {snap_file}")


def _print_result_summary(result: dict) -> None:
    score = result["score"]
    click.echo(
        f"\nScore: {score['correct']}/{score['total']} ({score['pct']}%)"
    )
    click.echo(f"Session ID: {result['session_id']}")
    first = "Yes (cold-start)" if result["is_first_run"] else "No (adaptive)"
    click.echo(f"First run for these sections: {first}")
    wrong = [q for q in result["questions"] if not q["is_correct"]]
    if wrong:
        click.echo(f"\nMissed {len(wrong)} question(s):")
        for q in wrong:
            click.echo(f"  Q: {q['question'][:80]}...")
            click.echo(f"  Your answer: {q['user_answer']} | Correct: {q['correct_answer']}")
            click.echo(f"  {q.get('clarification', '')}\n")


@click.group()
def cli():
    """Adaptive Document Preparation System."""


@cli.command()
@click.option("--sections", required=True, help="Comma-separated section IDs, e.g. 5,8")
@click.option("--n", default=5, show_default=True, help="MCQs per section")
@click.option("--simulate", is_flag=True, help="Auto-simulate answers (skips interactive prompts)")
@click.option(
    "--mode",
    default="mixed",
    type=click.Choice(["mixed", "correct", "wrong", "random"]),
    show_default=True,
    help="Simulation mode",
)
@click.option("--output", default=None, help="Directory to save output JSON files")
def prep(sections: str, n: int, simulate: bool, mode: str, output: str | None):
    """Run a single prep session."""
    from src.prep_engine import run_prep_session

    section_ids = [int(s.strip()) for s in sections.split(",")]
    click.echo(f"\nStarting prep for sections {section_ids} ...")

    if not simulate:
        click.echo("Interactive mode not yet supported in CLI. Use --simulate flag.")
        sys.exit(1)

    result = run_prep_session(
        section_ids=section_ids,
        n_per_section=n,
        simulate_mode=mode,
    )

    _print_result_summary(result)

    if output:
        _save_outputs(result, Path(output))


@cli.command("scenario-a")
@click.option("--sections", default="3,7", show_default=True, help="Comma-separated section IDs")
@click.option("--n", default=5, show_default=True, help="MCQs per section")
@click.option("--mode", default="mixed", show_default=True)
def scenario_a(sections: str, n: int, mode: str):
    """Run Scenario A: cold-start prep over two sections."""
    from src.prep_engine import run_prep_session

    section_ids = [int(s.strip()) for s in sections.split(",")]
    click.echo(f"\n=== Scenario A: Cold-start prep over sections {section_ids} ===\n")

    result = run_prep_session(
        section_ids=section_ids,
        n_per_section=n,
        simulate_mode=mode,
    )
    _print_result_summary(result)
    click.echo("\nScenario A complete.")


@cli.command("scenario-b")
@click.option("--n", default=5, show_default=True, help="MCQs per section per iteration")
@click.option("--mode", default="mixed", show_default=True, help="Simulation mode")
def scenario_b(n: int, mode: str):
    """
    Run Scenario B: three consecutive iterations.

      Iter 1: sections 5, 8
      Iter 2: sections 6, 8, 9
      Iter 3: section 8

    Outputs saved to outputs/scenario_b_iterN/
    """
    from src.prep_engine import run_prep_session

    iterations = [
        ([5, 8],    1),
        ([6, 8, 9], 2),
        ([8],       3),
    ]

    click.echo("\n=== Scenario B: Three consecutive adaptive iterations ===\n")

    for section_ids, iteration in iterations:
        click.echo(f"--- Iteration {iteration}: sections {section_ids} ---")
        result = run_prep_session(
            section_ids=section_ids,
            n_per_section=n,
            simulate_mode=mode,
        )
        _print_result_summary(result)

        out_dir = OUTPUTS_DIR / f"scenario_b_iter{iteration}"
        _save_outputs(result, out_dir, iteration=iteration)
        click.echo()

    click.echo("=== Scenario B complete. Outputs saved to outputs/ ===")


@cli.command()
@click.option("--session-id", required=True, help="Session UUID")
def snapshot(session_id: str):
    """Print the KB snapshot for a given session."""
    from src.kb.database import get_session
    from src.kb import queries

    db = get_session()
    try:
        snap = queries.get_kb_snapshot(db)
        click.echo(json.dumps(snap, indent=2))
    finally:
        db.close()


if __name__ == "__main__":
    cli()
