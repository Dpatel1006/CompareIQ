import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall system stats' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get list of users' })
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getUsers(parseInt(page, 10), parseInt(limit, 10));
  }

  @Get('comparisons')
  @ApiOperation({ summary: 'Get list of all comparisons' })
  async getComparisons(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getComparisons(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
