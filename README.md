# 📸 Snap-Self - Application

> Sistema Inteligente para Fotógrafos - Plataforma all-in-one com IA

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- Docker & Docker Compose ([Download](https://www.docker.com/))
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/snap-self-app.git
cd snap-self-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start database and services
docker compose up -d

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
snap-self-app/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Authentication routes
│   │   ├── (dashboard)/  # Dashboard routes
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ui/           # UI components (buttons, cards, etc)
│   │   ├── forms/        # Form components
│   │   ├── layouts/      # Layout components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Utility libraries
│   │   └── prisma.ts     # Prisma client
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static files
└── docker-compose.yml    # Docker services
```

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)

### Database & ORM
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Cache**: [Redis](https://redis.io/)

### State & Data Fetching
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Server State**: [TanStack Query](https://tanstack.com/query)

### AI & ML
- **Primary AI**: [Claude 3.5 Sonnet](https://www.anthropic.com/)
- **Vision AI**: [GPT-4 Vision](https://platform.openai.com/)
- **Classification**: [Gemini Pro](https://ai.google.dev/)

### Storage & CDN
- **Object Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- **CDN**: Cloudflare

### Payments
- **International**: [Stripe](https://stripe.com/)
- **Brazil**: [Mercado Pago](https://www.mercadopago.com.br/)

### Development Tools
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Type Checking**: TypeScript

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

## 🗄️ Database

### Local Development

The project uses Docker Compose to run PostgreSQL, Redis, and MinIO locally.

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
npm run db:push
```

### Prisma Studio

Visual database editor:

```bash
npm run db:studio
```

Open [http://localhost:5555](http://localhost:5555)

## 🎨 Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Format on save is recommended. VSCode settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🧪 Testing (Coming Soon)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/snap-self-app)

1. Push your code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Required for production:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Auth secret key
- `R2_ACCESS_KEY_ID` - Cloudflare R2 credentials
- `ANTHROPIC_API_KEY` - Claude API key
- `STRIPE_SECRET_KEY` - Stripe secret key

See `.env.example` for complete list.

## 📚 Documentation

For complete documentation, see the `/docs` directory in the root repository:

- [Business Strategy](../snap-self/ESTRATEGIA_DE_PRODUTO.md)
- [Technical Documentation](../snap-self/DOCUMENTACAO_TECNICA_2025.md)
- [Market Analysis](../snap-self/ANALISE_DE_MERCADO.md)
- [School Photography Use Case](../snap-self/CASO_DE_USO_FOTOGRAFIA_ESCOLAR.md)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and guidelines.

## 👥 Team

**Original Developers (SENAI 2024)**:
- Pedro Henrique Alves Marcandali
- Gabriel Aparecido Lopes Campos
- Henrique de Araújo Vaccari
- Otávio Miurim da Silva

**Advisor**: Prof. Luiz Rodolfo Barreto da Silva

## 📝 License

Proprietary. All rights reserved.

This is an academic project with commercial potential. Contact the developers for partnerships or investments.

## 🔗 Links

- [Website (Coming Soon)](https://snapself.com.br)
- [Documentation](../snap-self/)
- [Issue Tracker](https://github.com/your-org/snap-self-app/issues)

---

**Built with ❤️ for professional photographers in Brazil** 🇧🇷
