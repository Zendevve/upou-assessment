# AI Tools Disclosure

This document accurately discloses how artificial intelligence assistance was used during the design, development, and verification of **Physics in Everyday Life: Forces and Motion — Module 1**.

## Tools Used
- **Google AI Studio Build / Coding Agent (Gemini)**: Assisted with drafting instructional prose, structuring modular TypeScript/React components, implementing physics calculation logic, writing automated unit tests (`node:test`), generating inline SVG diagrams, and formatting the supporting documentation (`instructional-design-rationale.pdf`, `interview-presentation.pdf`, and `README.md`).
- **Headless Chromium (`chrome-headless-shell`) & Playwright CLI**: Used for automated browser rendering checks, responsive layout inspection, and generating PDF documentation artifacts from structured HTML/CSS templates.

## Human & Specification Alignment
- All course objectives, physics laws, worked numerical examples, misconceptions, and 10 assessment items were authored strictly against the Module 1 specification and verified mathematically via deterministic unit tests (`src/physics/calculations.test.ts`).
- No generative AI chatbot, LLM API call, or external runtime AI dependency is embedded in the learner-facing web module. The finished learning application runs 100% locally and deterministically in the browser.
- No fabricated learner usability test data or unsupported empirical outcome claims are included in the rationale or presentation.
