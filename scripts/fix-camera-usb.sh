#!/bin/bash

# Script para liberar câmera USB do GVFS
# Use sempre que a câmera estiver "ocupada"

echo "🔧 Liberando câmera USB..."

# Finalizar processos GVFS que prendem a câmera
killall gvfs-gphoto2-volume-monitor 2>/dev/null
killall gvfsd-gphoto2 2>/dev/null
killall gvfsd 2>/dev/null

echo "✅ Processos finalizados"

# Testar detecção
echo ""
echo "📸 Testando detecção..."
gphoto2 --auto-detect

echo ""
echo "✨ Pronto! Câmera liberada para uso."
