'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'

export function ResultsScreen() {
  const { session, startNew, setTab } = useStore()

  if (!session) return null

  const { score, questions, is_first_run, sections } = session
  const missed = questions.filter(q => !q.is_correct)
  const correct = questions.filter(q => q.is_correct)

  return (
    <section className="bg-white py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
            Session complete — Sections {sections.join(', ')}
          </p>
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-8xl font-black text-text-primary">{score.correct}</span>
            <span className="text-4xl font-light text-text-secondary mb-4">/ {score.total}</span>
          </div>
          <p className="text-3xl font-bold mb-2" style={{ color: '#1D4E5F' }}>{score.pct}%</p>

          {/* Score bar */}
          <div className="max-w-sm mx-auto mt-6 mb-4">
            <div className="h-3 bg-border rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score.pct}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: '#166534' }}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - score.pct}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="h-full"
                style={{ backgroundColor: '#FEE2E2' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-muted font-mono">
              <span>{score.correct} correct</span>
              <span>{score.total - score.correct} missed</span>
            </div>
          </div>

          {missed.length > 0 && (
            <p className="text-sm text-text-secondary">
              {missed.length} question{missed.length > 1 ? 's' : ''} missed — adaptive context will prioritize these topics next session
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: is_first_run ? '#DCFCE7' : '#E8F4F7',
                color: is_first_run ? '#166534' : '#1D4E5F',
              }}
            >
              {is_first_run ? 'Cold Start run' : 'Adaptive run — history was used'}
            </span>
          </div>
        </motion.div>

        {/* Missed questions */}
        {missed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-text-primary mb-6">Missed questions</h3>
            <div className="space-y-4">
              {missed.map((q, i) => (
                <motion.div
                  key={q.question_id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }}
                  className="rounded-xl p-6 border-l-4"
                  style={{ backgroundColor: '#FFFCF6', borderLeftColor: '#D97706', borderColor: '#E8E4DF' }}
                >
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
                    Section {q.section_id} — Missed
                  </p>
                  <p className="font-semibold text-text-primary mb-4">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="px-4 py-2 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FEE2E2' }}>
                      <span className="text-xs font-mono font-bold mt-0.5" style={{ color: '#DC2626' }}>Your answer</span>
                      <span className="text-sm text-text-primary">
                        {q.user_answer} — {q.choices[q.user_answer]}
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#DCFCE7' }}>
                      <span className="text-xs font-mono font-bold mt-0.5" style={{ color: '#166534' }}>Correct</span>
                      <span className="text-sm text-text-primary font-semibold">
                        {q.correct_answer} — {q.choices[q.correct_answer]}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-semibold text-text-secondary mb-1">Why this matters</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{q.explanation}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(q.topic_tags ?? []).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-xs font-mono"
                          style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Correct questions summary */}
        {correct.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-text-primary mb-4">Correct answers</h3>
            <div className="space-y-2">
              {correct.map(q => (
                <div
                  key={q.question_id}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg border-l-4"
                  style={{ backgroundColor: '#F0FDF4', borderLeftColor: '#166534', borderColor: '#E5E7EB' }}
                >
                  <span className="text-sage-success font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{q.question}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {q.correct_answer} — {q.choices[q.correct_answer]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={startNew}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(29,78,95,0.25)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: '#1D4E5F' }}
          >
            Start new session (Adaptive)
          </motion.button>
          <motion.button
            onClick={() => setTab('kb')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-lg font-semibold border-2 transition-all"
            style={{ borderColor: '#1D4E5F', color: '#1D4E5F' }}
          >
            Review weak topics
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
