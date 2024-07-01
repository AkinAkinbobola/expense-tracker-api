import { IsDateString, IsDecimal, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Category {
  Groceries = 'Groceries',
  Leisure = 'Leisure',
  Electronics = 'Electronics',
  Utilities = 'Utilities',
  Clothing = 'Clothing',
  Health = 'Health',
  Others = 'Others',
}

export class CreateExpenseDto {
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  @ApiProperty({ example: 99.99 })
  amount: number;

  @IsString()
  @ApiProperty({ example: 'A description of an expense' })
  description: string;

  @IsDateString()
  @ApiProperty({ example: '2024-07-16T00:00:00.000Z' })
  date: Date;

  @IsEnum(Category)
  @ApiProperty({ enum: Category })
  category: Category;

  @IsString()
  @ApiProperty({ example: 'bd820dae-72ab-437c-a7da-62a92f60a6a1' })
  userId: string;
}
