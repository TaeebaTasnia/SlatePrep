'use client'

import { motion } from 'framer-motion'

interface Iteration {
  id: number
  number: number
  badge: string
  badgeBg: string
  badgeText: string
  borderColor: string
  sections: string
  questions: number
  score: number
  scoreTotal: number
  mode: string
  promptContext?: string
  weakTopics?: string[]
  insight?: string
  files: string[]
}

interface TimelineCardProps {
  iteration: Iteration
  index: number
  compact?: boolean
}

export function TimelineCard({ iteration, index, compact = false }: TimelineCardProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
        className="flex items-start gap-3 py-3 border-b border-border last:border-0"
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ backgroundColor: iteration.badgeBg, color: iteration.badgeText }}
        >
          {iteration.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-text-primary">Sections {iteration.sections}</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-semibold"
              style={{ backgroundColor: iteration.badgeBg, color: iteration.badgeText }}
            >
              {iteration.badge}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            {iteration.questions} questions · Score {iteration.score}/{iteration.scoreTotal}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.2 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Vertical line */}
      {index < 2 && (
        <div className="absolute left-3 top-6 bottom-0 w-0.5" style={{ backgroundColor: '#E5E7EB' }} />
      )}

      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.2 + 0.1 }}
        className="absolute left-0 top-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: iteration.borderColor, color: '#fff', boxShadow: '0 0 0 3px #E5E7EB' }}
      >
        {iteration.number}
      </motion.div>

      {/* Card */}
      <div
        className="rounded-xl border p-6 border-l-4"
        style={{ borderLeftColor: iteration.borderColor, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-bold text-text-primary text-lg">Iteration {iteration.number}</h4>
            <p className="text-sm text-text-secondary">Sections {iteration.sections}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: iteration.badgeBg, color: iteration.badgeText }}
            >
              {iteration.badge}
            </span>
            <span className="text-sm font-bold text-text-primary">
              {iteration.score}/{iteration.scoreTotal}
            </span>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4">{iteration.mode}</p>

        {iteration.promptContext && (
          <div
            className="rounded-lg p-4 mb-4 border-l-2 font-mono text-xs leading-relaxed"
            style={{ backgroundColor: '#F0F9FF', borderLeftColor: '#1D4E5F', color: '#374151' }}
          >
            {iteration.promptContext}
          </div>
        )}

        {iteration.weakTopics && iteration.weakTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {iteration.weakTopics.map(topic => (
              <span
                key={topic}
                className="px-2.5 py-1 rounded-full text-xs font-mono"
                style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {iteration.insight && (
          <div
            className="rounded-lg p-4 mb-4 text-sm italic"
            style={{ backgroundColor: '#FEF9C3', color: '#92400E', borderLeft: '3px solid #D97706' }}
          >
            {iteration.insight}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {iteration.files.map(file => (
            <span
              key={file}
              className="px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5"
              style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
            >
              <span style={{ color: '#166534' }}>✓</span>
              {file}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
