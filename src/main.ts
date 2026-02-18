import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 👇 AQUI ESTÁ A SOLUÇÃO DO LOGIN/CADASTRO
  app.enableCors({
    origin: '*', // Libera para Web (localhost:8081) e Celular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(3000);
  console.log('🚀 Backend rodando na porta 3000 com CORS liberado!');
}
void bootstrap();
