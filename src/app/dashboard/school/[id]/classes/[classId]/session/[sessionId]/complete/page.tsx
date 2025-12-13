import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SessionCompleteClient } from './session-complete-client';

type Props = {
  params: Promise<{
    id: string;
    classId: string;
    sessionId: string;
  }>;
};

export default async function SessionCompletePage({ params }: Props) {
  const { id, classId, sessionId } = await params;
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const school = await prisma.school.findUnique({
    where: { id },
  });

  if (!school || school.photographerId !== user.id) {
    notFound();
  }

  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: {
      class: {
        include: {
          school: true,
        },
      },
      photos: true,
    },
  });

  if (!session || session.classId !== classId) {
    notFound();
  }

  if (session.photographerId !== user.id) {
    notFound();
  }

  return (
    <SessionCompleteClient
      school={school}
      session={session}
      classData={session.class}
    />
  );
}
