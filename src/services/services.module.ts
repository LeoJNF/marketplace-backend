import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { User } from '../users/entities/user.entity'; // <--- Importe o User

@Module({
  // 👇 AQUI ESTÁ O SEGREDO: Adicione "User" na lista
  imports: [TypeOrmModule.forFeature([Service, User])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
