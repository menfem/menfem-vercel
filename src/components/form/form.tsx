// ABOUTME: Reusable form wrapper component with built-in state management
// ABOUTME: Provides consistent form handling with server actions

'use client';

import { useActionState } from 'react';
import { ActionState, emptyActionState } from './utils/to-action-state';
import { ActionFeedback } from './action-feedback';

type FormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
};

export function Form({ action, children, className }: FormProps) {
  const [actionState, formAction] = useActionState(action, emptyActionState);

  return (
    <form action={formAction} className={className}>
      {children}
      <ActionFeedback actionState={actionState} />
    </form>
  );
}