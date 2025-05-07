import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { TranslationModule } from './translation/translation.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SearchModule, DatabaseModule, EnvModule, TranslationModule],
})
export class AppModule { }
