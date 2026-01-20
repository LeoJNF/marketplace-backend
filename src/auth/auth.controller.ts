import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // 1. Valida se o usuário existe e a senha bate
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // 2. Se não encontrar, lança erro
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // 3. Se deu certo, gera e retorna o Token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.login(user);
  }

  // --- NOVA ROTA: PERFIL DO USUÁRIO ---
  @UseGuards(AuthGuard('jwt')) // 🔒 Só entra com Token válido
  @Get('profile')
  getProfile(@Request() req: any) {
    // O Guardião (JwtStrategy) já validou o token e colocou os dados em "req.user"
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
