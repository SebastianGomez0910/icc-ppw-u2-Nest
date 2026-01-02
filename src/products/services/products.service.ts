import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ConflictException } from 'src/exceptions/domain/conflict.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find();
    return entities
      .map((e) => Product.fromEntity(e))
      .map((p) => p.toResponseDto());
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return Product.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const existing = await this.productRepository.findOne({
      where: { name: dto.name },
    });

    if (existing)
      throw new ConflictException(`El producto ${dto.name} ya existe`);
    const newProduct = Product.fromDto(dto);
    const entity = newProduct.toEntity();
    const savedEntity = await this.productRepository.save(entity);
    return Product.fromEntity(savedEntity).toResponseDto();
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Product with ID ${id} not found`);

    const updatedModel = Product.fromEntity(entity).update(dto);
    const savedEntity = await this.productRepository.save(
      updatedModel.toEntity(),
    );
    return Product.fromEntity(savedEntity).toResponseDto();
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateProductDto,
  ): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Product with ID ${id} not found`);

    const updatedModel = Product.fromEntity(entity).update(dto as any);
    const savedEntity = await this.productRepository.save(
      updatedModel.toEntity(),
    );

    return Product.fromEntity(savedEntity).toResponseDto();
  }
}
