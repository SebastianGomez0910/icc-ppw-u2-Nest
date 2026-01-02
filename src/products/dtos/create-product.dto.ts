import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Elprecio no puede ser negativo' })
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;
}
