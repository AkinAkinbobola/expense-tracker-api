import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    await this.checkUser(userId);

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
    const expense = await this.prismaService.expense.findUnique({
      where: {
        id,
      },
    });

    if (!expense) throw new NotFoundException('Expense not found');

    await this.prismaService.expense.delete({
      where: {
        id,
      },
    });
    return '';
  }

  async updateExpense(id: string, data: Prisma.ExpenseUpdateWithoutUserInput) {
    const expense = await this.prismaService.expense.findUnique({
      where: {
        id,
      },
    });

    if (!expense) throw new UnauthorizedException('Expense not found');

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

  async getExpenseById(id: string) {
    const expense = await this.prismaService.expense.findUnique({
      where: {
        id,
      },
    });

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async checkUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
