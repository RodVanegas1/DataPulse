import { describe, expect, it } from 'vitest';

process.env.DATABASE_URL ??= 'postgresql://tip_user:tip_password@localhost:5432/territorial_intelligence?schema=public';

describe('AIEngine', () => {
  it('returns a provider-normalized response', async () => {
    const [{ AIEngine }, { MockProvider }] = await Promise.all([
      import('../modules/ai/services/AIEngine'),
      import('../modules/ai/providers/MockProvider'),
    ]);
    const engine = new AIEngine(new MockProvider());
    const response = await engine.generate({ prompt: 'Compare tourism regions', language: 'en' });

    expect(response.provider).toBe('mock');
    expect(response.output).toContain('Compare tourism regions');
    expect(response.metadata.language).toBe('en');
  });
});
