<div align="center">

# 📸 Snap-Self

<p><strong>Plataforma SaaS all-in-one para fotógrafos profissionais — com IA, galerias inteligentes e pagamentos integrados.</strong></p>

<img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-3b82f6?style=for-the-badge" />
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-3982FE?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/AI%20Powered-A855F7?style=for-the-badge&logoColor=white" />

</div>

---

## 📋 Overview

**Snap-Self** is a comprehensive SaaS platform designed for professional photographers. It combines **AI-powered photo analysis**, **client gallery management**, **school photography workflows**, and **payment processing** into a single unified platform.

The platform supports two distinct operation modes:
- **Events Mode** — For weddings, portraits, corporate events, and general photography projects
- **School Mode** — A specialized workflow for school photography with student management, guided capture sessions, and contract handling

---

## ✨ Features

### 🤖 AI-Powered Analysis
- Automatic photo quality scoring (0–100)
- AI-generated tags and categorization
- Smart analysis using **Claude 3.5 Sonnet**, **GPT-4 Vision**, and **Gemini Pro**
- Metadata extraction (dimensions, format, date taken)

### 📁 Events Mode
- **Project Management** — Full lifecycle: Planning → In Progress → Editing → Delivered → Completed
- **Client CRM** — Store and manage client contacts, addresses, and project history
- **Professional Galleries** — Public/private galleries with custom slugs, passwords, expiration dates, watermarks, and download controls
- **Financial Tracking** — Budget, payments, and payment status per project

### 🎓 School Mode
- **School & Class Management** — Organize schools, grades, sections, and academic years
- **Student Import** — Bulk import from CSV/Excel with automatic parsing
- **Guided Photo Sessions** — Assisted capture workflow with alphabetical/custom student ordering and auto-advance
- **Session Progress** — Real-time tracking of photographed, pending, and absent students
- **Contract Management** — School contracts with payment tracking and delivery dates

### 💳 Payments
- **Stripe** integration
- **Mercado Pago** integration
- **PIX** support (Brazil)

### 🔐 Auth & Infrastructure
- Authentication via **Clerk** (OAuth, email/password)
- Role-based access: Photographer, Client, Admin
- Subscription plans: Free / Starter (R$39) / Professional (R$89) / Business (R$149)
- PostgreSQL + Prisma ORM
- Redis for caching
- MinIO (S3-compatible) for photo storage
- Docker Compose for local infrastructure

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js 15 Frontend                │
│                                                     │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Landing │  │Dashboard │  │  School Workflow   │ │
│  │  Page   │  │  (Stats) │  │ (Sessions/Import) │ │
│  └─────────┘  └──────────┘  └────────────────────┘ │
│                                                     │
│  Clerk Auth │ Zustand (State) │ React Query (Data) │
└────────────────────┬────────────────────────────────┘
                     │ API Routes
┌────────────────────▼────────────────────────────────┐
│              Next.js API Routes                      │
│                                                     │
│  /api/sessions    /api/schools    /api/students     │
│  /api/classes     /api/photos     (+ more)          │
└────────┬───────────────┬────────────────┬───────────┘
         │               │                │
┌────────▼───────┐ ┌─────▼─────┐ ┌───────▼────────┐
│  PostgreSQL    │ │   Redis   │ │  MinIO (S3)    │
│  (Prisma ORM)  │ │ (Cache)   │ │ (Photo Store)  │
└────────────────┘ └───────────┘ └────────────────┘
```

### Key Directories

```
snap-self/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Sign-in / Sign-up pages
│   │   ├── api/                 # API route handlers
│   │   │   ├── classes/
│   │   │   ├── schools/
│   │   │   ├── sessions/
│   │   │   └── students/
│   │   ├── dashboard/           # Main app dashboard
│   │   │   ├── school/          # School management
│   │   │   │   ├── [id]/classes/
│   │   │   │   │   └── [classId]/session/  # Photo sessions
│   │   │   │   └── students/
│   │   │   └── settings/
│   │   ├── page.tsx             # Landing page
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── layouts/             # Sidebar, etc.
│   │   └── ui/                  # Reusable UI (button, card, dialog...)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities (prisma client, toast, etc.)
│   └── middleware.ts            # Auth middleware (Clerk)
├── prisma/
│   └── schema.prisma            # Full database schema
├── docker-compose.yml           # PostgreSQL + Redis + MinIO
├── package.json
└── next.config.ts
```

---

## 🗄️ Database Models

| Model | Description |
|-------|-------------|
| **User** | Core user with profile, subscription plan, and mode settings |
| **Photo** | Uploaded photo with metadata, AI analysis, tags, and quality score |
| **Project** | Photography project (wedding, event, etc.) with budget and status |
| **Client** | Client CRM record linked to a photographer |
| **Gallery** | Public/private photo gallery with access controls |
| **School** | School record with contact and address info |
| **Class** | Class within a school (grade + section + year) |
| **Student** | Student record with authorization and payment status |
| **PhotoSession** | Guided capture session with progress tracking |
| **Contract** | School contract with financial and scheduling info |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for local database)
- A [Clerk](https://clerk.com) account (for authentication)

### 1. Clone & Install

```bash
git clone https://github.com/darthcode66/Snap-Self.git
cd Snap-Self

npm install
```

### 2. Start Infrastructure

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **MinIO** on port 9000 (console on 9001)

### 3. Configure Environment

```bash
cp .env.local.template .env.local
```

Fill in your values:

```env
# Database
DATABASE_URL="postgresql://postgres:dev_password@localhost:5432/snapself"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AIza...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

# Storage (MinIO)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=snapself-photos
```

### 4. Setup Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Sync schema to database
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix lint errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

---

## 🛒 Subscription Plans

| Plan | Price | Target |
|------|-------|--------|
| **Free** | R$ 0/mês | Getting started |
| **Starter** | R$ 39/mês | Solo photographers |
| **Professional** | R$ 89/mês | Active professionals |
| **Business** | R$ 149/mês | Studios & teams |

---

## 🔐 Security

- Authentication handled by **Clerk** (industry-standard, SOC 2 compliant)
- All secrets stored in environment variables
- `.env.local` is in `.gitignore`
- API routes protected by Clerk middleware
- Database access only through Prisma ORM (no raw SQL injection risk)

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 15, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| State | Zustand, React Query |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Storage | MinIO (S3-compatible) |
| Auth | Clerk |
| AI | Claude 3.5 Sonnet, GPT-4 Vision, Gemini Pro |
| Payments | Stripe, Mercado Pago |
| Containerization | Docker Compose |

---

## 👨‍💻 Author

**Pedro Marcandali** — [LinkedIn](https://www.linkedin.com/in/pedro-marcandali-6a72a028a/) | [GitHub](https://github.com/darthcode66)
