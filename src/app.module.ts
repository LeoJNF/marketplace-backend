import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // <--- Mudou aqui
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptionService } from './common/encryption/encryption.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // 1. Variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conexão com o Banco de Dados (Híbrida) 🧠
    TypeOrmModule.forRoot({
      // Se tem URL (Nuvem), vira Postgres. Se não (PC), vira SQLite.
      type: process.env.DATABASE_URL ? 'postgres' : 'sqlite',

      database: process.env.DATABASE_URL ? undefined : 'database.sqlite',
      url: process.env.DATABASE_URL,

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,

      // O SSL é obrigatório no Render, mas proibido no SQLite local.
      // Essa lógica resolve, e o 'as TypeOrmModuleOptions' abaixo acalma o erro vermelho.
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    } as TypeOrmModuleOptions), // <--- O SEGREDO: ISSO CORRIGE O ERRO VERMELHO

    // 3. Módulos do sistema
    UsersModule,
    AuthModule,
    ServicesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EncryptionService],
})
export class AppModule {}
