# Implementation Plan: Interactive Number Decomposition Learning Tool

**Branch**: `001-herramienta-interactiva-para` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `C:\Users\jonat\Dev\didactic-math\specs\001-her## Post-Design Constitution Check ✅ RE-VALIDATED

### I. Component-Based Architecture ✅ PASS
- ✅ **7 self-contained components** defined with clear responsibilities
- ✅ **Reusable pieces**: Cylinder (x2), Piece (reused for all place values), Button
- ✅ **TypeScript docs**: All props interfaces in contracts/components.md
- ✅ **Testable**: Each component has 5-8 test scenarios defined

### II. Educational UX First ✅ PASS
- ✅ **Immediate feedback**: Framer Motion animations, validation messages
- ✅ **Progressive disclosure**: Setup → First → Second → Complete phase flow
- ✅ **Error tolerance**: Undo functionality (FR-011 to FR-014), blocking overflow (FR-008)
- ✅ **Accessibility**: WCAG 2.1 AA requirements defined in contracts

### III. Test-First Development ✅ PASS
- ✅ **Test scenarios defined** before implementation (quickstart.md + contracts)
- ✅ **Red-Green-Refactor**: Tasks will generate failing tests first
- ✅ **Focus areas covered**: Component rendering, interactions, mathematical correctness, edge cases
- ✅ **Coverage goals**: Utils 100%, Hooks 90%, Components 80%, E2E critical paths

### IV. Type Safety ✅ PASS
- ✅ **No `any` types**: All interfaces explicitly typed in data-model.md
- ✅ **Props typed**: All component prop interfaces defined
- ✅ **Math functions typed**: validateDecomposition, calculateExpectedDecomposition
- ✅ **Strict mode**: Already enabled in existing tsconfig.json

### V. Performance & Accessibility ✅ PASS
- ✅ **Performance targets**: <3s load, <100ms interactions, 60fps animations (defined in research.md)
- ✅ **Bundle optimization**: Tailwind purge, Framer Motion tree-shaking, code splitting strategy
- ✅ **Accessibility**: Keyboard nav, ARIA, contrast, large targets (all defined in contracts)
- ✅ **i18n structure**: Spanish hardcoded for v1, string extraction possible for future

**🎯 Post-Design Constitution Check: PASS - No design violations, ready for implementation**

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base structure
- Generate tasks from Phase 1 artifacts:
  - **Setup tasks**: Install dependencies (Tailwind, Framer Motion, Vitest, Playwright), configure tooling
  - **Test-first tasks** (from contracts/components.md):
    - Component test file creation (7 components)
    - Hook test file creation (3 hooks)
    - Utils test file creation (3 modules)
  - **Type definition tasks** (from data-model.md):
    - Create src/types/number-decomposition.ts with all interfaces
  - **Implementation tasks**:
    - Utils implementation (decomposition.ts, number-generator.ts, localStorage.ts)
    - Hooks implementation (useExercise, useLocalStorage, useDecomposition)
    - Component implementation (7 components)
  - **Integration tasks**:
    - Wire components together
    - Add Framer Motion animations
    - Implement localStorage persistence
  - **E2E test tasks** (from quickstart.md):
    - Complete exercise flow
    - Undo functionality
    - localStorage persistence

**Ordering Strategy**:
- **Phase 3.1: Setup** (T001-T010) - Dependencies, config, project structure
- **Phase 3.2: Tests First** (T011-T030) - All test files (MUST fail initially)
- **Phase 3.3: Types & Utils** (T031-T040) - Pure functions and interfaces
- **Phase 3.4: Hooks** (T041-T050) - State management logic
- **Phase 3.5: Components** (T051-T070) - UI implementation
- **Phase 3.6: Integration** (T071-T080) - Wire everything together
- **Phase 3.7: Polish** (T081-T090) - E2E tests, accessibility, performance tuning

**Parallelization**:
- Mark [P] for tasks operating on different files with no dependencies
- Example: All test file creation tasks can run in parallel
- Example: Component implementations can run in parallel after hooks complete

**Estimated Output**: 80-90 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plana-para\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build an interactive educational web application for children (ages 6-10) to learn number decomposition and addition. The app presents two numbers (1-9999) that children decompose into place values (units, tens, hundreds, thousands) by clicking category buttons and filling visual cylinders. Features include: setup screen for manual/random number selection, blocking overflow, undo functionality (LIFO), localStorage persistence, and final sum visualization. Uses React 19 with TypeScript, Vite, Tailwind CSS for styling, and Framer Motion for smooth animations.

## Technical Context
**Language/Version**: TypeScript 5.9+ with strict mode, React 19 with React Compiler  
**Primary Dependencies**: 
- Vite (Rolldown 7.1.14) - Build tool and dev server
- Tailwind CSS 3+ - Utility-first styling
- Framer Motion 11+ - Animation library for drag interactions and transitions
- React 19.1.1 - Component framework
- React DOM 19.1.1 - DOM rendering

**Storage**: Browser localStorage for session persistence (graceful degradation if unavailable)  
**Testing**: Vitest + React Testing Library (component testing), Playwright (E2E), TypeScript compiler (type checking)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), tablets, laptops, desktop computers  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: 
- Initial load <3s on 3G connection
- Interactions <100ms response time
- 60 fps animations for piece movements
- Bundle size optimized (<500KB initial)

**Constraints**: 
- Spanish language only for UI text
- WCAG 2.1 AA accessibility compliance
- No server/backend required (client-side only)
- Must work offline after initial load
- Large touch targets for children (min 44x44px)

**Scale/Scope**: 
- Single user, single session
- Exactly 2 numbers per exercise
- 7 React components (estimated)
- No user accounts or progress tracking across sessions

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Component-Based Architecture ✅ PASS
- [ ] **Self-contained components**: Each component (SetupScreen, NumberDisplay, CategoryButtons, Cylinder, ActionButtons, SumVisualization) manages its own state
- [ ] **Reusable design**: Cylinder component reused for both numbers; Piece component reused across all place values
- [ ] **TypeScript documentation**: All props, state, and handlers explicitly typed with interfaces
- [ ] **Testable in isolation**: Each component can be tested independently with mocked props

**Rationale**: Component structure naturally maps to UI sections and supports future expansion (e.g., adding 3-digit exercises later).

### II. Educational UX First ✅ PASS
- [ ] **Immediate feedback**: Visual updates on piece deposit, blocking feedback on overflow, validation messages on incorrect decomposition
- [ ] **Progressive disclosure**: Setup → First number → Second number → Sum (step-by-step flow)
- [ ] **Error tolerance**: Undo button allows mistake correction; encouraging feedback instead of harsh errors
- [ ] **Accessibility**: Keyboard navigation, ARIA labels, high contrast, large touch targets (44x44px minimum)

**Rationale**: Design prioritizes learning experience with clear visual feedback and error recovery mechanisms.

### III. Test-First Development (NON-NEGOTIABLE) ✅ PASS
- [ ] **Tests before implementation**: Component render tests, interaction tests, localStorage tests, validation tests written first
- [ ] **Red-Green-Refactor**: All tests will fail initially (no components exist yet)
- [ ] **Focus areas**: 
  - Component rendering (SetupScreen, Cylinder, CategoryButtons)
  - User interactions (clicking buttons, undo, validation)
  - Mathematical correctness (decomposition validation, sum calculation)
  - Edge cases (overflow blocking, empty undo, localStorage unavailable)

**Rationale**: Educational software must be reliable; TDD ensures correctness and prevents regressions.

### IV. Type Safety ✅ PASS
- [ ] **No `any` types**: All entities (Exercise, NumberChallenge, Decomposition, Cylinder, Piece, PersistedState) have explicit TypeScript interfaces
- [ ] **Props typed**: All component props use interfaces (e.g., `CylinderProps`, `CategoryButtonsProps`)
- [ ] **Mathematical functions typed**: `validateDecomposition(number: number, decomp: Decomposition): ValidationResult`
- [ ] **Strict mode enabled**: tsconfig.json already has strict mode

**Rationale**: Type safety catches place value calculation errors at compile time and documents component contracts.

### V. Performance & Accessibility ✅ PASS
- [ ] **Performance**: 
  - Initial load <3s target (Vite optimizations, code splitting)
  - <100ms interactions (React 19 compiler optimizations)
  - Framer Motion animations at 60 fps
  - localStorage operations async/non-blocking
- [ ] **Bundle size**: Tailwind purge removes unused styles; Framer Motion tree-shaken
- [ ] **Accessibility**: 
  - Semantic HTML (`<button>`, `<main>`, `<section>`)
  - ARIA labels for cylinders and pieces
  - Keyboard navigation (Tab, Enter, Space)
  - Color contrast ratios >4.5:1 for text, >3:1 for UI components
- [ ] **Internationalization**: Spanish primary (hardcoded for v1, structure supports i18n expansion)

**Rationale**: Fast, accessible experience ensures all children can learn effectively regardless of device or ability.

### 🎯 Initial Constitution Check: **PASS**
All five principles satisfied. No violations requiring justification.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/
│   ├── number-decomposition/      # Feature components
│   │   ├── SetupScreen.tsx         # Setup: manual/random number selection
│   │   ├── NumberDisplay.tsx       # Displays current number (center-left)
│   │   ├── CategoryButtons.tsx     # 4 buttons: Unit, Ten, Hundred, Thousand
│   │   ├── Cylinder.tsx            # Visual container for pieces
│   │   ├── Piece.tsx               # Individual place value visual
│   │   ├── ActionButtons.tsx       # Undo + Count/Finish buttons
│   │   └── SumVisualization.tsx    # Final sum display
│   └── shared/                     # Shared/future components
│       └── Button.tsx              # Reusable button with Tailwind styles
├── types/
│   └── number-decomposition.ts     # TypeScript interfaces for all entities
├── hooks/
│   ├── useExercise.ts              # Exercise state management hook
│   ├── useLocalStorage.ts          # localStorage persistence hook
│   └── useDecomposition.ts         # Decomposition logic & validation hook
├── utils/
│   ├── decomposition.ts            # Validation & calculation functions
│   ├── number-generator.ts         # Random number generation
│   └── localStorage.ts             # localStorage helpers with error handling
├── App.tsx                         # Main app (routes to SetupScreen or Exercise)
├── main.tsx                        # Entry point (already exists)
└── index.css                       # Tailwind imports + custom styles

tests/
├── components/
│   └── number-decomposition/       # Component tests (Vitest + RTL)
│       ├── SetupScreen.test.tsx
│       ├── NumberDisplay.test.tsx
│       ├── CategoryButtons.test.tsx
│       ├── Cylinder.test.tsx
│       ├── Piece.test.tsx
│       ├── ActionButtons.test.tsx
│       └── SumVisualization.test.tsx
├── hooks/
│   ├── useExercise.test.ts
│   ├── useLocalStorage.test.ts
│   └── useDecomposition.test.ts
├── utils/
│   ├── decomposition.test.ts
│   ├── number-generator.test.ts
│   └── localStorage.test.ts
└── e2e/
    ├── complete-exercise.spec.ts   # Full user flow (Playwright)
    ├── undo-functionality.spec.ts  # Undo edge cases
    └── localStorage.spec.ts        # Persistence scenarios

public/
└── vite.svg                        # (existing)

Root configuration files (existing):
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js              # NEW - Tailwind configuration
├── postcss.config.js               # NEW - PostCSS for Tailwind
└── vitest.config.ts                # NEW - Vitest test configuration
```

