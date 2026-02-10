# Umar Zeb — Portfolio Backend

A full-stack personal portfolio website with an admin dashboard, built for **Umar Zeb (AI Engineer)**.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Prisma ORM
- **Auth:** NextAuth (cookie-based)
- **Email:** Resend
- **Validation:** Zod + React Hook Form

## Project Structure

```
app/
├── page.tsx                    # Redirects to portfolio.html
├── layout.tsx                  # Root layout (metadata: "Umar Zeb - AI Engineer")
├── globals.css                 # Global styles (dark theme, glass, gradients)
├── login/page.tsx              # Login page
├── dashboard/
│   ├── layout.tsx              # Dashboard layout (auth-protected)
│   ├── page.tsx                # Dashboard home
│   ├── blog/
│   │   ├── page.tsx            # Blog management
│   │   └── new/page.tsx        # Create new blog post
│   ├── messages/page.tsx       # Contact form messages
│   ├── analytics/page.tsx      # Analytics dashboard
│   └── settings/page.tsx       # Settings page
├── api/
│   ├── auth/login/route.ts     # Login endpoint
│   ├── auth/logout/route.ts    # Logout endpoint
│   ├── blog/route.ts           # Blog CRUD API
│   ├── contact/route.ts        # Contact form API
│   ├── analytics/route.ts      # Analytics API
│   └── settings/route.ts       # Settings API

lib/
├── auth.ts                     # Auth middleware
├── db.ts                       # Prisma client instance
└── utils.ts                    # Utility functions

prisma/
└── schema.prisma               # Database schema

public/
└── portfolio.html              # Main portfolio landing page (static HTML)
```

## Design System

- **Theme:** Dark mode (`#020617` background)
- **Primary:** `#6366f1` (Indigo)
- **Secondary:** `#8b5cf6` (Purple)
- **Accent:** `#06b6d4` (Cyan)
- **Effects:** Glass morphism, gradient text, animated SVG logo, grid patterns
- **Fonts:** Inter (body), JetBrains Mono (monospace/code)

## Features

### Public
- Portfolio landing page with hero, research, systems, publications, open source, blog, and contact sections
- Animated SVG monogram logo (UZ)
- Mobile-responsive navbar with hamburger menu
- Footer with CTA banner, multi-column layout, social links, tech stack badges, and terminal widget
- Contact form (sends emails via Resend)

### Admin Dashboard (Auth Protected)
- Blog post management (create, edit, delete)
- Contact message inbox
- Analytics overview
- Site settings

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
RESEND_API_KEY=your_resend_key
```

## Build History

1. Initial full-stack portfolio build
2. Homepage portfolio setup
3. Login with Prisma + error handling
4. Auth middleware for dashboard protection
5. Frontend-backend API integration
6. Hero section spacing
7. Mobile-responsive dashboard
8. Mobile navbar with hamburger menu
9. Animated SVG logo redesign
10. Footer redesign with CTA, terminal widget, and multi-column layout
