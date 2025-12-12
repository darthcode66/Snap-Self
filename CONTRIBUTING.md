# Contributing to Snap-Self

Thank you for your interest in contributing to Snap-Self! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

Be respectful, professional, and collaborative. We're all here to build something great.

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/snap-self-app.git
cd snap-self-app

# Add upstream remote
git remote add upstream https://github.com/original-org/snap-self-app.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your local settings
```

### 4. Start Development

```bash
# Start database
docker compose up -d

# Run migrations
npm run db:push

# Start dev server
npm run dev
```

## 🔄 Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch (default)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature Branch

```bash
# Ensure you're on develop
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes
2. Test thoroughly
3. Run linter and formatter:

```bash
npm run lint:fix
npm run format
npm run type-check
```

### Committing Changes

```bash
git add .
git commit -m "feat: add photo upload to events mode"
```

See [Commit Guidelines](#commit-guidelines) below.

## 📝 Coding Standards

### TypeScript

- **Always** use TypeScript, avoid `any`
- Define types for all function parameters and returns
- Use interfaces for objects, types for unions/intersections

```typescript
// ✅ Good
interface PhotoData {
  url: string;
  width: number;
  height: number;
}

function uploadPhoto(data: PhotoData): Promise<Photo> {
  // ...
}

// ❌ Bad
function uploadPhoto(data: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components small and focused

```typescript
// ✅ Good
'use client';

import { useState } from 'react';

interface PhotoUploaderProps {
  onUploadComplete: (photoId: string) => void;
}

export function PhotoUploader({ onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  // ...
}
```

### Naming Conventions

- **Components**: PascalCase (`PhotoUploader.tsx`)
- **Files**: kebab-case (`photo-utils.ts`)
- **Functions**: camelCase (`uploadPhoto`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`PhotoData`, `UploadOptions`)

### File Organization

```
src/components/
├── ui/              # Generic UI components
│   ├── Button.tsx
│   └── Card.tsx
├── forms/           # Form components
│   └── PhotoUploadForm.tsx
└── features/        # Feature-specific components
    ├── events/
    └── school/
```

### Imports Order

1. External libraries
2. Internal absolute imports
3. Relative imports

```typescript
// 1. External
import { useState } from 'react';
import { prisma } from '@prisma/client';

// 2. Internal absolute
import { Button } from '@/components/ui/Button';
import { uploadToR2 } from '@/lib/storage';

// 3. Relative
import { PhotoCard } from './PhotoCard';
```

## 📐 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(events): add photo upload to gallery"

# Bug fix
git commit -m "fix(school): correct student sorting algorithm"

# Documentation
git commit -m "docs: update API endpoints documentation"

# Refactor
git commit -m "refactor(auth): simplify login flow"

# Multiple changes
git commit -m "feat(school): add tethering support

- Implement camera connection
- Add auto-advance feature
- Update session UI

Closes #123"
```

### Scope

- `events` - Events mode features
- `school` - School mode features
- `core` - Core functionality
- `api` - API changes
- `ui` - UI components
- `db` - Database changes
- `auth` - Authentication

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch**

```bash
git checkout develop
git pull upstream develop
git checkout your-feature-branch
git rebase develop
```

2. **Run all checks**

```bash
npm run lint
npm run type-check
npm run build
```

3. **Test thoroughly**
   - Manual testing
   - Check different scenarios
   - Test on different screen sizes

### Submitting PR

1. Push your branch to your fork

```bash
git push origin feature/your-feature-name
```

2. Create PR on GitHub
   - Base: `develop`
   - Compare: `your-feature-branch`

3. Fill PR template with:
   - **Description**: What does this PR do?
   - **Changes**: Bullet list of changes
   - **Screenshots**: If UI changes
   - **Testing**: How to test
   - **Checklist**: Complete all items

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes
- Item 1
- Item 2

## Screenshots (if applicable)
[Add screenshots]

## How to Test
1. Step 1
2. Step 2

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Works on desktop
- [ ] Works on mobile
```

### Code Review

- Be open to feedback
- Respond to comments promptly
- Make requested changes
- Re-request review after updates

### Merging

- PRs require 1 approval from team member
- All checks must pass
- Squash and merge when approved

## 🧪 Testing (Coming Soon)

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Writing Tests

```typescript
// photo-utils.test.ts
import { describe, it, expect } from 'vitest';
import { generateFilename } from './photo-utils';

describe('generateFilename', () => {
  it('generates correct filename for student photo', () => {
    const result = generateFilename({
      prefix: 'SCHOOL_1A',
      number: 5,
      name: 'Ana Silva',
    });

    expect(result).toBe('SCHOOL_1A_005_Ana_Silva.jpg');
  });
});
```

## 🐛 Reporting Bugs

Use GitHub Issues with the bug template:

**Title**: Brief description

**Description**:
- What happened
- What you expected
- Steps to reproduce
- Screenshots (if applicable)
- Environment (OS, browser, Node version)

## 💡 Suggesting Features

Use GitHub Issues with the feature template:

**Title**: Feature name

**Description**:
- Problem it solves
- Proposed solution
- Alternatives considered
- Additional context

## 📞 Questions?

- Create a GitHub Discussion
- Join our Discord (coming soon)
- Email: dev@snapself.com.br

## 🙏 Thank You!

Every contribution helps make Snap-Self better for photographers everywhere!

---

**Happy Coding!** 💻✨
