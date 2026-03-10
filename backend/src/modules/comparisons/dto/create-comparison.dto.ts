import { IsString, IsOptional, IsObject, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComparisonDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @MinLength(2)
  productAName: string;

  @ApiProperty({ example: 'Samsung Galaxy S24 Ultra' })
  @IsString()
  @MinLength(2)
  productBName: string;

  @ApiPropertyOptional({
    example: {
      budget: 'under $1000',
      priorities: ['camera quality', 'battery life'],
      useCase: 'daily driver phone',
    },
  })
  @IsOptional()
  @IsObject()
  preferences?: {
    budget?: string;
    priorities?: string[];
    useCase?: string;
  };
}
