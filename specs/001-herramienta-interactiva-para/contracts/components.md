# Component Contracts: Number Decomposition Feature

**Date**: 2025-10-03  
**Feature**: 001-herramienta-interactiva-para

---

## SetupScreen Component

### Purpose
Initial screen where teacher/user chooses between manual number entry or random generation.

### Props Interface

```typescript
export interface SetupScreenProps {
  onSetupComplete: (numbers: [number, number], mode: SetupMode) => void;
  initialMode?: SetupMode;
  initialNumbers?: [number, number];
}
```

### Test Scenarios
- ✅ Renders mode selection buttons
- ✅ Manual mode: validates number input (1-9999)
- ✅ Random mode: generates valid numbers
- ✅ Calls onSetupComplete with correct values
- ✅ Keyboard navigation works

---

## NumberDisplay Component

### Purpose
Displays the current number being decomposed (center-left, large typography).

### Props Interface

```typescript
export interface NumberDisplayProps {
  number: number; // 1-9999
  label: string; // e.g., "Primer número" or "Segundo número"
}
```

### Test Scenarios
- ✅ Renders number with correct formatting
- ✅ Uses large font size for readability
- ✅ Has aria-label for screen readers

---

## CategoryButtons Component

### Purpose
Four buttons for selecting place value categories (Unit, Ten, Hundred, Thousand).

### Props Interface

```typescript
export interface CategoryButtonsProps {
  onCategorySelect: (type: PieceType) => void;
  disabled: boolean; // When cylinder inactive or validation in progress
  blockedCategories: Set<PieceType>; // Categories at max capacity
}
```

### Test Scenarios
- ✅ Renders 4 buttons with Spanish labels
- ✅ Calls onCategorySelect when clicked
- ✅ Disables buttons when disabled prop true
- ✅ Shows visual feedback for blocked categories
- ✅ Keyboard accessible (Tab, Enter, Space)

---

## Cylinder Component

### Purpose
Visual container that accumulates pieces, showing decomposition progress.

### Props Interface

```typescript
export interface CylinderProps {
  id: number; // 1 or 2
  color: string; // 'cylinder-1' or 'cylinder-2'
  numberValue: number;
  isActive: boolean;
  decomposition: Decomposition;
  pieces: Piece[];
  label: string; // e.g., "Cilindro para 5214"
}
```

### Test Scenarios
- ✅ Renders with correct color
- ✅ Shows all pieces in order
- ✅ Active state visually distinct from inactive
- ✅ Pieces animate in with Framer Motion
- ✅ Has aria-label describing content

---

## Piece Component

### Purpose
Individual visual element representing a place value unit.

### Props Interface

```typescript
export interface PieceProps {
  id: string;
  type: PieceType;
  color: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
}
```

### Test Scenarios
- ✅ Renders with correct size/color for type
- ✅ Animates smoothly with Framer Motion
- ✅ Has aria-label describing piece type

---

## ActionButtons Component

### Purpose
Undo and Count/Finish buttons for interaction control.

### Props Interface

```typescript
export interface ActionButtonsProps {
  onUndo: () => void;
  onCountFinish: () => void;
  canUndo: boolean; // False when cylinder empty
  countFinishLabel: string; // "CONTAR / TERMINAR"
  isValidating: boolean; // Show loading state during validation
}
```

### Test Scenarios
- ✅ Undo button disabled when canUndo false
- ✅ Calls onUndo when undo clicked
- ✅ Calls onCountFinish when count/finish clicked
- ✅ Shows loading state during validation
- ✅ Keyboard accessible

---

## SumVisualization Component

### Purpose
Final screen showing both cylinders and calculated sum.

### Props Interface

```typescript
export interface SumVisualizationProps {
  firstNumber: number;
  secondNumber: number;
  firstCylinder: CylinderState;
  secondCylinder: CylinderState;
  sum: number;
  onRestart: () => void; // Start new exercise
}
```

### Test Scenarios
- ✅ Displays both cylinders side by side
- ✅ Shows sum calculation clearly
- ✅ Restart button resets to setup screen
- ✅ Celebrates completion (animation/message)

---

## Custom Hooks

### useExercise Hook

```typescript
export function useExercise(
  initialState?: PersistedState
): {
  exercise: ExerciseSession;
  cylinders: [CylinderState, CylinderState];
  phase: ExercisePhase;
  addPiece: (type: PieceType) => void;
  undo: () => void;
  validate: () => ValidationResult;
  transitionPhase: () => void;
  restart: () => void;
}
```

