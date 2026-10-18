/**
 * API Route: Demo Mode - Simula captura de câmera
 * POST /api/camera/demo
 *
 * Útil para testar sem câmera física conectada
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Autenticação
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, studentId } = body;

    // Simular delay de captura (realista)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Gerar imagem demo (pixel transparente)
    const mockImageBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // Gerar nome do arquivo
    const timestamp = Date.now();
    const filename = sessionId && studentId
      ? `DEMO_Aluno_${studentId}_${timestamp}.jpg`
      : `DEMO_${timestamp}.jpg`;

    const photoUrl = `data:image/png;base64,${mockImageBase64}`;

    return NextResponse.json({
      success: true,
      demo: true,
      photo: {
        id: `demo_${timestamp}`,
        url: photoUrl,
        filename,
        size: 1024,
        timestamp: new Date().toISOString(),
      },
      message: 'Foto demo capturada! Conecte uma câmera real para captura real.',
    });
  } catch (error) {
    console.error('Erro no modo demo:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
