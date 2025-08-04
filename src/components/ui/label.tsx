// ABOUTME: Label component with consistent styling for form fields
// ABOUTME: Accessible label with proper typography and spacing

import { forwardRef } from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`
          text-sm font-medium text-gray-900 leading-none 
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
          ${className}
        `}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export { Label };