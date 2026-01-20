import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'O título deve ser um texto' })
  @IsNotEmpty({ message: 'O título do serviço é obrigatório' })
  title: string;

  @IsString({ message: 'A descrição deve ser um texto' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  price: number;

  @IsString({ message: 'A categoria deve ser um texto' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;
}
