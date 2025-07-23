# Next.js Application Architecture Guide

This document outlines the architectural patterns, conventions, and best practices for building production-ready Next.js applications. Based on a comprehensive analysis of a real-world SaaS application, this guide provides a blueprint for creating scalable, maintainable, and type-safe applications.

## Animation Approach

The project uses Tailwind CSS v4's "CSS-first" approach to animations:

- Animations are defined in globals.css using standard CSS
- Current animations available:
  - `animate-fade-in`: Fades in elements from bottom to top
  - `animate-slide-in`: Slides in elements from left to right
  - `animate-header-from-top`: Header slide-in animation for improved UX
  - `animate-sidebar-from-left`: Sidebar slide-in animation

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
15. [Server vs Client Components](#server-vs-client-components)
16. [Data Fetching Patterns](#data-fetching-patterns)
17. [URL State Management](#url-state-management)
18. [Caching Strategies](#caching-strategies)
19. [Error Handling](#error-handling)
20. [Navigation Patterns](#navigation-patterns)

## Technology Stack

### Core Framework

- **Next.js 15+** with App Router
- **React 19 RC** with Server Components
- **TypeScript** with strict mode enabled

### Database & ORM

- **PostgreSQL** as the primary database
- **Prisma ORM** for type-safe database access
- Connection pooling for production
- **Supabase** as an alternative database provider

### Authentication

- Custom session-based authentication
- Cookie-based session management
- 30-day session duration with 15-day refresh
- **Lucia** for authentication (alternative approach)

### Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components (Radix UI based)
- **next-themes** for dark mode support
- Custom animations with Tailwind
- **clsx** + **tailwind-merge** for className management

### State Management

- **TanStack Query** (React Query) for server state
- **nuqs** for URL state management
- Minimal client-side state
- **use-debounce** for search optimization

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
- **Sonner** for toast notifications
- **date-fns** for date formatting
- **fastest-levenshtein** for path matching
- **react-intersection-observer** for infinite scroll
- **lucide-react** for icons
- **react-error-boundary** for fine-grained error handling

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
│   │   ├── _navigation/  # Private folders for nav components
│   │   ├── api/          # API routes
│   │   └── global files  # layout, error, loading, not-found
│   ├── components/       # Shared components
│   │   ├── ui/          # Base UI components (shadcn)
│   │   └── form/        # Form utilities and components
│   ├── emails/          # Email templates
│   ├── features/        # Feature modules
│   ├── lib/            # Third-party client instances
│   ├── utils/          # Utility functions
│   ├── paths.ts        # Centralized routing
│   └── hooks/          # Custom React hooks
├── .env                # Environment variables (gitignored)
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
- Type-safe parameter handling with nuqs

### 5. Composition Over Configuration

- Use component composition for flexibility
- Pass JSX as children for maximum control
- Mediator components for decoupling

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
├── hooks/             # Feature-specific hooks
├── types.ts           # TypeScript type definitions
├── constants.ts       # Feature constants
└── search-params.ts   # URL state definitions
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
  payload?: any; // For returning data like created entities
};
```

### Cookie-Based Feedback for Redirects

```typescript
// Set cookie before redirect
import { setCookieByKey } from '@/actions/cookies';

export const updateEntity = async (id: string, data: UpdateData) => {
  const entity = await prisma.entity.update({
    where: { id },
    data,
  });

  // Set feedback cookie before redirect
  await setCookieByKey('toast', 'Entity updated successfully');
  
  redirect(`/entities/${id}`);
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

// Session validation with refresh
const session = await prisma.session.findUnique({
  where: { token: sessionToken },
  include: { user: true },
});

if (!session || session.expiresAt < new Date()) {
  // Invalid or expired session
}

// Refresh session if fresh
if (session && session.fresh) {
  const newCookie = lucia.createSessionCookie(session.id);
  cookies().set(newCookie.name, newCookie.value, newCookie.attributes);
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

// Resource-based permissions with isOwner utility
import { isOwner } from '@/features/auth/utils/is-owner';

const canEdit = isOwner(user, resource) || membership.role === 'ADMIN';
```

### Protected Routes

```typescript
// Layout-based protection for route groups
// app/(authenticated)/layout.tsx
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthOrRedirect();
  
  return <>{children}</>;
}
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
      user: {
        select: { username: true } // Exclude sensitive fields
      },
      organization: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      },
    },
  });
};

// Paginated queries with metadata
export const getEntities = async ({
  page = 1,
  limit = 10,
  search,
  orderBy = 'createdAt',
}: GetEntitiesOptions) => {
  const where = search
    ? { name: { contains: search, mode: 'insensitive' } }
    : {};

  // Use transaction for consistency
  const [entities, totalCount] = await prisma.$transaction([
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
    list: entities,
    metadata: {
      count: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: totalCount > (page * limit),
    },
  };
};
```

### Database Migrations

```typescript
// For schema changes with existing data
// 1. Add field as optional with default
// 2. Run migration: npx prisma db push
// 3. Update existing data
// 4. Remove default and make required if needed
// 5. Run migration again

// Seed script (prisma/seed.ts)
async function main() {
  // Clean existing data
  await prisma.entity.deleteMany();
  
  // Create seed data
  await prisma.entity.createMany({
    data: seedData,
  });
}
```

### Referential Actions

```prisma
model Ticket {
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId]) // For query performance
}
```

## Component Architecture

### Form Components

```typescript
// Reusable form wrapper with built-in feedback
export const Form = ({
  action,
  children,
  ...props
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
}) => {
  const [actionState, formAction] = useActionState(action, emptyActionState);

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

// Field error display
export const FieldError = ({ 
  actionState, 
  name 
}: { 
  actionState: ActionState; 
  name: string;
}) => {
  const error = actionState.fieldErrors?.[name]?.[0];
  
  if (!error) return null;
  
  return <span className="text-sm text-red-500">{error}</span>;
};
```

### Server Component Patterns

```typescript
// List component with search/sort/pagination
export const EntityList = async ({
  searchParams,
}: {
  searchParams: ParsedSearchParams;
}) => {
  const { list: entities, metadata } = await getEntities({
    page: searchParams.page,
    search: searchParams.search,
    sortKey: searchParams.sortKey,
    sortValue: searchParams.sortValue,
    size: searchParams.size,
  });

  if (!entities.length) {
    return <EmptyState message="No entities found" />;
  }

  return (
    <>
      <div className="flex gap-4 mb-4">
        <EntitySearchInput />
        <EntitySortSelect />
      </div>
      
      <div className="grid gap-4">
        {entities.map((entity) => (
          <EntityItem key={entity.id} entity={entity} />
        ))}
      </div>
      
      <EntityPagination metadata={metadata} />
    </>
  );
};
```

### Client Component Patterns

```typescript
'use client';

// Interactive form with optimistic updates
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

// Confirmation dialog with useConfirmDialog hook
export const useConfirmDialog = ({ 
  title, 
  description,
  action 
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const trigger = (
    <Button onClick={() => setIsOpen(true)}>
      Delete
    </Button>
  );
  
  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Form action={action} onSuccess={() => setIsOpen(false)}>
            <SubmitButton>Confirm</SubmitButton>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  
  return { trigger, dialog };
};
```

## Server vs Client Components

### Decision Matrix

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| Database queries | ✅ Direct access | ❌ Requires API/Server Action |
| Async/await in component | ✅ Supported | ⚠️ Limited support |
| React hooks | ❌ Not supported | ✅ Full support |
| Event handlers | ❌ Not supported | ✅ Full support |
| Browser APIs | ❌ Not available | ✅ Available |
| Bundle size impact | ✅ No JS sent | ❌ JS included |
| SEO | ✅ Excellent | ⚠️ Requires SSR |

### Client-Server Boundary

```typescript
// Parent Server Component
export default async function Page() {
  const data = await fetchData();
  
  return (
    <ClientWrapper>
      {/* These remain server components despite parent being client */}
      <ServerChild1 data={data} />
      <ServerChild2 />
    </ClientWrapper>
  );
}

// Client wrapper using composition
'use client';
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState();
  
  return (
    <div onClick={() => setState('new')}>
      {children}
    </div>
  );
}
```

## Data Fetching Patterns

### Sequential vs Parallel Fetching

```typescript
// ❌ Sequential (waterfall) - slower
export default async function Page({ params }: { params: { id: string } }) {
  const ticket = await getTicket(params.id); // 2s
  const comments = await getComments(params.id); // 2s
  // Total: 4s
}

// ✅ Parallel - faster
export default async function Page({ params }: { params: { id: string } }) {
  const [ticket, comments] = await Promise.all([
    getTicket(params.id),
    getComments(params.id),
  ]);
  // Total: 2s
}

// ✅ Streaming with Suspense - best UX
export default async function Page({ params }: { params: { id: string } }) {
  const ticket = await getTicket(params.id);
  
  return (
    <>
      <TicketDetails ticket={ticket} />
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments ticketId={params.id} />
      </Suspense>
    </>
  );
}
```

### Client-Side Data Fetching with React Query

```typescript
'use client';

// Infinite scroll with React Query
export function CommentsList({ 
  ticketId,
  initialData 
}: { 
  ticketId: string;
  initialData: PaginatedData<Comment>;
}) {
  const queryClient = useQueryClient();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', ticketId],
    queryFn: ({ pageParam = 0 }) => 
      getComments({ ticketId, offset: pageParam }),
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
    getNextPageParam: (lastPage) => 
      lastPage.metadata.hasNextPage 
        ? lastPage.list.length 
        : undefined,
  });

  // Infinite scroll trigger
  const { ref, inView } = useInView();
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Invalidate on mutations
  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
    queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
  };

  return (
    <>
      {/* Render comments */}
      <div ref={ref} />
      {isFetchingNextPage && <Spinner />}
    </>
  );
}
```

## URL State Management

### Type-Safe URL State with nuqs

```typescript
// Define search params schema
import { createSearchParamsCache, parseAsString, parseAsInteger } from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(10),
  sortKey: parseAsString.withDefault('createdAt'),
  sortValue: parseAsString.withDefault('desc'),
});

