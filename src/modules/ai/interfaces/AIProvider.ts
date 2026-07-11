export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
  language?: 'es' | 'en' | 'fr' | 'pt';
}

export interface AIResponse {
  provider: string;
  output: string;
  metadata: Record<string, unknown>;
}

export interface AIProvider {
  readonly name: string;
  generate(request: AIRequest): Promise<AIResponse>;
}
