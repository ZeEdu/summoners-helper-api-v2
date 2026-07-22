/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser = require('cookie-parser');
import { ValidationError } from 'class-validator';

class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(validationErrors)
  }
}

const validationExceptionFactory = (errors: ValidationError[]) => {
  function formatError(errors: ValidationError[]) {
    const errMsg: Record<string, any[]> = {}

    errors.forEach(error => {
      if (error.children?.length) {
        errMsg[error.property] = [formatError(error.children)]
      } else if (error.constraints) {
        errMsg[error.property] = [...Object.values(error.constraints)]
      }
    })

    return errMsg
  }

  return new ValidationException(formatError(errors))
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: 'http://localhost:19000' });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
