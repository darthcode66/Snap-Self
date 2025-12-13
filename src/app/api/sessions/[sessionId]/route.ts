import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = Promise<{
  sessionId: string;
}>;

export async function GET(request: NextRequest, props: { params: RouteParams }) {
  try {
    const params = await props.params;
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.photoSession.findUnique({
      where: { id: params.sessionId },
      include: {
        class: {
          include: {
            school: true,
            students: true,
          },
        },
        photos: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, props: { params: RouteParams }) {
  try {
    const params = await props.params;
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, currentStudentIndex, photographed, absent, pending } = body;

    // Verify session belongs to user
    const session = await prisma.photoSession.findUnique({
      where: { id: params.sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update session
    const updatedSession = await prisma.photoSession.update({
      where: { id: params.sessionId },
      data: {
        ...(status && { status }),
        ...(currentStudentIndex !== undefined && { currentStudentIndex }),
        ...(photographed !== undefined && { photographed }),
        ...(absent !== undefined && { absent }),
        ...(pending !== undefined && { pending }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        class: {
          include: {
            school: true,
            students: true,
          },
        },
        photos: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: RouteParams }) {
  try {
    const params = await props.params;
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify session belongs to user
    const session = await prisma.photoSession.findUnique({
      where: { id: params.sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.photographerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete session (cascade will handle photos)
    await prisma.photoSession.delete({
      where: { id: params.sessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
