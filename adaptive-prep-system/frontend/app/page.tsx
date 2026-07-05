'use client'

import { StoreProvider, useStore } from '@/lib/store'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { SectionsScreen } from '@/components/sections-screen'
import { MCQSessionScreen } from '@/components/mcq-session-screen'
import { ResultsScreen } from '@/components/results-screen'
import { KnowledgeBaseScreen } from '@/components/knowledge-base-screen'
import { TimelineScreen } from '@/components/timeline-screen'
import { ExportsScreen } from '@/components/exports-screen'
import { StatusPanel } from '@/components/status-panel'

function AppContent() {
  const { activeTab, submitted } = useStore()

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      {activeTab === 'dashboard' && (
        <>
          <HeroSection />
          <TimelineScreen />
          <StatusPanel />
        </>
      )}

      {activeTab === 'sections' && <SectionsScreen />}

      {activeTab === 'session' && (
        submitted ? <ResultsScreen /> : <MCQSessionScreen />
      )}

      {activeTab === 'kb' && <KnowledgeBaseScreen />}

      {activeTab === 'exports' && <ExportsScreen />}
    </main>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
