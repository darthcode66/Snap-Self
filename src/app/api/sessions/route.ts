import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');

    if (classId) {
      // Get sessions for a specific class
      const sessions = await prisma.photoSession.findMany({
        where: {
          classId,
          photographerId: user.id,
        },
        include: {
          class: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(sessions);
    }

    // Get all sessions for this photographer
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

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { classId, photoPrefix, startNumber = 1, sortOrder = 'ALPHABETICAL' } = body;

    if (!classId || !photoPrefix) {
      return NextResponse.json(
        { error: 'Missing required fields: classId, photoPrefix' },
        { status: 400 }
      );
    }

    // Verify class belongs to user's school
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        school: true,
        students: true,
      },
    });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    if (classData.school.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get students for the class (ordered as specified)
    let students = classData.students;
    if (sortOrder === 'REGISTRATION_NUMBER') {
      students = students.sort(
        (a, b) => (a.registrationNumber || '').localeCompare(b.registrationNumber || '')
      );
    } else {
      // Default: alphabetical by sortName
      students = students.sort((a, b) => a.sortName.localeCompare(b.sortName));
    }

    // Create the session
    const session = await prisma.photoSession.create({
      data: {
        classId,
        photographerId: user.id,
        photoPrefix,
        startNumber: parseInt(String(startNumber)),
        sortOrder,
        totalStudents: students.length,
        pending: students.length,
        status: 'IN_PROGRESS',
      },
      include: {
        class: {
          include: {
            school: true,
          },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
