# 📡 Configuração Wi-Fi - Nikon D780

## 🎯 Duas Formas de Conectar

### Opção 1: Wi-Fi (Sem Fio) ⭐ MAIS FLEXÍVEL
**Prós:**
- Sem cabos (mais mobilidade)
- Fotógrafo pode se movimentar livremente
- Ideal para sessões escolares

**Contras:**
- Mais lento que USB (3-5x)
- Configuração inicial mais complexa
- RAW files podem demorar mais

### Opção 2: USB (Com Fio)
**Prós:**
- Muito mais rápido
- Configuração simples (plug & play)
- Mais estável

**Contras:**
- Cabo limita movimento
- Precisa estar perto do computador

---

## 📡 Configuração Wi-Fi Passo a Passo

### Modo 1: Conexão Direta (Access Point) - RECOMENDADO PARA COMEÇAR

Este modo cria uma rede Wi-Fi própria da câmera que o computador se conecta.

#### Na Câmera D780:

1. **Ativar Wi-Fi**
   - Pressione `MENU`
   - Vá em `Setup Menu` (🔧)
   - Selecione `Connect to PC`
   - Escolha `Network settings`

2. **Criar Perfil**
   - Selecione `Create profile`
   - Nome do perfil: "Snap-Self" (ou outro nome)
   - Modo: `Direct connection to PC` ⭐

3. **Configurar Rede**
   - SSID (nome da rede): A câmera vai gerar (ex: "D780_12345")
   - Senha: A câmera vai gerar (anote essa senha!)
   - Modo: `Access Point`

4. **Ativar Conexão**
   - Volte ao menu `Connect to PC`
   - Selecione `Enable` ou `Start`
   - A câmera vai mostrar o SSID e senha na tela

#### No Computador:

1. **Conectar ao Wi-Fi da Câmera**
   ```bash
   # Abrir configurações de Wi-Fi
   # Procurar rede com nome: D780_xxxxx
   # Conectar usando a senha mostrada na câmera
   ```

2. **Verificar Conexão**
   ```bash
   # Listar dispositivos na rede
   ip neighbor show

   # Ou tentar ping (se souber o IP da câmera)
   ping 192.168.0.1  # IP padrão geralmente
   ```

3. **Testar com gPhoto2**
   ```bash
   # gPhoto2 suporta PTP/IP
   gphoto2 --auto-detect

   # Ou especificar PTP/IP diretamente
   gphoto2 --port ptpip:192.168.0.1 --summary
   ```

---

### Modo 2: Infraestrutura (Rede Wi-Fi Existente)

Conecta câmera e computador na mesma rede Wi-Fi (seu roteador).

#### Configuração:

1. **Na Câmera**
   - `Setup Menu` > `Connect to PC` > `Network settings`
   - Selecione `Infrastructure mode`
   - Escolha sua rede Wi-Fi caseira
   - Digite a senha da rede

2. **No Computador**
   - Já deve estar conectado à mesma rede Wi-Fi
   - Descobrir IP da câmera:
   ```bash
   # Escanear rede
   nmap -sn 192.168.0.0/24
   # Ou
   arp -a
   ```

3. **Conectar via PTP/IP**
   ```bash
   gphoto2 --port ptpip:192.168.0.XXX --summary
   ```

---

## 🔧 Software Necessário (Opcional)

### Wireless Transmitter Utility (Nikon)
Software oficial da Nikon para facilitar conexão.

**Download:**
- https://downloadcenter.nikonimglib.com/

**Instalação:**
```bash
# Ubuntu/Debian
wget https://path-to-nikon-software.deb
sudo dpkg -i nikon-wireless-utility.deb
```

---

## 🚀 Testando a Conexão

### 1. Verificar se Wi-Fi está ativo na câmera
Na tela da D780, deve aparecer ícone de Wi-Fi ativo.

### 2. Testar detecção
```bash
# Auto-detect (USB + rede)
gphoto2 --auto-detect

# Forçar PTP/IP
gphoto2 --port ptpip:192.168.0.1 --abilities

# Capturar foto de teste
gphoto2 --port ptpip:192.168.0.1 --capture-image-and-download
```

### 3. Ver informações da câmera
```bash
gphoto2 --port ptpip:192.168.0.1 --summary
```

---

## 💻 Atualizar Nosso Sistema

