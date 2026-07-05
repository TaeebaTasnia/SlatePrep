'use client'

import { motion } from 'framer-motion'
import { mockIterations } from '@/lib/mock-data'
import { BadgeGroup } from './badge-group'

export function TimelineScreen() {

  return (
    <section className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h2 className="text-5xl font-black text-text-primary mb-4">
            Scenario B — Adaptive Evidence
          </h2>
          <p className="text-lg text-text-secondary">
            Three consecutive prep sessions demonstrating progressive adaptation using the Knowledge Base.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
            }}
            className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-primary"
            style={{ originY: 0 }}
          />

          {/* Timeline items */}
          <div className="space-y-8">
            {mockIterations.map((iteration, index) => (
              <motion.div
                key={iteration.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 + index * 0.2,
                }}
                className="relative pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-14 flex items-center justify-center">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-teal-primary border-4 border-white"
                    animate={{
                      boxShadow: iteration.badge === 'Adaptive'
                        ? [
                          '0 0 0 0 rgba(29, 78, 95, 0.7)',
                          '0 0 0 8px rgba(29, 78, 95, 0)',
                        ]
                        : 'none',
                    }}
                    transition={{
                      duration: 2,
                      repeat: iteration.badge === 'Adaptive' ? Infinity : 0,
                    }}
                  />
                </div>

                {/* Badge */}
                <div 
                  className="absolute -top-2 left-20 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: iteration.badgeBg,
                    color: iteration.badgeText,
                  }}
                >
                  {iteration.badge}
                </div>

                {/* Content card */}
                <div className="bg-white border-l-4 border-white rounded-lg p-8 mt-4" style={{ borderLeftColor: iteration.borderColor }}>
                  {/* Row 1: Sections, Questions, Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <span className="text-sm font-mono text-text-muted">ITERATION {iteration.number}</span>
                      <div className="text-lg font-bold text-text-primary">
                        Sections {iteration.sections} · {iteration.questions} questions
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <span className="text-sm text-text-muted">Score:</span>
                      <div className="text-3xl font-black">
                        <span style={{ color: iteration.borderColor }}>
                          {iteration.score}
                        </span>
                        <span className="text-lg text-text-secondary"> / {iteration.scoreTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Mode */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-sm text-text-secondary">{iteration.mode}</p>
                  </div>

                  {/* Row 3: Prompt context (if exists) */}
                  {iteration.promptContext && (
                    <div className="mb-6 pb-6 border-b border-border">
                      <motion.div
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: '#F0F9FF',
                          borderLeft: '2px solid #1D4E5F',
                        }}
                      >
                        <p className="font-mono text-sm text-text-primary whitespace-pre-wrap">
                          {iteration.promptContext}
                        </p>
                      </motion.div>
                    </div>
                  )}

                  {/* Row 4: Weak topics */}
                  {iteration.weakTopics && iteration.weakTopics.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-border">
                      <BadgeGroup
                        badges={iteration.weakTopics}
                        color={iteration.number === 1 ? 'amber' : iteration.number === 2 ? 'teal' : 'amber'}
                        containerDelay={0.1 + index * 0.2 + 0.3}
                      />
                    </div>
                  )}

                  {/* Row 5: Files */}
                  <div className="flex flex-wrap gap-3">
                    {iteration.files.map((file) => (
                      <motion.div
                        key={file}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          ease: [0.34, 1.56, 0.64, 1],
                          delay: 0.1 + index * 0.2 + 0.4,
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2"
                        style={{
                          backgroundColor: '#F3F4F6',
                          color: '#6B7280',
                        }}
                      >
                        <span>📄</span>
                        <span>{file}</span>
                        <span style={{ color: '#166534' }}>✓ Saved</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Insight note for iteration 3 */}
                  {iteration.insight && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + index * 0.2 + 0.5,
                      }}
                      className="mt-6 pt-6 border-t border-border p-4 rounded-lg"
                      style={{
                        backgroundColor: '#FEF3C7',
                        borderLeft: '2px solid #D97706',
                      }}
                    >
                      <p className="text-sm text-text-primary italic">
                        {iteration.insight}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center text-xs text-text-muted font-mono mt-12 pt-8 border-t border-border"
          >
            Scenario B uses sections 5,8 → 6,8,9 → 8 across three iterations.<br />
            The system supports arbitrary section selection for all other prep sessions.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
