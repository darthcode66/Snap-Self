/**
 * Componente: Captura Automática da Câmera
 * Monitora a câmera e exibe fotos automaticamente quando capturadas
 */

'use client';

import { useEffect, useState } from 'react';
import { Camera, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
  filename: string;
  url: string;
  size: number;
  timestamp: string;
}

export function CameraAutoCapture() {
  const [watching, setWatching] = useState(false);
  const [connected, setConnected] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [photoHistory, setPhotoHistory] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!watching) return;

    // Conectar ao SSE
    const eventSource = new EventSource('/api/camera/watch?sessionId=test');

    eventSource.onopen = () => {
      console.log('📸 Conexão SSE aberta');
      setConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connected':
            console.log('✅ Monitoramento iniciado');
            setConnected(true);
            break;

          case 'photo_captured':
            console.log('📸 Nova foto recebida:', data.photo.filename);
            setCurrentPhoto(data.photo);
            setPhotoHistory((prev) => [data.photo, ...prev].slice(0, 10)); // Máximo 10 fotos no histórico
            break;

          case 'heartbeat':
            // Apenas manter conexão viva
            break;

          case 'error':
            console.error('Erro no monitoramento:', data.error);
            setError(data.error);
            break;
        }
      } catch (err) {
        console.error('Erro ao processar mensagem SSE:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('Erro na conexão SSE:', err);
      setConnected(false);
      setError('Erro na conexão com servidor');
      eventSource.close();
    };

    // Cleanup
    return () => {
      console.log('📸 Fechando conexão SSE');
      eventSource.close();
      setConnected(false);
    };
  }, [watching]);

  const toggleWatching = () => {
    setWatching(!watching);
    if (watching) {
      setConnected(false);
      setCurrentPhoto(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleWatching}
          size="lg"
          variant={watching ? 'destructive' : 'default'}
          className={watching ? '' : 'bg-green-600 hover:bg-green-700'}
        >
          {watching ? (
            <>
              <WifiOff className="mr-2 h-5 w-5" />
              Parar Monitoramento
            </>
          ) : (
            <>
              <Wifi className="mr-2 h-5 w-5" />
              Iniciar Monitoramento Automático
            </>
          )}
        </Button>

        {watching && (
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm text-green-600">Monitorando câmera...</span>
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-600">Conectando...</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      {watching && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Modo Automático Ativado</h3>
              <p className="mt-1 text-sm text-blue-700">
                Tire fotos normalmente na câmera. Elas aparecerão aqui automaticamente em 2-3
                segundos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Foto Atual (Grande) */}
      {currentPhoto && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Última Foto Capturada</h3>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.filename}
              className="h-auto w-full rounded-lg"
            />
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>{currentPhoto.filename}</span>
              <span>{(currentPhoto.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(currentPhoto.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Histórico (Miniaturas) */}
      {photoHistory.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Histórico ({photoHistory.length} fotos)
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {photoHistory.slice(1).map((photo, index) => (
              <button
                key={photo.timestamp}
                onClick={() => setCurrentPhoto(photo)}
                className="overflow-hidden rounded border border-gray-200 transition hover:border-blue-400"
              >
                <img
                  src={photo.url}
                  alt={`Foto ${index + 2}`}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instruções */}
      {!watching && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Como usar:</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
            <li>Clique em &quot;Iniciar Monitoramento Automático&quot;</li>
            <li>Tire fotos normalmente na câmera (botão físico)</li>
            <li>Aguarde 2-3 segundos</li>
            <li>A foto aparecerá automaticamente aqui</li>
            <li>Tire outra foto - a anterior será substituída</li>
          </ol>
        </div>
      )}
    </div>
  );
}
