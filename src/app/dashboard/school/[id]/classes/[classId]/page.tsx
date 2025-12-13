import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ClassDetailClient } from './class-detail-client';

type Props = {
  params: Promise<{
    id: string;
    classId: string;
  }>;
};

export default async function ClassDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const { id, classId } = resolvedParams;
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
      _count: {
        select: { students: true, sessions: true },
      },
    },
  });

  if (!classData || classData.schoolId !== id) {
    notFound();
  }

  return (
    <ClassDetailClient
      school={school}
      classData={classData}
    />
  );
}
