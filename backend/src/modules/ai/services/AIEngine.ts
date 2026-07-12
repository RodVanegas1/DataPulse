import { config } from '../../../config/env';
import { AIProvider, AIRequest } from '../interfaces/AIProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { LocalProvider } from '../providers/LocalProvider';
import { MockProvider } from '../providers/MockProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';

export class AIEngine {
  private readonly provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider ?? this.resolveProvider();
  }

  generate(request: AIRequest) {
    return this.provider.generate(request);
  }

  private resolveProvider(): AIProvider {
    switch (config.AI_PROVIDER) {
      case 'openai':
      case 'openrouter':
        return new OpenAIProvider();
      case 'gemini':
        return new GeminiProvider();
      case 'ollama':
      case 'lmstudio':
      case 'local':
        return new LocalProvider();
      case 'mock':
      default:
        return new MockProvider();
    }
  }
}
