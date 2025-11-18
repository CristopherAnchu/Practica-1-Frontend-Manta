import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDatabase } from './seed';
import { DataSource } from 'typeorm';

async function runSeed() {
  console.log('🚀 Iniciando proceso de seed...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await seedDatabase(dataSource);
    console.log('\n✨ Proceso de seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el proceso de seed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

runSeed()
  .then(() => {
    console.log('👋 Finalizando...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
