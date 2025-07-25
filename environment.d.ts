declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    DIRECT_URL: string;

    // Auth - Lucia handles session management automatically

    // Email
    RESEND_API_KEY: string;

    // App
    BASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Future: Stripe
    STRIPE_SECRET_KEY?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
  }
}