#!/bin/bash

echo "🚀 Iniciando servicios de Docker para Examen 2P..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está instalado. Por favor instala docker-compose primero."
    exit 1
fi

echo "📦 Levantando contenedores..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

echo ""
echo "✅ Servicios iniciados correctamente!"
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "🌐 URLs de Acceso:"
echo "   • PostgreSQL: localhost:5433"
echo "   • RabbitMQ: http://localhost:15672 (admin/admin)"
echo "   • n8n: http://localhost:5678"
echo ""
echo "📝 Siguiente paso:"
echo "   cd exam2p-servicio-auditoria && npm install && npm run start:dev"
