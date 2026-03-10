import { IsString, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: { budget: 'under $500', priorities: ['battery life', 'camera'] },
  })
  @IsOptional()
  @IsObject()
  preferences?: {
    budget?: string;
    priorities?: string[];
    useCase?: string;
  };
}
