import heroTeacherImg from '../assets/images/hero_teacher_desk_1794515586697.jpg';
import cocreationWorkshopImg from '../assets/images/cocreation_workshop_1794515586923.jpg';
import agentLessonImg from '../assets/images/agent_lesson_planner_1794515588965.jpg';
import agentRubricImg from '../assets/images/agent_rubric_evaluator_1794515587269.jpg';
import agentInclusiveImg from '../assets/images/agent_inclusive_adapt_1794515587497.jpg';
import agentSocraticImg from '../assets/images/agent_socratic_tutor_1794515589162.jpg';
import agentEthicsImg from '../assets/images/agent_ethics_guard_1794515589611.jpg';
import step1TeamTableImg from '../assets/images/step1_team_table_1794606285987.jpg';
import step2MindmapIaImg from '../assets/images/step2_mindmap_ia_1794606286950.jpg';
import step3PadletQrImg from '../assets/images/step3_padlet_qr_1794606287437.jpg';
import step4ChallengeFolderImg from '../assets/images/step4_challenge_folder_1794606287619.jpg';
import step5SolveAiImg from '../assets/images/step5_solve_ai_1794606288495.jpg';
import step6UploadFinalImg from '../assets/images/step6_upload_final_1794606288719.jpg';
import canvaSlide1PortadaImg from '../assets/images/canva_slide1_portada_1794608152339.jpg';
import canvaSlide2PrincipiosImg from '../assets/images/canva_slide2_principios_1794608153913.jpg';
import canvaSlide3CompromisosImg from '../assets/images/canva_slide3_compromisos_1794608154499.jpg';
import canvaSlide4RecomendacionesImg from '../assets/images/canva_slide4_recomendaciones_1794608154609.jpg';
import virtualAssistantSpeakingImg from '../assets/images/virtual_assistant_speaking_1794609130595.jpg';
import eduAiChatgptImg from '../assets/images/edu_ai_chatgpt_1794610151224.jpg';
import eduAiGeminiImg from '../assets/images/edu_ai_gemini_1794610151132.jpg';
import eduAiCanvaImg from '../assets/images/edu_ai_canva_1794610152300.jpg';
import eduAiGammaImg from '../assets/images/edu_ai_gamma_1794610151650.jpg';
import eduAiPerplexityImg from '../assets/images/edu_ai_perplexity_1794610153069.jpg';
import eduAiNotebooklmImg from '../assets/images/edu_ai_notebooklm_1794610153374.jpg';
import rutaIaFuturisticaImg from '../assets/images/ruta_ia_futuristica_savia_1794610340669.jpg';
import gammaDeclaracionIaImg from '../assets/images/gamma_declaracion_ia_1794618096696.jpg';
import labCocreacionNaturalImg from '../assets/images/lab_cocreacion_natural_1794669530676.jpg';
import rutaIaVivosColoresImg from '../assets/images/ruta_ia_vivos_colores_1794683947543.jpg';

export const IMAGES = {
  heroTeacher: heroTeacherImg,
  cocreationWorkshop: cocreationWorkshopImg,
  agentLesson: agentLessonImg,
  agentRubric: agentRubricImg,
  agentInclusive: agentInclusiveImg,
  agentSocratic: agentSocraticImg,
  agentEthics: agentEthicsImg,
  step1TeamTable: step1TeamTableImg,
  step2MindmapIa: step2MindmapIaImg,
  step3PadletQr: step3PadletQrImg,
  step4ChallengeFolder: step4ChallengeFolderImg,
  step5SolveAi: step5SolveAiImg,
  step6UploadFinal: step6UploadFinalImg,
  canvaSlide1Portada: canvaSlide1PortadaImg,
  canvaSlide2Principios: canvaSlide2PrincipiosImg,
  canvaSlide3Compromisos: canvaSlide3CompromisosImg,
  canvaSlide4Recomendaciones: canvaSlide4RecomendacionesImg,
  virtualAssistant: virtualAssistantSpeakingImg,
  eduAiChatgpt: eduAiChatgptImg,
  eduAiGemini: eduAiGeminiImg,
  eduAiCanva: eduAiCanvaImg,
  eduAiGamma: eduAiGammaImg,
  eduAiPerplexity: eduAiPerplexityImg,
  eduAiNotebooklm: eduAiNotebooklmImg,
  rutaIntegracion: rutaIaVivosColoresImg,
  gammaDeclaracionPreview: gammaDeclaracionIaImg,
  labCocreacionNatural: labCocreacionNaturalImg,
};

export const UDIFY_AGENT_URL = 'https://udify.app/agent/KH1A0kd7SiOVb6kW';

export interface EthicsCard {
  id: string;
  iconKey: 'authorship' | 'privacy' | 'verification' | 'agreements';
  title: string;
  description: string;
  principle: string;
  classroomClauses: string[];
}