// Use in server components
export default async function Page({ 
  searchParams 
}: { 
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const parsedParams = searchParamsCache.parse(searchParams);
  const data = await getData(parsedParams);
}

// Use in client components
'use client';
import { useQueryState, useQueryStates } from 'nuqs';

export function SearchInput() {
  const [search, setSearch] = useQueryState('search', {
    ...searchParser,
    shallow: false, // Important for server component re-render
    clearOnDefault: true,
  });

  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Multiple params with useQueryStates
export function SortSelect() {
  const [{ sortKey, sortValue }, setSort] = useQueryStates({
    sortKey: sortKeyParser,
    sortValue: sortValueParser,
  });

  const handleSort = (value: string) => {
    const [key, val] = value.split('_');
    setSort({ sortKey: key, sortValue: val });
  };
}
```

### Mediator Components Pattern

```typescript
// Generic UI component
export function SearchInput({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
}

// Feature-specific mediator
'use client';
export function TicketSearchInput() {
  const [search, setSearch] = useQueryState('search', searchParser);
  
  return <SearchInput value={search} onChange={setSearch} />;
}
```

## Caching Strategies

### Development vs Production

```bash
# Development - no aggressive caching
npm run dev

# Production - test caching behavior
npm run build && npm run start
```

### Caching Layers

1. **Router Cache (Client-Side)**
   ```tsx
   // Fine-grained prefetch control
   <Link href="/tickets" prefetch>
     Tickets
   </Link>
   ```

2. **Full Route Cache (Server-Side)**
   - Static rendering (O symbol in build output)
   - Dynamic rendering (F symbol in build output)
   - Controlled via dynamic functions or segments

3. **Request Memoization**
   ```typescript
   import { cache } from 'react';
   
   export const getTicket = cache(async (id: string) => {
     return prisma.ticket.findUnique({ where: { id } });
   });
   ```

4. **On-Demand Revalidation**
   ```typescript
   // In server actions
   import { revalidatePath } from 'next/cache';
   
   export async function updateTicket(id: string, data: UpdateData) {
     const ticket = await prisma.ticket.update({
       where: { id },
       data,
     });
     
     // Revalidate specific paths
     revalidatePath('/tickets');
     revalidatePath(`/tickets/${id}`);
     
     return ticket;
   }
   ```

5. **Time-Based Revalidation**
   ```typescript
   // In page.tsx
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

## Error Handling

### Page-Level Error Boundaries

```typescript
// app/tickets/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Something went wrong!</h2>
      <p>{error.message || 'An unexpected error occurred'}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Not Found Handling

```typescript
// app/tickets/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Ticket not found</h2>
      <Link href="/tickets">
        <Button>Back to tickets</Button>
      </Link>
    </div>
  );
}

// In components
import { notFound } from 'next/navigation';

export async function TicketPage({ params }: { params: { id: string } }) {
  const ticket = await getTicket(params.id);
  
  if (!ticket) {
    notFound(); // Triggers nearest not-found.tsx
  }
  
  return <TicketDetails ticket={ticket} />;
}
```

### Fine-Grained Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

export function TicketList() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<TicketsSkeleton />}>
        <TicketsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Navigation Patterns

### Active Path Detection

```typescript
// utils/get-active-path.ts
import { closest } from 'fastest-levenshtein';

export function getActivePath(
  currentPath: string,
  availablePaths: string[],
  ignorePaths: string[] = []
): number {
  const allPaths = [...availablePaths, ...ignorePaths];
  const closestPath = closest(currentPath, allPaths);
  
  if (ignorePaths.includes(closestPath)) {
    return -1; // No active path
  }
  
  return availablePaths.indexOf(closestPath);
}

// In Sidebar component
const activeIndex = getActivePath(
  pathname,
  navItems.map(item => item.href),
  ['/sign-in', '/sign-up']
);
```

### Breadcrumbs

```typescript
export function Breadcrumbs({ 
  items 
}: { 
  items: Array<{ title: string; href?: string }>;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.href ? (
              <BreadcrumbLink href={item.href}>
                {item.title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

## API Routes & Webhooks

### API Route Handler Pattern

```typescript
// app/api/tickets/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedParams = searchParamsCache.parse(
    Object.fromEntries(searchParams)
  );
  
  const tickets = await getTickets(parsedParams);
  
  return NextResponse.json(tickets);
}

// Dynamic routes
// app/api/tickets/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ticket = await getTicket(params.id);
  
  if (!ticket) {
    return NextResponse.json(
      { error: 'Ticket not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(ticket);
}
```

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
      toast.error(result.message);
    } else {
      toast.success('Status updated');
    }
  };

  return (
    <StatusSelector value={optimisticStatus} onChange={handleStatusChange} />
  );
};
```

### Debounced Search

```typescript
'use client';
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput() {
  const [search, setSearch] = useQueryState('search', searchParser);
  
  const debouncedSetSearch = useDebouncedCallback(
    (value: string) => setSearch(value),
    250 // 250ms delay
  );

  return (
    <Input
      defaultValue={search}
      onChange={(e) => debouncedSetSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
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
    "db:studio": "prisma studio",
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
    DIRECT_URL: string; // For migrations

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
    VERCEL_URL?: string; // Available in Vercel deployments
  }
}
```

### Database Seeding

```typescript
// prisma/seed.ts
import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/features/auth/utils/hash';

async function main() {
  // Clean existing data (order matters for foreign keys)
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
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
  await prisma.ticket.createMany({
    data: seedTickets.map(ticket => ({
      ...ticket,
      userId: user.id,
    })),
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Common Development Issues

1. **TypeScript Server Not Updating**
   - Solution: Restart TypeScript server via VS Code command palette
   
2. **Wrong Auto-Imports**
   - Common: Link from lucide-react instead of next/link
   - Solution: Always check import sources
   
3. **Dependency Conflicts**
   - When using React RC with packages expecting stable React
   - Solution: npm install --force
   
4. **Hydration Mismatches**
   - Often from date formatting differences
   - Solution: Use consistent formatting libraries like date-fns

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
- **Dynamic Routes**: camelCase for params (e.g., `[ticketId]`)

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
- Use `as const` for literal types

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

## Progressive Enhancement

Forms should work without JavaScript:

```typescript
// Server component form
export function DeleteForm({ ticketId }: { ticketId: string }) {
  return (
    <form action={deleteTicket.bind(null, ticketId)}>
      <Button type="submit">Delete</Button>
    </form>
  );
}
```

To test progressive enhancement:
1. Disable JavaScript in browser DevTools
2. Run production build: `npm run build && npm run start`
3. Verify forms still submit and actions execute

## Currency Handling

```typescript
import Big from 'big.js';

// Configure Big.js
Big.RM = Big.roundHalfEven;
Big.DP = 2; // Decimal places

// Convert dollars to cents for storage
export function dollarsToCents(dollars: string): number {
  return new Big(dollars).times(100).toNumber();
}

// Convert cents to dollars for display
export function centsToDollars(cents: number): string {
  return new Big(cents).div(100).toFixed(2);
}

// Format for display
export function formatCurrency(cents: number): string {
  const dollars = centsToDollars(cents);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(dollars));
}
```

## Custom Hooks

### useAuth Hook

```typescript
'use client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const auth = await getAuth();
      setUser(auth.user);
      setIsFetched(true);
    }
    
    fetchUser();
  }, [pathname]);

  return { user, isFetched };
}
```

### useActionFeedback Hook

```typescript
export function useActionFeedback(
  actionState: ActionState,
  options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }
) {
  const prevTimestamp = useRef(actionState.timestamp);

  useEffect(() => {
    if (actionState.timestamp === prevTimestamp.current) return;

    if (actionState.status === 'SUCCESS') {
      if (actionState.message) {
        toast.success(actionState.message);
      }
      options?.onSuccess?.();
    } else if (actionState.status === 'ERROR') {
      if (actionState.message) {
        toast.error(actionState.message);
      }
      options?.onError?.();
    }

    prevTimestamp.current = actionState.timestamp;
  }, [actionState, options]);
}
```

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

---

# Next.js Implementation Style Guide

## Core Architecture Principles

### Server-First Approach
- **Prioritize server components** for data fetching and initial rendering
- **Use client components** only when interactivity is required (hooks, event handlers, state management)
- **Server actions** handle all form submissions and data mutations
- **Protected routes** use server-side authentication checks with redirect logic

### Database Design Philosophy
- **Explicit many-to-many relationships** using junction tables for metadata storage
- **Compound keys** for junction tables instead of synthetic IDs
- **Database transactions** for multi-step operations to prevent inconsistent states
- **Soft deletes** and **audit trails** where appropriate

## Advanced Authentication & Authorization Patterns

### Core Auth Function Structure
```typescript
// Central auth function with optional checks
export async function getAuthOrRedirect(options?: {
  checkEmailVerified?: boolean;
  checkActiveWorkspace?: boolean;
  checkSpecificCondition?: boolean;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  // Optional verification checks
  if (options?.checkEmailVerified !== false && !user.emailVerified) {
    redirect('/email-verification');
  }
  
  if (options?.checkActiveWorkspace !== false && !hasActiveWorkspace) {
    redirect('/onboarding');
  }
  
  return { user, session };
}
```

### Progressive Onboarding Flow
1. **Email Verification** → User must verify email before proceeding
2. **Workspace/Organization Setup** → User must create or join a workspace
3. **Active Context Selection** → User must have an active workspace/context
4. **Feature-Specific Setup** → Additional setup as needed

### Escape Patches for Auth Checks
Use options objects to selectively bypass checks when the check itself would create circular redirects:
```typescript
// In email verification action
const { user } = await getAuthOrRedirect({ 
  checkEmailVerified: false 
});

// In workspace creation action  
const { user } = await getAuthOrRedirect({ 
  checkActiveWorkspace: false 
});
```

### Role-Based Access Control

**Core Principle**: Use a membership pattern to connect users to contexts (organizations, teams, projects, etc.) with specific roles.

**Database Schema Foundation:**
```prisma
model User {
  id          String @id @default(cuid())
  email       String @unique
  memberships Membership[]
}

model Context {  // Organization, Team, Project, etc.
  id          String @id @default(cuid())
  name        String
  memberships Membership[]
}

model Membership {
  id        String @id @default(cuid())
  userId    String
  contextId String
  role      Role   @default(MEMBER)
  isActive  Boolean @default(false)
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  context Context @relation(fields: [contextId], references: [id], onDelete: Cascade)
  
  @@unique([userId, contextId])
}

enum Role {
  MEMBER
  ADMIN
}
```

**Helper Functions Pattern:**
```typescript
// Base authentication
async function getAuthOrRedirect() {
  // Check user authentication and verified email
  // Return { user, session, activeContext }
}

// Role-specific authorization
async function getAdminOrRedirect(contextId: string) {
  const { user } = await getAuthOrRedirect();
  const membership = await getMembership(contextId, user.id);
  
  if (membership?.role !== "admin") {
    redirect("/sign-in");
  }
  
  return { user, membership };
}
```

**Multi-Layer Protection Strategy:**
1. **Layout Level**: Protected routes in admin folders with auth checks in layout.tsx
2. **UI Level**: Conditional rendering based on user roles
3. **Server Action Level**: Authorization checks at data source (most critical)

### Authorization Principles

- **Proximity Rule**: Place authorization checks as close to data operations as possible
- **Default Deny**: Default to denying access, explicitly grant permissions
- **Last Admin Protection**: Prevent actions that would remove all administrators
- **Compound Keys**: Use multi-field lookups for membership verification

## Advanced Database Schema Patterns

### Junction Table Design
```prisma
model UserWorkspace {
  userId      String
  workspaceId String
  role        Role      @default(MEMBER)
  isActive    Boolean   @default(false)
  joinedAt    DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id])
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  
  @@id([userId, workspaceId])
  @@map("user_workspaces")
}
```

### Security Token Pattern
```prisma
model SecurityToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique  // Store hashed version
  userId    String
  email     String   // Extra security layer
  type      TokenType
  expiresAt DateTime
  
  user      User     @relation(fields: [userId], references: [id])
  
  @@map("security_tokens")
}
```

### Context Scoping Pattern

**Multi-tenant Architecture:**
```prisma
model Entity {
  id        String @id @default(cuid())
  contextId String
  name      String
  
  context Context @relation(fields: [contextId], references: [id], onDelete: Cascade)
}
```

**Key Principles:**
- Add `contextId` to scope entities to specific contexts
- Use `onDelete: Cascade` for proper cleanup
- Always filter queries by active context
- Default new entities to user's active context

### Migration Strategy

**Safe Schema Changes:**
1. Add new fields with default values
2. Migrate existing data if needed
3. Remove defaults for future records
4. Consider database reset for development environments

```prisma
// Step 1: Add with default
contextId String @default("default-context-id")

// Step 2: Update existing data
// Step 3: Remove default
contextId String
```

## Enhanced Server Actions Architecture

### Standard Server Action Structure
```typescript
export async function resourceAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 1. Authentication & Authorization
    const { user } = await getAuthOrRedirect();
    
    // 2. Input validation
    const validatedData = schema.parse({
      field: formData.get('field'),
    });
    
    // 3. Business logic validation
    const existingResource = await db.resource.findFirst({
      where: { /* conditions */ }
    });
    
    if (existingResource) {
      return { 
        status: 'error', 
        message: 'Resource already exists' 
      };
    }
    
    // 4. Database operations (use transactions for multi-step)
    await db.$transaction(async (tx) => {
      await tx.resource.create({ /* data */ });
      await tx.relatedResource.update({ /* data */ });
    });
    
    // 5. Cache invalidation
    revalidatePath('/path');
    
    // 6. Success response
    return { 
      status: 'success', 
      message: 'Resource created successfully' 
    };
    
  } catch (error) {
    return { 
      status: 'error', 
      message: 'Failed to create resource' 
    };
  }
}
```

### Standard Server Action Pattern (Layered Architecture)

```typescript
export async function performAction(input: ActionInput) {
  // 1. Authentication
  const { user, activeContext } = await getAuthOrRedirect();
  
  // 2. Authorization (if required)
  if (requiresAdmin) {
    await getAdminOrRedirect(contextId);
  }
  
  // 3. Input validation
  const validatedInput = inputSchema.parse(input);
  
  // 4. Business logic validation
  // - Entity existence checks
  // - Business rule enforcement
  // - Constraint validation
  
  // 5. Database operations
  const result = await db.entity.operation(validatedInput);
  
  // 6. Side effects (prefer async)
  // - File operations via queue
  // - Email notifications
  // - Cache invalidation
  
  // 7. Response
  return { success: true, data: result };
}
```

### Complex Authorization Patterns

**Multi-path Authorization:**
```typescript
export async function deleteEntity(entityId: string) {
  const { user } = await getAuthOrRedirect();
  const entity = await getEntity(entityId);
  const membership = await getMembership(entity.contextId, user.id);
  
  // Multiple authorization paths
  const canDelete = 
    membership?.role === "admin" ||           // Admin can delete anything
    entity.createdById === user.id ||         // Owner can delete own
    membership?.permissions.canDelete;        // Explicit permission
  
  if (!canDelete) {
    throw new Error("Unauthorized");
  }
  
  // Business rule validation
  if (await isLastRequired(entity)) {
    throw new Error("Cannot delete last required entity");
  }
  
  await db.entity.delete({ where: { id: entityId } });
}
```

### One-Time Use Token Pattern
```typescript
// Generate and store hashed token
const tokenId = generateRandomString(32);
const tokenHash = await hash(tokenId);

await db.securityToken.create({
  data: {
    tokenHash,
    userId: user.id,
    email: user.email,
    type: 'PASSWORD_RESET',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  }
});

// Validation and one-time use
const tokenHash = await hash(receivedTokenId);
const token = await db.securityToken.findUnique({
  where: { tokenHash }
});

// Always delete after use (regardless of success/failure)
await db.securityToken.delete({
  where: { tokenHash }
});
```

## Advanced Form Handling Patterns

### Reusable Form Components
```typescript
// Base form structure
export function ResourceForm({ 
  action, 
  initialData, 
  submitLabel = "Submit" 
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialData?: Partial<ResourceData>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  
  return (
    <form action={formAction} className="space-y-4">
      <Input 
        name="field"
        defaultValue={initialData?.field}
        required
      />
      <SubmitButton>{submitLabel}</SubmitButton>
      {state.status === 'error' && (
        <ErrorMessage message={state.message} />
      )}
    </form>
  );
}
```

### Consistent UI Patterns
- **Icons on the left** of button labels for consistency
- **Reuse existing form implementations** as blueprints for new forms
- **Toast notifications** for user feedback on actions
- **Loading states** with spinners during form submission

## Advanced Component Architecture

### Hierarchical Organization

**Entity/List/Item Pattern:**
```
FeatureComponent/
├── index.tsx              # Main container (forms, data fetching, business logic)
├── FeatureList.tsx        # List rendering and layout
├── FeatureItem.tsx        # Individual item display
├── hooks/
│   └── useFeaturePagination.tsx
├── utils.ts
└── constants.ts
```

**Component Responsibilities:**
- **Container**: State management, data fetching, business logic
- **List**: Layout, iteration, list-level interactions
- **Item**: Individual item display, item-specific actions

### Isomorphic Components
Create components that work in both server-side and client-side environments:

```typescript
// Example: Generic attachment component
interface AttachmentProps {
  entityId: string;
  entityType: string;
  onCreateAttachment?: (attachment: Attachment) => void; // Optional for client-side
  onDeleteAttachment?: (id: string) => void; // Optional for client-side
}

export function AttachmentList({ 
  entityId, 
  entityType, 
  onCreateAttachment, 
  onDeleteAttachment 
}: AttachmentProps) {
  // Server-side: callbacks not needed (server actions handle updates)
  // Client-side: callbacks invalidate cache and update UI
}
```

### Client-Server Boundary Management
When mixing client and server components:

```typescript
// ❌ Avoid: Cannot pass functions to client components
<ClientComponent renderFunction={serverFunction} />

// ✅ Preferred: Use callback handlers for client-side cache invalidation
<ClientComponent 
  onUpdate={() => invalidateCache('entity-list')} 
  onDelete={(id) => invalidateCache(`entity-${id}`)} 
/>
```

### Custom Hook Extraction

**When to Extract:**
- Significant component-specific logic
- State management patterns
- Reusable functionality
- Complex effect combinations

```typescript
function useFeaturePagination<T>(initialData: T[]) {
  const [items, setItems] = useState(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const loadMore = useCallback(async () => {
    setLoading(true);
    // Pagination logic
    setLoading(false);
  }, []);
  
  return { items, hasMore, loading, loadMore };
}
```

### Render Props for Flexibility

**Avoiding Prop Drilling:**
```typescript
interface FlexibleItemProps<T> {
  item: T;
  actions?: (item: T) => React.ReactNode;
}

function FlexibleItem<T>({ item, actions }: FlexibleItemProps<T>) {
  return (
    <div className="item-container">
      <ItemContent item={item} />
      <div className="item-actions">
        {actions?.(item)}
      </div>
    </div>
  );
}

// Usage
<FlexibleItem 
  item={data} 
  actions={(item) => (
    <>
      <EditButton itemId={item.id} />
      <DeleteButton itemId={item.id} />
    </>
  )}
/>
```

### Handling N+1 Problems
Use nested fetching strategies instead of individual client-side requests:

```typescript
// ❌ Avoid: Each item triggers its own fetch
function ItemList({ items }) {
  return items.map(item => <ItemWithData key={item.id} itemId={item.id} />);
}

// ✅ Preferred: Fetch all related data in one query
function ItemList({ items, relatedData }) {
  return items.map(item => (
    <Item 
      key={item.id} 
      item={item} 
      relatedData={relatedData[item.id]} 
    />
  ));
}
```

## Polymorphic Components & Design Patterns

### Entity-Agnostic Design
Design components to work with multiple entity types:

```typescript
interface PolymorphicComponentProps {
  entityId: string;
  entityType: 'user' | 'post' | 'comment'; // Union of supported types
  entity?: any; // Optional pre-loaded entity data
}

// Usage examples:
<Comments entityId="123" entityType="post" />
<Comments entityId="456" entityType="user" />
<Attachments entityId="789" entityType="comment" />
```

### Database Schema Pattern
Use polymorphic relationships in your database schema:

```prisma
model Attachment {
  id         String @id @default(cuid())
  filename   String
  url        String
  
  // Polymorphic relationship
  entityId   String
  entityType String
  
  @@map("attachments")
}

model Comment {
  id         String @id @default(cuid())
  content    String
  
  // Polymorphic relationship  
  entityId   String
  entityType String
  
  @@map("comments")
}
```

### Flexible Entity Associations

**Database Schema Pattern:**
```prisma
model Attachment {
  id          String @id @default(cuid())
  filename    String
  entityType  EntityType
  
  // Polymorphic foreign keys (only one populated)
  entityAId   String?
  entityBId   String?
  entityCId   String?
  
  entityA EntityA? @relation(fields: [entityAId], references: [id], onDelete: Cascade)
  entityB EntityB? @relation(fields: [entityBId], references: [id], onDelete: Cascade)
  entityC EntityC? @relation(fields: [entityCId], references: [id], onDelete: Cascade)
}

enum EntityType {
  ENTITY_A
  ENTITY_B
  ENTITY_C
}
```

### Generic Polymorphic Queries

**Abstract Query Function:**
```typescript
async function getRelatedItems(
  entityType: EntityType, 
  entityId: string
) {
  const whereClause = buildWhereClause(entityType, entityId);
  
  return db.relatedItem.findMany({
    where: {
      entityType,
      ...whereClause,
    },
  });
}

function buildWhereClause(entityType: EntityType, entityId: string) {
  switch (entityType) {
    case "ENTITY_A":
      return { entityAId: entityId };
    case "ENTITY_B":
      return { entityBId: entityId };
    case "ENTITY_C":
      return { entityCId: entityId };
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}
```

### TypeScript Type Safety

**Runtime Type Guards:**
```typescript
type PolymorphicSubject = 
  | { entityA: EntityA; entityB?: never; entityC?: never }
  | { entityB: EntityB; entityA?: never; entityC?: never }
  | { entityC: EntityC; entityA?: never; entityB?: never };

function isEntityA(subject: PolymorphicSubject): subject is { entityA: EntityA } {
  return 'entityA' in subject && subject.entityA !== undefined;
}

function isEntityB(subject: PolymorphicSubject): subject is { entityB: EntityB } {
  return 'entityB' in subject && subject.entityB !== undefined;
}

// Usage in business logic
function getContextId(subject: PolymorphicSubject): string {
  if (isEntityA(subject)) {
    return subject.entityA.contextId;
  } else if (isEntityB(subject)) {
    return subject.entityB.contextId;
  } else {
    return subject.entityC.contextId;
  }
}
```

## Email & Communication Patterns

### Email Template Structure
```typescript
// React Email components
export function NotificationEmail({ 
  userName, 
  actionUrl, 
  code 
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8">
            <Section>
              <Text>Hello {userName},</Text>
              <Text>{/* Email content */}</Text>
              {actionUrl && (
                <Button href={actionUrl}>
                  Take Action
                </Button>
              )}
              {code && (
                <Text className="font-mono text-lg">
                  {code}
                </Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
```

### Asynchronous Processing with Message Queues
```typescript
// Event-driven email sending
export const emailEvent = inngest.createFunction(
  { id: 'send-email' },
  { event: 'app/email.send' },
  async ({ event }) => {
    const { userId, type, data } = event.data;
    
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId }
    });
    
    const result = await sendEmail(user, type, data);
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { event, body: result.data };
  }
);

// Trigger from server action
await inngest.send({
  name: 'app/email.send',
  data: { userId: user.id, type: 'VERIFICATION', data: { code } }
});
```

## Multi-Tenancy & Context Management

### Active Context Pattern
```typescript
// Single active workspace per user
model UserWorkspace {
  isActive Boolean @default(false)
  // ... other fields
  
  @@id([userId, workspaceId])
}

// Switching active context (idempotent operation)
export async function switchActiveContext(contextId: string) {
  const { user } = await getAuthOrRedirect();
  
  await db.$transaction([
    // Deactivate all other contexts
    db.userWorkspace.updateMany({
      where: { 
        userId: user.id,
        workspaceId: { not: contextId }
      },
      data: { isActive: false }
    }),
    // Activate target context
    db.userWorkspace.update({
      where: { 
        userId_workspaceId: { 
          userId: user.id, 
          workspaceId: contextId 
        }
      },
      data: { isActive: true }
    })
  ]);
}
```

### Context-Aware Data Fetching
```typescript
export async function getResourcesByContext() {
  const { user } = await getAuthOrRedirect();
  
  // Get user's active context
  const activeContext = await db.userWorkspace.findFirst({
    where: { userId: user.id, isActive: true },
    include: { workspace: true }
  });
  
  // Fetch resources scoped to active context
  return db.resource.findMany({
    where: { workspaceId: activeContext.workspaceId }
  });
}
```

## Layered Architecture

### API Layer (Server Actions)
Keep server actions lightweight - handle validation, authorization, then delegate:

```typescript
export async function createEntity(formData: FormData) {
  // 1. Authentication & Authorization
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  
  // 2. Input validation
  const validatedData = entitySchema.parse({
    name: formData.get('name'),
    description: formData.get('description')
  });
  
  // 3. Delegate to service layer
  try {
    const entity = await entityService.createEntity({
      ...validatedData,
      userId: user.id
    });
    
    // 4. Cache invalidation
    revalidatePath('/entities');
    
    return { success: true, entity };
  } catch (error) {
    return { error: 'Failed to create entity' };
  }
}
```

### Service Layer
Extract domain logic and business rules:

```typescript
// services/entity-service.ts
export const entityService = {
  async createEntity(data: CreateEntityData) {
    // Business logic here
    const subject = await this.getEntitySubject(data);
    
    // Delegate to data layer
    return await entityData.create({
      ...data,
      subject
    });
  },
  
  async getEntitySubject(data: CreateEntityData) {
    // Domain-specific logic
    return `${data.type}-${data.name}`.toLowerCase();
  }
};
```

### Data Access Layer
Pure database operations, abstracted from ORM details:

```typescript
// data/entity-data.ts
export const entityData = {
  async create(data: CreateEntityInput) {
    return await prisma.entity.create({
      data,
      include: {
        user: true,
        attachments: true
      }
    });
  },
  
  async findMany(options: FindManyOptions = {}) {
    const { includeUser, includeAttachments } = options;
    
    return await prisma.entity.findMany({
      include: {
        user: includeUser,
        attachments: includeAttachments
      }
    });
  }
};
```

### Import Conventions
Use descriptive wildcard imports for service layers:

```typescript
// ✅ Preferred: Clearly indicates service layer origin
import * as entityService from '@/services/entity-service';
import * as userService from '@/services/user-service';

// Usage
const entity = await entityService.createEntity(data);
const user = await userService.findById(userId);
```

### Barrel Files
Use barrel files for backend modules only:

```typescript
// services/index.ts
export * from './entity-service';
export * from './user-service';
export * from './notification-service';

// Usage in server actions
import * as services from '@/services';
const entity = await services.entityService.createEntity(data);
```

## Advanced Data Management

### Dynamic Include Patterns
Handle optional data loading efficiently:

```typescript
interface FindOptions {
  includeUser?: boolean;
  includeAttachments?: boolean;
  includeComments?: boolean;
}

async function findEntities(options: FindOptions = {}) {
  const include: any = {};
  
  if (options.includeUser) include.user = true;
  if (options.includeAttachments) include.attachments = true;
  if (options.includeComments) include.comments = true;
  
  return await prisma.entity.findMany({ include });
}
```

### Data Transfer Objects (DTOs)
Create consistent data structures for polymorphic relationships:

```typescript
// dto/entity-subject-dto.ts
interface EntitySubjectDTO {
  id: string;
  name: string;
  type: string;
  organizationId: string;
}

export const entitySubjectDTO = {
  fromUser(user: User): EntitySubjectDTO {
    return {
      id: user.id,
      name: user.name,
      type: 'user',
      organizationId: user.organizationId
    };
  },
  
  fromPost(post: Post): EntitySubjectDTO {
    return {
      id: post.id,
      name: post.title,
      type: 'post', 
      organizationId: post.organizationId
    };
  }
};
```

### Self-Referencing Relationships
Handle entity relationships elegantly:

```typescript
model Entity {
  id               String   @id @default(cuid())
  name             String
  
  // Self-referencing many-to-many
  referencedEntities   Entity[] @relation("EntityReferences")
  referencingEntities  Entity[] @relation("EntityReferences")
  
  @@map("entities")
}

// Service layer logic for connecting references
export async function connectEntityReferences(entityId: string, content: string) {
  const referencedIds = extractIdsFromText(content);
  
  await prisma.entity.update({
    where: { id: entityId },
    data: {
      referencedEntities: {
        connect: referencedIds.map(id => ({ id }))
      }
    }
  });
}
```

## File Management & Storage

### Cloud Storage Integration

**Generic S3 Setup:**
```typescript
import { S3Client } from "@aws-sdk/client-s3";

export const storageClient = new S3Client({
  region: process.env.STORAGE_REGION,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
  },
});
```

### File Upload Patterns

**Validation Schema:**
```typescript
const fileUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "At least one file required")
    .refine(
      (files) => files.every(file => file.size <= MAX_FILE_SIZE),
      `File size must be less than ${MAX_FILE_SIZE_MB}MB`
    )
    .refine(
      (files) => files.every(file => ACCEPTED_TYPES.includes(file.type)),
      "Unsupported file type"
    )
});
```

**Hierarchical Storage Key Generation:**
```typescript
function generateStorageKey(
  contextId: string,
  entityType: string,
  entityId: string,
  filename: string,
  attachmentId: string
): string {
  return `${contextId}/${entityType}/${entityId}/${filename}-${attachmentId}`;
}
```

### Async File Operations

**Upload with Database Coordination:**
```typescript
export async function uploadFiles(entityId: string, formData: FormData) {
  const { user, activeContext } = await getAuthOrRedirect();
  
  // Validate files
  const { files } = fileUploadSchema.parse({ 
    files: formData.getAll("files") 
  });
  
  // Create database records first
  const attachments = await Promise.all(
    files.map(file => 
      db.attachment.create({
        data: { 
          filename: file.name, 
          entityId,
          contextId: activeContext.id
        }
      })
    )
  );
  
  // Upload to storage
  await Promise.all(
    files.map(async (file, index) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = generateStorageKey(
        activeContext.id, 
        "entity", 
        entityId, 
        file.name, 
        attachments[index].id
      );
      
      await uploadToStorage(key, buffer, file.type);
    })
  );
}
```

**Async Deletion with Message Queue:**
```typescript
// Fast response - queue heavy operations
export async function deleteAttachment(attachmentId: string) {
  const attachment = await db.attachment.delete({ 
    where: { id: attachmentId } 
  });
  
  // Queue async storage cleanup
  await messageQueue.send("attachment.deleted", {
    attachmentId,
    contextId: attachment.contextId,
    entityId: attachment.entityId,
    filename: attachment.filename
  });
}
```

## Code Organization & Refactoring

### File-to-Folder Migration

**When to Convert:**
- Component exceeds ~200 lines
- Multiple related utility functions
- Complex state management
- Reusable sub-components emerge

**Migration Strategy:**
```
// Before: SingleComponent.tsx
// After:
ComponentName/
├── index.tsx              # Main component export
├── Component.tsx          # Core component logic
├── utils.ts               # Component-specific utilities
├── hooks.ts               # Custom hooks
├── types.ts               # Component-specific types
└── constants.ts           # Constants and configs
```

### Variable Extraction for Clarity

**Complex JSX Management:**
```typescript
function ComplexComponent({ data, permissions }: Props) {
  // Extract complex conditional rendering
  const navigationSection = (
    <nav className="navigation">
      {navItems.map(item => (
        <NavItem key={item.id} {...item} />
      ))}
    </nav>
  );
  
  const actionButtons = permissions.canEdit ? (
    <div className="actions">
      <EditButton />
      <DeleteButton />
      <ShareButton />
    </div>
  ) : null;
  
  const contentArea = data.isEmpty ? (
    <EmptyState />
  ) : (
    <ContentRenderer data={data} />
  );
  
  return (
    <div className="layout">
      {navigationSection}
      <main>{contentArea}</main>
      {actionButtons}
    </div>
  );
}
```

### Refactoring Principles

- **Team Alignment**: Establish consistent patterns across the team
- **Progressive Enhancement**: Refactor incrementally, not all at once
- **Composition Over Inheritance**: Prefer composable patterns
- **Single Responsibility**: Each function/component should have one clear purpose

### Feature-Based Structure
Organize code by features, not technical layers:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── data/
│   │   └── dto/
│   ├── entities/
│   │   ├── components/
│   │   ├── services/
│   │   ├── data/
│   │   └── dto/
│   └── attachments/
│       ├── components/
│       ├── services/
│       ├── data/
│       └── dto/
├── lib/
│   ├── auth/
│   ├── database/
│   └── utils/
└── app/
    ├── (auth)/
    ├── api/
    └── dashboard/
```

### Barrel File Usage
Use barrel files strategically:

```typescript
// ✅ Backend: Use barrel files for clean imports
// features/entities/index.ts
export * from './services';
export * from './data';

// ❌ Frontend: Avoid barrel files (bundle size concerns)
// Import directly from specific files
import { EntityCard } from '@/features/entities/components/entity-card';
```

## Permission Systems

### Granular Permission Design

**Flexible Permission Schema:**
```prisma
model Membership {
  // ... base fields
  
  // Action-based permissions
  canCreate Boolean @default(true)
  canRead   Boolean @default(true) 
  canUpdate Boolean @default(false)
  canDelete Boolean @default(false)
  
  // Feature-specific permissions
  canInvite   Boolean @default(false)
  canManage   Boolean @default(false)
  canExport   Boolean @default(false)
}
```

**Abstract Permission Component:**
```typescript
interface PermissionToggleProps {
  userId: string;
  contextId: string;
  permissionKey: keyof MembershipPermissions;
  currentValue: boolean;
}

function PermissionToggle({ 
  userId, 
  contextId, 
  permissionKey, 
  currentValue 
}: PermissionToggleProps) {
  return (
    <form action={togglePermission}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="contextId" value={contextId} />
      <input type="hidden" name="permissionKey" value={permissionKey} />
      
      <button type="submit" className="permission-toggle">
        {currentValue ? <EnabledIcon /> : <DisabledIcon />}
      </button>
    </form>
  );
}
```

**Permission Enforcement Helper:**
```typescript
async function getEntityWithPermissions(entityId: string, userId: string) {
  const entity = await db.entity.findUnique({
    where: { id: entityId },
    include: { 
      context: { 
        include: { memberships: true } 
      } 
    }
  });
  
  const userMembership = entity.context.memberships.find(
    m => m.userId === userId
  );
  
  return {
    ...entity,
    permissions: {
      canRead: userMembership?.canRead ?? false,
      canUpdate: userMembership?.canUpdate ?? false,
      canDelete: userMembership?.canDelete ?? false,
      isAdmin: userMembership?.role === "admin",
    }
  };
}
```

## Enhanced Security Patterns

### Organization-Level Credentials
Implement secure API access patterns:

```typescript
model Credential {
  id           String       @id @default(cuid())
  name         String
  secretHash   String       @unique
  lastUsed     DateTime?
  createdAt    DateTime     @default(now())
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String
  
  @@map("credentials")
}

// Server action for credential creation
export async function createCredential(organizationId: string, name: string) {
  const secret = generateRandomToken();
  const secretHash = await hashSecret(secret);
  
  const credential = await prisma.credential.create({
    data: {
      name,
      secretHash,
      organizationId
    }
  });
  
  // Return unhashed secret only once
  return { 
    success: true, 
    secret, // Save this immediately!
    credential: { id: credential.id, name: credential.name }
  };
}
```

### Protected API Routes
Implement robust authorization for API endpoints:

```typescript
// app/api/protected/route.ts
export async function DELETE(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const token = authHeader.substring(7);
  const hashedToken = await hashSecret(token);
  
  const credential = await prisma.credential.findUnique({
    where: { secretHash: hashedToken },
    include: { organization: true }
  });
  
  if (!credential) {
    return new Response('Invalid credentials', { status: 401 });
  }
  
  // Update last used timestamp
  await prisma.credential.update({
    where: { id: credential.id },
    data: { lastUsed: new Date() }
  });
  
  // Proceed with authorized operation
  // ...
}
```

### Preventing Timing Attacks
Ensure consistent response times:

```typescript
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  // Always perform password verification, even if user doesn't exist
  const passwordToVerify = user?.passwordHash ?? 'dummy-hash-for-consistent-timing';
  const isValidPassword = await verifyPassword(password, passwordToVerify);
  
  if (!user || !isValidPassword) {
    return { error: 'Invalid credentials' };
  }
  
  return { success: true, user };
}
```

### Preventing Enumeration Attacks
Use generic responses to avoid information leakage:

```typescript
export async function resetPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  // Always return success message, regardless of user existence
  if (user) {
    await sendPasswordResetEmail(user);
  }
  
  return { 
    success: true, 
    message: 'If an account exists, you will receive a reset link' 
  };
}
```

### Throttling Mechanisms
Implement rate limiting for sensitive operations:

```typescript
export async function resendVerificationCode(userId: string) {
  const canResend = await canResendVerificationEmail(userId);
  
  if (!canResend) {
    return { 
      error: 'Please wait 60 seconds before requesting another code' 
    };
  }
  
  // Proceed with sending code
  await sendVerificationCode(userId);
  return { success: true };
}

async function canResendVerificationEmail(userId: string) {
  const lastToken = await prisma.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!lastToken) return true;
  
  const timeSinceLastSend = Date.now() - lastToken.createdAt.getTime();
  return timeSinceLastSend > 60000; // 60 seconds
}
```

### Input Sanitization
Protect against injection attacks:

```typescript
// ❌ Dangerous: Direct HTML rendering
function UnsafeContent({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// ✅ Safe: Sanitized content or structured components
function SafeContent({ content }: { content: string }) {
  return (
    <div>
      <Linkify options={{ target: '_blank' }}>
        {content}
      </Linkify>
    </div>
  );
}
```

### Client & Server-Side Guardrails
Implement validation at multiple layers:

```typescript
// Client-side: UI protection
function PaginationButton({ onClick, isPending }: PaginationButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={isPending}
      className={isPending ? 'opacity-50' : ''}
    >
      Next Page
    </button>
  );
}

// Server-side: Strict validation
const ALLOWED_PAGE_SIZES = [10, 20, 50, 100];

export async function getEntities(pageSize: number) {
  if (!ALLOWED_PAGE_SIZES.includes(pageSize)) {
    throw new Error('Invalid page size');
  }
  
  return await prisma.entity.findMany({
    take: pageSize
  });
}
```

## Third-Party Integration Patterns

### Environment Configuration
Manage external service credentials securely:

```typescript
// lib/stripe/index.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});
```

### Webhook Handling
Implement secure webhook endpoints:

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
```

### Background Job Processing
Use message queues for async operations:

```typescript
// Using Inngest for background jobs
export const processEntityCreated = inngest.createFunction(
  { name: 'Process Entity Created' },
  { event: 'entity.created' },
  async ({ event }) => {
    const { entityId, userId } = event.data;
    
    // Perform time-consuming operations
    await sendNotificationEmail(userId, entityId);
    await updateSearchIndex(entityId);
    await generateThumbnail(entityId);
  }
);

// Trigger from server action
export async function createEntity(data: CreateEntityData) {
  const entity = await entityService.createEntity(data);
  
  // Trigger background processing
  await inngest.send({
    name: 'entity.created',
    data: {
      entityId: entity.id,
      userId: data.userId
    }
  });
  
  return entity;
}
```

## UI/UX Patterns

### Navigation Components

**Flexible Breadcrumb Pattern:**
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  dropdown?: BreadcrumbItem[];
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, index) => (
        <div key={index} className="breadcrumb-item">
          {item.dropdown ? (
            <DropdownMenu>
              <DropdownMenuTrigger>{item.label}</DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.dropdown.map(dropdownItem => (
                  <DropdownMenuItem key={dropdownItem.href}>
                    <Link href={dropdownItem.href}>{dropdownItem.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight />}
        </div>
      ))}
    </nav>
  );
}
```

### Form Patterns

**Generic Confirmation Hook:**
```typescript
function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  
  const confirm = useCallback((action: () => void) => {
    setPendingAction(() => action);
    setIsOpen(true);
  }, []);
  
  const handleConfirm = useCallback(() => {
    pendingAction();
    setIsOpen(false);
  }, [pendingAction]);
  
  return { 
    isOpen, 
    setIsOpen, 
    confirm, 
    handleConfirm 
  };
}
```

**Optimistic UI Updates:**
```typescript
function EntityItem({ entity }: { entity: Entity }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState(entity);
  
  const handleUpdate = (newData: Partial<Entity>) => {
    // Optimistic update
    setOptimisticState(prev => ({ ...prev, ...newData }));
    
    startTransition(async () => {
      try {
        await updateEntity(entity.id, newData);
      } catch (error) {
        // Revert on error
        setOptimisticState(entity);
      }
    });
  };
  
  return (
    <div className={isPending ? "opacity-50" : ""}>
      <EntityDisplay entity={optimisticState} />
      <ActionButtons onUpdate={handleUpdate} />
    </div>
  );
}
```

## Performance & UX Patterns

### Optimistic Updates
Implement optimistic UI patterns:

```typescript
function useOptimisticEntity() {
  const [optimisticEntities, addOptimisticEntity] = useOptimistic(
    entities,
    (state, newEntity) => [...state, newEntity]
  );
  
  async function createEntity(data: CreateEntityData) {
    // Optimistically add to UI
    addOptimisticEntity({
      id: 'temp-' + Date.now(),
      ...data,
      createdAt: new Date()
    });
    
    // Perform actual creation
    await createEntityAction(data);
  }
  
  return { optimisticEntities, createEntity };
}
```

### Loading States
Provide clear feedback during async operations:

```typescript
function EntityForm() {
  const [isPending, startTransition] = useTransition();
  
  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createEntityAction(formData);
    });
  }
  
  return (
    <form action={handleSubmit}>
      <input name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Entity'}
      </button>
    </form>
  );
}
```

### Cache Invalidation Strategies
Implement granular cache control:

```typescript
// Specific path invalidation
revalidatePath('/entities');
revalidatePath(`/entities/${entityId}`);

