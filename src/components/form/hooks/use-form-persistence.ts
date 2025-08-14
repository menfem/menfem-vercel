// ABOUTME: Form state persistence utilities for saving draft state in localStorage
// ABOUTME: Provides auto-save and recovery functionality for long forms

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';

export interface FormPersistenceConfig {
  key: string;
  enabled?: boolean;
  debounceMs?: number;
  excludeFields?: string[];
}

export interface FormPersistenceReturn {
  savedData: Record<string, unknown> | null;
  saveFormData: (formData: FormData | Record<string, unknown>) => void;
  clearSavedData: () => void;
  hasSavedData: boolean;
}

export function useFormPersistence({
  key,
  enabled = true,
  debounceMs = 1000,
  excludeFields = ['password', 'confirmPassword'],
}: FormPersistenceConfig): FormPersistenceReturn {
  const [savedData, setSavedData] = useState<Record<string, unknown> | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(`form-draft-${key}`);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setSavedData(parsedData);
        setHasSavedData(true);
      }
    } catch (error) {
      console.warn('Failed to load saved form data:', error);
    }
  }, [key, enabled]);

  // Save form data with debouncing
  const debouncedSave = useMemo(
    () => debounce((formData: FormData | Record<string, unknown>) => {
      if (!enabled || typeof window === 'undefined') return;

      try {
        let dataToSave: Record<string, unknown>;

        if (formData instanceof FormData) {
          dataToSave = Object.fromEntries(
            Array.from(formData.entries()).filter(
              ([key]) => !excludeFields.includes(key)
            )
          );
        } else {
          dataToSave = Object.fromEntries(
            Object.entries(formData).filter(
              ([key]) => !excludeFields.includes(key)
            )
          );
        }

        // Only save if there's meaningful data
        const hasData = Object.values(dataToSave).some(
          value => value && value.toString().trim() !== ''
        );

        if (hasData) {
          localStorage.setItem(
            `form-draft-${key}`,
            JSON.stringify(dataToSave)
          );
          setSavedData(dataToSave);
          setHasSavedData(true);
        }
      } catch (error) {
        console.warn('Failed to save form data:', error);
      }
    }, debounceMs),
    [key, enabled, excludeFields, debounceMs]
  );

  const saveFormData = debouncedSave;

  // Clear saved data
  const clearSavedData = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      localStorage.removeItem(`form-draft-${key}`);
      setSavedData(null);
      setHasSavedData(false);
    } catch (error) {
      console.warn('Failed to clear saved form data:', error);
    }
  }, [key, enabled]);

  return {
    savedData,
    saveFormData,
    clearSavedData,
    hasSavedData,
  };
}

// Debounce utility function
function debounce(
  func: (formData: FormData | Record<string, unknown>) => void,
  wait: number
): (formData: FormData | Record<string, unknown>) => void {
  let timeout: NodeJS.Timeout;
  
  return (formData: FormData | Record<string, unknown>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(formData), wait);
  };
}