export const ETHICS_CARDS: EthicsCard[] = [
  {
    id: 'autoria',
    iconKey: 'authorship',
    title: 'Autoría y voz propia',
    description:
      'Definimos qué aporta la herramienta y qué nace del pensamiento crítico del estudiante y del criterio docente.',
    principle: 'La inteligencia artificial asiste en la exploración, nunca sustituye la reflexión ni la autoría personal.',
    classroomClauses: [
      'Declarar siempre en qué fase del trabajo se consultó una herramienta generativa.',
      'Conservar borradores previos o mapas de ideas propios como evidencia de proceso.',
      'Evaluar el razonamiento oral y la argumentación contextual en clase.',
    ],
  },
  {
    id: 'privacidad',
    iconKey: 'privacy',
    title: 'Privacidad escolar',
    description:
      'Protegemos datos personales, calificaciones y producciones del alumnado evitando exponer información sensible.',
    principle: 'Ningún dato identificable de estudiantes o familias se introduce en modelos externos sin autorización.',
    classroomClauses: [
      'Anonimizar trabajos antes de solicitar sugerencias de retroalimentación.',
      'Usar alias o códigos de grupo en rúbricas asistidas y análisis de aula.',
      'Verificar políticas de retención de datos antes de adoptar cualquier recurso digital.',
    ],
  },
  {
    id: 'verificacion',
    iconKey: 'verification',
    title: 'Verificación crítica',
    description:
      'Fomentamos la lectura contrastada de fuentes, detección de sesgos y revisión rigurosa de cada resultado.',
    principle: 'Toda respuesta automatizada se trata como hipótesis inicial sujeta a contraste bibliográfico.',
    classroomClauses: [
      'Contrastar al menos dos fuentes primarias o académicas antes de validar un dato.',
      'Identificar omisiones culturales, históricas o de contexto local en las respuestas.',
      'Documentar errores detectados como ejercicio práctico de alfabetización digital.',
    ],
  },
  {
    id: 'acuerdos',
    iconKey: 'agreements',
    title: 'Acuerdos visibles',
    description:
      'Construimos pactos claros junto al grupo sobre cuándo, cómo y para qué usar asistentes en cada actividad.',
    principle: 'Las reglas de uso se acuerdan antes de iniciar el proyecto y se revisan en comunidad.',
    classroomClauses: [
      'Establecer niveles de uso permitido por actividad: libre, guiado o sin asistencia.',
      'Incluir una breve nota de transparencia al pie de cada entrega estudiantil.',
      'Abrir espacios de diálogo periódico sobre bienestar digital y carga cognitiva.',
    ],
  },
];

export interface EthicsActivityToolLink {
  step: number;
  label: string;
  tool: string;
  url: string;
}

export interface EthicsActivity {
  id: string;
  iconKey: 'interactive' | 'declaration';
  platform: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  previewImage?: string;
  previewImageAlt?: string;
  toolLinks?: EthicsActivityToolLink[];
}

export const ETHICS_ACTIVITIES: EthicsActivity[] = [
  {
    id: 'actividad-genially-etica',
    iconKey: 'interactive',
    platform: 'Actividad interactiva · Genially',
    title: 'Exploración ética en el aula',
    description:
      'Recorrido interactivo para reflexionar con estudiantes y docentes sobre decisiones responsables y uso ético de la IA.',
    url: 'https://view.genially.com/6ae8fc443c541b6b058ada7f',
    embedUrl: 'https://view.genially.com/6ae8fc443c541b6b058ada7f',
  },
  {
    id: 'actividad-4-declaracion-ia',
    iconKey: 'declaration',
    platform: 'Actividad 4 · Gamma',
    title: 'Elaborar una declaración de uso de IA',
    description:
      'Da clic en la imagen o en el botón para dirigirte a la presentación realizada en Gamma; sigue el paso a paso para desarrollar las actividades y dirigirte a las herramientas que esta incluye dentro de sí (Genially, Mentimeter, Ideamap, creación de prompts en PromptCowboy.ai y Padlet).',
    url: 'https://gamma.app/docs/Actividad-4-Elaborar-una-declaracion-de-uso-de-IA-a1fld3bqzvdyv8y',
    embedUrl: 'https://gamma.app/embed/a1fld3bqzvdyv8y',
    previewImage: gammaDeclaracionIaImg,
    previewImageAlt: 'Vista previa de la presentación en Gamma: Actividad 4 — Elaborar una declaración de uso de IA',
    toolLinks: [
      {
        step: 1,
        label: 'Explora el tablero guía',
        tool: 'Genially',
        url: 'https://view.genially.com/6ae8d49398017f3c6558a546',
      },
      {
        step: 2,
        label: 'Participa y vota en vivo',
        tool: 'Mentimeter',
        url: 'https://www.menti.com/aldnujp6wks4',
      },
      {
        step: 3,
        label: 'Mapea ideas clave con IA',
        tool: 'Ideamap',
        url: 'https://ideamap.ai/',
      },
      {
        step: 4,
        label: 'Publica: Mi declaración de IA',
        tool: 'Padlet individual',
        url: 'https://padlet.com/dghoo92/mi-declaracion-de-ia-s0253cr36w4umpx003wi',
      },
      {
        step: 5,
        label: 'Crea y afina tus prompts',
        tool: 'PromptCowboy.ai',
        url: 'https://www.promptcowboy.ai/',
      },
      {
        step: 6,
        label: 'Declaraciones finales por grupo',
        tool: 'Padlet grupal',
        url: 'https://padlet.com/dghoo92/declaraciones-de-uso-de-ia-finales-por-grupo-s0253d87rk4e2folpc99',
      },
    ],
  },
];

export interface EthicsDocument {
  id: string;
  kicker: string;
  title: string;
  description: string;
  highlights: string[];
  pdfUrl: string;
}

