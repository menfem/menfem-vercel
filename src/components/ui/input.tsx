// ABOUTME: Input component with consistent styling for forms
// ABOUTME: Reusable input field with proper focus states and validation styling

import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
          file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-gray-500 
          focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };