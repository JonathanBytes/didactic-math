<!--
SYNC IMPACT REPORT
Version Change: [TEMPLATE] → 1.0.0
Change Type: Initial constitution creation
Date: 2025-10-03

Sections Created:
- Core Principles (5 principles defined)
- Technology Stack
- Development Workflow
- Governance

Principles Defined:
1. Component-Based Architecture - Emphasizing reusable, self-contained React components
2. Educational UX First - Prioritizing learning experience and accessibility
3. Test-First Development - TDD with focus on component and integration testing
4. Type Safety - Leveraging TypeScript for reliability
5. Performance & Accessibility - Ensuring fast, inclusive educational experience

Templates Status:
✅ plan-template.md - Reviewed, compatible with constitution gates
✅ spec-template.md - Reviewed, compatible with educational feature requirements
✅ tasks-template.md - Reviewed, compatible with React/TypeScript workflow
⚠️  No command files found in .specify/templates/commands/

Follow-up Actions:
- None - all placeholders resolved

Next Steps:
- Use this constitution as the reference for all feature development
- All new features must pass constitution checks in plan.md
- Review constitution quarterly or when major architectural changes are needed
-->

# Didactic Math Constitution

## Core Principles

### 1. Code Quality Discipline (NON-NEGOTIABLE)
Rules:
- Every change MUST be covered by at least one automated test (unit, integration, or visual where appropriate) before merging.
- No PR may introduce an ESLint or TypeScript error; new warnings MUST be resolved or converted to explicit suppressions with rationale.
- Red → Green → Refactor: functionality added only after a failing test exists; refactors MUST retain green status.
- Dead, duplicated, or commented-out code MUST be removed in the same PR it is discovered.
- Public APIs (exported components/functions) REQUIRE inline JSDoc/TSDoc including purpose, props/params, and constraints.
Rationale: Enforces a sustainable velocity where correctness and clarity compound instead of decaying.

### 2. Component-Based Architecture
Rules:
- UI MUST be composed of small, pure, prop-driven React components (no side effects in render paths).
- Shared logic extracted into hooks (`useX`) or utility modules; NO duplicated domain logic across components.
- Each component MUST declare a single responsibility; multi-purpose components MUST be split.
- Cross-cutting concerns (theme, accessibility helpers, state containers) centralized; avoid ad-hoc context proliferation.
- Directory co-location: component + styles + tests + story/usage example in same folder when created.
Rationale: Predictable composition reduces cognitive load and enables incremental enhancement and reuse.

### 3. Educational UX First
Rules:
- Every interactive element MUST convey mathematical intent: labels, aria descriptions, or inline hints explain concepts—not just mechanics.
- Progressive disclosure: advanced or distracting details are hidden until user signals readiness (e.g., expanders, toggles).
- Explanatory feedback: incorrect inputs trigger constructive guidance (what was wrong + next hint), never silent failure.
- Visualizations MUST include textual equivalents (captions or summaries) to reinforce learning modalities.
- Any new feature proposal MUST state the learning outcome it advances; PR description MUST link outcome to implementation.
Rationale: The product’s differentiator is pedagogy; learning clarity outweighs feature breadth.

### 4. Type Safety & Static Guarantees
Rules:
- All source files are `.ts` / `.tsx`; `any` is forbidden unless explicitly justified with a `// @justified-any: <reason>` comment and a narrowing TODO.
- Public functions/components MUST export precise types—no implicit `any`, broad `unknown`, or structural leaking of internal types.
- Runtime validation (e.g., zod / custom guards) REQUIRED at all external boundaries (user input, network, storage) with typed refinement.
- Generic types used where domain invariants vary (e.g., `<T extends NumericNode>`); avoid copy-paste specialization.
- Build MUST fail on TypeScript errors; no `skipLibCheck` compromises unless documented in Governance exceptions.
Rationale: Strong static guarantees front-load correctness and reduce ambiguous runtime states.

### 5. Consistent User Experience
Rules:
- Design tokens (spacing, color, typography, motion) centralized; components consume tokens—no raw magic values in JSX/CSS.
- Interaction patterns (focus handling, keyboard navigation, error display) standardized; new patterns require documented approval.
- Component variants documented (story or MDX) before widespread use.
- Empty and loading states MUST be explicitly designed (skeletons or descriptive placeholders) – no layout shift flash.
- Accessibility: Every interactive component MUST pass WCAG 2.1 AA for color contrast and keyboard operability.
Rationale: Consistency builds user trust and accelerates development by shrinking decision surfaces.

