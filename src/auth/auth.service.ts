import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { encodePassword } from '../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async registerUser(data: Prisma.UserCreateInput) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) throw new BadRequestException('User already exists');

    const { password: rawPassword, ...userDetails } = data;
    const password = await encodePassword(rawPassword);
    return this.prismaService.user.create({
      data: {
        ...userDetails,
        password,
      },
    });
  }

  async loginUser() {
    return 'Login User';
  }
}
