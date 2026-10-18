/**
 * Componente: Tethering da Câmera
 * Interface principal para captura e monitoramento
 */

'use client';

import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraTetherProps {
  sessionId?: string;
  studentId?: string;
  onPhotoCapture?: (photoUrl: string) => void;
  demoMode?: boolean; // Modo demo para testar sem câmera
}

export function CameraTether({ sessionId, studentId, onPhotoCapture }: CameraTetherProps) {
  const [capturing, setCapturing] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capturePhoto = async () => {
    setCapturing(true);
    setError(null);

    try {
      const response = await fetch('/api/camera/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          studentId,
          autoUpload: true,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Falha ao capturar foto');
      }

      // Atualizar preview
      if (data.photo?.url) {
        setLastPhoto(data.photo.url);
        onPhotoCapture?.(data.photo.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botão de captura */}
      <div className="flex items-center gap-4">
        <Button
          onClick={capturePhoto}
          disabled={capturing}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
        >
          {capturing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Capturando...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Capturar Foto
            </>
          )}
        </Button>

        {lastPhoto && (
          <span className="text-sm text-green-600">Última foto capturada com sucesso!</span>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview da última foto */}
      {lastPhoto && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Última foto capturada</h3>
          <img
            src={lastPhoto}
            alt="Última foto capturada"
            className="h-auto w-full max-w-md rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
