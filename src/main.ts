import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // const reflector = new Reflector();
  // app.useGlobalGuards(new AtGuard(reflector));

  await app.listen(3000);
}
bootstrap();
// sk_test_51NKGgJKzWnBrJ6HvJ0to91OYOjv4z7Kmc5ie9K2goyy5tEyDgIX1HHQGpvxtnMd1tZqOCNjXyNLwiOj9Q8eOiHMD00UrinBoeB
//pk_test_51NKGgJKzWnBrJ6Hvd2kKSMnR98esk7xuOhNXb6C7dBTeqty9YMzM8ZVad4ON47wdiPD9nPFnvXOpPzTWACoRWE7800HHv3O8DQ
