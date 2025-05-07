import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AskDto, ResponseDto } from '@shared/types';
import { Observable } from 'rxjs';
import { OllamaModelResponse } from './search.types';
import { END_OF_SSE_EVENT } from '@shared/constants';
import { VectorStoreService } from './vectorStore.service';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from 'src/env/enn.enum';

@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly vectorStoreService: VectorStoreService,
    private readonly configService: ConfigService,
  ) { }

  private streamResponse(prompt: string) {
    return new Observable<string>((observer) => {
      const request = this.httpService.post(
        `${this.configService.get(EnvEnum.OLLAMA_BASE_URL)}/api/generate`,
        {
          prompt,
          stream: true,
          model: this.configService.get<string>(EnvEnum.OLLAMA_LLM_MODEL),
        },
        {
          responseType: 'stream',
        },
      );

      request.subscribe({
        next: (res) => {
          res.data.on('data', (chunk) => {
            const lines: string[] = chunk.toString('utf-8').split('\n');
            const object: OllamaModelResponse = JSON.parse(lines[0]);
            observer.next(object.response);
          });
          res.data.on('end', () => {
            observer.next(END_OF_SSE_EVENT);
            observer.complete();
          });
          res.data.on('error', (err) => {
            Logger.error('error from ollama read ', err);
            observer.error('Unable to respond at this time');
          });
        },
        error: (err) => {
          Logger.error('error from ollama read two', err);
        },
      });
    });
  }
  private constructFirstQuestionPrompt(payload: AskDto) {
    return `
      You will receive a block of webpage content. A phrase will be marked as "<SELECTED_TEXT>", with possible multiple occurrences—**focus only on the last one**.

      Your task is to thoroughly interpret and explain the phrase "<SELECTED_TEXT>" **based on the context**, even if it requires some reasonable inference.

      Instructions:
      - **Assume** the surrounding context is sufficient unless it is clearly fragmented or missing.
      - Write a **confident, detailed, and thoughtful explanation** of the phrase.
      - Expand on its meaning, implications, or connections to nearby content.
      - Use **Markdown formatting** (like **bold**, _italics_, bullet points) to make your explanation clear and structured.
      - Aim for at least 3–5 sentences. Be elaborate and insightful.
      - **Avoid hedging language** like "perhaps", "possibly", or "it seems". Be assertive and decisive in your explanation.
      - Do **not** ask follow-up questions.
      - Do **not** mention the selected phrase, its location, or refer to it explicitly.
      - Do **not** mention the context or source; just provide a natural explanation.

      Context:
      \`\`\`
      ${payload.context}
      \`\`\`

      Phrase to elaborate on:
      "${payload.searchTerm}"

      Return only the explanation in Markdown format.
`;
  }
  private buildConversationalPrompt(payload: {
    responses: ResponseDto[];
    searchTerm: string;
    context: string;
  }): string {
    const { responses, searchTerm, context } = payload;

    // Format conversation history clearly
    const formattedConversation = responses
      .map(
        (r) => `
          **${r.type === 'user' ? 'User' : 'AI'}:** 
          ${r.content.trim()}
        `,
      )
      .join('\n');

    return `
      You are a helpful and knowledgeable assistant in a deep conversation with a user. Your role is to provide thoughtful, grounded, and context-aware responses in a way that feels natural and human.

      ---

      ### Conversation History:
      ${formattedConversation}

      ---

      ### Background Context:
      \`\`\`
      ${context}
      \`\`\`

      ---

      ### User’s New Question:
      "${searchTerm}"

      ---

      ### Your Task:
      - Continue the conversation naturally and helpfully.
      - Use the context and prior conversation to answer.
      - Be **clear, confident, and insightful**.

      ### Rules:
      - Respond in a friendly, engaging tone — like a smart, thoughtful person.
      - Use **Markdown** (bold, italics, bullets) to improve readability.
      - Do **not** repeat or rephrase the user’s question.
      - Focus on **providing a meaningful and complete answer**.

      Return **only the answer**, formatted in Markdown.
`;
  }
  async conversation(payload: AskDto, responses: ResponseDto[]) {
    await this.vectorStoreService.indexPageContent(payload.context);
    const context = await this.vectorStoreService.retrieveRelevantContent(
      payload.searchTerm,
    );
    const prompt = this.buildConversationalPrompt({
      ...payload,
      context,
      responses,
    });

    return this.streamResponse(prompt);
  }
  async question(payload: AskDto) {
    await this.vectorStoreService.indexPageContent(payload.context);
    const context = await this.vectorStoreService.retrieveRelevantContent(
      payload.searchTerm,
    );
    const prompt = this.constructFirstQuestionPrompt({
      ...payload,
      context,
    });
    return this.streamResponse(prompt);
  }
}
