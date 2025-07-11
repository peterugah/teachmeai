import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { SearchController } from './search.controller';
import { VectorStoreService } from './vectorStore.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService, VectorStoreService],
  imports: [HttpModule, DatabaseModule],
})
export class SearchModule { }
