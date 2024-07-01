import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createExpense(
    data: Prisma.ExpenseCreateWithoutUserInput,
    userId: string,
  ) {
    const expense = await this.prismaService.expense.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (!expense) throw new BadRequestException('Bad request');

    return expense;
  }

  async deleteExpense(id: string) {
    await this.prismaService.expense.delete({
      where: {
        id,
      },
    });
    return '';
  }

  async updateExpense(id: string, data: Prisma.ExpenseUpdateWithoutUserInput) {
    const updated = await this.prismaService.expense.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    if (!updated) throw new BadRequestException('Error updating expense');
    return updated;
  }

  async getExpenses(id: string) {
    const user = await this.authService.getUser(id);

    if (!user) throw new NotFoundException('User not found');

    return this.prismaService.expense.findMany({
      where: {
        userId: user.id,
      },
    });
  }
}
