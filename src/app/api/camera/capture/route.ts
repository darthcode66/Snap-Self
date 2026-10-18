/**
 * API Route: Capturar foto da câmera
 * POST /api/camera/capture
 *
 * Captura uma foto e retorna informações
 * Opcionalmente faz upload automático para storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { gphoto2Service } from '@/lib/camera/gphoto2-service';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface CaptureRequest {
  sessionId?: string;
  studentId?: string;
  autoUpload?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // Autenticação
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body: CaptureRequest = await req.json();
    const { sessionId, studentId, autoUpload = true } = body;

    // Capturar foto
    const result = await gphoto2Service.captureAndDownload();

    if (!result.success || !result.buffer) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Falha ao capturar foto',
        },
        { status: 500 }
      );
    }

    // Se autoUpload está habilitado, fazer upload
    let photoUrl: string | null = null;
    let photoId: string | null = null;

    if (autoUpload && result.buffer) {
      // TODO: Implementar upload para R2/Cloudflare Storage
      // Por enquanto, salvar localmente ou retornar base64

      // Gerar nome do arquivo
      let filename = result.filepath || `photo_${Date.now()}.jpg`;

      // Se temos sessionId e studentId, usar nomenclatura automática
      if (sessionId && studentId) {
        const student = await prisma.student.findUnique({
          where: { id: studentId },
        });

        if (student) {
          // Formato: 001_Ana_Silva.jpg
          filename = `${String(student.number).padStart(3, '0')}_${student.name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
        }
      }

      // Por enquanto, retornar base64 (temporário)
      photoUrl = `data:image/jpeg;base64,${result.buffer.toString('base64')}`;

      // Salvar metadados no banco
      if (sessionId) {
        const photo = await prisma.photo.create({
          data: {
            filename,
            url: photoUrl, // Temporário - substituir por URL real do R2
            size: result.buffer.length,
            format: 'jpg',
            // Adicionar campos quando tiver os IDs corretos
            userId,
            sessionId,
            studentId,
          },
        });

        photoId = photo.id;
      }
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: photoId,
        url: photoUrl,
        filename: result.filepath,
        size: result.buffer.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Erro ao capturar foto:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
