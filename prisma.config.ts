import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma 7 não carrega .env automaticamente; Next.js usa .env.local
config({ path: ['.env.local', '.env'], quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // process.env (e não env()) para `prisma generate` funcionar sem banco configurado
    url: process.env.DATABASE_URL ?? '',
  },
});
