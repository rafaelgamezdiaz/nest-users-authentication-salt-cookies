import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

const CookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.use(CookieSession({
    keys: ['Move this secret words to .env file']
  }));
  await app.listen(3000);
}
bootstrap();
