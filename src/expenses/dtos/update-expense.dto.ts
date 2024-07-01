import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from './create-expense.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExpenseDto {
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  @ApiProperty({ example: 99.99 })
  @IsOptional()
  amount: number;

  @IsString()
  @ApiProperty({ example: 'A description of an expense' })
  @IsOptional()
  description: string;

  @IsDate()
  @ApiProperty({ example: '2024-07-16T00:00:00.000Z' })
  @IsOptional()
  date: Date;

  @IsEnum(Category)
  @IsOptional()
  category: Category;
}
