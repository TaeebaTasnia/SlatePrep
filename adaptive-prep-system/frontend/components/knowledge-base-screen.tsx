'use client'

import { motion } from 'framer-motion'
import { mockWeakTopics, mockMasteredQuestions } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export function KnowledgeBaseScreen() {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const priorityColors = {
    high: { bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' },
    medium: { bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
    low: { bg: '#DCFCE7', text: '#166534', dot: '#166534' },
  }

  return (
    <section className="bg-surface-alt py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black text-text-primary mb-4">
            Knowledge Base Memory
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            Every session, question, and answer is persisted in SQLite. Weak topic signals drive adaptive MCQ generation on return visits.
          </p>
        </motion.div>

        {/* Pipeline diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-12">
            {['PDF Sections', 'Generated MCQs', 'User Answers', 'Weak Topic Signals', 'Adaptive Prompt Context'].map(
              (label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center"
                >
                  <div className="bg-white border border-border rounded-lg p-4 w-32 text-center">
                    <div className="text-sm font-semibold text-text-primary">
                      {label}
                    </div>
                  </div>
                  {index < 4 && (
                    <div className="hidden lg:block w-8 h-px bg-teal-primary mx-2" />
                  )}
                </motion.div>
              )
            )}
          </div>
        </motion.div>

        {/* Schema cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { title: 'sessions', fields: ['session_id', 'created_at', 'section_ids', 'score'] },
            { title: 'questions', fields: ['question_id', 'section_id', 'text', 'choices', 'topic_tags'] },
            { title: 'answers', fields: ['answer_id', 'user_answer', 'is_correct', 'answered_at'] },
          ].map((schema, index) => (
            <motion.div
              key={schema.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: 0.25 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-white border-l-4 border-teal-primary rounded-lg p-6"
            >
              <h4 className="font-bold text-text-primary mb-3">{schema.title}</h4>
              <div className="space-y-2">
                {schema.fields.map((field) => (
                  <div
                    key={field}
                    className="text-xs font-mono text-text-muted"
                  >
                    • {field}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Weak topics table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-4">Weak Topic Summary</h3>
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                      Section
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                      Topic
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                      Wrong
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockWeakTopics.map((row, index) => {
                    const priority =
                      priorityColors[row.priority as keyof typeof priorityColors]
                    return (
                      <motion.tr
                        key={`${row.section}-${row.topic}`}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.35 + index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }
                      >
                        <td className="px-6 py-4 text-sm text-text-primary font-medium">
                          {row.section}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-primary">
                          {row.topic}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-text-primary">
                          {row.wrong}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {row.total}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: priority.dot }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {row.action}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Mastered questions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="bg-white border-l-4 border-sage-success rounded-xl p-8"
        >
          <h4 className="text-xl font-bold text-sage-success mb-4">
            Mastered questions avoided
          </h4>
          <ul className="space-y-3 mb-4">
            {mockMasteredQuestions.map((question, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.45 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-3 text-text-primary text-sm"
              >
                <span className="text-sage-success font-bold mt-0.5">✓</span>
                <span>{question}</span>
              </motion.li>
            ))}
          </ul>
          <p className="text-xs text-text-muted font-mono mt-4 pt-4 border-t border-border">
            Answered correctly in prior sessions. Excluded from adaptive generation.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
