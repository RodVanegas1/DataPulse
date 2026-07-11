import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';

  async generate(_request: AIRequest): Promise<AIResponse> {
    return {
      provider: this.name,
      output: 'Gemini provider is configured as an abstraction and is not integrated yet.',
      metadata: { integrated: false },
    };
  }
}
