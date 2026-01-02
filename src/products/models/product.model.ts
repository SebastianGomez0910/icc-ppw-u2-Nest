import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public descripcion: string,
    public precio: number,
    public stock: number,
    public createdAt: Date,
  ) {
    if (precio < 0) throw new Error('El precio no puede ser negativo');
    if (stock < 0) throw new Error('El stock no puede ser negativo');
  }

  static fromDto(dto: CreateProductDto): Product {
    return new Product(
      0,
      dto.name,
      dto.descripcion,
      dto.precio,
      dto.stock,
      new Date(),
    );
  }

  static fromEntity(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.descripcion,
      Number(entity.precio),
      entity.stock,
      entity.createdAt,
    );
  }

  toEntity(): ProductEntity {
    const entity = new ProductEntity();
    entity.id = this.id;
    entity.name = this.name;
    entity.descripcion = this.descripcion;
    entity.precio = this.precio;
    entity.stock = this.stock;
    return entity;
  }

  toResponseDto(): ProductResponseDto {
    return {
      id: this.id,
      name: this.name,
      descripcion: this.descripcion,
      precio: this.precio,
      stock: this.stock,
    };
  }

  update(dto: UpdateProductDto): Product {
    if (dto.name) this.name = dto.name;
    if (dto.descripcion) this.descripcion = dto.descripcion;
    if (dto.precio) this.precio = dto.precio;
    if (dto.stock) this.stock = dto.stock;
    return this;
  }
}
