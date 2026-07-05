"""
Streamlit UI for the Adaptive Document Preparation System.
Run with: streamlit run streamlit_app.py
"""
import json
import sys
from pathlib import Path

import streamlit as st

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv()

st.set_page_config(
    page_title="Adaptive Prep System",
    page_icon="📚",
    layout="wide",
)

st.title("Adaptive Document Preparation System")
st.caption("SLATEFALL_DOSSIER — MCQ-based study sessions with adaptive history")


# ── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.header("Session Config")
    n_per_section = st.number_input("MCQs per section", min_value=1, max_value=20, value=5)
    sim_mode = st.selectbox("Answer mode", ["mixed", "correct", "wrong", "random"])
    st.divider()
    st.info("Select sections below and click **Run Prep Session**.")


# ── Section picker ───────────────────────────────────────────────────────────
@st.cache_data(show_spinner="Loading sections from PDF…")
def load_sections():
    try:
        from src import pdf_ingester
        return pdf_ingester.list_sections()
    except FileNotFoundError:
        return []


sections_meta = load_sections()

if not sections_meta:
    st.warning(
        "PDF not found. Place `SLATEFALL_DOSSIER.pdf` in the `data/` folder and restart."
    )
    st.stop()

section_options = {f"Section {s['section_id']}: {s['preview'][:60]}…": s["section_id"] for s in sections_meta}
selected_labels = st.multiselect(
    "Sections to study",
    options=list(section_options.keys()),
    default=list(section_options.keys())[:2],
)
selected_ids = [section_options[lbl] for lbl in selected_labels]


# ── Run session ──────────────────────────────────────────────────────────────
if st.button("Run Prep Session", type="primary", disabled=not selected_ids):
    with st.spinner("Generating questions via LLM…"):
        try:
            from src.prep_engine import run_prep_session
            result = run_prep_session(
                section_ids=selected_ids,
                n_per_section=n_per_section,
                simulate_mode=sim_mode,
            )
            st.session_state["last_result"] = result
        except RuntimeError as e:
            st.error(f"LLM error: {e}")
            st.stop()
        except FileNotFoundError as e:
            st.error(str(e))
            st.stop()
        except Exception as e:
            st.error(f"Unexpected error: {e}")
            st.stop()


# ── Display results ───────────────────────────────────────────────────────────
if "last_result" in st.session_state:
    result = st.session_state["last_result"]
    score = result["score"]

    # Score header
    col1, col2, col3 = st.columns(3)
    col1.metric("Score", f"{score['correct']}/{score['total']}")
    col2.metric("Percentage", f"{score['pct']}%")
    col3.metric(
        "Run type",
        "Cold-start" if result["is_first_run"] else "Adaptive (history used)",
    )

    st.divider()

    # Questions
    st.subheader("Questions & Answers")
    for i, q in enumerate(result["questions"], 1):
        icon = "✅" if q["is_correct"] else "❌"
        with st.expander(f"{icon} Q{i} (Section {q['section_id']}): {q['question'][:80]}…"):
            st.write(q["question"])
            for letter, text in q["choices"].items():
                prefix = "**→**" if letter == q["user_answer"] else "   "
                correct_marker = " ✓" if letter == q["correct_answer"] else ""
                st.markdown(f"{prefix} **{letter}.** {text}{correct_marker}")
            if not q["is_correct"]:
                st.error(q.get("clarification", ""))
            st.caption(f"Topics: {', '.join(q.get('topic_tags', []))}")

    # KB Snapshot
    st.divider()
    st.subheader("Knowledge Base Snapshot (top 5 sessions)")
    snap = result["kb_snapshot"]
    st.caption(f"Total sessions in KB: {snap['total_sessions']}")
    for s in snap["top_5_sessions"]:
        with st.expander(f"Session {s['session_id'][:8]}… — Sections {s['sections']} — Score {s['score']}"):
            st.json(s)

    # Raw JSON download
    st.divider()
    st.download_button(
        "Download questions JSON",
        data=json.dumps(
            {k: v for k, v in result.items() if k != "kb_snapshot"},
            indent=2,
        ),
        file_name="questions.json",
        mime="application/json",
    )
    st.download_button(
        "Download KB snapshot JSON",
        data=json.dumps(result["kb_snapshot"], indent=2),
        file_name="kb_snapshot.json",
        mime="application/json",
    )
