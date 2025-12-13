# 📋 Plano de Desenvolvimento - Snap-Self

**Início**: 13 de Dezembro de 2025
**Abordagem**: Híbrida (UI + Backend incremental)
**Prioridade**: Modo Escola (Funcionalidade Principal)

---

## 🎯 Objetivos

### Objetivo Geral
Criar sistema completo de gestão de fotografia escolar com:
- Importação de listas de alunos
- Sessão fotográfica assistida
- Nomenclatura automática
- Alertas de pagamento/autorização

### Objetivo MVP (2 semanas)
Sistema funcional para uma escola fotografar alunos de forma organizada.

---

## 📊 Arquitetura Escolhida

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js Server Actions + API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: Clerk

### Storage
- **Fotos**: Cloudflare R2 (futuro)
- **Excel**: Processamento local → banco

---

## 🗓️ Cronograma Detalhado

### Semana 1: Foundation + UI

#### Dia 1 (13/12) - Setup Completo
- [x] Criar plano de desenvolvimento
- [ ] Configurar Clerk (autenticação)
- [ ] Configurar Neon (banco de dados)
- [ ] Configurar Prisma
- [ ] Testar conexão banco
- [ ] Commit: "feat: setup authentication and database"

#### Dia 2 (14/12) - Layout Base
- [ ] Criar layout do dashboard
- [ ] Implementar sidebar
- [ ] Implementar navbar
- [ ] Criar sistema de rotas protegidas
- [ ] Commit: "feat: add dashboard layout and navigation"

#### Dia 3 (15/12) - Componentes UI
- [ ] Instalar Shadcn/ui
- [ ] Criar componentes base (Button, Input, Card)
- [ ] Criar componente Table
- [ ] Criar componente Dialog/Modal
- [ ] Criar componente FileUpload
- [ ] Commit: "feat: add UI component system"

#### Dia 4-5 (16-17/12) - Telas Modo Escola (Visual)
- [ ] Tela: Dashboard Escolar
- [ ] Tela: Listar Escolas
- [ ] Tela: Cadastrar Escola
- [ ] Tela: Listar Turmas
- [ ] Tela: Listar Alunos
- [ ] Tela: Importar Excel (UI)
- [ ] Mock data para visualização
- [ ] Commit: "feat: add school mode UI screens"

### Semana 2: Conectar Backend

#### Dia 6 (18/12) - CRUD Escolas
- [ ] API: Criar escola
- [ ] API: Listar escolas
- [ ] API: Editar escola
- [ ] API: Deletar escola
- [ ] Conectar frontend com APIs
- [ ] Commit: "feat: implement school CRUD operations"

#### Dia 7 (19/12) - CRUD Turmas
- [ ] API: Criar turma
- [ ] API: Listar turmas por escola
- [ ] API: Editar turma
- [ ] API: Deletar turma
- [ ] Conectar frontend
- [ ] Commit: "feat: implement class management"

#### Dia 8 (20/12) - Importação Excel
- [ ] Instalar xlsx library
- [ ] API: Upload e parse Excel
- [ ] Validação de dados
- [ ] Criar turmas + alunos em batch
- [ ] UI de progresso
- [ ] Commit: "feat: implement Excel import for students"

#### Dia 9 (21/12) - Sessão Assistida (Básico)
- [ ] Tela de sessão fotográfica
- [ ] Lista ordenada de alunos
- [ ] Botões: Fotografado, Ausente, Próximo
- [ ] Progresso visual
- [ ] Salvar estado da sessão
- [ ] Commit: "feat: implement basic photo session interface"

#### Dia 10 (22/12) - Polish + Testes
- [ ] Melhorar UX/UI
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Testar fluxo completo
- [ ] Documentar uso
- [ ] Commit: "polish: improve UX and add error handling"

---

## 📁 Estrutura de Arquivos