export const ETHICS_CODE_PDF: EthicsDocument = {
  id: 'codigo-conducta-institucional-ia',
  kicker: 'Actividad 2: Uso responsable, seguro y ético de la IA',
  title: 'Uso responsable, seguro y ético de la IA: Propuesta de código de conducta institucional',
  description:
    'Primer paso.\nVamos a explorar las siguientes herramientas de badges para poder abordar el tema. Hay que tener en cuenta la parte ética del uso de la IA. Aprenderemos los principios clave de su uso; podremos explorar las herramientas para la verificación del uso de IA: buscamos la herramienta en la web y la exploramos. Por otro lado, tendremos en cuenta los compromisos del docente y del estudiante y, por último, las recomendaciones extra. Recuerda leer el documento.',
  highlights: [
    'Principios clave de transparencia, privacidad e integridad',
    'Badges de declaración: Human Nature, AI Assisted, AI Co-Creation y AI Core',
    'Compromisos diferenciados para docentes y estudiantes',
  ],
  pdfUrl: '/assets/aistudio/C_digo_de_conducta_institucional_sobre_IA_eb02e910.pdf',
};

export const PROJECT_DOCUMENT: EthicsDocument = {
  id: 'nuestro-proyecto-ia',
  kicker: 'Nuestro proyecto · Documento PDF adjunto',
  title: 'Laboratorio de Co-creación con IA — Proyecto Gimnasio Fontana',
  description:
    'Documento completo del proyecto desarrollado por Erika Salcedo, Jessica Hoyos, Gilberto Africano y Donobang González: contexto institucional, diagnóstico a 76 docentes, fundamentación teórica, fases, cronograma, evaluación y declaración de uso de IA.',
  highlights: [
    'Autores: Erika Salcedo, Jessica Hoyos, Gilberto Africano y Donobang González',
    'Diagnóstico aplicado a 76 docentes del Colegio Gimnasio Fontana',
    'Metodología ABP en 3 fases: Diagnóstico, Formulación y Ejecución',
  ],
  pdfUrl: '/assets/aistudio/OBS_-_Erika-Jessica-Gilberto-Donobang__3__fa34096e.pdf',
};

export const ETHICS_CODE_PRESENTATION = {
  headerTitle: 'Uso responsable, seguro y ético de la IA',
  headerSubtitle: 'Propuesta de código de conducta institucional – Docentes y estudiantes',
  principiosClave: [
    {
      label: 'Transparencia',
      text: 'declarar siempre cuándo y cómo se usa la IA',
    },
    {
      label: 'Privacidad y seguridad',
      text: 'no compartir datos personales ni sensibles',
    },
    {
      label: 'Integridad académica',
      text: 'la autoría y el aprendizaje son humanos',
    },
    {
      label: 'Equidad e inclusión',
      text: 'evitar sesgos y garantizar acceso justo',
    },
    {
      label: 'Pensamiento crítico',
      text: 'verificar y contrastar la información generada',
    },
    {
      label: 'Responsabilidad humana',
      text: 'la persona responde por lo que entrega',
    },
  ],
  badgesIntro: 'De la autoría 100% humana al uso ético y crítico de IA',
  badges: [
    {
      num: '01',
      name: 'HUMAN NATURE',
      subtitle: 'Sin IA / 100% humano',
      description:
        'Elaboración totalmente individual o grupal sin asistencia de modelos generativos.',
      status: 'Recomendado',
      accent: 'teal' as const,
    },
    {
      num: '02',
      name: 'AI ASSISTED',
      subtitle: 'IA como asistente de edición',
      description:
        'Uso exclusivo para corrección ortográfica, organización de elementos creados por un agente humano o para lluvia de ideas inicial.',
      status: 'Uso declarado',
      accent: 'blue' as const,
    },
    {
      num: '03',
      name: 'AI CO-CREATION',
      subtitle: 'Co-creación y auditoría',
      description:
        'Uso de la IA para generación de borradores o búsqueda de datos, adjuntando obligatoriamente bitácora de prompts en la declaración del uso de IA.',
      status: 'Con bitácora',
      accent: 'amber' as const,
    },
    {
      num: '04',
      name: 'AI CORE',
      subtitle: 'Uso de IA 100% en momentos específicos',
      description:
        'En momentos muy concretos donde se use la IA como insumo para actividades que no tengan un efecto directo sobre el objetivo, el indicador o la adquisición del conocimiento.',
      status: 'Supervisado y concreto',
      accent: 'red' as const,
    },
  ],
  compromisosDocentes: [
    'Definir y comunicar qué badge de uso de IA se permite en cada actividad.',
    'Diseñar evaluaciones que prioricen el proceso y el pensamiento crítico.',
    'Modelar un uso ético y declarado de la IA.',
    'Formarse continuamente.',
    'Retroalimentar sin sancionar de forma automática con detectores de IA.',
  ],
  compromisosEstudiantes: [
    'Declarar el badge de uso de IA en cada trabajo.',
    'Conservar la bitácora de prompts cuando corresponda.',
    'Verificar fuentes y datos.',
    'No suplantar la autoría.',
    'No ingresar datos personales propios ni de otras personas.',
    'Usar la IA para aprender, no para evitar aprender.',
  ],
  recomendaciones: [
    'Contrastar siempre con fuentes confiables',
    'Citar la herramienta usada',
    'Revisar sesgos y errores ("alucinaciones")',
    'Proteger la privacidad',
    'Ante dudas, consultar al docente antes de usar IA',
  ],
  footerNote:
    'Construido por equipos – Socializamos y consolidamos nuestro código de conducta institucional',
};

