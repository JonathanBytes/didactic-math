# Quickstart Testing Guide: Number Decomposition Feature

**Date**: 2025-10-03  
**Feature**: 001-herramienta-interactiva-para  
**Purpose**: Manual testing scenarios to validate feature implementation

---

## Prerequisites

### Development Server Running
```bash
bun run dev
```
Navigate to: `http://localhost:5173`

### Testing Dependencies Installed
```bash
bun install
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
bun add -d playwright @playwright/test
```

---

## Quick Validation Checklist

### ✅ Phase 1: Setup Screen

1. **Manual Number Entry**
   - [ ] Click "Ingresar Números" button
   - [ ] Enter first number: `2345`
   - [ ] Enter second number: `6789`
   - [ ] Click "Comenzar"
   - [ ] Verify: Transitions to exercise screen with first number displayed

2. **Random Number Generation**
   - [ ] Refresh page (or click restart)
   - [ ] Click "Números Aleatorios"
   - [ ] Click "Generar y Comenzar"
   - [ ] Verify: Two random numbers generated (check they're between 1-9999)

3. **Validation Errors**
   - [ ] Try entering `0` → Should show error
   - [ ] Try entering `10000` → Should show error
   - [ ] Try entering `abc` → Should show error or prevent input

---

### ✅ Phase 2: First Number Decomposition

**Test Number**: 2345  
**Expected Decomposition**: 2 thousands, 3 hundreds, 4 tens, 5 units

1. **Visual Layout**
   - [ ] Number `2345` displayed large and prominent (center-left)
   - [ ] Four category buttons visible (top-right): "1 / Unidad", "10 / Decena", "100 / Centena", "1000 / Millar"
   - [ ] Two cylinders visible (right side), first one active (visually distinct)
   - [ ] Second cylinder visually disabled/grayed out
   - [ ] Undo button visible (should be disabled initially)
   - [ ] "CONTAR / TERMINAR" button visible (bottom-left)

2. **Adding Pieces - Happy Path**
   - [ ] Click "1000 / Millar" twice
   - [ ] Verify: 2 thousand-pieces appear in first cylinder with animation
   - [ ] Click "100 / Centena" three times
   - [ ] Verify: 3 hundred-pieces appear with distinct color/size from thousands
   - [ ] Click "10 / Decena" four times
   - [ ] Verify: 4 ten-pieces appear
   - [ ] Click "1 / Unidad" five times
   - [ ] Verify: 5 unit-pieces appear (smallest size)

3. **Blocking Overflow**
   - [ ] Try clicking "1000 / Millar" again (should be at max: 2)
   - [ ] Verify: Button blocked, no new piece added
   - [ ] Try clicking "100 / Centena" again (should be at max: 3)
   - [ ] Verify: Button blocked

4. **Undo Functionality**
   - [ ] Click undo button
   - [ ] Verify: Last added piece (1 unit) removed with animation
   - [ ] Click undo button 4 more times
   - [ ] Verify: All units removed, then 1 ten removed
   - [ ] Add back the missing pieces (4 tens, 5 units)

5. **Validation - Correct Decomposition**
   - [ ] Click "CONTAR / TERMINAR" with correct decomposition (2, 3, 4, 5)
   - [ ] Verify: Success message appears (e.g., "¡Excelente! ...")
   - [ ] Verify: Second number appears (6789)
   - [ ] Verify: Second cylinder becomes active
   - [ ] Verify: First cylinder becomes inactive/readonly

6. **Validation - Incorrect Decomposition**
   - [ ] Remove all pieces (undo repeatedly)
   - [ ] Add only 1 thousand piece
   - [ ] Click "CONTAR / TERMINAR"
   - [ ] Verify: Error message appears (e.g., "Te faltan algunas piezas...")
   - [ ] Verify: Still on first number (doesn't advance)
   - [ ] Complete decomposition correctly to proceed

---

### ✅ Phase 3: Second Number Decomposition

**Test Number**: 6789  
**Expected Decomposition**: 6 thousands, 7 hundreds, 8 tens, 9 units

1. **Visual State Transition**
   - [ ] Verify: Number changes to `6789`
   - [ ] Verify: First cylinder visually disabled
   - [ ] Verify: Second cylinder active
   - [ ] Verify: Undo button disabled (no pieces yet in second cylinder)

2. **Complete Second Decomposition**
   - [ ] Add 6 thousand-pieces
   - [ ] Add 7 hundred-pieces
   - [ ] Add 8 ten-pieces
   - [ ] Add 9 unit-pieces
   - [ ] Click "CONTAR / TERMINAR"
   - [ ] Verify: Success message
   - [ ] Verify: Transitions to sum visualization screen

---

### ✅ Phase 4: Sum Visualization

**Expected Sum**: 2345 + 6789 = 9134

1. **Visual Display**
   - [ ] Verify: Both cylinders displayed side by side
   - [ ] Verify: First cylinder shows all pieces from 2345
   - [ ] Verify: Second cylinder shows all pieces from 6789
   - [ ] Verify: Sum displayed clearly: `9134` or equivalent visual
   - [ ] Verify: Celebration message/animation appears
   - [ ] Verify: "Reiniciar" or "Nuevo Ejercicio" button visible

2. **Restart**
   - [ ] Click restart button
   - [ ] Verify: Returns to setup screen
   - [ ] Verify: localStorage cleared (check DevTools → Application → Local Storage)

---

### ✅ Phase 5: localStorage Persistence

1. **Mid-Exercise Persistence**
   - [ ] Start new exercise with numbers 1234 and 5678
   - [ ] Add some pieces to first cylinder (e.g., 1 thousand, 2 hundreds)
   - [ ] Refresh the page (F5)
   - [ ] Verify: Exercise state restored exactly
   - [ ] Verify: Number 1234 still displayed
   - [ ] Verify: Pieces still in first cylinder
   - [ ] Verify: Can continue from where you left off

2. **Completion Clears Storage**
   - [ ] Complete the exercise fully (both numbers)
   - [ ] Verify: localStorage cleared after sum visualization
   - [ ] Refresh page
   - [ ] Verify: Returns to setup screen (no saved state)

3. **Graceful Degradation**
   - [ ] Open DevTools → Application → Storage
   - [ ] Clear Site Data (to simulate unavailable localStorage)
   - [ ] Start exercise
   - [ ] Verify: Exercise still works (just no persistence)
   - [ ] Refresh page
   - [ ] Verify: Returns to setup (no saved state) but no crash

---

### ✅ Phase 6: Accessibility

1. **Keyboard Navigation**
   - [ ] Use Tab key to navigate through all interactive elements
   - [ ] Verify: Focus visible on all elements (outline)
   - [ ] Press Enter on buttons
   - [ ] Verify: Buttons activate correctly
   - [ ] Press Space on buttons
   - [ ] Verify: Buttons activate correctly

2. **Screen Reader**
   - [ ] Enable screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
   - [ ] Navigate through app
   - [ ] Verify: All elements have descriptive labels
   - [ ] Verify: Dynamic content changes announced (validation messages, phase transitions)

3. **Color Contrast**
   - [ ] Use browser DevTools Lighthouse audit
   - [ ] Run accessibility check
   - [ ] Verify: No contrast issues reported
   - [ ] Verify: All text readable on backgrounds

4. **Touch Targets**
   - [ ] Use mobile device or DevTools device emulation
   - [ ] Verify: All buttons easy to tap (44x44px minimum)
   - [ ] Verify: No accidental taps on adjacent buttons

---

### ✅ Phase 7: Performance

1. **Initial Load**
   - [ ] Open DevTools → Network tab
   - [ ] Hard refresh (Ctrl+Shift+R)
   - [ ] Verify: Page loads in <3 seconds on Fast 3G throttling
   - [ ] Verify: Total bundle size <500KB

2. **Interaction Responsiveness**
   - [ ] Click category buttons rapidly
   - [ ] Verify: Pieces appear immediately (<100ms)
   - [ ] Open DevTools → Performance tab
   - [ ] Record interactions
   - [ ] Verify: Frame rate stays at 60fps during animations

3. **Animation Smoothness**
   - [ ] Add multiple pieces quickly
   - [ ] Verify: Animations smooth, no jank
   - [ ] Undo multiple times
   - [ ] Verify: Removal animations smooth

---

## Common Issues & Troubleshooting

### Issue: Pieces not appearing
- Check console for errors
- Verify Framer Motion installed: `bun list framer-motion`
- Check component render in React DevTools

### Issue: localStorage not working
- Check browser privacy settings
- Verify not in private/incognito mode
- Check console for quota errors

### Issue: Validation always fails
- Check decomposition calculation logic in utils
- Verify expected vs actual comparison
- Add console.log to validateDecomposition function

### Issue: Undo not working
- Verify pieceHistory array being maintained
- Check LIFO logic in removeLastPieceFromCylinder
- Ensure undo button disabled state correct

---

## Automated Test Execution

### Unit Tests
```bash
bun run test
# or with coverage
bun run test:coverage
```

Expected output:
```
 ✓ tests/utils/decomposition.test.ts (15 tests)
 ✓ tests/hooks/useExercise.test.ts (12 tests)
 ✓ tests/components/Cylinder.test.tsx (8 tests)
 ... 
 
 Test Files  20 passed (20)
      Tests  85 passed (85)
```

### E2E Tests
```bash
bun run test:e2e
```

Expected output:
```
Running 3 tests using 1 worker

  ✓ complete-exercise.spec.ts:3 - Full exercise flow (5s)
  ✓ undo-functionality.spec.ts:3 - Undo edge cases (3s)
  ✓ localStorage.spec.ts:3 - Persistence scenarios (4s)

  3 passed (12s)
```

---

## Success Criteria

Feature is considered complete when:

- [ ] All manual test scenarios pass
- [ ] All automated tests pass (>80% coverage)
- [ ] No console errors or warnings
- [ ] Lighthouse accessibility score >90
- [ ] Performance metrics met (load <3s, interactions <100ms)
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Works on desktop and tablet
- [ ] localStorage persistence works correctly
- [ ] No memory leaks (test with 10+ exercise cycles)

---

## Test Data Sets

Use these numbers for comprehensive testing:

| Set | First Number | Second Number | Sum | Purpose |
|-----|--------------|---------------|-----|---------|
| 1 | 2345 | 6789 | 9134 | Standard case |
| 2 | 1 | 1 | 2 | Minimum |
| 3 | 9999 | 1 | 10000 | Maximum first |
| 4 | 5000 | 3000 | 8000 | Round thousands |
| 5 | 505 | 404 | 909 | Zeros in middle |
| 6 | 1111 | 2222 | 3333 | Repeating digits |
| 7 | 8765 | 4321 | 13086 | Descending |

---

**Last Updated**: 2025-10-03  
**Test Coverage**: All 43 functional requirements validated
