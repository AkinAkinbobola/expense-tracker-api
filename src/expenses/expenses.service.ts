import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { addDays, endOfDay, formatDate, startOfDay, subMonths } from 'date-fns';

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
        updatedAt: new Date(),
      },
    });

    if (!updated) throw new BadRequestException('Error updating expense');
    return updated;
  }

  async getExpensesByUserId(
    id: string,
    filter?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const user = await this.authService.getUser(id);

    if (!user) throw new NotFoundException('User not found');

    let dateFilter = null;

    if (
      filter === 'last_week' ||
      filter === 'last_month' ||
      filter === 'last_3_months'
    ) {
      dateFilter = this.getDateFilter(filter);
      return this.prismaService.expense.findMany({
        where: {
          userId: user.id,
          createdAt: dateFilter,
        },
      });
    } else if (filter === 'custom' && startDate && endDate) {
      dateFilter = this.getDateFilter(filter, startDate, endDate);
      return this.prismaService.expense.findMany({
        where: {
          userId: user.id,
          createdAt: dateFilter,
        },
      });
    }

    return this.prismaService.expense.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  private getDateFilter(filter: string, startDate?: string, endDate?: string) {
    let dateFilter = {};

    const today = new Date();
    const lastWeek = addDays(today, -7);
    const lastMonth = subMonths(today, 1);
    const last3Months = subMonths(today, 3);

    switch (filter) {
      case 'last_week':
        dateFilter = {
          gte: startOfDay(lastWeek),
          lte: endOfDay(today),
        };
        break;

      case 'last_month':
        dateFilter = {
          gte: startOfDay(lastMonth),
          lte: endOfDay(today),
        };
        break;

      case 'last_3_months':
        dateFilter = {
          gte: startOfDay(last3Months),
          lte: endOfDay(today),
        };
        break;

      case 'custom':
        if (startDate && endDate) {
          dateFilter = {
            gte: startOfDay(
              formatDate(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            ),
            lte: endOfDay(formatDate(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")),
          };
        }
        break;

      default:
        return {};
    }

    return dateFilter;
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

  private async checkUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
