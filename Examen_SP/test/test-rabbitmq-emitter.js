const amqp = require('amqplib');

async function sendTestEvent() {
  let connection;
  let channel;

  try {
    console.log('🔌 Connecting to RabbitMQ...');
    connection = await amqp.connect('amqp://admin:admin@localhost:5672');
    channel = await connection.createChannel();

    const queue = 'exam2p.record.deleted';

    // Ensure queue exists
    await channel.assertQueue(queue, {
      durable: true
    });

    // Test message
    const message = {
      entity: 'Product',
      recordId: 999,
      action: 'DELETE',
      user: 'test@example.com',
      detail: 'Deletion test from RabbitMQ - Test Script'
    };

    // NestJS format: include pattern
    const nestJSMessage = {
      pattern: 'exam2p.record.deleted',
      data: message
    };

    // Send message
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(nestJSMessage)), {
      persistent: true
    });

    console.log('✅ Event sent successfully to queue:', queue);
    console.log('📦 Message:', JSON.stringify(message, null, 2));
    console.log('\n🎯 Wait a few seconds and verify:');
    console.log('   1. Exam2P Audit microservice log');
    console.log('   2. Record in PostgreSQL database');
    console.log('   3. n8n log (webhook received)');
    console.log('   4. Telegram notification');

    // Close connection after a small delay
    setTimeout(() => {
      channel.close();
      connection.close();
      console.log('\n🔌 Connection closed');
      process.exit(0);
    }, 500);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (channel) await channel.close();
    if (connection) await connection.close();
    
    process.exit(1);
  }
}

sendTestEvent();
