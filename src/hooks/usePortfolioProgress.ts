import { useCallback, useEffect, useMemo, useState } from 'react';

export interface ProgressMilestone {
  id: string;
  label: string;
  group: 'navegacion' | 'actividades';
  href: string;
}

export const PORTFOLIO_MILESTONES: ProgressMilestone[] = [
  // Navegación (6 secciones)
  { id: 'sec-diagnostico', label: 'Diagnóstico docente', group: 'navegacion', href: '#diagnostico' },
  { id: 'sec-cocreacion', label: 'Co-creación pedagógica', group: 'navegacion', href: '#co-creacion' },
  { id: 'sec-etica', label: 'Ética y acuerdos', group: 'navegacion', href: '#etica' },
  { id: 'sec-agente', label: 'Herramientas IA para usar en clase', group: 'navegacion', href: '#agente-ia' },
  { id: 'sec-contacto', label: 'Asistente virtual y contacto', group: 'navegacion', href: '#contacto' },

  // Actividades, links y videos (14 recursos)
  { id: 'act-encuesta-pdf', label: 'Encuesta de diagnóstico (PDF)', group: 'actividades', href: '#diagnostico' },
  { id: 'act-video-analisis', label: 'Video: Análisis de encuesta', group: 'actividades', href: '#diagnostico' },
  { id: 'act-herramienta-diagnostico', label: 'Herramienta de diagnóstico', group: 'actividades', href: '#diagnostico' },
  { id: 'act-video-diseno-diag', label: 'Video: Diseño del diagnóstico', group: 'actividades', href: '#introduccion' },
  { id: 'act-videos-ruta', label: 'Videos: Ruta e integración IA', group: 'actividades', href: '#co-creacion' },
  { id: 'act-actividad2-mapa', label: 'Actividad 2: Mapa mental y Muro', group: 'actividades', href: '#co-creacion' },
  { id: 'act-video-mapify', label: 'Video tutorial: Mapify', group: 'actividades', href: '#co-creacion' },
  { id: 'act-actividad3-canva', label: 'Actividad 3: Canva y tutorial', group: 'actividades', href: '#co-creacion' },
  { id: 'act-actividad4-wordwall', label: 'Actividad 4: Wordwall y tutorial', group: 'actividades', href: '#co-creacion' },
  { id: 'act-codigo-pdf', label: 'Código de conducta IA (PDF)', group: 'actividades', href: '#etica' },
  { id: 'act-codigo-canva', label: 'Actividad 2.1: Diseño en Canva', group: 'actividades', href: '#etica' },
  { id: 'act-juego-etica', label: 'Pilares y mini-juego ético', group: 'actividades', href: '#etica' },
  { id: 'act-genially-gamma', label: 'Genially y Gamma interactivos', group: 'actividades', href: '#etica' },
  { id: 'act-udify-chat', label: 'Chat con Asistente Udify', group: 'actividades', href: '#contacto' },
];

const STORAGE_KEY = 'savia_docente_exploration_v1';

const SECTION_ID_TO_MILESTONE: Record<string, string> = {
  diagnostico: 'sec-diagnostico',
  'co-creacion': 'sec-cocreacion',
  etica: 'sec-etica',
  'agente-ia': 'sec-agente',
  contacto: 'sec-contacto',
};

function matchUrlOrTextToMilestone(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('encuesta_de_diagn_stico')) return 'act-encuesta-pdf';
  if (lower.includes('dssrg3tvvpg') || lower.includes('análisis de la encuesta')) return 'act-video-analisis';
  if (lower.includes('classy-kringle-e916d2')) return 'act-herramienta-diagnostico';
  if (lower.includes('mhv2cz-omik') || lower.includes('cómo diseñamos el diagnóstico')) return 'act-video-diseno-diag';
  if (lower.includes('pz65cvkdkye') || lower.includes('79tu4kq2xza') || lower.includes('ruta de integración') || lower.includes('herramientas ia para el aula')) return 'act-videos-ruta';
  if (lower.includes('tzsmimj_hmo') || lower.includes('tutorial de mapify')) return 'act-video-mapify';
  if (lower.includes('i650n7lq7ppiit9') || lower.includes('pil-jkv') || lower.includes('pil-jkv'.toLowerCase()) || lower.includes('pIl-JKvHj3A'.toLowerCase()) || lower.includes('actividad 3')) return 'act-actividad3-canva';
  if (lower.includes('wordwall.net') || lower.includes('jumk4ufhxoi') || lower.includes('tutorial de cómo usar wordwall')) return 'act-actividad4-wordwall';
  if (lower.includes('mapify.so') || lower.includes('muro-qr') || lower.includes('actividad_2__mapa_mental') || lower.includes('abrir muro') || lower.includes('presentación interactiva') || lower.includes('paso ')) return 'act-actividad2-mapa';
  if (lower.includes('c_digo_de_conducta') || lower.includes('vista previa del documento') || lower.includes('diapositiva') && lower.includes('código')) return 'act-codigo-pdf';
  if (lower.includes('trp4jcgmkwhbcbj') || lower.includes('dahad30kkqa') || lower.includes('código de conducta ia') || lower.includes('cargar imágenes de canva')) return 'act-codigo-canva';
  if (lower.includes('ver acuerdo modelo') || lower.includes('decisiones éticas') || lower.includes('siguiente caso') || lower.includes('abrir ventana')) return 'act-juego-etica';
  if (
    lower.includes('genially.com') ||
    lower.includes('gamma.app') ||
    lower.includes('menti.com') ||
    lower.includes('ideamap.ai') ||
    lower.includes('padlet.com') ||
    lower.includes('promptcowboy.ai') ||
    lower.includes('exploración ética en el aula') ||
    lower.includes('elaborar una declaración')
  ) {
    return 'act-genially-gamma';
  }
  if (lower.includes('udify.app') || lower.includes('asistente virtual') || lower.includes('chatea aquí')) return 'act-udify-chat';
  return null;
}

