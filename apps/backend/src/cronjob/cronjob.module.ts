import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  providers: [CronjobService],
  imports: [ScheduleModule.forRoot(), DatabaseModule]
})
export class CronjobModule { }