export interface CanvaConductSlide {
  id: string;
  title: string;
  caption: string;
  image: string;
  imageAlt: string;
}

export const CANVA_CONDUCT_TITLE = 'Código de conducta IA';
export const CANVA_CONDUCT_EMBED_URL =
  'https://www.canva.com/design/DAHad30KKqA/8Sg--0-0R389mlL0eAPI5w/view?embed';

export const CANVA_CONDUCT_SLIDES: CanvaConductSlide[] = [
  {
    id: 'canva-slide-1',
    title: '1. Propuesta visual en equipo',
    caption: 'Co-diseño colaborativo del código de conducta institucional sobre IA.',
    image: canvaSlide1PortadaImg,
    imageAlt: 'Diapositiva 1: Equipo docente co-diseñando la propuesta visual en Canva',
  },
  {
    id: 'canva-slide-2',
    title: '2. Principios clave',
    caption: 'Transparencia, privacidad escolar, autoría humana y verificación crítica.',
    image: canvaSlide2PrincipiosImg,
    imageAlt: 'Diapositiva 2: Cuatro pilares visuales de principios clave para el uso ético de IA',
  },
  {
    id: 'canva-slide-3',
    title: '3. Compromisos compartidos',
    caption: 'Acuerdos visibles entre docentes y estudiantes para el uso responsable.',
    image: canvaSlide3CompromisosImg,
    imageAlt: 'Diapositiva 3: Compromisos compartidos entre docentes y estudiantes',
  },
  {
    id: 'canva-slide-4',
    title: '4. Recomendaciones e insignias',
    caption: 'Mural final con badges de declaración, citación y fuentes confiables.',
    image: canvaSlide4RecomendacionesImg,
    imageAlt: 'Diapositiva 4: Mural institucional con recomendaciones, insignias y verificación',
  },
];

export const DIAGNOSTIC_PRESENTATION: EthicsActivity = {
  id: 'presentacion-diagnostico-netlify',
  iconKey: 'interactive',
  platform: 'Presentación anclada · Diagnóstico',
  title: 'Nuestro diagnóstico interactivo',
  description:
    'Navega directamente por la presentación de diagnóstico docente sin salir del portafolio.',
  url: 'https://classy-kringle-e916d2.netlify.app/',
  embedUrl: 'https://classy-kringle-e916d2.netlify.app/',
};

export const DIAGNOSTIC_SURVEY_PDF: EthicsDocument = {
  id: 'encuesta-diagnostico-ia',
  kicker: 'Encuesta realizada · PDF · 3 páginas',
  title: 'Encuesta de Diagnóstico: Uso de IA en la Práctica Docente',
  description:
    'Encuesta realizada al equipo docente para recolectar información clave sobre frecuencia de uso, herramientas y prioridades de formación en IA.',
  highlights: [],
  pdfUrl: '/assets/aistudio/Encuesta_de_Diagn_stico__Uso_de_IA_en_la_Pr_ctica_Docente_68c501f1.pdf',
};

export const DIAGNOSTIC_ANALYSIS_VIDEO: EthicsActivity = {
  id: 'analisis-encuesta-diagnostico',
  iconKey: 'interactive',
  platform: 'Análisis en video · YouTube',
  title: 'Análisis de la encuesta realizada',
  description:
    'Recorrido audiovisual con el análisis e interpretación de los resultados de la encuesta diagnóstica docente.',
  url: 'https://www.youtube.com/watch?v=DssRG3TVVPg',
  embedUrl: 'https://www.youtube.com/embed/DssRG3TVVPg?rel=0',
};

export const MURO_QR_URL = '/?vista=muro-qr#mapas';
export const MURO_QR_RETOS_URL = '/?vista=muro-qr#retos';

export interface Activity2Step {
  slideNumber: number;
  stepLabel: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  link?: { label: string; url: string };
}

export const ACTIVITY_2_STEPS: Activity2Step[] = [
  {
    slideNumber: 3,
    stepLabel: 'Paso 1',
    title: 'Paso 1: ubícate en tu mesa',
    body: 'Ve a la mesa que te corresponde y reúnete con tu equipo.',
    image: step1TeamTableImg,
    imageAlt: 'Ilustración de docentes reuniéndose alrededor de su mesa de trabajo colaborativo',
  },
  {
    slideNumber: 4,
    stepLabel: 'Paso 2',
    title: 'Paso 2: mapa mental con tus herramientas de IA',
    body: 'Creen un mapa mental con las herramientas de IA que el equipo usa actualmente. Háganlo en Mapify:',
    image: step2MindmapIaImg,
    imageAlt: 'Ilustración de una tableta mostrando un mapa mental ramificado con herramientas de IA',
    link: { label: 'mapify.so/es', url: 'https://mapify.so/es' },
  },
  {
    slideNumber: 5,
    stepLabel: 'Paso 3',
    title: 'Paso 3: publiquen el mapa en el Muro',
    body: 'Escaneen este código QR para publicar el mapa mental en el Muro del grupo.',
    image: step3PadletQrImg,
    imageAlt: 'Ilustración de un teléfono escaneando un código QR junto a un muro colaborativo',
    link: { label: 'Abrir Muro QR (Google Drive)', url: MURO_QR_URL },
  },
  {
    slideNumber: 6,
    stepLabel: 'Paso 4',
    title: 'Paso 4: abre tu reto',
    body: 'Escanea este código QR para entrar a la carpeta con el reto asignado a tu equipo.',
    image: step4ChallengeFolderImg,
    imageAlt: 'Ilustración de una carpeta de reto con tarjeta QR y pieza de rompecabezas sobre el escritorio',
    link: { label: 'Abrir Muro QR (Retos de IA)', url: MURO_QR_RETOS_URL },
  },
  {
    slideNumber: 7,
    stepLabel: 'Paso 5',
    title: 'Paso 5: resuelvan el reto con IA',
    body: 'Usen la herramienta recomendada en la carpeta o cualquier otra con la que puedan cumplir el reto. Esta tabla es una guía.',
    image: step5SolveAiImg,
    imageAlt: 'Ilustración de docentes colaborando frente a una laptop con guía de herramientas de IA',
  },
  {
    slideNumber: 8,
    stepLabel: 'Paso 6',
    title: 'Paso 6: suban el resultado final',
    body: 'Suban el producto final a la misma carpeta del reto. Verifiquen que el mapa mental esté publicado en el Muro.',
    image: step6UploadFinalImg,
    imageAlt: 'Ilustración de un documento final subiendo a una carpeta compartida con insignia de verificación',
  },
];