// Tag-based invalidation
revalidateTag('entities');
revalidateTag(`entity-${entityId}`);

// Client-side cache invalidation for React Query
function useEntityMutations() {
  const queryClient = useQueryClient();
  
  const createEntity = useMutation({
    mutationFn: createEntityAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    }
  });
  
  return { createEntity };
}
```

## Error Handling & User Experience

### Graceful Degradation
- **Console logging** for development before implementing full features
- **Progressive enhancement** from basic functionality to advanced features
- **Fallback states** for failed operations

### State Management
- **Server state** for data fetching and mutations
- **Client state** only for UI interactions and temporary states
- **URL state** for filters, pagination, and shareable states

### Race Condition Prevention
```typescript
// Use client-side refresh instead of server-side revalidation
// when components might unmount before showing feedback
const handleSuccess = () => {
  toast.success('Operation completed');
  router.refresh(); // Client-side refresh after feedback
};
```

## Configuration Guidelines

### Environment Setup

**Next.js Configuration:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActionsBodySizeLimit: '10mb',
  },
};

module.exports = nextConfig;
```

**Environment Type Safety:**
```typescript
// types/environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    STORAGE_PROVIDER: string;
    STORAGE_REGION: string;
    STORAGE_ACCESS_KEY: string;
    STORAGE_SECRET_KEY: string;
    STORAGE_BUCKET: string;
  }
}
```

## Best Practices Summary

1. **Favor composition over inheritance** - Build reusable, polymorphic components
2. **Separate concerns clearly** - Use distinct layers for UI, API, Service, and Data
3. **Security by design** - Implement protection patterns from the start
4. **Optimize for maintainability** - Use descriptive imports and clear file organization
5. **Handle errors gracefully** - Provide meaningful feedback at every layer
6. **Think in terms of features** - Organize code around business domains
7. **Optimize performance** - Use appropriate caching and loading strategies
8. **Test security assumptions** - Validate inputs at multiple layers

This comprehensive guide provides architectural patterns that prioritize **security**, **user experience**, and **maintainability** while providing flexibility for various application domains through its generic patterns and reusable components. The patterns can be applied to any domain by adapting the naming and specific implementations to match your project's requirements.