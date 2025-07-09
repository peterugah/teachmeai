import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { OllamaEmbeddings } from '@langchain/ollama';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from 'src/env/enn.enum';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';

@Injectable()
export class VectorStoreService {
  private vectorStore: HNSWLib;

  constructor(private readonly configService: ConfigService) { }

  chunkText(
    text: string,
    maxChunkSize: number = 500,
    overlapSize: number = 50,
  ): string[] {
    const chunks: string[] = [];
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    let start = 0;
    while (start < cleanedText.length) {
      const end = Math.min(start + maxChunkSize, cleanedText.length);
      const chunk = cleanedText.slice(start, end).trim();
      chunks.push(chunk);
      start += maxChunkSize - overlapSize;
    }
    return chunks;
  }

  async indexPageContent(context: string) {
    const chunks = this.chunkText(context);
    const docs = chunks.map((chunk) => new Document({ pageContent: chunk }));

    const response = await HNSWLib.fromDocuments(
      docs,
      new OllamaEmbeddings({
        model: this.configService.get(EnvEnum.OLLAMA_EMBEDDING_MODEL),
        baseUrl: this.configService.get(EnvEnum.OLLAMA_BASE_URL),
      }),
    );
    this.vectorStore = response;
  }

  async retrieveRelevantContent(query: string, k = 3) {
    const results = await this.vectorStore.similaritySearch(query, k);
    return results.map((doc) => doc.pageContent).join('\n');
  }
}
