import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // REMOVIDO O SINAL DE MAIS (+) AQUI 👇
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    // REMOVIDO O SINAL DE MAIS (+) AQUI 👇
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // REMOVIDO O SINAL DE MAIS (+) AQUI 👇
    return this.usersService.remove(id);
  }

  // Rota de teste para virar PRO
  @Patch(':id/upgrade')
  async upgradeToPro(@Param('id') id: string) {
    // Aqui já estava certo (sem o +), mantivemos assim
    return this.usersService.update(id, { plan: 'PRO' } as any);
  }
}
