# Research: Interactive Number Decomposition Learning Tool

**Date**: 2025-10-03  
**Feature**: 001-herramienta-interactiva-para

## Research Topics

### 1. React Component Architecture for Educational Apps

**Decision**: Use compound component pattern for Cylinder + Pieces  
**Rationale**: 
- Cylinder manages collection state, Pieces are presentational
- Enables flexible composition (different piece types, colors, sizes)
- Clear parent-child relationship matches domain model (cylinder contains pieces)
- Testable independently

**Alternatives Considered**:
- Single monolithic component: Rejected due to poor testability and reusability
- Context-based state: Overkill for this localized feature, adds unnecessary complexity

**References**:
- React docs on composition: https://react.dev/learn/passing-props-to-a-component
- Compound components pattern: https://kentcdodds.com/blog/compound-components-with-react-hooks

---

### 2. Framer Motion for Educational Animations

**Decision**: Use Framer Motion for piece animations and cylinder transitions  
**Rationale**:
- Declarative animation API integrates seamlessly with React
- Built-in layout animations for adding/removing pieces (layoutId, AnimatePresence)
- Spring physics for natural movement feel
- Gesture detection for future drag-and-drop enhancements
- Performance optimized for 60fps (GPU-accelerated transforms)
- Tree-shakeable (only import what's used)

**Implementation Approach**:
- `motion.div` for Piece components with scale/opacity animations
- `AnimatePresence` for smooth piece removal on undo
- `layout` prop for automatic position transitions when pieces reflow
- Spring transitions for piece "drop" into cylinder effect

**Alternatives Considered**:
- CSS transitions: Less flexible, no gesture support, harder to coordinate multiple animations
- React Spring: Similar capabilities but Framer Motion has better TypeScript support and simpler API
- GSAP: More powerful but larger bundle size, overkill for this use case

**Bundle Impact**: ~50KB gzipped (acceptable within performance budget)

**References**:
- Framer Motion docs: https://motion.dev/docs/react-quick-start
- Layout animations: https://motion.dev/docs/react-layout-animations
- AnimatePresence: https://motion.dev/docs/react-animate-presence

---

### 3. localStorage Patterns for React Applications

**Decision**: Custom `useLocalStorage` hook with error handling and debouncing  
**Rationale**:
- Encapsulates localStorage logic in reusable hook
- Automatic JSON serialization/deserialization
- Error handling for quota exceeded, unavailable storage
- Debouncing to avoid excessive writes (every piece action could spam localStorage)
- Graceful degradation when localStorage unavailable (Safari private mode)

**Implementation Pattern**:
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // State synced with localStorage
  // Automatic serialization
  // Error handling with try-catch
  // Debounced writes (300ms delay)
  // Returns [value, setValue, clear]
}
```

**Alternatives Considered**:
- Direct localStorage calls: Repetitive error handling, no debouncing
- Third-party library (localforage): Unnecessary complexity, adds IndexedDB support we don't need
- Redux Persist: Overkill, we're not using Redux

**References**:
- Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- React hook patterns: https://usehooks.com/useLocalStorage/
- Debouncing: https://www.freecodecamp.org/news/debounce-and-throttle-in-react-with-hooks/

---

### 4. Tailwind CSS for Child-Friendly UI

**Decision**: Tailwind CSS with custom design system configuration  
**Rationale**:
- Utility-first approach enables rapid prototyping
- PurgeCSS removes unused styles (small bundle)
- Easy to enforce design consistency (spacing scale, colors)
- Responsive design built-in (mobile-first)
- Large touch targets via spacing utilities

**Custom Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cylinder-1': '#10b981', // Green for first cylinder
        'cylinder-2': '#f59e0b', // Orange for second cylinder
        'piece-unit': '#3b82f6',    // Blue for units
        'piece-ten': '#8b5cf6',     // Purple for tens
        'piece-hundred': '#ec4899', // Pink for hundreds
        'piece-thousand': '#ef4444' // Red for thousands
      },
      fontSize: {
        'huge': ['6rem', { lineHeight: '1' }], // For main number display
      },
      spacing: {
        'touch': '44px', // Minimum touch target size
      }
    }
  }
}
```

**Alternatives Considered**:
- CSS Modules: More verbose, manual responsive design
- Styled Components: Runtime CSS-in-JS overhead, larger bundle
- Plain CSS: Harder to maintain consistency, no purging

**References**:
- Tailwind CSS docs: https://tailwindcss.com/docs
- Color contrast checker: https://webaim.org/resources/contrastchecker/
- Touch target sizing: https://web.dev/accessible-tap-targets/

---

### 5. Testing Strategy for Interactive Educational Apps

**Decision**: Three-layer testing approach
1. **Unit tests** (Vitest + React Testing Library): Utils, hooks, component logic
2. **Integration tests** (RTL): Component interactions, state changes
3. **E2E tests** (Playwright): Full user flows, localStorage persistence

**Rationale**:
- Unit tests: Fast feedback, test pure functions (validation, calculations)
- Integration tests: Component interactions, user events, accessibility
- E2E tests: Critical paths (complete exercise, undo, persistence)

**Test Coverage Goals**:
- Utils: 100% (mathematical correctness critical)
- Hooks: >90% (complex state logic)
- Components: >80% (focus on interactions, not styles)
- E2E: Critical paths only (3-4 scenarios)

