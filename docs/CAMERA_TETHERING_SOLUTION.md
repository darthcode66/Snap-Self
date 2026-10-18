# 📷 Solução de Tethering - Nikon D780

## Objetivo
Capturar fotos automaticamente da câmera Nikon D780 e enviar para o sistema Snap-Self em tempo real.

---

## 🎯 Opções de Conexão

### 1. USB (PTP/MTP) - ⭐ RECOMENDADO
**Prós:**
- Transferência mais rápida (USB 3.0)
- Conexão mais estável
- Suporte nativo via gPhoto2
- Funciona com qualquer câmera PTP

**Contras:**
- Requer cabo USB
- Câmera deve estar próxima ao computador

### 2. Wi-Fi (PTP/IP)
**Prós:**
- Sem fio (mais mobilidade)
- D780 suporta nativamente

**Contras:**
- Transferência mais lenta
- Configuração mais complexa
- Requer rede Wi-Fi ou modo AP

### 3. Bluetooth
**Contras:**
- Muito lento para RAW/JPEG
- Não recomendado para tethering

---

## 🏗️ Arquitetura Escolhida: USB + gPhoto2

```
┌─────────────────┐
│  Nikon D780     │
│  (USB)          │
└────────┬────────┘
         │ USB 3.0
         │
┌────────▼────────────────────────────┐
│  Servidor Local (Node.js)           │
│  ┌──────────────────────────────┐   │
│  │  gPhoto2 Service             │   │
│  │  - Detecta câmera            │   │
│  │  - Monitora novos arquivos   │   │
│  │  - Baixa fotos RAW/JPEG      │   │
│  └───────────┬──────────────────┘   │
│              │                       │
│  ┌───────────▼──────────────────┐   │
│  │  Upload Service              │   │
│  │  - Nomeia automaticamente    │   │
│  │  - Upload para R2/Neon       │   │
│  │  - Notifica frontend         │   │
│  └───────────┬──────────────────┘   │
└──────────────┼──────────────────────┘
               │ WebSocket
               │
┌──────────────▼──────────────────────┐
│  Frontend (Next.js)                 │
│  - Sessão Assistida                 │
│  - Preview em tempo real            │
│  - Lista de alunos                  │
└─────────────────────────────────────┘
```

---

## 📦 Tecnologias Necessárias

### Backend
```bash
# gPhoto2 (biblioteca C++ para controle de câmeras)
sudo apt-get install gphoto2 libgphoto2-dev

# Node.js bindings para gPhoto2
npm install node-gphoto2
# OU
npm install gphoto2  # wrapper mais simples
```

### Alternativas
1. **gPhoto2 CLI** - Chamar via `child_process`
2. **libgphoto2 WebAssembly** - Rodar no browser (mais complexo)
3. **Nikon SDK** - Oficial, mas requer aprovação

---

## 🔧 Implementação Recomendada

### Opção 1: gPhoto2 CLI (Mais Simples) ⭐
```typescript
// src/lib/camera/gphoto2-service.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GPhoto2Service {
  // Detectar câmera
  async detectCamera() {
    const { stdout } = await execAsync('gphoto2 --auto-detect');
    return stdout.includes('Nikon');
  }

  // Capturar e baixar foto
  async captureAndDownload(filename: string) {
    await execAsync(`gphoto2 --capture-image-and-download --filename "${filename}"`);
  }

  // Monitorar novas fotos (watch mode)
  async watchForNewPhotos(callback: (file: string) => void) {
    // gPhoto2 hook mode
    const process = exec('gphoto2 --capture-tethered --hook-script /path/to/hook.sh');

    process.stdout?.on('data', (data) => {
      // Parse output e chamar callback
      const match = data.match(/Saving file as (.+)/);
      if (match) {
        callback(match[1]);
      }
    });
  }
}
```

### Opção 2: node-gphoto2 (Mais Controle)
```typescript
import gphoto2 from 'node-gphoto2';

const GPhoto2 = gphoto2.GPhoto2;
const gp2 = new GPhoto2();

gp2.list((cameras) => {
  if (cameras.length === 0) return;

  const camera = cameras[0];

  // Capturar foto
  camera.takePicture({ download: true }, (err, data) => {
    // data é o buffer da imagem
    // Upload para R2/Storage
  });
});
```

---

## 🎬 Fluxo Completo - Modo Escolar

### 1. Fotógrafo Inicia Sessão
```typescript
// Frontend: src/app/sessions/[id]/camera/page.tsx
const SessionCamera = () => {
  const [cameraConnected, setCameraConnected] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [students, setStudents] = useState([...]);

  // Detectar câmera
  useEffect(() => {
    fetch('/api/camera/detect')
      .then(res => res.json())
      .then(data => setCameraConnected(data.connected));
  }, []);

  return (
    <div>
      {/* Status da câmera */}
      <CameraStatus connected={cameraConnected} />

      {/* Próximo aluno */}
      <NextStudentCard student={currentStudent} />

      {/* Preview ao vivo */}
      <LivePreview />

      {/* Lista de alunos */}
      <StudentList students={students} />
    </div>
  );
};
```

