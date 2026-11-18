import React, { useState, useEffect } from 'react';
import { X, Check, Copy, ArrowRight, RotateCcw, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ACTIVITY_2_STEPS,
  DIAGNOSTIC_QUESTIONS,
  EthicsActivity,
  EthicsCard,
  EthicsDocument,
  AgentModule,
  IMAGES,
  MURO_QR_RETOS_URL,
  MURO_QR_URL,
} from '../data/siteContent';
import { EthicsCardIllustration, ResilientImage } from './OrganicDecorations';
import { MuroQrActivity } from './MuroQrActivity';

function ModalBackdrop({
  isOpen,
  onClose,
  titleId,
  maxWidthClass = 'max-w-2xl',
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#3E3028]/55 backdrop-blur-xs"
          />
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: prefersReduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidthClass} bg-[#FAF7F0] text-[#3E3028] rounded-[2rem] border border-[#3E3028]/12 shadow-2xl p-6 sm:p-8 my-auto`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 text-[#3E3028] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F57923]"
            >
              <X className="w-5 h-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DiagnosticModal({
  isOpen,
  onClose,
  onContinueToContact,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinueToContact: (summary: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const isCompleted = step >= DIAGNOSTIC_QUESTIONS.length;
  const totalScore = Object.values(answers).reduce((acc, v) => acc + v, 0);

  const getProfile = () => {
    if (totalScore <= 6) {
      return {
        stage: 'Etapa Exploradora · Bases y Acuerdos',
        summary:
          'Tu equipo se encuentra en el momento ideal para construir confianza, establecer acuerdos éticos claros y probar secuencias guiadas sin sobrecarga técnica.',
        steps: [
          'Acordar en claustro una carta breve de transparencia y privacidad escolar.',
          'Probar el módulo Arquitecto de secuencias en una unidad piloto de 2 semanas.',
          'Realizar una sesión abierta con estudiantes sobre verificación crítica de fuentes.',
        ],
      };
    }
    if (totalScore <= 9) {
      return {
        stage: 'Etapa Constructora · Co-creación Activa',
        summary:
          'Ya existen iniciativas valiosas en el aula. El siguiente paso es articular criterios comunes de evaluación formativa y diseño inclusivo DUA.',
        steps: [
          'Estandarizar rúbricas formativas compartidas por departamento.',
          'Incorporar lectura graduada multinivel para atender ritmos diversos.',
          'Documentar buenas prácticas docentes en una bitácora trimestral.',
        ],
      };
    }
    return {
      stage: 'Etapa Referente · Comunidad Pedagógica',
      summary:
        'Tu comunidad muestra madurez ética y didáctica. Pueden consolidar tutorías socráticas personalizadas y mentoría entre pares.',
      steps: [
        'Implementar guías de preguntas socráticas que fortalezcan la voz propia.',
        'Realizar auditorías semestrales de sesgos y bienestar digital.',
        'Acompañar a otros equipos docentes como red de aprendizaje.',
      ],
    };
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setCopied(false);
  };

  const profile = getProfile();

  const handleCopyResult = async () => {
    const text = `Diagnóstico Savia Docente (${totalScore}/12 pts) — ${profile.stage}\n${profile.summary}\nPróximos pasos:\n- ${profile.steps.join('\n- ')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose} titleId="diagnostic-modal-title">
      <div className="pr-10">
        <p className="text-xs font-semibold tracking-wide text-[#F57923] mb-1">
          Diagnóstico pedagógico interactivo
        </p>
        <h3 id="diagnostic-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
          {isCompleted ? profile.stage : 'Evalúa el punto de partida de tu aula'}
        </h3>
      </div>

      {!isCompleted ? (
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-[#6C584C] mb-2 tabular-nums">
            <span>Pregunta {step + 1} de {DIAGNOSTIC_QUESTIONS.length}</span>
            <span>{Math.round(((step + 1) / DIAGNOSTIC_QUESTIONS.length) * 100)} %</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#FFF0DE] overflow-hidden mb-6">
            <div
              className="h-full rounded-full bg-[#F57923] transition-all duration-300"
              style={{ width: `${((step + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <p className="text-lg font-medium text-[#3E3028] mb-5">
            {DIAGNOSTIC_QUESTIONS[step].prompt}
          </p>

          <div className="space-y-3">
            {DIAGNOSTIC_QUESTIONS[step].options.map((option) => {
              const selected = answers[DIAGNOSTIC_QUESTIONS[step].id] === option.score;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    const currentId = DIAGNOSTIC_QUESTIONS[step].id;
                    setAnswers((prev) => ({ ...prev, [currentId]: option.score }));
                    setStep((s) => s + 1);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F57923] ${
                    selected
                      ? 'bg-[#FFF0DE] border-[#F57923] text-[#3E3028]'
                      : 'bg-[#FFF0DE]/55 border-[#3E3028]/10 hover:border-[#F57923]/60 hover:bg-[#FFF0DE]'
                  }`}
                >
                  <span className="text-sm sm:text-base font-medium leading-snug block">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-sm font-medium text-[#6C584C] hover:text-[#3E3028] underline underline-offset-4 cursor-pointer"
              >
                Volver a la pregunta anterior
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="p-5 rounded-2xl bg-[#FFF0DE] border border-[#F7C99D]">
            <p className="text-sm font-medium text-[#3E3028] mb-2 tabular-nums">
              Resultado orientativo: {totalScore} de 12 puntos
            </p>
            <p className="text-sm sm:text-base text-[#6C584C] leading-relaxed">{profile.summary}</p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-[#3E3028] mb-3">
              Ruta sugerida para las próximas cuatro semanas
            </h4>
            <ul className="space-y-2.5">
              {profile.steps.map((item, idx) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#3E3028]">
                  <span className="w-6 h-6 rounded-full bg-[#F57923] text-[#FAF7F0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#3E3028]/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6C584C] hover:text-[#3E3028] px-3 py-2 rounded-full hover:bg-[#FFF0DE] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir
              </button>
              <button
                type="button"
                onClick={handleCopyResult}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3E3028] px-4 py-2 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#F57923]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Resumen copiado' : 'Copiar resumen'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onContinueToContact(`Diagnóstico completado (${profile.stage}, ${totalScore}/12 pts).`);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer"
            >
              Solicitar taller para mi equipo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ModalBackdrop>
  );
}

export function CoCreationWorkshopModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [level, setLevel] = useState<'Primaria' | 'Secundaria' | 'Bachillerato'>('Secundaria');
  const [subject, setSubject] = useState('Ciencias Naturales');
  const [focus, setFocus] = useState<'Secuencia activa' | 'Rúbrica formativa' | 'Lectura DUA'>('Secuencia activa');
  const [copied, setCopied] = useState(false);

  const generatedTemplate = `Rol: Actúa como co-diseñador pedagógico especialista en ${subject} (${level}).
Objetivo: Elaborar una propuesta de ${focus.toLowerCase()} centrada en la participación activa en aula, sin pantallas innecesarias.
Criterios de co-creación:
1. Propón una pregunta detonadora conectada con la vida cotidiana del grupo.
2. Incluye momentos de trabajo colaborativo en papel y puesta en común oral.
3. Añade una cláusula breve de uso transparente y verificación de fuentes para el alumnado.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose} titleId="cocreation-modal-title">
      <div className="pr-10">
        <p className="text-xs font-semibold text-[#F57923] mb-1">Taller guiado de co-creación</p>
        <h3 id="cocreation-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
          Configura tu plantilla pedagógica
        </h3>
        <p className="text-sm text-[#6C584C] mt-1">
          Combina nivel, materia y propósito para obtener una guía estructurada lista para tu agente.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <span className="block text-xs font-semibold text-[#6C584C] mb-2">Nivel educativo</span>
          <div className="flex flex-wrap gap-2">
            {(['Primaria', 'Secundaria', 'Bachillerato'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  level === item
                    ? 'bg-[#F57923] text-[#FAF7F0]'
                    : 'bg-[#FFF0DE] text-[#3E3028] hover:bg-[#F7C99D]/60'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Área o asignatura</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] focus:outline-none focus:border-[#F57923]"
            >
              <option value="Ciencias Naturales">Ciencias Naturales</option>
              <option value="Lengua y Literatura">Lengua y Literatura</option>
              <option value="Matemáticas">Matemáticas</option>
              <option value="Historia y Ciudadanía">Historia y Ciudadanía</option>
              <option value="Artes y Diseño">Artes y Diseño</option>
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Propósito didáctico</span>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value as typeof focus)}
              className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] focus:outline-none focus:border-[#F57923]"
            >
              <option value="Secuencia activa">Secuencia activa</option>
              <option value="Rúbrica formativa">Rúbrica formativa</option>
              <option value="Lectura DUA">Lectura DUA</option>
            </select>
          </label>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF0DE] border border-[#F7C99D]">
          <p className="text-xs font-semibold text-[#6C584C] mb-2">Plantilla generada</p>
          <pre className="whitespace-pre-wrap font-sans text-sm text-[#3E3028] leading-relaxed">
            {generatedTemplate}
          </pre>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Plantilla copiada' : 'Copiar plantilla'}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

export function DetailModal({
  ethicsItem,
  ethicsActivity,
  ethicsDocument,
  agentItem,
  onClose,
}: {
  ethicsItem: EthicsCard | null;
  ethicsActivity: EthicsActivity | null;
  ethicsDocument: EthicsDocument | null;
  agentItem: AgentModule | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ModalBackdrop
      isOpen={Boolean(ethicsItem || ethicsActivity || ethicsDocument || agentItem)}
      onClose={() => {
        setCopied(false);
        onClose();
      }}
      titleId="detail-modal-title"
      maxWidthClass={ethicsDocument ? 'max-w-3xl' : 'max-w-2xl'}
    >
      {ethicsItem && (
        <div className="space-y-5">
          <div className="flex items-center gap-4 pr-10">
            <EthicsCardIllustration iconKey={ethicsItem.iconKey} />
            <div>
              <p className="text-xs font-semibold text-[#F57923]">Ética y acuerdos de aula</p>
              <h3 id="detail-modal-title" className="font-serif text-2xl font-bold text-[#3E3028]">
                {ethicsItem.title}
              </h3>
            </div>
          </div>

          <p className="text-base text-[#3E3028] bg-[#FFF0DE] p-4 rounded-2xl border border-[#F7C99D] leading-relaxed">
            {ethicsItem.principle}
          </p>

          <div>
            <h4 className="font-serif text-lg font-semibold text-[#3E3028] mb-3">
              Cláusulas prácticas recomendadas
            </h4>
            <ul className="space-y-2.5">
              {ethicsItem.classroomClauses.map((clause) => (
                <li key={clause} className="flex items-start gap-2.5 text-sm text-[#6C584C]">
                  <Check className="w-4 h-4 text-[#F57923] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{clause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {ethicsActivity && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 pr-10">
            <EthicsCardIllustration iconKey={ethicsActivity.iconKey} />
            <div>
              <p className="text-xs font-semibold text-[#F57923]">{ethicsActivity.platform}</p>
              <h3 id="detail-modal-title" className="font-serif text-2xl font-bold text-[#3E3028]">
                {ethicsActivity.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#6C584C] leading-relaxed">{ethicsActivity.description}</p>

          <div className="overflow-hidden rounded-2xl border border-[#3E3028]/12 bg-[#FFF0DE] aspect-video">
            <iframe
              src={ethicsActivity.embedUrl}
              title={ethicsActivity.title}
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-[#6C584C]">
              Si la vista previa no carga en tu navegador, ábrela directamente en una nueva pestaña.
            </span>
            <a
              href={ethicsActivity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-5 py-2.5 transition-colors whitespace-nowrap shrink-0"
            >
              Abrir recurso completo
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {ethicsDocument && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 pr-10">
            <EthicsCardIllustration iconKey="agreements" />
            <div>
              <p className="text-xs font-semibold text-[#F57923]">{ethicsDocument.kicker}</p>
              <h3 id="detail-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#3E3028]">
                {ethicsDocument.title}
              </h3>
            </div>
          </div>

          {ethicsDocument.description && (
            <p className="text-xs sm:text-sm text-[#6C584C] leading-relaxed">
              {ethicsDocument.description}
            </p>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#3E3028]/12 bg-[#FFF0DE] h-[58vh] min-h-[340px]">
            <iframe
              src={ethicsDocument.pdfUrl}
              title={ethicsDocument.title}
              className="w-full h-full border-0"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-[#6C584C]">
              Puedes consultar el documento aquí, descargarlo o abrirlo en pantalla completa.
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={ethicsDocument.pdfUrl}
                download
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/55 text-[#3E3028] border border-[#3E3028]/12 text-xs sm:text-sm font-semibold px-4 py-2.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4 text-[#F57923]" />
                Descargar PDF
              </a>
              <a
                href={ethicsDocument.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-5 py-2.5 transition-colors whitespace-nowrap shrink-0"
              >
                Abrir PDF en nueva pestaña
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {agentItem && (
        <div className="space-y-5">
          <div className="pr-10">
            <p className="text-xs font-semibold text-[#F57923] mb-1">
              Módulo del Agente IA · {agentItem.category}
            </p>
            <h3 id="detail-modal-title" className="font-serif text-2xl font-bold text-[#3E3028]">
              {agentItem.title}
            </h3>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#3E3028]/10 bg-[#FFF0DE] aspect-[16/9]">
            <ResilientImage
              src={agentItem.image}
              alt={agentItem.imageAlt}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>

          <p className="text-sm sm:text-base text-[#6C584C] leading-relaxed">
            {agentItem.description}
          </p>

          <div className="p-4 rounded-2xl bg-[#FFF0DE] border border-[#F7C99D]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#3E3028]">Ejemplo de instrucción docente</span>
              <button
                type="button"
                onClick={() => handleCopyPrompt(agentItem.samplePrompt)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F57923] hover:text-[#DF6613] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-sm text-[#3E3028] leading-relaxed">{agentItem.samplePrompt}</p>
          </div>

          <p className="text-xs sm:text-sm text-[#6C584C] leading-relaxed">
            <strong className="text-[#3E3028]">Cuidado pedagógico:</strong> {agentItem.guardrail}
          </p>
        </div>
      )}
    </ModalBackdrop>
  );
}

export function ContactModal({
  isOpen,
  onClose,
  initialNote = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [topic, setTopic] = useState('Diagnóstico y acuerdos éticos');
  const [message, setMessage] = useState(initialNote);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialNote) setMessage(initialNote);
  }, [initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!name.trim() || !emailValid || !institution.trim()) {
      setError('Por favor completa tu nombre, institución y un correo electrónico válido.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={handleResetAndClose} titleId="contact-modal-title">
      {!submitted ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="pr-10">
            <p className="text-xs font-semibold text-[#F57923] mb-1">Acompañamiento a escuelas</p>
            <h3 id="contact-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
              Conversa con nuestro equipo pedagógico
            </h3>
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#9A3412] bg-[#F7C99D]/45 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="block">
              <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Nombre completo</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Laura Benítez"
                className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/60 focus:outline-none focus:border-[#F57923]"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Correo institucional</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="docente@colegio.edu"
                className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/60 focus:outline-none focus:border-[#F57923]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Centro educativo</span>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Nombre del colegio o red"
                className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/60 focus:outline-none focus:border-[#F57923]"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Área de interés</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] focus:outline-none focus:border-[#F57923]"
              >
                <option value="Diagnóstico y acuerdos éticos">Diagnóstico y acuerdos éticos</option>
                <option value="Taller de co-creación docente">Taller de co-creación docente</option>
                <option value="Implementación de Agente IA">Implementación de Agente IA</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-[#6C584C] mb-1.5">Contexto o consulta</span>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntanos brevemente cuántos docentes participan y qué objetivos tienen este trimestre..."
              className="w-full rounded-2xl bg-[#FFF0DE] border border-[#3E3028]/12 px-4 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/60 focus:outline-none focus:border-[#F57923]"
            />
          </label>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] font-semibold text-sm px-7 py-3 transition-colors cursor-pointer"
            >
              Enviar solicitud
            </button>
          </div>
        </form>
      ) : (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF0DE] border border-[#F57923]/30 flex items-center justify-center text-[#F57923]">
            <Check className="w-7 h-7" />
          </div>
          <h3 id="contact-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
            Solicitud registrada con éxito
          </h3>
          <p className="text-sm sm:text-base text-[#6C584C] max-w-md mx-auto leading-relaxed">
            Gracias, <strong className="text-[#3E3028]">{name}</strong>. Prepararemos una propuesta de{' '}
            <strong className="text-[#3E3028]">{topic.toLowerCase()}</strong> para{' '}
            <strong className="text-[#3E3028]">{institution}</strong> y te escribiremos a {email}.
          </p>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="rounded-full bg-[#3E3028] hover:bg-[#3E3028]/90 text-[#FAF7F0] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer"
          >
            Volver a la página
          </button>
        </div>
      )}
    </ModalBackdrop>
  );
}

export function Activity2PresentationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [slide, setSlide] = useState(1);

  const handleClose = () => {
    setSlide(1);
    onClose();
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={handleClose} titleId="activity2-modal-title">
      <div className="pr-10 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#F57923]">
          Presentación interactiva · Diapositiva {slide} de 9
        </p>
      </div>

      {slide === 1 && (
        <div className="mt-5 p-6 sm:p-7 rounded-3xl bg-[#FFF0DE] border border-[#F7C99D] space-y-5">
          <div className="overflow-hidden rounded-2xl border border-[#3E3028]/10 bg-[#FAF7F0] aspect-[16/9]">
            <ResilientImage
              src={IMAGES.cocreationWorkshop}
              alt="Docentes co-creando en taller colaborativo con mapas mentales e inteligencia artificial"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
          <div className="text-center space-y-3">
            <h3 id="activity2-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
              Actividad 2: Mapa mental y reto con IA
            </h3>
            <p className="text-sm sm:text-base text-[#6C584C] max-w-md mx-auto leading-relaxed">
              Presentación interactiva. Usa los botones para elegir un paso o avanzar por la ruta del equipo.
            </p>
            <button
              type="button"
              onClick={() => setSlide(2)}
              className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-7 py-3 transition-colors cursor-pointer"
            >
              Empezar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {slide === 2 && (
        <div className="mt-5 space-y-4">
          <div>
            <h3 id="activity2-modal-title" className="font-serif text-2xl font-bold text-[#3E3028]">
              Menú: elige un paso
            </h3>
            <p className="text-xs sm:text-sm text-[#6C584C] mt-1">
              Cada paso tiene botones para volver al menú o avanzar al siguiente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { num: 1, label: '1. Ubícate en tu mesa', target: 3, stepIndex: 0, qrHref: null },
              { num: 2, label: '2. Mapa mental en Mapify', target: 4, stepIndex: 1, qrHref: null },
              { num: 3, label: '3. Publica en Muro', target: 5, stepIndex: 2, qrHref: MURO_QR_URL },
              { num: 4, label: '4. Abre tu reto', target: 6, stepIndex: 3, qrHref: MURO_QR_RETOS_URL },
              { num: 5, label: '5. Resuelve el reto con IA', target: 7, stepIndex: 4, qrHref: null },
              { num: 6, label: '6. Sube el resultado final', target: 8, stepIndex: 5, qrHref: null },
            ].map((item) => {
              const stepData = ACTIVITY_2_STEPS[item.stepIndex];
              return (
                <div
                  key={item.num}
                  className="rounded-2xl bg-[#FFF0DE] hover:bg-[#F7C99D]/55 border border-[#3E3028]/10 hover:border-[#F57923] transition-colors flex items-center justify-between gap-2 pr-3"
                >
                  <button
                    type="button"
                    onClick={() => setSlide(item.target)}
                    className="flex-1 min-w-0 text-left p-3 text-sm font-semibold text-[#3E3028] flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-12 h-9 rounded-lg overflow-hidden border border-[#3E3028]/10 bg-[#FAF7F0] shrink-0">
                      <ResilientImage
                        src={stepData.image}
                        alt={stepData.imageAlt}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                  {item.qrHref && (
                    <a
                      href={item.qrHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F0] hover:bg-[#F57923] text-[#F57923] hover:text-[#FAF7F0] border border-[#F57923]/30 px-2.5 py-0.5 text-xs font-bold transition-colors shrink-0"
                    >
                      QR
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSlide(item.target)}
                    aria-label={`Ir a ${item.label}`}
                    className="text-[#F57923] shrink-0 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {slide >= 3 && slide <= 8 && (
        <div className="mt-5 space-y-5">
          {(() => {
            const current = ACTIVITY_2_STEPS[slide - 3];
            const bodyParts = current.body.split(/(QR)/g);
            const stepQrUrl = current.slideNumber === 6 ? MURO_QR_RETOS_URL : MURO_QR_URL;
            return (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF0DE] border border-[#F7C99D] space-y-4">
                <div className="overflow-hidden rounded-2xl border border-[#3E3028]/10 bg-[#FAF7F0] aspect-[16/10]">
                  <ResilientImage
                    key={current.image}
                    src={current.image}
                    alt={current.imageAlt}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#F57923] block">
                    {current.stepLabel} de 6
                  </span>
                  <h3 id="activity2-modal-title" className="font-serif text-2xl font-bold text-[#3E3028]">
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#6C584C] leading-relaxed">
                    {bodyParts.map((part, idx) =>
                      part === 'QR' ? (
                        <a
                          key={idx}
                          href={stepQrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 font-semibold text-[#F57923] hover:text-[#DF6613] underline underline-offset-4"
                        >
                          QR
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <React.Fragment key={idx}>{part}</React.Fragment>
                      )
                    )}
                  </p>
                  {current.link && (
                    <a
                      href={current.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F57923] hover:text-[#DF6613] underline underline-offset-4"
                    >
                      {current.link.label}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSlide(2)}
              className="rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 text-[#3E3028] text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer"
            >
              Volver al menú
            </button>
            <button
              type="button"
              onClick={() => setSlide((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer"
            >
              {slide === 8 ? 'Terminar' : 'Siguiente paso'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {slide === 9 && (
        <div className="mt-5 p-6 sm:p-7 rounded-3xl bg-[#FFF0DE] border border-[#F7C99D] text-center space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#3E3028]/10 bg-[#FAF7F0] aspect-[16/9]">
            <ResilientImage
              src={IMAGES.step6UploadFinal}
              alt="Producto final entregado y verificado en la carpeta del reto"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
          <div className="w-11 h-11 mx-auto rounded-full bg-[#FAF7F0] border border-[#F57923]/30 flex items-center justify-center text-[#F57923]">
            <Check className="w-5 h-5" />
          </div>
          <h3 id="activity2-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
            ¡Actividad completada!
          </h3>
          <p className="text-sm sm:text-base text-[#6C584C] max-w-md mx-auto leading-relaxed">
            Su equipo terminó los 6 pasos. Revisen que el mapa esté en el Muro y el reto en la carpeta.
          </p>
          <button
            type="button"
            onClick={() => setSlide(2)}
            className="rounded-full bg-[#3E3028] hover:bg-[#3E3028]/90 text-[#FAF7F0] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer"
          >
            Volver al menú
          </button>
        </div>
      )}
    </ModalBackdrop>
  );
}

export function MuroQrModal({
  isOpen,
  initialTab,
  onClose,
}: {
  isOpen: boolean;
  initialTab: 'mapas' | 'retos';
  onClose: () => void;
}) {
  return (
    <ModalBackdrop
      isOpen={isOpen}
      onClose={onClose}
      titleId="muro-qr-modal-title"
      maxWidthClass="max-w-4xl"
    >
      <div className="pr-8">
        <span id="muro-qr-modal-title" className="sr-only">
          Muro QR de la clase con Google Drive
        </span>
        <MuroQrActivity initialTab={initialTab} />
      </div>
    </ModalBackdrop>
  );
}
