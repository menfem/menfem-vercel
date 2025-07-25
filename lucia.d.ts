// Lucia type definitions
import { auth } from '@/lib/lucia';

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      email: string;
      username: string | null;
      emailVerified: boolean;
    };
  }
}