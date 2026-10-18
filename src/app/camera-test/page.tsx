/**
 * Página de Teste: Camera Tethering
 * Rota: /camera-test
 *
 * Interface para testar a funcionalidade de tethering
 */

'use client';

import { CameraStatus } from '@/components/camera/CameraStatus';
import { CameraTether } from '@/components/camera/CameraTether';
import { CameraAutoCapture } from '@/components/camera/CameraAutoCapture';

export default function CameraTestPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teste de Tethering</h1>
        <p className="mt-2 text-gray-600">
          Conecte sua câmera Nikon D780 via USB e teste a captura automática
        </p>
      </header>

      <div className="space-y-6">
        {/* Status da câmera */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Status da Câmera</h2>
          <CameraStatus />
        </section>

        {/* Instruções */}
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-900">Instruções</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
            <li>Instale o gPhoto2 se necessário (comando acima)</li>
            <li>Conecte sua câmera Nikon D780 via cabo USB</li>
            <li>Ligue a câmera</li>
            <li>Aguarde alguns segundos até a detecção</li>
            <li>Clique em &quot;Capturar Foto&quot; para testar</li>
          </ol>
        </section>

        {/* Interface de captura AUTOMÁTICA (NOVO!) */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            🎯 Captura Automática (Recomendado)
          </h2>
          <CameraAutoCapture />
        </section>

        {/* Separador */}
        <div className="border-t border-gray-200" />

        {/* Interface de captura MANUAL (antigo) */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Captura Manual (Alternativa)
          </h2>
          <CameraTether />
        </section>

        {/* Informações técnicas */}
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Informações Técnicas</h3>
          <dl className="space-y-1 text-xs text-gray-600">
            <div className="flex gap-2">
              <dt className="font-medium">Backend:</dt>
              <dd>gPhoto2 via child_process</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Protocolo:</dt>
              <dd>PTP/MTP (USB)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Câmera:</dt>
              <dd>Nikon D780 (compatível)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Formato:</dt>
              <dd>JPEG (RAW disponível via configuração)</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
