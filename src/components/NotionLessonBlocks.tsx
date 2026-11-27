import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookMarked,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Copy,
  Cpu,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode2,
  FileText,
  GitBranch,
  Globe,
  Heading3,
  Info,
  Layers,
  Lightbulb,
  Link2,
  ListChecks,
  MessageSquareQuote,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Terminal,
  Trash2,
  Video,
} from 'lucide-react';
import {
  DiagramKind,
  ExerciseCategory,
  ExerciseDifficulty,
  GraphNode,
  InteractiveKind,
  Lesson,
  LessonBlock,
  LessonBlockType,
} from '../types/ova';
import {
  normalizeToRichHtml,
  VisualRichTextEditor,
} from './VisualRichTextEditor';

export const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (ES6+)' },
  { value: 'typescript', label: 'TypeScript / Node.js' },
  { value: 'sql', label: 'SQL (PostgreSQL / MySQL)' },
  { value: 'python', label: 'Python' },
  { value: 'json', label: 'JSON / Objetos' },
  { value: 'yaml', label: 'YAML (OpenAPI / Docker)' },
  { value: 'bash', label: 'Bash / Terminal CLI' },
  { value: 'html', label: 'HTML / CSS' },
];

export const DIAGRAM_KINDS: Array<{ value: DiagramKind; label: string }> = [
  {
    value: 'var_let_const',
    label: 'Diagrama: Ámbito (Scope) de var vs let vs const',
  },
  {
    value: 'data_types',
    label: 'Diagrama: Tipos Primitivos (Stack) vs Referencia (Heap)',
  },
  {
    value: 'if_else_flow',
    label: 'Diagrama de Flujo: Condicionales (if / else if / else)',
  },
  {
    value: 'loops_flow',
    label: 'Diagrama de Flujo: Ciclos Repetitivos (for / while)',
  },
  {
    value: 'try_catch_flow',
    label: 'Diagrama de Flujo: Manejo de Errores (try / catch / finally)',
  },
];

export const INTERACTIVE_KINDS: Array<{
  value: InteractiveKind;
  label: string;
}> = [
  {
    value: 'array_lab',
    label: 'Gráfico Interactivo Animado: Arreglos (push, pop, shift, unshift)',
  },
  {
    value: 'array_functional',
    label: 'Simulador Animado: Métodos Funcionales (map, filter, find, reduce)',
  },
  {
    value: 'object_lab',
    label: 'Gráfico Interactivo Animado: Objetos Clave-Valor y Desestructuración',
  },
];

export function extractDomain(url?: string): string {
  if (!url) return 'developer.mozilla.org';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] || 'enlace-web';
  }
}

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function ensureLessonBlocks(lesson: Lesson): LessonBlock[] {
  if (Array.isArray(lesson.blocks)) {
    return lesson.blocks;
  }

  const generated: LessonBlock[] = [];
  const raw = lesson.contentMarkdown || '';
  const parts = raw.split(/(```[\s\S]*?```)/g);

  parts.forEach((part, partIdx) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
      const lines = trimmed.slice(3, -3).split('\n');
      const firstLine = lines[0]?.trim() || 'javascript';
      const codeBody = lines.slice(1).join('\n').trim();
      generated.push({
        id: `${lesson.id}-blk-code-${partIdx}`,
        type: 'code',
        codeLanguage: firstLine || 'javascript',
        title: `ejemplo_${partIdx + 1}.js`,
        content: codeBody || lines.join('\n'),
        relevanceComment:
          'Segmento de código fuente de referencia para practicar.',
      });
      return;
    }

    const paragraphs = trimmed.split('\n\n');
    paragraphs.forEach((p, pIdx) => {
      const clean = p.trim();
      if (!clean) return;
      if (clean.startsWith('### ')) {
        generated.push({
          id: `${lesson.id}-blk-h-${partIdx}-${pIdx}`,
          type: 'heading',
          title: clean.replace(/^###\s+/, ''),
          content: '',
        });
      } else if (clean.startsWith('#### ')) {
        generated.push({
          id: `${lesson.id}-blk-h4-${partIdx}-${pIdx}`,
          type: 'heading',
          title: clean.replace(/^####\s+/, ''),
          content: '',
        });
      } else {
        generated.push({
          id: `${lesson.id}-blk-txt-${partIdx}-${pIdx}`,
          type: 'text',
          content: clean,
        });
      }
    });
  });

  if (lesson.mediaUrl) {
    const isVideo =
      lesson.mediaUrl.includes('youtube') ||
      lesson.mediaUrl.includes('youtu.be') ||
      lesson.mediaUrl.includes('vimeo') ||
      (lesson.mediaTitle ?? '').toLowerCase().includes('video');

    generated.push({
      id: `${lesson.id}-blk-media`,
      type: isVideo ? 'video' : 'link',
      title: lesson.mediaTitle || 'Recurso Multimedia de Profundización',
      url: lesson.mediaUrl,
      domainOrSource: extractDomain(lesson.mediaUrl),
      videoTimestamp: isVideo ? '00:00 - Resumen Completo' : undefined,
      content:
        lesson.mediaTitle ||
        'Documentación y material audiovisual complementario de la lección.',
      relevanceComment:
        lesson.mediaComment ||
        `Recurso complementario para la lección "${lesson.title}".`,
    });
  }

  return generated;
}

export function ensureNodeBlocks(node: GraphNode): LessonBlock[] {
  if (Array.isArray(node.blocks)) {
    return node.blocks.map((b) => ({ ...b, sourceNodeId: node.id }));
  }

  const generated: LessonBlock[] = [];
  const raw = node.content || '';
  const parts = raw.split(/(```[\s\S]*?```)/g);

  parts.forEach((part, partIdx) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
      const lines = trimmed.slice(3, -3).split('\n');
      const firstLine = lines[0]?.trim() || node.codeLanguage || 'javascript';
      const codeBody = lines.slice(1).join('\n').trim();
      generated.push({
        id: `${node.id}-nblk-code-${partIdx}`,
        type: 'code',
        codeLanguage: firstLine,
        title: `ejemplo_${node.id}.js`,
        content: codeBody || lines.join('\n'),
        relevanceComment:
          'Segmento de código fuente definido desde el nodo en el Lienzo en Grafo.',
        sourceNodeId: node.id,
      });
      return;
    }

    if (node.type === 'code') {
      generated.push({
        id: `${node.id}-nblk-code-main`,
        type: 'code',
        codeLanguage: node.codeLanguage || 'javascript',
        title: node.title,
        content: trimmed,
        relevanceComment:
          node.mediaComment ||
          'Fragmento de código fuente creado en el Lienzo de Conocimiento.',
        sourceNodeId: node.id,
      });
      return;
    }

    generated.push({
      id: `${node.id}-nblk-txt-${partIdx}`,
      type: 'text',
      content: trimmed,
      sourceNodeId: node.id,
    });
  });

  if (node.mediaUrl) {
    const isVideo =
      node.mediaKind === 'video' ||
      node.mediaUrl.includes('youtube') ||
      node.mediaUrl.includes('youtu.be') ||
      node.mediaUrl.includes('vimeo');

    generated.push({
      id: `${node.id}-nblk-media`,
      type: isVideo ? 'video' : 'link',
      title: node.title,
      url: node.mediaUrl,
      domainOrSource: extractDomain(node.mediaUrl),
      videoTimestamp: isVideo ? 'Min 02:00 - Segmento Clave' : undefined,
      content: node.content,
      relevanceComment:
        node.mediaComment ||
        node.content ||
        `Recurso investigado en el nodo "${node.title}".`,
      sourceNodeId: node.id,
    });
  }

  return generated;
}

