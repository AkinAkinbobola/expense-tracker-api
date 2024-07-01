import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('')
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    const { userId, ...data } = createExpenseDto;
    return this.expensesService.createExpense(data, userId);
  }

  @Delete('/:expenseId')
  deleteExpense(@Param('expenseId') expenseId: string) {
    return this.expensesService.deleteExpense(expenseId);
  }

  @Put('/:expenseId')
  updateExpense(
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(expenseId, updateExpenseDto);
  }

  @Get('/:userId/user')
  getExpensesByUserId(
    @Param('userId') userId: string,
    @Query('filter') filter?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getExpensesByUserId(
      userId,
      filter,
      startDate,
      endDate,
    );
  }

  @Get('/:expenseId/expense')
  getExpenseById(@Param('expenseId') expenseId: string) {
    return this.expensesService.getExpenseById(expenseId);
  }
}