**Vitest Setup**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['**/*.test.ts', '**/*.test.tsx']
    }
  }
})
```

**Alternatives Considered**:
- Jest: Vitest is faster, better Vite integration, ESM support
- Testing Library only: No E2E coverage for critical user flows
- Cypress vs Playwright: Playwright has better TypeScript support, faster execution

**References**:
- Vitest docs: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright: https://playwright.dev/

---

### 6. State Management Strategy

**Decision**: React hooks (useState, useReducer) with custom hooks, NO external state library  
**Rationale**:
- Feature scope is contained (single exercise, no global shared state)
- React 19's built-in hooks are sufficient
- useReducer for complex exercise state machine (setup → first → second → complete)
- Custom hooks encapsulate reusable logic (useExercise, useDecomposition, useLocalStorage)
- Reduces bundle size and complexity

**State Architecture**:
```
App (top-level)
├── useLocalStorage (persistence)
└── useExercise (exercise state machine)
    ├── Setup phase state
    ├── First number state
    │   └── useDecomposition (cylinder 1)
    └── Second number state
        └── useDecomposition (cylinder 2)
```

**Alternatives Considered**:
- Redux/Zustand: Overkill for single-feature app, adds unnecessary boilerplate
- Context API: Not needed, props drilling is minimal (max 2-3 levels)
- Jotai/Recoil: Atomic state is elegant but adds dependency for no clear benefit

**References**:
- React hooks: https://react.dev/reference/react/hooks
- useReducer for state machines: https://kentcdodds.com/blog/how-to-use-react-context-effectively

---

### 7. Accessibility for Child Users

**Decision**: Keyboard navigation + ARIA labels + high contrast + large targets  
**Rationale**:
- Some children may have motor skill difficulties (large touch targets help)
- Screen reader support for visually impaired children
- Keyboard navigation for children who prefer/need it
- High contrast aids learning (clearer visual distinction)

**Implementation Checklist**:
- [ ] All buttons keyboard accessible (Tab, Enter, Space)
- [ ] Focus visible indicator (outline-offset: 4px)
- [ ] ARIA labels for cylinders ("Cilindro 1 para primer número")
- [ ] ARIA live regions for validation feedback
- [ ] Skip to main content link
- [ ] Color not sole indicator (shapes/sizes also differ for pieces)
- [ ] Contrast ratio >4.5:1 for text, >3:1 for UI elements

**Testing Approach**:
- axe-core with Vitest for automated accessibility testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA/JAWS on Windows, VoiceOver on macOS/iOS)

**References**:
- WCAG 2.1 guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA patterns: https://www.w3.org/WAI/ARIA/apg/patterns/
- axe-core: https://github.com/dequelabs/axe-core

---

### 8. Number Decomposition Validation Logic

**Decision**: Calculate expected decomposition from number, compare with actual  
**Rationale**:
- Simple, foolproof algorithm
- Handles all numbers 1-9999
- Easy to test (pure function)

**Algorithm**:
```typescript
function getExpectedDecomposition(num: number): Decomposition {
  return {
    thousands: Math.floor(num / 1000),
    hundreds: Math.floor((num % 1000) / 100),
    tens: Math.floor((num % 100) / 10),
    units: num % 10
  }
}

function validateDecomposition(
  target: number, 
  actual: Decomposition
): ValidationResult {
  const expected = getExpectedDecomposition(target)
  const isCorrect = 
    expected.thousands === actual.thousands &&
    expected.hundreds === actual.hundreds &&
    expected.tens === actual.tens &&
    expected.units === actual.units
  
  return {
    isCorrect,
    missing: calculateMissing(expected, actual),
    extra: calculateExtra(expected, actual),
    feedbackMessage: generateFeedback(isCorrect, missing, extra)
  }
}
```

**Alternatives Considered**:
- Sum-based validation (check if pieces add up): Allows incorrect decompositions (e.g., 2345 could be 2000+300+45)
- Visual-only comparison: Not testable, error-prone

**References**:
- Place value concept: https://en.wikipedia.org/wiki/Positional_notation
- Modulo arithmetic: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder

---

## Summary of Key Decisions

| Topic | Decision | Primary Rationale |
|-------|----------|-------------------|
| Component Architecture | Compound components (Cylinder + Pieces) | Testability, reusability, domain mapping |
| Animations | Framer Motion | Declarative API, performance, bundle size acceptable |
| Persistence | Custom useLocalStorage hook | Encapsulation, error handling, debouncing |
| Styling | Tailwind CSS with custom config | Rapid development, small bundle, consistency |
| Testing | Vitest + RTL + Playwright (3 layers) | Fast feedback, component testing, E2E coverage |
| State Management | React hooks (no external library) | Sufficient for scope, reduces complexity |
| Accessibility | Keyboard + ARIA + contrast + large targets | Inclusive design for diverse learners |
| Validation | Pure function comparing expected vs actual | Simple, testable, foolproof |

---

## Implementation Readiness

✅ **All technical unknowns resolved**  
✅ **Technology stack validated against requirements**  
✅ **Performance budget confirmed achievable**  
✅ **Accessibility approach defined**  
✅ **Testing strategy established**

**Ready to proceed to Phase 1: Design & Contracts**
