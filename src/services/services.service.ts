import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 👇 LÓGICA NOVA IMPLEMENTADA CORRETAMENTE
  findByProvider(providerId: string) {
    return this.serviceRepository.find({
      where: { provider: { id: providerId } }, // Filtra pelo ID do dono
      relations: ['provider'], // Traz os dados do dono
      order: { createdAt: 'DESC' }, // Mais recentes primeiro
    });
  }

  async create(createServiceDto: CreateServiceDto, userId: string) {
    console.log('ID do usuário:', userId);

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(
        'Usuário não encontrado. Faça login novamente.',
      );
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      price: Number(createServiceDto.price),
      provider: user,
    });

    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find({
      relations: ['provider'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.serviceRepository.findOne({
      where: { id },
      relations: ['provider'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, updateServiceDto: UpdateServiceDto, _userId: string) {
    const dataToUpdate: any = { ...updateServiceDto };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dataToUpdate.price) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dataToUpdate.price = Number(dataToUpdate.price);
    }

    return this.serviceRepository.update(id, dataToUpdate);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(id: string, _userId: string) {
    return this.serviceRepository.delete(id);
  }
}
