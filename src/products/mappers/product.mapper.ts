import { Product } from '../entities/product.entity';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

export class ProductMapper {
  static toEntity(
    id: number,
    dto: CreateProductDto | UpdateProductDto,
  ): Product {
    return new Product(id, dto.name, dto.price);
  }

  static toResponse(entity: Product): ProductResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
    };
  }
}
