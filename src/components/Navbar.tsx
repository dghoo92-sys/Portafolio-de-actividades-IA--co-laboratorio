import React, { useState } from 'react';
import { Bot, Check, Copy, ExternalLink, FileText, Menu, Sparkles, X } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenProjectDoc: () => void;
}

const GEMINI_SKILL_HANDLE = '@laboratorio-de-colaboración-en-ia';

const NAV_LINKS = [
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#co-creacion', label: 'Co-creación' },
  { href: '#etica', label: 'Ética' },
  { href: '#agente-ia', label: 'Herramientas IA' },
];

export function Navbar({
  onOpenContact,
  onOpenProjectDoc,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showGeminiInstruction, setShowGeminiInstruction] = useState(false);
  const [copiedSkill, setCopiedSkill] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const copySkillHandle = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(GEMINI_SKILL_HANDLE)
        .then(() => {
          setCopiedSkill(true);
          window.setTimeout(() => setCopiedSkill(false), 2500);
        })
        .catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/92 backdrop-blur-md border-b border-[#3E3028]/10">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4 lg:gap-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#diagnostico"
          className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3E3028] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F57923] rounded-sm"
        >
          Portafolio personal
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium text-[#6C584C]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#3E3028] transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#F57923] after:rounded-full after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F57923] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Apartado Nuestro proyecto (entre Herramientas IA y Habilidades Gemini) */}
        <button
          type="button"
          onClick={onOpenProjectDoc}
          className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#FFF0DE] text-[#3E3028] border border-[#3E3028]/15 hover:border-[#F57923]/60 font-semibold text-xs sm:text-sm px-3.5 py-1.5 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F57923]"
        >
          <FileText className="w-3.5 h-3.5 text-[#F57923] shrink-0" />
          <span>Nuestro proyecto</span>
        </button>

        {/* Zone 3: Botón @laboratorio-de-colaboración-en-ia con cuadrito de instrucciones y botón a Gemini + Agente virtual + Mobile Drawer Toggle */}
        <div className="relative flex items-center gap-2.5 lg:gap-3 shrink-0">
          <a
            href="#habilidad-gemini"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              setShowGeminiInstruction((prev) => {
                const next = !prev;
                if (next) copySkillHandle();
                return next;
              });
            }}
            title="Ver instrucciones para copiar @laboratorio-de-colaboración-en-ia e ir a Gemini"
            aria-label="Abrir instrucciones para usar @laboratorio-de-colaboración-en-ia en Gemini"
            aria-expanded={showGeminiInstruction}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/55 text-[#3E3028] border border-[#F7C99D] font-semibold text-xs px-3 sm:px-3.5 py-1.5 transition-all duration-200 hover:-translate-y-0.5 shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F57923]"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#F57923]" />
            <span className="hidden sm:inline max-w-[160px] lg:max-w-[230px] xl:max-w-none truncate">
              {GEMINI_SKILL_HANDLE}
            </span>
            <span className="sm:hidden">Gemini</span>
            <ExternalLink className="w-3 h-3 shrink-0 text-[#F57923]" />
          </a>

          {showGeminiInstruction && (
            <div
              role="dialog"
              aria-label="Instrucciones para usar la habilidad en Gemini"
              className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 rounded-2xl bg-[#FAF7F0] border border-[#F7C99D] shadow-xl shadow-[#3E3028]/15 p-4 text-left z-50"
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFF0DE] text-[#F57923]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <p className="font-serif font-bold text-sm text-[#3E3028]">
                    Interactuar en Gemini
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGeminiInstruction(false)}
                  aria-label="Cerrar instrucciones"
                  className="p-1 rounded-full text-[#6C584C] hover:text-[#3E3028] hover:bg-[#FFF0DE] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="text-xs text-[#6C584C] space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Copia la habilidad{' '}
                  <code className="px-1.5 py-0.5 rounded bg-[#FFF0DE] text-[#3E3028] font-semibold">
                    {GEMINI_SKILL_HANDLE}
                  </code>{' '}
                  (con el botón de abajo).
                </li>
                <li>
                  Haz clic en <strong className="text-[#3E3028]">Ir a Gemini</strong>, pega la habilidad en el chat y envíala para interactuar con la API.
                </li>
              </ol>

              <div className="mt-3.5 pt-3 border-t border-[#3E3028]/10 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={copySkillHandle}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 text-[#3E3028] border border-[#F7C99D] font-semibold text-xs px-3 py-2 transition-colors cursor-pointer"
                >
                  {copiedSkill ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1E7A50]" />
                      <span>Habilidad copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#F57923]" />
                      <span>Copiar habilidad</span>
                    </>
                  )}
                </button>

                <a
                  href="https://gemini.google.com/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    copySkillHandle();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] font-semibold text-xs px-4 py-2 transition-colors shadow-sm shadow-[#F57923]/25"
                >
                  <span>Ir a Gemini</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          )}

          <a
            href="#contacto"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] font-semibold text-xs sm:text-sm px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 shadow-sm shadow-[#F57923]/25 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3E3028]"
          >
            <Bot className="w-4 h-4 shrink-0" />
            <span>Agente virtual</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFF0DE] text-[#3E3028] hover:bg-[#F7C99D]/50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F57923]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#3E3028]/10 bg-[#FAF7F0] px-5 py-4 space-y-2">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2.5 rounded-xl text-base font-medium text-[#3E3028] hover:bg-[#FFF0DE] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenProjectDoc();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-[#3E3028] hover:bg-[#FFF0DE] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#F57923] shrink-0" />
              <span>Nuestro proyecto (PDF)</span>
            </button>
            <a
              href="https://gemini.google.com/gems"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                navigator.clipboard?.writeText('@laboratorio-de-colaboración-en-ia').catch(() => {});
                setMobileOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-[#3E3028] hover:bg-[#FFF0DE] transition-colors inline-flex items-center justify-between gap-2"
            >
              <span className="inline-flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[#F57923] shrink-0" />
                <span className="truncate">@laboratorio-de-colaboración-en-ia</span>
              </span>
              <ExternalLink className="w-4 h-4 text-[#F57923] shrink-0" />
            </a>
          </nav>
          <div className="pt-2 space-y-2">
            <a
              href="#contacto"
              onClick={handleLinkClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] font-semibold text-sm px-5 py-3 transition-colors"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>Agente virtual</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenContact();
              }}
              className="w-full rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 text-[#3E3028] border border-[#F7C99D] font-semibold text-sm px-5 py-3 transition-colors cursor-pointer"
            >
              Contactar al equipo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
