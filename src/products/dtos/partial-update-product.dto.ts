import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class PartialUpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;
}
