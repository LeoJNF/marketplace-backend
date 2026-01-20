import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EncryptionService } from '../common/encryption/encryption.service';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encryptionService: EncryptionService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, cpf, ...userData } = createUserDto;

    // 1. Hash da Senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Criptografar CPF
    const cpfEncrypted = this.encryptionService.encrypt(cpf);

    // 3. Índice Cego
    const cpfHashIndex = createHash('sha256').update(cpf).digest('hex');

    // 4. Verificar duplicidade
    const cpfExists = await this.userRepository.findOne({
      where: { cpfHashIndex },
    });
    if (cpfExists) {
      throw new ConflictException('CPF já cadastrado no sistema.');
    }

    // 5. Criar a instância
    const user = this.userRepository.create({
      ...userData,
      password: passwordHash,
      cpfEncrypted,
      cpfHashIndex,
    });

    try {
      // 6. Salvar no Banco
      await this.userRepository.save(user);

      // 7. Limpar dados sensíveis
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, cpfHashIndex, cpfEncrypted, ...result } = user;

      return result;
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        throw new ConflictException('Este e-mail já está em uso.');
      }
      throw new InternalServerErrorException('Erro ao processar o cadastro.');
    }
  }

  // --- LOGIN ---
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  findAll() {
    return [];
  }

  // MUDAMOS AQUI: id agora é string 👇
  findOne(id: string) {
    return `User #${id}`;
  }

  async update(id: string, updateUserDto: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  // MUDAMOS AQUI: id agora é string 👇
  remove(id: string) {
    return `Remove #${id}`;
  }
}
