import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // 🚀 Zmień '*' na dokładny adres frontendowy
    credentials: true, // ✅ Zezwól na ciasteczka
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Piast API')
    .setDescription('API for piastropczyce site')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
