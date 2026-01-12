# Small Business CRM & Sales Dashboard

## Overview

A lightweight CRM system designed for a small sugar-selling company that delivers products to local cafés. The application provides a dashboard for sales overview, client management, invoice tracking, and delivery management. Built as a full-stack TypeScript application with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Charts**: Recharts for data visualization on the dashboard
- **Animations**: Framer Motion for smooth UI transitions
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in a shared routes contract (`shared/routes.ts`)
- **Validation**: Zod schemas for request/response validation, shared between client and server

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for database migrations (`drizzle-kit push`)

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # UI components including shadcn/ui
│       ├── hooks/        # Custom React hooks for data fetching
│       ├── pages/        # Route page components
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared types and contracts
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
└── migrations/       # Database migrations
```

### Key Design Patterns
- **Shared Schema**: Database schema and validation schemas are defined once in `shared/` and used by both frontend and backend
- **Type-safe API**: Route contracts in `shared/routes.ts` define endpoints, methods, and response types
- **Repository Pattern**: `storage.ts` abstracts all database operations behind an interface
- **Component-based UI**: Modular React components with shadcn/ui for consistent design

### Build System
- **Development**: Vite dev server with HMR for frontend, tsx for backend
- **Production**: esbuild bundles the server, Vite builds the frontend
- **Output**: `dist/` directory contains built server and `dist/public/` for static assets

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for Express (if sessions are needed)

### Core Libraries
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **zod**: Runtime type validation for API requests/responses
- **@tanstack/react-query**: Async state management and caching

### UI Framework
- **Radix UI**: Headless component primitives (dialogs, dropdowns, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Data Visualization
- **recharts**: Chart library for dashboard analytics
- **date-fns**: Date formatting and manipulation