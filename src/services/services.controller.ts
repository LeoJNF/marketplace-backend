import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '../users/entities/user.entity';

interface AuthRequest {
  user: User;
}

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // 👇 NOVO MÉTODO: Busca serviços de um prestador específico
  // Deve vir ANTES do @Get(':id') para não confundir as rotas
  @Get('provider/:id')
  findByProvider(@Param('id') id: string) {
    return this.servicesService.findByProvider(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          // 👇 GARANTINDO A EXTENSÃO MP4
          let ext = extname(file.originalname);
          if (!ext || ext === '.blob') {
            ext = '.mp4';
          }

          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const createServiceDto = new CreateServiceDto();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createServiceDto.title = body.title;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createServiceDto.description = body.description;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createServiceDto.category = body.category;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createServiceDto.location = body.location;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createServiceDto.coverUrl = body.coverUrl;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const parsedPrice = Number(body.price);
    createServiceDto.price = isNaN(parsedPrice) ? 0 : parsedPrice;

    if (file) {
      createServiceDto.videoUrl = file.filename;
    }

    console.log('Recebido:', createServiceDto);

    return this.servicesService.create(createServiceDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: AuthRequest,
  ) {
    return this.servicesService.update(id, updateServiceDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.servicesService.remove(id, req.user.id);
  }
}
