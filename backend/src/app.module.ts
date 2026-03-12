import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AiModule } from './modules/ai/ai.module';
import { ComparisonsModule } from './modules/comparisons/comparisons.module';
import { BillingModule } from './modules/billing/billing.module';
import { MailModule } from './common/mail/mail.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RedisModule } from './common/redis/redis.module';
import { AdminModule } from './modules/admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { loadAppConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadAppConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    AiModule,
    ComparisonsModule,
    RedisModule,
    BillingModule,
    MailModule,
    ScheduleModule.forRoot(),
    NotificationsModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
