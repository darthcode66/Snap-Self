// Uso: npx tsx check-db.mjs
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const schools = await prisma.school.findMany();
  console.log('Total schools:', schools.length);
  console.log('Schools:', JSON.stringify(schools, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
