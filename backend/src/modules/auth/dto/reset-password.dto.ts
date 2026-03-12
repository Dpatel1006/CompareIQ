import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'random-token', description: 'Reset password token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newPassword123', description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