Nosso serviço gPhoto2 já suporta PTP/IP! Só precisamos permitir especificar a porta.

### Atualização no código:

```typescript
// src/lib/camera/gphoto2-service.ts
async detectCamera(port?: string): Promise<CameraInfo | null> {
  const portFlag = port ? `--port ${port}` : '';
  const { stdout } = await execAsync(`gphoto2 ${portFlag} --auto-detect`);
  // ...
}

async captureAndDownload(port?: string, downloadDir: string = '/tmp'): Promise<CaptureResult> {
  const portFlag = port ? `--port ${port}` : '';
  await execAsync(
    `gphoto2 ${portFlag} --capture-image-and-download --filename "${filepath}"`
  );
  // ...
}
```

### Uso:
```typescript
// USB (auto)
const camera = await gphoto2Service.detectCamera();

// Wi-Fi (especificar IP)
const camera = await gphoto2Service.detectCamera('ptpip:192.168.0.1');
```

---

## 📊 Comparação: Wi-Fi vs USB

| Aspecto | USB 3.0 | Wi-Fi |
|---------|---------|-------|
| **Velocidade JPEG (10MB)** | 1-2s | 3-5s |
| **Velocidade RAW (30MB)** | 3-5s | 10-15s |
| **Latência** | ~100ms | ~300-500ms |
| **Alcance** | 3-5m (cabo) | 10-30m (sem obstáculos) |
| **Mobilidade** | ❌ Limitada | ✅ Total |
| **Configuração** | ✅ Simples | ⚠️ Moderada |
| **Estabilidade** | ✅ Muito alta | ⚠️ Pode oscilar |

---

## 🎓 Recomendação para Fotografia Escolar

### Setup Ideal:
1. **Wi-Fi para mobilidade** durante a sessão
2. **JPEG apenas** (não RAW) para velocidade
3. **Computador fixo** com boa recepção Wi-Fi
4. **Access Point mode** (mais simples)

### Fluxo de Trabalho:
```
1. Ligar câmera → Wi-Fi ativa automaticamente
2. Computador conecta → Auto-detect
3. Fotógrafo se movimenta livremente
4. Cada foto → Upload automático (3-5s)
5. Sistema → Nomenclatura + organização
```

---

## ⚠️ Troubleshooting Wi-Fi

### Problema: Não encontra a rede da câmera
**Soluções:**
1. Verificar se Wi-Fi está ativo na câmera (ícone)
2. Desligar e ligar Wi-Fi do computador
3. Aproximar câmera do computador
4. Resetar configurações de rede da câmera

### Problema: Conecta mas não detecta com gPhoto2
**Soluções:**
```bash
# 1. Verificar IP da câmera
ip neighbor show

# 2. Tentar diferentes IPs
gphoto2 --port ptpip:192.168.0.1 --summary
gphoto2 --port ptpip:192.168.1.1 --summary

# 3. Verificar firewall
sudo ufw allow 15740  # Porta PTP/IP
```

### Problema: Muito lento
**Soluções:**
1. Usar JPEG em vez de RAW
2. Reduzir qualidade de imagem temporariamente
3. Aproximar câmera do computador
4. Usar USB para sessões grandes

---

## 🔍 Descobrir IP da Câmera

### Método 1: Menu da Câmera
- `Setup Menu` > `Connect to PC` > `Network settings`
- Ver `IP Address` no perfil ativo

### Método 2: Scan da Rede
```bash
# Instalar nmap
sudo apt-get install nmap

# Escanear rede
nmap -sn 192.168.0.0/24

# Ver dispositivos conectados
arp -a | grep -i nikon
```

### Método 3: Verificar conexões Wi-Fi
```bash
# Ver redes Wi-Fi ativas
nmcli device wifi list

# Ver conexão atual
nmcli connection show --active
```

---

## 📝 Próximos Passos

1. [ ] Conectar D780 ao Wi-Fi (modo Access Point)
2. [ ] Anotar SSID e senha da câmera
3. [ ] Conectar computador ao Wi-Fi da câmera
4. [ ] Testar `gphoto2 --auto-detect`
5. [ ] Testar captura via Wi-Fi
6. [ ] Comparar velocidade com USB
7. [ ] Atualizar código para suportar PTP/IP

---

**Quer que eu te ajude a configurar agora?**

Me diga quando estiver com a câmera ligada e vou te guiar passo a passo! 🚀
