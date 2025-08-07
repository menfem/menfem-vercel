// ABOUTME: Component for displaying form action feedback messages
// ABOUTME: Shows success/error states and field-specific validation errors

import { ActionState } from '@/types/action-state';

type ActionFeedbackProps = {
  actionState: ActionState;
};

export function ActionFeedback({ actionState }: ActionFeedbackProps) {
  if (!actionState.status) return null;

  return (
    <div
      className={`mt-4 p-4 rounded-md ${
        actionState.status === 'SUCCESS'
          ? 'bg-green-50 text-green-800'
          : 'bg-red-50 text-red-800'
      }`}
    >
      {actionState.message && <p className="text-sm">{actionState.message}</p>}
      {actionState.fieldErrors && (
        <ul className="mt-2 text-sm list-disc list-inside">
          {Object.entries(actionState.fieldErrors).map(([field, errors]) =>
            errors?.map((error: string, index: number) => (
              <li key={`${field}-${index}`}>
                <strong>{field}:</strong> {error}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}