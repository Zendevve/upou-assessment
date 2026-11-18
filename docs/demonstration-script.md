# Interview Presentation & Live Demonstration Script (5–10 Minutes)

**Target Duration:** ~7 minutes (4 minutes slides + 3 minutes live application walkthrough)

---

## Slide-by-Slide Presenter Notes

### Slide 1 — Project Title & Course Overview (~30 sec)
- **Key message:** This is Module 1 (*Understanding Forces and Newton's Laws*) of a 6-hour secondary-level introductory physics course (*Physics in Everyday Life: Forces and Motion*).
- **Talking point:** Designed as a ~2-hour self-paced module for students studying independently without an instructor immediately available.

### Slide 2 — Learner Needs & Instructional Challenges (~40 sec)
- **Key message:** Secondary students often carry deep misconceptions into kinematics and dynamics—confusing velocity with acceleration, treating inertia as a force, or thinking action–reaction pairs cancel.
- **Talking point:** Many learners also access online coursework on mobile devices or low-bandwidth connections, so clarity, lightweight assets, and progressive scaffolding are essential.

### Slide 3 — Learning Objectives & Instructional Structure (~45 sec)
- **Key message:** Six measurable module objectives flow from everyday intuition to quantitative application (`F_net = ma`) and integrated analysis.
- **Talking point:** Five lessons plus a 10-question final assessment move deliberately from qualitative pushes/pulls -> inertia -> Second Law calculations -> Third Law force pairs -> integrated synthesis.

### Slide 4 — User Experience & Visual Design Decisions (~40 sec)
- **Key message:** A calm, editorial two-panel LMS layout keeps comprehension ahead of visual decoration.
- **Talking point:** Persistent desktop sidebar (collapsing to a mobile drawer) tracks progress without distracting banners. Color is paired with icons and text labels—never color alone.

### Slide 5 — Interactive Learning Activities (~45 sec)
- **Key message:** Every concept is reinforced by a targeted, low-bandwidth interactive activity rather than passive reading.
- **Talking point:** Highlight Activity 1 (Net Force Calculator), Activity 2 (Bus Inertia Scenario), Activity 3 (`F_net = ma` Simulator with invalid-mass validation), Activity 4 (3 Action–Reaction Pair Scenarios), and Activity 5 (Lesson Knowledge Checks).

### Slide 6 — Assessment & Feedback Strategy (~40 sec)
- **Key message:** Formative checks inside lessons allow unlimited retries with diagnostic feedback; the 10-question final assessment blends multiple-choice, true/false with reasoning, numerical, short-answer conceptual, and applied direction items.
- **Talking point:** The 70% mastery threshold is presented transparently as a self-paced benchmark—encouraging lesson review without locking learners out.

### Slide 7 — Accessibility & Low-Bandwidth Implementation (~40 sec)
- **Key message:** Built toward WCAG 2.2 AA principles and offline-friendly delivery.
- **Talking point:** Semantic HTML, keyboard navigation, visible focus rings, screen-reader SVG `<title>`/`<desc>`, `prefers-reduced-motion` compliance, locally bundled fonts, zero external APIs, and local SVG graphics.

### Slide 8 — Technical Architecture & Scalability (~35 sec)
- **Key message:** Pure physics calculation, grading, and progress rules are decoupled from UI rendering and covered by deterministic unit tests (`node:test`).
- **Talking point:** Progress persists via `localStorage` with an automatic in-memory fallback if storage is blocked, and zero personal data is collected.

### Slide 9 — Reflection, Limitations & Future Improvements (~40 sec)
- **Key message:** Honest scoping separates what is implemented in this Module 1 prototype from future course enhancements.
- **Talking point:** Current prototype covers 1D horizontal dynamics and client-side storage; Module 2 can extend this architecture to 2D free-body diagrams, friction coefficients, and optional LMS SCORM/xAPI hooks.

---

## Live Demonstration Sequence (~3 Minutes)
1. **Welcome & Orientation (0:00–0:30):** Point out the 6 learning objectives, ~2-hour pacing note, persistent sidebar, and click **Start Learning**.
2. **Lesson 1 — Net Force Calculator (0:30–1:10):** Toggle between *Balanced (10 N vs 10 N)* and *Unbalanced (15 N right, 5 N left)* presets to show real-time SVG vector scaling and `0 N` vs `10 N right` motion explanations.
3. **Lesson 2 — Bus Braking Misconception (1:10–1:40):** Toggle *Before Braking* vs *Bus Suddenly Brakes*, deliberately pick the "inertia force" distractor to show diagnostic feedback, then pick the correct answer.
4. **Lesson 3 — `F_net = ma` Simulator (1:40–2:20):** Click *Double Force (40 N, 5 kg)* and *Double Mass (20 N, 10 kg)*, type `0` into mass to show validation error protection, then click *Run Motion*.
5. **Final Assessment & Persistence (2:20–3:00):** Show one-question-at-a-time navigation, confirmation prompt, score summary with 70% benchmark feedback, per-question answer review, and reload the browser to demonstrate `localStorage` persistence.
