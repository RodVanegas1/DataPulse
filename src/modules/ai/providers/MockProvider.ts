import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';

export class MockProvider implements AIProvider {
  readonly name = 'mock';

  async generate(request: AIRequest): Promise<AIResponse> {
    return {
      provider: this.name,
      output: `Mock territorial intelligence response for: ${request.prompt}`,
      metadata: {
        language: request.language ?? 'es',
        contextKeys: Object.keys(request.context ?? {}),
      },
    };
  }
}
