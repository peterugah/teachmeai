import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Sse,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { AskDto, ResponseDto } from '@shared/types';
import { RespondDtoValidator, askValidator } from './search.validator';
import { DatabaseService } from 'src/database/database.service';
import { Language } from '@shared/languageEnum';
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly databaseService: DatabaseService,
  ) { }

  @Post('')
  // TODO: check if the item already exists, if so, the return it
  async askPost(@Body(new ZodValidationPipe(askValidator)) data: AskDto) {
    const response = await this.databaseService.ask.create({
      data: {
        ...data,
        userId: data.userId,
      },
      select: {
        id: true,
      },
    });
    return response;
  }

  @Patch('')
  async addResponse(
    @Body(new ZodValidationPipe(RespondDtoValidator)) data: ResponseDto,
  ) {
    await this.databaseService.ask.findFirstOrThrow({
      where: { id: data.askId },
    });
    return this.databaseService.response.create({
      data,
      select: {
        id: true,
      },
    });
  }

  @Sse(':id')
  @Get(':id')
  async askGet(@Param('id', ParseIntPipe) id: number) {
    const data = await this.databaseService.ask.findFirstOrThrow({
      where: { id },
    });
    return this.searchService.question({
      context: data.context,
      language: data.language as Language,
      searchTerm: data.searchTerm,
    });
  }

  @Sse('conversation/:id')
  @Get('conversation/:id')
  async askConversation(@Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.databaseService.ask.findFirstOrThrow({
      where: { id },
      include: {
        responses: true,
      },
    });

    const responses = [...data.responses].reverse();
    let searchTerm = '';

    for (let i = 0; i < responses.length; i++) {
      if (responses[i].type === 'user') {
        searchTerm = responses[i].content;
        responses.splice(i, 1);
        break;
      }
    }

    const finalResponses = responses.reverse();
    return this.searchService.conversation(
      {
        searchTerm,
        context: data.context,
        language: data.language as Language,
      },
      finalResponses as ResponseDto[],
    );
  }
}
