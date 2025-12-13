import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = Promise<{
  sessionId: string;
}>;

export async function POST(
  request: NextRequest,
  props: { params: RouteParams }
) {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;

    if (!file || !studentId) {
      return NextResponse.json(
        { error: 'Missing file or studentId' },
        { status: 400 }
      );
    }

    // Verify student belongs to the session's class
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
      },
    });

    if (!student || student.class.id !== session.classId) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // TODO: Upload file to cloud storage (Vercel Blob, S3, etc.)
    // For now, we'll just store the metadata with a placeholder URL
    // Example implementation for Vercel Blob:
    // import { blob } from '@vercel/blob';
    // const { url } = await blob.upload({
    //   file,
    //   access: 'private',
    //   pathname: `photos/${session.id}/${studentId}-${Date.now()}`,
    // });

    // Extract format from file type
    const format = file.type?.split('/')[1]?.split('+')[0] || 'jpg';

    // Create photo record in database
    const photo = await prisma.photo.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        studentId,
        filename: file.name,
        size: file.size,
        format,
        // url: url, // Add this when implementing cloud storage
        url: `/api/photos/placeholder/${studentId}`, // Placeholder
        width: 0, // Will be updated after processing
        height: 0, // Will be updated after processing
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  props: { params: RouteParams }
) {
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

    // Get all photos for this session
    const photos = await prisma.photo.findMany({
      where: { sessionId: params.sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
