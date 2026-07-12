import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';
import { config } from '../../../config/env';

export class LocalProvider implements AIProvider {
  readonly name = config.AI_PROVIDER === 'lmstudio' ? 'lmstudio' : 'ollama';

  async generate(request: AIRequest): Promise<AIResponse> {
    if (this.name === 'lmstudio') {
      return this.generateWithOpenAiCompatible(request, `${config.LMSTUDIO_BASE_URL}/v1/chat/completions`, config.LMSTUDIO_MODEL);
    }

    const response = await globalThis.fetch(`${config.OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: config.OLLAMA_MODEL,
        prompt: this.buildPrompt(request),
        stream: false,
      }),
    });

    if (!response.ok) {
      return this.unavailable(request, `Local Ollama endpoint returned HTTP ${response.status}`);
    }

    const payload = (await response.json()) as { response?: string; model?: string };
    return {
      provider: this.name,
      output: payload.response ?? '',
      metadata: { integrated: true, model: payload.model ?? config.OLLAMA_MODEL, conversationId: request.conversationId ?? null },
    };
  }

  private async generateWithOpenAiCompatible(request: AIRequest, url: string, model: string): Promise<AIResponse> {
    const response = await globalThis.fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [...(request.memory ?? []), { role: 'user', content: this.buildPrompt(request) }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return this.unavailable(request, `Local OpenAI-compatible endpoint returned HTTP ${response.status}`);
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return {
      provider: this.name,
      output: payload.choices?.[0]?.message?.content ?? '',
      metadata: { integrated: true, model, conversationId: request.conversationId ?? null },
    };
  }

  private buildPrompt(request: AIRequest) {
    return [
      `Language: ${request.language ?? 'es'}`,
      'You are a territorial intelligence assistant for El Salvador.',
      request.context ? `Context JSON: ${JSON.stringify(request.context)}` : null,
      `Question: ${request.prompt}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private unavailable(request: AIRequest, reason: string): AIResponse {
    return {
      provider: this.name,
      output: `Local AI provider is configured but unavailable. Prompt received: ${request.prompt}`,
      metadata: { integrated: false, reason, conversationId: request.conversationId ?? null },
    };
  }
}
