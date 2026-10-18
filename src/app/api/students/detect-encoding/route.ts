import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import chardet from 'chardet';

// POST /api/students/detect-encoding - Detect encoding and return decoded content
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect encoding
    const detected = chardet.detect(buffer);
    const encoding = detected || 'utf-8';

    // Decode with detected encoding
    let content: string;
    try {
      content = buffer.toString(encoding as BufferEncoding);
    } catch (e) {
      // Fallback to UTF-8 if detected encoding fails
      content = buffer.toString('utf-8');
    }

    return NextResponse.json({
      encoding,
      content,
      confidence: detected ? 1 : 0.5,
    });
  } catch (error) {
    console.error('Error detecting encoding:', error);
    return NextResponse.json(
      { error: 'Failed to detect encoding' },
      { status: 500 }
    );
  }
}
