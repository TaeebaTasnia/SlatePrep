'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { AnswerOption } from './answer-option'
import { ProgressBar } from './progress-bar'

export function MCQSessionScreen() {
  const { session, currentIdx, answers, goNext, goPrev, selectAnswer, submitSession, setTab } = useStore()

  if (!session || session.questions.length === 0) {
    return (
      <section className="bg-white py-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">No active session. Select sections to begin.</p>
          <button
            onClick={() => setTab('sections')}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: '#1D4E5F' }}
          >
            Go to Sections
          </button>
        </div>
      </section>
    )
  }

  const q = session.questions[currentIdx]
  const totalQ = session.questions.length
  const userAnswer = answers[q.question_id] ?? ''
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === totalQ
  const answerLetters = ['A', 'B', 'C', 'D'] as const

  return (
    <section className="bg-white py-24 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-12 pb-6 border-b border-border"
        >
          <h2 className="text-xl font-bold text-text-primary">
            Session — Sections {session.sections.join(', ')}
          </h2>
          <div className="flex-1 mx-8 max-w-xs">
            <ProgressBar current={currentIdx + 1} total={totalQ} label="Progress" />
          </div>
          <div
            className="px-4 py-2 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: session.is_first_run ? '#DCFCE7' : '#E8F4F7',
              color: session.is_first_run ? '#166534' : '#1D4E5F',
            }}
          >
            {session.is_first_run ? 'Cold Start' : 'Adaptive'}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={q.question_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="bg-white border border-border rounded-xl p-8 mb-8 shadow-sm">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
                    Question {currentIdx + 1} of {totalQ}
                  </p>
                  <p className="text-xl font-bold text-text-primary leading-relaxed">{q.question}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {answerLetters.map((letter, i) => (
                    <AnswerOption
                      key={letter}
                      letter={letter}
                      text={q.choices[letter] ?? ''}
                      isSelected={userAnswer === letter}
                      onClick={() => selectAnswer(q.question_id, letter)}
                      delay={i * 0.06}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <motion.button
                onClick={goPrev}
                disabled={currentIdx === 0}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-lg border border-border font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: '#1D4E5F' }}
              >
                Previous
              </motion.button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted font-mono">{answeredCount}/{totalQ} answered</span>
                {currentIdx < totalQ - 1 ? (
                  <motion.button
                    onClick={goNext}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
                    style={{ backgroundColor: '#1D4E5F' }}
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={submitSession}
                    disabled={!allAnswered}
                    whileTap={allAnswered ? { scale: 0.97 } : {}}
                    className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: allAnswered ? '#166534' : '#9CA3AF' }}
                  >
                    {allAnswered ? 'Submit and Score' : `Answer ${totalQ - answeredCount} more`}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">Question details</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Source</p>
                  <p className="text-sm font-semibold text-text-primary">Section {q.section_id}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-2">Topic tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(q.topic_tags ?? []).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs font-mono"
                        style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Adaptation mode</p>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: session.is_first_run ? '#DCFCE7' : '#E8F4F7',
                      color: session.is_first_run ? '#166534' : '#1D4E5F',
                    }}
                  >
                    {session.is_first_run ? 'Cold Start' : 'Adaptive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-3">All questions</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {session.questions.map((sq, i) => {
                  const answered = !!answers[sq.question_id]
                  const isCurrent = i === currentIdx
                  return (
                    <div key={sq.question_id} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          backgroundColor: isCurrent ? '#1D4E5F' : answered ? '#DCFCE7' : '#F3F4F6',
                          color: isCurrent ? '#fff' : answered ? '#166534' : '#9CA3AF',
                        }}
                      >
                        {i + 1}
                      </div>
                      <span
                        className="truncate"
                        style={{ color: isCurrent ? '#0D0D0D' : '#9CA3AF' }}
                      >
                        {sq.question.substring(0, 40)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
