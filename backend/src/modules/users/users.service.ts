import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      preferences: user.preferences,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.preferences && { preferences: dto.preferences as any }),
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      preferences: user.preferences,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async delete(id: string) {
    await this.prisma.comparison.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Account deleted successfully' };
  }

  async getStats(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalComparisons, thisMonth, savedCount] = await Promise.all([
      this.prisma.comparison.count({ where: { userId } }),
      this.prisma.comparison.count({
        where: {
          userId,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.comparison.count({
        where: {
          userId,
          isPublic: true,
        },
      }),
    ]);

    return { totalComparisons, thisMonth, savedCount };
  }
}
