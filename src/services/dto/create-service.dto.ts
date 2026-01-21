import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  // --- CAMPOS NOVOS QUE ESTAVAM FALTANDO ---

  @IsString()
  @IsNotEmpty()
  category: string; // <--- O culpado do erro!

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;
}
