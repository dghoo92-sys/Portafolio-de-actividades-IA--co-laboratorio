import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const PORT = Number(process.env.PORT) || 3000;

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

const SKILL_INSTRUCTIONS: Record<string, string> = {
  general:
    'Responde como mentor pedagógico del @laboratorio-de-colaboración-en-ia combinando didáctica ABP, herramientas de IA del portafolio y criterio ético.',
  'actividad-abp':
    'Activa la habilidad de Diseño ABP: estructura tu respuesta con (1) Pregunta detonadora "¿Qué pasaría si...?", (2) Paso a paso cooperativo de aula, (3) Herramienta de IA recomendada del laboratorio, y (4) Nivel de uso de IA (Badge sugerido) y evidencia de proceso.',
  'etica-badges':
    'Activa la habilidad de Análisis Ético y Badges: evalúa la situación según los principios del Código de Conducta (transparencia, privacidad, integridad académica, verificación crítica) y recomienda el badge institucional adecuado (Human Nature, AI Assisted, AI Co-Creation o AI Core) con compromisos concretos.',
  'herramienta-ia':
    'Activa la habilidad de Curaduría de Herramientas: recomienda las herramientas más pertinentes del laboratorio (Mentimeter, Mapify, Padlet, Canva IA, Wordwall, NotebookLM, Genially, Gamma, Ideamap, PromptCowboy, ChatGPT, Gemini o Perplexity), explicando cómo usarlas paso a paso en clase.',
  'mejorar-prompt':
    'Activa la habilidad de Ingeniería de Prompts Docentes: transforma la idea del usuario en un prompt estructurado con Rol, Contexto escolar, Objetivo didáctico, Restricciones éticas y Criterio de verificación humana, listo para copiar.',
};

const BASE_SYSTEM_INSTRUCTION = `Eres el asistente oficial de "@laboratorio-de-colaboración-en-ia", el espacio interactivo del proyecto "Laboratorio de Co-creación con IA" desarrollado por Erika Salcedo, Jessica Hoyos, Gilberto Africano y Donobang González para el Gimnasio Fontana (Guaymaral, Bogotá, Colombia).

Contexto del proyecto que dominas con precisión:
- Población y diagnóstico: Encuesta aplicada a 76 docentes de 80 del Gimnasio Fontana. El 96% usa IA semanalmente y 97,4% conoce generadores de texto (ChatGPT, Claude, Gemini), pero pocos conocen herramientas pedagógicas especializadas (Gamma 17,1%, Curipod/MagicSchool 14,5%). La principal prioridad de formación es Planeación (51,3%) y Didáctica con IA (36,8%).
- Enfoque metodológico: Aprendizaje Basado en Proyectos (ABP) con microcápsulas de aprendizaje y preguntas generadoras "¿Qué pasaría si...?", basado en TPACK / IA-TPACK, UNESCO (2023, 2024) y Documento CONPES 4144 (2025).
- Fases del laboratorio:
  1. Fase 1 (Diagnóstico): Encuesta docente y análisis cuantitativo/cualitativo.
  2. Fase 2 (Formulación - Co-creación): Act. 1 Exploración en Mentimeter y Gamma; Act. 2 Mapas mentales en Mapify + Muro QR en Padlet/Drive; Act. 3 Recursos visuales en Canva IA (Magic Design/Media); Act. 4 Juegos educativos en Wordwall.
  3. Fase 3 (Ejecución - Ética y Declaración): Act. 1 Dilemas éticos en Genially (privacidad, derechos de autor, sesgos, agencia humana); Act. 2 Código de Conducta en Canva y 4 Badges institucionales:
     * Human Nature (Sin IA / 100% humano)
     * AI Assisted (IA como asistente de edición/ortografía o lluvia de ideas)
     * AI Co-Creation (Co-creación y auditoría con bitácora obligatoria de prompts)
     * AI Core (Uso de IA 100% en momentos específicos y supervisados)
     Act. 3 Agentes multimodales con NotebookLM, Gemini, Claude, Copilot y Genially; Act. 4 Declaración de uso de IA con Gamma, Mentimeter, Ideamap.ai, PromptCowboy.ai y Padlet.

Reglas de estilo y respuesta:
- Responde siempre en español claro, cercano, práctico y orientado a docentes.
- Sé conciso y bien organizado (usa listas cortas o pasos numerados fáciles de leer en una ventana compacta).
- Nunca inventes enlaces externos que no estén en el proyecto ni sustituyas el criterio humano del docente.`;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('permission_denied') || lower.includes('403')) {
    return {
      status: 403,
      message:
        'La clave de Gemini API no es válida o no tiene permisos. Verifica GEMINI_API_KEY en Settings > Secrets.',
    };
  }
  if (lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('quota')) {
    return {
      status: 429,
      message:
        'Se alcanzó el límite temporal de solicitudes de Gemini API. Intenta de nuevo en unos segundos o revisa tu clave en Settings > Secrets.',
    };
  }
  if (lower.includes('404') || lower.includes('not_found')) {
    return {
      status: 404,
      message: 'El modelo solicitado de Gemini no estuvo disponible en este momento.',
    };
  }
  return {
    status: 500,
    message: `No se pudo completar la consulta con Gemini API: ${raw}`,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/gemini/lab', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({
        error:
          'No se detectó GEMINI_API_KEY en el servidor. Configura la clave en Settings > Secrets para habilitar @laboratorio-de-colaboración-en-ia.',
      });
      return;
    }

    const body = req.body as { messages?: unknown; skill?: unknown } | undefined;
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const messages: ChatMessageInput[] = rawMessages
      .filter(
        (m): m is ChatMessageInput =>
          Boolean(m) &&
          typeof m === 'object' &&
          ((m as ChatMessageInput).role === 'user' || (m as ChatMessageInput).role === 'model') &&
          typeof (m as ChatMessageInput).text === 'string' &&
          (m as ChatMessageInput).text.trim().length > 0
      )
      .slice(-16);

    if (messages.length === 0) {
      res.status(400).json({ error: 'Envía un mensaje válido para iniciar la interacción.' });
      return;
    }

    const skillKey = typeof body?.skill === 'string' && body.skill in SKILL_INSTRUCTIONS ? body.skill : 'general';
    const systemInstruction = `${BASE_SYSTEM_INSTRUCTION}\n\nModo activo:\n${SKILL_INSTRUCTIONS[skillKey]}`;

    try {
      const contents = messages.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const stream = await ai.models.generateContentStream({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      const parsed = extractGeminiError(err);
      if (!res.headersSent) {
        res.status(parsed.status).json({ error: parsed.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: parsed.message })}\n\n`);
        res.end();
      }
    }
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.all('/api/{*splat}', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta de API no encontrada.' });
  });

  const distPath = path.resolve(process.cwd(), 'dist');
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.npm_lifecycle_event === 'start' && fs.existsSync(distPath));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
