# 🚀 Getting Started with Snap-Self

Welcome to Snap-Self development! This guide will get you up and running in minutes.

## ✅ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **Docker Desktop** installed and running ([Download](https://www.docker.com/))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] A code editor (VS Code recommended)

## 📦 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages. It may take a few minutes.

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your configuration. For local development, the defaults should work fine.

**Required for basic functionality:**
```env
DATABASE_URL="postgresql://postgres:dev_password@localhost:5432/snapself"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
```

### 3. Start Development Services

```bash
docker compose up -d
```

This starts:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- MinIO storage (port 9000)

**Verify services are running:**
```bash
docker compose ps
```

All services should show "Up" status.

### 4. Initialize Database

```bash
npm run db:push
```

This creates all database tables based on the Prisma schema.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Snap-Self landing page! 🎉

## 🎯 What's Next?

### Explore the Codebase

```
snap-self-app/
├── src/app/              # Pages and routes
│   ├── page.tsx          # Home page (start here!)
│   ├── layout.tsx        # Root layout
│   └── api/              # API endpoints
├── src/components/       # React components
├── src/lib/              # Utilities
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
└── README.md             # Full documentation
```

### Create Your First Feature

Let's create a simple "Hello" API endpoint:

**1. Create API route:**

`src/app/api/hello/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Snap-Self!',
    timestamp: new Date().toISOString(),
  });
}
```

**2. Test it:**

Open [http://localhost:3000/api/hello](http://localhost:3000/api/hello)

You should see:
```json
{
  "message": "Hello from Snap-Self!",
  "timestamp": "2025-01-..."
}
```

### Use Prisma Studio

Visual database editor:

```bash
npm run db:studio
```

Open [http://localhost:5555](http://localhost:5555)

You can view and edit database records here.

### Add Your First Component

**1. Create component:**

`src/components/ui/Badge.tsx`
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}
```

**2. Use it:**

In `src/app/page.tsx`:
```typescript
import { Badge } from '@/components/ui/Badge';

// ...in your component:
<Badge variant="success">New Feature!</Badge>
```

## 🛠️ Useful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
```

### Code Quality
```bash
npm run lint         # Check for errors
npm run lint:fix     # Fix errors automatically
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Database
```bash
npm run db:studio    # Open Prisma Studio
npm run db:push      # Update database schema
npm run db:generate  # Generate Prisma client
```

### Docker
```bash
docker compose up -d        # Start services
docker compose down         # Stop services
docker compose logs -f      # View logs
docker compose restart      # Restart services
```

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# Find process using port 3000
lsof -i :3000

# Kill process (replace PID)
kill -9 PID

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error

```bash
# Restart database
docker compose restart postgres

# Check if running
docker compose ps postgres

# View logs
docker compose logs postgres
```

### Cannot Find Module Error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Not Generated

```bash
npm run db:generate
```

## 📚 Learn More

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code standards
- Commit guidelines
- Pull request process

## 💬 Need Help?

- Check [README.md](README.md) for full documentation
- Create an issue on GitHub
- Ask the team on Discord (coming soon)

## ✨ You're All Set!

Your development environment is ready. Start building awesome features! 🚀

---

**Happy coding!** 💻
