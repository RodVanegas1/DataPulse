import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';

export class LocalProvider implements AIProvider {
  readonly name = 'local';

  async generate(_request: AIRequest): Promise<AIResponse> {
    return {
      provider: this.name,
      output: 'Local provider is configured as an abstraction and is not integrated yet.',
      metadata: { integrated: false },
    };
  }
}
