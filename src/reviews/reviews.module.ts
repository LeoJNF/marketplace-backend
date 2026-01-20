import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importante
import { Review } from './entities/review.entity'; // <--- Importante

@Module({
  imports: [TypeOrmModule.forFeature([Review])], // <--- O Segredo: Libera o Repository
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
