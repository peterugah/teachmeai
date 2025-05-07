import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as fs from 'fs';
async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('certs/key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
    },
  });

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  app.enableCors();

  await app
    .listen(process.env.PORT ?? 3000)
    .then(() => {
      Logger.debug(`LISTENING ON PORT ${PORT}`);
    })
    .catch((err) => {
      Logger.error(err);
    });
}
void bootstrap();