export interface AgentModule {
  id: string;
  category: 'Planificación' | 'Evaluación' | 'Inclusión' | 'Tutoría' | 'Integridad';
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  samplePrompt: string;
  guardrail: string;
}

export const AGENT_MODULES: AgentModule[] = [
  {
    id: 'planificador-secuencias',
    category: 'Planificación',
    title: 'Arquitecto de secuencias didácticas',
    description: 'Estructura sesiones activas alineadas con tus objetivos y tiempos reales de clase.',
    image: IMAGES.agentLesson,
    imageAlt: 'Ilustración editorial de tarjetas modulares de planificación curricular y brújula naranja',
    samplePrompt:
      'Actúa como asesor pedagógico. Diseña una secuencia de 3 sesiones de 50 minutos para 2.º de secundaria sobre ciclo del agua en contextos urbanos, integrando una actividad experimental sin pantallas y una puesta en común.',
    guardrail: 'Revisa la pertinencia cultural y ajusta los materiales al entorno real de tu escuela.',
  },
  {
    id: 'disenador-rubricas',
    category: 'Evaluación',
    title: 'Asistente de rúbricas formativas',
    description: 'Redacta criterios observables y descriptores claros para acompañar el progreso.',
    image: IMAGES.agentRubric,
    imageAlt: 'Ilustración editorial de hojas de evaluación, balanza equilibrada y listones naranjas',
    samplePrompt:
      'Crea una rúbrica analítica de 4 niveles (Inicial, En desarrollo, Logrado, Destacado) para evaluar un debate argumentado sobre energía renovable, enfocada en escucha activa, evidencia y claridad oral.',
    guardrail: 'Comparte y calibra los descriptores con tus estudiantes antes de aplicar la evaluación.',
  },
  {
    id: 'adaptador-dua',
    category: 'Inclusión',
    title: 'Adaptador DUA y lectura accesible',
    description: 'Genera múltiples formatos, apoyos visuales y versiones escalonadas para aulas diversas.',
    image: IMAGES.agentInclusive,
    imageAlt: 'Ilustración editorial de arcos orgánicos entrelazados, libro abierto y ondas sonoras',
    samplePrompt:
      'Adapta este texto expositivo de ciencias naturales en tres niveles de complejidad lectora manteniendo el vocabulario científico clave y añadiendo un glosario visual breve.',
    guardrail: 'Valida siempre la precisión conceptual tras simplificar la estructura sintáctica.',
  },
  {
    id: 'tutor-socratico',
    category: 'Tutoría',
    title: 'Guía de preguntas socráticas',
    description: 'Propone pistas progresivas para que el estudiante piense por sí mismo sin dar la respuesta.',
    image: IMAGES.agentSocratic,
    imageAlt: 'Ilustración editorial de globos de diálogo floreciendo junto a un farol cálido',
    samplePrompt:
      'Cuando un estudiante pregunte cómo resolver una ecuación lineal o interpretar un poema, responde únicamente con una pregunta orientadora que le ayude a identificar el siguiente paso por su cuenta.',
    guardrail: 'Limita el número de turnos y fomenta que el estudiante explique su razonamiento en cuaderno.',
  },
  {
    id: 'auditor-etico',
    category: 'Integridad',
    title: 'Revisor de sesgos y acuerdos',
    description: 'Contrasta consignas y materiales para detectar sesgos, vacíos o riesgos de privacidad.',
    image: IMAGES.agentEthics,
    imageAlt: 'Ilustración editorial de un arco botánico protector rodeando un prisma cristalino',
    samplePrompt:
      'Revisa esta consigna de proyecto trimestral e identifica posibles ambigüedades sobre el uso permitido de IA, riesgos de copia mecánica y maneras de fortalecer la producción presencial.',
    guardrail: 'Mantén el criterio pedagógico y las normativas institucionales como decisión final.',
  },
];

export interface ClassroomAiTool {
  id: string;
  name: string;
  category: 'Planeación y guías' | 'Diseño y presentaciones' | 'Investigación y estudio';
  url: string;
  image: string;
  imageAlt: string;
  purpose: string;
  howToUse: string;
  collageSpan: string;
  imageAspect: string;
}

