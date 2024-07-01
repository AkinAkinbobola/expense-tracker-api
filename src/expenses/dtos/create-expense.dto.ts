import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsDateString()
  date: Date;

  @IsEnum(Category)
  category: Category;

  @IsString()
  userId: string;
}
