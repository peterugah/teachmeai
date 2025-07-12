import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '@shared/types';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReportService {
  constructor(private readonly databaseService: DatabaseService) {

  }
  add(data: CreateReportDto) {
    return this.databaseService.reports.create({
      data,
      select: {
        id: true
      }
    })
  }

}