export const CLASSROOM_AI_TOOLS: ClassroomAiTool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'Planeación y guías',
    url: 'https://chatgpt.com',
    image: eduAiChatgptImg,
    imageAlt: 'Ilustración de cuaderno docente con bloques de planeación y burbujas conversacionales de IA',
    purpose:
      'Sirve para diseñar secuencias didácticas, redactar rúbricas, generar preguntas socráticas y adaptar textos a distintos niveles lectores.',
    howToUse:
      'Indícale tu grado, materia y objetivo de aprendizaje; pide 2 o 3 actividades activas y ajusta el resultado a tu grupo.',
    collageSpan: 'lg:col-span-7',
    imageAspect: 'aspect-[16/9]',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'Investigación y estudio',
    url: 'https://gemini.google.com',
    image: eduAiGeminiImg,
    imageAlt: 'Ilustración multimodal de prisma luminoso sobre tableta educativa y libro de ciencias',
    purpose:
      'Sirve para sintetizar lecturas largas, crear cuestionarios, analizar imágenes educativas y generar ideas conectadas con Google Workspace.',
    howToUse:
      'Comparte un tema, foto o documento base y pídele explicaciones paso a paso o ejercicios diferenciados para el aula.',
    collageSpan: 'lg:col-span-5',
    imageAspect: 'aspect-[4/3]',
  },
  {
    id: 'canva-ia',
    name: 'Canva (Estudio Mágico)',
    category: 'Diseño y presentaciones',
    url: 'https://www.canva.com',
    image: eduAiCanvaImg,
    imageAlt: 'Ilustración de caballete creativo con gráficas educativas, pinceles y varita mágica',
    purpose:
      'Sirve para diseñar infografías, presentaciones visuales, fichas de trabajo, códigos de conducta y recursos impresos atractivos.',
    howToUse:
      'Elige una plantilla educativa, escribe tu idea con Texto Mágico o genera ilustraciones de apoyo y compártela con tu grupo.',
    collageSpan: 'lg:col-span-5',
    imageAspect: 'aspect-[4/3]',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    category: 'Diseño y presentaciones',
    url: 'https://gamma.app',
    image: eduAiGammaImg,
    imageAlt: 'Ilustración de notas de esquema transformándose en diapositivas visuales interactivas',
    purpose:
      'Sirve para convertir esquemas, apuntes o guías docentes en presentaciones web interactivas con tarjetas y diagramas listos en minutos.',
    howToUse:
      'Pega la estructura de tu clase o tema, elige un diseño limpio y revisa los ejemplos antes de proyectar o compartir el enlace.',
    collageSpan: 'lg:col-span-7',
    imageAspect: 'aspect-[16/9]',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    category: 'Investigación y estudio',
    url: 'https://www.perplexity.ai',
    image: eduAiPerplexityImg,
    imageAlt: 'Ilustración de lupa explorando libros académicos y sellos de fuentes verificadas',
    purpose:
      'Sirve para investigar temas escolares con respuestas respaldadas por fuentes citadas y enlaces verificables en tiempo real.',
    howToUse:
      'Formula preguntas concretas con tus estudiantes y pídeles contrastar al menos dos de las referencias enlazadas antes de concluir.',
    collageSpan: 'lg:col-span-6',
    imageAspect: 'aspect-[16/9]',
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'Planeación y guías',
    url: 'https://notebooklm.google.com',
    image: eduAiNotebooklmImg,
    imageAlt: 'Ilustración de cuaderno de estudio conectado con carpetas PDF, ondas de audio y mapas de ideas',
    purpose:
      'Sirve para estudiar y preparar clases únicamente a partir de tus propios PDFs, programas oficiales o lecturas subidas, generando guías y resúmenes en audio.',
    howToUse:
      'Sube los materiales de tu asignatura en un cuaderno y solicita guías de estudio, preguntas de repaso o glosarios sin salir de tus fuentes.',
    collageSpan: 'lg:col-span-6',
    imageAspect: 'aspect-[16/9]',
  },
];

export interface PortfolioUsedTool {
  id: string;
  number: string;
  name: string;
  stage: string;
  stageHref: string;
  url: string;
  usedFor: string;
}

