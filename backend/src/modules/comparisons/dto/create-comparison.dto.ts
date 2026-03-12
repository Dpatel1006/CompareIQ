import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComparisonDto {
  @ApiProperty({
    example: ['iPhone 15 Pro', 'Samsung Galaxy S24 Ultra'],
    description: 'List of products to compare (2-4)',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  productNames: string[];

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
