'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StatCardProps {
  value: string | number
  label: string
  sublabel: string
  delay?: number
  isNumber?: boolean
}

export function StatCard({
  value,
  label,
  sublabel,
  delay = 0,
  isNumber = false,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isNumber || typeof value !== 'number') return

    const duration = 800
    const steps = 60
    const stepDuration = duration / steps
    const increment = value / steps

    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [value, isNumber])

  const containerVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="flex flex-col items-center py-6 border-r border-border last:border-r-0"
    >
      <div className="text-4xl font-black text-text-primary mb-2">
        {isNumber ? displayValue : value}
      </div>
      <div className="text-sm font-semibold text-text-primary text-center">{label}</div>
      <div className="text-xs text-text-muted text-center mt-1">{sublabel}</div>
    </motion.div>
  )
}
