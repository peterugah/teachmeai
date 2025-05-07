import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { translateValidator } from './translation.validator';
import { TranslateDto } from '@shared/types';
import { TranslationService } from './translation.service';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) { }
  @Post('')
  async translate(
    @Body(new ZodValidationPipe(translateValidator)) data: TranslateDto,
  ) {
    const response = await this.translationService.translate(data);
    Logger.debug({ response: JSON.parse(response) });
    return response;
  }
}
