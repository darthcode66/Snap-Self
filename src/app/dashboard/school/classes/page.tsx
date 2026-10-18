import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AllClassesClient } from './all-classes-client';

export default async function ClassesPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Get all schools for this user
  const schools = await prisma.school.findMany({
    where: {
      photographerId: user.id,
    },
  });

  // Get all classes from all schools
  const classes = await prisma.class.findMany({
    where: {
      schoolId: {
        in: schools.map((s) => s.id),
      },
    },
    include: {
      school: true,
      _count: {
        select: {
          students: true,
          sessions: true,
        },
      },
    },
    orderBy: [
      { school: { name: 'asc' } },
      { grade: 'asc' },
      { section: 'asc' },
    ],
  });

  return <AllClassesClient classes={classes} />;
}
