import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Check,
  Copy,
  Lightbulb,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Wand2,
  Wrench,
  X,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

type SkillId = 'general' | 'actividad-abp' | 'etica-badges' | 'herramienta-ia' | 'mejorar-prompt';

interface SkillOption {
  id: SkillId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  starterPrompt: string;
}

const GEMINI_SKILLS: SkillOption[] = [
  {
    id: 'actividad-abp',
    label: 'Actividad ABP',
    icon: Lightbulb,
    starterPrompt:
      'Diseña una actividad ABP de 45 minutos con la pregunta "¿Qué pasaría si...?" para usar IA en clase de forma crítica.',
  },
  {
    id: 'etica-badges',
    label: 'Ética y Badges',
    icon: ShieldCheck,
    starterPrompt:
      '¿Qué badge del Código de Conducta (Human Nature, AI Assisted, AI Co-Creation o AI Core) recomiendas para un ensayo reflexivo y por qué?',
  },
  {
    id: 'herramienta-ia',
    label: 'Herramienta IA',
    icon: Wrench,
    starterPrompt:
      '¿Qué herramienta del laboratorio (Mapify, Canva IA, Wordwall, NotebookLM o Gamma) me recomiendas para repasar un tema visualmente?',
  },
  {
    id: 'mejorar-prompt',
    label: 'Mejorar Prompt',
    icon: Wand2,
    starterPrompt:
      'Mejora este prompt docente para que incluya rol, contexto, criterio ético y verificación: "Hazme una rúbrica de debate".',
  },
];

export function GeminiLabWindow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const [activeSkill, setActiveSkill] = useState<SkillId>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textOverride?: string, skillOverride?: SkillId) => {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || isLoading) return;

    const skillToUse = skillOverride ?? activeSkill;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const modelMessageId = `model-${Date.now() + 1}`;
    const nextHistory = [...messages, userMessage];

    setMessages([...nextHistory, { id: modelMessageId, role: 'model', text: '' }]);
    if (!textOverride) setInput('');
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: skillToUse,
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        const errData = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errData?.error || `Error del servidor (${response.status})`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const cleaned = line.trim();
            if (!cleaned.startsWith('data:')) continue;
            const payloadStr = cleaned.slice(5).trim();
            if (!payloadStr) continue;
            try {
              const payload = JSON.parse(payloadStr) as { text?: string; error?: string };
              if (payload.error) {
                throw new Error(payload.error);
              }
              if (payload.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === modelMessageId ? { ...m, text: m.text + payload.text } : m
                  )
                );
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
                throw parseErr;
              }
            }
          }
        }
      } else {
        const data = (await response.json()) as { text?: string };
        setMessages((prev) =>
          prev.map((m) => (m.id === modelMessageId ? { ...m, text: data.text ?? '' } : m))
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo conectar con @laboratorio-de-colaboración-en-ia.';
      setErrorMsg(message);
      setMessages((prev) => prev.filter((m) => m.id !== modelMessageId || m.text.length > 0));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setErrorMsg(null);
    setActiveSkill('general');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          role="dialog"
          aria-modal="false"
          aria-label="Ventana interactiva de habilidades Gemini con @laboratorio-de-colaboración-en-ia"
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: prefersReduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 w-[min(94vw,445px)] max-h-[calc(100vh-5.5rem)] flex flex-col rounded-3xl bg-[#FAF7F0] text-[#3E3028] border border-[#F7C99D] shadow-2xl shadow-[#3E3028]/20 overflow-hidden"
        >
          {/* Header de la ventanita */}
          <div className="bg-[#FFF0DE] border-b border-[#F7C99D] px-4 py-3 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-2xl bg-[#F57923] text-[#FAF7F0] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-serif text-sm font-bold text-[#3E3028] truncate">
                  @laboratorio-de-colaboración-en-ia
                </p>
                <p className="text-[11px] font-medium text-[#6C584C] truncate">
                  Habilidades Gemini API · Co-creación docente
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Nueva conversación"
                  aria-label="Nueva conversación"
                  className="w-8 h-8 rounded-full hover:bg-[#F7C99D]/50 text-[#6C584C] hover:text-[#3E3028] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar ventana de habilidades Gemini"
                className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#F7C99D]/60 text-[#3E3028] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de Habilidades Gemini */}
          <div className="px-3.5 py-2.5 bg-[#FAF7F0] border-b border-[#3E3028]/8 flex flex-wrap items-center gap-1.5">
            {GEMINI_SKILLS.map((skill) => {
              const Icon = skill.icon;
              const isSelected = activeSkill === skill.id;
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => {
                    setActiveSkill(skill.id);
                    if (messages.length === 0) {
                      void sendMessage(skill.starterPrompt, skill.id);
                    } else {
                      inputRef.current?.focus();
                    }
                  }}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F57923] text-[#FAF7F0] shadow-xs'
                      : 'bg-[#FFF0DE] hover:bg-[#F7C99D]/60 text-[#3E3028] border border-[#F7C99D]'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{skill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3 min-h-[220px] max-h-[46vh]">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-[#FFF0DE]/85 border border-[#F7C99D] p-3.5 space-y-1.5">
                  <p className="text-xs font-bold text-[#F57923]">
                    Bienvenido a @laboratorio-de-colaboración-en-ia
                  </p>
                  <p className="text-xs text-[#3E3028] leading-relaxed">
                    Elige una habilidad arriba para probarla al instante o escribe tu propia consulta sobre el proyecto, actividades ABP, herramientas o el código de conducta.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6C584C]">
                    Sugerencias rápidas
                  </p>
                  {GEMINI_SKILLS.slice(0, 3).map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        setActiveSkill(skill.id);
                        void sendMessage(skill.starterPrompt, skill.id);
                      }}
                      className="w-full text-left rounded-xl bg-white hover:bg-[#FFF0DE] border border-[#3E3028]/10 hover:border-[#F57923]/50 px-3 py-2 text-xs text-[#3E3028] transition-colors cursor-pointer"
                    >
                      {skill.starterPrompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#F57923] text-[#FAF7F0] rounded-br-sm'
                        : 'bg-[#FFF0DE] text-[#3E3028] border border-[#F7C99D] rounded-bl-sm'
                    }`}
                  >
                    {msg.text || (isLoading ? 'Pensando...' : '')}
                  </div>
                  {msg.role === 'model' && msg.text && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#6C584C] hover:text-[#3E3028] px-1.5 py-0.5 rounded-full cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#F57923]" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))
            )}

            {errorMsg && (
              <div
                role="alert"
                className="rounded-2xl bg-[#F7C99D]/45 border border-[#F57923]/50 px-3.5 py-2.5 text-xs text-[#9A3412] leading-relaxed"
              >
                {errorMsg}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Barra de envío */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
            className="border-t border-[#3E3028]/10 bg-[#FAF7F0] p-3 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Interactúa con @laboratorio-de-colaboración-en-ia..."
              className="flex-1 resize-none rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-3.5 py-2 text-xs sm:text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Enviar mensaje"
              className="h-10 w-10 rounded-full bg-[#F57923] hover:bg-[#DF6613] disabled:opacity-45 disabled:cursor-not-allowed text-[#FAF7F0] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
