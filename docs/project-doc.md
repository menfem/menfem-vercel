# Project Documentation

## 0. Setup

### Project Initialization

- Initialize with `npx create-next-app@latest`

### Next.js Configuration

- Create `next.config.js` for build settings
- For testing caching behavior:

  ```javascript
  import type { NextConfig } from 'next'

  const nextConfig: NextConfig = {
    experimental: { dynamicIO: true },
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
  }

  export default nextConfig
  ```

- Build and start: `npm run build` then `npm start`
- **Note:** Fix errors instead of ignoring them for production code

### Code Formatting

- Add `.prettierrc` to root:
  ```json
  {
    "singleQuote": true,
    "semi": false
  }
  ```
- Install: `npm install --save-dev prettier`
- Add scripts to package.json:
  ```json
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
  ```

### Animations

- Tailwind CSS v4 uses a "CSS-first" approach to animations
- Define animations in your main CSS file using the `@theme` directive:

  ```css
  @import 'tailwindcss';

  @theme {
    /* Define the animation with timing and easing */
    --animate-your-animation-name: your-animation-name 0.5s ease-out;

    /* Define the keyframes */
    @keyframes your-animation-name {
      from {
        opacity: 0;
        transform: translateY(-16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  ```

- Apply animation in components:
  ```jsx
  <div className="animate-your-animation-name">Your content here</div>
  ```
- Optional: Configure in `tailwind.config.ts` for IDE support:
  ```typescript
  const config: Config = {
    theme: {
      extend: {
        keyframes: {
          'your-animation-name': {
            from: { opacity: 0, transform: 'translateY(-16px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        },
        animation: {
          'your-animation-name': 'your-animation-name 0.5s ease-out',
        },
      },
    },
  }
  ```
- Key points:
  - Add `forwards` to maintain final state: `0.5s ease-out forwards`
  - Use percentage keyframes for complex animations: `0%`, `50%`, `100%`
  - CSS-first approach gives more flexibility
  - Animation names in CSS must match class names (prefixed with `animate-`)

### Image Management

- Use the `/public` directory for static assets
- Files placed in `/public` are accessible at the root URL path
- Image handling approaches:
  - Create placeholder SVGs for prototyping
  - Use real images with consistent naming conventions (e.g., `make-model.jpg`)
  - Reference images in data files to match with components
- Link images in sample data:
  ```javascript
  // Pattern for referencing images
  imageUrl: '/image-name.jpg' // Accessible at http://localhost:3000/image-name.jpg
  ```
- Fallback to placeholders when specific images aren't available

### UI Components with Shadcn

- Use Shadcn UI for consistent, accessible component library
- Installation process:
  ```bash
  # Initialize Shadcn UI
  npx shadcn-ui@latest init
  ```
- Configuration options:
  - Style: Default (or customize)
  - Base color: Slate (or choose another)
  - Global CSS: `app/globals.css`
  - CSS variables: Yes
  - React Server Components: Yes
  - Components directory: `components/ui`
- Install individual components as needed:
  ```bash
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add dialog
  # etc.
  ```
- Use in components:

  ```jsx
  import { Button } from '@/components/ui/button'

  function MyComponent() {
    return <Button>Click me</Button>
  }
  ```

- Customize components in `components/ui` directory as needed

### Using Shadcn Component Variants

- Each Shadcn component exports a `{component}Variants` function for styling
- Use these variant functions for consistent styling of non-component elements
- Example with Button variants:

  ```jsx
  import { buttonVariants } from '@/components/ui/button'
  import Link from 'next/link'

  function NavLink({ href, children }) {
    // Apply button styling to a Link component
    return (
      <Link href={href} className={buttonVariants({ variant: 'default' })}>
        {children}
      </Link>
    )
  }
  ```

- Common variant options:
  - `variant`: 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'
  - `size`: 'default', 'sm', 'lg', 'icon'
- Combine multiple options:
  ```jsx
  className={buttonVariants({
    variant: 'outline',
    size: 'sm',
  })}
  ```
- Use with conditional classes:
  ```jsx
  className={cn(
    buttonVariants({ variant: 'ghost' }),
    isActive ? 'bg-accent' : ''
  )}
  ```

