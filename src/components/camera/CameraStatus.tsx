/**
 * Componente: Status da Câmera
 * Mostra se a câmera está conectada e informações básicas
 */

'use client';

import { useEffect, useState } from 'react';
import { Camera, WifiOff, Loader2 } from 'lucide-react';

interface CameraInfo {
  connected: boolean;
  camera?: {
    model: string;
    port: string;
  };
  error?: string;
  installCommand?: string;
}

export function CameraStatus() {
  const [cameraInfo, setCameraInfo] = useState<CameraInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCamera();

    // Verificar a cada 5 segundos
    const interval = setInterval(checkCamera, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkCamera = async () => {
    try {
      const response = await fetch('/api/camera/detect');
      const data = await response.json();
      setCameraInfo(data);
    } catch (error) {
      console.error('Erro ao verificar câmera:', error);
      setCameraInfo({
        connected: false,
        error: 'Erro ao conectar com servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-600">Verificando câmera...</span>
      </div>
    );
  }

  if (!cameraInfo) {
    return null;
  }

  if (cameraInfo.installCommand) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <WifiOff className="h-5 w-5 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-900">gPhoto2 não instalado</h3>
            <p className="mt-1 text-sm text-amber-700">{cameraInfo.error}</p>
            <code className="mt-2 block rounded bg-amber-100 p-2 text-xs text-amber-900">
              {cameraInfo.installCommand}
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (!cameraInfo.connected) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-semibold text-gray-900">Câmera não conectada</h3>
            <p className="text-sm text-gray-600">
              Conecte sua câmera via USB e aguarde alguns segundos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="flex items-center gap-3">
        <Camera className="h-5 w-5 text-green-600" />
        <div>
          <h3 className="font-semibold text-green-900">Câmera conectada</h3>
          <p className="text-sm text-green-700">
            {cameraInfo.camera?.model} ({cameraInfo.camera?.port})
          </p>
        </div>
      </div>
    </div>
  );
}