export function blocksToMarkdown(blocks: LessonBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'heading':
          return `### ${b.title || b.content}`;
        case 'text':
          return b.content;
        case 'callout':
          return `> **${b.title || 'Nota Pedagógica'}:** ${b.content}`;
        case 'diagram':
          return `📊 **[Ilustración / Diagrama: ${b.title || 'Flujo Visual'}]**\n${b.content}`;
        case 'interactive':
          return `⚡ **[Laboratorio Interactivo: ${b.title || 'Simulador JS'}]**\n${b.content}`;
        case 'link':
          return `🔗 **[${b.title || b.url}](${b.url || '#'} "${(
            b.relevanceComment || b.content
          ).replace(/"/g, "'")}")**\n> *Relevancia del enlace:* ${
            b.relevanceComment || b.content
          }`;
        case 'video':
          return `🎬 **[Video: ${b.title || b.url}](${b.url || '#'} "${(
            b.relevanceComment || b.content
          ).replace(/"/g, "'")}")** ${
            b.videoTimestamp ? `*(${b.videoTimestamp})*` : ''
          }\n> *Relevancia del video:* ${b.relevanceComment || b.content}`;
        case 'code':
          return `${b.title ? `#### Archivo: \`${b.title}\`\n` : ''}\`\`\`${
            b.codeLanguage || 'javascript'
          }\n${b.content}\n\`\`\`${
            b.relevanceComment ? `\n*Nota técnica:* ${b.relevanceComment}` : ''
          }`;
        case 'quote':
          return `> 📚 **Cita Bibliográfica — ${b.title || 'Referencia Técnica'}** (${
            b.quoteAuthor || 'Autor'
          }):\n> *"${b.content}"*${
            b.relevanceComment ? `\n> — *Reflexión pedagógica:* ${b.relevanceComment}` : ''
          }`;
        case 'exercise':
          return `#### 🧩 ${b.title || 'Ejercicio Práctico'} [${
            b.exerciseDifficulty || 'Intermedio'
          }${b.exerciseTopic ? ` · ${b.exerciseTopic}` : ''}]\n${b.content}${
            b.exerciseSolution
              ? `\n\n**Solución Resuelta Paso a Paso:**\n\`\`\`javascript\n${b.exerciseSolution}\n\`\`\``
              : ''
          }`;
        default:
          return b.content;
      }
    })
    .join('\n\n');
}

/**
 * Illustrated SVG Diagram Component for Visual Explanations (Control Structures, Variables, Data Types)
 */
export const DiagramBlockView: React.FC<{
  block: LessonBlock;
  editable?: boolean;
  onUpdateBlock?: (patch: Partial<LessonBlock>) => void;
}> = ({ block, editable = false, onUpdateBlock }) => {
  const kind: DiagramKind = block.diagramKind ?? 'if_else_flow';

  return (
    <div className="my-3 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs min-w-0 max-w-full">
      {/* Header Bar */}
      <div className="px-3.5 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GitBranch className="w-4 h-4 text-amber-400 shrink-0" />
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.title ?? ''}
              onChange={(e) => onUpdateBlock({ title: e.target.value })}
              placeholder="Título del gráfico o esquema visual..."
              className="flex-1 min-w-0 bg-slate-800/90 text-white text-xs font-bold px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          ) : (
            <span className="text-xs font-bold break-words">
              {block.title || 'Esquema Visual Explicativo'}
            </span>
          )}
        </div>

        {editable && onUpdateBlock ? (
          <select
            value={kind}
            onChange={(e) =>
              onUpdateBlock({ diagramKind: e.target.value as DiagramKind })
            }
            className="max-w-full px-2 py-1 text-[11px] bg-slate-800 text-amber-300 border border-slate-700 rounded font-mono truncate"
          >
            {DIAGRAM_KINDS.map((dk) => (
              <option key={dk.value} value={dk.value}>
                {dk.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
            Esquema Ilustrado JS
          </span>
        )}
      </div>

      {/* SVG Diagram Canvas (Responsive 100% width, zero horizontal scroll) */}
      <div className="p-3 sm:p-6 bg-gradient-to-b from-slate-50 to-white flex justify-center overflow-hidden">
        {kind === 'if_else_flow' && (
          <svg
            viewBox="0 0 700 250"
            className="w-full max-w-2xl h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Start node */}
            <rect
              x="20"
              y="95"
              width="110"
              height="48"
              rx="24"
              fill="#0f172a"
            />
            <text
              x="75"
              y="123"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              Inicio / Dato
            </text>
            <path
              d="M 130 119 L 185 119"
              stroke="#475569"
              strokeWidth="2.2"
              markerEnd="url(#d-arrow)"
            />

            {/* Condition Diamond 1 */}
            <polygon
              points="265,65 345,119 265,173 185,119"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="2.2"
            />
            <text
              x="265"
              y="115"
              textAnchor="middle"
              fill="#92400e"
              fontSize="11"
              fontWeight="bold"
            >
              if (condición)
            </text>
            <text
              x="265"
              y="131"
              textAnchor="middle"
              fill="#b45309"
              fontSize="10"
              fontFamily="monospace"
            >
              ¿Es true?
            </text>

            {/* TRUE Branch (Top) */}
            <path
              d="M 265 65 L 265 35 L 430 35"
              fill="none"
              stroke="#059669"
              strokeWidth="2.4"
            />
            <text
              x="335"
              y="27"
              fill="#059669"
              fontSize="11"
              fontWeight="bold"
            >
              true (Verdadero)
            </text>
            <rect
              x="430"
              y="12"
              width="195"
              height="48"
              rx="10"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x="527"
              y="33"
              textAnchor="middle"
              fill="#065f46"
              fontSize="11"
              fontWeight="bold"
            >
              Ejecuta Bloque IF {`{ ... }`}
            </text>
            <text
              x="527"
              y="49"
              textAnchor="middle"
              fill="#047857"
              fontSize="10"
              fontFamily="monospace"
            >
              Omite el bloque else
            </text>

            {/* FALSE Branch (Bottom) */}
            <path
              d="M 265 173 L 265 205 L 430 205"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.4"
            />
            <text
              x="335"
              y="197"
              fill="#e11d48"
              fontSize="11"
              fontWeight="bold"
            >
              false (Falso)
            </text>
            <rect
              x="430"
              y="180"
              width="195"
              height="48"
              rx="10"
              fill="#fff1f2"
              stroke="#f43f5e"
              strokeWidth="2"
            />
            <text
              x="527"
              y="201"
              textAnchor="middle"
              fill="#9f1239"
              fontSize="11"
              fontWeight="bold"
            >
              Ejecuta ELSE / ELSE IF
            </text>
            <text
              x="527"
              y="217"
              textAnchor="middle"
              fill="#be123c"
              fontSize="10"
              fontFamily="monospace"
            >
              Ruta alternativa
            </text>

            {/* Convergence */}
            <path
              d="M 625 36 L 665 36 L 665 119 L 625 204 L 665 204 L 665 119"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
            <circle cx="665" cy="119" r="8" fill="#4f46e5" />
          </svg>
        )}

        {kind === 'loops_flow' && (
          <svg
            viewBox="0 0 720 250"
            className="w-full max-w-2xl h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Step 1: Init */}
            <rect
              x="16"
              y="92"
              width="135"
              height="54"
              rx="10"
              fill="#eef2ff"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <text
              x="83"
              y="115"
              textAnchor="middle"
              fill="#312e81"
              fontSize="11"
              fontWeight="bold"
            >
              1. Inicialización
            </text>
            <text
              x="83"
              y="133"
              textAnchor="middle"
              fill="#4338ca"
              fontSize="11"
              fontFamily="monospace"
            >
              let i = 0;
            </text>

            <path d="M 151 119 L 195 119" stroke="#475569" strokeWidth="2.2" />

            {/* Step 2: Condition */}
            <polygon
              points="275,64 355,119 275,174 195,119"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="2.2"
            />
            <text
              x="275"
              y="115"
              textAnchor="middle"
              fill="#92400e"
              fontSize="11"
              fontWeight="bold"
            >
              2. Condición
            </text>
            <text
              x="275"
              y="131"
              textAnchor="middle"
              fill="#b45309"
              fontSize="11"
              fontFamily="monospace"
            >
              i &lt; límite
            </text>

            {/* True -> Execute Body */}
            <path d="M 355 119 L 420 119" stroke="#059669" strokeWidth="2.4" />
            <text
              x="387"
              y="110"
              textAnchor="middle"
              fill="#059669"
              fontSize="11"
              fontWeight="bold"
            >
              true
            </text>

            <rect
              x="420"
              y="90"
              width="165"
              height="58"
              rx="10"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x="502"
              y="115"
              textAnchor="middle"
              fill="#065f46"
              fontSize="11"
              fontWeight="bold"
            >
              3. Cuerpo del Ciclo
            </text>
            <text
              x="502"
              y="133"
              textAnchor="middle"
              fill="#047857"
              fontSize="10"
              fontFamily="monospace"
            >
              Ejecuta iteración actual
            </text>

            {/* Step 4: Increment & Loop back */}
            <path
              d="M 502 90 L 502 32 L 275 32 L 275 64"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.2"
              strokeDasharray="5 3"
            />
            <rect
              x="325"
              y="12"
              width="145"
              height="36"
              rx="8"
              fill="#312e81"
            />
            <text
              x="397"
              y="34"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              4. Paso: i++
            </text>

            {/* False -> Exit Loop */}
            <path
              d="M 275 174 L 275 218 L 590 218"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.2"
            />
            <text
              x="345"
              y="210"
              fill="#e11d48"
              fontSize="11"
              fontWeight="bold"
            >
              false (o instrucción break)
            </text>
            <rect
              x="590"
              y="196"
              width="115"
              height="42"
              rx="21"
              fill="#0f172a"
            />
            <text
              x="647"
              y="221"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
            >
              Fin del Ciclo
            </text>
          </svg>
        )}

        {kind === 'var_let_const' && (
          <svg
            viewBox="0 0 700 220"
            className="w-full max-w-2xl h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Card 1: var */}
            <rect
              x="15"
              y="15"
              width="205"
              height="190"
              rx="12"
              fill="#fff1f2"
              stroke="#fda4af"
              strokeWidth="2"
            />
            <text
              x="117"
              y="45"
              textAnchor="middle"
              fill="#9f1239"
              fontSize="16"
              fontFamily="monospace"
              fontWeight="bold"
            >
              var (Legado ES5)
            </text>
            <text x="32" y="80" fill="#881337" fontSize="11">
              • Ámbito de función (ignora {`{ }`})
            </text>
            <text x="32" y="105" fill="#881337" fontSize="11">
              • Permite re-declarar sin error
            </text>
            <text x="32" y="130" fill="#881337" fontSize="11">
              • Hoisting con valor undefined
            </text>
            <rect
              x="32"
              y="155"
              width="170"
              height="30"
              rx="6"
              fill="#ffe4e6"
            />
            <text
              x="117"
              y="174"
              textAnchor="middle"
              fill="#be123c"
              fontSize="11"
              fontWeight="bold"
            >
              ⚠️ Evitar en código moderno
            </text>

            {/* Card 2: let */}
            <rect
              x="247"
              y="15"
              width="205"
              height="190"
              rx="12"
              fill="#eef2ff"
              stroke="#818cf8"
              strokeWidth="2"
            />
            <text
              x="349"
              y="45"
              textAnchor="middle"
              fill="#312e81"
              fontSize="16"
              fontFamily="monospace"
              fontWeight="bold"
            >
              let (Mutable ES6)
            </text>
            <text x="264" y="80" fill="#1e1b4b" fontSize="11">
              • Ámbito estricto de bloque {`{ }`}
            </text>
            <text x="264" y="105" fill="#1e1b4b" fontSize="11">
              • Permite reasignar su valor
            </text>
            <text x="264" y="130" fill="#1e1b4b" fontSize="11">
              • Protegida por Zona Muerta (TDZ)
            </text>
            <rect
              x="264"
              y="155"
              width="170"
              height="30"
              rx="6"
              fill="#e0e7ff"
            />
            <text
              x="349"
              y="174"
              textAnchor="middle"
              fill="#4338ca"
              fontSize="11"
              fontWeight="bold"
            >
              ✓ Usar en contadores / estado
            </text>

            {/* Card 3: const */}
            <rect
              x="480"
              y="15"
              width="205"
              height="190"
              rx="12"
              fill="#ecfdf5"
              stroke="#34d399"
              strokeWidth="2"
            />
            <text
              x="582"
              y="45"
              textAnchor="middle"
              fill="#064e3b"
              fontSize="16"
              fontFamily="monospace"
              fontWeight="bold"
            >
              const (Constante)
            </text>
            <text x="497" y="80" fill="#065f46" fontSize="11">
              • Ámbito estricto de bloque {`{ }`}
            </text>
            <text x="497" y="105" fill="#065f46" fontSize="11">
              • Impide reasignar la referencia
            </text>
            <text x="497" y="130" fill="#065f46" fontSize="11">
              • Objetos/Arrays sí pueden mutar
            </text>
            <rect
              x="497"
              y="155"
              width="170"
              height="30"
              rx="6"
              fill="#d1fae5"
            />
            <text
              x="582"
              y="174"
              textAnchor="middle"
              fill="#047857"
              fontSize="11"
              fontWeight="bold"
            >
              ★ Opción por defecto en JS
            </text>
          </svg>
        )}

        {kind === 'data_types' && (
          <svg
            viewBox="0 0 700 220"
            className="w-full max-w-2xl h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stack Primitives */}
            <rect
              x="20"
              y="15"
              width="315"
              height="190"
              rx="12"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <text
              x="177"
              y="42"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="bold"
            >
              7 Tipos Primitivos (Inmutables · Por Valor)
            </text>
            <text
              x="40"
              y="72"
              fill="#334155"
              fontSize="11"
              fontFamily="monospace"
            >
              • string → &quot;Hola SENA&quot;
            </text>
            <text
              x="40"
              y="94"
              fill="#334155"
              fontSize="11"
              fontFamily="monospace"
            >
              • number → 42, 3.1416, NaN
            </text>
            <text
              x="40"
              y="116"
              fill="#334155"
              fontSize="11"
              fontFamily="monospace"
            >
              • boolean → true / false
            </text>
            <text
              x="40"
              y="138"
              fill="#334155"
              fontSize="11"
              fontFamily="monospace"
            >
              • undefined → variable sin valor asignado
            </text>
            <text
              x="40"
              y="160"
              fill="#334155"
              fontSize="11"
              fontFamily="monospace"
            >
              • null → ausencia intencional de objeto
            </text>
            <text
              x="40"
              y="182"
              fill="#334155"
              fontSize="11"
              fontFamily="monospace"
            >
              • bigint / symbol → 9007199254740991n / Symbol()
            </text>

            {/* Heap Reference Types */}
            <rect
              x="365"
              y="15"
              width="315"
              height="190"
              rx="12"
              fill="#eef2ff"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <text
              x="522"
              y="42"
              textAnchor="middle"
              fill="#312e81"
              fontSize="14"
              fontWeight="bold"
            >
              Tipos de Referencia (Heap · Puntero Memoria)
            </text>
            <text
              x="385"
              y="76"
              fill="#1e1b4b"
              fontSize="11"
              fontFamily="monospace"
            >
              • Object → {`{ nombre: "Ana", ficha: 2874512 }`}
            </text>
            <text
              x="385"
              y="104"
              fill="#1e1b4b"
              fontSize="11"
              fontFamily="monospace"
            >
              • Array → [&quot;JS&quot;, &quot;SQL&quot;, &quot;Node&quot;]
            </text>
            <text
              x="385"
              y="132"
              fill="#1e1b4b"
              fontSize="11"
              fontFamily="monospace"
            >
              • Function → (a, b) =&gt; a + b
            </text>
            <rect
              x="385"
              y="154"
              width="275"
              height="34"
              rx="8"
              fill="#e0e7ff"
            />
            <text
              x="522"
              y="175"
              textAnchor="middle"
              fill="#4338ca"
              fontSize="11"
              fontWeight="bold"
            >
              Al copiar la variable se copia la dirección
            </text>
          </svg>
        )}

        {kind === 'try_catch_flow' && (
          <svg
            viewBox="0 0 700 200"
            className="w-full max-w-2xl h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="65"
              width="175"
              height="68"
              rx="10"
              fill="#eef2ff"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <text
              x="107"
              y="93"
              textAnchor="middle"
              fill="#312e81"
              fontSize="12"
              fontWeight="bold"
            >
              1. Bloque try {`{ ... }`}
            </text>
            <text
              x="107"
              y="113"
              textAnchor="middle"
              fill="#4338ca"
              fontSize="10"
              fontFamily="monospace"
            >
              Código supervisado
            </text>

            <path
              d="M 195 82 L 265 45"
              stroke="#e11d48"
              strokeWidth="2.2"
            />
            <path
              d="M 195 115 L 265 145"
              stroke="#059669"
              strokeWidth="2.2"
            />

            <rect
              x="265"
              y="15"
              width="195"
              height="58"
              rx="10"
              fill="#fff1f2"
              stroke="#f43f5e"
              strokeWidth="2"
            />
            <text
              x="362"
              y="40"
              textAnchor="middle"
              fill="#9f1239"
              fontSize="12"
              fontWeight="bold"
            >
              2A. catch (error) {`{ ... }`}
            </text>
            <text
              x="362"
              y="58"
              textAnchor="middle"
              fill="#be123c"
              fontSize="10"
              fontFamily="monospace"
            >
              Si ocurre throw / excepción
            </text>

            <rect
              x="265"
              y="122"
              width="195"
              height="58"
              rx="10"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x="362"
              y="147"
              textAnchor="middle"
              fill="#065f46"
              fontSize="12"
              fontWeight="bold"
            >
              2B. Ejecución sin errores
            </text>
            <text
              x="362"
              y="165"
              textAnchor="middle"
              fill="#047857"
              fontSize="10"
              fontFamily="monospace"
            >
              Ignora el bloque catch
            </text>

            <path d="M 460 44 L 520 85" stroke="#475569" strokeWidth="2.2" />
            <path d="M 460 151 L 520 112" stroke="#475569" strokeWidth="2.2" />

            <rect
              x="520"
              y="65"
              width="160"
              height="68"
              rx="10"
              fill="#0f172a"
            />
            <text
              x="600"
              y="93"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              3. finally {`{ ... }`}
            </text>
            <text
              x="600"
              y="113"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="10"
              fontFamily="monospace"
            >
              Se ejecuta SIEMPRE
            </text>
          </svg>
        )}
      </div>

      {/* Caption / Pedagogical Explanation */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-700">
        {editable && onUpdateBlock ? (
          <input
            type="text"
            value={block.content}
            onChange={(e) => onUpdateBlock({ content: e.target.value })}
            placeholder="Escribe aquí la explicación o pie de imagen del diagrama..."
            className="w-full bg-white px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
          />
        ) : (
          <div>
            <strong className="text-slate-900">Lectura del diagrama:</strong>{' '}
            {block.content}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Interactive Animated Graphics with Microinteractions for OVA 3 (JavaScript Arrays & Objects)
 */
export const InteractiveGraphicBlockView: React.FC<{
  block: LessonBlock;
  editable?: boolean;
  onUpdateBlock?: (patch: Partial<LessonBlock>) => void;
}> = ({ block, editable = false, onUpdateBlock }) => {
  const kind: InteractiveKind = block.interactiveKind ?? 'array_lab';

  // State for Array Lab ('array_lab')
  const [arrItems, setArrItems] = useState<string[]>([
    'JavaScript',
    'HTML5',
    'CSS3',
  ]);
  const [customArrInput, setCustomArrInput] = useState<string>('Node.js');
  const [lastArrOp, setLastArrOp] = useState<string>(
    "let lenguajes = ['JavaScript', 'HTML5', 'CSS3']; // length: 3"
  );

  // State for Functional Array Simulator ('array_functional')
  const baseScores = [85, 55, 92, 65, 100];
  const [fnMode, setFnMode] = useState<'map' | 'filter' | 'find' | 'reduce'>(
    'map'
  );

  // State for Object Lab ('object_lab')
  const [objProps, setObjProps] = useState<
    Array<{ key: string; value: string; highlight?: boolean }>
  >([
    { key: 'nombre', value: '"Valentina Rojas"' },
    { key: 'ficha', value: '2874512' },
    { key: 'programa', value: '"ADSO"' },
    { key: 'activo', value: 'true' },
  ]);
  const [newKey, setNewKey] = useState<string>('trimestre');
  const [newVal, setNewVal] = useState<string>('4');
  const [objConsole, setObjConsole] = useState<string>(
    'const aprendiz = { nombre: "Valentina Rojas", ficha: 2874512, programa: "ADSO", activo: true };'
  );

  const triggerHighlightKey = (targetKey: string, expr: string) => {
    setObjProps((prev) =>
      prev.map((p) => ({ ...p, highlight: p.key === targetKey }))
    );
    setObjConsole(expr);
  };

  return (
    <div className="my-3 rounded-2xl border border-indigo-200 bg-white overflow-hidden shadow-xs min-w-0 max-w-full">
      {/* Top Interactive Bar */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.title ?? ''}
              onChange={(e) => onUpdateBlock({ title: e.target.value })}
              placeholder="Título del laboratorio interactivo..."
              className="flex-1 min-w-0 bg-slate-800/90 text-white text-xs font-bold px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
            />
          ) : (
            <span className="text-xs font-bold break-words">
              {block.title || 'Laboratorio Visual Interactivo de JavaScript'}
            </span>
          )}
        </div>

        {editable && onUpdateBlock ? (
          <select
            value={kind}
            onChange={(e) =>
              onUpdateBlock({
                interactiveKind: e.target.value as InteractiveKind,
              })
            }
            className="max-w-full px-2 py-1 text-[11px] bg-slate-800 text-emerald-300 border border-slate-700 rounded font-mono truncate"
          >
            {INTERACTIVE_KINDS.map((ik) => (
              <option key={ik.value} value={ik.value}>
                {ik.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            Interactivo JS
          </span>
        )}
      </div>

      {/* Interactive Playground Body */}
      <div className="p-3.5 sm:p-5 space-y-4 bg-slate-50/70 min-w-0 max-w-full overflow-hidden">
        {kind === 'array_lab' && (
          <div className="space-y-3.5 min-w-0 max-w-full">
            {/* Animated Array Memory Cells */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 min-w-0 max-w-full">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono">
                <span className="text-slate-600 font-semibold break-words">
                  Memoria del Arreglo (base 0):
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold shrink-0">
                  length = {arrItems.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 min-h-[72px] py-1">
                <AnimatePresence mode="popLayout">
                  {arrItems.map((item, idx) => (
                    <motion.div
                      key={`${item}-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7, y: -12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 12 }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 26,
                      }}
                      className="group relative px-2.5 py-2 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-sm flex flex-col items-center min-w-0 sm:min-w-[88px]"
                    >
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        índice [{idx}]
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-300 mt-0.5 truncate max-w-full">
                        &apos;{item}&apos;
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {arrItems.length === 0 && (
                  <div className="col-span-2 text-xs font-mono text-slate-400 italic">
                    [ ] Arreglo vacío (length: 0)
                  </div>
                )}
              </div>
            </div>

            {/* Micro-interactive Controls (Responsive Grid on Mobile, zero horizontal overflow) */}
            <div className="space-y-2 min-w-0 max-w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customArrInput}
                  onChange={(e) => setCustomArrInput(e.target.value)}
                  placeholder="Nuevo elemento..."
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setArrItems(['JavaScript', 'HTML5', 'CSS3']);
                    setLastArrOp(
                      "let lenguajes = ['JavaScript', 'HTML5', 'CSS3']; // Reiniciado"
                    );
                  }}
                  className="px-2.5 py-1.5 text-xs font-mono text-slate-600 bg-white border border-slate-300 hover:text-slate-900 rounded-lg shrink-0 inline-flex items-center gap-1"
                  title="Reiniciar arreglo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => {
                    const val = customArrInput.trim() || 'Item';
                    const next = [...arrItems, val];
                    setArrItems(next);
                    setLastArrOp(
                      `lenguajes.push('${val}'); // Añade al final -> length: ${next.length}`
                    );
                  }}
                  className="px-2.5 py-2 text-xs font-mono font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg truncate"
                >
                  .push()
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => {
                    if (arrItems.length === 0) return;
                    const removed = arrItems[arrItems.length - 1];
                    setArrItems(arrItems.slice(0, -1));
                    setLastArrOp(
                      `lenguajes.pop(); // Eliminó '${removed}' del final`
                    );
                  }}
                  className="px-2.5 py-2 text-xs font-mono font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg truncate"
                >
                  .pop()
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => {
                    const val = customArrInput.trim() || 'Inicio';
                    const next = [val, ...arrItems];
                    setArrItems(next);
                    setLastArrOp(
                      `lenguajes.unshift('${val}'); // Insertó en [0]`
                    );
                  }}
                  className="px-2.5 py-2 text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg truncate"
                >
                  .unshift()
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => {
                    if (arrItems.length === 0) return;
                    const removed = arrItems[0];
                    setArrItems(arrItems.slice(1));
                    setLastArrOp(
                      `lenguajes.shift(); // Extrajo '${removed}' de [0]`
                    );
                  }}
                  className="px-2.5 py-2 text-xs font-mono font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg truncate"
                >
                  .shift()
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => {
                    setArrItems([...arrItems].reverse());
                    setLastArrOp(
                      `lenguajes.reverse(); // Invirtió el orden de índices`
                    );
                  }}
                  className="col-span-2 sm:col-span-1 px-2.5 py-2 text-xs font-mono font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg truncate"
                >
                  .reverse()
                </motion.button>
              </div>
            </div>

            {/* Live JS Console Output (Wrapped cleanly, zero overflow) */}
            <div className="px-3 py-2 bg-slate-950 text-emerald-300 rounded-lg font-mono text-[11px] flex items-start gap-2 min-w-0 max-w-full">
              <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] min-w-0">
                {lastArrOp}
              </span>
            </div>
          </div>
        )}

        {kind === 'array_functional' && (
          <div className="space-y-3.5 min-w-0 max-w-full">
            {/* Method Switcher (2x2 Grid on Mobile) */}
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  {
                    id: 'map',
                    label: '.map(n => n + 5)',
                  },
                  {
                    id: 'filter',
                    label: '.filter(n => n >= 70)',
                  },
                  {
                    id: 'find',
                    label: '.find(n => n > 90)',
                  },
                  {
                    id: 'reduce',
                    label: '.reduce((a, n) => a + n)',
                  },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFnMode(m.id)}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-mono font-semibold transition-all text-center break-words ${
                    fnMode === m.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Visual Transformation Pipeline */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3.5 min-w-0 max-w-full">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-500 break-words">
                  Original (Inmutable):{' '}
                  <code className="break-all">notas = [85, 55, 92, 65, 100]</code>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {baseScores.map((score, i) => {
                    const passes =
                      fnMode === 'map' ||
                      fnMode === 'reduce' ||
                      (fnMode === 'filter' && score >= 70) ||
                      (fnMode === 'find' && score === 92);
                    return (
                      <motion.div
                        key={i}
                        animate={{
                          scale: passes ? 1.02 : 0.94,
                          opacity: passes ? 1 : 0.38,
                        }}
                        className={`px-2.5 py-1.5 rounded-lg font-mono text-xs border ${
                          passes
                            ? 'bg-slate-900 text-white border-slate-800'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        [{i}]: <strong>{score}</strong>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 space-y-2 min-w-0">
                <div className="text-[11px] font-mono font-semibold text-indigo-700">
                  Resultado retornado por <code>.{fnMode}()</code>:
                </div>

                {fnMode === 'map' && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {baseScores.map((s, i) => (
                      <motion.div
                        key={`map-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold"
                      >
                        [{i}]: {Math.min(100, s + 5)}
                      </motion.div>
                    ))}
                  </div>
                )}

                {fnMode === 'filter' && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {baseScores
                      .filter((s) => s >= 70)
                      .map((s, i) => (
                        <motion.div
                          key={`fil-${i}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold"
                        >
                          [{i}]: {s} ✓
                        </motion.div>
                      ))}
                  </div>
                )}

                {fnMode === 'find' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-bold break-words"
                  >
                    Valor único retornado: 92 (Primer elemento &gt; 90)
                  </motion.div>
                )}

                {fnMode === 'reduce' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full px-3 py-2 rounded-lg bg-indigo-700 text-white font-mono text-xs font-bold break-words"
                  >
                    Acumulador Total = 397 (Promedio: 79.4)
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {kind === 'object_lab' && (
          <div className="space-y-3.5 min-w-0 max-w-full">
            {/* Animated Key-Value Object Inspector */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 min-w-0 max-w-full">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                <span className="font-bold text-slate-800">
                  const aprendiz = {`{`}
                </span>
                <span className="text-[11px] text-slate-500">
                  {objProps.length} propiedades
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <AnimatePresence mode="popLayout">
                  {objProps.map((prop) => (
                    <motion.div
                      key={prop.key}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{
                        opacity: 1,
                        scale: prop.highlight ? 1.02 : 1,
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() =>
                        triggerHighlightKey(
                          prop.key,
                          `aprendiz.${prop.key} // Retorna -> ${prop.value}`
                        )
                      }
                      className={`p-2.5 rounded-xl border font-mono text-xs cursor-pointer transition-colors flex items-center justify-between gap-2 min-w-0 ${
                        prop.highlight
                          ? 'bg-indigo-950 text-white border-indigo-500 ring-2 ring-indigo-400'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <div className="min-w-0 break-all">
                        <span
                          className={
                            prop.highlight
                              ? 'text-amber-300 font-bold'
                              : 'text-indigo-700 font-bold'
                          }
                        >
                          {prop.key}
                        </span>
                        <span>: </span>
                        <span
                          className={
                            prop.highlight
                              ? 'text-emerald-300'
                              : 'text-emerald-700'
                          }
                        >
                          {prop.value}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setObjProps((prev) =>
                            prev.filter((p) => p.key !== prop.key)
                          );
                          setObjConsole(
                            `delete aprendiz.${prop.key}; // Propiedad eliminada`
                          );
                        }}
                        className="text-slate-400 hover:text-rose-500 text-[10px] px-1 shrink-0"
                        title="delete aprendiz.propiedad"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-xs font-mono font-bold text-slate-800">
                {`};`}
              </div>
            </div>

            {/* Interactive Object Operations (Responsive 2-column grid on mobile) */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  triggerHighlightKey(
                    'nombre',
                    'aprendiz.nombre; // Notación punto -> "Valentina Rojas"'
                  )
                }
                className="px-2.5 py-2 text-[11px] font-mono font-semibold bg-white border border-slate-300 hover:border-indigo-500 rounded-lg text-slate-800 truncate"
              >
                aprendiz.nombre
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerHighlightKey(
                    'ficha',
                    'aprendiz["ficha"]; // Corchetes -> 2874512'
                  )
                }
                className="px-2.5 py-2 text-[11px] font-mono font-semibold bg-white border border-slate-300 hover:border-indigo-500 rounded-lg text-slate-800 truncate"
              >
                aprendiz[&quot;ficha&quot;]
              </button>
              <button
                type="button"
                onClick={() =>
                  setObjConsole(
                    `const { nombre, ficha } = aprendiz; // Desestructuración`
                  )
                }
                className="px-2.5 py-2 text-[11px] font-mono font-semibold bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg truncate"
              >
                {`{ nombre, ficha }`}
              </button>
              <button
                type="button"
                onClick={() =>
                  setObjConsole(
                    `Object.keys(aprendiz) -> [${objProps
                      .map((p) => `"${p.key}"`)
                      .join(', ')}]`
                  )
                }
                className="px-2.5 py-2 text-[11px] font-mono font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg truncate"
              >
                Object.keys()
              </button>
            </div>

            {/* Add / Mutate Key-Value Pair */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="clave..."
                className="w-full sm:w-28 min-w-0 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                placeholder="valor..."
                className="w-full sm:w-28 min-w-0 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const k = newKey.trim();
                  if (!k) return;
                  const v = newVal.trim() || 'true';
                  setObjProps((prev) => {
                    const exists = prev.some((p) => p.key === k);
                    if (exists) {
                      return prev.map((p) =>
                        p.key === k
                          ? { key: k, value: v, highlight: true }
                          : { ...p, highlight: false }
                      );
                    }
                    return [
                      ...prev.map((p) => ({ ...p, highlight: false })),
                      { key: k, value: v, highlight: true },
                    ];
                  });
                  setObjConsole(`aprendiz.${k} = ${v}; // Propiedad asignada`);
                }}
                className="col-span-2 sm:col-span-1 px-3 py-2 text-xs font-mono font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg"
              >
                + Asignar Propiedad
              </button>
            </div>

            <div className="px-3 py-2 bg-slate-950 text-emerald-300 rounded-lg font-mono text-[11px] flex items-start gap-2 min-w-0 max-w-full">
              <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] min-w-0">
                {objConsole}
              </span>
            </div>
          </div>
        )}

        {/* Editable Description / Guide Caption */}
        <div className="text-xs text-slate-600 pt-1">
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdateBlock({ content: e.target.value })}
              placeholder="Instrucción para que el aprendiz interactúe con el gráfico..."
              className="w-full bg-white px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800"
            />
          ) : (
            <div>
              <strong className="text-slate-900">Experimenta:</strong>{' '}
              {block.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Floating Hover Preview Component for both Links and Videos (Notion-style Link/Video Popover).
 */
export const HoverPreviewTrigger: React.FC<{
  kind: 'link' | 'video';
  title: string;
  url: string;
  relevanceComment: string;
  domainOrSource?: string;
  videoTimestamp?: string;
  description?: string;
  inline?: boolean;
  onToggleEmbed?: () => void;
  isEmbedOpen?: boolean;
}> = ({
  kind,
  title,
  url,
  relevanceComment,
  domainOrSource,
  videoTimestamp,
  description,
  inline = false,
  onToggleEmbed,
  isEmbedOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const domain = domainOrSource || extractDomain(url);
  const ytId = kind === 'video' ? extractYouTubeId(url) : null;

  return (
    <span
      className={`relative inline-block ${inline ? 'align-baseline' : 'w-full'}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {inline ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (
              typeof window !== 'undefined' &&
              window.matchMedia('(hover: none)').matches &&
              !isOpen
            ) {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border transition-all ${
            kind === 'video'
              ? 'bg-rose-50/90 text-rose-800 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
              : 'bg-indigo-50/90 text-indigo-800 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
          }`}
        >
          {kind === 'video' ? (
            <Video className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          ) : (
            <Link2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          )}
          <span className="underline decoration-dotted underline-offset-2">
            {title}
          </span>
          <span
            className={`text-[10px] font-mono px-1 rounded ${
              kind === 'video'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            Hover info
          </span>
        </a>
      ) : (
        <div
          className={`group p-3.5 rounded-xl border transition-all cursor-pointer min-w-0 max-w-full overflow-hidden ${
            kind === 'video'
              ? 'bg-gradient-to-r from-rose-50/60 via-white to-slate-50 border-rose-200/90 hover:border-rose-400 hover:shadow-md'
              : 'bg-gradient-to-r from-indigo-50/60 via-white to-slate-50 border-indigo-200/90 hover:border-indigo-400 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                  kind === 'video'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                    : 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                }`}
              >
                {kind === 'video' ? (
                  <Play className="w-4 h-4 fill-current" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span
                    className={`font-bold uppercase tracking-wider ${
                      kind === 'video' ? 'text-rose-700' : 'text-indigo-700'
                    }`}
                  >
                    {kind === 'video'
                      ? 'Video Educativo'
                      : 'Enlace Web'}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="font-mono text-slate-500 truncate max-w-full">
                    {domain}
                  </span>
                  {videoTimestamp && (
                    <span className="inline-flex items-center gap-1 font-mono text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded text-[10px]">
                      <Clock className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{videoTimestamp}</span>
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1.5 min-w-0">
                  <span className="break-words min-w-0">{title || 'Sin título'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>

                <div className="text-xs text-slate-500 flex items-start gap-1.5 pt-0.5 min-w-0">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 italic break-words min-w-0">
                    {relevanceComment ||
                      'Toca o pasa el cursor aquí para previsualizar el comentario de relevancia...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {kind === 'video' && onToggleEmbed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleEmbed();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isEmbedOpen ? 'Ocultar Reproductor' : 'Reproducir Aquí'}
                </button>
              )}

              <a
                href={url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${
                  kind === 'video'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {kind === 'video' ? 'Abrir Video' : 'Visitar Enlace'}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notion-Style Hover Preview Card */}
      {isOpen && (
        <div
          className="fixed inset-x-4 bottom-4 sm:absolute sm:inset-x-auto sm:left-0 sm:bottom-full sm:mb-2 sm:w-96 z-50 pointer-events-auto animate-in fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            {kind === 'video' ? (
              <div className="relative bg-slate-950 border-b border-slate-800 p-3">
                {ytId ? (
                  <div className="relative rounded-lg overflow-hidden h-36 bg-slate-900 border border-slate-800">
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-between p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Video className="w-3 h-3" /> Vista Previa de Video
                        </span>
                        {videoTimestamp && (
                          <span className="px-2 py-0.5 rounded bg-slate-900/90 text-rose-300 font-mono text-[10px] border border-rose-500/30">
                            ⏱ {videoTimestamp}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-md">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {title}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 border border-rose-500/30 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <Video className="w-3 h-3" /> Previsualización de Video
                      </span>
                      {videoTimestamp && (
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-rose-300 font-mono text-[10px] border border-rose-500/30">
                          ⏱ {videoTimestamp}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-10 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">
                          {domain}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-mono text-indigo-300 truncate">
                    {domain}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30 shrink-0">
                  Previsualización de Enlace
                </span>
              </div>
            )}

            <div className="p-3.5 space-y-2.5">
              <div>
                <div className="text-xs font-bold text-white leading-snug">
                  {title}
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {url}
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border text-xs leading-relaxed space-y-1 ${
                  kind === 'video'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                    : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-100'
                }`}
              >
                <div
                  className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    kind === 'video' ? 'text-rose-300' : 'text-indigo-300'
                  }`}
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {kind === 'video'
                      ? 'Comentario sobre el contenido y relevancia del video'
                      : 'Comentario sobre el contenido y relevancia del enlace'}
                  </span>
                </div>
                <p className="text-xs text-slate-100 font-normal">
                  {relevanceComment ||
                    description ||
                    'Recurso seleccionado por el instructor para profundizar los conceptos de esta lección.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

/**
 * Source Code Segment Block (Notion / IDE style) with In-Place Editing support!
 */
export const CodeSegmentBlockView: React.FC<{
  block: LessonBlock;
  editable?: boolean;
  onUpdateBlock?: (patch: Partial<LessonBlock>) => void;
}> = ({ block, editable = false, onUpdateBlock }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = (block.content || '').split('\n');
  const langLabel =
    CODE_LANGUAGES.find((l) => l.value === block.codeLanguage)?.label ||
    (block.codeLanguage ?? 'JavaScript').toUpperCase();

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-sm my-2 min-w-0 max-w-full">
      {/* Top IDE Bar (Editable directly in place when editable=true) */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          {editable && onUpdateBlock ? (
            <>
              <input
                type="text"
                value={block.title ?? ''}
                onChange={(e) => onUpdateBlock({ title: e.target.value })}
                placeholder="archivo.js"
                className="px-2 py-0.5 text-xs font-mono font-semibold text-slate-100 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-indigo-400 w-36 max-w-full min-w-0"
              />
              <select
                value={block.codeLanguage ?? 'javascript'}
                onChange={(e) =>
                  onUpdateBlock({ codeLanguage: e.target.value })
                }
                className="px-2 py-0.5 text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded focus:outline-none max-w-full truncate"
              >
                {CODE_LANGUAGES.map((lang) => (
                  <option
                    key={lang.value}
                    value={lang.value}
                    className="bg-slate-900 text-slate-100"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              {block.title && (
                <span className="text-xs font-mono font-semibold text-slate-200 truncate flex items-center gap-1.5 min-w-0">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{block.title}</span>
                </span>
              )}
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                {langLabel}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Surface: Wraps lines cleanly so there is zero horizontal scroll on Android */}
      {editable && onUpdateBlock ? (
        <div className="p-3 bg-slate-950 min-w-0 max-w-full">
          <textarea
            rows={Math.max(4, lines.length)}
            value={block.content}
            onChange={(e) => onUpdateBlock({ content: e.target.value })}
            placeholder="// Escribe o edita el código fuente directamente aquí..."
            className="w-full font-mono text-xs leading-relaxed bg-slate-950 text-emerald-300 focus:outline-none resize-y"
          />
        </div>
      ) : (
        <div className="p-3 sm:p-4 font-mono text-xs leading-relaxed min-w-0 max-w-full overflow-hidden">
          <div className="space-y-0.5 min-w-0 max-w-full">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 hover:bg-slate-900/70 rounded px-1 min-w-0"
              >
                <span className="select-none text-right text-slate-600 w-6 shrink-0 font-mono text-[11px]">
                  {idx + 1}
                </span>
                <span className="text-slate-100 whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-mono min-w-0 flex-1">
                  {line || ' '}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructor Commentary / Code Explanation Footer (Editable in place) */}
      {(editable || block.relevanceComment) && (
        <div className="px-3.5 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.relevanceComment ?? ''}
              onChange={(e) =>
                onUpdateBlock({ relevanceComment: e.target.value })
              }
              placeholder="Añade aquí una nota o explicación técnica del código..."
              className="flex-1 min-w-0 bg-slate-800/80 text-slate-200 px-2.5 py-1 rounded border border-slate-700 text-xs focus:outline-none focus:border-emerald-400"
            />
          ) : (
            <div className="min-w-0 break-words">
              <strong className="text-emerald-300">
                Explicación del código:
              </strong>{' '}
              {block.relevanceComment}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Bibliographic Quote & Technical Book Reference Block ('quote')
 * Renders authoritative book citations (Haverbeke, Simpson, Flanagan, Crockford, Zakas, ECMA-262)
 * with in-place editing support.
 */
export const QuoteBlockView: React.FC<{
  block: LessonBlock;
  editable?: boolean;
  onUpdateBlock?: (patch: Partial<LessonBlock>) => void;
}> = ({ block, editable = false, onUpdateBlock }) => {
  return (
    <div className="my-3 rounded-2xl border-l-4 border-l-amber-600 border border-amber-200/90 bg-gradient-to-r from-amber-50/80 via-stone-50/90 to-white p-4 shadow-2xs space-y-2.5 min-w-0 max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <BookMarked className="w-4 h-4" />
          </div>
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.title ?? ''}
              onChange={(e) => onUpdateBlock({ title: e.target.value })}
              placeholder="Libro / Obra citada (ej. Eloquent JavaScript, 4.ª Ed., Cap. 2)..."
              className="flex-1 min-w-0 px-2.5 py-1 text-xs font-bold bg-white border border-amber-300 rounded-lg text-stone-900 focus:outline-none focus:border-amber-600"
            />
          ) : (
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
                Referencia Bibliográfica y Cita de Autor
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-stone-950 break-words">
                {block.title || 'Bibliografía Técnica de JavaScript'}
              </h4>
            </div>
          )}
        </div>

        {editable && onUpdateBlock ? (
          <input
            type="text"
            value={block.quoteAuthor ?? ''}
            onChange={(e) => onUpdateBlock({ quoteAuthor: e.target.value })}
            placeholder="Autor y Editorial (ej. Marijn Haverbeke · No Starch Press)"
            className="w-full sm:w-64 min-w-0 px-2.5 py-1 text-xs font-mono bg-white border border-amber-300 rounded-lg text-amber-950 focus:outline-none"
          />
        ) : (
          block.quoteAuthor && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-[11px] font-mono font-semibold text-amber-950 break-words">
              ✍ {block.quoteAuthor}
            </span>
          )
        )}
      </div>

      {/* Verbatim or Translated Book Quote */}
      {editable && onUpdateBlock ? (
        <textarea
          rows={3}
          value={block.content}
          onChange={(e) => onUpdateBlock({ content: e.target.value })}
          placeholder="Escribe aquí la cita textual o pasaje clave del libro..."
          className="w-full p-2.5 text-xs sm:text-sm italic text-stone-800 bg-white border border-amber-200 rounded-xl focus:outline-none focus:border-amber-600 resize-y"
        />
      ) : (
        <blockquote className="pl-3 border-l-2 border-amber-400/80 text-xs sm:text-sm italic text-stone-800 leading-relaxed break-words [overflow-wrap:anywhere]">
          &ldquo;{block.content}&rdquo;
        </blockquote>
      )}

      {/* Pedagogical Commentary / Connection to SENA Practice */}
      {(editable || block.relevanceComment) && (
        <div className="pt-2 border-t border-amber-200/70 text-xs text-stone-700 flex items-start gap-2 min-w-0">
          <MessageSquareQuote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.relevanceComment ?? ''}
              onChange={(e) =>
                onUpdateBlock({ relevanceComment: e.target.value })
              }
              placeholder="Aplicación práctica o reflexión pedagógica sobre esta cita..."
              className="flex-1 min-w-0 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs text-stone-800 focus:outline-none"
            />
          ) : (
            <div className="min-w-0 break-words leading-relaxed">
              <strong className="text-amber-950">
                Análisis e implicación en ingeniería de software:
              </strong>{' '}
              {block.relevanceComment}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Safe In-Browser JavaScript Snippet Execution Engine for Interactive Exercises
 */
interface JsExecutionLogEntry {
  level: 'log' | 'warn' | 'error' | 'result';
  text: string;
}

interface JsExecutionResult {
  logs: JsExecutionLogEntry[];
  error: string | null;
  durationMs: string;
}

function formatJsValueForConsole(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'number' && Number.isNaN(val)) return 'NaN';
  if (typeof val === 'bigint') return `${val.toString()}n`;
  if (typeof val === 'symbol') return val.toString();
  if (typeof val === 'function') return `[Function: ${val.name || 'anónima'}]`;
  if (typeof val === 'string') return val;
  if (val instanceof Error) return `${val.name}: ${val.message}`;
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export function executeLiveJavaScriptSnippet(code: string): JsExecutionResult {
  const logs: JsExecutionLogEntry[] = [];
  const start =
    typeof performance !== 'undefined' ? performance.now() : Date.now();

  const customConsole = {
    log: (...args: unknown[]) => {
      logs.push({
        level: 'log',
        text: args.map(formatJsValueForConsole).join(' '),
      });
    },
    info: (...args: unknown[]) => {
      logs.push({
        level: 'log',
        text: args.map(formatJsValueForConsole).join(' '),
      });
    },
    warn: (...args: unknown[]) => {
      logs.push({
        level: 'warn',
        text: args.map(formatJsValueForConsole).join(' '),
      });
    },
    error: (...args: unknown[]) => {
      logs.push({
        level: 'error',
        text: args.map(formatJsValueForConsole).join(' '),
      });
    },
    table: (data: unknown) => {
      logs.push({
        level: 'log',
        text: formatJsValueForConsole(data),
      });
    },
  };

  try {
    const runner = new Function('console', `"use strict";\n${code}`);
    const returnValue = runner(customConsole);
    if (returnValue !== undefined) {
      logs.push({
        level: 'result',
        text: `↳ Valor retornado: ${formatJsValueForConsole(returnValue)}`,
      });
    }
    const end =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    return {
      logs,
      error: null,
      durationMs: Math.max(0.1, end - start).toFixed(2),
    };
  } catch (err: unknown) {
    const end =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const errorMessage =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return {
      logs,
      error: errorMessage,
      durationMs: Math.max(0.1, end - start).toFixed(2),
    };
  }
}

/**
 * Separated Individual Exercise Block ('exercise') with Integrated Live JS Code Snippet Runner!
 * Allows the learner to read the exercise, write/modify their solution directly inside the
 * interactive code snippet editor, test its execution in real time, and compare with the reference solution.
 */
export const ExerciseBlockView: React.FC<{
  block: LessonBlock;
  exerciseNumber?: number;
  editable?: boolean;
  onUpdateBlock?: (patch: Partial<LessonBlock>) => void;
}> = ({ block, exerciseNumber, editable = false, onUpdateBlock }) => {
  const defaultStarter = useMemo(() => {
    if (block.exerciseStarterCode && block.exerciseStarterCode.trim()) {
      return block.exerciseStarterCode;
    }
    return `// Escribe tu solución para: ${block.title || 'este ejercicio'}\n\nconsole.log('Probando mi solución...');`;
  }, [block.exerciseStarterCode, block.title]);

  const [studentCode, setStudentCode] = useState<string>(defaultStarter);
  const [execResult, setExecResult] = useState<JsExecutionResult | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedSol, setCopiedSol] = useState<boolean>(false);

  const difficulty: ExerciseDifficulty =
    block.exerciseDifficulty ?? 'Intermedio';
  const category: ExerciseCategory = block.exerciseCategory ?? 'desarrollo';

  const diffBadgeStyle =
    difficulty === 'Básico'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
      : difficulty === 'Avanzado'
      ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
      : 'bg-amber-500/20 text-amber-300 border-amber-400/40';

  const isCorto = category === 'corto';

  const handleRunSnippet = (codeToRun?: string) => {
    const targetCode = codeToRun ?? studentCode;
    const res = executeLiveJavaScriptSnippet(targetCode);
    setExecResult(res);
  };

  const handleResetSnippet = () => {
    setStudentCode(defaultStarter);
    setExecResult(null);
  };

  const handleLoadSolutionIntoEditor = () => {
    if (!block.exerciseSolution) return;
    setStudentCode(block.exerciseSolution);
    handleRunSnippet(block.exerciseSolution);
  };

  const handleCopySolution = () => {
    if (!block.exerciseSolution) return;
    navigator.clipboard?.writeText(block.exerciseSolution);
    setCopiedSol(true);
    setTimeout(() => setCopiedSol(false), 2000);
  };

  const solutionLines = (block.exerciseSolution || '').split('\n');
  const studentLinesCount = (studentCode || '').split('\n').length;

  return (
    <div
      className={`my-3 rounded-2xl border-2 bg-white overflow-hidden shadow-xs min-w-0 max-w-full ${
        isCorto ? 'border-amber-200/90' : 'border-indigo-200/90'
      }`}
    >
      {/* Independent Exercise Header */}
      <div
        className={`px-3.5 py-2.5 text-white flex flex-wrap items-center justify-between gap-2 min-w-0 ${
          isCorto
            ? 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900'
            : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className={`px-2 py-0.5 rounded-md text-white font-mono text-[11px] font-bold shrink-0 ${
              isCorto ? 'bg-amber-600' : 'bg-indigo-600'
            }`}
          >
            {isCorto
              ? `⚡ Corto #${exerciseNumber ?? ''}`
              : `🛠️ Desarrollo #${exerciseNumber ?? ''}`}
          </span>
          {editable && onUpdateBlock ? (
            <input
              type="text"
              value={block.title ?? ''}
              onChange={(e) => onUpdateBlock({ title: e.target.value })}
              placeholder="Título del ejercicio independiente..."
              className="flex-1 min-w-0 px-2.5 py-1 text-xs font-bold bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-indigo-400"
            />
          ) : (
            <h4 className="text-xs sm:text-sm font-bold text-white break-words min-w-0">
              {block.title || 'Ejercicio Práctico Independiente'}
            </h4>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {editable && onUpdateBlock ? (
            <>
              <select
                value={category}
                onChange={(e) =>
                  onUpdateBlock({
                    exerciseCategory: e.target.value as ExerciseCategory,
                  })
                }
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 text-emerald-300 border border-slate-700 rounded"
              >
                <option value="corto">Categoría: Propuesto Corto</option>
                <option value="desarrollo">Categoría: Para Desarrollar</option>
              </select>
              <input
                type="text"
                value={block.exerciseTopic ?? ''}
                onChange={(e) =>
                  onUpdateBlock({ exerciseTopic: e.target.value })
                }
                placeholder="Tema evaluado..."
                className="w-32 min-w-0 px-2 py-0.5 text-[11px] font-mono bg-slate-800 text-indigo-200 border border-slate-700 rounded"
              />
              <select
                value={difficulty}
                onChange={(e) =>
                  onUpdateBlock({
                    exerciseDifficulty: e.target.value as ExerciseDifficulty,
                  })
                }
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 text-amber-300 border border-slate-700 rounded"
              >
                <option value="Básico">Nivel: Básico</option>
                <option value="Intermedio">Nivel: Intermedio</option>
                <option value="Avanzado">Nivel: Avanzado</option>
              </select>
            </>
          ) : (
            <>
              {block.exerciseTopic && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-200 border border-slate-700 text-[10px] font-mono">
                  {block.exerciseTopic}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${diffBadgeStyle}`}
              >
                Nivel {difficulty}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Problem Statement, Live Interactive Code Snippet Runner & Solution */}
      <div className="p-3.5 sm:p-4 space-y-3 bg-slate-50/40 min-w-0 max-w-full">
        {/* 1. Problem Statement */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-900 font-bold flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              {isCorto
                ? 'Enunciado del Ejercicio Propuesto Corto'
                : 'Enunciado del Ejercicio para Desarrollar'}
            </span>
          </div>

          {editable && onUpdateBlock ? (
            <textarea
              rows={3}
              value={block.content}
              onChange={(e) => onUpdateBlock({ content: e.target.value })}
              placeholder="Describe el problema del ejercicio, datos de entrada y salida esperada..."
              className="w-full p-2.5 text-xs sm:text-sm text-slate-800 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-600 resize-y"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
              {renderRichTextWithInlinePreviews(block.content)}
            </div>
          )}
        </div>

        {/* 2. Hint / Criterio Técnico */}
        {(editable || block.relevanceComment) && (
          <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2 min-w-0">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            {editable && onUpdateBlock ? (
              <input
                type="text"
                value={block.relevanceComment ?? ''}
                onChange={(e) =>
                  onUpdateBlock({ relevanceComment: e.target.value })
                }
                placeholder="Pista técnica o concepto clave a aplicar en este ejercicio..."
                className="flex-1 min-w-0 px-2 py-1 bg-white border border-amber-300 rounded text-xs"
              />
            ) : (
              <div className="min-w-0 break-words">
                <strong>Pista / Criterio Técnico:</strong>{' '}
                {block.relevanceComment}
              </div>
            )}
          </div>
        )}

        {/* 3. LIVE INTERACTIVE CODE SNIPPET RUNNER (Student writes and tests execution right here!) */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-2xs min-w-0 max-w-full">
          {/* Top Runner Toolbar */}
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-200 truncate">
                Snippet Interactivo JS · Escribe y prueba tu código aquí
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleRunSnippet()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-2xs transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Ejecutar Código</span>
              </button>

              <button
                type="button"
                onClick={handleResetSnippet}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Restaurar snippet inicial"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>

              {block.exerciseSolution && (
                <button
                  type="button"
                  onClick={handleLoadSolutionIntoEditor}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/70 transition-colors"
                  title="Cargar la solución resuelta en este editor y ejecutarla"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Probar Solución</span>
                </button>
              )}
            </div>
          </div>

          {/* Editable Student Code Area */}
          <div className="p-3 bg-slate-950 min-w-0 max-w-full">
            <textarea
              spellCheck={false}
              rows={Math.max(4, Math.min(14, studentLinesCount + 1))}
              value={
                editable && onUpdateBlock
                  ? block.exerciseStarterCode ?? studentCode
                  : studentCode
              }
              onChange={(e) => {
                setStudentCode(e.target.value);
                if (editable && onUpdateBlock) {
                  onUpdateBlock({ exerciseStarterCode: e.target.value });
                }
              }}
              placeholder="// Escribe tu código JavaScript aquí y pulsa Ejecutar Código..."
              className="w-full font-mono text-xs leading-relaxed bg-slate-950 text-emerald-300 focus:outline-none resize-y whitespace-pre-wrap break-words"
            />
          </div>

          {/* Live Execution Console Output */}
          {execResult && (
            <div className="px-3.5 py-2.5 bg-black/90 border-t border-slate-800 font-mono text-xs space-y-1.5 min-w-0 max-w-full">
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 border-b border-slate-800/80 pb-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Consola de Ejecución en Vivo (Motor JS)</span>
                </span>
                <span>Tiempo: {execResult.durationMs} ms</span>
              </div>

              {execResult.logs.length === 0 && !execResult.error && (
                <div className="text-slate-400 italic text-[11px]">
                  ✓ Código ejecutado sin errores. (Usa console.log(...) para
                  imprimir resultados en consola).
                </div>
              )}

              {execResult.logs.map((entry, idx) => (
                <div
                  key={idx}
                  className={`whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed ${
                    entry.level === 'error'
                      ? 'text-rose-400'
                      : entry.level === 'warn'
                      ? 'text-amber-300'
                      : entry.level === 'result'
                      ? 'text-indigo-300 font-semibold'
                      : 'text-emerald-300'
                  }`}
                >
                  <span className="text-slate-600 select-none mr-1.5">&gt;</span>
                  {entry.text}
                </div>
              ))}

              {execResult.error && (
                <div className="p-2 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[11px]">
                  <strong>⚠️ Error en Tiempo de Ejecución:</strong>{' '}
                  {execResult.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Step-by-Step Official Solution Section */}
        {editable && onUpdateBlock ? (
          <div className="space-y-1.5 pt-2 border-t border-indigo-200/60">
            <label className="block text-[11px] font-mono font-bold text-slate-700">
              Solución Oficial Resuelta Paso a Paso (Código JS de Referencia):
            </label>
            <textarea
              rows={Math.max(4, solutionLines.length)}
              value={block.exerciseSolution ?? ''}
              onChange={(e) =>
                onUpdateBlock({ exerciseSolution: e.target.value })
              }
              placeholder="// Escribe aquí la solución comentada paso a paso..."
              className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-300 border border-slate-800 rounded-xl focus:outline-none resize-y"
            />
          </div>
        ) : (
          block.exerciseSolution && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowSolution((v) => !v)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  showSolution
                    ? 'bg-slate-900 text-white'
                    : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {showSolution
                    ? 'Ocultar Solución de Referencia'
                    : 'Ver Solución Oficial Paso a Paso'}
                </span>
                {showSolution ? (
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>

              {showSolution && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 min-w-0 max-w-full">
                  <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Solución Oficial Comentada Paso a Paso</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleLoadSolutionIntoEditor}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono bg-emerald-700 hover:bg-emerald-600 text-white rounded"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Cargar y Ejecutar Arriba</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopySolution}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                      >
                        {copiedSol ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 font-mono text-xs leading-relaxed space-y-0.5 min-w-0 max-w-full overflow-hidden">
                    {solutionLines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className="flex items-start gap-2.5 hover:bg-slate-900/70 rounded px-1 min-w-0"
                      >
                        <span className="select-none text-right text-slate-600 w-6 shrink-0 font-mono text-[11px]">
                          {lIdx + 1}
                        </span>
                        <span className="text-emerald-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-mono min-w-0 flex-1">
                          {line || ' '}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export function renderRichTextWithInlinePreviews(text: string): React.ReactNode {
  if (!text) return null;

  // If the text contains HTML generated by VisualRichTextEditor, render rich HTML while turning interactive preview links into HoverPreviewTrigger
  if (
    /<(p|div|strong|b|em|i|u|ul|ol|li|h3|h4|span|mark|a|code|font|strike)\b/i.test(
      text
    )
  ) {
    const anchorRegex =
      /<a\b[^>]*href="([^"]*)"[^>]*data-preview-kind="(link|video)"[^>]*data-preview-comment="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    if (!anchorRegex.test(text)) {
      return (
        <div
          className="rich-visual-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:text-sm [&_h4]:font-bold [&_p]:my-1"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    // Split around interactive preview anchor tags so HoverPreviewTrigger works inside rich HTML
    anchorRegex.lastIndex = 0;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let m: RegExpExecArray | null;
    while ((m = anchorRegex.exec(text)) !== null) {
      if (m.index > lastIdx) {
        parts.push(
          <span
            key={`html-${lastIdx}`}
            dangerouslySetInnerHTML={{ __html: text.slice(lastIdx, m.index) }}
          />
        );
      }
      const href = m[1];
      const kind = m[2] as 'link' | 'video';
      const comment =
        m[3] || 'Recurso referenciado por el instructor para ampliar este tema.';
      const innerText = m[4]
        .replace(/<[^>]+>/g, '')
        .replace(/^(🎬|🔗)\s*/, '')
        .trim();

      parts.push(
        <HoverPreviewTrigger
          key={`prev-${m.index}`}
          kind={kind}
          title={innerText || href}
          url={href}
          relevanceComment={comment}
          inline
        />
      );
      lastIdx = m.index + m[0].length;
    }
    if (lastIdx < text.length) {
      parts.push(
        <span
          key="html-end"
          dangerouslySetInnerHTML={{ __html: text.slice(lastIdx) }}
        />
      );
    }
    return (
      <div className="rich-visual-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:text-sm [&_h4]:font-bold [&_p]:my-1">
        {parts}
      </div>
    );
  }

  const linkRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <React.Fragment key={`t-${lastIndex}`}>
          {formatInlineCodeAndBold(text.slice(lastIndex, match.index))}
        </React.Fragment>
      );
    }

    const rawLabel = match[1];
    const url = match[2];
    const comment =
      match[3] ||
      'Recurso referenciado en el texto por el instructor para ampliar este concepto.';
    const isVideo =
      rawLabel.toLowerCase().startsWith('video:') ||
      rawLabel.startsWith('🎬') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com');
    const cleanLabel = rawLabel.replace(/^video:\s*/i, '').replace(/^🎬\s*/, '');

    elements.push(
      <HoverPreviewTrigger
        key={`lnk-${match.index}`}
        kind={isVideo ? 'video' : 'link'}
        title={cleanLabel}
        url={url}
        relevanceComment={comment}
        inline
      />
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(
      <React.Fragment key={`t-end`}>
        {formatInlineCodeAndBold(text.slice(lastIndex))}
      </React.Fragment>
    );
  }

  return elements;
}

function formatInlineCodeAndBold(segment: string): React.ReactNode {
  const parts = segment.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-slate-100 text-indigo-800 border border-slate-200 rounded"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={idx}>
        {boldParts.map((bp, bIdx) => {
          if (bp.startsWith('**') && bp.endsWith('**') && bp.length > 4) {
            return (
              <strong key={bIdx} className="font-bold text-slate-900">
                {bp.slice(2, -2)}
              </strong>
            );
          }
          return bp;
        })}
      </React.Fragment>
    );
  });
}

/**
 * Full Notion-Style Lesson Content Renderer (Used in PublicLearnerPortal, MobileAppShell & Printable Guide)
 * Separates Theoretical Content (Explanations, Book Quotes, Diagrams, Interactive Graphics, Examples)
 * from the Practical Exercise Workshop (Separated Individual Exercises).
 */
export const LessonBlocksRenderer: React.FC<{
  lesson: Lesson;
}> = ({ lesson }) => {
  const rawBlocks = useMemo(() => ensureLessonBlocks(lesson), [lesson]);

  // Filter out any block or Notion section (heading + its children) marked as hiddenFromPublic
  const blocks = useMemo(() => {
    const visible: LessonBlock[] = [];
    let currentSectionHidden = false;
    for (const blk of rawBlocks) {
      if (blk.type === 'heading') {
        currentSectionHidden = Boolean(blk.hiddenFromPublic);
      }
      if (currentSectionHidden || blk.hiddenFromPublic) {
        continue;
      }
      visible.push(blk);
    }
    return visible;
  }, [rawBlocks]);

  const [openVideoEmbedIds, setOpenVideoEmbedIds] = useState<
    Record<string, boolean>
  >({});
  const [sectionFilter, setSectionFilter] = useState<
    'all' | 'theory' | 'cortos' | 'desarrollo'
  >('all');

  const theoryBlocks = useMemo(
    () => blocks.filter((b) => b.type !== 'exercise'),
    [blocks]
  );
  const exerciseBlocks = useMemo(
    () => blocks.filter((b) => b.type === 'exercise'),
    [blocks]
  );
  const shortExercises = useMemo(
    () => exerciseBlocks.filter((b) => b.exerciseCategory === 'corto'),
    [exerciseBlocks]
  );
  const devExercises = useMemo(
    () => exerciseBlocks.filter((b) => b.exerciseCategory !== 'corto'),
    [exerciseBlocks]
  );
  const quoteCount = useMemo(
    () => blocks.filter((b) => b.type === 'quote').length,
    [blocks]
  );

  const toggleVideoEmbed = (blockId: string) => {
    setOpenVideoEmbedIds((prev) => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  const renderSingleBlock = (block: LessonBlock, exerciseIdx?: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <h3
            key={block.id}
            className="text-base font-bold text-slate-900 pt-3 border-b border-slate-100 pb-1.5 flex items-center gap-2 min-w-0"
          >
            <span className="w-1.5 h-4 rounded-full bg-indigo-600 inline-block shrink-0" />
            <span className="break-words min-w-0">
              {block.title || block.content}
            </span>
          </h3>
        );

      case 'text':
        return (
          <div
            key={block.id}
            className="text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere] min-w-0 max-w-full"
          >
            {renderRichTextWithInlinePreviews(block.content)}
          </div>
        );

      case 'quote':
        return <QuoteBlockView key={block.id} block={block} />;

      case 'exercise':
        return (
          <ExerciseBlockView
            key={block.id}
            block={block}
            exerciseNumber={exerciseIdx}
          />
        );

      case 'callout': {
        const tone = block.calloutTone ?? 'info';
        const styles =
          tone === 'tip'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : tone === 'warning'
            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
            : 'bg-indigo-50/70 border-indigo-200 text-indigo-950';
        return (
          <div
            key={block.id}
            className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 min-w-0 max-w-full ${styles}`}
          >
            {tone === 'tip' ? (
              <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : tone === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs leading-relaxed min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
              {block.title && (
                <div className="font-bold text-sm break-words">
                  {block.title}
                </div>
              )}
              <div className="whitespace-pre-line break-words">
                {renderRichTextWithInlinePreviews(block.content)}
              </div>
            </div>
          </div>
        );
      }

      case 'diagram':
        return <DiagramBlockView key={block.id} block={block} />;

      case 'interactive':
        return <InteractiveGraphicBlockView key={block.id} block={block} />;

      case 'link':
        return (
          <div key={block.id} className="my-1">
            <HoverPreviewTrigger
              kind="link"
              title={block.title || block.url || 'Enlace de referencia'}
              url={block.url || 'https://developer.mozilla.org'}
              relevanceComment={
                block.relevanceComment ||
                block.content ||
                'Enlace técnico seleccionado para fundamentar la lección.'
              }
              domainOrSource={block.domainOrSource}
              description={block.content}
            />
          </div>
        );

      case 'video': {
        const ytId = extractYouTubeId(block.url);
        const isEmbedOpen = !!openVideoEmbedIds[block.id];
        return (
          <div key={block.id} className="my-1 space-y-2">
            <HoverPreviewTrigger
              kind="video"
              title={block.title || 'Video explicativo de la lección'}
              url={block.url || 'https://www.youtube.com'}
              relevanceComment={
                block.relevanceComment ||
                block.content ||
                'Video seleccionado por el instructor para demostrar el procedimiento paso a paso.'
              }
              domainOrSource={block.domainOrSource}
              videoTimestamp={block.videoTimestamp}
              description={block.content}
              onToggleEmbed={() => toggleVideoEmbed(block.id)}
              isEmbedOpen={isEmbedOpen}
            />

            {isEmbedOpen && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 p-4 space-y-3">
                {ytId ? (
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                      title={block.title || 'Video OVA'}
                      src={`https://www.youtube.com/embed/${ytId}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-3">
                    <Video className="w-6 h-6 text-rose-400" />
                    <div className="text-sm font-bold text-white">
                      {block.title}
                    </div>
                    <a
                      href={block.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                    >
                      Abrir Reproductor Externo
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      case 'code':
        return <CodeSegmentBlockView key={block.id} block={block} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 min-w-0 max-w-full overflow-hidden">
      {/* Segmented Filter Bar when Lesson has Separated Exercises */}
      {exerciseBlocks.length > 0 && (
        <div className="p-2.5 bg-slate-100/90 border border-slate-200/90 rounded-xl flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => setSectionFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                sectionFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todo ({blocks.length})
            </button>
            <button
              type="button"
              onClick={() => setSectionFilter('theory')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 ${
                sectionFilter === 'theory'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 shrink-0" />
              <span>
                1. Teoría y Libros
                {quoteCount > 0 ? ` (${quoteCount} citas)` : ''}
              </span>
            </button>
            {shortExercises.length > 0 && (
              <button
                type="button"
                onClick={() => setSectionFilter('cortos')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 ${
                  sectionFilter === 'cortos'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  2. Ejercicios Cortos ({shortExercises.length})
                </span>
              </button>
            )}
            {devExercises.length > 0 && (
              <button
                type="button"
                onClick={() => setSectionFilter('desarrollo')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 ${
                  sectionFilter === 'desarrollo'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 shrink-0" />
                <span>
                  3. Para Desarrollar ({devExercises.length})
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PART 1: DOCUMENT SEQUENCE OR SEGMENTED VIEW */}
      {sectionFilter === 'all' && (
        <div className="space-y-4 min-w-0 max-w-full">
          {(() => {
            let shortShownHeader = false;
            let devShownHeader = false;
            let shortCounter = 0;
            let devCounter = 0;

            return blocks.map((block) => {
              if (block.type === 'exercise') {
                const isShort = block.exerciseCategory === 'corto';
                if (isShort) {
                  shortCounter += 1;
                  const showBanner = !shortShownHeader;
                  shortShownHeader = true;
                  return (
                    <div
                      key={block.id}
                      className="space-y-3 min-w-0 max-w-full"
                    >
                      {showBanner && (
                        <div className="pt-3 border-t-2 border-amber-300/80">
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5 min-w-0">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                                Parte A · Verificación Rápida con Ejecución en
                                Vivo
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-white break-words">
                                ⚡ {shortExercises.length} Ejercicios Propuestos
                                Cortos del Tópico
                              </h3>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-mono font-semibold">
                              Completa el snippet y pulsa ▶ Ejecutar Código
                            </span>
                          </div>
                        </div>
                      )}
                      {renderSingleBlock(block, shortCounter)}
                    </div>
                  );
                } else {
                  devCounter += 1;
                  const showBanner = !devShownHeader;
                  devShownHeader = true;
                  return (
                    <div
                      key={block.id}
                      className="space-y-3 min-w-0 max-w-full"
                    >
                      {showBanner && (
                        <div className="pt-3 border-t-2 border-indigo-200/80">
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5 min-w-0">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                                Parte B · Taller Práctico de Desarrollo
                                Algorítmico
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-white break-words">
                                🛠️ {devExercises.length} Ejercicios Similares
                                para Desarrollar en el Snippet
                              </h3>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-mono font-semibold">
                              Desarrolla y prueba tu solución en consola
                            </span>
                          </div>
                        </div>
                      )}
                      {renderSingleBlock(block, devCounter)}
                    </div>
                  );
                }
              }
              return renderSingleBlock(block);
            });
          })()}
        </div>
      )}

      {sectionFilter === 'theory' && (
        <div className="space-y-4 min-w-0 max-w-full">
          {theoryBlocks.map((block) => renderSingleBlock(block))}
        </div>
      )}

      {/* PART 2A: 5 SHORT PROPOSED EXERCISES (FILTERED VIEW) */}
      {sectionFilter === 'cortos' && shortExercises.length > 0 && (
          <div className="pt-4 border-t-2 border-amber-300/80 space-y-3 min-w-0 max-w-full">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                  Parte A · Verificación Rápida con Ejecución en Vivo
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white break-words">
                  ⚡ {shortExercises.length} Ejercicios Propuestos Cortos del
                  Tópico
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-mono font-semibold">
                Completa el snippet y pulsa ▶ Ejecutar Código
              </span>
            </div>

            <div className="space-y-3.5 min-w-0 max-w-full">
              {shortExercises.map((exBlock, idx) =>
                renderSingleBlock(exBlock, idx + 1)
              )}
            </div>
          </div>
        )}

      {/* PART 2B: 10 SIMILAR EXERCISES TO DEVELOP (FILTERED VIEW) */}
      {sectionFilter === 'desarrollo' && devExercises.length > 0 && (
          <div className="pt-4 border-t-2 border-indigo-200/80 space-y-3 min-w-0 max-w-full">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                  Parte B · Taller Práctico de Desarrollo Algorítmico
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white break-words">
                  🛠️ {devExercises.length} Ejercicios Similares para Desarrollar
                  en el Snippet
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-mono font-semibold">
                Desarrolla y prueba tu solución en consola
              </span>
            </div>

            <div className="space-y-3.5 min-w-0 max-w-full">
              {devExercises.map((exBlock, idx) =>
                renderSingleBlock(exBlock, idx + 1)
              )}
            </div>
          </div>
        )}
    </div>
  );
};

/**
 * Unified In-Place WYSIWYG Block Editor ("Editar textos y contenido en el mismo lugar").
 * Every block renders its real visual representation AND allows editing its text, code,
 * links, videos, diagrams, and interactive graphics directly in the exact same place!
 */
export const NotionLessonBlockEditor: React.FC<{
  lesson: Lesson;
  onUpdateLesson: (patch: Partial<Lesson>) => void;
}> = ({ lesson, onUpdateLesson }) => {
  const blocks = useMemo(() => ensureLessonBlocks(lesson), [lesson]);
  const [newElementType, setNewElementType] =
    useState<LessonBlockType>('text');
  const [editingMediaBlockId, setEditingMediaBlockId] = useState<string | null>(
    null
  );

  // Notion Section Outline / Quick Reorder Drawer & Inline Insert Menu state
  const [showSectionOutline, setShowSectionOutline] = useState<boolean>(false);
  const [insertMenuAfterIdx, setInsertMenuAfterIdx] = useState<number | null>(
    null
  );
  const [filterEditorVisibility, setFilterEditorVisibility] = useState<
    'all' | 'public_only' | 'hidden_only'
  >('all');

  // Inline link/video helper for text blocks
  const [inlineHelperBlockId, setInlineHelperBlockId] = useState<string | null>(
    null
  );
  const [inlineHelperKind, setInlineHelperKind] = useState<'link' | 'video'>(
    'link'
  );
  const [inlineLabel, setInlineLabel] = useState('');
  const [inlineUrl, setInlineUrl] = useState('https://');
  const [inlineComment, setInlineComment] = useState('');

  const commitBlocks = (nextBlocks: LessonBlock[]) => {
    const syncedMarkdown = blocksToMarkdown(nextBlocks);
    const primaryMedia = nextBlocks.find(
      (b) => b.type === 'video' || b.type === 'link'
    );
    onUpdateLesson({
      blocks: nextBlocks,
      contentMarkdown: syncedMarkdown,
      mediaUrl: primaryMedia?.url,
      mediaTitle: primaryMedia?.title,
      mediaComment: primaryMedia?.relevanceComment,
    });
  };

  // Compute Notion Section ranges: each 'heading' block starts a Notion Section extending until the next 'heading'
  const notionSections = useMemo(() => {
    const list: Array<{
      headingIndex: number;
      endIndex: number;
      headingBlock: LessonBlock;
      childCount: number;
    }> = [];
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'heading') {
        let end = i;
        for (let j = i + 1; j < blocks.length; j++) {
          if (blocks[j].type === 'heading') break;
          end = j;
        }
        list.push({
          headingIndex: i,
          endIndex: end,
          headingBlock: blocks[i],
          childCount: end - i,
        });
      }
    }
    return list;
  }, [blocks]);

  // Move an entire Notion Section (heading + all its child blocks) up or down relative to adjacent Notion Sections
  const handleMoveNotionSection = (headingIdx: number, direction: -1 | 1) => {
    const secIdx = notionSections.findIndex(
      (s) => s.headingIndex === headingIdx
    );
    if (secIdx === -1) return;
    const targetSecIdx = secIdx + direction;
    if (targetSecIdx < 0 || targetSecIdx >= notionSections.length) return;

    const currentSec = notionSections[secIdx];
    const targetSec = notionSections[targetSecIdx];

    const next = [...blocks];
    if (direction === -1) {
      const movingSlice = next.slice(
        currentSec.headingIndex,
        currentSec.endIndex + 1
      );
      next.splice(
        currentSec.headingIndex,
        currentSec.endIndex - currentSec.headingIndex + 1
      );
      next.splice(targetSec.headingIndex, 0, ...movingSlice);
    } else {
      const targetSlice = next.slice(
        targetSec.headingIndex,
        targetSec.endIndex + 1
      );
      next.splice(
        targetSec.headingIndex,
        targetSec.endIndex - targetSec.headingIndex + 1
      );
      next.splice(currentSec.headingIndex, 0, ...targetSlice);
    }
    commitBlocks(next);
  };

  // Toggle Public Visibility of an entire Notion Section (heading + all child blocks)
  const handleToggleSectionPublicVisibility = (headingIdx: number) => {
    const sec = notionSections.find((s) => s.headingIndex === headingIdx);
    if (!sec) return;
    const nextHidden = !sec.headingBlock.hiddenFromPublic;
    const next = blocks.map((b, idx) =>
      idx >= sec.headingIndex && idx <= sec.endIndex
        ? { ...b, hiddenFromPublic: nextHidden }
        : b
    );
    commitBlocks(next);
  };

  // Insert a complete Section (Heading + Text block) at a given position
  const handleInsertCompleteNotionSection = (afterIndex?: number) => {
    const stamp = Date.now();
    const headingBlock: LessonBlock = {
      id: `blk-sec-h-${stamp}`,
      type: 'heading',
      title: 'Nueva Sección de Estudio',
      content: 'Nueva Sección de Estudio',
    };
    const bodyBlock: LessonBlock = {
      id: `blk-sec-t-${stamp}`,
      type: 'text',
      content:
        'Desarrolla aquí el contenido de esta nueva sección. Puedes insertar más bloques debajo o mover la sección completa hacia arriba o abajo.',
    };
    const next = [...blocks];
    const insertIdx =
      afterIndex !== undefined ? afterIndex + 1 : next.length;
    next.splice(insertIdx, 0, headingBlock, bodyBlock);
    commitBlocks(next);
    setInsertMenuAfterIdx(null);
  };

  const hiddenCount = useMemo(
    () => blocks.filter((b) => b.hiddenFromPublic).length,
    [blocks]
  );
  const publicCount = blocks.length - hiddenCount;

  const handleUpdateBlock = (blockId: string, patch: Partial<LessonBlock>) => {
    const next = blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b));
    commitBlocks(next);
  };

  const handleAddBlockAt = (type: LessonBlockType, afterIndex?: number) => {
    const newId = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let newBlock: LessonBlock;

    if (type === 'heading') {
      newBlock = {
        id: newId,
        type: 'heading',
        title: '',
        content: '',
      };
    } else if (type === 'link') {
      newBlock = {
        id: newId,
        type: 'link',
        title: '',
        url: '',
        domainOrSource: '',
        content: '',
        relevanceComment: '',
      };
      setEditingMediaBlockId(newId);
    } else if (type === 'video') {
      newBlock = {
        id: newId,
        type: 'video',
        title: '',
        url: '',
        domainOrSource: '',
        videoTimestamp: '',
        content: '',
        relevanceComment: '',
      };
      setEditingMediaBlockId(newId);
    } else if (type === 'code') {
      newBlock = {
        id: newId,
        type: 'code',
        codeLanguage: 'javascript',
        title: '',
        content: '',
        relevanceComment: '',
      };
    } else if (type === 'diagram') {
      newBlock = {
        id: newId,
        type: 'diagram',
        diagramKind: 'if_else_flow',
        title: 'Esquema Visual de Estructura de Control',
        content:
          'Observa cómo se ramifica el flujo de ejecución según el valor booleano de la condición.',
      };
    } else if (type === 'interactive') {
      newBlock = {
        id: newId,
        type: 'interactive',
        interactiveKind: 'array_lab',
        title: 'Laboratorio Interactivo de Estructura de Datos en JS',
        content:
          'Haz clic en los métodos para observar cómo muta o se transforma la estructura en tiempo real.',
      };
    } else if (type === 'quote') {
      newBlock = {
        id: newId,
        type: 'quote',
        title: 'Eloquent JavaScript (4.ª Edición)',
        quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
        content:
          'Escribe aquí la cita textual del libro o especificación ECMA-262...',
        relevanceComment:
          'Explica aquí cómo se aplica esta cita al desarrollo profesional de software.',
      };
    } else if (type === 'exercise') {
      newBlock = {
        id: newId,
        type: 'exercise',
        title: 'Nuevo Ejercicio Práctico Independiente',
        exerciseDifficulty: 'Intermedio',
        exerciseTopic: 'Algoritmia JavaScript',
        content:
          'Describe el enunciado del ejercicio, los parámetros de entrada y el resultado esperado.',
        relevanceComment:
          'Pista técnica para orientar la solución del aprendiz.',
        exerciseSolution:
          '// Solución paso a paso:\nconst resolver = () => {\n  return true;\n};',
      };
    } else if (type === 'callout') {
      newBlock = {
        id: newId,
        type: 'callout',
        calloutTone: 'tip',
        title: '',
        content: '',
      };
    } else {
      newBlock = {
        id: newId,
        type: 'text',
        content: '',
      };
    }

    const next = [...blocks];
    const insertIdx =
      afterIndex !== undefined ? afterIndex + 1 : next.length;
    next.splice(insertIdx, 0, newBlock);
    commitBlocks(next);
    setInsertMenuAfterIdx(null);
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitBlocks(next);
  };

  const handleMoveBlockToEdge = (index: number, edge: 'top' | 'bottom') => {
    if (blocks.length <= 1) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    if (edge === 'top') {
      next.unshift(moved);
    } else {
      next.push(moved);
    }
    commitBlocks(next);
  };

  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index];
    const copy: LessonBlock = {
      ...original,
      id: `blk-${Date.now()}`,
      title: original.title ? `${original.title} (Copia)` : original.title,
    };
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    commitBlocks(next);
  };

  const handleDeleteBlock = (index: number) => {
    const next = blocks.filter((_, idx) => idx !== index);
    commitBlocks(next);
  };

  const handleInsertInlineResource = (blockId: string) => {
    if (!inlineLabel.trim() || !inlineUrl.trim()) return;
    const target = blocks.find((b) => b.id === blockId);
    if (!target) return;

    const prefix = inlineHelperKind === 'video' ? 'video:' : '';
    const cleanComment = (
      inlineComment.trim() ||
      (inlineHelperKind === 'video'
        ? 'Video clave para comprender este procedimiento práctico.'
        : 'Enlace de referencia relevante para profundizar este concepto.')
    ).replace(/"/g, "'");

    const markdownSnippet = ` [${prefix}${inlineLabel.trim()}](${inlineUrl.trim()} "${cleanComment}") `;

    handleUpdateBlock(blockId, {
      content: `${target.content}${markdownSnippet}`,
    });

    setInlineHelperBlockId(null);
    setInlineLabel('');
    setInlineUrl('https://');
    setInlineComment('');
  };

  const renderNotionInsertMenu = (afterIndex?: number) => (
    <div className="p-3 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-xl space-y-2.5 text-xs my-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Insertar Sección o Bloque de Estudio
        </span>
        <button
          type="button"
          onClick={() => setInsertMenuAfterIdx(null)}
          className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={() => handleInsertCompleteNotionSection(afterIndex)}
          className="sm:col-span-3 flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors text-left"
        >
          <span>🗂️ + Nueva Sección Completa (Encabezado + Desarrollo)</span>
          <span className="text-[10px] font-mono bg-indigo-900/60 px-2 py-0.5 rounded">
            Sección
          </span>
        </button>

        {(
          [
            { type: 'heading' as LessonBlockType, label: '📌 Subtítulo de Sección' },
            { type: 'text' as LessonBlockType, label: '📝 Texto / Explicación' },
            { type: 'quote' as LessonBlockType, label: '📚 Cita / Libro' },
            { type: 'code' as LessonBlockType, label: '💻 Código Fuente' },
            { type: 'diagram' as LessonBlockType, label: '📊 Diagrama Visual SVG' },
            { type: 'interactive' as LessonBlockType, label: '⚡ Lab Interactivo' },
            { type: 'exercise' as LessonBlockType, label: '🧩 Ejercicio Ejecutable' },
            { type: 'callout' as LessonBlockType, label: '💡 Nota / Callout' },
            { type: 'video' as LessonBlockType, label: '🎬 Video Educativo' },
            { type: 'link' as LessonBlockType, label: '🔗 Enlace con Preview' },
          ] as const
        ).map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => handleAddBlockAt(item.type, afterIndex)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-medium text-left transition-colors truncate"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Track which blocks are inside a collapsed Notion section in the editor
  const collapsedBySectionBlockIds = useMemo(() => {
    const hiddenInEditor = new Set<string>();
    let currentSectionCollapsed = false;
    for (const blk of blocks) {
      if (blk.type === 'heading') {
        currentSectionCollapsed = Boolean(blk.collapsedInEditor);
        continue;
      }
      if (currentSectionCollapsed) {
        hiddenInEditor.add(blk.id);
      }
    }
    return hiddenInEditor;
  }, [blocks]);

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs min-w-0 max-w-full">
      {/* Top In-Place Add Element & Notion Sections Organizer Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2.5 space-y-2.5 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Editor Modular de Secciones:</span>
            </span>
            <select
              aria-label="Seleccionar tipo de elemento a agregar"
              value={newElementType}
              onChange={(e) =>
                setNewElementType(e.target.value as LessonBlockType)
              }
              className="min-w-0 flex-1 sm:flex-initial max-w-full px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600 truncate"
            >
              <option value="heading">📌 Subtítulo de Sección</option>
              <option value="text">📝 Texto / Explicación Extensa</option>
              <option value="quote">📚 Cita Bibliográfica / Libro</option>
              <option value="exercise">🧩 Ejercicio Práctico Separado</option>
              <option value="code">💻 Código Fuente (Ejemplo IDE)</option>
              <option value="diagram">📊 Diagrama / Esquema Visual SVG</option>
              <option value="interactive">
                ⚡ Gráfico Interactivo (Arrays / Objetos)
              </option>
              <option value="link">🔗 Enlace con Previsualización</option>
              <option value="video">🎬 Video con Previsualización</option>
              <option value="callout">💡 Nota / Callout Destacado</option>
            </select>
            <button
              type="button"
              onClick={() => handleAddBlockAt(newElementType)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>
            <button
              type="button"
              onClick={() => handleInsertCompleteNotionSection()}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0 shadow-2xs"
              title="Crear una sección completa con encabezado y bloque de contenido"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Nueva Sección</span>
            </button>
          </div>

          {/* Visibility Stats & Section Outline Drawer Toggle */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterEditorVisibility('all')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  filterEditorVisibility === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({blocks.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterEditorVisibility('public_only')}
                className={`px-2 py-1 rounded-md font-semibold inline-flex items-center gap-1 transition-colors ${
                  filterEditorVisibility === 'public_only'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
                title="Ver solo elementos visibles al público"
              >
                <Eye className="w-3 h-3" />
                <span>Públicos ({publicCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterEditorVisibility('hidden_only')}
                className={`px-2 py-1 rounded-md font-semibold inline-flex items-center gap-1 transition-colors ${
                  filterEditorVisibility === 'hidden_only'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
                title="Ver elementos ocultos para la vista al público"
              >
                <EyeOff className="w-3 h-3" />
                <span>Ocultos ({hiddenCount})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSectionOutline((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                showSectionOutline
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                Organizar Secciones ({notionSections.length})
              </span>
            </button>
          </div>
        </div>

        {/* Quick 1-Click Element Pills */}
        <div className="flex flex-wrap items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={() => handleAddBlockAt('heading')}
            className="px-2 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md"
          >
            + Subtítulo Sección
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('text')}
            className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md"
          >
            + Texto
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('quote')}
            className="px-2 py-1 text-[11px] font-medium bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 border border-amber-300 rounded-md"
          >
            + Cita / Libro
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('exercise')}
            className="px-2 py-1 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            + Ejercicio Separado
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('code')}
            className="px-2 py-1 text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md"
          >
            + Código
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('diagram')}
            className="px-2 py-1 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md"
          >
            + Diagrama
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('interactive')}
            className="px-2 py-1 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-md"
          >
            + Interactivo
          </button>
        </div>

        {/* COLLAPSIBLE SECTION OUTLINE & QUICK REORDER / PUBLIC VISIBILITY MANAGER */}
        {showSectionOutline && (
          <div className="p-3 bg-white border border-indigo-200 rounded-xl space-y-2.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  🗂️ Mapa de Secciones (Desplazar Arriba/Abajo y Ocultar al Público)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mueve secciones completas con todos sus bloques hijos o cambia su visibilidad para la vista pública de aprendices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInsertCompleteNotionSection()}
                className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
              >
                + Añadir Nueva Sección
              </button>
            </div>

            {notionSections.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                Aún no hay encabezados de sección (<code className="font-mono">📌 Subtítulo</code>). Pulsa <strong>+ Nueva Sección</strong> para estructurar la lección en secciones desplazables.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {notionSections.map((sec, sIdx) => {
                  const isHidden = Boolean(sec.headingBlock.hiddenFromPublic);
                  return (
                    <div
                      key={sec.headingBlock.id}
                      className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 text-xs ${
                        isHidden
                          ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 rounded">
                          Sección {sIdx + 1}
                        </span>
                        <span className="font-bold truncate">
                          {sec.headingBlock.title ||
                            sec.headingBlock.content ||
                            'Sección sin título'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          ({sec.childCount} bloques hijos)
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSectionPublicVisibility(
                              sec.headingIndex
                            )
                          }
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                            isHidden
                              ? 'bg-amber-200/80 border-amber-400 text-amber-950'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title="Ocultar o mostrar toda esta sección y sus bloques para la vista al público"
                        >
                          {isHidden ? (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Oculta al Público</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Visible al Público</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={sIdx === 0}
                          onClick={() =>
                            handleMoveNotionSection(sec.headingIndex, -1)
                          }
                          className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
                          title="Subir sección completa con sus bloques"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={sIdx === notionSections.length - 1}
                          onClick={() =>
                            handleMoveNotionSection(sec.headingIndex, 1)
                          }
                          className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
                          title="Bajar sección completa con sus bloques"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Unified Document Canvas: Edit Texts and Content Directly In-Place */}
      <div className="p-3.5 sm:p-5 space-y-3 min-w-0 max-w-full overflow-hidden">
        {/* Top Notion Insert Trigger (Before block #1) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() =>
              setInsertMenuAfterIdx(insertMenuAfterIdx === -1 ? null : -1)
            }
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-500 hover:text-indigo-700 bg-slate-100/80 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Insertar sección o bloque al inicio</span>
          </button>
        </div>
        {insertMenuAfterIdx === -1 && renderNotionInsertMenu(-1)}

        {blocks.length === 0 && (
          <div className="p-8 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-3">
            <p className="text-xs text-slate-500">
              Esta lección está vacía. Ningún elemento es obligatorio: elige
              arriba qué sección o elemento deseas agregar y edítalo directamente aquí.
            </p>
          </div>
        )}

        {blocks.map((block, idx) => {
          // Filter by public/hidden visibility in editor if filter is active
          if (
            filterEditorVisibility === 'public_only' &&
            block.hiddenFromPublic
          ) {
            return null;
          }
          if (
            filterEditorVisibility === 'hidden_only' &&
            !block.hiddenFromPublic
          ) {
            return null;
          }

          // Hide child blocks if their parent Notion section heading is collapsed in editor
          if (collapsedBySectionBlockIds.has(block.id)) {
            return null;
          }

          const isHeadingSection = block.type === 'heading';
          const sectionMeta = isHeadingSection
            ? notionSections.find((s) => s.headingIndex === idx)
            : undefined;
          const sectionOrderIdx = isHeadingSection
            ? notionSections.findIndex((s) => s.headingIndex === idx)
            : -1;

          return (
            <React.Fragment key={block.id}>
              <div
                className={`group relative rounded-xl border p-2.5 sm:p-3 transition-all ${
                  block.hiddenFromPublic
                    ? 'border-dashed border-amber-400 bg-amber-50/35'
                    : isHeadingSection
                    ? 'border-indigo-200 bg-indigo-50/25 hover:border-indigo-300'
                    : 'border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/40'
                }`}
              >
                {/* Floating Action & Reorder Bar on Block Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>

                    {isHeadingSection && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-md">
                        📌 SECCIÓN ({sectionMeta?.childCount ?? 0} bloques)
                      </span>
                    )}

                    <select
                      aria-label="Cambiar tipo de elemento"
                      value={block.type}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          type: e.target.value as LessonBlockType,
                        })
                      }
                      className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 focus:outline-none"
                    >
                      <option value="heading">📌 Subtítulo de Sección</option>
                      <option value="text">📝 Texto</option>
                      <option value="quote">📚 Cita / Libro</option>
                      <option value="exercise">🧩 Ejercicio Separado</option>
                      <option value="code">💻 Código Fuente</option>
                      <option value="diagram">📊 Diagrama Visual</option>
                      <option value="interactive">⚡ Gráfico Interactivo</option>
                      <option value="link">🔗 Enlace Hover</option>
                      <option value="video">🎬 Video Hover</option>
                      <option value="callout">💡 Nota / Callout</option>
                    </select>

                    {/* PUBLIC VISIBILITY TOGGLE PILL (Ocultar / Mostrar para la vista al público) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isHeadingSection) {
                          handleToggleSectionPublicVisibility(idx);
                        } else {
                          handleUpdateBlock(block.id, {
                            hiddenFromPublic: !block.hiddenFromPublic,
                          });
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors ${
                        block.hiddenFromPublic
                          ? 'bg-amber-200/90 border-amber-400 text-amber-950'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title={
                        isHeadingSection
                          ? 'Ocultar o mostrar esta sección completa para la vista al público'
                          : 'Ocultar o mostrar este bloque para la vista al público'
                      }
                    >
                      {block.hiddenFromPublic ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>
                            {isHeadingSection
                              ? 'Sección Oculta al Público'
                              : 'Oculto al Público'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Visible al Público</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Block Controls: Move Section Up/Down, Move Block Up/Down, Collapse, Duplicate, Delete */}
                  <div className="flex flex-wrap items-center gap-1">
                    {isHeadingSection && notionSections.length > 1 && (
                      <div className="inline-flex items-center gap-0.5 mr-1 bg-indigo-100/80 border border-indigo-200 rounded-md px-1 py-0.5">
                        <button
                          type="button"
                          disabled={sectionOrderIdx <= 0}
                          onClick={() => handleMoveNotionSection(idx, -1)}
                          className="px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 hover:bg-indigo-200/70 disabled:opacity-30 rounded"
                          title="Subir toda esta sección con sus bloques"
                        >
                          ⇈ Subir Sección
                        </button>
                        <button
                          type="button"
                          disabled={
                            sectionOrderIdx === -1 ||
                            sectionOrderIdx >= notionSections.length - 1
                          }
                          onClick={() => handleMoveNotionSection(idx, 1)}
                          className="px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 hover:bg-indigo-200/70 disabled:opacity-30 rounded"
                          title="Bajar toda esta sección con sus bloques"
                        >
                          ⇊ Bajar Sección
                        </button>
                      </div>
                    )}

                    {block.type === 'text' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineHelperBlockId(
                              inlineHelperBlockId === block.id ? null : block.id
                            );
                            setInlineHelperKind('link');
                          }}
                          className="px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50 rounded"
                        >
                          + Enlace inline
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineHelperBlockId(
                              inlineHelperBlockId === block.id ? null : block.id
                            );
                            setInlineHelperKind('video');
                          }}
                          className="px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 hover:bg-rose-50 rounded"
                        >
                          + Video inline
                        </button>
                      </>
                    )}

                    {(block.type === 'link' || block.type === 'video') && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingMediaBlockId(
                            editingMediaBlockId === block.id ? null : block.id
                          )
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        {editingMediaBlockId === block.id
                          ? 'Listo'
                          : 'Editar URL'}
                      </button>
                    )}

                    {/* Collapse / Expand in Editor */}
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(block.id, {
                          collapsedInEditor: !block.collapsedInEditor,
                        })
                      }
                      className="p-1 text-slate-500 hover:text-indigo-700 rounded"
                      title={
                        isHeadingSection
                          ? block.collapsedInEditor
                            ? 'Expandir bloques de esta sección'
                            : 'Contraer bloques de esta sección'
                          : block.collapsedInEditor
                          ? 'Expandir bloque'
                          : 'Contraer bloque'
                      }
                    >
                      {block.collapsedInEditor ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveBlock(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded bg-white border border-slate-200/80"
                      title="Desplazar hacia arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(idx, 1)}
                      disabled={idx === blocks.length - 1}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded bg-white border border-slate-200/80"
                      title="Desplazar hacia abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateBlock(idx)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Duplicar elemento"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Eliminar elemento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* IN-PLACE RENDERING + DIRECT EDITING IN THE SAME PLACE */}
                {block.type === 'heading' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 pt-1 border-b border-indigo-200/80 pb-1.5">
                      <span className="w-1.5 h-5 rounded-full bg-indigo-600 shrink-0" />
                      <input
                        type="text"
                        value={block.title ?? block.content}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            title: e.target.value,
                            content: e.target.value,
                          })
                        }
                        placeholder="Escribe el título de la sección aquí..."
                        className="w-full text-base font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-0.5"
                      />
                    </div>
                    {block.collapsedInEditor && (
                      <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg flex items-center justify-between">
                        <span>
                          Sección contraída ({sectionMeta?.childCount ?? 0} bloques ocultos en el editor)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateBlock(block.id, {
                              collapsedInEditor: false,
                            })
                          }
                          className="font-bold underline"
                        >
                          Expandir sección ▾
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!block.collapsedInEditor && block.type === 'text' && (
                  <VisualRichTextEditor
                    value={block.content}
                    onChange={(nextHtml) =>
                      handleUpdateBlock(block.id, { content: nextHtml })
                    }
                    onSlashShortcut={() => setInsertMenuAfterIdx(idx)}
                    placeholder="Escribe el contenido aquí con formato visual (selecciona cualquier palabra para abrir la burbuja de formato)..."
                  />
                )}

                {!block.collapsedInEditor && block.type === 'code' && (
                  <CodeSegmentBlockView
                    block={block}
                    editable
                    onUpdateBlock={(patch) =>
                      handleUpdateBlock(block.id, patch)
                    }
                  />
                )}

                {!block.collapsedInEditor && block.type === 'diagram' && (
                  <DiagramBlockView
                    block={block}
                    editable
                    onUpdateBlock={(patch) =>
                      handleUpdateBlock(block.id, patch)
                    }
                  />
                )}

                {!block.collapsedInEditor && block.type === 'interactive' && (
                  <InteractiveGraphicBlockView
                    block={block}
                    editable
                    onUpdateBlock={(patch) =>
                      handleUpdateBlock(block.id, patch)
                    }
                  />
                )}

                {!block.collapsedInEditor && block.type === 'quote' && (
                  <QuoteBlockView
                    block={block}
                    editable
                    onUpdateBlock={(patch) =>
                      handleUpdateBlock(block.id, patch)
                    }
                  />
                )}

                {!block.collapsedInEditor && block.type === 'exercise' && (
                  <ExerciseBlockView
                    block={block}
                    editable
                    onUpdateBlock={(patch) =>
                      handleUpdateBlock(block.id, patch)
                    }
                  />
                )}

                {!block.collapsedInEditor && block.type === 'callout' && (
                  <div
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      block.calloutTone === 'tip'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : block.calloutTone === 'warning'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                    }`}
                  >
                    <select
                      aria-label="Tono de nota"
                      value={block.calloutTone ?? 'info'}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          calloutTone: e.target.value as
                            | 'info'
                            | 'tip'
                            | 'warning',
                        })
                      }
                      className="text-xs bg-white/80 border border-slate-300 rounded px-1.5 py-1 font-semibold"
                    >
                      <option value="info">📌 Nota</option>
                      <option value="tip">💡 Tip</option>
                      <option value="warning">⚠️ Alerta</option>
                    </select>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={block.title ?? ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, { title: e.target.value })
                        }
                        placeholder="Título de la nota destacada..."
                        className="w-full text-xs font-bold bg-transparent focus:bg-white/80 rounded px-1.5 py-0.5 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={block.content}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            content: e.target.value,
                          })
                        }
                        placeholder="Escribe el contenido de la nota aquí mismo..."
                        className="w-full text-xs bg-transparent focus:bg-white/80 rounded px-1.5 py-0.5 focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                )}

                {!block.collapsedInEditor &&
                  (block.type === 'link' || block.type === 'video') && (
                    <div className="space-y-2">
                      <HoverPreviewTrigger
                        kind={block.type}
                        title={
                          block.title ||
                          block.url ||
                          (block.type === 'video'
                            ? 'Video educativo (clic en Editar URL / Comentario)'
                            : 'Enlace web (clic en Editar URL / Comentario)')
                        }
                        url={block.url || 'https://developer.mozilla.org'}
                        relevanceComment={
                          block.relevanceComment ||
                          'Escribe el comentario de relevancia abajo para previsualizarlo al pasar el cursor.'
                        }
                        domainOrSource={block.domainOrSource}
                        videoTimestamp={block.videoTimestamp}
                        description={block.content}
                      />

                      {(editingMediaBlockId === block.id ||
                        !block.title ||
                        !block.url) && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <input
                            type="text"
                            value={block.title ?? ''}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder={
                              block.type === 'video'
                                ? 'Título del video...'
                                : 'Título del enlace...'
                            }
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                          <input
                            type="url"
                            value={block.url ?? ''}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                url: e.target.value,
                              })
                            }
                            placeholder="https://..."
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                          />
                          {block.type === 'video' ? (
                            <input
                              type="text"
                              value={block.videoTimestamp ?? ''}
                              onChange={(e) =>
                                handleUpdateBlock(block.id, {
                                  videoTimestamp: e.target.value,
                                })
                              }
                              placeholder="Minuto clave (ej. Min 02:15 - 08:40)"
                              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                            />
                          ) : (
                            <input
                              type="text"
                              value={block.domainOrSource ?? ''}
                              onChange={(e) =>
                                handleUpdateBlock(block.id, {
                                  domainOrSource: e.target.value,
                                })
                              }
                              placeholder="Fuente (ej. MDN Web Docs)"
                              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                            />
                          )}
                          <input
                            type="text"
                            value={block.relevanceComment ?? ''}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                relevanceComment: e.target.value,
                              })
                            }
                            placeholder="Comentario sobre el contenido o relevancia (se muestra al pasar el cursor)..."
                            className="sm:col-span-3 px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* NOTION-STYLE INLINE '+' INSERT DIVIDER BETWEEN EVERY BLOCK */}
              <div className="group/divider relative py-0.5 flex items-center justify-center">
                <div className="w-full h-px bg-transparent group-hover/divider:bg-indigo-200 transition-colors" />
                <button
                  type="button"
                  onClick={() =>
                    setInsertMenuAfterIdx(
                      insertMenuAfterIdx === idx ? null : idx
                    )
                  }
                  className={`absolute inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                    insertMenuAfterIdx === idx
                      ? 'opacity-100 bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'opacity-0 group-hover/divider:opacity-100 bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-2xs'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Insertar sección o bloque aquí</span>
                </button>
              </div>
              {insertMenuAfterIdx === idx && renderNotionInsertMenu(idx)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const NotionNodeBlockEditor: React.FC<{
  node: GraphNode;
  onUpdateNode: (patch: Partial<GraphNode>) => void;
}> = ({ node, onUpdateNode }) => {
  const nodeBlocks = useMemo(() => ensureNodeBlocks(node), [node]);

  const virtualLesson: Lesson = useMemo(
    () => ({
      id: node.id,
      order: 1,
      title: node.title,
      durationMinutes: 45,
      summary: '',
      contentMarkdown: node.content,
      blocks: nodeBlocks,
      mediaUrl: node.mediaUrl,
      mediaTitle: node.title,
      mediaComment: node.mediaComment,
      linkedNodeIds: [node.id],
      quiz: node.quizQuestions ?? [],
    }),
    [node, nodeBlocks]
  );

  return (
    <NotionLessonBlockEditor
      lesson={virtualLesson}
      onUpdateLesson={(patch) => {
        const nextBlocks = (patch.blocks ?? nodeBlocks).map((b) => ({
          ...b,
          sourceNodeId: node.id,
        }));
        const firstCode = nextBlocks.find((b) => b.type === 'code');
        const firstMedia = nextBlocks.find(
          (b) => b.type === 'video' || b.type === 'link'
        );
        onUpdateNode({
          blocks: nextBlocks,
          content: patch.contentMarkdown ?? blocksToMarkdown(nextBlocks),
          ...(firstMedia
            ? {
                mediaUrl: firstMedia.url,
                mediaKind: firstMedia.type === 'video' ? 'video' : 'article',
                mediaComment: firstMedia.relevanceComment,
              }
            : {}),
          ...(firstCode
            ? {
                codeLanguage: firstCode.codeLanguage,
              }
            : {}),
        });
      }}
    />
  );
};
