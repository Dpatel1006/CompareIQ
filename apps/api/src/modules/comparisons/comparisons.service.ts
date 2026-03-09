import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { ProductsService } from '../products/products.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class ComparisonsService {
  private readonly logger = new Logger(ComparisonsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreateComparisonDto, userId?: string) {
    this.logger.log(
      `Creating comparison: ${dto.productAName} vs ${dto.productBName}`,
    );

    // 1. Find or create products
    const [productAId, productBId] = await Promise.all([
      this.productsService.findOrCreateByName(dto.productAName),
      this.productsService.findOrCreateByName(dto.productBName),
    ]);

    // 2. Call AI for comparison
    const aiResult = await this.aiService.compareProducts(
      dto.productAName,
      dto.productBName,
      dto.preferences,
    );

    // 3. Determine winnerId
    let winnerId: string;
    if (aiResult.winner === 'productA') {
      winnerId = 'productA';
    } else if (aiResult.winner === 'productB') {
      winnerId = 'productB';
    } else {
      winnerId = 'tie';
    }

    // 4. Save comparison to database
    const comparison = await this.prisma.comparison.create({
      data: {
        userId: userId || null,
        productAId,
        productBId,
        preferences: dto.preferences as any || null,
        result: aiResult as any,
        winnerId,
      },
      include: {
        productA: true,
        productB: true,
      },
    });

    return {
      id: comparison.id,
      productA: comparison.productA,
      productB: comparison.productB,
      preferences: comparison.preferences,
      result: comparison.result,
      winnerId: comparison.winnerId,
      isPublic: comparison.isPublic,
      shareToken: comparison.shareToken,
      createdAt: comparison.createdAt.toISOString(),
    };
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 20,
    search?: string,
    category?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { productA: { name: { contains: search, mode: 'insensitive' } } },
        { productB: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      where.OR = [
        ...(where.OR || []),
        { productA: { category: { equals: category, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.comparison.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          productA: { select: { id: true, name: true, category: true, imageUrl: true } },
          productB: { select: { id: true, name: true, category: true, imageUrl: true } },
        },
      }),
      this.prisma.comparison.count({ where }),
    ]);

    return {
      data: data.map((c) => ({
        id: c.id,
        productAName: c.productA.name,
        productBName: c.productB.name,
        productAImage: c.productA.imageUrl,
        productBImage: c.productB.imageUrl,
        winner: c.winnerId,
        category: c.productA.category,
        createdAt: c.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, userId?: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
      include: {
        productA: true,
        productB: true,
      },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    // Check access: either owner, or public
    if (!comparison.isPublic && comparison.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: comparison.id,
      userId: comparison.userId,
      productA: comparison.productA,
      productB: comparison.productB,
      preferences: comparison.preferences,
      result: comparison.result,
      winnerId: comparison.winnerId,
      isPublic: comparison.isPublic,
      shareToken: comparison.shareToken,
      createdAt: comparison.createdAt.toISOString(),
    };
  }

  async delete(id: string, userId: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (comparison.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.comparison.delete({ where: { id } });

    return { message: 'Comparison deleted successfully' };
  }

  async makePublic(id: string, userId: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (comparison.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const shareToken = comparison.shareToken || randomBytes(16).toString('hex');

    const updated = await this.prisma.comparison.update({
      where: { id },
      data: {
        isPublic: true,
        shareToken,
      },
    });

    return { shareToken: updated.shareToken };
  }

  async findByShareToken(token: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { shareToken: token },
      include: {
        productA: true,
        productB: true,
      },
    });

    if (!comparison || !comparison.isPublic) {
      throw new NotFoundException('Comparison not found');
    }

    return {
      id: comparison.id,
      productA: comparison.productA,
      productB: comparison.productB,
      preferences: comparison.preferences,
      result: comparison.result,
      winnerId: comparison.winnerId,
      isPublic: comparison.isPublic,
      shareToken: comparison.shareToken,
      createdAt: comparison.createdAt.toISOString(),
    };
  }
}
