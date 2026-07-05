'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  delay?: number
}

export function ProgressBar({
  current,
  total,
  label,
  delay = 0,
}: ProgressBarProps) {
  const percentage = (current / total) * 100

  const barVariant = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <span className="text-sm text-text-secondary font-semibold">
            {current} / {total}
          </span>
        </div>
      )}
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          variants={barVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="h-full bg-teal-primary rounded-full"
          style={{
            originX: 0,
            width: `${percentage}%`,
            backgroundColor: '#1D4E5F',
          }}
        />
      </div>
    </div>
  )
}
