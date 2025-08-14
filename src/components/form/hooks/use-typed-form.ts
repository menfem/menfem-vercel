// ABOUTME: Type-safe form hook with Zod schema validation and automatic state management
// ABOUTME: Provides consistent form handling with built-in success/error callbacks

'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { ActionState, emptyActionState } from '@/types/action-state';

export interface TypedFormConfig<T extends z.ZodType> {
  schema: T;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  onSuccess?: (data: z.infer<T>, actionState: ActionState) => void;
  onError?: (error: string, actionState: ActionState) => void;
  showToasts?: boolean;
  redirectOnSuccess?: string;
}

export interface TypedFormReturn {
  actionState: ActionState;
  formAction: (formData: FormData) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useTypedForm<T extends z.ZodType>({
  schema,
  action,
  onSuccess,
  onError,
  showToasts = true,
  redirectOnSuccess,
}: TypedFormConfig<T>): TypedFormReturn {
  const router = useRouter();
  const [actionState, formAction] = useActionState(action, emptyActionState);

  const isSubmitting = actionState.status === 'PENDING';
  const isSuccess = actionState.status === 'SUCCESS';
  const isError = actionState.status === 'ERROR';

  // Handle action state changes with optional callbacks and toasts
  useEffect(() => {
    if (!actionState.timestamp) return; // Skip initial state

    if (isSuccess) {
      if (showToasts && actionState.message) {
        toast.success(actionState.message);
      }

      if (onSuccess && actionState.formData) {
        try {
          // Parse the form data using the schema for type safety
          const formDataObj = Object.fromEntries(actionState.formData);
          const parsedData = schema.parse(formDataObj);
          onSuccess(parsedData, actionState);
        } catch (parseError) {
          console.warn('Failed to parse success data:', parseError);
          onSuccess(actionState.payload as z.infer<T>, actionState);
        }
      }

      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }
    }

    if (isError) {
      if (showToasts && actionState.message) {
        toast.error(actionState.message);
      }

      if (onError) {
        onError(actionState.message || 'An error occurred', actionState);
      }
    }
  }, [
    actionState,
    isSuccess,
    isError,
    showToasts,
    onSuccess,
    onError,
    redirectOnSuccess,
    router,
    schema,
  ]);

  return {
    actionState,
    formAction,
    isSubmitting,
    isSuccess,
    isError,
  };
}