import { IsInt, IsString, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsString()
  comment: string;

  @IsUUID()
  serviceId: string; // <--- Essencial para ligar a Review ao Serviço
}
