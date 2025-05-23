# Next.js Application Architecture Guide

This document outlines the architectural patterns, conventions, and best practices for building production-ready Next.js applications. Based on a comprehensive analysis of a real-world SaaS application, this guide provides a blueprint for creating scalable, maintainable, and type-safe applications.

## Animation Approach

The project uses Tailwind CSS v4's "CSS-first" approach to animations:

- Animations are defined in globals.css using standard CSS
- Current animations available:
  - `animate-fade-in`: Fades in elements from bottom to top
  - `animate-slide-in`: Slides in elements from left to right

To use animations, simply add the animation class to your elements:

```jsx
<div className="animate-fade-in">This content will fade in</div>
```

## Writing Code

We prefer simple, clean, maintainable solutions over clever or complex ones, even if the latter are more concise or performant. Readability and maintainability are primary concerns.

- Make the smallest reasonable changes to get to the desired outcome. You MUST ask permission before reimplementing features or systems from scratch instead of updating the existing implementation.
- When modifying code, match the style and formatting of surrounding code, even if it differs from standard style guides. Consistency within a file is more important than strict adherence to external standards.
- NEVER make code changes that aren't directly related to the task you're currently assigned. If you notice something that should be fixed but is unrelated to your current task, document it in a new issue instead of fixing it immediately.
- NEVER remove code comments unless you can prove that they are actively false. Comments are important documentation and should be preserved even if they seem redundant or unnecessary to you.
- All code files should start with a brief 2 line comment explaining what the file does. Each line of the comment should start with the string "ABOUTME: " to make it easy to grep for.
- When writing comments, avoid referring to temporal context about refactors or recent changes. Comments should be evergreen and describe the code as it is, not how it evolved or was recently changed.
- NEVER implement a mock mode for testing or for any purpose. We always use real data and real APIs, never mock implementations.
- When you are trying to fix a bug or compilation error or any other issue, YOU MUST NEVER throw away the old implementation and rewrite without explicit permission from the user. If you are going to do this, YOU MUST STOP and get explicit permission from the user.
- NEVER name things as 'improved' or 'new' or 'enhanced', etc. Code naming should be evergreen. What is new today will be "old" someday.
- ALWAYS commit changes after every task is completed. Do not wait to accumulate multiple changes before committing.
- Practice running the linter constantly to catch issues early.

## Version Control

- Commit after every logical change or task completion
- Each commit should represent a single, cohesive unit of work
- Write clear, descriptive commit messages that explain what was changed and why
- Before committing, verify changes with appropriate tests and checks
- Never combine unrelated changes in a single commit
- Never leave work uncommitted at the end of a session

## Getting Help

- ALWAYS ask for clarification rather than making assumptions.
- If you're having trouble with something, it's ok to stop and ask for help. Especially if it's something your human might be better at.

## Testing

- Tests MUST cover the functionality being implemented.
- NEVER ignore the output of the system or the tests - Logs and messages often contain CRITICAL information.
- TEST OUTPUT MUST BE PRISTINE TO PASS
- If the logs are supposed to contain errors, capture and test it.
- NO EXCEPTIONS POLICY: Under no circumstances should you mark any test type as "not applicable". Every project, regardless of size or complexity, MUST have unit tests, integration tests, AND end-to-end tests. If you believe a test type doesn't apply, you need the human to say exactly "I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME"

### TDD Process

We practice TDD. That means:

1. Write tests before writing the implementation code
2. Only write enough code to make the failing test pass
3. Refactor code continuously while ensuring tests still pass

#### TDD Implementation Process

