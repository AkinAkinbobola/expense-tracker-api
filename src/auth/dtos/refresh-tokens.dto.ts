import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokensDto {
  @IsString()
  @ApiProperty({ example: '814c9b95-21da-42d1-b0e2-b03272665ccd' })
  token: string;
}
