// ABOUTME: Password change form component with validation and confirmation
// ABOUTME: Handles password updates with current password verification

'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '../actions/change-password';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { initialActionState } from '@/types/action-state';


export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'SUCCESS') {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state.status === 'ERROR') {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-brand-brown mb-2">Change Password</h2>
        <p className="text-sm text-gray-600 mb-4">
          Update your password to keep your account secure.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Enter your current password"
            disabled={isPending}
            required
          />
          {state.status === 'ERROR' && state.fieldErrors?.currentPassword && (
            <p className="text-sm text-red-600">{state.fieldErrors.currentPassword[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter your new password"
            disabled={isPending}
            required
            minLength={6}
          />
          {state.status === 'ERROR' && state.fieldErrors?.newPassword && (
            <p className="text-sm text-red-600">{state.fieldErrors.newPassword[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            disabled={isPending}
            required
            minLength={6}
          />
          {state.status === 'ERROR' && state.fieldErrors?.confirmPassword && (
            <p className="text-sm text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-brand-brown hover:bg-brand-rust text-white"
        >
          {isPending ? 'Changing Password...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
}