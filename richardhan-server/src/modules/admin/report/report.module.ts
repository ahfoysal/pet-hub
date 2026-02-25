import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { AddReportService } from './add-report.service';
import { TakeActionService } from './take-action.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, AddReportService, TakeActionService],
})
export class ReportModule {}
