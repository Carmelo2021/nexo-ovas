import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  FileCode2,
  FileDown,
  FileText,
  FolderGit2,
  HelpCircle,
  Layers,
  Plus,
  Printer,
  Trash2,
  Video,
} from 'lucide-react';
import {
  GraphNode,
  Lesson,
  LessonBlock,
  LessonMacroSectionId,
  OVA,
  QuizQuestion,
} from '../types/ova';
import {
  blocksToMarkdown,
  ensureLessonBlocks,
  NotionLessonBlockEditor,
} from './NotionLessonBlocks';

interface OvaBuilderViewProps {
  ovas: OVA[];
  nodes: GraphNode[];
  onUpdateOvas: React.Dispatch<React.SetStateAction<OVA[]>>;
  onUpdateNodes?: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  onOpenPrintGuide: (ovaId: string) => void;
  onNavigateToGraph?: () => void;
  onNavigateToBrain?: () => void;
}

export const OvaBuilderView: React.FC<OvaBuilderViewProps> = ({
  ovas,
  nodes,
  onUpdateOvas,
  onUpdateNodes,
  onOpenPrintGuide,
  onNavigateToGraph,
  onNavigateToBrain,
}) => {
  const [selectedOvaId, setSelectedOvaId] = useState<string>(ovas[0]?.id ?? '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    ovas[0]?.lessons[0]?.id ?? ''
  );
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [collapsedMacroSections, setCollapsedMacroSections] = useState<
    Record<string, boolean>
  >({});

  const DEFAULT_MACRO_ORDER: LessonMacroSectionId[] = [
    'blocks',
    'activity',
    'quiz',
  ];

  const selectedOva = ovas.find((o) => o.id === selectedOvaId) ?? ovas[0];
  const selectedLesson =
    selectedOva?.lessons.find((l) => l.id === selectedLessonId) ??
    selectedOva?.lessons[0];

  const handleSelectOva = (ova: OVA) => {
    setSelectedOvaId(ova.id);
    setSelectedLessonId(ova.lessons[0]?.id ?? '');
  };

  const handleCreateOva = () => {
    const newOvaId = `ova-${Date.now()}`;
    const firstLessonId = `les-${Date.now()}-1`;
    const newOva: OVA = {
      id: newOvaId,
      code: `OVA-SENA-${new Date().getFullYear()}-0${ovas.length + 1}`,
      title: 'Nuevo Objeto Virtual de Aprendizaje (OVA)',
      fichaCode: '2874512',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      competence: '',
      learningOutcome: '',
      status: 'published',
      description: '',
      estimatedHours: 16,
      updatedAt: '2026-11-09',
      lessons: [
        {
          id: firstLessonId,
          order: 1,
          title: 'Lección 1',
          durationMinutes: 45,
          summary: '',
          contentMarkdown: '',
          blocks: [],
          linkedNodeIds: [],
          quiz: [],
          activity: undefined,
        },
      ],
    };

    onUpdateOvas((prev) => [newOva, ...prev]);
    setSelectedOvaId(newOvaId);
    setSelectedLessonId(firstLessonId);
  };

  const handleUpdateSelectedOva = (patch: Partial<OVA>) => {
    if (!selectedOva) return;
    onUpdateOvas((prev) =>
      prev.map((o) =>
        o.id === selectedOva.id
          ? { ...o, ...patch, updatedAt: '2026-11-09' }
          : o
      )
    );
  };

  const handleAddLesson = () => {
    if (!selectedOva) return;
    const nextOrder = selectedOva.lessons.length + 1;
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      order: nextOrder,
      title: `Lección ${nextOrder}`,
      durationMinutes: 45,
      summary: '',
      contentMarkdown: '',
      blocks: [],
      linkedNodeIds: [],
      quiz: [],
      activity: undefined,
    };

    handleUpdateSelectedOva({
      lessons: [...selectedOva.lessons, newLesson],
    });
    setSelectedLessonId(newLesson.id);
  };

  const handleUpdateSelectedLesson = (patch: Partial<Lesson>) => {
    if (!selectedOva || !selectedLesson) return;
    const nextLesson: Lesson = { ...selectedLesson, ...patch };
    const updatedLessons = selectedOva.lessons.map((l) =>
      l.id === selectedLesson.id ? nextLesson : l
    );
    handleUpdateSelectedOva({ lessons: updatedLessons });

    // Bidirectional Sync: if this lesson is linked to GraphNode(s), update their blocks/content on the Canvas
    if (onUpdateNodes && nextLesson.linkedNodeIds.length > 0 && patch.blocks) {
      const lessonBlocks = patch.blocks;
      onUpdateNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (!nextLesson.linkedNodeIds.includes(node.id)) return node;
          // If the lesson is linked to a single node, sync all blocks directly;
          // otherwise sync blocks tagged with sourceNodeId === node.id
          const blocksForNode =
            nextLesson.linkedNodeIds.length === 1
              ? lessonBlocks.map((b) => ({ ...b, sourceNodeId: node.id }))
              : lessonBlocks.filter((b) => b.sourceNodeId === node.id);

          if (blocksForNode.length === 0) return node;
          const firstMedia = blocksForNode.find(
            (b) => b.type === 'video' || b.type === 'link'
          );
          const firstCode = blocksForNode.find((b) => b.type === 'code');
          return {
            ...node,
            blocks: blocksForNode,
            content: blocksToMarkdown(blocksForNode),
            ...(firstMedia
              ? {
                  mediaUrl: firstMedia.url,
                  mediaKind: firstMedia.type === 'video' ? 'video' : 'article',
                  mediaComment: firstMedia.relevanceComment,
                }
              : {}),
            ...(firstCode ? { codeLanguage: firstCode.codeLanguage } : {}),
            updatedAt: '2026-11-09',
          };
        })
      );
    }
  };

  const handlePushLessonToGraphCanvas = () => {
    if (!selectedOva || !selectedLesson || !onUpdateNodes) return;
    const currentBlocks = ensureLessonBlocks(selectedLesson);

    if (selectedLesson.linkedNodeIds.length > 0) {
      // Update the primary linked node on the canvas with all current lesson blocks
      const primaryNodeId = selectedLesson.linkedNodeIds[0];
      const taggedBlocks = currentBlocks.map((b) => ({
        ...b,
        sourceNodeId: primaryNodeId,
      }));
      onUpdateNodes((prev) =>
        prev.map((n) =>
          n.id === primaryNodeId
            ? {
                ...n,
                title: selectedLesson.title,
                blocks: taggedBlocks,
                content: blocksToMarkdown(taggedBlocks),
                linkedOvaId: selectedOva.id,
                linkedLessonId: selectedLesson.id,
                researchStatus: 'in_ova',
                updatedAt: '2026-11-09',
              }
            : n
        )
      );
      setExportMessage(
        `Bloques de "${selectedLesson.title}" sincronizados con el nodo en el Lienzo en Grafo.`
      );
    } else {
      // Create a new GraphNode on the canvas from this lesson
      const newNodeId = `node-${Date.now()}`;
      const taggedBlocks = currentBlocks.map((b) => ({
        ...b,
        sourceNodeId: newNodeId,
      }));
      const firstMedia = taggedBlocks.find(
        (b) => b.type === 'video' || b.type === 'link'
      );
      const firstCode = taggedBlocks.find((b) => b.type === 'code');
      const newNode: GraphNode = {
        id: newNodeId,
        title: selectedLesson.title,
        type: firstCode ? 'code' : firstMedia ? 'media' : 'markdown',
        researchStatus: 'in_ova',
        x: 160 + ((nodes.length * 65) % 520),
        y: 150 + ((nodes.length * 55) % 340),
        content: blocksToMarkdown(taggedBlocks),
        blocks: taggedBlocks,
        mediaUrl: firstMedia?.url,
        mediaKind: firstMedia?.type === 'video' ? 'video' : 'article',
        mediaComment: firstMedia?.relevanceComment,
        codeLanguage: firstCode?.codeLanguage,
        quizQuestions:
          selectedLesson.quiz.length > 0
            ? [...selectedLesson.quiz]
            : undefined,
        linkedOvaId: selectedOva.id,
        linkedLessonId: selectedLesson.id,
        tags: ['OVA', `Ficha ${selectedOva.fichaCode}`, 'Sincronizado'],
        updatedAt: '2026-11-09',
      };
      onUpdateNodes((prev) => [...prev, newNode]);
      handleUpdateSelectedLesson({
        linkedNodeIds: [newNodeId],
        blocks: taggedBlocks,
      });
      setExportMessage(
        `Se creó y vinculó el nodo "${selectedLesson.title}" en el Lienzo en Grafo.`
      );
    }
    setTimeout(() => setExportMessage(null), 4000);
  };

  const handleMoveLesson = (index: number, direction: -1 | 1) => {
    if (!selectedOva) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedOva.lessons.length) return;
    const copy = [...selectedOva.lessons];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    const reordered = copy.map((l, idx) => ({ ...l, order: idx + 1 }));
    handleUpdateSelectedOva({ lessons: reordered });
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!selectedOva || selectedOva.lessons.length <= 1) return;
    const remaining = selectedOva.lessons
      .filter((l) => l.id !== lessonId)
      .map((l, idx) => ({ ...l, order: idx + 1 }));
    handleUpdateSelectedOva({ lessons: remaining });
    if (selectedLessonId === lessonId) {
      setSelectedLessonId(remaining[0]?.id ?? '');
    }
  };

  const handleAddQuizQuestion = () => {
    if (!selectedLesson) return;
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Nueva pregunta de autoevaluación para el aprendiz',
      options: [
        'Opción correcta del concepto estudiado',
        'Opción incorrecta A',
        'Opción incorrecta B',
      ],
      correctIndex: 0,
      explanation: 'Retroalimentación inmediata al responder.',
    };
    handleUpdateSelectedLesson({
      quiz: [...selectedLesson.quiz, newQ],
    });
  };

  const handleExportLmsHtmlPackage = () => {
    if (!selectedOva) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${selectedOva.title} — Paquete LMS SENA (Ficha ${selectedOva.fichaCode})</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #f8fafc; margin: 0; padding: 32px; line-height: 1.6; }
    .container { max-width: 920px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px; }
    .meta { font-size: 13px; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
    .lesson { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px; }
    .activity { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-top: 16px; }
    h1, h2, h3 { color: #0f172a; }
    pre { background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="container">
    <div class="meta">
      <strong>SENA · Objeto Virtual de Aprendizaje (OVA)</strong> · Código: ${selectedOva.code} · Ficha: ${selectedOva.fichaCode}<br/>
      Programa: ${selectedOva.programName}<br/>
      Competencia: ${selectedOva.competence}<br/>
      Resultado de Aprendizaje: ${selectedOva.learningOutcome}
    </div>
    <h1>${selectedOva.title}</h1>
    <p>${selectedOva.description}</p>
    ${selectedOva.lessons
      .map(
        (l) => `
      <div class="lesson">
        <h2>Lección ${l.order}: ${l.title} (${l.durationMinutes} min)</h2>
        <p><em>${l.summary}</em></p>
        <div>${l.contentMarkdown.replace(/\n/g, '<br/>')}</div>
        ${
          l.activity
            ? `<div class="activity">
                <strong>Evidencia Requerida (${l.activity.evidenceType}): ${l.activity.evidenceCode} — ${l.activity.title}</strong>
                <p>${l.activity.instructions}</p>
                <small>Fecha límite: ${l.activity.dueDate} · Entregable: ${l.activity.deliverableFormat}</small>
               </div>`
            : ''
        }
      </div>`
      )
      .join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedOva.code}_Ficha_${selectedOva.fichaCode}_LMS.html`;
    a.click();
    URL.revokeObjectURL(url);

    setExportMessage(
      `Paquete autónomo HTML para LMS (${selectedOva.code}) descargado correctamente.`
    );
    setTimeout(() => setExportMessage(null), 4000);
  };

  const handleExportMarkdownObsidian = () => {
    if (!selectedOva) return;
    const md = `---
codigo_ova: "${selectedOva.code}"
ficha_sena: "${selectedOva.fichaCode}"
programa: "${selectedOva.programName}"
competencia: "${selectedOva.competence}"
rap: "${selectedOva.learningOutcome}"
horas_estimadas: ${selectedOva.estimatedHours}
---

# ${selectedOva.title}

${selectedOva.description}

${selectedOva.lessons
  .map(
    (l) => `## Lección ${l.order}: ${l.title} (${l.durationMinutes} min)
> ${l.summary}

${l.contentMarkdown}

${
  l.activity
    ? `### Evidencia SENA: ${l.activity.evidenceCode} — ${l.activity.title}
- **Tipo**: ${l.activity.evidenceType}
- **Fecha límite**: ${l.activity.dueDate}
- **Instrucciones**: ${l.activity.instructions}
`
    : ''
}
`
  )
  .join('\n---\n\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedOva.code}_Obsidian.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExportMessage(
      `Archivo Markdown compatible con Obsidian (${selectedOva.code}_Obsidian.md) descargado.`
    );
    setTimeout(() => setExportMessage(null), 4000);
  };

  if (!selectedOva) return null;

  return (
    <div className="space-y-6">
      {/* Top Action & Export Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
            <span>Estudio de Autoría de OVAs</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{ovas.length} OVAs activos</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Organización de Lecciones, Evidencias RAP y Exportación LMS
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToBrain && (
            <button
              type="button"
              onClick={onNavigateToBrain}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-cyan-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Abrir en Brain Karpathy 2.5D/3D
            </button>
          )}

          <button
            type="button"
            onClick={handleCreateOva}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nuevo OVA
          </button>

          <button
            type="button"
            onClick={handleExportMarkdownObsidian}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <FileCode2 className="w-4 h-4 text-slate-500" />
            Exportar Markdown (Obsidian)
          </button>

          <button
            type="button"
            onClick={handleExportLmsHtmlPackage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Paquete HTML para LMS (Zajuna)
          </button>

          <button
            type="button"
            onClick={() => onOpenPrintGuide(selectedOva.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <FileDown className="w-4 h-4" />
            Generar Guía de Estudio PDF
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Main 12-Column Authoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): OVA Selector & Lesson Sequence */}
        <div className="lg:col-span-4 space-y-5">
          {/* Catalog of OVAs */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              1. Seleccionar OVA del Instructor
            </h3>
            <div className="space-y-2">
              {ovas.map((ova) => {
                const isSelected = ova.id === selectedOva.id;
                return (
                  <button
                    key={ova.id}
                    type="button"
                    onClick={() => handleSelectOva(ova)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-medium text-indigo-700">
                        Ficha {ova.fichaCode}
                      </span>
                      <span>
                        {ova.lessons.length} lecciones · {ova.estimatedHours} h
                      </span>
                    </div>
                    <div className="text-sm font-semibold leading-snug">
                      {ova.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {ova.code} ·{' '}
                      {ova.status === 'published'
                        ? 'Publicado en Vista Aprendiz'
                        : 'Borrador interno'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lessons Sequence Organizer */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                2. Secuencia de Lecciones ({selectedOva.lessons.length})
              </h3>
              <button
                type="button"
                onClick={handleAddLesson}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Lección
              </button>
            </div>

            <div className="space-y-2">
              {selectedOva.lessons.map((lesson, idx) => {
                const isCurrent = selectedLesson?.id === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <span
                        className={`font-mono ${
                          isCurrent ? 'text-indigo-300' : 'text-slate-500'
                        }`}
                      >
                        Lección 0{lesson.order} · {lesson.durationMinutes} min
                      </span>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const updated = selectedOva.lessons.map((l) =>
                              l.id === lesson.id
                                ? {
                                    ...l,
                                    hiddenFromPublic: !l.hiddenFromPublic,
                                  }
                                : l
                            );
                            handleUpdateSelectedOva({ lessons: updated });
                          }}
                          className={`p-1 rounded transition-colors ${
                            lesson.hiddenFromPublic
                              ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                              : 'hover:bg-slate-700/30 opacity-80 hover:opacity-100'
                          }`}
                          title={
                            lesson.hiddenFromPublic
                              ? 'Lección oculta al público (clic para hacer pública)'
                              : 'Lección visible al público (clic para ocultar al público)'
                          }
                        >
                          {lesson.hiddenFromPublic ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLesson(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-700/30 disabled:opacity-30"
                          title="Subir lección"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLesson(idx, 1)}
                          disabled={idx === selectedOva.lessons.length - 1}
                          className="p-1 rounded hover:bg-slate-700/30 disabled:opacity-30"
                          title="Bajar lección"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {selectedOva.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1 rounded hover:text-red-400"
                            title="Eliminar lección"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold leading-snug">
                        {lesson.title}
                      </div>
                      {lesson.hiddenFromPublic && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded shrink-0">
                          Oculta al Público
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-[11px] mt-1.5 flex items-center gap-1.5 ${
                        isCurrent ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      <span>{lesson.quiz.length} preguntas</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {lesson.activity
                          ? `Evidencia: ${lesson.activity.dueDate}`
                          : 'Sin evidencia asignada'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): SENA Curriculum Metadata & Active Lesson Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* OVA SENA In-Place Header & Collapsible Curricular Metadata */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                  {selectedOva.code}
                </span>
                <span className="text-[11px] text-slate-400">
                  Edición directa en el mismo lugar · Haz clic en cualquier título o texto para editar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600">
                  Visibilidad:
                </label>
                <select
                  value={selectedOva.status}
                  onChange={(e) =>
                    handleUpdateSelectedOva({
                      status: e.target.value as 'published' | 'draft',
                    })
                  }
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="published">Publicado (Visible a Aprendices)</option>
                  <option value="draft">Borrador (Solo Instructor)</option>
                </select>
              </div>
            </div>

            {/* In-place OVA Title & Description */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={selectedOva.title}
                onChange={(e) =>
                  handleUpdateSelectedOva({ title: e.target.value })
                }
                placeholder="Título del Objeto Virtual de Aprendizaje..."
                className="w-full text-xl font-extrabold text-slate-900 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-slate-50/50 rounded-lg px-2 py-1 -mx-2 focus:outline-none transition-colors"
              />
              <textarea
                rows={2}
                value={selectedOva.description}
                onChange={(e) =>
                  handleUpdateSelectedOva({ description: e.target.value })
                }
                placeholder="Descripción ejecutiva de la OVA..."
                className="w-full text-xs text-slate-600 leading-relaxed bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-slate-50/50 rounded-lg px-2 py-1 -mx-2 focus:outline-none resize-y transition-colors"
              />
            </div>

            <details className="group pt-2 border-t border-slate-100">
              <summary className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-indigo-600 select-none flex items-center justify-between">
                <span>
                  Ficha Técnica Curricular SENA (Ficha {selectedOva.fichaCode} · {selectedOva.programName})
                </span>
                <span className="text-[11px] font-normal text-slate-400 group-open:hidden">
                  Mostrar metadatos curriculares ▾
                </span>
                <span className="text-[11px] font-normal text-slate-400 hidden group-open:inline">
                  Ocultar metadatos ▴
                </span>
              </summary>
              <div className="pt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ficha de Caracterización SENA
                    </label>
                    <input
                      type="text"
                      value={selectedOva.fichaCode}
                      onChange={(e) =>
                        handleUpdateSelectedOva({ fichaCode: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Programa de Formación
                    </label>
                    <input
                      type="text"
                      value={selectedOva.programName}
                      onChange={(e) =>
                        handleUpdateSelectedOva({ programName: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Competencia Asociada
                    </label>
                    <input
                      type="text"
                      value={selectedOva.competence}
                      onChange={(e) =>
                        handleUpdateSelectedOva({ competence: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Resultado de Aprendizaje (RAP)
                    </label>
                    <input
                      type="text"
                      value={selectedOva.learningOutcome}
                      onChange={(e) =>
                        handleUpdateSelectedOva({ learningOutcome: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Active Lesson Content, Quiz & Activity Editor */}
          {selectedLesson && (() => {
            const orderedMacroSections: LessonMacroSectionId[] = (
              selectedLesson.sectionOrder &&
              selectedLesson.sectionOrder.length > 0
                ? selectedLesson.sectionOrder
                : DEFAULT_MACRO_ORDER
            ).filter((secId) => secId !== 'linked_nodes');

            const hiddenMacroSet = new Set<LessonMacroSectionId>(
              selectedLesson.hiddenSections ?? []
            );

            const handleMoveMacroSection = (
              secId: LessonMacroSectionId,
              direction: -1 | 1
            ) => {
              const currOrder = [...orderedMacroSections];
              const idx = currOrder.indexOf(secId);
              if (idx === -1) return;
              const targetIdx = idx + direction;
              if (targetIdx < 0 || targetIdx >= currOrder.length) return;
              const [moved] = currOrder.splice(idx, 1);
              currOrder.splice(targetIdx, 0, moved);
              handleUpdateSelectedLesson({ sectionOrder: currOrder });
            };

            const handleToggleMacroSectionPublic = (
              secId: LessonMacroSectionId
            ) => {
              const nextSet = new Set(hiddenMacroSet);
              if (nextSet.has(secId)) {
                nextSet.delete(secId);
              } else {
                nextSet.add(secId);
              }
              handleUpdateSelectedLesson({
                hiddenSections: Array.from(nextSet),
              });
            };

            const toggleMacroCollapsed = (secId: LessonMacroSectionId) => {
              const key = `${selectedLesson.id}-${secId}`;
              setCollapsedMacroSections((prev) => ({
                ...prev,
                [key]: !prev[key],
              }));
            };

            const isMacroCollapsed = (secId: LessonMacroSectionId) =>
              Boolean(collapsedMacroSections[`${selectedLesson.id}-${secId}`]);

            const MACRO_LABELS: Record<
              LessonMacroSectionId,
              { title: string; badge: string }
            > = {
              blocks: {
                title: 'Secciones y Bloques de Estudio',
                badge: `${ensureLessonBlocks(selectedLesson).length} bloques`,
              },
              linked_nodes: {
                title: 'Nodos Vinculados',
                badge: '',
              },
              activity: {
                title: 'Actividad Evaluable / Evidencia SENA',
                badge: selectedLesson.activity ? 'Configurada' : 'Opcional',
              },
              quiz: {
                title: 'Cuestionario Interactivo de Autoevaluación',
                badge: `${selectedLesson.quiz.length} preguntas`,
              },
            };

            const renderMacroSectionHeader = (
              secId: LessonMacroSectionId,
              secIdx: number
            ) => {
              const meta = MACRO_LABELS[secId];
              const isHidden = hiddenMacroSet.has(secId);
              const isCollapsed = isMacroCollapsed(secId);
              return (
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-t-xl border-b transition-colors ${
                    isHidden
                      ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                      : 'bg-slate-100/90 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-900 text-white rounded">
                      Sección #{secIdx + 1}
                    </span>
                    <span className="text-xs font-bold truncate">
                      {meta.title}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 text-slate-600 rounded">
                      {meta.badge}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleMacroSectionPublic(secId)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                        isHidden
                          ? 'bg-amber-200/90 border-amber-400 text-amber-950'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title="Ocultar o mostrar esta sección completa en la vista pública de aprendices"
                    >
                      {isHidden ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Oculta al Público</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible al Público</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={secIdx === 0}
                      onClick={() => handleMoveMacroSection(secId, -1)}
                      className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
                      title="Desplazar esta sección hacia arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={secIdx === orderedMacroSections.length - 1}
                      onClick={() => handleMoveMacroSection(secId, 1)}
                      className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
                      title="Desplazar esta sección hacia abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleMacroCollapsed(secId)}
                      className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50"
                      title={
                        isCollapsed
                          ? 'Expandir sección en el editor'
                          : 'Contraer sección en el editor'
                      }
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
                {/* Unified In-Place Lesson Header (Title, Summary, Duration & Public Visibility) */}
                <div className="border-b border-slate-200 pb-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
                        Lección 0{selectedLesson.order} · Editor Modular de Contenidos
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSelectedLesson({
                            hiddenFromPublic: !selectedLesson.hiddenFromPublic,
                          })
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                          selectedLesson.hiddenFromPublic
                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title="Controla si esta lección completa es visible o está oculta en la vista pública de aprendices"
                      >
                        {selectedLesson.hiddenFromPublic ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Lección Oculta al Público</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Lección Pública</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">
                        Duración (min):
                      </label>
                      <input
                        type="number"
                        value={selectedLesson.durationMinutes}
                        onChange={(e) =>
                          handleUpdateSelectedLesson({
                            durationMinutes: Math.max(
                              10,
                              Number(e.target.value)
                            ),
                          })
                        }
                        className="w-20 px-2.5 py-1 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={selectedLesson.title}
                    onChange={(e) =>
                      handleUpdateSelectedLesson({ title: e.target.value })
                    }
                    placeholder="Escribe aquí el título de la lección..."
                    className="w-full text-lg font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-slate-50/60 rounded-lg px-2 py-1 -mx-2 focus:outline-none transition-colors"
                  />

                  <input
                    type="text"
                    value={selectedLesson.summary}
                    onChange={(e) =>
                      handleUpdateSelectedLesson({ summary: e.target.value })
                    }
                    placeholder="Escribe aquí el resumen u objetivo pedagógico de la lección..."
                    className="w-full text-xs text-slate-600 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-slate-50/60 rounded-lg px-2 py-1 -mx-2 focus:outline-none transition-colors"
                  />
                </div>

                {/* QUICK ADD & MACRO-SECTIONS BAR */}
                <div className="p-3.5 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>
                        Disposición de Secciones de la Lección (Desplazar ↑/↓ y
                        Visibilidad Pública)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Desplaza cualquier sección hacia arriba o abajo, agrega
                      nuevas secciones de contenido u ocúltalas de la vista al
                      público.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const stamp = Date.now();
                        const currentBlocks = ensureLessonBlocks(selectedLesson);
                        const nextBlocks: LessonBlock[] = [
                          ...currentBlocks,
                          {
                            id: `blk-sec-h-${stamp}`,
                            type: 'heading',
                            title: 'Nueva Sección de Estudio',
                            content: 'Nueva Sección de Estudio',
                          },
                          {
                            id: `blk-sec-t-${stamp}`,
                            type: 'text',
                            content:
                              'Desarrolla aquí el contenido de esta nueva sección.',
                          },
                        ];
                        handleUpdateSelectedLesson({
                          blocks: nextBlocks,
                          contentMarkdown: blocksToMarkdown(nextBlocks),
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nueva Sección</span>
                    </button>

                    {!selectedLesson.activity && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSelectedLesson({
                            activity: {
                              id: `act-${Date.now()}`,
                              title: 'Nueva Evidencia Evaluable',
                              evidenceCode: 'GA1-220501096-AA1-EV01',
                              evidenceType: 'Producto',
                              instructions:
                                'Describe las instrucciones de entrega...',
                              dueDate: '2026-11-30',
                              deliverableFormat: 'Repositorio GitHub / PDF',
                            },
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Sección Evidencia</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleAddQuizQuestion}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Pregunta Quiz</span>
                    </button>
                  </div>
                </div>

                {/* DYNAMICALLY ORDERED MACRO-SECTIONS OF THE LESSON */}
                <div className="space-y-5">
                  {orderedMacroSections.map((secId, secIdx) => {
                    const isHidden = hiddenMacroSet.has(secId);
                    const isCollapsed = isMacroCollapsed(secId);

                    if (secId === 'blocks') {
                      return (
                        <div
                          key={secId}
                          className={`rounded-xl border transition-all ${
                            isHidden
                              ? 'border-dashed border-amber-400 bg-amber-50/20'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          {renderMacroSectionHeader(secId, secIdx)}
                          {!isCollapsed && (
                            <div className="p-3">
                              <NotionLessonBlockEditor
                                lesson={selectedLesson}
                                onUpdateLesson={handleUpdateSelectedLesson}
                              />
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (secId === 'activity') {
                      return (
                        <div
                          key={secId}
                          className={`rounded-xl border transition-all ${
                            isHidden
                              ? 'border-dashed border-amber-400 bg-amber-50/20'
                              : 'border-slate-200 bg-slate-50/60'
                          }`}
                        >
                          {renderMacroSectionHeader(secId, secIdx)}
                          {!isCollapsed && (
                            <div className="p-4 space-y-3">
                              {!selectedLesson.activity ? (
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                  <span>
                                    Esta sección de actividad/evidencia aún no
                                    tiene datos configurados.
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateSelectedLesson({
                                        activity: {
                                          id: `act-${Date.now()}`,
                                          title: '',
                                          evidenceCode: '',
                                          evidenceType: 'Producto',
                                          instructions: '',
                                          dueDate: '2026-11-15',
                                          deliverableFormat: '',
                                        },
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    Configurar Actividad / Evidencia
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                      Parámetros del Entregable SENA
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateSelectedLesson({
                                          activity: undefined,
                                        })
                                      }
                                      className="text-xs text-red-600 hover:underline"
                                    >
                                      Quitar evidencia
                                    </button>
                                  </div>

                                  <div className="space-y-3 pt-2 border-t border-slate-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                          Código Evidencia SENA
                                        </label>
                                        <input
                                          type="text"
                                          value={
                                            selectedLesson.activity.evidenceCode
                                          }
                                          onChange={(e) =>
                                            handleUpdateSelectedLesson({
                                              activity: {
                                                ...selectedLesson.activity!,
                                                evidenceCode: e.target.value,
                                              },
                                            })
                                          }
                                          placeholder="Ej. GA1-220501096-AA1-EV01"
                                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                          Tipo de Evidencia
                                        </label>
                                        <select
                                          value={
                                            selectedLesson.activity.evidenceType
                                          }
                                          onChange={(e) =>
                                            handleUpdateSelectedLesson({
                                              activity: {
                                                ...selectedLesson.activity!,
                                                evidenceType: e.target.value as
                                                  | 'Conocimiento'
                                                  | 'Desempeño'
                                                  | 'Producto',
                                              },
                                            })
                                          }
                                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        >
                                          <option value="Conocimiento">
                                            Conocimiento
                                          </option>
                                          <option value="Desempeño">
                                            Desempeño
                                          </option>
                                          <option value="Producto">
                                            Producto
                                          </option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                          Fecha Límite de Envío
                                        </label>
                                        <input
                                          type="date"
                                          value={selectedLesson.activity.dueDate}
                                          onChange={(e) =>
                                            handleUpdateSelectedLesson({
                                              activity: {
                                                ...selectedLesson.activity!,
                                                dueDate: e.target.value,
                                              },
                                            })
                                          }
                                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Título de la Evidencia
                                      </label>
                                      <input
                                        type="text"
                                        value={selectedLesson.activity.title}
                                        onChange={(e) =>
                                          handleUpdateSelectedLesson({
                                            activity: {
                                              ...selectedLesson.activity!,
                                              title: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder="Título de la actividad o entregable..."
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Instrucciones Detalladas de Entrega
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={
                                          selectedLesson.activity.instructions
                                        }
                                        onChange={(e) =>
                                          handleUpdateSelectedLesson({
                                            activity: {
                                              ...selectedLesson.activity!,
                                              instructions: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder="Describe los criterios de entrega..."
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (secId === 'quiz') {
                      return (
                        <div
                          key={secId}
                          className={`rounded-xl border transition-all ${
                            isHidden
                              ? 'border-dashed border-amber-400 bg-amber-50/20'
                              : 'border-slate-200 bg-slate-50/60'
                          }`}
                        >
                          {renderMacroSectionHeader(secId, secIdx)}
                          {!isCollapsed && (
                            <div className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">
                                  Preguntas de selección múltiple para
                                  autoevaluación del aprendiz
                                </span>
                                <button
                                  type="button"
                                  onClick={handleAddQuizQuestion}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Añadir
                                  Pregunta
                                </button>
                              </div>

                              {selectedLesson.quiz.map((q, qIdx) => (
                                <div
                                  key={q.id}
                                  className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      value={q.question}
                                      onChange={(e) => {
                                        const updatedQuiz =
                                          selectedLesson.quiz.map((item, idx) =>
                                            idx === qIdx
                                              ? {
                                                  ...item,
                                                  question: e.target.value,
                                                }
                                              : item
                                          );
                                        handleUpdateSelectedLesson({
                                          quiz: updatedQuiz,
                                        });
                                      }}
                                      className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateSelectedLesson({
                                          quiz: selectedLesson.quiz.filter(
                                            (_, idx) => idx !== qIdx
                                          ),
                                        })
                                      }
                                      className="text-slate-400 hover:text-red-600 p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {q.options.map((opt, optIdx) => (
                                      <div
                                        key={optIdx}
                                        className="flex items-center gap-1.5"
                                      >
                                        <input
                                          type="radio"
                                          name={`correct-${q.id}`}
                                          checked={q.correctIndex === optIdx}
                                          onChange={() => {
                                            const updatedQuiz =
                                              selectedLesson.quiz.map(
                                                (item, idx) =>
                                                  idx === qIdx
                                                    ? {
                                                        ...item,
                                                        correctIndex: optIdx,
                                                      }
                                                    : item
                                              );
                                            handleUpdateSelectedLesson({
                                              quiz: updatedQuiz,
                                            });
                                          }}
                                        />
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const newOpts = [...q.options];
                                            newOpts[optIdx] = e.target.value;
                                            const updatedQuiz =
                                              selectedLesson.quiz.map(
                                                (item, idx) =>
                                                  idx === qIdx
                                                    ? {
                                                        ...item,
                                                        options: newOpts,
                                                      }
                                                    : item
                                              );
                                            handleUpdateSelectedLesson({
                                              quiz: updatedQuiz,
                                            });
                                          }}
                                          className="flex-1 px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
