import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaResponse, TranslateDto } from '@shared/types';
import { firstValueFrom } from 'rxjs';
import { EnvEnum } from 'src/env/enn.enum';

@Injectable()
export class TranslationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }
  translationPrompt(payload: TranslateDto) {
    return `
      You are a professional multilingual translation assistant.

      Your task is to translate only the "value" fields in the "translations" array into the language specified in the "language" field. Translate with accuracy, fluency, and confidence — using the most appropriate, natural phrasing for the target language.

      ⚠️ Strict instructions:
      - Always return ONLY a valid JSON object — do NOT wrap it in backticks, markdown, or any other formatting.
      - Do NOT prefix the output with any words or sentences — return the valid json object only.
      - The JSON must exactly match this TypeScript structure:
        interface TranslationDto {
          key: string;
          value: string;
        }

        interface TranslateDto {
          language: string;
          translations: TranslationDto[];
        }

      - Only translate the "value" fields. Do not change the keys or structure.

      Here is the input:
      ${JSON.stringify(payload, null, 2)}
`;
  }

  async translate(payload: TranslateDto) {
    const prompt = this.translationPrompt(payload);
    const { data } = await firstValueFrom(
      this.httpService.post<OllamaResponse>(
        `${this.configService.get(EnvEnum.OLLAMA_BASE_URL)}/api/generate`,
        {
          prompt,
          stream: false,
          model: this.configService.get<string>(EnvEnum.OLLAMA_LLM_MODEL),
        },
        {
          responseType: 'json',
        },
      ),
    );
    return data.response;
  }
}
