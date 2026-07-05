export const mockSections = [
  {
    id: 1,
    number: '§1',
    title: 'Identity, Background & Public Status',
    status: 'Fresh',
    density: 65,
    isSelected: false,
  },
  {
    id: 2,
    number: '§2',
    title: 'Powers, Abilities & Documented Limits',
    status: 'Fresh',
    density: 80,
    isSelected: false,
  },
  {
    id: 3,
    number: '§3',
    title: 'Origin & Key Historical Events',
    status: 'Fresh',
    density: 55,
    isSelected: false,
  },
  {
    id: 4,
    number: '§4',
    title: 'Equipment, Gear & Specialized Technology',
    status: 'Fresh',
    density: 70,
    isSelected: false,
  },
  {
    id: 5,
    number: '§5',
    title: 'Operational Tactics & Combat Doctrine',
    status: 'Weak Signals',
    density: 85,
    isSelected: true,
  },
  {
    id: 6,
    number: '§6',
    title: 'Allies, Networks & Known Affiliations',
    status: 'Practiced',
    density: 60,
    isSelected: false,
  },
  {
    id: 7,
    number: '§7',
    title: 'Adversaries & Documented Threats',
    status: 'Fresh',
    density: 50,
    isSelected: false,
  },
  {
    id: 8,
    number: '§8',
    title: 'Known Bases, Safehouses & Territory',
    status: 'Weak Signals',
    density: 75,
    isSelected: true,
    isRepeated: true,
  },
  {
    id: 9,
    number: '§9',
    title: 'Case Files: Documented Engagements',
    status: 'Practiced',
    density: 90,
    isSelected: false,
  },
  {
    id: 10,
    number: '§10',
    title: 'Glossary, Codenames & Reference Tables',
    status: 'Fresh',
    density: 40,
    isSelected: false,
  },
]

export const mockQuestion = {
  id: 3,
  number: 3,
  text: 'What is the purpose of the Tail-Strike Technique?',
  section: 5,
  difficulty: 'Medium',
  topics: ['Tail-Strike Technique', 'Operational Tactics', 'Combat Doctrine'],
  choices: {
    A: 'To deliver a linear projectile motion',
    B: 'To exploit Tail Momentum and deliver compounded impacts',
    C: 'To create a kinetic-cover zone',
    D: 'To suspend multiple objects in mid-air',
  },
  correctAnswer: 'B',
}

export const mockStats = [
  { value: 3, label: 'Iterations', sublabel: 'Scenario B run' },
  { value: 28, label: 'Weak Signals', sublabel: 'across sessions' },
  { value: 30, label: 'MCQs Generated', sublabel: 'Scenario B' },
  { value: '10/10', label: 'Sections', sublabel: 'PDF coverage' },
]

export const mockIterations = [
  {
    id: 1,
    number: 1,
    badge: 'Cold Start',
    badgeBg: '#F3F4F6',
    badgeText: '#6B7280',
    borderColor: '#6B7280',
    sections: '5, 8',
    questions: 10,
    score: 6,
    scoreTotal: 10,
    mode: 'Cold-start generation — no prior history in Knowledge Base',
    weakTopics: [
      'Operational Tactics',
      'DSS',
      'Combat Doctrine',
      'Three-Two-One Rule',
      'Cuartel Valparaíso',
    ],
    files: ['questions_iter1.json', 'kb_snapshot_iter1.json'],
  },
  {
    id: 2,
    number: 2,
    badge: 'Adaptive',
    badgeBg: '#E8F4F7',
    badgeText: '#1D4E5F',
    borderColor: '#1D4E5F',
    sections: '6, 8, 9',
    questions: 15,
    score: 10,
    scoreTotal: 15,
    mode: 'Adaptive — iteration 1 history injected for Section 8',
    promptContext:
      'Prioritize: PAMC Protocols, Operational Tactics, Cuartel Valparaíso (answered wrong 4–7 times). Mastered questions excluded.',
    weakTopics: ['PAMC', 'Metahuman Classification', 'Personnel Capacity'],
    files: ['questions_iter2.json', 'kb_snapshot_iter2.json'],
  },
  {
    id: 3,
    number: 3,
    badge: 'Strongly Adaptive',
    badgeBg: '#FEF3C7',
    badgeText: '#D97706',
    borderColor: '#D97706',
    sections: '8 only',
    questions: 5,
    score: 1,
    scoreTotal: 5,
    mode: 'Strongly adaptive — accumulated history from iterations 1 & 2',
    promptContext:
      'Focus 60%+ on: PAMC Protocols, Cuartel Valparaíso, Facility Details (highest wrong-answer counts across both sessions). Mastered questions excluded from generation.',
    insight:
      'Score 1/5 (20%) confirms Section 8 topics are genuinely difficult. This is the expected behavior of adaptive reinforcement — not a failure.',
    files: ['questions_iter3.json', 'kb_snapshot_iter3.json'],
  },
]

