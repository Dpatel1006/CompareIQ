import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Neon hostname can't be resolved by the local DNS server.
// We pre-resolve it via 8.8.8.8 (44.198.216.75) and connect directly to the IP
// while passing the original hostname as the TLS SNI servername so Neon routes correctly.
const NEON_HOST = 'ep-muddy-brook-adthn5yu.c-2.us-east-1.aws.neon.tech';
const NEON_RESOLVED_IP = '44.198.216.75'; // resolved from 8.8.8.8

function buildPool(): Pool {
  return new Pool({
    host: NEON_RESOLVED_IP,
    port: 5432,
    user: 'neondb_owner',
    password: 'npg_L0iECelGKHA2',
    database: 'neondb',
    ssl: {
      rejectUnauthorized: false,
      servername: NEON_HOST,
    },
    max: 10,
  });
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg(buildPool());
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