1. Write a failing test that defines a desired function or improvement
2. Run the test to confirm it fails as expected
3. Write minimal code to make the test pass
4. Run the test to confirm success
5. Refactor code to improve design while keeping tests green
6. Repeat the cycle for each new feature or bugfix

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Architectural Patterns](#architectural-patterns)
4. [Feature Module Architecture](#feature-module-architecture)
5. [Server Actions Pattern](#server-actions-pattern)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Patterns](#database-patterns)
8. [Component Architecture](#component-architecture)
9. [API Routes & Webhooks](#api-routes--webhooks)
10. [Third-Party Integrations](#third-party-integrations)
11. [Performance Patterns](#performance-patterns)
12. [Development Workflow](#development-workflow)
13. [Security Best Practices](#security-best-practices)
14. [Conventions & Guidelines](#conventions--guidelines)

## Technology Stack

### Core Framework

- **Next.js 15+** with App Router
- **React 19 RC** with Server Components
- **TypeScript** with strict mode enabled

### Database & ORM

- **PostgreSQL** as the primary database
- **Prisma ORM** for type-safe database access
- Connection pooling for production

### Authentication

- Custom session-based authentication
- Cookie-based session management
- 30-day session duration with 15-day refresh

### Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components (Radix UI based)
- **next-themes** for dark mode support
- Custom animations with Tailwind

### State Management

- **TanStack Query** (React Query) for server state
- **nuqs** for URL state management
- Minimal client-side state

### Background Jobs

- **Inngest** for event-driven background tasks
- Typed event schemas
- Async processing for emails and cleanup

### File Storage

- **AWS S3** for file uploads
- Presigned URLs for secure access
- Stream-based file handling

### Payments

- **Stripe** integration
- Webhook handling
- Subscription management

### Email

- **Resend** for transactional emails
- **React Email** for template creation
- Development preview server

### Additional Libraries

- **Zod** for schema validation
- **Big.js** for precise decimal calculations
- **clsx** + **tailwind-merge** for className management
- **Sonner** for toast notifications

## Project Structure

```
project-root/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts             # Database seeding
├── public/                 # Static assets
├── src/
│   ├── actions/           # Global server actions
│   ├── app/              # Next.js app router
│   │   ├── (route-groups)/
│   │   ├── api/          # API routes
│   │   └── global files  # layout, error, loading
│   ├── components/       # Shared components
│   │   └── ui/          # Base UI components
│   ├── emails/          # Email templates
│   ├── features/        # Feature modules
│   ├── lib/            # Third-party client instances
│   ├── utils/          # Utility functions
│   └── paths.ts        # Centralized routing
├── environment.d.ts     # Environment types
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Architectural Patterns

### 1. Server-First Architecture

- Server Components by default
- Client Components only when necessary (forms, interactivity)
- Server Actions for all mutations
- Progressive enhancement approach

### 2. Feature-Based Modules

- Self-contained feature directories
- Clear separation of concerns
- Consistent internal structure
- Minimal cross-feature dependencies

### 3. Type Safety Throughout

- End-to-end TypeScript
- Runtime validation with Zod
- Generated types from Prisma
- Typed environment variables

### 4. URL as State

- Search parameters for filters/pagination
- Shareable application states
- Server-side parameter parsing
- Type-safe parameter handling

## Feature Module Architecture

Each feature follows a consistent structure:

```
src/features/[feature-name]/
├── actions/            # Server actions for mutations
│   ├── create-[entity].ts
│   ├── update-[entity].ts
│   └── delete-[entity].ts
├── components/         # Feature-specific components
│   ├── [entity]-list.tsx
│   ├── [entity]-form.tsx
│   └── [entity]-item.tsx
├── data/              # Database operations
│   ├── create-[entity].ts
│   ├── update-[entity].ts
│   └── index.ts      # Barrel export
├── queries/           # Data fetching functions
│   ├── get-[entity].ts
│   └── get-[entities].ts
├── emails/            # Email templates (if needed)
├── events/            # Background job definitions
├── schema/            # Zod validation schemas
├── utils/             # Feature-specific utilities
├── types.ts           # TypeScript type definitions
└── constants.ts       # Feature constants
```

## Server Actions Pattern

### Basic Structure

```typescript
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import {
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { revalidatePath } from 'next/cache';

// 1. Define validation schema
const createEntitySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  amount: z.coerce.number().positive(),
});

// 2. Define action with consistent signature
export const createEntity = async (
  _actionState: ActionState,
  formData: FormData
) => {
  // 3. Authentication check
  const { user } = await getAuthOrRedirect();

  try {
    // 4. Parse and validate input
    const data = createEntitySchema.parse(Object.fromEntries(formData));

    // 5. Perform database operation
    const entity = await prisma.entity.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    // 6. Revalidate affected paths
    revalidatePath('/entities');
    revalidatePath(`/entities/${entity.id}`);

    // 7. Return success state
    return toActionState('SUCCESS', 'Entity created successfully');
  } catch (error) {
    // 8. Handle errors consistently
    return fromErrorToActionState(error, formData);
  }
};
```

### Action State Type

```typescript
type ActionState = {
  status?: 'SUCCESS' | 'ERROR';
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  formData?: FormData;
  timestamp?: number;
};
```

## Authentication & Authorization

### Session Management

```typescript
// Session creation
const sessionToken = generateRandomToken();
const session = await prisma.session.create({
  data: {
    token: sessionToken,
    userId: user.id,
    expiresAt: getSessionExpiryDate(),
  },
});

// Session validation
const session = await prisma.session.findUnique({
  where: { token: sessionToken },
  include: { user: true },
});

if (!session || session.expiresAt < new Date()) {
  // Invalid or expired session
}
```

### Auth Queries

```typescript
// Basic auth check (cached)
export const getAuth = cache(async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return { user: null, session: null };

  // Validate and return session
});

// Auth with redirect
export const getAuthOrRedirect = async (options?: {
  requiredEmailVerification?: boolean;
  requiredActiveOrganization?: boolean;
}) => {
  const auth = await getAuth();

  if (!auth.user) {
    redirect(PATHS.SIGN_IN);
  }

  // Additional checks based on options

  return auth;
};
```

### Permission Patterns

```typescript
// Role-based permissions
const { membership } = await getActiveMembership();
if (membership.role !== 'ADMIN') {
  throw new Error('Unauthorized');
}

// Resource-based permissions
const canEdit =
  isOwner(user.id, resource.userId) || membership.role === 'ADMIN';
```

## Database Patterns

### Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
```

### Query Patterns

```typescript
// Feature query with relations
export const getEntityWithRelations = async (id: string) => {
  return prisma.entity.findUnique({
    where: { id },
    include: {
      user: true,
      organization: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      },
    },
  });
};

// Paginated queries
export const getEntities = async ({
  page = 1,
  limit = 10,
  search,
  orderBy = 'createdAt',
}: GetEntitiesOptions) => {
  const where = search
    ? { name: { contains: search, mode: 'insensitive' } }
    : {};

  const [entities, totalCount] = await Promise.all([
    prisma.entity.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderBy]: 'desc' },
      include: { user: true },
    }),
    prisma.entity.count({ where }),
  ]);

  return {
    entities,
    totalPages: Math.ceil(totalCount / limit),
  };
};
```

## Component Architecture

### Form Components

```typescript
// Reusable form wrapper
export const Form = ({
  action,
  children,
  ...props
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
}) => {
  const [actionState, formAction] = useActionState(action, {});

  return (
    <form action={formAction} {...props}>
      {children}
      <ActionFeedback actionState={actionState} />
    </form>
  );
};

// Submit button with loading state
export const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Spinner className="mr-2" />}
      {children}
    </Button>
  );
};
```

### Server Component Patterns

```typescript
// List component (Server Component)
export const EntityList = async ({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) => {
  const { entities, totalPages } = await getEntities({
    page: Number(searchParams.page) || 1,
    search: searchParams.search,
  });

  if (!entities.length) {
    return <EmptyState message="No entities found" />;
  }

  return (
    <>
      <div className="grid gap-4">
        {entities.map((entity) => (
          <EntityItem key={entity.id} entity={entity} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
};
```

### Client Component Patterns

```typescript
'use client';

// Interactive form (Client Component)
export const EntityForm = ({ entity }: { entity?: Entity }) => {
  const [optimisticState, setOptimisticState] = useState(entity);

  return (
    <Form action={entity ? updateEntity : createEntity}>
      <Input
        name="name"
        defaultValue={entity?.name}
        onChange={(e) =>
          setOptimisticState({ ...optimisticState, name: e.target.value })
        }
      />
      <SubmitButton>{entity ? 'Update' : 'Create'} Entity</SubmitButton>
    </Form>
  );
};
```

## API Routes & Webhooks

### Webhook Handler Pattern

```typescript
// app/api/stripe/route.ts
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      // Handle other events
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response('Webhook error', { status: 400 });
  }
}
```

### File Upload Pattern

```typescript
// Pre-signed URL generation
export async function GET(
  request: Request,
  { params }: { params: { attachmentId: string } }
) {
  const { user } = await getAuthOrRedirect();

  // Verify permissions
  const attachment = await getAttachment(params.attachmentId);
  if (!attachment || !canAccessAttachment(user, attachment)) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Generate pre-signed URL
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: attachment.key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return Response.redirect(url);
}
```

## Third-Party Integrations

### Stripe Integration

```typescript
// Checkout session creation
export const createCheckoutSession = async (
  priceId: string,
  organizationId: string
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/organization/${organizationId}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    metadata: { organizationId },
  });

  return session.url;
};

// Webhook processing with Inngest
export const handleSubscriptionCreated = inngest.createFunction(
  { id: 'handle-subscription-created' },
  { event: 'subscription.created' },
  async ({ event }) => {
    const { organizationId, subscriptionId, customerId } = event.data;

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        subscriptionStatus: 'active',
      },
    });
  }
);
```

### Email Integration

```typescript
// Email template (React Email)
export const WelcomeEmail = ({ userName }: { userName: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {userName}!</Heading>
          <Text style={text}>
            Thanks for signing up. Get started by exploring your dashboard.
          </Text>
          <Button href={`${process.env.BASE_URL}/dashboard`} style={button}>
            Go to Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
};

// Send email via Inngest
export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email' },
  { event: 'user.created' },
  async ({ event }) => {
    await resend.emails.send({
      from: 'noreply@example.com',
      to: event.data.email,
      subject: 'Welcome!',
      react: <WelcomeEmail userName={event.data.name} />,
    });
  }
);
```

## Performance Patterns

### Caching Strategies

```typescript
// React cache for deduplication
export const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
});

// On-demand revalidation
export const updateEntity = async (id: string, data: UpdateData) => {
  const entity = await prisma.entity.update({
    where: { id },
    data,
  });

  // Revalidate specific paths
  revalidatePath(`/entities/${id}`);
  revalidatePath('/entities');

  return entity;
};
```

### Parallel Data Loading

```typescript
// Load related data in parallel
export default async function EntityPage({
  params,
}: {
  params: { id: string };
}) {
  const [entity, comments, attachments] = await Promise.all([
    getEntity(params.id),
    getComments(params.id),
    getAttachments(params.id),
  ]);

  return (
    <div>
      <EntityDetails entity={entity} />
      <Comments comments={comments} />
      <Attachments attachments={attachments} />
    </div>
  );
}
```

### Optimistic Updates

```typescript
'use client';

export const EntityActions = ({ entity }: { entity: Entity }) => {
  const [optimisticStatus, setOptimisticStatus] = useState(entity.status);

  const handleStatusChange = async (newStatus: Status) => {
    // Optimistic update
    setOptimisticStatus(newStatus);

    // Server update
    const result = await updateEntityStatus(entity.id, newStatus);

    if (result.status === 'ERROR') {
      // Revert on error
      setOptimisticStatus(entity.status);
    }
  };

  return (
    <StatusSelector value={optimisticStatus} onChange={handleStatusChange} />
  );
};
```

## Development Workflow

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type": "tsc --noEmit",
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "email": "email dev --dir src/emails",
    "inngest": "inngest dev"
  }
}
```

### Environment Setup

```typescript
// environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;

    // Auth
    SESSION_COOKIE_NAME: string;

    // AWS
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET_NAME: string;
    AWS_REGION: string;

    // Stripe
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    STRIPE_PUBLISHABLE_KEY: string;

    // Email
    RESEND_API_KEY: string;

    // App
    BASE_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}
```

### Database Seeding

```typescript
// prisma/seed.ts
import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/features/auth/utils/hash';

async function main() {
  // Clean existing data
  await prisma.user.deleteMany();

  // Create test users
  const hashedPassword = await hashPassword('password123');

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      emailVerified: true,
    },
  });

  // Create related data
  const organization = await prisma.organization.create({
    data: {
      name: 'Test Organization',
      memberships: {
        create: {
          userId: user.id,
          role: 'ADMIN',
        },
      },
    },
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Security Best Practices

### Input Validation

- Always validate with Zod schemas
- Sanitize user input
- Use parameterized queries (via Prisma)
- Validate file uploads (type, size)

### Authentication Security

- Secure session cookies
- Argon2 password hashing
- Email verification required
- Password reset tokens expire

### Authorization Checks

- Check auth on every request
- Verify organization membership
- Role-based access control
- Resource ownership validation

### API Security

- Webhook signature verification
- Rate limiting (implement as needed)
- CORS configuration
- Environment variable protection

## Conventions & Guidelines

### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Server Actions**: verb-noun (e.g., `createUser`, `deletePost`)
- **API Routes**: RESTful naming

### Code Organization

1. Group related functionality in features
2. Keep components small and focused
3. Extract reusable logic to hooks/utils
4. Use barrel exports for cleaner imports
5. Separate concerns (UI, logic, data)

### TypeScript Guidelines

- Enable strict mode
- Define explicit return types for public APIs
- Use type inference for internal functions
- Create dedicated type files
- Avoid `any` type

### Component Guidelines

- Server Components by default
- Client Components for interactivity
- Compose with smaller components
- Use Suspense boundaries
- Handle loading and error states

### Performance Guidelines

- Minimize client-side JavaScript
- Use dynamic imports for code splitting
- Implement proper caching strategies
- Optimize database queries
- Lazy load heavy components

### Testing Approach

- Unit tests for utilities
- Integration tests for features
- E2E tests for critical paths
- Test server actions separately
- Mock external services

### Git Workflow

- Feature branches
- Conventional commits
- PR reviews required
- Automated checks (lint, type, test)
- Deploy previews for PRs

## Summary

This architecture provides a solid foundation for building scalable Next.js applications. Key principles:

1. **Type Safety**: End-to-end TypeScript with runtime validation
2. **Server-First**: Leverage React Server Components and Server Actions
3. **Feature Isolation**: Self-contained modules with clear boundaries
4. **Security**: Authentication, authorization, and input validation
5. **Performance**: Caching, parallel loading, and optimistic updates
6. **Developer Experience**: Consistent patterns and conventions

When building new features:

1. Start with the data model (Prisma schema)
2. Create the feature module structure
3. Implement server actions for mutations
4. Build queries for data fetching
5. Create UI components (server-first)
6. Add client interactivity as needed
7. Implement proper error handling
8. Add loading and empty states
9. Test the complete flow
10. Document complex logic

This architecture scales from simple CRUD applications to complex SaaS platforms while maintaining code quality and developer productivity.
