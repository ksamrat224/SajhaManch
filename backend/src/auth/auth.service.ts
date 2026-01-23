import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { updateProfileDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const { password, ...userWithoutPassword } = user;
    const token = await this.jwtService.signAsync(userWithoutPassword);
    return { token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: loginDto.username,
          },
          {
            mobile: loginDto.username,
          },
        ],
      },
    });
    if (!user) {
      throw new NotFoundException('unable to find user');
    }
    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const { password, ...userWithoutPassword } = user;
    const token = await this.jwtService.signAsync(userWithoutPassword);
    return { token };
  }

  async profile(userId: number) {
    return this.usersService.findOne(userId);
  }

  async updateProfile(userId: number, updateProfileDto: updateProfileDto) {
    return this.usersService.update(userId, updateProfileDto);
  }
}
