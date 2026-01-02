import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;
}
