# Physics in Everyday Life — Module 1: Understanding Forces and Newton's Laws

An interactive, self-paced secondary-level physics learning module designed for independent online study (~2 hours). Built with semantic HTML, TypeScript, React, Tailwind CSS, local SVG diagrams, and locally bundled typography with zero backend or external network dependencies.

## Features Implemented
- **7-Screen Guided Sequence:**
  1. **Welcome & Orientation:** Course overview, 6 measurable learning objectives, prerequisites, materials, and navigation guide.
  2. **Lesson 1 — Understanding Forces:** Pushes/pulls, vector nature of force, SI unit (N), net force convention, balanced vs. unbalanced visual comparisons, **Net Force Calculator (Activity 1)**, and Knowledge Check.
  3. **Lesson 2 — Newton's First Law and Inertia:** Formal statement, everyday examples, inertia vs. force misconception callout, mass–inertia relationship, **Braking Bus Inertia Scenario (Activity 2)**, and Knowledge Check.
  4. **Lesson 3 — Newton's Second Law:** `F_net = ma` and `a = F_net / m`, units, direction rule, two step-by-step worked examples, **Force–Mass–Acceleration Simulator (Activity 3)** with zero/negative mass validation, and Practice Question.
  5. **Lesson 4 — Newton's Third Law:** Action–reaction force pairs, equal magnitude/opposite direction/different objects, walking/jumping/wall examples, **Action–Reaction Identifier across 3 scenarios (Activity 4)**, and Knowledge Check.
  6. **Lesson 5 — Putting the Laws Together:** Integrated 5 kg box scenario with contextual balanced vertical forces (gravity & normal force) and a **5-step guided synthesis activity**.
  7. **Final Module Assessment:** 10 questions (multiple-choice, true/false with reasoning, numerical, short-answer conceptual, and applied numerical + direction), one question at a time, confirmation step, 70% formative mastery benchmark feedback, full answer review with lesson links, retry flow, and printable completion summary.
- **Progress Persistence & Accessibility:** Safe `localStorage` persistence with in-memory fallback, inline-confirmed progress reset, keyboard navigation, WCAG 2.2 AA-oriented contrast and focus rings, `prefers-reduced-motion` support, and responsive desktop sidebar / mobile drawer layout.

## Project Structure
```text
├── index.html
├── metadata.json
├── package.json
├── README.md
├── src/
│   ├── App.tsx                               # Main shell, routing & persistence
│   ├── index.css                             # Design tokens, print & reduced-motion styles
│   ├── data/moduleContent.ts                 # Course copy, scenarios, 10-question assessment
│   ├── physics/
│   │   ├── calculations.ts                   # Pure physics math, grading & progress logic
│   │   └── calculations.test.ts              # Unit tests (node:test)
│   ├── utils/storage.ts                      # Safe localStorage wrapper + fallback
│   └── components/
│       ├── Layout/                           # Sidebar, MobileHeader, LessonFooterNav
│       ├── common/                           # Reusable editorial blocks & KnowledgeCheck
│       ├── diagrams/                         # Accessible inline SVG diagrams
│       ├── activities/                       # Interactive physics activities (1–5)
│       └── screens/                          # Welcome, Lessons 1–5, Final Assessment
└── docs/
    ├── instructional-design-rationale.pdf    # 13-section ID & technical rationale
    ├── interview-presentation.pdf            # 9-slide presentation deck
    ├── demonstration-script.md               # 5–10 minute presenter & demo script
    └── ai-disclosure.md                      # Accurate AI tooling disclosure
```

## Running Locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## Running Verification Tests & Build
```bash
# Run physics math, grading, and progress unit tests
npx --yes tsx --test src/physics/calculations.test.ts

# Type-check
npm run lint

# Production build
npm run build
```
