import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, Like, LessThanOrEqual, FindOptionsWhere } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, user: User) {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      provider: user, // Conecta o serviço ao usuário
    });

    return this.serviceRepository.save(service);
  }

  // --- MÉTODO ATUALIZADO: BUSCA COM FILTROS 🔍 ---
  async findAll(
    category?: string,
    maxPrice?: number,
    location?: string,
    search?: string,
  ) {
    // 1. Cria o objeto de filtros vazio (tipado corretamente)
    const where: FindOptionsWhere<Service> = {};

    // 2. Aplica os filtros se eles existirem
    if (category) {
      where.category = Like(`%${category}%`); // Busca partes da palavra
    }

    if (maxPrice) {
      where.price = LessThanOrEqual(maxPrice); // Preço menor ou igual
    }

    if (location) {
      where.location = Like(`%${location}%`); // Região aproximada
    }

    if (search) {
      where.title = Like(`%${search}%`); // Busca no título
    }

    // 3. Executa a busca com os filtros e a ordenação
    return this.serviceRepository.find({
      where, // Aqui entram os filtros criados acima
      relations: ['provider'],
      order: {
        provider: {
          plan: 'DESC', // PRO primeiro
        },
        views: 'DESC', // Mais vistos depois (critério de desempate)
      },
    });
  }

  // --- MEUS SERVIÇOS (DASHBOARD) ---
  async findMyServices(userId: string) {
    return this.serviceRepository.find({
      where: {
        provider: { id: userId }, // Filtra pelo ID do dono
      },
      relations: ['provider'],
      order: { createdAt: 'DESC' }, // Mais novos primeiro
    });
  }

  // --- BUSCAR UM (+ VIEW + 404) ---
  async findOne(id: string) {
    // 1. Busca primeiro
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    // 2. Valida se existe
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // 3. Incrementa visualização
    await this.serviceRepository.increment({ id }, 'views', 1);

    return service;
  }

  // --- EDITAR (COM SEGURANÇA) ---
  async update(id: string, updateServiceDto: any, userId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (service.provider.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este serviço!',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.serviceRepository.update(id, updateServiceDto);
    return this.serviceRepository.findOne({ where: { id } });
  }

  // --- REMOVER (COM SEGURANÇA) ---
  async remove(id: string, userId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (service.provider.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para apagar este serviço!',
      );
    }

    await this.serviceRepository.delete(id);
    return { message: 'Serviço removido com sucesso' };
  }

  // --- REGISTRAR LEAD (CLIQUE NO ZAP) 📈 ---
  async registerClick(id: string) {
    const service = await this.serviceRepository.findOne({ where: { id } });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    await this.serviceRepository.increment({ id }, 'whatsappClicks', 1);

    return {
      message: 'Lead contabilizado!',
      leads: service.whatsappClicks + 1,
    };
  }
}
