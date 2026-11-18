import React, { useEffect, useState } from 'react';
import { ExternalLink, MessageCircle, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { IMAGES, UDIFY_AGENT_URL } from '../data/siteContent';
import { ResilientImage } from './OrganicDecorations';

export function FloatingVirtualAssistant() {
  const prefersReduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setHasOpened(true);
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Ventana flotante del chat enlazado a Udify */}
      {hasOpened && (
        <motion.div
          initial={false}
          animate={
            isOpen
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 12, scale: 0.96 }
          }
          transition={{ duration: prefersReduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-hidden={!isOpen}
          aria-label="Asistente virtual Savia Docente"
          className={`w-[min(92vw,410px)] h-[min(74vh,560px)] rounded-3xl bg-[#FAF7F0] text-[#3E3028] border border-[#3E3028]/15 shadow-2xl overflow-hidden flex flex-col origin-bottom-right ${
            isOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'
          }`}
        >
          <div className="bg-[#FFF0DE] border-b border-[#F7C99D] px-4 py-3 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#F57923]/50 bg-white shrink-0">
                <ResilientImage
                  src={IMAGES.virtualAssistant}
                  alt="Asistente virtual Savia Docente"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-sm font-bold text-[#3E3028] truncate flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  Asistente Virtual
                </p>
                <p className="text-[11px] text-[#6C584C] truncate">
                  Enlazado con Udify · Disponible siempre
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={UDIFY_AGENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir chat en nueva pestaña"
                aria-label="Abrir chat en nueva pestaña"
                className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#F57923] text-[#3E3028] hover:text-[#FAF7F0] border border-[#3E3028]/12 flex items-center justify-center transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimizar asistente virtual"
                className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#F7C99D]/60 text-[#3E3028] border border-[#3E3028]/12 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <iframe
            src={UDIFY_AGENT_URL}
            title="Asistente Virtual Flotante — Udify"
            allow="microphone; clipboard-write"
            className="w-full flex-1 border-0 bg-white"
          />
        </motion.div>
      )}

      {/* Botón flotante con el retrato pequeño del agente virtual */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {!isOpen && (
          <button
            type="button"
            onClick={handleToggle}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F0]/95 hover:bg-[#FFF0DE] text-[#3E3028] border border-[#F7C99D] shadow-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#F57923]" />
            <span>¿Dudas? Chatea aquí</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar asistente virtual' : 'Abrir asistente virtual flotante'}
          className="group relative w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full p-0.5 bg-gradient-to-br from-[#F57923] via-[#F6B36A] to-[#DF6613] shadow-xl shadow-[#3E3028]/25 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3E3028]"
        >
          {!isOpen && !prefersReduced && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full animate-ping bg-[#F57923]/30 pointer-events-none"
            />
          )}

          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#FAF7F0] bg-[#FFF0DE]">
            <ResilientImage
              src={IMAGES.virtualAssistant}
              alt="Abrir asistente virtual Savia Docente"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
            {isOpen && (
              <div className="absolute inset-0 bg-[#3E3028]/65 flex items-center justify-center text-[#FAF7F0]">
                <X className="w-6 h-6" />
              </div>
            )}
          </div>

          {!isOpen && (
            <span
              aria-hidden="true"
              className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#FAF7F0] shadow-xs"
            />
          )}
        </button>
      </div>
    </div>
  );
}
