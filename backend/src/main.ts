import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── CORS ────────────────────────────────────────────────────────────────────
  // ALLOWED_ORIGIN is set in backend/.env (e.g. http://localhost:3000)
  // We also allow localhost:3000 as a hardcoded fallback so dev always works.
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    'http://localhost:3000', // always allow local frontend
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (curl, Postman, mobile apps, SSR)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin "${origin}" is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ── Global Pipes ─────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false, // collect ALL validation errors
    }),
  );

  // ── Global Filters & Interceptors ────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ── Swagger ──────────────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CompareIQ API')
    .setDescription('AI-powered product comparison API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ── Start ─────────────────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  console.log(`\n🚀 CompareIQ API running   → http://localhost:${port}`);
  console.log(`📚 Swagger docs            → http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS allowed origins    → ${allowedOrigins.join(', ')}\n`);
}

bootstrap();
