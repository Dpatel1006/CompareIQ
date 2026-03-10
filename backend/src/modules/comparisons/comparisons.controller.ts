import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Comparisons')
@Controller('comparisons')
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new AI comparison' })
  async create(
    @Body() dto: CreateComparisonDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.comparisonsService.create(dto, userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated comparison history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.comparisonsService.findAll(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
      category,
    );
  }

  @Get('share/:token')
  @Public()
  @ApiOperation({ summary: 'Get a shared comparison (public)' })
  async findByShareToken(@Param('token') token: string) {
    return this.comparisonsService.findByShareToken(token);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single comparison by ID' })
  async findById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.comparisonsService.findById(id, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a comparison' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.comparisonsService.delete(id, userId);
  }

  @Patch(':id/share')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make a comparison public and get share token' })
  async makePublic(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.comparisonsService.makePublic(id, userId);
  }
}