export const mockWeakTopics = [
  {
    section: 'Sec 8',
    topic: 'PAMC Protocols',
    wrong: 7,
    total: 9,
    priority: 'high',
    action: 'Prioritize',
  },
  {
    section: 'Sec 5',
    topic: 'Operational Tactics',
    wrong: 4,
    total: 5,
    priority: 'high',
    action: 'Prioritize',
  },
  {
    section: 'Sec 8',
    topic: 'Cuartel Valparaíso',
    wrong: 3,
    total: 5,
    priority: 'medium',
    action: 'Reinforce',
  },
  {
    section: 'Sec 8',
    topic: 'Facility Details',
    wrong: 2,
    total: 4,
    priority: 'medium',
    action: 'Reinforce',
  },
  {
    section: 'Sec 6',
    topic: 'Metahuman Class.',
    wrong: 2,
    total: 3,
    priority: 'low',
    action: 'Review later',
  },
]

export const mockMasteredQuestions = [
  'What type of suspension activation does the asset use as primary field capability?',
  'Which PAMC standing order governs civilian collateral thresholds?',
  'What is the primary base of operations for the asset?',
]

export const mockExports = [
  {
    id: 1,
    iteration: 1,
    files: [
      { name: 'questions_iter1.json', saved: true },
      { name: 'kb_snapshot_iter1.json', saved: true },
    ],
  },
  {
    id: 2,
    iteration: 2,
    files: [
      { name: 'questions_iter2.json', saved: true },
      { name: 'kb_snapshot_iter2.json', saved: true },
    ],
  },
  {
    id: 3,
    iteration: 3,
    files: [
      { name: 'questions_iter3.json', saved: true },
      { name: 'kb_snapshot_iter3.json', saved: true },
    ],
  },
]

export const mockJsonPreview = {
  session_id: '5b5cf016-f61d-4379-a7ba-b45fb1712c2c',
  iteration: 1,
  sections: [5, 8],
  is_first_run: true,
  score: { correct: 6, total: 10, pct: 60.0 },
  questions: [
    {
      section_id: 5,
      question: 'What is the purpose of the Tail-Strike Technique?',
      choices: {
        A: 'To deliver a linear projectile motion',
        B: 'To exploit Tail Momentum and deliver compounded impacts',
        C: 'To create a kinetic-cover zone',
        D: 'To suspend multiple objects in mid-air',
      },
      correct_answer: 'B',
      topic_tags: [
        'Tail-Strike Technique',
        'Operational Tactics',
        'Combat Doctrine',
      ],
      user_answer: 'A',
      is_correct: false,
    },
  ],
}

export const mockStatusPanel = [
  {
    dot: 'Running',
    service: 'FastAPI Server',
    detail: 'uvicorn api.main:app',
    color: 'sage',
  },
  {
    dot: 'Connected',
    service: 'SQLite KB',
    detail: 'kb.db · 3 sessions stored',
    color: 'sage',
  },
  {
    dot: 'Ready',
    service: 'PDF Parser (PyMuPDF)',
    detail: 'SLATEFALL_DOSSIER.pdf · 10 sections',
    color: 'teal',
  },
  {
    dot: 'Active',
    service: 'LLM (Groq)',
    detail: 'llama-3.3-70b-versatile',
    color: 'sage',
  },
  {
    dot: 'Enabled',
    service: 'Answer Simulator',
    detail: 'Mixed mode · 60% correct / 40% wrong',
    color: 'sage',
  },
]
