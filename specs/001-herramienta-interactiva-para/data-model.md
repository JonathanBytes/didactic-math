# Data Model: Interactive Number Decomposition Learning Tool

**Date**: 2025-10-03  
**Feature**: 001-herramienta-interactiva-para

## TypeScript Interfaces

### Core Exercise Entities

```typescript
/**
 * Represents the setup mode chosen by teacher/user
 */
export type SetupMode = 'manual' | 'random';

/**
 * Represents the current phase of the exercise
 */
export type ExercisePhase = 'setup' | 'first' | 'second' | 'complete';

/**
 * Main exercise session containing two numbers to decompose
 */
export interface ExerciseSession {
  /** Unique identifier for the session */
  id: string;
  
  /** How the numbers were selected */
  setupMode: SetupMode;
  
  /** Current phase of the exercise */
  phase: ExercisePhase;
  
  /** First number to decompose (1-9999) */
  firstNumber: NumberChallenge;
  
  /** Second number to decompose (1-9999) */
  secondNumber: NumberChallenge;
  
  /** Timestamp when exercise started */
  startedAt: number; // Unix timestamp
  
  /** Timestamp when exercise completed (null if in progress) */
  completedAt: number | null;
}

/**
 * A specific number (1-9999) that the child must decompose
 */
export interface NumberChallenge {
  /** The target number to decompose */
  value: number; // 1-9999
  
  /** Expected decomposition for validation */
  expected: Decomposition;
  
  /** Child's current decomposition attempt */
  actual: Decomposition;
  
  /** Whether this challenge has been completed */
  isComplete: boolean;
  
  /** History of pieces added (for undo functionality) */
  pieceHistory: PieceType[];
}

/**
 * Place value categories
 */
export type PieceType = 'unit' | 'ten' | 'hundred' | 'thousand';

/**
 * Breakdown of a number into place values
 */
export interface Decomposition {
  /** Number of units (0-9) */
  units: number;
  
  /** Number of tens (0-99 total, but max 9 pieces) */
  tens: number;
  
  /** Number of hundreds (0-900 total, but max 9 pieces) */
  hundreds: number;
  
  /** Number of thousands (0-9000 total, but max 9 pieces) */
  thousands: number;
}

/**
 * Visual container holding decomposed pieces for one number
 */
export interface CylinderState {
  /** Unique identifier (1 or 2) */
  id: number;
  
  /** Color identifier for visual distinction */
  color: string; // e.g., 'cylinder-1' or 'cylinder-2'
  
  /** Associated number challenge */
  numberValue: number;
  
  /** Whether this cylinder is currently active */
  isActive: boolean;
  
  /** Current decomposition in this cylinder */
  decomposition: Decomposition;
  
  /** Ordered array of pieces (for visual rendering and undo) */
  pieces: Piece[];
}

/**
 * Individual visual element representing a place value
 */
export interface Piece {
  /** Unique identifier for React keys and animations */
  id: string;
  
  /** Type of place value */
  type: PieceType;
  
  /** Color for visual distinction */
  color: string;
  
  /** Size/scale for visual distinction (units smaller than thousands) */
  size: 'small' | 'medium' | 'large' | 'xlarge';
  
  /** Timestamp when piece was added (for undo ordering) */
  addedAt: number;
}

/**
 * Result of validating a decomposition
 */
export interface ValidationResult {
  /** Whether the decomposition is correct */
  isCorrect: boolean;
  
  /** Missing pieces by type */
  missing: Partial<Record<PieceType, number>>;
  
  /** Extra pieces by type */
  extra: Partial<Record<PieceType, number>>;
  
  /** Age-appropriate feedback message in Spanish */
  feedbackMessage: string;
  
  /** Severity level for UI styling */
  severity: 'success' | 'error' | 'info';
}

/**
 * Data persisted to localStorage
 */
export interface PersistedState {
  /** Version for migration compatibility */
  version: number; // Start at 1
  
  /** When this state was saved */
  savedAt: number; // Unix timestamp
  
  /** Complete exercise session state */
  exercise: ExerciseSession;
  
  /** Cylinder states */
  cylinders: [CylinderState, CylinderState];
}
```

---

## Validation Rules

### NumberChallenge Validation

