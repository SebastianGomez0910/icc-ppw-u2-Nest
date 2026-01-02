import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const entities = await this.userRepository.find();
    return entities
      .map((e) => User.fromEntity(e))
      .map((user) => user.toResponseDto());
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return User.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('El emailya esta registrado');
    }
    const user = User.fromDto(dto);
    const entity = user.toEntity();
    const saved = await this.userRepository.save(entity);

    return User.fromEntity(saved).toResponseDto();
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = User.fromEntity(entity).update(dto).toEntity();

    const saved = await this.userRepository.save(updated);

    return User.fromEntity(saved).toResponseDto();
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateUserDto,
  ): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = User.fromEntity(entity).partialUpdate(dto).toEntity();

    const saved = await this.userRepository.save(updated);

    return User.fromEntity(saved).toResponseDto();
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
