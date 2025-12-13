# 🔐 Setup Clerk - Autenticação

**Data**: 13/12/2025
**Status**: ✅ Instalado / ⏸️ Aguardando chaves

---

## 📦 O que foi feito

### 1. Instalação
```bash
npm install @clerk/nextjs
```

### 2. Arquivos criados/modificados

#### `src/middleware.ts` (NOVO)
- Middleware para proteger rotas
- Todas as rotas exceto `/`, `/sign-in`, `/sign-up` precisam de autenticação

#### `src/app/layout.tsx` (MODIFICADO)
- Adicionado `ClerkProvider`
- Configurado localização PT-BR

#### `.env.local.template` (NOVO)
- Template das variáveis de ambiente necessárias

---

## 🔑 Como obter as chaves do Clerk

### Passo 1: Criar conta
1. Acesse: https://clerk.com/
2. Clique em "Start building for free"
3. Faça login com Google ou GitHub

### Passo 2: Criar aplicação
1. Clique em "Create application"
2. **Name**: `Snap-Self`
3. **Authentication methods**:
   - ✅ Email
   - ✅ Google (opcional, mas recomendado)
4. Clique em "Create application"

### Passo 3: Copiar chaves
Você verá uma tela com as chaves:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**IMPORTANTE**: Copie essas chaves!

---

## ⚙️ Configuração

### 1. Criar arquivo `.env.local`

```bash
cp .env.local.template .env.local
```

### 2. Editar `.env.local`

Substitua as chaves:

```env
# Clerk (Autenticação)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
CLERK_SECRET_KEY=sk_test_SUA_CHAVE_AQUI

# URLs do Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
HOSTNAME=localhost
PORT=3000
```

### 3. Reiniciar servidor

```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

---

## 🧪 Testar

Depois de configurar, teste:

1. Acesse: http://localhost:3000/dashboard
2. Você deve ser redirecionado para `/sign-in`
3. Crie uma conta ou faça login
4. Deve redirecionar para `/dashboard`

---

## 📁 Estrutura de rotas (a criar)

```
src/app/
├── (auth)/              # Rotas de autenticação (públicas)
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx
└── (dashboard)/         # Rotas protegidas (precisam de login)
    ├── layout.tsx       # Layout com sidebar
    └── page.tsx         # Dashboard principal
```

---

## 🎨 Customização (futuro)

Clerk permite customização via:
- `appearance` prop no ClerkProvider
- Temas personalizados
- CSS customizado

Exemplo:
```tsx
<ClerkProvider
  localization={ptBR}
  appearance={{
    variables: {
      colorPrimary: '#0ea5e9', // primary-600
    },
  }}
>
```

---

## 🔒 Segurança

### Variáveis de Ambiente

- ✅ `.env.local` está no `.gitignore` (nunca fazer commit!)
- ✅ `NEXT_PUBLIC_*` são públicas (podem ir pro frontend)
- ✅ Sem `NEXT_PUBLIC_` são privadas (só backend)

### Middleware

O middleware protege automaticamente:
- `/dashboard/*` - Precisa de login
- `/api/*` (exceto `/api/webhooks/*`)

Rotas públicas:
- `/` - Landing page
- `/sign-in` - Login
- `/sign-up` - Registro

---

## 📚 Recursos

- [Clerk Docs](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)

---

## ✅ Checklist

- [x] Clerk instalado
- [x] Middleware criado
- [x] Layout configurado
- [x] Template .env criado
- [ ] Chaves do Clerk adicionadas
- [ ] .env.local criado
- [ ] Servidor reiniciado
- [ ] Teste de login funcionando

---

**Próximo passo**: Criar as páginas de sign-in e sign-up
