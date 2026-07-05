'use client'

import { motion } from 'framer-motion'
import { SectionCard } from './section-card'
import { mockSections } from '@/lib/mock-data'
import { useStore } from '@/lib/store'

export function SectionsScreen() {
  const { selectedSections, toggleSection, nPerSection, setN, generateMCQs, isLoading, error } = useStore()

  return (
    <section className="bg-surface-alt py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black text-text-primary mb-4">Select Document Sections</h2>
          <div className="inline-block px-4 py-2 rounded-full text-xs font-mono font-semibold"
            style={{ backgroundColor: '#E8F4F7', color: '#1D4E5F' }}>
            SLATEFALL_DOSSIER.pdf · 10 sections · ~50 pages
          </div>
          {selectedSections.length > 0 && (
            <p className="mt-3 text-sm text-text-secondary">
              {selectedSections.length} section{selectedSections.length > 1 ? 's' : ''} selected: §{selectedSections.sort((a, b) => a - b).join(', §')}
            </p>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 rounded-lg border text-sm font-medium"
            style={{ backgroundColor: '#FEE2E2', borderColor: '#DC2626', color: '#DC2626' }}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {mockSections.map((section, index) => (
            <SectionCard
              key={section.id}
              number={section.number}
              title={section.title}
              status={section.status}
              density={section.density}
              isSelected={selectedSections.includes(section.id)}
              isRepeated={section.isRepeated}
              onClick={() => toggleSection(section.id)}
              delay={index * 0.04}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-primary">MCQs per section:</span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setN(nPerSection - 1)}
                className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-text-primary border-l border-r border-border min-w-[3rem] text-center">
                {nPerSection}
              </span>
              <button
                onClick={() => setN(nPerSection + 1)}
                className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition"
              >
                +
              </button>
            </div>
          </div>

          <motion.button
            onClick={generateMCQs}
            disabled={isLoading || selectedSections.length === 0}
            whileHover={!isLoading ? { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            className="px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1D4E5F', color: '#fff' }}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Generating…
              </>
            ) : (
              `Generate MCQs${selectedSections.length > 0 ? ` (${selectedSections.length * nPerSection} questions)` : ''}`
            )}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
