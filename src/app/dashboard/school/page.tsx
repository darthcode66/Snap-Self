import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { SchoolsClient } from './schools-client';

export default async function SchoolsPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const schools = await prisma.school.findMany({
    where: {
      photographerId: user.id,
    },
    include: {
      _count: {
        select: {
          classes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <SchoolsClient schools={schools} />;
}
