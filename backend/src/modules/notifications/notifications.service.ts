import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../common/mail/mail.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // Run every Monday at 9 AM
  @Cron('0 9 * * 1')
  async handleWeeklyDigest() {
    this.logger.log('Starting weekly digest job...');
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      // Find all users who made at least one comparison in the last week
      const users = await this.prisma.user.findMany({
        where: {
          comparisons: {
            some: {
              createdAt: {
                gte: oneWeekAgo,
              },
            },
          },
        },
        include: {
          comparisons: {
            where: {
              createdAt: {
                gte: oneWeekAgo,
              },
            },
            include: {
              products: true,
            },
          },
        },
      });

      this.logger.log(`Found ${users.length} users for weekly digest.`);

      for (const user of users) {
        if (!user.email) continue;

        const count = user.comparisons.length;

        // Find top categories
        const categoriesMap = new Map<string, number>();
        user.comparisons.forEach((comp) => {
          comp.products.forEach((prod) => {
            const cat = prod.category || 'General';
            categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1);
          });
        });

        const sortedCategories = Array.from(categoriesMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map((entry) => entry[0]);

        await this.mailService.sendWeeklyDigestEmail(
          user.email,
          user.name || '',
          {
            totalComparisons: count,
            topCategories: sortedCategories,
          },
        );
      }
      this.logger.log('Weekly digest job completed successfully.');
    } catch (error) {
      this.logger.error('Error running weekly digest', error);
    }
  }
}
