import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProductDto {
  @ApiProperty({ example: 'iPhone 15' })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiPropertyOptional({ example: 'electronics' })
  @IsOptional()
  @IsString()
  category?: string;
}