export function usePortfolioProgress(enabled = true) {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['sec-diagnostico'];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string');
        }
      }
    } catch {
      // ignore storage read error
    }
    return ['sec-diagnostico'];
  });

  const markExplored = useCallback((id: string | null | undefined) => {
    if (!id) return;
    setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const resetProgress = useCallback(() => {
    setCompletedIds(['sec-diagnostico']);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage error
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
    } catch {
      // ignore storage write error
    }
  }, [completedIds]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // 1. Detección automática de secciones visitadas al navegar o hacer scroll
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const milestoneId = SECTION_ID_TO_MILESTONE[entry.target.id];
            if (milestoneId) markExplored(milestoneId);
          }
        });
      },
      { threshold: 0.25 }
    );

    Object.keys(SECTION_ID_TO_MILESTONE).forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) sectionObserver.observe(el);
    });

    // 2. Detección automática al abrir links, botones de actividades o modales
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') ?? '';
        if (href.startsWith('#')) {
          const secId = href.slice(1);
          if (SECTION_ID_TO_MILESTONE[secId]) {
            markExplored(SECTION_ID_TO_MILESTONE[secId]);
          }
        }
        const matched = matchUrlOrTextToMilestone(`${href} ${anchor.textContent ?? ''} ${anchor.getAttribute('aria-label') ?? ''}`);
        if (matched) markExplored(matched);
      }

      const btn = target.closest('button');
      if (btn) {
        const btnText = `${btn.textContent ?? ''} ${btn.getAttribute('aria-label') ?? ''}`;
        const matched = matchUrlOrTextToMilestone(btnText);
        if (matched) {
          markExplored(matched);
          return;
        }
        // Detectar botón "Vista previa" dentro de tarjeta padre por contexto cercano
        const cardContext = btn.closest('div.rounded-3xl, div.rounded-2xl')?.textContent ?? '';
        if (btnText.toLowerCase().includes('vista previa') || btnText.toLowerCase().includes('ampliar vista') || btnText.toLowerCase().includes('pantalla ampliada')) {
          const contextMatch = matchUrlOrTextToMilestone(cardContext);
          if (contextMatch) markExplored(contextMatch);
        }
        // Detectar pasos del mini-juego o presentación de código de conducta
        if (btn.closest('[aria-label*="código de conducta"]') || btnText.toLowerCase().includes('principios') || btnText.toLowerCase().includes('badges')) {
          markExplored('act-codigo-pdf');
        }
        // Detectar clics en tarjetas del mini-juego ético (opciones A/B/C)
        if (btn.closest('[role="dialog"][aria-labelledby="ethics-game-modal-title"]') || cardContext.includes('Decisiones Éticas en el Aula')) {
          markExplored('act-juego-etica');
        }
      }
    };

    // 3. Detección automática al reproducir videos o interactuar con iframes (YouTube, Genially, Gamma, Canva, Udify)
    const handleWindowBlur = () => {
      window.setTimeout(() => {
        const active = document.activeElement;
        if (active && active.tagName === 'IFRAME') {
          const src = active.getAttribute('src') ?? '';
          const title = active.getAttribute('title') ?? '';
          const matched = matchUrlOrTextToMilestone(`${src} ${title}`);
          if (matched) markExplored(matched);
        }
      }, 0);
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      sectionObserver.disconnect();
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [enabled, markExplored]);

  const totalCount = PORTFOLIO_MILESTONES.length;
  const completedCount = useMemo(
    () => PORTFOLIO_MILESTONES.filter((m) => completedIds.includes(m.id)).length,
    [completedIds]
  );
  const percentage = Math.round((completedCount / totalCount) * 100);

  return {
    milestones: PORTFOLIO_MILESTONES,
    completedIds,
    completedCount,
    totalCount,
    percentage,
    markExplored,
    resetProgress,
  };
}
