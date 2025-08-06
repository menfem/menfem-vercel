// ABOUTME: User menu component with profile, dashboard, and sign out options
// ABOUTME: Client component that shows authenticated user options with dropdown

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PATHS } from '@/paths';
import type { User } from 'lucia';
import { signOut } from '@/features/auth/actions/sign-out';
import { useActionState } from 'react';
import { isAdmin } from '@/features/admin/utils/is-admin';

type UserMenuProps = {
  user: User | null;
};

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, signOutAction, isPending] = useActionState(signOut, null);

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href={PATHS.AUTH.SIGN_IN}>
          <Button variant="ghost" size="sm" className="text-brand-brown hover:text-brand-terracotta">
            Sign In
          </Button>
        </Link>
        <Link href={PATHS.AUTH.SIGN_UP}>
          <Button size="sm" className="bg-brand-brown hover:bg-brand-rust text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-brand-brown hover:text-brand-terracotta"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.username || user.email}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-20">
            <div className="py-2">
              <Link
                href={PATHS.DASHBOARD}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              
              <Link
                href={PATHS.PROFILE}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
              
              {isAdmin(user) && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-brand-terracotta hover:bg-brand-sage/20 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </>
              )}
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <form action={signOutAction}>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => setIsOpen(false)}
                >
                  {isPending ? 'Signing out...' : 'Sign Out'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}