```typescript
/**
 * Validates that a number is within the acceptable range
 */
export function isValidNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 9999;
}

/**
 * Calculates the expected decomposition for a given number
 */
export function calculateExpectedDecomposition(num: number): Decomposition {
  if (!isValidNumber(num)) {
    throw new Error(`Invalid number: ${num}. Must be between 1 and 9999.`);
  }
  
  return {
    thousands: Math.floor(num / 1000),
    hundreds: Math.floor((num % 1000) / 100),
    tens: Math.floor((num % 100) / 10),
    units: num % 10
  };
}

/**
 * Validates a decomposition against the expected values
 */
export function validateDecomposition(
  target: number,
  actual: Decomposition
): ValidationResult {
  const expected = calculateExpectedDecomposition(target);
  
  const isCorrect =
    expected.thousands === actual.thousands &&
    expected.hundreds === actual.hundreds &&
    expected.tens === actual.tens &&
    expected.units === actual.units;
  
  const missing: Partial<Record<PieceType, number>> = {};
  const extra: Partial<Record<PieceType, number>> = {};
  
  if (actual.thousands < expected.thousands) {
    missing.thousand = expected.thousands - actual.thousands;
  } else if (actual.thousands > expected.thousands) {
    extra.thousand = actual.thousands - expected.thousands;
  }
  
  if (actual.hundreds < expected.hundreds) {
    missing.hundred = expected.hundreds - actual.hundreds;
  } else if (actual.hundreds > expected.hundreds) {
    extra.hundred = actual.hundreds - expected.hundreds;
  }
  
  if (actual.tens < expected.tens) {
    missing.ten = expected.tens - actual.tens;
  } else if (actual.tens > expected.tens) {
    extra.ten = actual.tens - expected.tens;
  }
  
  if (actual.units < expected.units) {
    missing.unit = expected.units - actual.units;
  } else if (actual.units > expected.units) {
    extra.unit = actual.units - expected.units;
  }
  
  const feedbackMessage = generateFeedbackMessage(isCorrect, missing, extra);
  
  return {
    isCorrect,
    missing,
    extra,
    feedbackMessage,
    severity: isCorrect ? 'success' : 'error'
  };
}

/**
 * Generates age-appropriate feedback in Spanish
 */
function generateFeedbackMessage(
  isCorrect: boolean,
  missing: Partial<Record<PieceType, number>>,
  extra: Partial<Record<PieceType, number>>
): string {
  if (isCorrect) {
    return '¡Excelente! Has descompuesto el número correctamente. 🎉';
  }
  
  const missingCount = Object.keys(missing).length;
  const extraCount = Object.keys(extra).length;
  
  if (missingCount > 0 && extraCount === 0) {
    return '¡Sigue adelante! Te faltan algunas piezas. Revisa el número.';
  }
  
  if (extraCount > 0 && missingCount === 0) {
    return 'Tienes demasiadas piezas. Revisa cuántas necesitas de cada tipo.';
  }
  
  return 'Revisa tu descomposición. Algunas piezas faltan o sobran.';
}
```

---

## State Transitions

### Exercise Phase State Machine

```typescript
export type ExercisePhase = 'setup' | 'first' | 'second' | 'complete';

export interface PhaseTransition {
  from: ExercisePhase;
  to: ExercisePhase;
  condition: string;
}

export const PHASE_TRANSITIONS: PhaseTransition[] = [
  {
    from: 'setup',
    to: 'first',
    condition: 'Two valid numbers selected (manual or random)'
  },
  {
    from: 'first',
    to: 'second',
    condition: 'First number correctly decomposed and validated'
  },
  {
    from: 'second',
    to: 'complete',
    condition: 'Second number correctly decomposed and validated'
  }
];

/**
 * Determines if a phase transition is valid
 */
export function canTransitionToPhase(
  currentPhase: ExercisePhase,
  nextPhase: ExercisePhase,
  firstComplete: boolean,
  secondComplete: boolean
): boolean {
  if (currentPhase === 'setup' && nextPhase === 'first') {
    return true; // Numbers are set
  }
  
  if (currentPhase === 'first' && nextPhase === 'second') {
    return firstComplete;
  }
  
  if (currentPhase === 'second' && nextPhase === 'complete') {
    return secondComplete;
  }
  
  return false;
}
```

---

## Cylinder State Management

