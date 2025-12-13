import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SessionSetupClient } from './session-setup-client';

type Props = {
  params: Promise<{
    id: string;
    classId: string;
  }>;
};

export default async function SessionSetupPage({ params }: Props) {
  const { id, classId } = await params;
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

  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      students: {
        orderBy: { sortName: 'asc' },
      },
    },
  });

  if (!classData || classData.schoolId !== id) {
    notFound();
  }

  return (
    <SessionSetupClient
      school={school}
      classData={classData}
    />
  );
}
