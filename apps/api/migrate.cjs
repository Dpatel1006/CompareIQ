// Run: node migrate.cjs
const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4.bind(
  Object.assign(Object.create(dns), { servers: ['8.8.8.8', '8.8.4.4'] })
));

// Use a custom resolver pointing at 8.8.8.8
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);
const resolveCustom = (host) => new Promise((res, rej) =>
  resolver.resolve4(host, (err, addrs) => err ? rej(err) : res(addrs))
);

const { Client } = require('pg');
require('dotenv').config();

const sql = `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Tier') THEN
    CREATE TYPE "Tier" AS ENUM ('FREE', 'PRO', 'TEAM');
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "tier" "Tier" NOT NULL DEFAULT 'FREE',
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "specs" JSONB NOT NULL,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "sourceUrl" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Comparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "productAId" TEXT NOT NULL,
    "productBId" TEXT NOT NULL,
    "preferences" JSONB,
    "result" JSONB NOT NULL,
    "winnerId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX IF NOT EXISTS "Comparison_shareToken_key" ON "Comparison"("shareToken");

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Comparison_userId_fkey'
  ) THEN
    ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Comparison_productAId_fkey'
  ) THEN
    ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_productAId_fkey"
      FOREIGN KEY ("productAId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Comparison_productBId_fkey'
  ) THEN
    ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_productBId_fkey"
      FOREIGN KEY ("productBId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
`;

async function migrate() {
  // Parse the connection URL
  const rawUrl = (process.env.DIRECT_URL || process.env.DATABASE_URL)
    .replace('channel_binding=require&', '')
    .replace('&channel_binding=require', '')
    .replace('channel_binding=require', '');

  const parsed = new URL(rawUrl);
  const hostname = parsed.hostname;

  console.log(`Resolving ${hostname} via Google DNS 8.8.8.8...`);
  let ip;
  try {
    const addrs = await resolveCustom(hostname);
    ip = addrs[0];
    console.log(`Resolved to ${ip}`);
  } catch (err) {
    console.error('DNS resolution failed:', err.message);
    process.exit(1);
  }

  // Swap hostname for IP, keep SNI via ssl.servername
  console.log('Connecting via pg...');
  const client = new Client({
    host: ip,
    port: parseInt(parsed.port) || 5432,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    ssl: {
      rejectUnauthorized: false,
      servername: hostname,
    },
  });

  try {
    await client.connect();
    console.log('Connected! Running migration...');
    await client.query(sql);
    console.log('✅ Migration complete — all tables created.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
