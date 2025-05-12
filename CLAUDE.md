# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js branding and digital agency website built with:
- Next.js 15.2.2 with App Router
- React 19
- TypeScript
- Tailwind CSS 4 with Shadcn UI
- ESLint for code quality

## Commands

### Development Commands
```bash
# Start development server
npm run dev

# Build the application
npm run build

# Start the production server
npm run start

# Run linting
npm run lint

# Fix linting errors
npm run lint-fix

# Type check
npm run type
```

## Animation Approach

The project uses Tailwind CSS v4's "CSS-first" approach to animations:

- Animations are defined in globals.css using standard CSS
- Current animations available:
  - `animate-fade-in`: Fades in elements from bottom to top
  - `animate-slide-in`: Slides in elements from left to right

To use animations, simply add the animation class to your elements:
```jsx
<div className="animate-fade-in">
  This content will fade in
</div>
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

## Project Architecture

### File Structure

The project follows a feature-based organization pattern:

```
/src
  /app                   # Next.js App Router pages
    /features            # Domain/feature-specific code
      /[feature]         # Feature-specific modules
        /components      # Feature-specific components
        /actions         # Server actions (if needed)
        /types.ts        # Type definitions
  /components            # Shared components
    /custom              # Custom application components
    /ui                  # Shadcn UI components
  /lib                   # Shared utilities
    /utils.ts            # Utility functions
```

### Routing

- Pages are defined in the `/src/app` directory following Next.js App Router conventions
- Dynamic routes use parameter segments like `/[paramName]`
- Each route has a default export React component

### Component Architecture

- **UI Components**: Based on Shadcn UI in `/components/ui`
- **Custom Components**: Application-specific in `/components/custom`
- **Feature Components**: Domain-specific in `/app/features/[feature]/components`

## Working with the Codebase

### Creating New Pages

1. Create a new directory in `/src/app` with the route name
2. Add a `page.tsx` file with a default export React component
3. For dynamic routes, use bracket notation: `[paramName]`

### Styling Approach

The project uses Tailwind CSS with Shadcn UI component variants:

```tsx
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Apply button styling to a link with conditional classes
<Link href="/path" className={cn(
  buttonVariants({ variant: 'outline' }),
  isActive ? 'bg-accent' : ''
)}>
  Link Text
</Link>
```

### UI Components with Shadcn

Shadcn UI is used for consistent, accessible UI components:

- Components are installed as needed: `npx shadcn-ui@latest add [component-name]`
- Each component can be customized in the `components/ui` directory
- Components are imported from `@/components/ui/[component-name]`
- Variants can be used to maintain consistent styling across the application

## Common Tasks

### Adding a New Feature

1. Create a new directory in `/src/app/features`
2. Create subdirectories for components and other feature-specific code
3. Add type definitions in a `types.ts` file
4. Create corresponding page routes in `/src/app`

### Adding New UI Components

1. For Shadcn components: `npx shadcn-ui@latest add [component-name]`
2. For custom components: Create in `/src/components/custom`
3. For feature-specific: Add to the feature's components directory

### Image Management

- Store static assets in the `/public` directory
- Reference images using root-relative paths: `/image-name.jpg`
- Ensure consistent naming conventions for images