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
  ) { }

  async create(dto: CreateComparisonDto, userId?: string) {
    this.logger.log(
      `Creating comparison for: ${dto.productNames.join(', ')}`,
    );

    // 1. Find or create products
    const productIds = await Promise.all(
      dto.productNames.map((name) => this.productsService.findOrCreateByName(name)),
    );

    // 2. Call AI for comparison
    const aiResult = await this.aiService.compareProducts(
      dto.productNames,
      dto.preferences,
    );

    // 3. Map winnerId to actual Product ID if possible
    let winnerId = aiResult.winner;
    if (winnerId.startsWith('product') && winnerId !== 'tie') {
      const charCode = winnerId.charAt(7).toUpperCase().charCodeAt(0);
      const index = charCode - 65; // A -> 0, B -> 1, C -> 2, D -> 3
      if (productIds[index]) {
        winnerId = productIds[index];
      }
    }

    // 4. Save comparison to database
    const comparison = await this.prisma.comparison.create({
      data: {
        userId: userId || null,
        products: {
          connect: productIds.map((id) => ({ id })),
        },
        preferences: (dto.preferences as any) || null,
        result: aiResult as any,
        winnerId,
      },
      include: {
        products: true,
      },
    });

    return {
      ...comparison,
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
      where.products = {
        some: {
          name: { contains: search, mode: 'insensitive' },
        },
      };
    }

    if (category) {
      where.products = {
        some: {
          category: { contains: category, mode: 'insensitive' },
        },
      };
    }

    const comparisons = await this.prisma.comparison.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        products: true,
      },
    });

    const total = await this.prisma.comparison.count({ where });

    return {
      data: comparisons.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, userId?: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
      include: {
        products: true,
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
      products: comparison.products,
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

  async getRelated(id: string, limit = 3) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!comparison) return [];

    const category = (comparison.result as any)?.category || 'general';
    const productIds = comparison.products.map(p => p.id);

    const related = await this.prisma.comparison.findMany({
      where: {
        id: { not: id },
        OR: [
          { products: { some: { category } } },
          { products: { some: { id: { in: productIds } } } },
        ],
      },
      include: {
        products: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return related.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async findByShareToken(token: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { shareToken: token },
      include: {
        products: true,
      },
    });

    if (!comparison || !comparison.isPublic) {
      throw new NotFoundException('Comparison not found');
    }

    return {
      ...comparison,
      createdAt: comparison.createdAt.toISOString(),
    };
  }
}
