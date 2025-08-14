// ABOUTME: Enhanced form wrapper with type safety, persistence, and automatic state management
// ABOUTME: Integrates all form utilities for a complete form experience

'use client';

import React from 'react';
import { z } from 'zod';
import { useTypedForm, TypedFormConfig } from './hooks/use-typed-form';
import { useFormPersistence, FormPersistenceConfig } from './hooks/use-form-persistence';
import { ActionFeedback } from './action-feedback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface EnhancedFormProps<T extends z.ZodType> extends TypedFormConfig<T> {
  children: React.ReactNode;
  className?: string;
  persistence?: Omit<FormPersistenceConfig, 'key'> & { key?: string };
  showActionFeedback?: boolean;
  autoFocus?: boolean;
}

export function EnhancedForm<T extends z.ZodType>({
  children,
  className = '',
  persistence,
  showActionFeedback = true,
  autoFocus: _autoFocus = true,
  ...formConfig
}: EnhancedFormProps<T>) {
  const form = useTypedForm(formConfig);
  
  // Set up persistence if configured
  const persistenceConfig = persistence && {
    key: persistence.key || 'form-data',
    enabled: true,
    ...persistence,
  };

  // Always call the hook but conditionally return null
  const persistenceResult = useFormPersistence(persistenceConfig || { 
    key: 'disabled', 
    enabled: false 
  });
  
  const persistenceHooks = persistenceConfig ? persistenceResult : null;

  // Handle form input changes for persistence
  const handleFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    if (!persistenceHooks) return;

    const formData = new FormData(event.currentTarget);
    persistenceHooks.saveFormData(formData);
  };

  // Handle draft restoration
  const handleRestoreDraft = () => {
    if (!persistenceHooks?.savedData) return;

    // Populate form fields with saved data
    const form = document.querySelector('form') as HTMLFormElement;
    if (!form) return;

    Object.entries(persistenceHooks.savedData).forEach(([key, value]) => {
      const field = form.querySelector(`[name="${key}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (field && value) {
        field.value = value.toString();
      }
    });
  };

  // Clear draft on successful submission
  React.useEffect(() => {
    if (form.isSuccess && persistenceHooks) {
      persistenceHooks.clearSavedData();
    }
  }, [form.isSuccess, persistenceHooks]);

  return (
    <div className="space-y-4">
      {/* Draft restoration notice */}
      {persistenceHooks?.hasSavedData && !form.isSuccess && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">We found a saved draft of this form.</span>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleRestoreDraft}
              >
                Restore Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <form 
        action={form.formAction}
        className={className}
        onInput={persistenceConfig ? handleFormChange : undefined}
        autoComplete="on"
      >
        {children}
        
        {showActionFeedback && (
          <ActionFeedback actionState={form.actionState} />
        )}
      </form>
    </div>
  );
}

// Convenience wrapper for common form patterns
interface SimpleFormProps {
  action: (state: any, formData: FormData) => Promise<any>;
  children: React.ReactNode;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SimpleForm({
  action,
  children,
  className = '',
  onSuccess,
  onError,
}: SimpleFormProps) {
  // Create a minimal schema for the simple form
  const schema = z.object({}) as z.ZodObject<Record<string, z.ZodAny>>;
  
  return (
    <EnhancedForm
      schema={schema}
      action={action}
      onSuccess={onSuccess}
      onError={onError}
      className={className}
      showActionFeedback={true}
    >
      {children}
    </EnhancedForm>
  );
}