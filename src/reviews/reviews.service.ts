import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, client: User) {
    // Aqui você poderia verificar se o serviço existe, mas vamos simplificar
    const review = this.reviewRepository.create({
      stars: createReviewDto.stars,
      comment: createReviewDto.comment,
      service: { id: createReviewDto.serviceId }, // Associa pelo ID
      client: client,
    });

    return this.reviewRepository.save(review);
  }

  async findByService(serviceId: string) {
    return this.reviewRepository.find({
      where: { service: { id: serviceId } },
      order: { createdAt: 'DESC' },
    });
  }
}
