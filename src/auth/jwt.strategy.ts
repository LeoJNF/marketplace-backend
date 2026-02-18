import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 👇 TEM QUE SER A MESMA DO AUTH.MODULE.TS (Copie e Cole se precisar)
      secretOrKey: 'CHAVE_SUPER_SECRETA_123',
    });
  }

  async validate(payload: any) {
    // Se esse log aparecer, a chave está certa!
    console.log('--- VALIDANDO TOKEN ---');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('ID no Token:', payload.sub || payload.id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const id = payload.sub || payload.id;

    if (!id) {
      throw new UnauthorizedException('Token sem ID');
    }

    // Buscamos o usuário no banco
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/await-thenable
    const user: User = (await this.usersService.findOne(id)) as any;

    if (!user) {
      console.log('FALHA: Usuário não achado no banco.');
      throw new UnauthorizedException('Usuário não existe');
    }

    console.log('SUCESSO: Usuário encontrado:', user.email);
    return user;
  }
}
