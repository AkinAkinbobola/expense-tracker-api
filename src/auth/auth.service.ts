import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { decodePassword, encodePassword } from '../utils/bcrypt';
import { AuthPayload } from './dtos/auth-payload';
import { JwtService } from '@nestjs/jwt';

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

  async validateUser({ email, password }: AuthPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Email or password is wrong');

    const passwordMatch = await decodePassword(password, user.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Email or password is wrong');

    return this.generateUserTokens(user.id)
  }

  generateUserTokens = async (userId: string) => {
    const access_token = this.jwtService.sign({ userId }, { expiresIn: '1h' });

    return {
      access_token,
    }
  };
}