**Purpose**: Manages exercise state machine and decomposition logic.

**Test Scenarios**:
- ✅ Initializes with setup phase
- ✅ Transitions through phases correctly
- ✅ addPiece blocks overflow
- ✅ undo removes last piece (LIFO)
- ✅ validate returns correct ValidationResult
- ✅ Persists to localStorage on state change

---

### useLocalStorage Hook

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void]
```

**Purpose**: Syncs state with localStorage, handles errors gracefully.

**Test Scenarios**:
- ✅ Reads from localStorage on mount
- ✅ Writes to localStorage on setValue (debounced)
- ✅ Handles localStorage unavailable gracefully
- ✅ Handles quota exceeded error
- ✅ Clear function removes from localStorage

---

### useDecomposition Hook

```typescript
export function useDecomposition(
  targetNumber: number
): {
  decomposition: Decomposition;
  pieceHistory: PieceType[];
  addPiece: (type: PieceType) => boolean;
  removePiece: () => PieceType | null;
  validate: () => ValidationResult;
  reset: () => void;
}
```

**Purpose**: Manages decomposition for a single number.

**Test Scenarios**:
- ✅ Initializes with zero decomposition
- ✅ addPiece increments correct category
- ✅ addPiece returns false when blocked
- ✅ removePiece uses LIFO order
- ✅ validate compares against expected
- ✅ reset clears all state

---

## Component Hierarchy

```
App
└── ExerciseContainer (manages useExercise hook)
    ├── SetupScreen (phase === 'setup')
    │   └── [form inputs and buttons]
    │
    ├── ExerciseScreen (phase === 'first' | 'second')
    │   ├── NumberDisplay
    │   ├── CategoryButtons
    │   ├── Cylinder (first - active when phase === 'first')
    │   │   └── Piece[] (with Framer Motion)
    │   ├── Cylinder (second - active when phase === 'second')
    │   │   └── Piece[] (with Framer Motion)
    │   └── ActionButtons
    │
    └── SumVisualization (phase === 'complete')
        ├── Cylinder (first - readonly)
        ├── Cylinder (second - readonly)
        └── [sum display + restart button]
```

---

## API Surface (Utils)

### decomposition.ts

```typescript
export function isValidNumber(value: number): boolean;
export function calculateExpectedDecomposition(num: number): Decomposition;
export function validateDecomposition(target: number, actual: Decomposition): ValidationResult;
export function addPieceToCylinder(target: number, current: Decomposition, type: PieceType): Decomposition | null;
export function removeLastPieceFromCylinder(decomp: Decomposition, history: PieceType[]): {decomposition: Decomposition; removedType: PieceType} | null;
```

### number-generator.ts

```typescript
export function generateRandomNumber(min: number, max: number): number;
export function generateTwoNumbers(): [number, number];
```

### localStorage.ts

```typescript
export function saveToLocalStorage(key: string, value: unknown): boolean;
export function loadFromLocalStorage<T>(key: string): T | null;
export function clearLocalStorage(key: string): void;
```

---

## Test Coverage Goals

| Layer | Coverage Target | Rationale |
|-------|----------------|-----------|
| Utils (decomposition.ts) | 100% | Mathematical correctness critical |
| Hooks | >90% | Complex state logic |
| Components | >80% | Focus on interactions, not styles |
| E2E | Critical paths | Full user flows (setup → decompose → sum) |

---

## Accessibility Requirements

All components MUST meet:
- [ ] Keyboard navigation (Tab, Enter, Space, Arrow keys where applicable)
- [ ] ARIA labels for non-text elements
- [ ] Focus visible indicators (outline-offset: 4px)
- [ ] Color contrast >4.5:1 for text, >3:1 for UI elements
- [ ] Touch targets minimum 44x44px
- [ ] Screen reader announcements for dynamic content (aria-live)

---

## Performance Requirements

All components MUST meet:
- [ ] Initial render <100ms
- [ ] Interaction response <100ms
- [ ] Animations run at 60fps (use Framer Motion's GPU-accelerated transforms)
- [ ] Bundle size contribution tracked (use bundleAnalyzer)
- [ ] No memory leaks (cleanup in useEffect)
