// ABOUTME: Admin permission checking utility
// ABOUTME: Simple email-based admin check (can be expanded to role-based system later)

import type { User } from 'lucia';

// For now, we use email-based admin check
// This can be expanded to a proper role-based system later
const ADMIN_EMAILS = ['admin@menfem.com'];

export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email);
}

export function requireAdmin(user: User | null): User {
  if (!isAdmin(user)) {
    throw new Error('Admin access required');
  }
  return user as User;
}