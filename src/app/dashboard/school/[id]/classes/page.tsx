import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ClassesClient } from './classes-client';

type Props = {
  params: {
    id: string;
  };
};

export default async function ClassesPage({ params }: Props) {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const school = await prisma.school.findUnique({
    where: { id: params.id },
  });

  if (!school || school.photographerId !== user.id) {
    notFound();
  }

  const classes = await prisma.class.findMany({
    where: { schoolId: params.id },
    include: {
      _count: {
        select: { students: true, sessions: true },
      },
    },
    orderBy: [{ grade: 'asc' }, { section: 'asc' }],
  });

  return (
    <ClassesClient school={school} classes={classes} />
  );
}
