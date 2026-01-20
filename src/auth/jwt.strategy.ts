import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. Pega o token do cabeçalho Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Não aceita tokens vencidos
      ignoreExpiration: false,
      // 3. Usa a senha do .env para verificar se o token é legítimo
      // O "as string" garante ao TS que a chave existe
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  // Se o token for válido, essa função roda e devolve os dados do usuário
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    // O que retornarmos aqui vai ficar disponível em "req.user" nas rotas
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
