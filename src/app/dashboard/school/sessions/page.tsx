import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { SessionsListClient } from './sessions-list-client';

export default async function SessionsPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const sessions = await prisma.photoSession.findMany({
    where: {
      photographerId: user.id,
    },
    include: {
      class: {
        include: {
          school: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <SessionsListClient sessions={sessions} />;
}