```
snap-self-app/
├── docs/
│   ├── DEVELOPMENT_PLAN.md        # Este arquivo
│   ├── API_DOCUMENTATION.md       # Docs de APIs (criar)
│   └── COMPONENTS.md              # Docs de componentes (criar)
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/          # Login (Clerk)
│   │   │   └── sign-up/          # Registro (Clerk)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx        # Layout com sidebar
│   │   │   ├── page.tsx          # Dashboard principal
│   │   │   └── school/           # Rotas do modo escola
│   │   │       ├── page.tsx      # Listar escolas
│   │   │       ├── new/          # Cadastrar escola
│   │   │       ├── [id]/         # Detalhes da escola
│   │   │       │   ├── page.tsx
│   │   │       │   ├── classes/  # Turmas
│   │   │       │   └── import/   # Importar alunos
│   │   │       └── session/      # Sessão assistida
│   │   │           └── [id]/
│   │   └── api/
│   │       ├── schools/          # CRUD escolas
│   │       ├── classes/          # CRUD turmas
│   │       ├── students/         # CRUD alunos
│   │       └── import/           # Upload Excel
│   │
│   ├── components/
│   │   ├── ui/                   # Shadcn components
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navbar.tsx
│   │   └── features/
│   │       └── school/
│   │           ├── SchoolList.tsx
│   │           ├── SchoolForm.tsx
│   │           ├── ClassList.tsx
│   │           ├── StudentList.tsx
│   │           ├── ExcelImport.tsx
│   │           └── PhotoSession.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── clerk.ts              # Helpers Clerk
│   │   └── excel.ts              # Parse Excel
│   │
│   └── types/
│       └── school.ts             # Types do modo escola
│
└── prisma/
    └── schema.prisma             # Já criado
```

---

## 🔐 Configuração de Segurança

### Variáveis de Ambiente

Adicionar ao `.env.local`:

```env
# Clerk (Autenticação)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon (Database)
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Proteção de Rotas

Todas as rotas `/dashboard/*` precisam de autenticação.

---

## 📚 Documentação de Desenvolvimento

### Convenções de Código

**Commits** (Conventional Commits):
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

**Branches**:
- `main` - Produção
- `develop` - Desenvolvimento
- `feature/nome-feature` - Features
- `fix/nome-bug` - Correções

**Nomenclatura**:
- Componentes: PascalCase (`SchoolList.tsx`)
- Funções: camelCase (`createSchool()`)
- Constantes: UPPER_SNAKE_CASE (`MAX_STUDENTS`)
- Arquivos: kebab-case (exceto componentes)

### Padrões de Componentes

```typescript
// Sempre tipar props
interface ComponentProps {
  prop1: string;
  prop2?: number; // opcional
}

// Componente funcional
export function Component({ prop1, prop2 }: ComponentProps) {
  // ...
}

// Sempre exportar como named export (não default)
```

### Padrões de API

```typescript
// API Route
export async function POST(req: Request) {
  try {
    // 1. Validar input
    const body = await req.json();
    const validated = schema.parse(body);

    // 2. Verificar autenticação
    const { userId } = auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    // 3. Lógica
    const result = await prisma.school.create({ data: validated });

    // 4. Retornar
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Message' }, { status: 500 });
  }
}
```

---

## 🧪 Testes (Futuro)

Para cada feature implementada, documentar:
- [ ] Teste manual (checklist)
- [ ] Casos de erro testados
- [ ] Performance testada

**Ferramentas futuras**:
- Vitest (unit tests)
- Playwright (E2E tests)

---

## 📊 Métricas de Sucesso

### MVP (Semana 2)
- [ ] Criar escola ✅
- [ ] Criar turma ✅
- [ ] Importar 30 alunos via Excel ✅
- [ ] Sessão assistida funcionando ✅
- [ ] Marcar alunos como fotografados ✅
- [ ] Ver progresso da sessão ✅

### Performance
- [ ] Página carrega em < 2s
- [ ] Importar 100 alunos em < 5s
- [ ] Sessão com 50 alunos sem lag

---

## 🚨 Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Clerk complexo demais | Baixa | Médio | Documentação + exemplos |
| Excel parse falhar | Média | Alto | Validação robusta + exemplos |
| Performance ruim | Baixa | Médio | Pagination + lazy loading |
| Tempo insuficiente | Média | Alto | Priorizar features core |

---

## 📝 Notas de Desenvolvimento

### Decisões Importantes

**Por que Clerk em vez de NextAuth?**
- Setup mais rápido (10min vs 3h)
- UI pronta e bonita
- Suporte comercial
- Podemos migrar depois se necessário

**Por que Neon em vez de Docker local?**
- Sempre disponível
- Fácil de compartilhar
- Free tier generoso (512MB)
- Mais próximo de produção

**Por que Shadcn/ui?**
- Componentes copiáveis (não biblioteca)
- Customizável 100%
- Tailwind CSS native
- Melhor DX

---

## ✅ Checklist Pré-Desenvolvimento

Antes de começar cada dia:
- [ ] Pull latest code
- [ ] Verificar dependências atualizadas
- [ ] Ler plano do dia
- [ ] Criar branch de feature

Após terminar cada dia:
- [ ] Commit com mensagem descritiva
- [ ] Push para GitHub
- [ ] Atualizar este documento
- [ ] Documentar decisões importantes

---

## 🔗 Links Úteis

- [Clerk Docs](https://clerk.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Última atualização**: 13/12/2025 - 22:30
**Próximo passo**: Configurar Clerk
