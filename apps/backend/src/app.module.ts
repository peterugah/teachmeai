import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [SearchModule, DatabaseModule, EnvModule, UserModule, ReportModule],
})
export class AppModule { }
