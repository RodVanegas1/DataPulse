import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';
import { config } from '../../../config/env';

export class OpenAIProvider implements AIProvider {
  readonly name = config.AI_PROVIDER === 'openrouter' ? 'openrouter' : 'openai-compatible';

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!config.OPENROUTER_API_KEY) {
      return {
        provider: this.name,
        output: `OpenRouter-compatible provider selected but OPENROUTER_API_KEY is not configured. Prompt received: ${request.prompt}`,
        metadata: { integrated: false, model: config.OPENROUTER_MODEL },
      };
    }

    const response = await globalThis.fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: config.OPENROUTER_MODEL,
        messages: [...(request.memory ?? []), { role: 'user', content: request.prompt }],
      }),
    });

    if (!response.ok) {
      return {
        provider: this.name,
        output: `OpenRouter request failed with HTTP ${response.status}.`,
        metadata: { integrated: false, model: config.OPENROUTER_MODEL },
      };
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return {
      provider: this.name,
      output: payload.choices?.[0]?.message?.content ?? '',
      metadata: { integrated: true, model: config.OPENROUTER_MODEL, conversationId: request.conversationId ?? null },
    };
  }
}
