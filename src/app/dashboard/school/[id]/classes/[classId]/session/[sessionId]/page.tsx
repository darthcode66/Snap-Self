import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { SessionCaptureClient } from './session-capture-client';

type Props = {
  params: Promise<{
    id: string;
    classId: string;
    sessionId: string;
  }>;
};

export default async function SessionCapturePage({ params }: Props) {
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
          students: {
            orderBy: { sortName: 'asc' },
          },
        },
      },
      photos: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!session || session.classId !== classId) {
    notFound();
  }

  if (session.photographerId !== user.id) {
    notFound();
  }

  // If session is completed, redirect to completion page
  if (session.status === 'COMPLETED') {
    redirect(
      `/dashboard/school/${id}/classes/${classId}/session/${sessionId}/complete`
    );
  }

  return (
    <SessionCaptureClient
      school={school}
      session={session}
      classData={session.class}
    />
  );
}
