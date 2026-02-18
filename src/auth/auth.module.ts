import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    // Define o padrão como JWT para evitar confusão
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // 👇 ESSA CHAVE TEM QUE SER IGUAL A DA STRATEGY
      secret: 'CHAVE_SUPER_SECRETA_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
