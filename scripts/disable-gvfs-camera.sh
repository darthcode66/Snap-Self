#!/bin/bash

# Script para desabilitar GVFS permanentemente para câmeras
# Isso permite que gPhoto2 funcione sem interferência

echo "🔧 Desabilitando GVFS para câmeras..."

# Método 1: Renomear executável
if [ -f /usr/lib/gvfs/gvfs-gphoto2-volume-monitor ]; then
    sudo chmod -x /usr/lib/gvfs/gvfs-gphoto2-volume-monitor
    echo "✅ GVFS gphoto2-volume-monitor desabilitado"
fi

if [ -f /usr/lib/gvfs/gvfsd-gphoto2 ]; then
    sudo chmod -x /usr/lib/gvfs/gvfsd-gphoto2
    echo "✅ GVFS gphoto2 daemon desabilitado"
fi

# Método 2: Matar processos
killall gvfs-gphoto2-volume-monitor 2>/dev/null
killall gvfsd-gphoto2 2>/dev/null
echo "✅ Processos GVFS finalizados"

# Método 3: Criar regra udev para prevenir auto-mount
echo 'ACTION=="add", SUBSYSTEM=="usb", ATTRS{idVendor}=="04b0", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/90-gphoto.rules > /dev/null
sudo udevadm control --reload-rules
echo "✅ Regra udev criada"

echo ""
echo "✨ GVFS desabilitado! Reconecte a câmera para aplicar mudanças."
echo ""
echo "Para reverter (reabilitar GVFS):"
echo "  sudo chmod +x /usr/lib/gvfs/gvfs-gphoto2-volume-monitor"
echo "  sudo chmod +x /usr/lib/gvfs/gvfsd-gphoto2"
