// ABOUTME: Utilities for converting form action results to consistent state
// ABOUTME: Provides standardized error and success handling for server actions

import { z } from 'zod';
import type { ActionState } from '@/types/action-state';

export const emptyActionState: ActionState = {};

export function toActionState(
  status: 'SUCCESS' | 'ERROR',
  message: string,
  payload?: unknown
): ActionState {
  const result: ActionState = {
    status,
    message,
    timestamp: Date.now(),
  };
  
  if (payload) {
    result.payload = payload;
  }
  
  return result;
}

export function fromErrorToActionState(
  error: unknown,
  formData?: FormData
): ActionState {
  if (error instanceof z.ZodError) {
    return {
      status: 'ERROR',
      message: 'Validation failed',
      fieldErrors: error.flatten().fieldErrors,
      formData,
      timestamp: Date.now(),
    };
  }

  if (error instanceof Error) {
    return {
      status: 'ERROR',
      message: error.message,
      formData,
      timestamp: Date.now(),
    };
  }

  return {
    status: 'ERROR',
    message: 'An unexpected error occurred',
    formData,
    timestamp: Date.now(),
  };
}