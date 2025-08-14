// ABOUTME: Enhanced Select field component with built-in error handling and type safety
// ABOUTME: Wraps shadcn/ui Select with FormField for consistent form patterns

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from './form-field';
import { ActionState } from '@/types/action-state';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  actionState?: ActionState;
  description?: string;
  defaultValue?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function SelectField({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  actionState,
  description,
  defaultValue,
  className = '',
  onValueChange,
}: SelectFieldProps) {
  return (
    <FormField
      name={name}
      label={label}
      required={required}
      actionState={actionState}
      description={description}
      className={className}
    >
      <Select name={name} defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              <div className="flex flex-col">
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}