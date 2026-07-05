'use client'

import { motion } from 'framer-motion'

interface BadgeGroupProps {
  badges: string[]
  color?: 'amber' | 'sage' | 'teal' | 'gray'
  containerDelay?: number
}

const colorStyles = {
  amber: {
    bg: '#FEF3C7',
    text: '#D97706',
  },
  sage: {
    bg: '#DCFCE7',
    text: '#166534',
  },
  teal: {
    bg: '#E8F4F7',
    text: '#1D4E5F',
  },
  gray: {
    bg: '#F3F4F6',
    text: '#6B7280',
  },
}

export function BadgeGroup({
  badges = [],
  color = 'gray',
  containerDelay = 0,
}: BadgeGroupProps) {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: containerDelay,
      },
    },
  }

  const badgeVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  }

  const colors = colorStyles[color]

  if (!badges || badges.length === 0) {
    return null
  }

  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-2"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={`${badge}-${index}`}
          variants={badgeVariant}
          className="px-3 py-1.5 rounded-full text-xs font-medium font-mono whitespace-nowrap"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          {badge}
        </motion.div>
      ))}
    </motion.div>
  )
}