export const PORTFOLIO_USED_TOOLS: PortfolioUsedTool[] = [
  {
    id: 'used-chatgpt',
    number: '01',
    name: 'ChatGPT',
    stage: 'Herramientas IA para clase',
    stageHref: '#agente-ia',
    url: 'https://chatgpt.com',
    usedFor: 'Investigar y creación de imágenes.',
  },
  {
    id: 'used-gemini',
    number: '02',
    name: 'Gemini',
    stage: 'Herramientas IA para clase',
    stageHref: '#agente-ia',
    url: 'https://gemini.google.com',
    usedFor: 'Investigar y creación de imágenes.',
  },
  {
    id: 'used-notebooklm',
    number: '03',
    name: 'NotebookLM',
    stage: 'Herramientas IA para clase',
    stageHref: '#agente-ia',
    url: 'https://notebooklm.google.com',
    usedFor:
      'Generar guías de estudio, glosarios, preguntas de repaso y resúmenes en audio basados únicamente en PDFs y documentos propios del docente.',
  },
  {
    id: 'used-perplexity',
    number: '04',
    name: 'Perplexity',
    stage: 'Herramientas IA para clase',
    stageHref: '#agente-ia',
    url: 'https://www.perplexity.ai',
    usedFor:
      'Investigar conceptos escolares con respuestas respaldadas por fuentes citadas y enlaces verificables para contrastar información.',
  },
  {
    id: 'used-udify',
    number: '05',
    name: 'Udify (Asistente Virtual)',
    stage: 'Asistente virtual · Todo el portafolio',
    stageHref: '#contacto',
    url: 'https://udify.app/agent/KH1A0kd7SiOVb6kW',
    usedFor:
      'Crear e integrar el asistente virtual conversacional (en la sección final y en el botón flotante) para responder dudas sobre ética, retos y acuerdos escolares.',
  },
  {
    id: 'used-mapify',
    number: '06',
    name: 'Mapify',
    stage: 'Co-creación · Actividades 2 y 2.1',
    stageHref: '#co-creacion',
    url: 'https://mapify.so/es',
    usedFor:
      'Transformar bocetos y lluvia de ideas del equipo docente en mapas mentales estructurados automáticamente con inteligencia artificial.',
  },
  {
    id: 'used-canva-ia',
    number: '07',
    name: 'Canva IA (Estudio Mágico)',
    stage: 'Co-creación · Act. 3 y Ética · Act. 2.1',
    stageHref: '#etica',
    url: 'https://www.canva.com',
    usedFor:
      'Co-diseñar presentaciones visuales, infografías educativas y el código de conducta institucional usando Magic Design, Magic Media y Texto Mágico.',
  },
  {
    id: 'used-gamma',
    number: '08',
    name: 'Gamma',
    stage: 'Ética · Actividad 4',
    stageHref: '#etica',
    url: 'https://gamma.app/docs/Actividad-4-Elaborar-una-declaracion-de-uso-de-IA-a1fld3bqzvdyv8y',
    usedFor:
      'Construir la presentación interactiva paso a paso que guía a docentes y estudiantes en la elaboración de su declaración de uso de IA.',
  },
  {
    id: 'used-ideamap',
    number: '09',
    name: 'Ideamap',
    stage: 'Ética · Ruta Actividad 4',
    stageHref: '#etica',
    url: 'https://ideamap.ai/',
    usedFor:
      'Facilitar lluvias de ideas visuales y mapear conceptos clave en equipo con asistencia de IA durante la preparación de acuerdos éticos.',
  },
  {
    id: 'used-promptcowboy',
    number: '10',
    name: 'PromptCowboy.ai',
    stage: 'Ética · Ruta Actividad 4',
    stageHref: '#etica',
    url: 'https://www.promptcowboy.ai/',
    usedFor:
      'Redactar, estructurar y perfeccionar prompts claros (con rol, contexto y límites) antes de usar herramientas generativas en clase.',
  },
  {
    id: 'used-genially',
    number: '11',
    name: 'Genially',
    stage: 'Ética · Exploración y Actividad 4',
    stageHref: '#etica',
    url: 'https://view.genially.com/6ae8fc443c541b6b058ada7f',
    usedFor:
      'Presentar recorridos y tableros interactivos para analizar casos reales sobre privacidad, autoría y uso responsable de la IA en el aula.',
  },
  {
    id: 'used-mentimeter',
    number: '12',
    name: 'Mentimeter',
    stage: 'Co-creación · Act. 1 y Ética · Act. 4',
    stageHref: '#co-creacion',
    url: 'https://www.menti.com/aldnujp6wks4',
    usedFor:
      'Activar la participación inicial del claustro con votaciones en tiempo real, nubes de palabras y sondeos exploratorios sobre IA en el aula.',
  },
  {
    id: 'used-wordwall',
    number: '13',
    name: 'Wordwall',
    stage: 'Co-creación · Actividad 4',
    stageHref: '#co-creacion',
    url: 'https://wordwall.net/es/resource/123006119?wwmethod=link',
    usedFor:
      'Diseñar juegos educativos y retos interactivos para repasar y evaluar de forma lúdica los aprendizajes del taller docente.',
  },
  {
    id: 'used-padlet',
    number: '14',
    name: 'Padlet',
    stage: 'Ética · Ruta Actividad 4',
    stageHref: '#etica',
    url: 'https://padlet.com/dghoo92/mi-declaracion-de-ia-s0253cr36w4umpx003wi',
    usedFor:
      'Recopilar y socializar en murales colaborativos las declaraciones individuales y grupales sobre el uso transparente de la IA.',
  },
  {
    id: 'used-github',
    number: '15',
    name: 'GitHub',
    stage: 'Repositorio web · Portafolio',
    stageHref: '#introduccion',
    url: 'https://github.com',
    usedFor:
      'Alojar y gestionar el repositorio web del portafolio de actividades con control de versiones.',
  },
  {
    id: 'used-vercel',
    number: '16',
    name: 'Vercel',
    stage: 'Repositorio web · Portafolio',
    stageHref: '#introduccion',
    url: 'https://vercel.com',
    usedFor:
      'Publicar y desplegar en línea el repositorio web del portafolio de actividades.',
  },
  {
    id: 'used-aistudio',
    number: '17',
    name: 'AI Studio',
    stage: 'Repositorio web · Portafolio',
    stageHref: '#introduccion',
    url: 'https://aistudio.google.com',
    usedFor:
      'Creación y desarrollo asistido del sitio y repositorio web del portafolio de actividades.',
  },
];


export interface SkillItem {
  id: string;
  name: string;
  category: 'Currículo' | 'Evaluación' | 'Accesibilidad';
  percentage: number;
  context: string;
}

export interface ToolBadge {
  id: string;
  label: string;
  category: 'Currículo' | 'Evaluación' | 'Accesibilidad';
  description: string;
}

