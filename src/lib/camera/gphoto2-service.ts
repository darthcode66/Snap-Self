/**
 * gPhoto2 Service - Interface para controle de câmeras DSLR via gPhoto2
 *
 * Suporta:
 * - Nikon D780 (e outras câmeras PTP/MTP)
 * - Detecção automática
 * - Captura de fotos
 * - Download automático
 * - Monitoramento em tempo real
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, unlink } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface CameraInfo {
  model: string;
  port: string;
  connected: boolean;
}

export interface CaptureResult {
  success: boolean;
  filepath?: string;
  buffer?: Buffer;
  error?: string;
}

export class GPhoto2Service {
  private isInstalled: boolean | null = null;
  private lastFileCount: number = 0;

  /**
   * Verifica se gPhoto2 está instalado no sistema
   */
  async checkInstallation(): Promise<boolean> {
    if (this.isInstalled !== null) return this.isInstalled;

    try {
      const { stdout } = await execAsync('which gphoto2');
      this.isInstalled = stdout.trim().length > 0;
      return this.isInstalled;
    } catch (error) {
      this.isInstalled = false;
      return false;
    }
  }

  /**
   * Detecta câmeras conectadas
   */
  async detectCamera(): Promise<CameraInfo | null> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado. Execute: sudo apt-get install gphoto2');
    }

    try {
      const { stdout } = await execAsync('gphoto2 --auto-detect');

      // Parse output
      // Formato: "Model                          Port"
      //          "Nikon DSC D780                usb:001,005"
      const lines = stdout.split('\n').filter(line => line.trim());

      // Pular header (primeiras 2 linhas)
      const cameraLine = lines.slice(2).find(line => line.includes('usb:'));

      if (!cameraLine) {
        return null;
      }

      // Split por múltiplos espaços
      const parts = cameraLine.split(/\s{2,}/);
      const model = parts[0]?.trim() || 'Unknown';
      const port = parts[1]?.trim() || '';

      return {
        model,
        port,
        connected: true,
      };
    } catch (error) {
      console.error('Erro ao detectar câmera:', error);
      return null;
    }
  }

  /**
   * Captura uma foto e retorna o buffer
   * @param downloadDir - Diretório temporário para download (padrão: /tmp)
   */
  async captureAndDownload(downloadDir: string = '/tmp'): Promise<CaptureResult> {
    const installed = await this.checkInstallation();
    if (!installed) {
      return {
        success: false,
        error: 'gPhoto2 não está instalado',
      };
    }

    const timestamp = Date.now();
    const filename = `capture_${timestamp}.jpg`;
    const filepath = path.join(downloadDir, filename);

    try {
      // Capturar e baixar foto
      // --capture-image-and-download: captura e faz download automático
      // --filename: especifica nome do arquivo
      await execAsync(
        `gphoto2 --capture-image-and-download --filename "${filepath}"`,
        { timeout: 30000 } // 30s timeout
      );

      // Verificar se arquivo foi criado
      const buffer = await readFile(filepath);

      // Limpar arquivo temporário
      await unlink(filepath).catch(() => {
        // Ignorar erro se já foi deletado
      });

      return {
        success: true,
        filepath: filename,
        buffer,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Captura foto sem fazer download (mais rápido)
   */
  async captureOnly(): Promise<CaptureResult> {
    const installed = await this.checkInstallation();
    if (!installed) {
      return {
        success: false,
        error: 'gPhoto2 não está instalado',
      };
    }

    try {
      await execAsync('gphoto2 --capture-image', { timeout: 30000 });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Lista todas as fotos na câmera
   */
  async listFiles(): Promise<string[]> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado');
    }

    try {
      const { stdout } = await execAsync('gphoto2 --list-files');

      // Parse output para extrair nomes de arquivos
      const files = stdout
        .split('\n')
        .filter(line => line.includes('.JPG') || line.includes('.NEF'))
        .map(line => {
          // Extrair filename do formato: "#1     IMG_0001.JPG"
          const match = line.match(/\s+([\w\-_.]+\.(JPG|NEF))/i);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      return files;
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      return [];
    }
  }

  /**
   * Baixa um arquivo específico da câmera
   */
  async downloadFile(filename: string, downloadDir: string = '/tmp'): Promise<Buffer | null> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado');
    }

    const filepath = path.join(downloadDir, filename);

    try {
      await execAsync(
        `gphoto2 --get-file "${filename}" --filename "${filepath}"`,
        { timeout: 60000 }
      );

      const buffer = await readFile(filepath);
      await unlink(filepath);

      return buffer;
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      return null;
    }
  }

  /**
   * Obtém configurações da câmera
   */
  async getConfig(): Promise<Record<string, string>> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado');
    }

    try {
      const { stdout } = await execAsync('gphoto2 --get-config /main/settings');

      // Parse configurações
      const config: Record<string, string> = {};
      const lines = stdout.split('\n');

      lines.forEach(line => {
        const match = line.match(/^(.+):\s*(.+)$/);
        if (match) {
          config[match[1].trim()] = match[2].trim();
        }
      });

      return config;
    } catch (error) {
      console.error('Erro ao obter config:', error);
      return {};
    }
  }

  /**
   * Reseta a câmera
   */
  async reset(): Promise<void> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado');
    }

    try {
      await execAsync('gphoto2 --reset');
    } catch (error) {
      console.error('Erro ao resetar câmera:', error);
    }
  }

  /**
   * Monitora a câmera por novas fotos usando eventos PTP
   * Muito mais eficiente que polling!
   * @param callback - Função chamada quando nova foto é detectada
   */
  async watchForNewPhotos(
    callback: (buffer: Buffer, filename: string) => void | Promise<void>
  ): Promise<() => void> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado');
    }

    console.log(`📸 Monitoramento de eventos iniciado (modo wait-event)`);

    let isWatching = true;

    // Função assíncrona que monitora eventos
    const watchLoop = async () => {
      while (isWatching) {
        try {
          console.log('🔍 Aguardando evento da câmera...');

          // Aguardar evento de nova foto (download automático)
          // Timeout de 10s para não travar forever
          const result = await execAsync(
            'gphoto2 --wait-event-and-download=1s --filename /tmp/snap_self_%Y%m%d_%H%M%S.jpg',
            { timeout: 15000 }
          );

          console.log('📋 Output gPhoto2:', result.stdout.substring(0, 200));

          // Se capturou uma foto (suporte para inglês E português)
          const savingRegex = /(Saving file as|Salvando arquivo como) (.+)/;
          const match = result.stdout.match(savingRegex);

          if (match) {
            const filepath = match[2].trim();
            console.log(`📸 Nova foto capturada: ${filepath}`);

            try {
              // Ler arquivo
              const buffer = await readFile(filepath);
              const filename = filepath.split('/').pop() || 'photo.jpg';

              console.log(`✅ Foto lida: ${filename} (${buffer.length} bytes)`);

              // Chamar callback
              await callback(buffer, filename);

              // Limpar arquivo temporário
              await unlink(filepath).catch(() => {});
            } catch (readError) {
              console.error('❌ Erro ao ler foto:', readError);
            }
          }
        } catch (error) {
          // Timeout é normal (significa que não houve evento)
          if (error instanceof Error && !error.message.includes('ETIMEDOUT') && !error.message.includes('timeout')) {
            console.error('❌ Erro no monitoramento de eventos:', error);
          }
          // Aguardar um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };

    // Iniciar loop em background
    watchLoop().catch(err => console.error('Erro fatal no watch:', err));

    // Retornar função para parar o monitoramento
    return () => {
      isWatching = false;
      console.log('📸 Monitoramento de eventos parado.');
    };
  }

  /**
   * Deleta um arquivo da câmera
   */
  async deleteFile(filename: string): Promise<boolean> {
    const installed = await this.checkInstallation();
    if (!installed) {
      throw new Error('gPhoto2 não está instalado');
    }

    try {
      await execAsync(`gphoto2 --delete-file "${filename}"`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }
}

// Singleton instance
export const gphoto2Service = new GPhoto2Service();
