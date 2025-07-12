import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { createReportValidator } from './report.validator';
import { CreateReportDto } from '@shared/types';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Post("")
  createReport(@Body(new ZodValidationPipe(createReportValidator)) data: CreateReportDto) {
    return this.reportService.add(data)
  }
}
