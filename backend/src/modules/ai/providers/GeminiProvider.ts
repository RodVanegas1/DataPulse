import { AIProvider, AIRequest, AIResponse } from '../interfaces/AIProvider';
import { config } from '../../../config/env';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!config.GEMINI_API_KEY) {
      return {
        provider: this.name,
        output: `Gemini provider selected but GEMINI_API_KEY is not configured. Prompt received: ${request.prompt}`,
        metadata: { integrated: false, model: config.GEMINI_MODEL },
      };
    }

    const response = await globalThis.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: request.prompt }] }],
        }),
      },
    );

    if (!response.ok) {
      return {
        provider: this.name,
        output: `Gemini request failed with HTTP ${response.status}.`,
        metadata: { integrated: false, model: config.GEMINI_MODEL },
      };
    }

    const payload = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return {
      provider: this.name,
      output: payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '',
      metadata: { integrated: true, model: config.GEMINI_MODEL, conversationId: request.conversationId ?? null },
    };
  }
}