### 2. Backend Monitora Câmera
```typescript
// src/app/api/camera/watch/route.ts
import { GPhoto2Service } from '@/lib/camera/gphoto2-service';

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const gphoto = new GPhoto2Service();

      // Monitorar novas fotos
      await gphoto.watchForNewPhotos(async (filepath) => {
        // 1. Ler arquivo
        const buffer = await readFile(filepath);

        // 2. Obter aluno atual da sessão
        const session = await getActiveSession();
        const student = session.currentStudent;

        // 3. Renomear automaticamente
        const newFilename = `${student.numero}_${student.nome}_${Date.now()}.jpg`;

        // 4. Upload para R2
        const url = await uploadToR2(buffer, newFilename);

        // 5. Salvar no banco
        await prisma.photo.create({
          data: {
            url,
            filename: newFilename,
            studentId: student.id,
            sessionId: session.id,
          }
        });

        // 6. Notificar frontend via SSE
        const data = encoder.encode(`data: ${JSON.stringify({ url, student })}\n\n`);
        controller.enqueue(data);

        // 7. Avançar para próximo aluno
        await advanceToNextStudent(session.id);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### 3. Frontend Recebe Atualizações
```typescript
// Hook para receber fotos em tempo real
const useCameraStream = (sessionId: string) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/camera/watch?sessionId=${sessionId}`);

    eventSource.onmessage = (event) => {
      const newPhoto = JSON.parse(event.data);
      setPhotos(prev => [...prev, newPhoto]);

      // Mostrar preview + notificação
      toast.success(`Foto capturada: ${newPhoto.student.nome}`);
    };

    return () => eventSource.close();
  }, [sessionId]);

  return photos;
};
```

---

## 🚀 Instalação e Setup

### 1. Instalar gPhoto2 no Sistema
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install gphoto2 libgphoto2-dev

# macOS
brew install gphoto2

# Verificar instalação
gphoto2 --version
```

### 2. Testar Câmera
```bash
# Conectar D780 via USB

# Detectar câmera
gphoto2 --auto-detect

# Listar arquivos
gphoto2 --list-files

# Capturar foto de teste
gphoto2 --capture-image-and-download
```

### 3. Instalar Dependências Node
```bash
cd /home/pedro/snap-self-app

# Escolher uma:
npm install gphoto2  # CLI wrapper (mais simples)
# OU
npm install node-gphoto2  # Bindings nativos (mais poderoso)
```

### 4. Criar Serviço
```bash
# Criar arquivo de serviço
mkdir -p src/lib/camera
touch src/lib/camera/gphoto2-service.ts
```

---

## 📝 Próximos Passos

### Fase 1: Prova de Conceito (1-2 dias)
- [x] Instalar gPhoto2
- [ ] Detectar D780 conectada
- [ ] Capturar 1 foto via CLI
- [ ] Baixar foto para pasta local

### Fase 2: Integração Básica (3-5 dias)
- [ ] Criar serviço Node.js
- [ ] Endpoint API `/api/camera/detect`
- [ ] Endpoint API `/api/camera/capture`
- [ ] Upload automático para R2

### Fase 3: Modo Watch (1 semana)
- [ ] Monitoramento em tempo real
- [ ] Server-Sent Events (SSE)
- [ ] Preview no frontend
- [ ] Nomenclatura automática

### Fase 4: Modo Escolar Completo (2 semanas)
- [ ] Integração com lista de alunos
- [ ] Avanço automático
- [ ] Alertas visuais
- [ ] Rastreamento de progresso

---

## ⚠️ Considerações Importantes

### Permissões
- gPhoto2 pode precisar de permissões USB
- Adicionar udev rules no Linux:
```bash
# /etc/udev/rules.d/51-gphoto.rules
ATTRS{idVendor}=="04b0", MODE="0666"  # Nikon
```

### Performance
- RAW files (~30-40 MB) levam 3-5s via USB 3.0
- JPEG (~10 MB) levam 1-2s
- Wi-Fi seria 3-5x mais lento

### Compatibilidade
- D780 100% compatível com gPhoto2
- Testar com firmware mais recente
- Modo câmera: Manual/Aperture Priority

### Alternativas Comerciais
- **Capture One** - Tethering profissional ($300/ano)
- **Adobe Lightroom** - Também tem tethering
- **NX Tether** - Software oficial Nikon (grátis!)

---

## 🔍 Recursos

- [gPhoto2 Docs](http://www.gphoto.org/doc/manual/)
- [Nikon D780 Supported](http://www.gphoto.org/proj/libgphoto2/support.php)
- [PTP Protocol Spec](http://www.gphoto.org/doc/ptpip.php)
- [node-gphoto2 GitHub](https://github.com/lwille/node-gphoto2)

---

**Decisão**: Começar com **gPhoto2 CLI wrapper** (Opção 1) para MVP, depois migrar para **node-gphoto2** se precisar de mais controle.
