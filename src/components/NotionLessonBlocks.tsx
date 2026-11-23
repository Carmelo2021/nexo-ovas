import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileCode2,
  FileText,
  Globe,
  Heading3,
  Info,
  Columns,
  Lightbulb,
  Link2,
  MessageSquareQuote,
  Play,
  Plus,
  Sparkles,
  Terminal,
  Trash2,
  Video,
} from 'lucide-react';
import {
  GraphNode,
  Lesson,
  LessonBlock,
  LessonBlockType,
} from '../types/ova';

export const CODE_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript / Node.js' },
  { value: 'javascript', label: 'JavaScript (ES6+)' },
  { value: 'sql', label: 'SQL (PostgreSQL / MySQL)' },
  { value: 'python', label: 'Python' },
  { value: 'json', label: 'JSON / OpenAPI' },
  { value: 'yaml', label: 'YAML (Swagger / Docker)' },
  { value: 'bash', label: 'Bash / Terminal CLI' },
  { value: 'cisco', label: 'Cisco IOS CLI (Redes)' },
  { value: 'html', label: 'HTML / CSS' },
];

export function extractDomain(url?: string): string {
  if (!url) return 'recurso.sena.edu.co';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] || 'enlace-externo';
  }
}

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Ensures any Lesson (even legacy ones stored in localStorage without `blocks`)
 * has a rich array of Notion-style blocks.
 */
export function ensureLessonBlocks(lesson: Lesson): LessonBlock[] {
  if (lesson.blocks && lesson.blocks.length > 0) {
    return lesson.blocks;
  }

  const generated: LessonBlock[] = [];
  const raw = lesson.contentMarkdown || '';

  // Split by fenced code blocks first if any exist in contentMarkdown
  const parts = raw.split(/(```[\s\S]*?```)/g);

  parts.forEach((part, partIdx) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
      const lines = trimmed.slice(3, -3).split('\n');
      const firstLine = lines[0]?.trim() || 'typescript';
      const codeBody = lines.slice(1).join('\n').trim();
      generated.push({
        id: `${lesson.id}-blk-code-${partIdx}`,
        type: 'code',
        codeLanguage: firstLine || 'typescript',
        title: `fragmento_${partIdx + 1}.${firstLine === 'sql' ? 'sql' : 'ts'}`,
        content: codeBody || lines.join('\n'),
        relevanceComment:
          'Segmento de código fuente de referencia para implementar en el proyecto formativo.',
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
        `Este recurso complementa directamente la lección "${lesson.title}". Revísalo para fundamentar la entrega de la evidencia del RAP.`,
    });
  }

  return generated;
}

/**
 * Ensures any GraphNode on the Knowledge Graph Canvas has Notion-style blocks
 * (text, links with hover preview comments, videos with hover preview comments, or source code segments).
 */
export function ensureNodeBlocks(node: GraphNode): LessonBlock[] {
  if (node.blocks && node.blocks.length > 0) {
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
      const firstLine = lines[0]?.trim() || node.codeLanguage || 'typescript';
      const codeBody = lines.slice(1).join('\n').trim();
      generated.push({
        id: `${node.id}-nblk-code-${partIdx}`,
        type: 'code',
        codeLanguage: firstLine,
        title: `snippet_${node.id}.${firstLine === 'sql' ? 'sql' : 'ts'}`,
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
        codeLanguage: node.codeLanguage || 'typescript',
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
        `Recurso investigado en el nodo "${node.title}" para integrar en el OVA.`,
      sourceNodeId: node.id,
    });
  }

  if (generated.length === 0) {
    generated.push({
      id: `${node.id}-nblk-default`,
      type: 'text',
      content: node.content || 'Escribe el contenido de este nodo...',
      sourceNodeId: node.id,
    });
  }

  return generated;
}

