'use client'

/**
 * Global app state — React Context.
 * Manages tab navigation, section selection, session lifecycle, and API calls.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { startSession, PrepSession, Question } from './api'

// ── Types ──────────────────────────────────────────────────────────────────

export type Tab = 'dashboard' | 'sections' | 'session' | 'kb' | 'exports'

interface AppState {
  activeTab: Tab
  selectedSections: number[]
  nPerSection: number
  session: PrepSession | null
  currentIdx: number
  answers: Record<string, string>   // question_id → letter
  submitted: boolean
  isLoading: boolean
  error: string | null
}

interface AppActions {
  setTab: (tab: Tab) => void
  toggleSection: (id: number) => void
  setN: (n: number) => void
  generateMCQs: () => Promise<void>
  selectAnswer: (questionId: string, letter: string) => void
  goNext: () => void
  goPrev: () => void
  submitSession: () => void
  startNew: () => void
}

// ── Context ────────────────────────────────────────────────────────────────

const StoreContext = createContext<(AppState & AppActions) | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<Tab>('dashboard')
  const [selectedSections, setSelectedSections] = useState<number[]>([5, 8])
  const [nPerSection, setNPerSection] = useState(5)
  const [session, setSession] = useState<PrepSession | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setTab = useCallback((tab: Tab) => {
    setActiveTabState(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const toggleSection = useCallback((id: number) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }, [])

  const setN = useCallback((n: number) => {
    setNPerSection(Math.max(1, Math.min(20, n)))
  }, [])

  const generateMCQs = useCallback(async () => {
    if (selectedSections.length === 0) {
      setError('Select at least one section before generating MCQs.')
      return
    }
    setIsLoading(true)
    setError(null)
    setAnswers({})
    setSubmitted(false)
    setCurrentIdx(0)
    try {
      const result = await startSession(selectedSections, nPerSection, 'mixed')
      // Strip simulated answers so the user can answer themselves
      const cleanQuestions = result.questions.map((q, i) => ({
        ...q,
        question_id: q.question_id ?? `q-${i}`,
        user_answer: '',
        is_correct: false,
      }))
      setSession({ ...result, questions: cleanQuestions })
      setActiveTabState('session')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(
        e instanceof Error
          ? `Failed to generate MCQs: ${e.message}`
          : 'Failed to generate MCQs. Is the backend running?'
      )
    } finally {
      setIsLoading(false)
    }
  }, [selectedSections, nPerSection])

  const selectAnswer = useCallback((questionId: string, letter: string) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: letter }))
  }, [submitted])

  const goNext = useCallback(() => {
    if (!session) return
    setCurrentIdx(i => Math.min(i + 1, session.questions.length - 1))
  }, [session])

  const goPrev = useCallback(() => {
    setCurrentIdx(i => Math.max(i - 1, 0))
  }, [])

  const submitSession = useCallback(() => {
    if (!session) return
    // Score locally — compare user answers to correct_answer
    const scored = session.questions.map(q => {
      const userAns = answers[q.question_id] ?? ''
      const isCorrect = userAns === q.correct_answer
      return {
        ...q,
        user_answer: userAns,
        is_correct: isCorrect,
        clarification: !isCorrect
          ? `Correct answer: ${q.correct_answer}. ${q.explanation}`
          : undefined,
      }
    })
    const correct = scored.filter(q => q.is_correct).length
    setSession({
      ...session,
      questions: scored,
      score: {
        correct,
        total: scored.length,
        pct: Math.round((correct / scored.length) * 100 * 10) / 10,
      },
    })
    setSubmitted(true)
    setCurrentIdx(0)
  }, [session, answers])

  const startNew = useCallback(() => {
    setSession(null)
    setAnswers({})
    setSubmitted(false)
    setCurrentIdx(0)
    setError(null)
    setActiveTabState('sections')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <StoreContext.Provider
      value={{
        activeTab, selectedSections, nPerSection, session,
        currentIdx, answers, submitted, isLoading, error,
        setTab, toggleSection, setN, generateMCQs,
        selectAnswer, goNext, goPrev, submitSession, startNew,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
