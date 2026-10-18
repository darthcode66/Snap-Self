import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { AllStudentsClient } from './all-students-client';

export default async function StudentsPage() {
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

  // Get all students from all schools
  const students = await prisma.student.findMany({
    where: {
      class: {
        schoolId: {
          in: schools.map((s) => s.id),
        },
      },
    },
    include: {
      class: {
        include: {
          school: true,
        },
      },
      _count: {
        select: {
          photos: true,
        },
      },
    },
    orderBy: [
      { class: { school: { name: 'asc' } } },
      { class: { name: 'asc' } },
      { sortName: 'asc' },
    ],
  });

  return <AllStudentsClient students={students} />;
}
