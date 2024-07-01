import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from './create-expense.dto';

export class UpdateExpenseDto {
  @IsDecimal()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsDate()
  @IsOptional()
  date: Date;

  @IsEnum(Category)
  @IsOptional()
  category: Category;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
