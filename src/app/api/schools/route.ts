import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/schools - List all schools for the current user
export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schools = await prisma.school.findMany({
      where: {
        photographerId: user.id,
      },
      include: {
        _count: {
          select: {
            classes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

// POST /api/schools - Create a new school
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Ensure user exists in database (sync from Clerk)
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Fotógrafo',
      },
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Fotógrafo',
        passwordHash: '', // Clerk manages authentication
        role: 'PHOTOGRAPHER',
      },
    });

    const school = await prisma.school.create({
      data: {
        name: body.name,
        cnpj: body.cnpj,
        phone: body.phone,
        email: body.email,
        street: body.street,
        number: body.number,
        complement: body.complement,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        photographerId: user.id,
      },
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    );
  }
}
