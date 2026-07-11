import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';

  async generate(_request: AIRequest): Promise<AIResponse> {
    return {
      provider: this.name,
      output: 'OpenAI provider is configured as an abstraction and is not integrated yet.',
      metadata: { integrated: false },
    };
  }
}
