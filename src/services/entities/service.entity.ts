import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany, // <--- ADICIONADO
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../reviews/entities/review.entity'; // <--- ADICIONADO

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 'Brasil' })
  location: string;

  // --- NOVIDADES DO FEED ---
  @Column({ nullable: true })
  coverUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  // --- KPI: CLIQUES NO ZAP ---
  @Column({ default: 0 })
  whatsappClicks: number;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => User, (user) => user.services)
  provider: User;

  // --- RELAÇÃO COM REVIEWS ---
  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
