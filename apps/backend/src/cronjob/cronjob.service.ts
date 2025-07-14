
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CronjobService implements OnModuleInit {
  private readonly logger = new Logger(CronjobService.name)
  onModuleInit() {
  }

  constructor(private readonly databaseService: DatabaseService) { }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteOldRecors() {
    this.logger.debug("Fetching records for deletion");
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // current time minus 1 hour
    const records = await this.databaseService.ask.findMany({
      take: 100, // get first 100 records
      orderBy: { id: "asc" },

      where: {
        createdAt: {
          lt: oneHourAgo
        },
      },
      include: {
        responses: {
          select: {
            id: true,
          }
        },
      },
    })
    this.logger.debug(`${records.length} records loaded for deletion`);
    for (const record of records) {
      const responseIds = record.responses.reduce((a, item) => [...a, item.id], [] as number[]);
      try {
        await this.databaseService.response.deleteMany({ where: { id: { in: responseIds } } });
        this.logger.debug(`Successfully deleted responses for ask id: ${record.id}`)
        await this.databaseService.ask.delete({ where: { id: record.id } })
      } catch (error) {
        this.logger.error(`Error deleting records for askId: ${record.id}`, { error })
      }
    }
  }
}
