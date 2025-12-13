import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ImportStudentsClient } from '../import-students-client';

type Props = {
  params: Promise<{
    id: string;
    classId: string;
  }>;
};

export default async function ImportStudentsPage({ params }: Props) {
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
  });

  if (!classData || classData.schoolId !== id) {
    notFound();
  }

  return (
    <ImportStudentsClient
      school={school}
      classData={classData}
    />
  );
}
