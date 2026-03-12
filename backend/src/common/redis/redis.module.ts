import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Simple in-memory cache that mirrors basic ioredis functionality
 * Used as a fallback when Redis is not available or disabled.
 */
class InMemoryRedis {
  private cache = new Map<string, { value: string; expiry: number | null }>();
  public status = 'ready';
  private readonly logger = new Logger('InMemoryRedis');

  get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return Promise.resolve(null);

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return Promise.resolve(null);
    }
    return Promise.resolve(item.value);
  }

  set(
    key: string,
    value: string,
    mode?: string,
    duration?: number,
  ): Promise<'OK'> {
    let expiry: number | null = null;
    if (mode === 'EX' && duration) {
      expiry = Date.now() + (duration * 1000);
    }
    this.cache.set(key, { value, expiry });
    return Promise.resolve('OK');
  }

  // Add other methods as needed to match ioredis signature used in the app
  on(_event: string, _callback: any) {
    // No-op for mock
  }
}

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('RedisModule');
        const isEnabled = configService.get<string>('REDIS_ENABLED') === 'true';
        const redisUrl = configService.get<string>('REDIS_URL');

        if (!isEnabled) {
          logger.log(
            'Redis is disabled in .env. Falling back to In-Memory cache.',
          );
          return new InMemoryRedis();
        }

        try {
          const client = new Redis(redisUrl || 'redis://localhost:6379', {
            maxRetriesPerRequest: 1, // Only try once initially
            connectTimeout: 2000,
            retryStrategy: (times) => {
              if (times > 3) {
                logger.error(
                  'Redis connection failed after 3 attempts. Switching to In-Memory.',
                );
                return null; // stop retrying
              }
              return Math.min(times * 500, 2000);
            },
          });

          client.on('error', (err) => {
            logger.warn(
              `Redis error: ${err.message}. App will remain functional.`,
            );
          });

          client.on('connect', () => {
            logger.log('✅ Redis connected successfully');
          });

          return client;
        } catch (_error) {
          logger.error(
            'Failed to initialize Redis client. Falling back to In-Memory.',
          );
          return new InMemoryRedis();
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
