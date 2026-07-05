'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnswerOptionProps {
  letter: string
  text: string
  isSelected?: boolean
  isCorrect?: boolean
  isIncorrect?: boolean
  onClick?: () => void
  disabled?: boolean
  delay?: number
}

export function AnswerOption({
  letter,
  text,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  onClick,
  disabled = false,
  delay = 0,
}: AnswerOptionProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardVariant = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay,
      },
    },
  }

  let borderColor = '#E5E7EB'
  let bgColor = '#FFFFFF'
  let letterBg = '#F3F4F6'
  let letterText = '#6B7280'

  if (isCorrect) {
    borderColor = '#166534'
    bgColor = '#DCFCE7'
    letterBg = '#166534'
    letterText = '#FFFFFF'
  } else if (isIncorrect) {
    borderColor = '#DC2626'
    bgColor = '#FEE2E2'
    letterBg = '#DC2626'
    letterText = '#FFFFFF'
  } else if (isSelected) {
    borderColor = '#1D4E5F'
    bgColor = '#E8F4F7'
    letterBg = '#1D4E5F'
    letterText = '#FFFFFF'
  } else if (isHovered) {
    borderColor = '#1D4E5F'
    bgColor = '#E8F4F7'
  }

  return (
    <motion.button
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: isSelected || isCorrect || isIncorrect ? 0 : -2 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left p-4 rounded-lg border-2 transition-all duration-150 flex items-center gap-3"
      style={{
        borderColor,
        backgroundColor: bgColor,
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0"
        style={{
          backgroundColor: letterBg,
          color: letterText,
        }}
      >
        {letter}
      </div>
      <span className="text-base text-text-primary font-medium">{text}</span>
    </motion.button>
  )
}
