import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const schools = await prisma.school.findMany();
  console.log('Total schools:', schools.length);
  console.log('Schools:', JSON.stringify(schools, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
