import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async registerUser() {
    return "Register Users"
  }

  async loginUser() {
    return "Login User"
  }
}
