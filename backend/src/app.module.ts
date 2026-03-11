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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    AiModule,
    ComparisonsModule,
    RedisModule,
    BillingModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
