Build an outstanding, production-quality UI for "SlatePrep" — an Adaptive Document
Preparation System built as an AI/ML intern assessment project.

The system ingests a classified intelligence dossier PDF (SLATEFALL_DOSSIER.pdf),
lets a user select sections to study, generates MCQs via an LLM, scores answers,
explains mistakes, stores every session in a SQLite Knowledge Base, and on return
visits adaptively biases new questions toward historically weak topics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN DIRECTION — OPTIMUS STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Take direct visual inspiration from the Optimus v0 template
(v0.app/templates/optimus-the-ai-platform-to-build-and-ship-LHv4frpA7Us).

Match its aesthetic precisely:
  - Modern · light · minimal · bold typography · particle/shader animations
  - Landing-page quality polish — not a dashboard skeleton
  - Every section should feel crafted and intentional

The key fusion this UI must achieve:
  Optimus visual power  +  academic/assessment seriousness
  = a premium study tool that looks like a product, not a student project

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLOR PALETTE — OPTIMUS × ACADEMIC FUSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Base:
  Page background:   #FAFAF8  (near-white with warmth, not clinical pure white)
  Surface / cards:   #FFFFFF with subtle 1px border #E8E4DF
  Deep surface:      #F4F1EC  (for alternating section backgrounds)

Typography:
  Primary text:      #0D0D0D  (near-black, bold and inky)
  Secondary text:    #6B7280  (neutral slate)
  Muted captions:    #9CA3AF

Accent system (Optimus-influenced but academic):
  Primary:           #1D4E5F  (deep teal — the intelligence/dossier accent)
  Primary light:     #E8F4F7  (teal tint for backgrounds)
  Amber signal:      #D97706  (used for "Weak Signals" and alerts — bold, not pastel)
  Amber light:       #FEF3C7
  Sage success:      #166534  (dark green for correct answers)
  Sage light:        #DCFCE7
  Destructive:       #DC2626  (for wrong answers — clear, not garish)

Gradient (use sparingly — Optimus hero treatment only):
  Hero gradient mesh: radial gradients of #E0F2FE, #F0FDF4, #FEF9C3 layered
  very softly at 20–30% opacity on the #FAFAF8 base. Animated slowly.
  This replaces the old "paper warm ivory" — it is lighter and more alive.

Borders:            #E5E7EB  (standard), #D1D5DB  (stronger dividers)
Focus ring:         #1D4E5F at 2px offset

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPOGRAPHY — OPTIMUS BOLD TREATMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Headings:  Geist (or Inter) — weight 800–900. Very large scale.
           Hero H1: 56–72px, tight letter-spacing (-0.03em)
           Section H2: 36–44px, weight 700
           Card titles: 20–24px, weight 600

Body:      Inter or Geist — weight 400–500, 15–16px, line-height 1.6

Labels:    Geist Mono or JetBrains Mono for tags, badges, and code blocks

Key rule:  Headings should feel HEAVY and confident. Body should breathe.
           This is the core Optimus typographic principle — contrast of weight.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATION SYSTEM — FULL OPTIMUS SPEC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implement ALL of the following. This is the most important section.

1. HERO ANIMATED BACKGROUND
   - Animated gradient mesh in the hero section only.
   - Three soft radial gradients (teal, sage, amber tint) that slowly drift
     and cross-fade using CSS @keyframes or a canvas shader.
   - Speed: very slow (20–30 second cycle). Subtle — not distracting.
   - Optional: add a very faint dot-grid or noise texture overlay (5% opacity)
     to give it the Optimus "particle field" feel without being neon.

2. ENTRANCE ANIMATIONS (Framer Motion or CSS)
   - All sections animate in on scroll: translateY(24px) → translateY(0),
     opacity 0 → 1, duration 0.5s, easing: cubic-bezier(0.22, 1, 0.36, 1)
   - Stagger children: 80ms delay between each child element in a list/grid
   - Hero text: H1 word-by-word or line-by-line reveal on mount (stagger 60ms)
   - Stat numbers: count up from 0 to final value on entrance (800ms duration)

