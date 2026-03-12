import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalComparisons = await this.prisma.comparison.count();
    const totalProducts = await this.prisma.product.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeUsersToday = await this.prisma.comparison.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: today },
        userId: { not: null },
      },
    });

    const comparisonsToday = await this.prisma.comparison.count({
      where: { createdAt: { gte: today } },
    });

    return {
      totalUsers,
      totalComparisons,
      totalProducts,
      activeUsersToday: activeUsersToday.length,
      comparisonsToday,
    };
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          tier: true,
          role: true,
          createdAt: true,
          _count: { select: { comparisons: true } },
        } as any,
      }) as any,
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getComparisons(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.comparison.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          products: { select: { name: true } },
        },
      }),
      this.prisma.comparison.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
