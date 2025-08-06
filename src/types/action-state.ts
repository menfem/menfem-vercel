// ABOUTME: Common types for server action state management
// ABOUTME: Standardized action state types for form handling and UI feedback

export type ActionState = {
  status?: 'SUCCESS' | 'ERROR' | 'idle';
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  formData?: FormData;
  timestamp?: number;
  payload?: any;
};

export const initialActionState: ActionState = { status: 'idle' };
export const emptyActionState: ActionState = {};