### 6. Performance & Accessibility (Lightweight, Responsive, Inclusive)
Rules:
- Initial JS payload (uncompressed) MUST stay under 200 KB for core learner path; additions require budget trade-off doc.
- Route-level code splitting mandatory for feature modules beyond core learning flow.
- p95 route-to-interactive < 150ms on a simulated modern mid-tier laptop; regressions require performance issue filed.
- All interactive elements reachable via keyboard and announce meaningful roles/names via ARIA where native semantics insufficient.
- Image/media assets MUST declare dimensions to avoid layout shift; prefer vector/SVG for math diagrams when feasible.
- Continuous measurement: add or update a lightweight performance check when introducing a new heavy dependency.
Rationale: Fast, accessible experiences keep learners engaged and reduce cognitive friction.

## Additional Engineering Constraints

1. Tooling: React + TypeScript + Vite is the sanctioned stack; introducing a new build or state management framework requires governance approval.
2. Testing Pyramid: ~60% unit/hook tests, 30% integration/component tests, 10% high-level interaction/visual tests.
3. Linting & Formatting: ESLint + Prettier (or equivalent config) enforced pre-commit; CI blocks merges on violations.
4. Source Layout: `src/` contains domain-driven groupings (e.g., `components/`, `hooks/`, `math/`, `state/`); avoid deep nesting > 5 levels.
5. Dependency Hygiene: New third-party library requires: (a) problem statement, (b) size impact, (c) maintenance risk note. Lightweight internal utility preferred if simpler.
6. Documentation: Every feature merged MUST update or create a usage example / story demonstrating educational context.

## Development Workflow & Quality Gates

1. Branch Flow: Feature branches named `<issue|ticket>-<kebab-summary>`; squash merge after review.
2. Mandatory PR Checklist:
	 - Tests added & green
	 - No unexplained `any`
	 - Accessibility check performed (tab order + screen reader labels)
	 - Performance budget evaluated (bundle diff shown if > +5 KB)
	 - Learning outcome referenced
3. Review Gate: At least one reviewer focuses on pedagogy clarity, another on implementation quality (can be the same if expertise overlaps, but both dimensions MUST be explicitly acknowledged in comments or approvals).
4. CI Gates (all MUST pass): type check, lint, test suite, bundle size delta check, accessibility smoke (axe or equivalent), performance smoke (Lighthouse or scripted metric on core route).
5. Refactor Safety: Behavior-preserving refactors require unchanged or expanded test coverage; removal of code requires confirmation of absence of live references (search + optionally build artifact scan).
6. Incident Handling: Regressions in performance or accessibility open a blocking issue labeled `quality-regression` before unrelated merges.

## Governance

Authority & Supremacy:
- This constitution supersedes informal practices; conflicts resolved in favor of the stricter applicable rule.

Amendment Process:
1. Draft change PR referencing rationale (performance pressure, new domain need, recurring friction, etc.).
2. Classify bump: MAJOR (incompatible removal/overhaul), MINOR (new principle/section or materially expanded rule), PATCH (clarification).
3. Include migration or adoption notes for MAJOR and MINOR changes.
4. Update version line and Sync Impact Report at file top.
5. Obtain two approvals: one domain (education focus) + one engineering.

Compliance & Review:
- PR reviewers MUST map comments to principle numbers when blocking.
- CI MAY include automated constitution checks (e.g., scanning for `any`, bundle size budgets, a11y violations) – failing checks block merges.
- Quarterly (or sooner if 3+ PATCH changes accumulate) review to consolidate clarifications into a MINOR if cohesive.

Exceptions:
- Temporary deviations require an issue labeled `constitution-exception` with scope, expiry date, and rollback plan.
- Expired exceptions auto-trigger a blocking label until resolved.

Versioning Policy:
- Semantic: MAJOR.MINOR.PATCH as defined above.
- `LAST_AMENDED_DATE` updated on any version bump; `RATIFICATION_DATE` immutable after initial adoption.

Record Keeping:
- Each amendment PR must link to prior version diff for auditability.

**Version**: 1.0.0 | **Ratified**: 2025-10-03 | **Last Amended**: 2025-10-03