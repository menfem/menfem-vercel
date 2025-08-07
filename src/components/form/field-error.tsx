// ABOUTME: Component for displaying field-specific validation errors
// ABOUTME: Shows error messages for individual form fields

import { ActionState } from '@/types/action-state';

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

export function FieldError({ actionState, name }: FieldErrorProps) {
  const error = actionState.fieldErrors?.[name]?.[0];

  if (!error) return null;

  return <span className="text-sm text-red-500 mt-1">{error}</span>;
}