<!--
SYNC IMPACT REPORT
==================
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

### I. Component-Based Architecture
Every feature MUST be implemented as one or more React components that are:
- **Self-contained**: Components manage their own state and logic
- **Reusable**: Designed for composition and reuse across different mathematical concepts
- **Documented**: Props, state, and behavior clearly documented with TypeScript types
- **Testable**: Each component can be tested in isolation

**Rationale**: Component-based architecture ensures the educational app can scale with new math topics while maintaining code quality and enabling rapid feature development.

### II. Educational UX First
User experience for learning MUST take priority:
- **Immediate Feedback**: Mathematical operations provide instant visual or numerical feedback
- **Progressive Disclosure**: Complex concepts introduced gradually with appropriate scaffolding
- **Error Tolerance**: User mistakes become learning opportunities, not blockers
- **Accessibility**: WCAG 2.1 AA compliance minimum; support for screen readers and keyboard navigation

**Rationale**: The primary goal is education. Technical implementation serves the learning experience, not vice versa.

### III. Test-First Development (NON-NEGOTIABLE)
Test-Driven Development is mandatory for all features:
- Tests written and reviewed BEFORE implementation
- Tests MUST fail initially (Red phase)
- Implementation makes tests pass (Green phase)
- Refactoring maintains passing tests (Refactor phase)
- Focus areas: Component rendering, user interactions, mathematical correctness, edge cases

**Rationale**: Educational software must be reliable. TDD ensures mathematical accuracy and prevents regressions that could confuse learners.

### IV. Type Safety
TypeScript MUST be used rigorously:
- No `any` types without explicit justification and comment
- Props and state explicitly typed
- Mathematical functions have type-safe signatures
- Complex data structures use interfaces or types
- Strict mode enabled in `tsconfig.json`

**Rationale**: Type safety catches errors at compile time, documents intent, and makes the codebase more maintainable as it grows with new mathematical topics.

### V. Performance & Accessibility
The application MUST be fast and inclusive:
- **Performance**: Initial load <3s on 3G, interactions <100ms response
- **Bundle Size**: Monitor and optimize; lazy load complex mathematical visualizations
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, sufficient color contrast
- **Internationalization**: Support for multiple languages (Spanish primary, English secondary)

**Rationale**: Educational tools must be accessible to all learners regardless of device capabilities, internet speed, or abilities. Performance impacts learning retention.

## Technology Stack

### Core Technologies
- **React 19**: Component framework with React Compiler enabled for performance
- **TypeScript 5.9**: Type-safe development with strict mode
- **Vite (Rolldown)**: Fast build tooling and development server
- **Bun**: Package management and runtime

### Quality Assurance
- **ESLint**: Code quality and React best practices enforcement
- **TypeScript Compiler**: Type checking as part of build process
- Testing framework MUST be selected and configured (e.g., Vitest, Jest, React Testing Library)

### Constraints
- All dependencies MUST be evaluated for bundle size impact
- New dependencies require justification documenting alternatives considered
- Prefer standard web APIs over heavy libraries when practical

## Development Workflow

### Feature Development Process
1. **Specification**: Create feature spec using `.specify/templates/spec-template.md`
2. **Planning**: Generate implementation plan using `.specify/templates/plan-template.md`
3. **Constitution Check**: Verify feature aligns with all five core principles
4. **Task Generation**: Create tasks using `.specify/templates/tasks-template.md`
5. **TDD Cycle**: Write tests → Review → Fail tests → Implement → Pass tests → Refactor
6. **Review**: Code review verifies constitution compliance and educational effectiveness

### Quality Gates
All features MUST pass these gates before merging:
- [ ] Constitution compliance verified in plan.md
- [ ] All tests written before implementation and initially failing
- [ ] TypeScript strict mode passes with no errors
- [ ] ESLint passes with no warnings
- [ ] Educational UX reviewed (clarity, feedback, accessibility)
- [ ] Performance budget maintained (bundle size, load time)

### Documentation Requirements
- Component props documented with JSDoc or TypeScript comments
- Mathematical algorithms explained with formulas and rationale
- User-facing features have examples in `README.md` or docs
- Complex state management patterns documented inline

## Governance

### Amendment Process
1. Propose amendment with rationale and impact analysis
2. Document affected templates and code
3. Version bump according to semantic versioning:
   - **MAJOR**: Removing/redefining principles, incompatible changes
   - **MINOR**: Adding principles or expanding guidance
   - **PATCH**: Clarifications, typos, wording improvements
4. Update all dependent templates and documentation
5. Migration plan for existing features if needed

### Compliance
- All feature plans MUST include Constitution Check section
- Code reviews MUST verify constitutional compliance
- Violations require explicit justification or redesign
- This constitution supersedes all other development practices

### Versioning Policy
Constitution follows semantic versioning: `MAJOR.MINOR.PATCH`
- Track all changes in the Sync Impact Report (HTML comment)
- Document rationale for every version increment
- Review constitution every 6 months or when major architectural changes occur

**Version**: 1.0.0 | **Ratified**: 2025-10-03 | **Last Amended**: 2025-10-03