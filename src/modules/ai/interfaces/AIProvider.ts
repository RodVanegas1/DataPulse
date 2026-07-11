export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
  language?: 'es' | 'en' | 'fr' | 'pt';
  conversationId?: string;
  memory?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
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
