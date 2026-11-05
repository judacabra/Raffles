
import { NestFactory } from '@nestjs/core';
import { Logger, } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import fastifyEtag from '@fastify/etag';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { RawServerDefault } from 'fastify';

async function bootstrap() {
  const app: NestFastifyApplication<RawServerDefault> = 
    await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.setGlobalPrefix('api');
 
  await app.register(fastifyMultipart);
  await app.register(fastifyEtag);

  await app.register(fastifyStatic, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/', 
  });

  app.enableShutdownHooks();

  const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const origin: any[] = [
    process.env.CORS_LOCAL_ORIGIN,
    process.env.CORS_LOCAL_IP_ORIGIN,
    process.env.CORS_LOCAL_IP2_ORIGIN,
  ];

  const methods: any[] = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'];

  const allowedHeaders: any[] = [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
  ];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      // Permitir cualquier subdominio de BASE_DOMAIN
      const base = process.env.BASE_DOMAIN || 'rifaspro.local';
      if (origin.endsWith(base) || origin.includes(base + ':')) {
        return cb(null, true);
      }
      return origin && origin.startsWith('http://192.168.1.') // dev en red local
        ? cb(null, true)
        : cb(new Error('Not allowed by CORS'), false);
    },
    methods,
    allowedHeaders,
    exposedHeaders: ['Authorization', 'Content-Disposition'],
    // credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port: number = Number(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0');

  const url: string = await app.getUrl();
  new Logger('Bootstrap').log(`Application is running on ${url}`);
}

void bootstrap();
