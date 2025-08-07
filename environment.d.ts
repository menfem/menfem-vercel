declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    DIRECT_URL: string;

    // Auth - Lucia handles session management automatically

    // Email
    RESEND_API_KEY: string;
    FROM_EMAIL: string;
    REPLY_TO_EMAIL: string;

    // App
    BASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Phase 4: Stripe Payment Processing
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    
    // Phase 4: YouTube API Integration
    YOUTUBE_API_KEY?: string;
    
    // Phase 4: Analytics (optional)
    VERCEL_ANALYTICS_ID?: string;
  }
}