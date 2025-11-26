import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  //dependency injection
  constructor(private readonly prisma: PrismaClient) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('This email has already been taken');
    }
    user = await this.prisma.user.findUnique({
      where: { mobile: createUserDto.mobile },
    });
    if (user) {
      throw new BadRequestException(
        'This mobile number has already been taken',
      );
    }
    createUserDto.password = await hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user: User | null;
    await this.findOne(id);

    if (updateUserDto.email) {
      user = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (user && user.id != id) {
        throw new BadRequestException('This email is already registered');
      }
    }
    if (updateUserDto.mobile) {
      user = await this.prisma.user.findUnique({
        where: { mobile: updateUserDto.mobile },
      });
      if (user && user.id != id) {
        throw new BadRequestException(
          'This mobile no. has already been registered',
        );
      }
    }
    user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
