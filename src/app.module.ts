import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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

    // 2. Conexão com o Banco de Dados
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        dropSchema: true,
      }),
    }),

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
