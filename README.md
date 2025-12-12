<div align="center">

# 📸 Snap-Self

### Sistema Inteligente para Fotógrafos Profissionais

**Plataforma all-in-one com IA avançada para gestão completa de fotografia**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Demo](https://snapself.com.br) • [📖 Docs](../snap-self/) • [🐛 Report Bug](../../issues) • [✨ Request Feature](../../issues)

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 📸 Modo Eventos
- 🤖 **IA Avançada** - Análise automática de qualidade e categorização
- 🖼️ **Galerias Profissionais** - Templates elegantes para clientes
- 💳 **Pagamentos Integrados** - PIX, Cartão, Boleto (Stripe + Mercado Pago)
- 👥 **CRM Completo** - Gestão de clientes e projetos
- 📱 **Mobile-First** - PWA responsivo

</td>
<td width="50%">

### 🎓 Modo Escola
- 📋 **Importação Excel** - Liste de alunos automaticamente
- 🎯 **Sessão Assistida** - Ordem alfabética, quem é o próximo
- 📷 **Tethering** - Câmera conectada ao sistema
- 🏷️ **Nomenclatura Automática** - `001_Ana_Silva.jpg`
- ⚠️ **Alertas Visuais** - Pagou? Autorizou?

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker** & Docker Compose ([Download](https://www.docker.com/))
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/snap-self-app.git
cd snap-self-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Start database and services (PostgreSQL, Redis, MinIO)
docker compose up -d

# 5. Push database schema
npm run db:push

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### One-line Setup (with Docker)

```bash
git clone https://github.com/your-username/snap-self-app.git && cd snap-self-app && npm install && docker compose up -d && npm run db:push && npm run dev
```

## 🛠️ Tech Stack

<details>
<summary>Click to expand full stack</summary>

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19, App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Components**: [Lucide Icons](https://lucide.dev/)
- **State**: [Zustand](https://github.com/pmndrs/zustand) + [TanStack Query](https://tanstack.com/query)

### Backend
- **API**: Next.js API Routes + Server Actions
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)

### Database & Storage
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **Cache**: [Redis](https://redis.io/) (Upstash)
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/)

### AI & ML
- **Primary**: [Claude 3.5 Sonnet](https://www.anthropic.com/) (Anthropic)
- **Vision**: [GPT-4 Vision](https://platform.openai.com/) (OpenAI)
- **Classification**: [Gemini 2.0 Pro](https://ai.google.dev/)

### Payments
- **International**: [Stripe](https://stripe.com/)
- **Brazil**: [Mercado Pago](https://www.mercadopago.com.br/)

### DevOps
- **Hosting**: [Vercel](https://vercel.com/) (Serverless)
- **CDN**: [Cloudflare](https://www.cloudflare.com/)
- **Monitoring**: [Sentry](https://sentry.io/)
- **CI/CD**: GitHub Actions

</details>

## 📁 Project Structure

```
snap-self-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (dashboard)/        # Dashboard routes (Events + School modes)
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── forms/              # Form components
│   │   ├── layouts/            # Layout components
│   │   └── features/           # Feature-specific components
│   │       ├── events/         # Events mode components
│   │       └── school/         # School mode components
│   ├── lib/                    # Libraries and utilities
│   │   ├── prisma.ts           # Prisma client
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript type definitions
│   ├── hooks/                  # Custom React hooks
│   └── config/                 # Configuration files
├── prisma/
│   └── schema.prisma           # Database schema (Events + School models)
├── public/                     # Static files
└── docker-compose.yml          # Local development services
```

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Run production build

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors automatically
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Database
npm run db:studio        # Open Prisma Studio (visual DB editor)
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Create and run migrations
npm run db:seed          # Seed database with sample data
```

## 🗄️ Database

### Local Development with Docker

All required services are configured in `docker-compose.yml`:

```bash
# Start all services (PostgreSQL, Redis, MinIO)
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Reset database (⚠️ DELETES ALL DATA)
docker compose down -v && docker compose up -d && npm run db:push
```

### Prisma Studio

Visual database editor at [http://localhost:5555](http://localhost:5555):

```bash
npm run db:studio
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables (see `.env.example`)
4. Deploy!

### Environment Variables

Required for production:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."

# Storage (Cloudflare R2)
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."

# AI APIs
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."

# Payments
STRIPE_SECRET_KEY="sk_..."
MERCADOPAGO_ACCESS_TOKEN="..."
```

See [`.env.example`](.env.example) for complete list.

## 📚 Documentation

For complete documentation, visit the [`/snap-self`](../snap-self/) directory:

- 📋 [**Product Strategy**](../snap-self/ESTRATEGIA_DE_PRODUTO.md) - Unified strategy (Events + School modes)
- 📖 [**Technical Documentation**](../snap-self/DOCUMENTACAO_TECNICA_2025.md) - Complete tech specs
- 🎓 [**School Photography Use Case**](../snap-self/CASO_DE_USO_FOTOGRAFIA_ESCOLAR.md) - Real-world origin story
- 📊 [**Market Analysis**](../snap-self/ANALISE_DE_MERCADO.md) - Market research and projections
- 🔄 [**2024 vs 2025 Comparison**](../snap-self/COMPARACAO_2024_VS_2025.md) - Evolution from TCC to Startup

### Quick Links

- 🚀 [Getting Started Guide](GETTING_STARTED.md) - Step-by-step setup
- 🤝 [Contributing Guide](CONTRIBUTING.md) - How to contribute
- 📝 [License](LICENSE) - Proprietary license

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for:

- Code standards
- Commit conventions
- Pull request process
- Development workflow

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add awesome feature"

# 3. Push and create PR
git push origin feature/your-feature-name
```

## 👥 Team

**Original Developers** (SENAI 2024 TCC):
- Pedro Henrique Alves Marcandali
- Gabriel Aparecido Lopes Campos
- Henrique de Araújo Vaccari
- Otávio Miurim da Silva

**Advisor**: Prof. Luiz Rodolfo Barreto da Silva

## 📊 Project Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ Architecture         100% ██████████
   ✅ Documentation        100% ██████████
   ✅ Database Schema      100% ██████████
   🔨 MVP Development       15% ██░░░░░░░░
   ⏳ Beta Testing           0% ░░░░░░░░░░
   ⏳ Production Launch      0% ░░░░░░░░░░
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Phase: MVP Development
Next Milestone: Authentication + Core Features
Target: Q1 2026
```

## 🐛 Known Issues

See [Issues](../../issues) for known bugs and feature requests.

## 📝 License

**Proprietary**. All rights reserved.

This is an academic project with commercial potential. See [LICENSE](LICENSE) for details.

For partnerships or investments, contact the development team.

## 🔗 Links

- 🌐 **Website**: [snapself.com.br](https://snapself.com.br) (Coming Soon)
- 📧 **Email**: dev@snapself.com.br
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Discussions**: [GitHub Discussions](../../discussions)

## ⭐ Support

If you find this project useful, please consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting bugs** via Issues
- 💡 **Suggesting features** via Discussions
- 🤝 **Contributing** code

---

<div align="center">

**Built with ❤️ for professional photographers in Brazil** 🇧🇷

**From SENAI classroom to a real tech startup** 🚀

[⬆ Back to Top](#-snap-self)

</div>
