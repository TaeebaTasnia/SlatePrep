'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface SectionCardProps {
  number: string
  title: string
  status: string
  density: number
  isSelected?: boolean
  isRepeated?: boolean
  onClick?: () => void
  delay?: number
}

const statusStyles = {
  Fresh: { bg: '#F3F4F6', text: '#6B7280' },
  Practiced: { bg: '#DCFCE7', text: '#166534' },
  'Weak Signals': { bg: '#FEF3C7', text: '#D97706' },
}

export function SectionCard({
  number,
  title,
  status,
  density,
  isSelected = false,
  isRepeated = false,
  onClick,
  delay = 0,
}: SectionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardVariant = {
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

  const statusColor = statusStyles[status as keyof typeof statusStyles] || statusStyles.Fresh

  let borderColor = '#E5E7EB'
  let bgColor = '#FFFFFF'
  let numberColor = '#9CA3AF'
  let leftBorderColor = '#E5E7EB'

  if (isSelected) {
    borderColor = isRepeated ? '#D97706' : '#1D4E5F'
    bgColor = isRepeated ? '#FEF3C7' : '#E8F4F7'
    numberColor = isRepeated ? '#D97706' : '#1D4E5F'
    leftBorderColor = isRepeated ? '#D97706' : '#1D4E5F'
  }

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      className="p-6 rounded-xl border-2 cursor-pointer transition-all relative"
      style={{
        borderColor,
        backgroundColor: bgColor,
        borderLeftColor: leftBorderColor,
        borderLeftWidth: isSelected ? '3px' : '2px',
      }}
    >
      {/* Repeated badge */}
      {isRepeated && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 left-6 right-6 px-3 py-1 rounded-lg text-xs font-semibold text-center"
          style={{
            backgroundColor: '#FEF3C7',
            color: '#D97706',
          }}
        >
          ★ Central to Scenario B — appears in all 3 iterations
        </motion.div>
      )}

      <div className={isRepeated ? 'mt-6' : ''}>
        <div className="mb-3">
          <span
            className="text-2xl font-black"
            style={{ color: numberColor }}
          >
            {number}
          </span>
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-4">{title}</h3>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted">Reading density</span>
            <span className="text-xs font-semibold text-text-primary">{density}%</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: delay + 0.2 }}
              className="h-full bg-teal-primary"
              style={{
                width: `${density}%`,
                originX: 0,
              }}
            />
          </div>
        </div>

        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
          }}
        >
          {status === 'Weak Signals' && <span className="mr-1">⚠</span>}
          {status}
        </div>
      </div>
    </motion.div>
  )
}