**Structure Decision**: Single-page application (SPA) structure. All decomposition feature components grouped under `src/components/number-decomposition/` for cohesion. Hooks pattern for state management (React best practice). Utils for pure functions (testable). Tests mirror src/ structure for discoverability.

## Phase 0: Outline & Research ✅ COMPLETE

**Research Topics Addressed**:
1. React component architecture for educational apps → Compound component pattern
2. Framer Motion for animations → Declarative API, 60fps performance, ~50KB gzipped
3. localStorage patterns → Custom useLocalStorage hook with debouncing
4. Tailwind CSS for child-friendly UI → Utility-first with custom design tokens
5. Testing strategy → Vitest + RTL + Playwright (3-layer approach)
6. State management → React hooks only (no Redux/Zustand needed)
7. Accessibility for child users → Keyboard + ARIA + high contrast + large targets
8. Number decomposition validation → Pure function comparing expected vs actual

**Key Decisions Made**:
- **Component Pattern**: Compound components (Cylinder + Pieces) for testability
- **Animation Library**: Framer Motion for layout animations and gestures
- **Persistence**: Custom hook with error handling and graceful degradation
- **Styling**: Tailwind CSS with custom color scale for pieces/cylinders
- **Testing**: Vitest (unit/integration), Playwright (E2E), 80%+ coverage target
- **State**: useReducer for exercise state machine, custom hooks for logic encapsulation
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, ARIA labels