3. CARD INTERACTIONS
   - Hover: translateY(-3px), box-shadow deepens slightly, border brightens
   - Transition: 200ms cubic-bezier(0.22, 1, 0.36, 1)
   - Section cards: left border accent appears on hover (3px solid #1D4E5F)
   - Selected state: filled accent background (#E8F4F7), full left border

4. TIMELINE ANIMATION (Screen 7 — most important)
   - Connecting line between iterations draws itself top-to-bottom on scroll
   - Each iteration card slides in from the left with 150ms stagger
   - The "Adaptive" and "Strongly Adaptive" badges pulse once on entrance
   - Prompt context text types itself in character by character (typewriter, 30ms/char)
   - Score numbers count up: 0 → 6/10, then 0 → 10/15, then 0 → 1/5

5. MCQ SESSION INTERACTIONS
   - Answer option cards: hover scales slightly (scale 1.01), border highlights
   - Selected option: fills with teal tint, border becomes solid teal
   - Progress bar: animated fill left-to-right with spring easing on load
   - Correct reveal: green flash + checkmark scale-in animation
   - Wrong reveal: shake animation (translateX ±4px, 3 cycles, 300ms total)

6. KNOWLEDGE BASE FLOW DIAGRAM
   - Each node in the pipeline (PDF → Questions → Answers → Signals → Context)
     animates in left-to-right with stagger
   - Connecting arrows draw themselves using SVG stroke-dashoffset animation
   - Weak topic rows slide in from left with stagger on scroll into view

7. STATUS PANEL
   - Each status indicator dot pulses with a subtle ring animation (like a
     "breathing" ping effect) — sage/green for active, amber for standby
   - Pulse: scale 1 → 1.4 → 1, opacity 1 → 0, 2s loop

8. EXPORT PANEL
   - Folder cards open/expand on click with smooth height transition
   - JSON preview fades in with a slight blur-to-clear transition (filter: blur(4px) → blur(0))
   - "✓ Saved" badge entrance: scale 0 → 1 with spring bounce

9. NAVIGATION
   - Active nav item: small animated underline slides from left to right (200ms)
   - Page transitions between tabs: fade + slight slide (translateX 8px → 0)

10. MICRO-INTERACTIONS
    - Buttons: subtle scale-down on press (scale 0.97), spring back on release
    - Badges: appear with scale 0 → 1, cubic-bezier(0.34, 1.56, 0.64, 1) — slight overshoot
    - Toggle selections: smooth color cross-fade (200ms)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next.js + React + Tailwind + shadcn/ui + Framer Motion for animations.
Mock data only. Fully responsive (mobile-first).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 1 — TOP NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sticky nav. White background with a very subtle bottom border (#E5E7EB).
Backdrop blur: blur(12px) with slight transparency on scroll.

Left:
  Logo mark: a minimal square icon (teal, geometric) + "SlatePrep" in weight 700
  Subtitle: "Adaptive document preparation" in secondary text, 12px

Center nav links: Dashboard · Sections · Session · Knowledge Base · Exports
  Active link: weight 600, teal color, animated underline (2px, slides in)
  Inactive: #6B7280, transitions to #0D0D0D on hover

Right:
  "KB Active" pill — sage light bg (#DCFCE7), dark green text (#166534),
    small pulsing green dot to the left
  Avatar circle: deep teal bg (#1D4E5F), white "IYC" text, weight 700

Animate nav in from top on mount (translateY -8px → 0, 400ms).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 2 — DASHBOARD HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width hero section. Animated gradient mesh background (see Animation §1).
Add a very subtle animated grid pattern (1px lines, 5% opacity) over the gradient.

Left column (60% width):
  Eyebrow label: "AI/ML INTERN ASSESSMENT" — monospace, 11px, teal, letter-spacing wide
  H1: "Prepare smarter from structured documents."
      Weight 900, 64px, #0D0D0D, tight tracking. Animate word by word on mount.
  Subheading: "Generate MCQs from selected PDF sections, track mistakes, and adapt
  the next session toward weak topics."
  Weight 400, 18px, secondary text. Fades in 300ms after H1 completes.

  Button row (appears 200ms after subheading):
    Primary: "Start Prep Session" — deep teal bg, white text, weight 600,
             rounded-lg, px-6 py-3. Scale + shadow on hover.
    Secondary: "View Knowledge Base" — white bg, teal border, teal text,
               same sizing. Border brightens on hover.

Stats row (animates in last, numbers count up):
  ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
  │       3          │      28          │      30          │     10/10        │
  │  Iterations      │  Weak Signals    │  MCQs Generated  │  Sections        │
  │  Scenario B run  │  across sessions │  Scenario B      │  PDF coverage    │
  └──────────────────┴──────────────────┴──────────────────┴──────────────────┘
  Numbers: weight 800, 40px, #0D0D0D. Labels: 13px, secondary text.
  Each stat separated by a thin vertical divider.

Right column (40% width) — "Assessment Scenario" card:
  White card, 1px border, rounded-xl, soft shadow.
  Header: "Scenario B — Evaluation Run" weight 700
  Subtext: "Section groupings defined by assessment specification" — caption, muted

  Vertical timeline (animated — line draws down, cards slide in left):
  ●─── ITERATION 1  ────────────────────────────────
  │    Sections 5, 8  ·  Cold-start  ·  Score 6/10
  │    Badge: "No prior history"  [sage bg]
  │
  ●─── ITERATION 2  ────────────────────────────────
  │    Sections 6, 8, 9  ·  Adaptive  ·  Score 10/15
  │    Badge: "History used for Sec 8"  [teal light bg]
  │
  ●─── ITERATION 3  ────────────────────────────────
       Section 8 only  ·  Strongly Adaptive  ·  Score 1/5
       Badge: "Accumulated history from iters 1 & 2"  [amber light bg]

  Caption at bottom: "Answers simulated per assessment spec (60% correct / 40% wrong)"
  Monospace, 11px, muted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 3 — PDF SECTION SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section background: #F4F1EC (alternating surface).

Card header row:
  Title: "Select Document Sections" — weight 700, 28px
  PDF badge: "SLATEFALL_DOSSIER.pdf · 10 sections · ~50 pages"
             monospace, teal bg light, teal text, rounded-full

Grid: 2 columns desktop, 1 column mobile. Cards animate in with stagger.

Each section card has:
  - Section number: weight 800, 20px, teal (selected) or muted (unselected)
  - Title: weight 600, 15px
  - Reading density bar: thin progress bar (30–85% filled, varies by section)
  - Status badge bottom-right

Section data (actual titles from SLATEFALL_DOSSIER.pdf):
  §1   Identity, Background & Public Status           Fresh            density 65%
  §2   Powers, Abilities & Documented Limits          Fresh            density 80%
  §3   Origin & Key Historical Events                 Fresh            density 55%
  §4   Equipment, Gear & Specialized Technology       Fresh            density 70%
  §5   Operational Tactics & Combat Doctrine          ⚠ Weak Signals   density 85%  ★ SELECTED
  §6   Allies, Networks & Known Affiliations          Practiced        density 60%
  §7   Adversaries & Documented Threats               Fresh            density 50%
  §8   Known Bases, Safehouses & Territory            ⚠ Weak Signals   density 75%  ★ SELECTED  ★ REPEATED
  §9   Case Files: Documented Engagements             Practiced        density 90%
  §10  Glossary, Codenames & Reference Tables         Fresh            density 40%

Section 5:  Selected state — teal border, teal tint background, left border 3px teal
Section 8:  Selected + special — amber border highlight, amber-tinted card background
            Top badge (spans card width): "★ Central to Scenario B — appears in all 3 iterations"
            amber bg (#FEF3C7), amber text (#D97706), weight 600, 11px monospace

Status badge colors:
  Fresh:         neutral gray bg, #6B7280 text
  Practiced:     sage light bg, dark green text
  Weak Signals:  amber light bg, amber text — with small animated pulse dot

Bottom bar:
  "N per section: 5" — small stepper UI
  Button: "Generate MCQs" — primary teal, weight 600. Hover: scale 1.02, shadow deepens.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 4 — ACTIVE MCQ SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full white surface. No distracting background.

Top bar:
  Left: "Session — Sections 5, 8"  weight 700
  Center: Progress "3 / 10" with animated fill bar (spring easing)
          Bar: teal fill, gray track, rounded-full, height 4px
  Right: Adaptation mode badge — "Cold Start" in sage, or "Adaptive" in teal light

Question card (large, prominent):
  White card, 1px border, generous padding (32px), shadow-md
  Label: "Question 3" — monospace, 11px, muted, uppercase
  Question text: "What is the purpose of the Tail-Strike Technique?"
  Weight 700, 22px, #0D0D0D, line-height 1.4

Answer options — 4 cards in a 2×2 grid (desktop) or vertical stack (mobile):
  A  To deliver a linear projectile motion
  B  To exploit Tail Momentum and deliver compounded impacts
  C  To create a kinetic-cover zone
  D  To suspend multiple objects in mid-air

  Each option card: white bg, 1px border, left letter badge (A/B/C/D) in gray bg
  Hover: border color → teal, background → teal light (#E8F4F7), letter badge → teal
  Selected: solid teal border, teal light bg, letter badge fills teal, checkmark appears
  Transition: 150ms ease-out for all properties

Right sidebar (desktop only — 280px):
  Clean small card with:
    Source:     Section 5
    Topic tags: "Tail-Strike Technique" · "Operational Tactics" · "Combat Doctrine"
                (each tag: rounded-full, gray bg, monospace 11px)
    Difficulty: Medium   (amber dot + label)
    Mode:       Cold Start  (sage badge)
  Appears with slide-in from right on mount (translateX 16px → 0)

Bottom action bar:
  ← Previous (outline btn)  |  Submit Answer (primary teal btn)  |  Next → (outline btn)
  All buttons: rounded-lg, weight 600, scale down on press

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 5 — RESULTS & MISTAKE EXPLANATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Score hero (top of results):
  Large animated number: "6" slash "10" — both count up on mount
  Weight 900, 72px. "/" in secondary text.
  Below: "60.0%" — weight 700, 32px, teal
  Below: animated horizontal bar — sage fill (60%) + muted red fill (40%), rounded, 8px height
  Caption: "4 questions missed · Adaptive context will prioritize these topics next session"

Questions review list (accordion or flat list):
  Correct answers: left border sage, "✓ Correct" badge in sage light
  Missed answers: left border amber, "✗ Missed" badge in amber light

Mistake explanation card (expanded state for one wrong answer):
  White card, amber left border (4px), shadow-sm
  Header: "Question 3 — Missed"
  
  Two rows side by side:
    Your answer    A  "To deliver a linear projectile motion"
                   Strikethrough text, muted red bg pill
    Correct answer B  "To exploit Tail Momentum and deliver compounded impacts"
                   Bold, sage bg pill

  "Why this matters" — weight 700, 15px, divider below
  Body: "The Doctrine of Sequential Suspension treats each activation as finite
  ammunition. The Tail-Strike Technique specifically exploits Tail Momentum to
  compound impact — a core distinction in Section 5's combat doctrine."

  Tag row: "Section 5" · "Operational Tactics" · "Combat Doctrine"
           Each: monospace, 11px, rounded-full, gray border

Animate wrong answer with: shake (translateX ±4px × 3, 300ms) on reveal
Animate correct answer reveal with: scale 0.95 → 1 + green flash (100ms) on reveal

Action buttons:
  "Review weak topics →" (outline)  |  "Start next session (Adaptive)" (primary teal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 6 — KNOWLEDGE BASE / ADAPTIVE MEMORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section background: #F4F1EC.

Title: "Knowledge Base Memory" — weight 800, 36px
Subtitle: "Every session, question, and answer is persisted in SQLite.
Weak topic signals drive adaptive MCQ generation on return visits."

━ PIPELINE DIAGRAM ━
Animated horizontal flow (SVG arrows draw on scroll):

  ┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌─────────────────────┐     ┌────────────────────────┐
  │ PDF Sections│ ──► │ Generated MCQs   │ ──► │ User Answers │ ──► │ Weak Topic Signals  │ ──► │ Adaptive Prompt Context │
  └─────────────┘     └──────────────────┘     └──────────────┘     └─────────────────────┘     └────────────────────────┘

Each node: white card, rounded-lg, teal icon, label weight 600.
Arrows: teal color SVG paths, animated stroke-dashoffset left to right.
Stagger: 120ms between each node appearing.

━ SCHEMA SUMMARY ━
Three small elegant cards in a row:
  sessions    session_id · created_at · section_ids · score
  questions   question_id · section_id · text · choices · topic_tags
  answers     answer_id · user_answer · is_correct · answered_at

Card style: white, 1px border, left accent (teal 3px), monospace field names (11px muted).

━ WEAK TOPIC SUMMARY TABLE ━
(Slides in row by row with 80ms stagger on scroll)

  Section  │  Topic                │  Wrong  │  Total  │  Priority  │  Next Action
  ─────────┼───────────────────────┼─────────┼─────────┼────────────┼──────────────
  Sec 8    │  PAMC Protocols       │   7     │   9     │  🔴 High   │  Prioritize
  Sec 5    │  Operational Tactics  │   4     │   5     │  🔴 High   │  Prioritize
  Sec 8    │  Cuartel Valparaíso   │   3     │   5     │  🟡 Med    │  Reinforce
  Sec 8    │  Facility Details     │   2     │   4     │  🟡 Med    │  Reinforce
  Sec 6    │  Metahuman Class.     │   2     │   3     │  🟢 Low    │  Review later

Priority column: use colored dot badges (red/amber/sage), not emoji.
"Wrong" count cells: bold weight 600.
Alternating row bg: white / #F9FAFB.

━ MASTERED QUESTIONS AVOIDED ━
Small card below the table, sage left border:
  Title: "Mastered questions avoided" — weight 600, sage text
  List (3 items with ✓ icon in sage):
    ✓  "What type of suspension activation does the asset use as primary field capability?"
    ✓  "Which PAMC standing order governs civilian collateral thresholds?"
    ✓  "What is the primary base of operations for the asset?"
  Caption: "Answered correctly in prior sessions. Excluded from adaptive generation."
  Monospace, 11px, muted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 7 — SCENARIO B ITERATION TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is THE centerpiece of the UI. Make it unmistakably impressive.

Full-width section, white background. Title: "Scenario B — Adaptive Evidence"
Weight 800, 40px. Subtitle: "Three consecutive prep sessions demonstrating
progressive adaptation using the Knowledge Base."

━ TIMELINE LAYOUT ━
Vertical timeline with a 2px teal connecting line running down the left.
The line animates: draws from top to bottom over 1.2s on scroll entry.
Each iteration card slides in from left (translateX -24px → 0) with stagger 200ms.

━━━━━━━━━━━━━━━━━━━━━━━━
ITERATION 1  ●           badge: "Cold Start"  [gray bg, weight 600]
━━━━━━━━━━━━━━━━━━━━━━━━
White card, left border 4px #6B7280 (neutral — no history yet)

  Row 1:  "Sections 5, 8"  ·  10 questions  ·  Score: 6 / 10
          Score: animated count-up. "6" in weight 800 teal, "/ 10" in muted.
  Row 2:  "Mode: Cold-start generation — no prior history in Knowledge Base"
          Muted text, 14px
  Row 3:  Weak topics identified (tag cloud):
          [Operational Tactics] [DSS] [Combat Doctrine] [Three-Two-One Rule] [Cuartel Valparaíso]
          Each: rounded-full, amber light bg, amber text, 12px, monospace
          → These tags animate in with stagger 60ms, scale 0 → 1 with bounce easing
  Row 4:  "Outputs saved" — two file badges:
          📄 questions_iter1.json   📄 kb_snapshot_iter1.json
          Both: gray bg, monospace 11px, ✓ Saved in sage

━━━━━━━━━━━━━━━━━━━━━━━━
ITERATION 2  ●           badge: "Adaptive"  [teal light bg, teal text, weight 600]
━━━━━━━━━━━━━━━━━━━━━━━━
White card, left border 4px #1D4E5F (teal — adaptive engaged)
Pulse animation on the ● dot: single ring expands on entrance

  Row 1:  "Sections 6, 8, 9"  ·  15 questions  ·  Score: 10 / 15
  Row 2:  "Mode: Adaptive — iteration 1 history injected for Section 8"
  Row 3:  Adaptive prompt context box:
          Styled like a terminal/quote block — left border 2px teal, bg #F0F9FF
          Monospace 12px, dark text:
          "Prioritize: PAMC Protocols, Operational Tactics, Cuartel Valparaíso
           (answered wrong 4–7 times). Mastered questions excluded."
          → This text types itself in on entrance (typewriter, 25ms/char)
  Row 4:  New weak topics added this iteration:
          [PAMC] [Metahuman Classification] [Personnel Capacity]
  Row 5:  Output file badges (same style as iter 1)

━━━━━━━━━━━━━━━━━━━━━━━━
ITERATION 3  ●           badge: "Strongly Adaptive"  [amber light bg, amber text — pulses once]
━━━━━━━━━━━━━━━━━━━━━━━━
White card, left border 4px #D97706 (amber — maximum adaptation)

  Row 1:  "Section 8 only"  ·  5 questions  ·  Score: 1 / 5
  Row 2:  "Mode: Strongly adaptive — accumulated history from iterations 1 & 2"
  Row 3:  Adaptive prompt context box (same terminal style):
          "Focus 60%+ on: PAMC Protocols, Cuartel Valparaíso, Facility Details
           (highest wrong-answer counts across both sessions).
           Mastered questions excluded from generation."
  Row 4:  Insight note (amber left border, amber light bg):
          "Score 1/5 (20%) confirms Section 8 topics are genuinely difficult.
           This is the expected behavior of adaptive reinforcement — not a failure."
          Italic, 14px.
  Row 5:  Output file badges

Timeline footer note (centered, muted, 12px monospace):
  "Scenario B section groupings are defined by the assessment specification.
   The system supports arbitrary section selection for all other prep sessions."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 8 — OUTPUT EXPORTS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section background: #F4F1EC.
Title: "Evaluation Outputs" — weight 800, 32px
Subtitle: "Generated by: python cli.py scenario-b" — monospace, teal bg pill

Three folder cards in a row (each 1/3 width desktop, full width mobile).
Cards animate in with stagger 150ms.

Each folder card:
  Header: folder icon + "outputs/scenario_b_iterN/" — monospace, weight 600
  Two file rows:
    📄  questions_iterN.json      ✓ Saved  [sage badge]
    📄  kb_snapshot_iterN.json   ✓ Saved  [sage badge]
  "✓ Saved" badges: animate in with scale bounce on mount
  Button: "Preview JSON" — outline teal, weight 600

JSON Preview (opens inline below the card on click, smooth height expand):
  Background: #1A1A1A (warm dark, not pitch black)
  Text: #E5E7EB (warm off-white)
  Font: JetBrains Mono or Fira Code, 13px
  Line numbers in muted gray
  String values: #86EFAC (sage green)
  Keys: #93C5FD (soft blue)
  Numbers: #FDE68A (amber)
  Transition: height 0 → auto with opacity fade + blur(4px) → blur(0)

Preview content for iter 1:
{
  "session_id": "5b5cf016-f61d-4379-a7ba-b45fb1712c2c",
  "iteration": 1,
  "sections": [5, 8],
  "is_first_run": true,
  "score": { "correct": 6, "total": 10, "pct": 60.0 },
  "questions": [
    {
      "section_id": 5,
      "question": "What is the purpose of the Tail-Strike Technique?",
      "choices": {
        "A": "To deliver a linear projectile motion",
        "B": "To exploit Tail Momentum and deliver compounded impacts",
        "C": "To create a kinetic-cover zone",
        "D": "To suspend multiple objects in mid-air"
      },
      "correct_answer": "B",
      "topic_tags": ["Tail-Strike Technique", "Operational Tactics", "Combat Doctrine"],
      "user_answer": "A",
      "is_correct": false
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 9 — BACKEND STATUS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Small horizontal card or 5-column grid. White bg, 1px border, rounded-xl.
Not the focus of the page — compact and clean.

Each status item:
  Left: pulsing dot (breathing ring animation, 2s loop)
  Center: service name (weight 600) + detail text (muted, 13px)
  Right: status label

  ● Running    FastAPI Server        uvicorn api.main:app
  ● Connected  SQLite KB             kb.db · 3 sessions stored
  ● Ready      PDF Parser (PyMuPDF)  SLATEFALL_DOSSIER.pdf · 10 sections
  ● Active     LLM (Groq)            llama-3.3-70b-versatile
  ● Enabled    Answer Simulator      Mixed mode · 60% correct / 40% wrong

Dot colors:
  Running / Connected / Active / Enabled: #166534 (sage green) with sage ring
  Ready: #1D4E5F (teal) with teal ring

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL POLISH RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layout:
  Max content width: 1280px, centered
  Section padding: 96px vertical (desktop), 64px (mobile)
  Card border radius: rounded-xl (12px) for large cards, rounded-lg (8px) for small
  Consistent 24px gap between cards in grids

Responsive breakpoints:
  Desktop ≥ 1024px: multi-column layouts as described
  Tablet 768–1023px: 2 columns max, sidebar collapses below questions
  Mobile <768px: single column, full-width cards, timeline stays vertical

Accessibility:
  Focus rings: 2px solid #1D4E5F, 2px offset
  All interactive elements keyboard navigable
  Sufficient color contrast for all text on backgrounds

Language rules — USE these phrases naturally in the UI:
  "Adaptive generation"        "Weak-topic memory"
  "Section-based retrieval"    "Knowledge Base snapshot"
  "Mastered questions avoided" "Scenario B evidence"
  "History-aware MCQs"

DO NOT use anywhere:
  "AI magic" · "Supercharged AI" · "Chat with your PDF"
  "Powered by intelligence" · Generic robot/AI icons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A single polished, fully animated React component (or multi-tab page layout)
with all mock data inline. Use Framer Motion for all entrance and interaction
animations. The UI must make it immediately clear that:

  1. Iteration 2 uses Section 8's weak topics from iteration 1
  2. Iteration 3 uses accumulated history from both prior iterations
  3. The Knowledge Base — not any AI magic — drives adaptation
  4. The system is section-based (structural retrieval, not semantic/vector search)

The overall quality target: someone looking at this for 10 seconds should think
"this was built by someone who deeply understood every layer of the system."
Match the animation sophistication and visual confidence of the Optimus v0 template
while maintaining the seriousness of an academic assessment tool.
