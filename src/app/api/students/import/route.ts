import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface StudentImportData {
  name: string;
  grade?: string;
  section?: string;
}

// POST /api/students/import - Import students to a class
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { classId, students }: { classId: string; students: StudentImportData[] } = body;

    if (!classId || !students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Verify that the class belongs to the current user
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
      },
    });

    if (!classData || classData.school.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create students in batch
    const createdStudents = await Promise.all(
      students.map((student) =>
        prisma.student.create({
          data: {
            name: student.name.trim(),
            sortName: generateSortName(student.name),
            classId,
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        count: createdStudents.length,
        students: createdStudents,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error importing students:', error);
    return NextResponse.json(
      { error: 'Failed to import students' },
      { status: 500 }
    );
  }
}

/**
 * Gera sortName a partir do nome completo
 * Exemplo: "João Silva" -> "Silva, João"
 * Exemplo: "Maria" -> "Maria"
 */
function generateSortName(fullName: string): string {
  const parts = fullName.trim().split(' ').filter((p) => p.length > 0);

  if (parts.length === 0) {
    return '';
  }

  if (parts.length === 1) {
    return parts[0];
  }

  // Last name comes first
  const lastName = parts[parts.length - 1];
  const firstNames = parts.slice(0, -1).join(' ');

  return `${lastName}, ${firstNames}`;
}
