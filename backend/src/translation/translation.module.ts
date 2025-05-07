import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [TranslationService],
  controllers: [TranslationController],
  imports: [HttpModule],
})
export class TranslationModule { }
