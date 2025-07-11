import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentVariablesValidator } from './env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: environmentVariablesValidator,
    }),
  ],
})
export class EnvModule { }