**Output**: `research.md` with 8 research topics and implementation guidance

## Phase 1: Design & Contracts ✅ COMPLETE
*Prerequisites: research.md complete ✅*

**1. Data Model Created** → `data-model.md`:
- **7 Core Interfaces**: ExerciseSession, NumberChallenge, Decomposition, CylinderState, Piece, ValidationResult, PersistedState
- **Type Unions**: SetupMode ('manual' | 'random'), ExercisePhase ('setup' | 'first' | 'second' | 'complete'), PieceType ('unit' | 'ten' | 'hundred' | 'thousand')
- **Validation Functions**: isValidNumber, calculateExpectedDecomposition, validateDecomposition
- **State Machine**: Phase transition logic with conditions
- **localStorage Schema**: Version 1 with serialization/deserialization helpers

**2. Component Contracts Defined** → `/contracts/components.md`:
- **7 Component Contracts**: SetupScreen, NumberDisplay, CategoryButtons, Cylinder, Piece, ActionButtons, SumVisualization
- **3 Custom Hook Contracts**: useExercise, useLocalStorage, useDecomposition
- **Props Interfaces**: All components have TypeScript prop interfaces
- **Test Scenarios**: Render, interaction, and edge case tests defined for each component
- **Accessibility Requirements**: Keyboard navigation, ARIA labels, contrast ratios, touch targets

