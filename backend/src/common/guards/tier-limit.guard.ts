import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TIER_LIMITS } from '../../config/constants';

@Injectable()
export class TierLimitGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        // Get current user tier and comparison count for today
        const dbUser = await this.prisma.user.findUnique({
            where: { id: user.sub },
            select: { tier: true },
        });

        if (!dbUser) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const count = await this.prisma.comparison.count({
            where: {
                userId: user.sub,
                createdAt: {
                    gte: today,
                },
            },
        });

        const tier = dbUser.tier as keyof typeof TIER_LIMITS;
        const limit = TIER_LIMITS[tier].DAILY_LIMIT;

        if (count >= limit) {
            throw new ForbiddenException(
                `You have reached your daily limit of ${limit} comparisons for the ${tier} tier. Please upgrade to Pro for unlimited access.`,
            );
        }

        return true;
    }
}
