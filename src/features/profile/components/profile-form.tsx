// ABOUTME: Profile form component for updating user information
// ABOUTME: Handles profile updates with loading states and error handling

'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '../actions/update-profile';
import { UserProfile } from '../types';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { initialActionState } from '@/types/action-state';

type ProfileFormProps = {
  user: UserProfile;
};


export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialActionState);

  useEffect(() => {
    if (state.status === 'SUCCESS') {
      toast.success(state.message);
    } else if (state.status === 'ERROR') {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-brand-brown mb-2">Profile Information</h2>
        <p className="text-sm text-gray-600 mb-4">
          Update your personal information and account settings.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              defaultValue={user.username || ''}
              placeholder="Enter your username"
              disabled={isPending}
            />
            {state.status === 'ERROR' && state.fieldErrors?.username && (
              <p className="text-sm text-red-600">{state.fieldErrors.username[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="Enter your email"
              disabled={isPending}
            />
            {state.status === 'ERROR' && state.fieldErrors?.email && (
              <p className="text-sm text-red-600">{state.fieldErrors.email[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Member Since</Label>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {user.createdAt.toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Email Verification Status</Label>
          <p className={`text-sm p-2 rounded ${
            user.emailVerified 
              ? 'text-green-700 bg-green-50' 
              : 'text-amber-700 bg-amber-50'
          }`}>
            {user.emailVerified ? '✓ Email verified' : '⚠ Email not verified'}
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-brand-brown hover:bg-brand-rust text-white"
        >
          {isPending ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </div>
  );
}