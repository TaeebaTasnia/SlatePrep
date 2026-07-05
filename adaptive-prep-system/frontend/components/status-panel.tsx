'use client'

import { motion } from 'framer-motion'
import { mockStatusPanel } from '@/lib/mock-data'

export function StatusPanel() {
  const dotColors = {
    sage: '#166534',
    teal: '#1D4E5F',
  }

  return (
    <section className="bg-surface-alt py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="space-y-4">
            {mockStatusPanel.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Pulsing dot */}
                <motion.div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dotColors[item.color as keyof typeof dotColors] }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.4, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Content */}
                <div className="flex-1">
                  <div className="text-sm font-bold text-text-primary">
                    {item.dot} · {item.service}
                  </div>
                  <div className="text-xs text-text-muted font-mono mt-0.5">
                    {item.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
