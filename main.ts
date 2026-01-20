import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Ativar Helmet (Headers de Segurança)
  app.use(helmet());

  // 2. Ativar Cookies Seguros (Para o Refresh Token)
  app.use(cookieParser());

  // 3. CORS (Restringir acesso apenas ao seu Frontend)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Mude para a porta do seu App/React
    credentials: true, // Permite envio de cookies
  });

  // 4. Validação Global (Whitelist remove campos que não estão no DTO)
  // Isso previne injeção de parâmetros indesejados
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
