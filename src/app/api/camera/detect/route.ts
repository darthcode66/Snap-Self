/**
 * API Route: Detectar câmera conectada
 * GET /api/camera/detect
 *
 * Retorna informações sobre câmera conectada via USB
 */

import { NextRequest, NextResponse } from 'next/server';
import { gphoto2Service } from '@/lib/camera/gphoto2-service';

export async function GET(req: NextRequest) {
  try {
    // Verificar se gPhoto2 está instalado
    const isInstalled = await gphoto2Service.checkInstallation();

    if (!isInstalled) {
      return NextResponse.json(
        {
          connected: false,
          error: 'gPhoto2 não está instalado no sistema',
          installCommand: 'sudo apt-get install gphoto2 libgphoto2-dev',
        },
        { status: 503 }
      );
    }

    // Detectar câmera
    const camera = await gphoto2Service.detectCamera();

    if (!camera) {
      return NextResponse.json({
        connected: false,
        message: 'Nenhuma câmera detectada. Conecte via USB e tente novamente.',
      });
    }

    return NextResponse.json({
      connected: true,
      camera: {
        model: camera.model,
        port: camera.port,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao detectar câmera:', error);

    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
