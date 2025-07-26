import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, NestApplicationOptions } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as fs from 'fs';
async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const isLocal = process.env.NODE_ENV === 'local';

  /** only use the certificate when working locally */
  const httpsOptions: NestApplicationOptions = isLocal
    ? {
      httpsOptions: {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem'),
      },
    } : {};

  const app = await NestFactory.create(AppModule, httpsOptions);

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  app.enableCors();

  await app
    .listen(process.env.PORT || 3000)
    .then(() => {
      Logger.debug(`LISTENING ON PORT ${PORT}`);
    })
    .catch((err) => {
      Logger.error(err);
    });
}
void bootstrap();
