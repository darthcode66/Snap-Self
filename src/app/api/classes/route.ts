import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/classes?schoolId=xxx - List all classes for a specific school
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schoolId = request.nextUrl.searchParams.get('schoolId');
    if (!schoolId) {
      return NextResponse.json(
        { error: 'schoolId is required' },
        { status: 400 }
      );
    }

    // Verify that the school belongs to the current user
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school || school.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        _count: {
          select: { students: true, sessions: true },
        },
      },
      orderBy: [{ grade: 'asc' }, { section: 'asc' }],
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { schoolId, name, grade, section, year } = body;

    // Verify that the school belongs to the current user
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school || school.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if class already exists
    const existingClass = await prisma.class.findUnique({
      where: {
        schoolId_grade_section_year: {
          schoolId,
          grade,
          section,
          year,
        },
      },
    });

    if (existingClass) {
      return NextResponse.json(
        { error: 'This class already exists' },
        { status: 409 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        grade,
        section,
        year,
        schoolId,
      },
      include: {
        _count: {
          select: { students: true, sessions: true },
        },
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
