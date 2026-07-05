"""
Parse SLATEFALL_DOSSIER.pdf and split it into numbered sections.

Strategy: detect section boundaries by looking for lines that match
common heading patterns (e.g. "Section 1", "1.", "CHAPTER 1", etc.).
Falls back to equal page-count splitting when no headings are detected.
"""
import re
import os
from pathlib import Path
from typing import Optional

try:
    import fitz  # PyMuPDF
    _FITZ_AVAILABLE = True
except ImportError:
    _FITZ_AVAILABLE = False

_DEFAULT_PDF = Path(__file__).parent.parent / "data" / "SLATEFALL_DOSSIER.pdf"

# Patterns that indicate the start of a new section
_SECTION_PATTERNS = [
    re.compile(r"^\s*(?:section|chapter|part)\s+(\d+)\b", re.IGNORECASE),
    re.compile(r"^\s*(\d+)\.\s+[A-Z][A-Za-z\s]{3,}$"),   # "5. Some Title"
    re.compile(r"^\s*(\d+)\s*[-–—:]\s+[A-Z][A-Za-z\s]{3,}$"),  # "5 – Title"
]


def _detect_section_number(line: str) -> Optional[int]:
    for pat in _SECTION_PATTERNS:
        m = pat.match(line)
        if m:
            return int(m.group(1))
    return None


def extract_full_text(pdf_path: Path = _DEFAULT_PDF) -> str:
    if not _FITZ_AVAILABLE:
        raise RuntimeError("PyMuPDF not installed. Run: pip install pymupdf")
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    doc = fitz.open(str(pdf_path))
    pages = [page.get_text() for page in doc]
    doc.close()
    return "\n".join(pages)


def extract_sections(
    section_ids: list[int],
    pdf_path: Path = _DEFAULT_PDF,
    n_sections: int = 10,
) -> dict[int, str]:
    """
    Return {section_id: text} for the requested section IDs.
    Raises FileNotFoundError if the PDF is missing.
    """
    all_sections = get_all_sections(pdf_path, n_sections)
    result = {}
    for sid in section_ids:
        if sid not in all_sections:
            raise ValueError(f"Section {sid} not found. Available: {sorted(all_sections)}")
        result[sid] = all_sections[sid]
    return result


def get_all_sections(
    pdf_path: Path = _DEFAULT_PDF,
    n_sections: int = 10,
) -> dict[int, str]:
    """Parse the PDF and return all detected sections as {section_number: text}."""
    if not _FITZ_AVAILABLE:
        raise RuntimeError("PyMuPDF not installed. Run: pip install pymupdf")
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    doc = fitz.open(str(pdf_path))
    pages_text = [page.get_text() for page in doc]
    doc.close()

    sections = _split_by_headings(pages_text, n_sections)
    if not sections:
        sections = _split_by_pages(pages_text, n_sections)
    return sections


def _split_by_headings(pages_text: list[str], n_sections: int) -> dict[int, str]:
    """Try to detect section headings and split accordingly."""
    current_section = None
    buffers: dict[int, list[str]] = {}

    for page_text in pages_text:
        for line in page_text.splitlines():
            detected = _detect_section_number(line)
            if detected is not None and 1 <= detected <= n_sections:
                current_section = detected
                buffers.setdefault(current_section, [])
            if current_section is not None:
                buffers[current_section].append(line)

    if not buffers:
        return {}

    return {sid: "\n".join(lines).strip() for sid, lines in buffers.items()}


def _split_by_pages(pages_text: list[str], n_sections: int) -> dict[int, str]:
    """Fallback: divide pages evenly across n_sections."""
    total = len(pages_text)
    pages_per_section = max(1, total // n_sections)
    sections = {}
    for i in range(n_sections):
        start = i * pages_per_section
        end = start + pages_per_section if i < n_sections - 1 else total
        sections[i + 1] = "\n".join(pages_text[start:end]).strip()
    return sections


def list_sections(pdf_path: Path = _DEFAULT_PDF, n_sections: int = 10) -> list[dict]:
    """Return a summary of all sections (id + first 200 chars of text)."""
    sections = get_all_sections(pdf_path, n_sections)
    return [
        {"section_id": sid, "preview": text[:200].replace("\n", " ")}
        for sid, text in sorted(sections.items())
    ]
