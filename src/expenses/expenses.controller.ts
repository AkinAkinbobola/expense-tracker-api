import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  getExpensesByUserId(@Param('userId') userId: string) {
    return this.expensesService.getExpenses(userId);
  }

  @Get('/:expenseId/expense')
  getExpenseById(@Param('expenseId') expenseId: string) {
    return this.expensesService.getExpenseById(expenseId);
  }
}
