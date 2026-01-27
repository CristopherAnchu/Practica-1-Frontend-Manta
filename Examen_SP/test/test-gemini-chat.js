const axios = require('axios');

const API_GATEWAY_URL = 'http://localhost:3003/chat';

// Ejemplos de consultas en lenguaje natural
const ejemplos = [
  'Muéstrame los últimos 5 registros de auditoría',
  '¿Cuántos registros de auditoría hay?',
  'Dame información sobre las eliminaciones registradas',
  '¿Qué acciones se han registrado en el sistema?'
];

async function testGeminiChat() {
  console.log('🧪 Probando API Gateway con Gemini AI\n');

  try {
    // Seleccionar una consulta de ejemplo (puedes cambiar el índice)
    const consulta = ejemplos[0];

    console.log(`👤 Usuario: ${consulta}\n`);
    console.log('⏳ Esperando respuesta de Gemini...\n');

    const response = await axios.post(`${API_GATEWAY_URL}/chat`, {
      message: consulta
    });

    const { response: aiResponse, toolsUsed, iterations } = response.data;

    console.log('🤖 Gemini AI:');
    console.log(aiResponse);
    console.log('\n---\n');
    console.log(`📊 Tools usadas: ${toolsUsed ? 'Sí' : 'No'}`);
    console.log(`🔄 Iteraciones: ${iterations}`);
    console.log('\n✅ Prueba completada exitosamente\n');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Asegúrate de que el API Gateway esté corriendo:');
      console.error('   cd api-gateway && npm run start:dev');
    }
    
    process.exit(1);
  }
}

// Mostrar ejemplos disponibles
console.log('📝 Ejemplos de consultas disponibles:');
ejemplos.forEach((ej, i) => {
  console.log(`   ${i + 1}. "${ej}"`);
});
console.log('\n');

testGeminiChat();