/**
 * Converts Notion-style blocks back into clean Markdown so exports to Obsidian (.md),
 * Zajuna LMS (.html), and Printable PDF Guides stay 100% synchronized.
 */
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
            b.codeLanguage || 'typescript'
          }\n${b.content}\n\`\`\`${
            b.relevanceComment ? `\n*Nota técnica:* ${b.relevanceComment}` : ''
          }`;
        default:
          return b.content;
      }
    })
    .join('\n\n');
}

/**
 * Floating Hover Preview Component for both Links and Videos (Notion-style Link/Video Popover).
 * Appears when hovering or focusing on a link or video reference, displaying the instructor's
 * commentary about the content and relevance of the link/video.
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
      {/* Trigger Element (Inline Pill or Full Notion Block Card) */}
      {inline ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
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
          className={`group p-3.5 rounded-xl border transition-all cursor-pointer ${
            kind === 'video'
              ? 'bg-gradient-to-r from-rose-50/60 via-white to-slate-50 border-rose-200/90 hover:border-rose-400 hover:shadow-md'
              : 'bg-gradient-to-r from-indigo-50/60 via-white to-slate-50 border-indigo-200/90 hover:border-indigo-400 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span
                    className={`font-bold uppercase tracking-wider ${
                      kind === 'video' ? 'text-rose-700' : 'text-indigo-700'
                    }`}
                  >
                    {kind === 'video'
                      ? 'Video Educativo con Previsualización'
                      : 'Enlace Web con Previsualización'}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="font-mono text-slate-500 truncate">
                    {domain}
                  </span>
                  {videoTimestamp && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded text-[10px]">
                        <Clock className="w-2.5 h-2.5" />
                        {videoTimestamp}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                  <span className="truncate">{title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate italic">
                    Ubica el cursor aquí para previsualizar el comentario de
                    relevancia del instructor...
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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
                href={url}
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
          className="absolute left-0 bottom-full mb-2 w-80 sm:w-96 z-50 pointer-events-auto animate-in fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            {/* Visual Header for Video vs Link */}
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
                    {/* Simulated timeline scrubber bar */}
                    <div className="pt-1 space-y-1">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="w-1/4 bg-slate-600" />
                        <div
                          className="w-2/5 bg-rose-500"
                          title="Segmento relevante destacado por el instructor"
                        />
                        <div className="flex-1 bg-slate-800" />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Segmento destacado por el instructor</span>
                        <span className="text-rose-400">
                          {videoTimestamp || 'Ver completo'}
                        </span>
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

            {/* Main Popover Body: Title + Instructor's Relevance Commentary */}
            <div className="p-3.5 space-y-2.5">
              <div>
                <div className="text-xs font-bold text-white leading-snug">
                  {title}
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {url}
                </div>
              </div>

              {/* Instructor Relevance / Commentary Box */}
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
                    'Recurso seleccionado por el instructor para profundizar los conceptos clave de esta lección.'}
                </p>
              </div>

              {description &&
                relevanceComment &&
                description !== relevanceComment && (
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {description}
                  </p>
                )}

              <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">
                  {kind === 'video'
                    ? 'Recurso audiovisual OVA'
                    : 'Lectura recomendada SENA'}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 font-semibold hover:underline ${
                    kind === 'video' ? 'text-rose-400' : 'text-indigo-400'
                  }`}
                >
                  {kind === 'video'
                    ? 'Abrir video en nueva pestaña'
                    : 'Abrir enlace ahora'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

/**
 * Source Code Segment Block (Notion / IDE style) with language badge, filename,
 * line numbering, copy button, and instructor annotation.
 */
export const CodeSegmentBlockView: React.FC<{
  block: LessonBlock;
}> = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = (block.content || '').split('\n');
  const langLabel =
    CODE_LANGUAGES.find((l) => l.value === block.codeLanguage)?.label ||
    (block.codeLanguage ?? 'TypeScript').toUpperCase();

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-sm my-2">
      {/* Top IDE Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          {block.title && (
            <span className="text-xs font-mono font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              {block.title}
            </span>
          )}
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {langLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">¡Código copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar código</span>
            </>
          )}
        </button>
      </div>

      {/* Code Lines with Line Numbers */}
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/70">
                <td className="select-none pr-4 text-right text-slate-600 w-8 align-top">
                  {idx + 1}
                </td>
                <td className="text-slate-100 whitespace-pre font-mono">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructor Commentary / Code Explanation Footer */}
      {block.relevanceComment && (
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-300">
              Explicación técnica del segmento:
            </strong>{' '}
            {block.relevanceComment}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Parses a text paragraph for inline annotated links or videos:
 * Syntax supported:
 *   [Texto del enlace](https://url "Comentario de relevancia")
 *   [video:Título del video](https://url "Comentario sobre el video")
 * Also formats inline `code` and **bold** text cleanly.
 */
export function renderRichTextWithInlinePreviews(text: string): React.ReactNode {
  // Match markdown links with optional title attribute: [label](url "comment") or [label](url)
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
  // Split by inline backticks `code`
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
    // Format **bold**
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
 * Full Notion-Style Lesson Content Renderer (Used in PublicLearnerPortal & Instructor Live Preview)
 */
export const LessonBlocksRenderer: React.FC<{
  lesson: Lesson;
}> = ({ lesson }) => {
  const blocks = useMemo(() => ensureLessonBlocks(lesson), [lesson]);
  const [openVideoEmbedIds, setOpenVideoEmbedIds] = useState<
    Record<string, boolean>
  >({});

  const toggleVideoEmbed = (blockId: string) => {
    setOpenVideoEmbedIds((prev) => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            return (
              <h3
                key={block.id}
                className="text-base font-bold text-slate-900 pt-3 border-b border-slate-100 pb-1.5 flex items-center gap-2"
              >
                <span className="w-1.5 h-4 rounded-full bg-indigo-600 inline-block" />
                <span>{block.title || block.content}</span>
              </h3>
            );

          case 'text':
            return (
              <div
                key={block.id}
                className="text-sm text-slate-700 leading-relaxed whitespace-pre-line"
              >
                {renderRichTextWithInlinePreviews(block.content)}
              </div>
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
                className={`p-4 rounded-xl border flex items-start gap-3 ${styles}`}
              >
                {tone === 'tip' ? (
                  <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : tone === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs leading-relaxed">
                  {block.title && (
                    <div className="font-bold text-sm">{block.title}</div>
                  )}
                  <div className="whitespace-pre-line">
                    {renderRichTextWithInlinePreviews(block.content)}
                  </div>
                </div>
              </div>
            );
          }

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

                {/* Expandable Notion-style Embedded Video Preview Frame */}
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
                        <div className="w-12 h-12 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                          <Video className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 max-w-lg">
                          <div className="text-sm font-bold text-white">
                            {block.title}
                          </div>
                          <p className="text-xs text-slate-300">
                            {block.relevanceComment || block.content}
                          </p>
                          {block.videoTimestamp && (
                            <div className="text-xs font-mono text-rose-300 pt-1">
                              ⏱ Segmento sugerido: {block.videoTimestamp}
                            </div>
                          )}
                        </div>
                        <a
                          href={block.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                        >
                          Abrir Reproductor Externo ({extractDomain(block.url)})
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                    <div className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <MessageSquareQuote className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300">
                          Guía de observación del instructor:
                        </strong>{' '}
                        {block.relevanceComment || block.content}
                      </div>
                    </div>
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
      })}
    </div>
  );
};

/**
 * Interactive Notion-Style Block Editor for Instructors in `OvaBuilderView`.
 * Supports block creation, `/` slash commands, reordering, inline link/video helper,
 * and instant hover preview testing.
 */
export const NotionLessonBlockEditor: React.FC<{
  lesson: Lesson;
  onUpdateLesson: (patch: Partial<Lesson>) => void;
}> = ({ lesson, onUpdateLesson }) => {
  const blocks = useMemo(() => ensureLessonBlocks(lesson), [lesson]);

  const [editorMode, setEditorMode] = useState<
    'blocks' | 'split' | 'preview' | 'markdown'
  >('blocks');

  // Slash command palette state
  const [slashMenuOpenForIdx, setSlashMenuOpenForIdx] = useState<number | null>(
    null
  );

  // Inline link/video helper modal for text blocks
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
    // Also sync first video/link to legacy mediaUrl/mediaTitle if needed
    const primaryMedia = nextBlocks.find(
      (b) => b.type === 'video' || b.type === 'link'
    );
    onUpdateLesson({
      blocks: nextBlocks,
      contentMarkdown: syncedMarkdown,
      ...(primaryMedia
        ? {
            mediaUrl: primaryMedia.url,
            mediaTitle: primaryMedia.title,
            mediaComment: primaryMedia.relevanceComment,
          }
        : {}),
    });
  };

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
        title: 'Nuevo Subtítulo o Sección Temática',
        content: '',
      };
    } else if (type === 'link') {
      newBlock = {
        id: newId,
        type: 'link',
        title: 'Documentación Técnica / Referencia Oficial',
        url: 'https://developer.mozilla.org/es/docs/Web/HTTP',
        domainOrSource: 'MDN Web Docs',
        content: 'Especificación y guía de referencia sobre el estándar.',
        relevanceComment:
          'Este enlace es fundamental porque explica los casos borde que debes contemplar en la evidencia del RAP.',
      };
    } else if (type === 'video') {
      newBlock = {
        id: newId,
        type: 'video',
        title: 'Video Demostrativo: Implementación Paso a Paso',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        domainOrSource: 'YouTube · Cápsula Técnica SENA',
        videoTimestamp: 'Min 02:30 - 08:45',
        content: 'Demostración práctica de configuración y pruebas.',
        relevanceComment:
          'Observa especialmente a partir del minuto 02:30 cómo se estructura el middleware de validación antes de persistir los datos.',
      };
    } else if (type === 'code') {
      newBlock = {
        id: newId,
        type: 'code',
        codeLanguage: 'typescript',
        title: 'src/middlewares/validateSchema.ts',
        content: `export function validatePayload(payload: Record<string, unknown>) {\n  if (!payload.fichaCode || typeof payload.fichaCode !== 'string') {\n    throw new Error('422 Unprocessable Content: código de ficha requerido');\n  }\n  return true;\n}`,
        relevanceComment:
          'Ejemplo de validación defensiva en la capa de entrada antes de invocar el servicio o repositorio SQL.',
      };
    } else if (type === 'callout') {
      newBlock = {
        id: newId,
        type: 'callout',
        calloutTone: 'tip',
        title: 'Recomendación Clave para tu Evidencia SENA',
        content:
          'Recuerda incluir capturas o pruebas automatizadas de este flujo dentro del archivo README.md de tu entrega.',
      };
    } else {
      newBlock = {
        id: newId,
        type: 'text',
        content:
          'Redacta aquí la explicación conceptual. Puedes insertar enlaces o videos inline con previsualización al pasar el cursor.',
      };
    }

    const next = [...blocks];
    const insertIdx =
      afterIndex !== undefined ? afterIndex + 1 : next.length;
    next.splice(insertIdx, 0, newBlock);
    commitBlocks(next);
    setSlashMenuOpenForIdx(null);
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
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
    if (blocks.length <= 1) return;
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

  const stats = useMemo(() => {
    return {
      text: blocks.filter((b) => b.type === 'text' || b.type === 'heading' || b.type === 'callout').length,
      links: blocks.filter((b) => b.type === 'link').length,
      videos: blocks.filter((b) => b.type === 'video').length,
      code: blocks.filter((b) => b.type === 'code').length,
    };
  }, [blocks]);

  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50/60 overflow-hidden">
      {/* Top Notion Authoring Header & Mode Switcher */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900">
              Constructor Modular de Contenido (Estilo Notion)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Combina bloques de texto, enlaces con previsualización, videos
            comentados y segmentos de código fuente. Escribe{' '}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded">
              /
            </kbd>{' '}
            en un bloque de texto o usa la barra rápida para insertar bloques.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setEditorMode('blocks')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors ${
              editorMode === 'blocks'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Editor de Bloques ({blocks.length})
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('split')}
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              editorMode === 'split'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Dividido (Editor + Hover)
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('preview')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              editorMode === 'preview'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Vista Previa Interactiva
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('markdown')}
            className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
              editorMode === 'markdown'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Quick Insert Block Toolbar (Notion Slash Bar) */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">
            + Insertar Bloque:
          </span>
          <button
            type="button"
            onClick={() => handleAddBlockAt('text')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Texto
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('heading')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-md transition-colors"
          >
            <Heading3 className="w-3.5 h-3.5 text-slate-500" />
            Subtítulo
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('link')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md transition-colors"
          >
            <Link2 className="w-3.5 h-3.5 text-indigo-600" />
            Enlace con Previsualización
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('video')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-md transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-rose-600" />
            Video con Previsualización
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('code')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            Segmento de Código Fuente
          </button>
          <button
            type="button"
            onClick={() => handleAddBlockAt('callout')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-md transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            Callout / Nota
          </button>
        </div>

        {/* Block Summary Pills */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>{stats.text} texto</span>
          <span>·</span>
          <span className="text-indigo-700 font-semibold">
            {stats.links} enlaces
          </span>
          <span>·</span>
          <span className="text-rose-700 font-semibold">
            {stats.videos} videos
          </span>
          <span>·</span>
          <span className="text-emerald-700 font-semibold">
            {stats.code} códigos
          </span>
        </div>
      </div>

      {/* Main Content Area according to selected mode */}
      {editorMode === 'markdown' ? (
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Markdown sincronizado automáticamente con tus bloques (incluye
              comentarios de enlaces, videos y bloques de código):
            </span>
          </div>
          <textarea
            rows={12}
            value={lesson.contentMarkdown}
            onChange={(e) =>
              onUpdateLesson({ contentMarkdown: e.target.value })
            }
            className="w-full px-3.5 py-2.5 text-xs font-mono leading-relaxed bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>
      ) : editorMode === 'preview' ? (
        <div className="p-5 bg-white space-y-4">
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
            <span>
              <strong>Modo Vista Previa Activo:</strong> Pasa el cursor sobre
              cualquier enlace o video para experimentar la tarjeta flotante con
              el comentario sobre su contenido o relevancia.
            </span>
          </div>
          <LessonBlocksRenderer lesson={{ ...lesson, blocks }} />
        </div>
      ) : (
        <div
          className={
            editorMode === 'split'
              ? 'grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-200'
              : ''
          }
        >
          {/* Left / Main Column: Block-by-Block Notion Composer */}
          <div className="p-4 space-y-3">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 transition-all shadow-2xs space-y-2.5"
              >
                {/* Block Top Control Bar (Type Badge + Move/Duplicate/Convert/Delete) */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      #{idx + 1}
                    </span>
                    <select
                      aria-label="Cambiar tipo de bloque"
                      value={block.type}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          type: e.target.value as LessonBlockType,
                        })
                      }
                      className={`text-xs font-bold px-2 py-0.5 rounded border focus:outline-none ${
                        block.type === 'link'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : block.type === 'video'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : block.type === 'code'
                          ? 'bg-slate-900 text-emerald-300 border-slate-800'
                          : block.type === 'callout'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : block.type === 'heading'
                          ? 'bg-slate-100 text-slate-900 border-slate-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="text">📝 Bloque de Texto / Párrafo</option>
                      <option value="heading">📌 Subtítulo de Sección</option>
                      <option value="link">
                        🔗 Enlace Web con Previsualización Hover
                      </option>
                      <option value="video">
                        🎬 Video con Previsualización Hover
                      </option>
                      <option value="code">💻 Segmento de Código Fuente</option>
                      <option value="callout">💡 Callout / Nota Destacada</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSlashMenuOpenForIdx(
                          slashMenuOpenForIdx === idx ? null : idx
                        )
                      }
                      className="px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-600 hover:bg-indigo-50 rounded border border-indigo-100"
                      title="Insertar bloque debajo (Menú /)"
                    >
                      + / Bloque
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                      title="Subir bloque"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(idx, 1)}
                      disabled={idx === blocks.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                      title="Bajar bloque"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateBlock(idx)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Duplicar bloque"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {blocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Eliminar bloque"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Block-Specific Editor Fields */}
                {block.type === 'heading' && (
                  <input
                    type="text"
                    value={block.title ?? block.content}
                    onChange={(e) =>
                      handleUpdateBlock(block.id, {
                        title: e.target.value,
                        content: e.target.value,
                      })
                    }
                    placeholder="Escribe el título de la sección..."
                    className="w-full px-3 py-1.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                )}

                {block.type === 'text' && (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={block.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.endsWith('\n/') || val === '/') {
                          setSlashMenuOpenForIdx(idx);
                        }
                        handleUpdateBlock(block.id, { content: val });
                      }}
                      placeholder="Redacta el contenido aquí... (Escribe '/' para abrir el menú de bloques o inserta enlaces/videos con comentario abajo)"
                      className="w-full px-3 py-2 text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />

                    {/* Inline Link / Video with Hover Preview Assistant */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setInlineHelperBlockId(
                              inlineHelperBlockId === block.id ? null : block.id
                            );
                            setInlineHelperKind('link');
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          <Link2 className="w-3 h-3" />+ Insertar enlace en el
                          texto con comentario hover
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineHelperBlockId(
                              inlineHelperBlockId === block.id ? null : block.id
                            );
                            setInlineHelperKind('video');
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                        >
                          <Video className="w-3 h-3" />+ Insertar video en el
                          texto con comentario hover
                        </button>
                      </div>
                    </div>

                    {inlineHelperBlockId === block.id && (
                      <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {inlineHelperKind === 'video'
                              ? '🎬 Insertar Enlace a Video con Previsualización en este Párrafo'
                              : '🔗 Insertar Enlace Web con Previsualización en este Párrafo'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setInlineHelperBlockId(null)}
                            className="text-slate-500 hover:text-slate-800"
                          >
                            Cerrar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={inlineLabel}
                            onChange={(e) => setInlineLabel(e.target.value)}
                            placeholder={
                              inlineHelperKind === 'video'
                                ? 'Texto del video (ej. Ver explicación JWT)'
                                : 'Texto del enlace (ej. RFC 9110 Sección 9)'
                            }
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                          />
                          <input
                            type="url"
                            value={inlineUrl}
                            onChange={(e) => setInlineUrl(e.target.value)}
                            placeholder="https://..."
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono"
                          />
                        </div>
                        <input
                          type="text"
                          value={inlineComment}
                          onChange={(e) => setInlineComment(e.target.value)}
                          placeholder={
                            inlineHelperKind === 'video'
                              ? 'Comentario sobre el contenido o relevancia del video (se verá al pasar el cursor)...'
                              : 'Comentario sobre el contenido o relevancia del enlace (se verá al pasar el cursor)...'
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleInsertInlineResource(block.id)}
                            className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                          >
                            Insertar en el párrafo
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If paragraph contains inline links/videos, show live hover preview bar */}
                    {/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/.test(
                      block.content
                    ) && (
                      <div className="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-xs space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Vista previa del párrafo (Pasa el cursor sobre los
                          enlaces resaltados):
                        </div>
                        <div className="text-slate-700 leading-relaxed">
                          {renderRichTextWithInlinePreviews(block.content)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'link' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Título del Enlace / Recurso Web
                        </label>
                        <input
                          type="text"
                          value={block.title ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Ej. Especificación Oficial OpenAPI 3.1.0"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Fuente / Dominio
                        </label>
                        <input
                          type="text"
                          value={block.domainOrSource ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              domainOrSource: e.target.value,
                            })
                          }
                          placeholder="Ej. swagger.io / MDN"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        URL del Enlace
                      </label>
                      <input
                        type="url"
                        value={block.url ?? ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, { url: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-indigo-700 mb-1">
                        Comentario sobre Contenido o Relevancia del Enlace (Se
                        muestra en la previsualización al pasar el cursor)
                      </label>
                      <textarea
                        rows={2}
                        value={block.relevanceComment ?? ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            relevanceComment: e.target.value,
                          })
                        }
                        placeholder="Explica al aprendiz por qué este enlace es importante, qué sección debe leer o cómo aplica a su evidencia..."
                        className="w-full px-2.5 py-1.5 text-xs bg-indigo-50/40 border border-indigo-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    {/* Live Hover Preview Test Strip right in the editor */}
                    <div className="pt-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Prueba tu previsualización (Ubica el cursor sobre la
                        tarjeta):
                      </div>
                      <HoverPreviewTrigger
                        kind="link"
                        title={
                          block.title || block.url || 'Enlace sin título'
                        }
                        url={block.url || 'https://'}
                        relevanceComment={
                          block.relevanceComment ||
                          'Agrega un comentario arriba para verlo aquí al pasar el cursor.'
                        }
                        domainOrSource={block.domainOrSource}
                        description={block.content}
                      />
                    </div>
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Título del Video Educativo
                        </label>
                        <input
                          type="text"
                          value={block.title ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Ej. Masterclass: Diseño de Índices B-Tree y EXPLAIN ANALYZE"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Minuto Clave / Duración
                        </label>
                        <input
                          type="text"
                          value={block.videoTimestamp ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              videoTimestamp: e.target.value,
                            })
                          }
                          placeholder="Ej. Min 03:20 - 11:45"
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          URL del Video (YouTube, Vimeo, Drive, MP4...)
                        </label>
                        <input
                          type="url"
                          value={block.url ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { url: e.target.value })
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Canal / Fuente
                        </label>
                        <input
                          type="text"
                          value={block.domainOrSource ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              domainOrSource: e.target.value,
                            })
                          }
                          placeholder="Ej. YouTube · SENA ADSO"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                        Comentario sobre Contenido o Relevancia del Video (Se
                        muestra en la previsualización al pasar el cursor)
                      </label>
                      <textarea
                        rows={2}
                        value={block.relevanceComment ?? ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            relevanceComment: e.target.value,
                          })
                        }
                        placeholder="Indica qué concepto demuestra el video, en qué minuto prestar atención o cómo apoya la evidencia..."
                        className="w-full px-2.5 py-1.5 text-xs bg-rose-50/40 border border-rose-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {/* Live Hover Preview Test Strip right in the editor */}
                    <div className="pt-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Prueba tu previsualización de video (Ubica el cursor
                        sobre la tarjeta):
                      </div>
                      <HoverPreviewTrigger
                        kind="video"
                        title={block.title || block.url || 'Video sin título'}
                        url={block.url || 'https://'}
                        relevanceComment={
                          block.relevanceComment ||
                          'Agrega un comentario arriba para verlo aquí al pasar el cursor.'
                        }
                        domainOrSource={block.domainOrSource}
                        videoTimestamp={block.videoTimestamp}
                        description={block.content}
                      />
                    </div>
                  </div>
                )}

                {block.type === 'code' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Lenguaje del Código Fuente
                        </label>
                        <select
                          value={block.codeLanguage ?? 'typescript'}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              codeLanguage: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          {CODE_LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Nombre del Archivo / Ruta (Opcional)
                        </label>
                        <input
                          type="text"
                          value={block.title ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Ej. src/controllers/auth.controller.ts"
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Segmento de Código Fuente
                      </label>
                      <textarea
                        rows={6}
                        value={block.content}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            content: e.target.value,
                          })
                        }
                        placeholder="// Escribe o pega el código fuente aquí..."
                        className="w-full px-3 py-2.5 text-xs font-mono leading-relaxed bg-slate-950 text-emerald-300 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Comentario / Explicación Técnica del Código
                      </label>
                      <input
                        type="text"
                        value={block.relevanceComment ?? ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            relevanceComment: e.target.value,
                          })
                        }
                        placeholder="Explica qué hace este segmento de código o qué líneas son críticas..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {block.type === 'callout' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Estilo de Callout
                        </label>
                        <select
                          value={block.calloutTone ?? 'info'}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              calloutTone: e.target.value as
                                | 'info'
                                | 'tip'
                                | 'warning',
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <option value="info">📌 Nota Conceptual (Índigo)</option>
                          <option value="tip">💡 Buena Práctica (Esmeralda)</option>
                          <option value="warning">
                            ⚠️ Advertencia / Error Común (Ámbar)
                          </option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Título del Callout
                        </label>
                        <input
                          type="text"
                          value={block.title ?? ''}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Ej. Criterio de Evaluación SENA"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={block.content}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, { content: e.target.value })
                      }
                      placeholder="Contenido destacado del callout..."
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                )}

                {/* Floating Slash Command Menu (`/`) anchored below current block */}
                {slashMenuOpenForIdx === idx && (
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl shadow-xl border border-slate-700 space-y-2 z-30">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-indigo-300">
                        Menú Rápido de Bloques (Estilo Notion /)
                      </span>
                      <button
                        type="button"
                        onClick={() => setSlashMenuOpenForIdx(null)}
                        className="text-slate-400 hover:text-white text-[11px]"
                      >
                        Cerrar (Esc)
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => handleAddBlockAt('text', idx)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                      >
                        <FileText className="w-4 h-4 text-slate-300 shrink-0" />
                        <div>
                          <div className="font-semibold">/texto · Párrafo</div>
                          <div className="text-[10px] text-slate-400">
                            Redacción con enlaces inline
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlockAt('heading', idx)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                      >
                        <Heading3 className="w-4 h-4 text-slate-300 shrink-0" />
                        <div>
                          <div className="font-semibold">
                            /titulo · Subtítulo
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Encabezado de sección
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlockAt('link', idx)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                      >
                        <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-indigo-300">
                            /enlace · Enlace con Preview
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Muestra comentario al pasar cursor
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlockAt('video', idx)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                      >
                        <Video className="w-4 h-4 text-rose-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-rose-300">
                            /video · Video con Preview
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Miniatura + relevancia en hover
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlockAt('code', idx)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                      >
                        <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-emerald-300">
                            /codigo · Código Fuente
                          </div>
                          <div className="text-[10px] text-slate-400">
                            IDE con lenguaje y botón copiar
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlockAt('callout', idx)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-amber-300">
                            /nota · Callout Pedagógico
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Caja destacada para tips o alertas
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column when in Split Mode: Real-time Interactive Learner Preview */}
          {editorMode === 'split' && (
            <div className="p-5 bg-white space-y-4">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Vista Previa en Vivo (Pasa el cursor sobre enlaces/videos)</span>
                <Eye className="w-4 h-4" />
              </div>
              <LessonBlocksRenderer lesson={{ ...lesson, blocks }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Notion-Style Block Editor adapted specifically for a GraphNode inside the
 * Knowledge Graph Canvas ("Lienzo en Grafo"), enabling instructors to author
 * text, links with hover preview comments, videos with hover preview comments,
 * and source code segments directly on the canvas.
 */
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
