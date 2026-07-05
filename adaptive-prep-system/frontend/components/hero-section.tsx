'use client'

import { motion } from 'framer-motion'
import { GradientMesh } from './gradient-mesh'
import { StatCard } from './stat-card'
import { TimelineCard } from './timeline-card'
import { mockStats, mockIterations } from '@/lib/mock-data'
import { useStore } from '@/lib/store'

export function HeroSection() {
  const { setTab } = useStore()

  const titleWords = ['Prepare', 'smarter', 'from', 'structured', 'documents.']

  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden">
      <GradientMesh />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          {/* Left */}
          <div className="lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="text-xs font-mono font-semibold tracking-widest mb-6"
              style={{ color: '#1D4E5F' }}
            >
              ADAPTIVE PREP SYSTEM
            </motion.p>

            <motion.h1 className="text-6xl md:text-7xl font-black text-text-primary mb-6 leading-tight">
              {titleWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.06 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="text-lg text-text-secondary mb-8 max-w-xl leading-relaxed"
            >
              Generate MCQs from selected PDF sections, track mistakes, and adapt the next session toward weak topics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.button
                onClick={() => setTab('sections')}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(29,78,95,0.25)' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 text-white font-semibold rounded-lg transition-all"
                style={{ backgroundColor: '#1D4E5F' }}
              >
                Start Prep Session
              </motion.button>
              <motion.button
                onClick={() => setTab('kb')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 font-semibold rounded-lg border-2 transition-all"
                style={{ borderColor: '#1D4E5F', color: '#1D4E5F', backgroundColor: 'transparent' }}
              >
                View Knowledge Base
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {mockStats.map((stat, i) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} sublabel={stat.sublabel} delay={i * 0.08} />
              ))}
            </motion.div>
          </div>

          {/* Right — Scenario card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-1">
                <h3 className="font-bold text-lg text-text-primary">Scenario B — Evaluation Run</h3>
                <p className="text-xs text-text-muted font-mono mt-1">Scenario B — three consecutive adaptive iterations</p>
              </div>
              <div className="mt-6 space-y-1">
                {mockIterations.map((iter, i) => (
                  <TimelineCard key={iter.id} iteration={iter} index={i} compact />
                ))}
              </div>
              <p className="text-xs font-mono text-text-muted mt-5 pt-4 border-t border-border">
                Simulated answers — 60% correct / 40% wrong (mixed mode)
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
