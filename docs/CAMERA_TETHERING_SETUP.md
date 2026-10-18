# 🚀 Setup Rápido - Camera Tethering

## ✅ O que foi implementado

### Backend
- ✅ Serviço gPhoto2 (`src/lib/camera/gphoto2-service.ts`)
- ✅ API `/api/camera/detect` - Detectar câmera
- ✅ API `/api/camera/capture` - Capturar foto
- ✅ API `/api/camera/watch` - Monitoramento em tempo real (SSE)

### Frontend
- ✅ Componente `CameraStatus` - Status da câmera
- ✅ Componente `CameraTether` - Interface de captura
- ✅ Página de teste `/camera-test`

### Documentação
- ✅ Arquitetura completa (`CAMERA_TETHERING_SOLUTION.md`)
- ✅ Guia de setup (este arquivo)

---

## 🔧 Como Testar

### 1. Instalar gPhoto2 (OBRIGATÓRIO)

```bash
sudo apt-get update
sudo apt-get install -y gphoto2 libgphoto2-dev
```

Verificar instalação:
```bash
gphoto2 --version
# Deve mostrar: gPhoto2 2.5.x ou superior
```

### 2. Conectar a Câmera

1. Conecte sua Nikon D780 via cabo USB
2. Ligue a câmera
3. Aguarde alguns segundos

Testar detecção:
```bash
gphoto2 --auto-detect
# Deve mostrar: Nikon DSC D780    usb:xxx,xxx
```

### 3. Acessar Interface de Teste

1. Servidor já está rodando em: http://localhost:3000
2. Abra no navegador: **http://localhost:3000/camera-test**
3. Você verá:
   - Status da câmera (conectada ou não)
   - Botão "Capturar Foto"
   - Preview da última foto

### 4. Testar Captura

1. Clique em "Capturar Foto"
2. A câmera vai tirar uma foto
3. O sistema vai baixar automaticamente
4. Preview aparecerá na tela

---

## 📸 Testando via CLI (alternativa)

Se quiser testar o gPhoto2 diretamente:

```bash
# Detectar câmera
gphoto2 --auto-detect

# Listar arquivos na câmera
gphoto2 --list-files

# Capturar e baixar foto
gphoto2 --capture-image-and-download

# Apenas capturar (sem download)
gphoto2 --capture-image
```

---

## 🐛 Troubleshooting

### Erro: "gPhoto2 não está instalado"

**Solução:**
```bash
sudo apt-get install gphoto2 libgphoto2-dev
```

### Erro: "Câmera não detectada"

**Possíveis causas:**

1. **Câmera desligada**
   - Ligue a câmera

2. **Cabo USB com defeito**
   - Teste outro cabo USB 3.0

3. **Permissões USB**
   - Adicione regra udev:
   ```bash
   sudo nano /etc/udev/rules.d/51-gphoto.rules
   # Adicionar: ATTRS{idVendor}=="04b0", MODE="0666"
   sudo udevadm control --reload-rules
   ```

4. **Câmera em modo errado**
   - Coloque a câmera em modo M (Manual) ou A (Aperture)
   - Desabilite "USB mode: Mass Storage" nas configurações

5. **Outro software usando a câmera**
   - Feche Digikam, Capture One, Lightroom, etc
   - Execute: `killall gvfs-gphoto2-volume-monitor`

### Erro: "Timeout ao capturar"

**Solução:**
- Câmera pode estar em modo sleep
- Aperte o botão shutter para "acordar" a câmera
- Tente novamente

---

## 🎯 Próximos Passos

### Funcionalidade Básica ✅
- [x] Detectar câmera
- [x] Capturar foto
- [x] Baixar automaticamente
- [x] Preview no frontend

### Para Produção 🚧
- [ ] Upload para Cloudflare R2 (storage)
- [ ] Nomenclatura automática (001_Nome_Aluno.jpg)
- [ ] Integração com sessões escolares
- [ ] Monitoramento em tempo real (watch mode)
- [ ] Suporte para RAW + JPEG
- [ ] Preview ao vivo (live view)
- [ ] Controle remoto da câmera

---

## 💡 Exemplo de Uso no Modo Escolar

```typescript
// 1. Fotógrafo abre sessão escolar
const session = await createSchoolSession({
  schoolId: 'xxx',
  classList: [...alunos],
});

// 2. Sistema detecta câmera
const camera = await detectCamera();

// 3. Para cada aluno:
for (const student of students) {
  // 3.1. Mostrar aluno atual
  showCurrentStudent(student);

  // 3.2. Aguardar captura (automática ou manual)
  const photo = await waitForCapture();

  // 3.3. Renomear automaticamente
  const filename = `${student.number}_${student.name}.jpg`;

  // 3.4. Upload
  await uploadToR2(photo, filename);

  // 3.5. Salvar no banco
  await savePhoto({
    studentId: student.id,
    sessionId: session.id,
    filename,
  });

  // 3.6. Próximo aluno
  advanceToNext();
}
```

---

## 📚 Recursos

- [gPhoto2 Manual](http://www.gphoto.org/doc/manual/)
- [Nikon D780 na lista suportada](http://www.gphoto.org/proj/libgphoto2/support.php)
- [Documentação completa](./CAMERA_TETHERING_SOLUTION.md)

---

## ✨ Status

**Servidor**: ✅ Rodando em http://localhost:3000
**Página de teste**: http://localhost:3000/camera-test
**gPhoto2**: ⚠️ Precisa instalar manualmente
**Câmera D780**: ⚠️ Precisa conectar para testar

---

**Última atualização**: 2025-12-13
**Desenvolvido por**: Snap-Self Team
