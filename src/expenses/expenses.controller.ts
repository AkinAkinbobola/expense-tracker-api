import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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

  @Delete('/:id')
  deleteExpense(@Param('id') id: string) {
    return this.expensesService.deleteExpense(id);
  }

  @Put('/:id')
  updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Get('/:userId')
  getExpensesByUserId(@Param('userId') userId: string) {
    return this.expensesService.getExpenses(userId);
  }
}
