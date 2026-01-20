import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  VIDEOMAKER = 'VIDEOMAKER',
}

// --- NOVO ENUM PARA OS PLANOS ---
export enum UserPlan {
  FREE = 'FREE',
  PRO = 'PRO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true }) // Pode ficar vazio se o cara não tiver
  whatsapp: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true }) // Foto de Perfil (URL)
  avatar: string;

  @Column({ type: 'text', nullable: true }) // Bio (Pode ser textão)
  bio: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  cpfEncrypted: string;

  @Column({ select: false })
  cpfHashIndex: string;

  @Column()
  role: string;

  // --- NOVA COLUNA: O PLANO ---
  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.FREE, // Todo mundo nasce Free
  })
  plan: UserPlan;

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
