import { FormEvent, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, CornerDownLeft, Eraser, MessageSquareText, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { PRODUCT_NAME } from '../../lib/brand';
import type { ChatMessage } from '../../lib/types';
import { Button } from '../ui/Button';

interface AssistantPanelProps {
  docked?: boolean;
  open: boolean;
  onClose: () => void;
}

export function AssistantPanel({ docked = false, open, onClose }: AssistantPanelProps) {
  const { t } = useTranslation();
  const prompts = [t('assistant.prompt_1'), t('assistant.prompt_2'), t('assistant.prompt_3')];

  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'assistant', content: '' }]);
  const displayMessages = messages.map((message) =>
    message.id === 'welcome' ? { ...message, content: t('assistant.welcome', { product: PRODUCT_NAME }) } : message,
  );
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const memory = useMemo(
    () =>
      messages
        .filter((message) => message.id !== 'welcome')
        .slice(-8)
        .map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  async function sendPrompt(prompt: string) {
    if (!prompt.trim() || typing) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: prompt.trim() };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);
    try {
      const response = await api.askAi(prompt, memory);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `${response.output}\n\n_${t('assistant.provider')}: ${response.provider}_`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendPrompt(input);
  }

  const body = (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-pulse-violet/20 text-pulse-violet">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-white">{t('assistant.title')}</h2>
            <p className="text-xs text-steel-500">{t('assistant.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label={t('assistant.clear')} icon={<Eraser size={16} />} onClick={() => setMessages(messages.slice(0, 1))} variant="icon" />
          {!docked && <Button aria-label={t('assistant.close')} icon={<X size={16} />} onClick={onClose} variant="icon" />}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {displayMessages.map((message) => (
          <article className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-pulse-cyan text-ink-950' : 'bg-white/7 text-steel-100'}`} key={message.id}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </article>
        ))}
        {typing && (
          <div className="inline-flex items-center gap-1 rounded-lg bg-white/7 px-3 py-2">
            <span className="typing-dot h-2 w-2 rounded-full bg-pulse-cyan" />
            <span className="typing-dot h-2 w-2 rounded-full bg-pulse-cyan" />
            <span className="typing-dot h-2 w-2 rounded-full bg-pulse-cyan" />
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-left text-xs text-steel-300 transition hover:border-pulse-cyan/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-pulse-cyan/50"
              disabled={typing}
              key={prompt}
              onClick={() => void sendPrompt(prompt)}
            >
              <Sparkles className="mr-1 inline" size={12} />
              {prompt}
            </button>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={submit}>
          <input className="field" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('assistant.placeholder')} aria-label="Assistant prompt" />
          <Button aria-label={t('assistant.send')} disabled={typing || !input.trim()} icon={<CornerDownLeft size={17} />} type="submit" variant="primary">
            {t('assistant.send')}
          </Button>
        </form>
      </div>
    </div>
  );

  if (docked) {
    return <aside className="surface hidden h-[calc(100vh-112px)] overflow-hidden xl:block">{body}</aside>;
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-pulse-cyan text-ink-950 shadow-glow transition hover:bg-pulse-green xl:hidden"
        onClick={onClose}
        aria-label={t('assistant.toggle')}
      >
        <MessageSquareText size={22} />
      </button>
      <div className={`fixed inset-0 z-50 bg-ink-950 transition xl:hidden ${open ? 'translate-y-0' : 'translate-y-full'}`}>{body}</div>
    </>
  );
}
