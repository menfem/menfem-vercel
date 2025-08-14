// ABOUTME: Enhanced form field component with built-in error handling and validation display
// ABOUTME: Provides consistent field rendering with automatic error state management

import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { ActionState } from '@/types/action-state';

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  actionState?: ActionState;
  description?: string;
  children: React.ReactElement<Record<string, unknown>>;
  className?: string;
}

export function FormField({
  name,
  label,
  required = false,
  actionState,
  description,
  children,
  className = '',
}: FormFieldProps) {
  const error = actionState?.fieldErrors?.[name]?.[0];
  const fieldValue = actionState?.formData?.get(name)?.toString();

  // Clone the child element and add the necessary props
  const existingProps = children.props as Record<string, unknown>;
  const enhancedChild = React.cloneElement(children, {
    id: name,
    name,
    'aria-describedby': error ? `${name}-error` : description ? `${name}-description` : undefined,
    'aria-invalid': error ? 'true' : 'false',
    defaultValue: fieldValue || existingProps?.defaultValue,
    required,
    ...existingProps, // Preserve any existing props
  });

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {enhancedChild}
      
      {error && (
        <div id={`${name}-error`} className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {description && !error && (
        <p id={`${name}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}