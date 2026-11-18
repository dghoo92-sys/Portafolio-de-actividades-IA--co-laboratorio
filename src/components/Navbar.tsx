import React, { useState } from 'react';
import { Bot, FileText, Menu, Sparkles, X } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenProjectDoc: () => void;
  geminiLabOpen: boolean;
  onToggleGeminiLab: () => void;
}

const NAV_LINKS = [
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#co-creacion', label: 'Co-creación' },
  { href: '#etica', label: 'Ética' },
  { href: '#agente-ia', label: 'Herramientas IA' },
];

export function Navbar({
  onOpenContact,
  onOpenProjectDoc,
  geminiLabOpen,
  onToggleGeminiLab,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
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

        {/* Zone 3: Habilidades Gemini (@laboratorio-de-colaboración-en-ia) + Agente virtual + Mobile Drawer Toggle */}
        <div className="relative flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleGeminiLab}
            aria-expanded={geminiLabOpen}
            aria-label="Abrir Habilidades Gemini para interactuar con @laboratorio-de-colaboración-en-ia"
            className={`inline-flex items-center gap-2 rounded-full border font-semibold text-xs sm:text-sm px-3.5 py-1.5 transition-all duration-200 shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F57923] ${
              geminiLabOpen
                ? 'bg-[#3E3028] text-[#FAF7F0] border-[#3E3028]'
                : 'bg-[#FFF0DE] hover:bg-[#F7C99D]/55 text-[#3E3028] border-[#F7C99D]'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${geminiLabOpen ? 'text-[#F6B36A]' : 'text-[#F57923]'}`} />
            <span className="hidden sm:inline">Habilidades Gemini</span>
            <span className="sm:hidden">Gemini</span>
          </button>

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
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onToggleGeminiLab();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-[#3E3028] hover:bg-[#FFF0DE] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F57923] shrink-0" />
              <span>Habilidades Gemini</span>
            </button>
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
