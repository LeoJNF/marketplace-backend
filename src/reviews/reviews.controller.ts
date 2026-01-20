import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Só logado avalia
  create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.reviewsService.create(createReviewDto, req.user); // Passa o usuário logado
  }

  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.reviewsService.findByService(serviceId);
  }
}
