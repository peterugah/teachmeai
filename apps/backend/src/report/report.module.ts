import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [DatabaseModule]
})
export class ReportModule { }
