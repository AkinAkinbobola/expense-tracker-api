import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { decodePassword, encodePassword } from '../utils/bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { SerializedUser } from '../serializers';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(data: Prisma.UserCreateInput) {
    const emailInUser = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailInUser) throw new BadRequestException('Email already in use');

    const { password: rawPassword, ...userDetails } = data;
    const password = await encodePassword(rawPassword);
    return this.prismaService.user.create({
      data: {
        ...userDetails,
        password,
      },
    });
  }

  async validateUser({ email, password }: LoginUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Email or password is wrong');

    const passwordMatch = await decodePassword(password, user.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Email or password is wrong');

    const tokens = await this.generateUserTokens(user.id);

    return {
      userId: user.id,
      ...tokens,
    };
  }

  generateUserTokens = async (userId: string) => {
    const access_token = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refresh_token = uuidv4();

    await this.storeRefreshToken(refresh_token, userId);
    return {
      access_token,
      refresh_token,
    };
  };

  storeRefreshToken = async (token: string, userId: string) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.prismaService.refreshToken.update({
      data: {
        token,
        userId,
        expiryDate,
      },
      where: {
        userId: userId,
      },
    });
  };

  async refreshToken(data: Prisma.RefreshTokenWhereInput) {
    const token = await this.prismaService.refreshToken.findFirst({
      where: {
        token: data.token,
        expiryDate: {
          gte: new Date(),
        },
      },
    });

    if (!token) throw new UnauthorizedException('Unauthorized token');

    return this.generateUserTokens(token.userId);
  }

  async getUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return new SerializedUser(user);
  }
}
