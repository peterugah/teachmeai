import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SearchModule, DatabaseModule, EnvModule, UserModule],
})
export class AppModule { }
