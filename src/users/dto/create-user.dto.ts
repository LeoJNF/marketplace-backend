import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional() // Não é obrigatório
  @IsString()
  whatsapp?: string;

  @IsEnum(UserRole, { message: 'O tipo deve ser CLIENT ou VIDEOMAKER' })
  role: UserRole;
}
