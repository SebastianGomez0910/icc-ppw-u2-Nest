import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toEntity(id: number, dto: CreateUserDto | UpdateUserDto): User {
    return new User(id, dto.name, dto.email, '1234');
  }

  static toResponse(entity: User): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
    };
  }
}