### Routing Structure

- Use Next.js file-based routing
- Each route has a `page.tsx` file with a default export
- Structure:
  - Static routes: `/about`, `/contact`
  - Dynamic routes: `/products/[id]`, `/blog/[slug]`
  - Catch-all routes: `/docs/[...slug]`
- Use TypeScript interfaces for route parameters

### Route Constants

- Create `src/config/routes.ts` for centralized path definitions
- Use with Link components instead of hardcoded strings
- Example: `ROUTES.PRODUCTS.DETAIL(productId)` instead of `` `/products/${productId}` ``

### Database Connection with Supabase

- Use Supabase as the PostgreSQL database provider
- Set up connection pooling with PgBouncer for efficient database connections
- Create a `.env` file in the project root with the following variables:

  ```
  # Supabase Database Connection
  DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
  DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:5432/postgres"
  ```

- Connection details:
  - `DATABASE_URL`: Main connection string with PgBouncer enabled (`pgbouncer=true`)
  - `DIRECT_URL`: Direct connection for database migrations (bypasses PgBouncer)
  - Port `6543` is used for connection pooling
  - Port `5432` is used for direct connections

- Install Prisma as a development dependency:
  ```bash
  npm install prisma --save-dev
  ```

- Initialize Prisma in your project:
  ```bash
  npx prisma init
  ```
  This command will:
  - Create a `prisma` directory in your project
  - Generate a `schema.prisma` file with a basic configuration

- Add a postinstall script to package.json for Vercel deployments:
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```
  This ensures the Prisma Client is generated during deployment when Vercel runs `npm install`.

- Configure Prisma to use both connection strings:
  ```prisma
  // prisma/schema.prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }
  ```

- Add `.env` to `.gitignore` to prevent committing sensitive credentials
- Create a `.env.example` file with placeholder values for reference:
  ```
  # Supabase Database Connection
  DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
  DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
  ```

- Initialize database connection in your application:
  ```typescript
  // lib/db.ts
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```

- Import and use the Prisma client in your application:
  ```typescript
  import { prisma } from '@/lib/db'

  // Example query
  const users = await prisma.user.findMany()
  ```

### Sample Data

- Create `src/data/data.ts` with typed mock data
- Define interfaces for all data structures
- Export sample data arrays for development

## 1. Project Structure

### Source Folder (`src/`)

- Contains all implementation code to be compiled
- May include additional reusable files and folders for the entire application

### App Folder (`src/app/`)

- Defines all pages and layouts following Next.js App Router convention
- Page components are lightweight with only context-specific elements
- Organized in folders corresponding to routes:
  - `app/page.tsx` (home page)
  - `app/about/page.tsx`
  - `app/products/page.tsx`
  - `app/products/[id]/page.tsx`

### Features Folder (`src/app/features/`)

- Contains domain or feature-specific logic extracted from page components
- Each feature is scoped to one business domain (e.g., `ticket/`, `comment/`, `user/`)
- Features contain related components, constants, types, and utilities
- Features may have dependencies on each other

### Components Folder (`src/components/`)

- Contains components used across multiple pages and features

#### Custom Components (`src/components/custom/`)

- Components created specifically for the application
- Examples: header, navigation, layout components

#### UI Components (`src/components/ui/`)

- Components initialized with Shadcn
- Can be used directly or through their variants
- Can be customized as needed

### Future Growth

- Add new pages to the `app` folder, including nested routes
- Add reusable components to both custom and UI component folders
- Create additional feature folders for new entities
- Include more application-wide utilities in the top-level source folder

## 2. Technologies & Dependencies

_To be filled in with technology stack information..._

## 3. Development Workflow

_To be filled in with development workflow information..._

## 4. Styling Approach

_To be filled in with styling guidelines and methodology..._

## 5. API Integration

_To be filled in with API integration details..._

## 6. Deployment

_To be filled in with deployment instructions..._

## 7. Testing

_To be filled in with testing strategy and tools..._

## 8. Performance Optimization

_To be filled in with performance optimization strategies..._

## 9. Accessibility

_To be filled in with accessibility guidelines..._

## 10. Documentation

_To be filled in with documentation standards..._