export const TOOLS_LIST: ToolBadge[] = [
  {
    id: 'secuencias',
    label: 'Secuencias DUA',
    category: 'Currículo',
    description: 'Diseño de unidades flexibles por fases y retos reales.',
  },
  {
    id: 'prompts',
    label: 'Prompts pedagógicos',
    category: 'Currículo',
    description: 'Instrucciones claras con rol, contexto y límites éticos.',
  },
  {
    id: 'rubricas',
    label: 'Rúbricas vivas',
    category: 'Evaluación',
    description: 'Descriptores accionables para retroalimentación temprana.',
  },
  {
    id: 'contraste',
    label: 'Contraste crítico',
    category: 'Evaluación',
    description: 'Verificación de fuentes y detección de alucinaciones.',
  },
  {
    id: 'lectura',
    label: 'Lectura graduada',
    category: 'Accesibilidad',
    description: 'Versiones multinivel sin perder rigor disciplinar.',
  },
  {
    id: 'pactos',
    label: 'Bitácora de aula',
    category: 'Accesibilidad',
    description: 'Registro transparente de acuerdos entre docentes y grupo.',
  },
];

export const SKILLS_LIST: SkillItem[] = [
  {
    id: 'diseno-instruccional',
    name: 'Diseño de prompts con intención didáctica',
    category: 'Currículo',
    percentage: 94,
    context: 'Alineación curricular y actividades presenciales',
  },
  {
    id: 'curaduria-critica',
    name: 'Curaduría crítica y detección de sesgos',
    category: 'Evaluación',
    percentage: 89,
    context: 'Validación disciplinar antes de llevar al aula',
  },
  {
    id: 'retroalimentacion',
    name: 'Retroalimentación formativa oportuna',
    category: 'Evaluación',
    percentage: 92,
    context: 'Rúbricas claras y diálogo sobre el proceso',
  },
  {
    id: 'personalizacion-dua',
    name: 'Adaptación inclusiva y multinivel (DUA)',
    category: 'Accesibilidad',
    percentage: 87,
    context: 'Diversidad de ritmos, apoyos y formatos',
  },
  {
    id: 'gobernanza-etica',
    name: 'Acuerdos éticos y privacidad de datos',
    category: 'Currículo',
    percentage: 96,
    context: 'Transparencia y cuidado del alumnado',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  institution: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'valeria-mendoza',
    quote:
      'Pasamos de prohibir herramientas por temor a construir un pacto claro por departamento. Hoy ahorramos cuatro horas semanales en preparación de materiales y las dedicamos a tutorías directas.',
    name: 'Valeria Mendoza Ríos',
    role: 'Coordinadora Académica de Humanidades',
    institution: 'Colegio Horizonte Sur · Madrid',
  },
  {
    id: 'mateo-salazar',
    quote:
      'El enfoque de co-creación cambió nuestra sala de profesores. El agente no reemplaza nuestra voz: nos ayuda a adaptar textos para estudiantes con distintos ritmos lectores sin perder rigor.',
    name: 'Mateo Salazar Ibáñez',
    role: 'Docente de Ciencias Naturales',
    institution: 'Instituto Nueva Savia · Bogotá',
  },
  {
    id: 'carmen-iturbe',
    quote:
      'La matriz de diagnóstico nos permitió ver exactamente qué necesitaba el claustro. Empezamos por acuerdos éticos simples y hoy cada docente diseña rúbricas transparentes con seguridad.',
    name: 'Carmen Iturbe Navarro',
    role: 'Directora de Innovación Pedagógica',
    institution: 'Red Escolar Alerce · Santiago',
  },
];

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  options: { label: string; score: number }[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q1',
    prompt: '¿Cómo aborda actualmente tu equipo docente el uso de IA en las asignaturas?',
    options: [
      { label: 'Aún no hemos definido criterios comunes ni experiencias guiadas', score: 1 },
      { label: 'Algunos docentes experimentan de forma individual sin acuerdos de centro', score: 2 },
      { label: 'Contamos con prácticas compartidas y revisión crítica entre pares', score: 3 },
    ],
  },
  {
    id: 'q2',
    prompt: '¿Qué nivel de claridad tienen tus estudiantes sobre cuándo y cómo citar asistencia digital?',
    options: [
      { label: 'No existen acuerdos explícitos en el aula todavía', score: 1 },
      { label: 'Se menciona de manera verbal en algunas tareas puntuales', score: 2 },
      { label: 'Trabajamos con rúbricas y acuerdos visibles desde inicio de proyecto', score: 3 },
    ],
  },
  {
    id: 'q3',
    prompt: '¿Cuál es tu principal prioridad para integrar un agente pedagógico este trimestre?',
    options: [
      { label: 'Comprender fundamentos éticos y perder el miedo técnico inicial', score: 1 },
      { label: 'Co-crear secuencias didácticas y adaptaciones multinivel más rápido', score: 2 },
      { label: 'Consolidar evaluación formativa y tutoría socrática con criterios propios', score: 3 },
    ],
  },
  {
    id: 'q4',
    prompt: '¿Cómo protegen la privacidad de los trabajos y datos escolares al usar herramientas digitales?',
    options: [
      { label: 'Necesitamos una guía práctica de anonimización y buenas prácticas', score: 1 },
      { label: 'Evitamos subir nombres propios, aunque falta estandarizar el proceso', score: 2 },
      { label: 'Seguimos protocolos claros de anonimización y revisión institucional', score: 3 },
    ],
  },
];
