/**
 * API Route: Monitorar câmera em tempo real
 * GET /api/camera/watch?sessionId=xxx
 *
 * Server-Sent Events (SSE) para notificações em tempo real
 * quando novas fotos são capturadas
 */

import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { gphoto2Service } from '@/lib/camera/gphoto2-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos max

export async function GET(req: NextRequest) {
  try {
    // Autenticação
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId') || 'default';

    // Criar stream SSE
    const encoder = new TextEncoder();
    let heartbeatId: NodeJS.Timeout;
    let stopWatching: (() => void) | null = null;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Enviar mensagem inicial
          const data = encoder.encode(
            `data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`
          );
          controller.enqueue(data);

          // Matar GVFS para evitar conflitos
          const { exec } = require('child_process');
          exec('killall gvfs-gphoto2-volume-monitor gvfsd-gphoto2 2>/dev/null');

          // Aguardar um pouco para GVFS liberar
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Iniciar monitoramento da câmera (novo modo: eventos PTP)
          stopWatching = await gphoto2Service.watchForNewPhotos(
            async (buffer, filename) => {
              console.log(`📸 Nova foto detectada: ${filename} (${buffer.length} bytes)`);

              // Converter buffer para base64 (temporário - em produção usar R2)
              const base64 = buffer.toString('base64');
              const photoUrl = `data:image/jpeg;base64,${base64}`;

              // Enviar para frontend via SSE
              const photoData = encoder.encode(
                `data: ${JSON.stringify({
                  type: 'photo_captured',
                  photo: {
                    filename,
                    url: photoUrl,
                    size: buffer.length,
                    timestamp: new Date().toISOString(),
                  },
                })}\n\n`
              );

              controller.enqueue(photoData);
            }
          );

          // Manter conexão viva com heartbeat
          heartbeatId = setInterval(() => {
            const heartbeat = encoder.encode(
              `data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`
            );
            controller.enqueue(heartbeat);
          }, 30000); // 30s
        } catch (error) {
          console.error('Erro ao iniciar watch:', error);
          const errorData = encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'Erro desconhecido',
            })}\n\n`
          );
          controller.enqueue(errorData);
        }
      },

      cancel() {
        // Limpar recursos quando cliente desconectar
        if (heartbeatId) {
          clearInterval(heartbeatId);
        }
        if (stopWatching) {
          stopWatching();
        }
        console.log('📸 Cliente desconectou do watch');
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Nginx
      },
    });
  } catch (error) {
    console.error('Erro no watch:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
