import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  stars: number; // 1 a 5

  @Column('text')
  comment: string;

  // Quem avaliou? (Cliente)
  @ManyToOne(() => User, { eager: true })
  client: User;

  // Qual serviço?
  @ManyToOne(() => Service, (service) => service.reviews)
  service: Service;

  @CreateDateColumn()
  createdAt: Date;
}