**3. Test Scenarios Extracted** → `quickstart.md`:
- **7 Test Phases**: Setup, First Number, Second Number, Sum Visualization, localStorage, Accessibility, Performance
- **Manual Test Checklist**: 50+ verification points covering all 43 functional requirements
- **Automated Test Commands**: Unit test, coverage, and E2E test execution
- **Test Data Sets**: 7 number combinations for comprehensive testing
- **Success Criteria**: Coverage targets, performance metrics, browser compatibility

**4. Agent Context Update**: (Skipped - will be done via script after plan review)

**Output Files**:
- ✅ `data-model.md` (386 lines)
- ✅ `contracts/components.md` (442 lines)
- ✅ `quickstart.md` (383 lines)

**Post-Design Constitution Check**: ✅ PASS (see below)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

**No constitutional violations** - This section intentionally left empty.

All design decisions align with constitutional principles:
- Component-based architecture follows best practices
- Educational UX prioritized in all design decisions
- Test-first approach planned from the start
- Type safety enforced via TypeScript strict mode
- Performance and accessibility requirements defined and achievable

---

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [✅] Phase 0: Research complete (/plan command) - `research.md` created
- [✅] Phase 1: Design complete (/plan command) - `data-model.md`, `contracts/`, `quickstart.md` created
- [✅] Phase 2: Task planning complete (/plan command - approach described above)
- [ ] Phase 3: Tasks generated (/tasks command) - **NEXT STEP**
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [✅] Initial Constitution Check: PASS
- [✅] Post-Design Constitution Check: PASS
- [✅] All NEEDS CLARIFICATION resolved (spec marked "Ready for Planning")
- [✅] Complexity deviations documented (none - section empty)

**Artifacts Generated**:
1. ✅ `plan.md` - This file (implementation plan)
2. ✅ `research.md` - Technology research and decisions (8 topics)
3. ✅ `data-model.md` - TypeScript interfaces and validation logic (7 entities)
4. ✅ `contracts/components.md` - Component contracts and test scenarios (7 components + 3 hooks)
5. ✅ `quickstart.md` - Manual testing guide (7 phases, 50+ checkpoints)

**Ready for `/tasks` command** ✅

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
