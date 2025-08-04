// ABOUTME: Common types for server action state management
// ABOUTME: Standardized action state types for form handling and UI feedback

export type ActionState = 
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };

export const initialActionState: ActionState = { status: 'idle' };