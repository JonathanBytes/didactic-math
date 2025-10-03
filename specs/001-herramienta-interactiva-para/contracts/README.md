# Component Contracts

This directory contains TypeScript contract definitions for all React components in the Number Decomposition feature.

## Files

- `SetupScreen.contract.ts` - Setup/configuration screen
- `NumberDisplay.contract.ts` - Current number display
- `CategoryButtons.contract.ts` - Place value selection buttons
- `Cylinder.contract.ts` - Visual container for pieces
- `Piece.contract.ts` - Individual place value piece
- `ActionButtons.contract.ts` - Undo and Count/Finish buttons
- `SumVisualization.contract.ts` - Final sum display
- `hooks.contract.ts` - Custom React hooks

Each contract defines:
1. Props interface with TypeScript types
2. Events/callbacks the component emits
3. Accessibility requirements (ARIA labels, keyboard)
4. Test scenarios (render, interactions, edge cases)
