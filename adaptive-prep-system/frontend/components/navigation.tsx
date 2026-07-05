'use client'

import { motion } from 'framer-motion'
import { useStore, Tab } from '@/lib/store'

export function Navigation() {
  const { activeTab, setTab } = useStore()

  const navItems: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sections', label: 'Sections' },
    { id: 'session', label: 'Session' },
    { id: 'kb', label: 'Knowledge Base' },
    { id: 'exports', label: 'Exports' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 bg-white border-b border-border backdrop-blur-sm bg-opacity-95"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => setTab('dashboard')} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-primary rounded-sm" />
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm text-text-primary">SlatePrep</span>
            <span className="text-xs text-text-secondary">Adaptive document preparation</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="relative text-sm font-medium transition-colors"
              style={{ color: activeTab === item.id ? '#1D4E5F' : '#6B7280' }}
              whileHover={{ color: '#0D0D0D' }}
            >
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-teal-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-sage-success"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-sage-success">KB Active</span>
          </motion.div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: '#1D4E5F' }}
          >
            IYC
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
