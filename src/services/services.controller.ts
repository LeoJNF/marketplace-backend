import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // 🔒 Rota Protegida: Criar Serviço
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createServiceDto: CreateServiceDto, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.servicesService.create(createServiceDto, req.user);
  }

  // 🌍 Rota Pública: Listar Serviços (Com Filtros e Busca) 🔍
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('maxPrice') maxPrice?: string, // Vem como string da URL
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    // Converte o preço para número se ele existir na URL
    const priceNumber = maxPrice ? parseFloat(maxPrice) : undefined;

    return this.servicesService.findAll(
      category,
      priceNumber,
      location,
      search,
    );
  }

  // 🔒 Rota Privada: Meus Serviços (Dashboard)
  @Get('my-services')
  @UseGuards(AuthGuard('jwt'))
  findMyServices(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.servicesService.findMyServices(req.user.id);
  }

  // 🌍 Rota Pública: Ver Detalhes (+1 View)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // 🔒 Editar Serviço (Só o dono)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: any,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.servicesService.update(id, updateServiceDto, req.user.id);
  }

  // 🔒 Apagar Serviço (Só o dono)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.servicesService.remove(id, req.user.id);
  }
  @Patch(':id/click-whatsapp')
  clickWhatsapp(@Param('id') id: string) {
    return this.servicesService.registerClick(id);
  }
}
