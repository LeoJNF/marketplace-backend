import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { EncryptionService } from '../common/encryption/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, EncryptionService],
  exports: [UsersService], // Importante exportar se formos usar o Auth depois
})
export class UsersModule {}
