/**
 * SlatePrep API client.
 *
 * All functions fall back to mock data when NEXT_PUBLIC_API_URL is not set
 * (i.e. pure frontend demo mode). Set the env var to wire up the real backend.
 *
 * Backend base URL: http://localhost:8000  (uvicorn api.main:app)
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const detail = body?.detail ?? null
    throw new Error(`GET ${path} → ${res.status}${detail ? `: ${detail}` : ''}`)
  }
  return res.json() as Promise<T>
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    const detail = errBody?.detail ?? null
    throw new Error(`POST ${path} → ${res.status}${detail ? `: ${detail}` : ''}`)
  }
  return res.json() as Promise<T>
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface Section {
  section_id: number
  preview: string
}

export interface PrepSession {
  session_id: string
  sections: number[]
  is_first_run: boolean
  questions: Question[]
  score: { correct: number; total: number; pct: number }
  kb_snapshot: KBSnapshot
}

export interface Question {
  question_id: string
  section_id: number
  question: string
  choices: Record<string, string>
  correct_answer: string
  explanation: string
  topic_tags: string[]
  user_answer: string
  is_correct: boolean
  clarification?: string
}

export interface KBSnapshot {
  snapshot_at: string
  total_sessions: number
  top_5_sessions: SessionRecord[]
}

export interface SessionRecord {
  session_id: string
  created_at: string
  sections: number[]
  score: string
  weak_topics: string[]
  questions: Question[]
}

// ── API calls ──────────────────────────────────────────────────────────────

/** Check if the backend is reachable. */
export async function healthCheck(): Promise<boolean> {
  if (!BASE) return false
  try {
    const data = await get<{ status: string }>('/health')
    return data.status === 'ok'
  } catch {
    return false
  }
}

/** List all sections parsed from the PDF. */
export async function fetchSections(): Promise<Section[]> {
  if (!BASE) return []
  const data = await get<{ sections: Section[] }>('/sections')
  return data.sections
}

/**
 * Start a new prep session.
 * simulate_mode: "mixed" | "correct" | "wrong" | "random"
 */
export async function startSession(
  sectionIds: number[],
  nPerSection = 5,
  simulateMode = 'mixed',
): Promise<PrepSession> {
  return post<PrepSession>('/sessions', {
    section_ids: sectionIds,
    n_per_section: nPerSection,
    simulate_mode: simulateMode,
  })
}

/** Get KB snapshot for a given session. */
export async function fetchSnapshot(sessionId: string): Promise<KBSnapshot> {
  return get<KBSnapshot>(`/sessions/${sessionId}/snapshot`)
}
