import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // <--- Mudou aqui
import { ServeStaticModule } from '@nestjs/serve-static'; // 👈 Importe isso
import { join } from 'path'; // 👈 Importe isso
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptionService } from './common/encryption/encryption.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // 👇 1. MÓDULO DE ARQUIVOS ESTÁTICOS (ADICIONE ISSO AQUI)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Pega a pasta uploads na raiz
      serveRoot: '/uploads', // Cria a rota http://localhost:3000/uploads/
    }),

    // 2. Variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 3. Conexão com o Banco de Dados
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
      database: process.env.DATABASE_URL ? undefined : 'database.sqlite',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    } as TypeOrmModuleOptions),

    // 4. Módulos do sistema
    UsersModule,
    AuthModule,
    ServicesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EncryptionService],
})
export class AppModule {}