```typescript
/**
 * Adds a piece to a cylinder's decomposition
 * Returns updated decomposition or null if blocked (overflow)
 */
export function addPieceToCylinder(
  targetNumber: number,
  currentDecomp: Decomposition,
  pieceType: PieceType
): Decomposition | null {
  const expected = calculateExpectedDecomposition(targetNumber);
  const updated = { ...currentDecomp };
  
  switch (pieceType) {
    case 'unit':
      if (currentDecomp.units >= expected.units) {
        return null; // Blocked - already at max
      }
      updated.units += 1;
      break;
    case 'ten':
      if (currentDecomp.tens >= expected.tens) {
        return null;
      }
      updated.tens += 1;
      break;
    case 'hundred':
      if (currentDecomp.hundreds >= expected.hundreds) {
        return null;
      }
      updated.hundreds += 1;
      break;
    case 'thousand':
      if (currentDecomp.thousands >= expected.thousands) {
        return null;
      }
      updated.thousands += 1;
      break;
  }
  
  return updated;
}

/**
 * Removes the last added piece from a cylinder (undo)
 * Returns updated decomposition and piece type removed
 */
export function removeLastPieceFromCylinder(
  decomposition: Decomposition,
  pieceHistory: PieceType[]
): { decomposition: Decomposition; removedType: PieceType } | null {
  if (pieceHistory.length === 0) {
    return null; // Nothing to undo
  }
  
  const lastPiece = pieceHistory[pieceHistory.length - 1];
  const updated = { ...decomposition };
  
  switch (lastPiece) {
    case 'unit':
      updated.units = Math.max(0, updated.units - 1);
      break;
    case 'ten':
      updated.tens = Math.max(0, updated.tens - 1);
      break;
    case 'hundred':
      updated.hundreds = Math.max(0, updated.hundreds - 1);
      break;
    case 'thousand':
      updated.thousands = Math.max(0, updated.thousands - 1);
      break;
  }
  
  return { decomposition: updated, removedType: lastPiece };
}
```

---

## localStorage Schema

```typescript
/**
 * Key used for localStorage persistence
 */
export const STORAGE_KEY = 'didactic-math:number-decomposition:session';

/**
 * Current schema version (increment on breaking changes)
 */
export const SCHEMA_VERSION = 1;

/**
 * Serializes exercise state to JSON for localStorage
 */
export function serializeState(
  exercise: ExerciseSession,
  cylinders: [CylinderState, CylinderState]
): string {
  const state: PersistedState = {
    version: SCHEMA_VERSION,
    savedAt: Date.now(),
    exercise,
    cylinders
  };
  
  return JSON.stringify(state);
}

/**
 * Deserializes and validates state from localStorage
 */
export function deserializeState(json: string): PersistedState | null {
  try {
    const state = JSON.parse(json) as PersistedState;
    
    // Validate version
    if (state.version !== SCHEMA_VERSION) {
      console.warn(`Schema version mismatch: ${state.version} !== ${SCHEMA_VERSION}`);
      return null; // Discard incompatible state
    }
    
    // Validate structure
    if (!state.exercise || !state.cylinders || state.cylinders.length !== 2) {
      console.error('Invalid persisted state structure');
      return null;
    }
    
    return state;
  } catch (error) {
    console.error('Failed to deserialize state:', error);
    return null;
  }
}
```

---

## Relationships

```
ExerciseSession
├── firstNumber: NumberChallenge
│   ├── expected: Decomposition
│   ├── actual: Decomposition
│   └── pieceHistory: PieceType[]
└── secondNumber: NumberChallenge
    ├── expected: Decomposition
    ├── actual: Decomposition
    └── pieceHistory: PieceType[]

CylinderState (x2)
├── decomposition: Decomposition (matches NumberChallenge.actual)
└── pieces: Piece[] (visual representation of decomposition)

PersistedState (in localStorage)
├── exercise: ExerciseSession
└── cylinders: [CylinderState, CylinderState]
```

---

## Summary

- **7 core interfaces**: ExerciseSession, NumberChallenge, Decomposition, CylinderState, Piece, ValidationResult, PersistedState
- **2 type unions**: SetupMode, ExercisePhase, PieceType
- **All entities have validation rules** ensuring mathematical correctness
- **State machine** governs phase transitions (setup → first → second → complete)
- **Pure functions** for decomposition calculations and validation (100% testable)
- **localStorage schema** with versioning for future migration compatibility

**All entities mapped to functional requirements (FR-001 through FR-043)**
