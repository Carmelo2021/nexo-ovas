import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
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
import { GraphNode, Lesson, OVA, QuizQuestion } from '../types/ova';

interface OvaBuilderViewProps {
  ovas: OVA[];
  nodes: GraphNode[];
  onUpdateOvas: React.Dispatch<React.SetStateAction<OVA[]>>;
  onOpenPrintGuide: (ovaId: string) => void;
}

export const OvaBuilderView: React.FC<OvaBuilderViewProps> = ({
  ovas,
  nodes,
  onUpdateOvas,
  onOpenPrintGuide,
}) => {
  const [selectedOvaId, setSelectedOvaId] = useState<string>(ovas[0]?.id ?? '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    ovas[0]?.lessons[0]?.id ?? ''
  );
  const [exportMessage, setExportMessage] = useState<string | null>(null);

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
      competence:
        '220501096 · Desarrollar la solución de software de acuerdo con el diseño',
      learningOutcome:
        'RAP 01 · Implementar componentes técnicos según requerimientos del proyecto formativo',
      status: 'published',
      description:
        'Descripción pedagógica del Objeto Virtual de Aprendizaje construido progresivamente desde el lienzo de investigación.',
      estimatedHours: 16,
      updatedAt: '2026-11-09',
      lessons: [
        {
          id: firstLessonId,
          order: 1,
          title: 'Lección 1: Introducción Conceptual y Fundamentos',
          durationMinutes: 45,
          summary: 'Síntesis de los conceptos esenciales de esta unidad formativa.',
          contentMarkdown:
            '### 1. Contextualización\nDesarrolla aquí el contenido de estudio para tus aprendices.\n\n### 2. Ejemplo Aplicado\nExplica paso a paso cómo aplicar el concepto en el proyecto formativo.',
          linkedNodeIds: [],
          quiz: [
            {
              id: `q-${Date.now()}`,
              question: 'Pregunta de verificación de lectura de la lección 1:',
              options: [
                'Respuesta correcta fundamentada en la guía',
                'Distractor conceptual A',
                'Distractor conceptual B',
              ],
              correctIndex: 0,
              explanation: 'Explicación pedagógica de la respuesta correcta.',
            },
          ],
          activity: {
            id: `act-${Date.now()}`,
            title: 'Evidencia de Aprendizaje: Ejercicio Práctico Unidad 1',
            evidenceCode: 'GA1-220501096-AA1-EV01',
            evidenceType: 'Producto',
            instructions:
              'Realiza la entrega del artefacto solicitado siguiendo los criterios de evaluación de la guía.',
            dueDate: '2026-11-16',
            deliverableFormat: 'Enlace a repositorio o documento PDF',
          },
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
      title: `Lección ${nextOrder}: Nuevo Tema de Estudio`,
      durationMinutes: 45,
      summary: 'Resumen de los objetivos de aprendizaje de esta lección.',
      contentMarkdown:
        '### Desarrollo Temático\nRedacta aquí los conceptos clave, ejemplos y guías paso a paso para el aprendiz.',
      linkedNodeIds: [],
      quiz: [],
    };

    handleUpdateSelectedOva({
      lessons: [...selectedOva.lessons, newLesson],
    });
    setSelectedLessonId(newLesson.id);
  };

  const handleUpdateSelectedLesson = (patch: Partial<Lesson>) => {
    if (!selectedOva || !selectedLesson) return;
    const updatedLessons = selectedOva.lessons.map((l) =>
      l.id === selectedLesson.id ? { ...l, ...patch } : l
    );
    handleUpdateSelectedOva({ lessons: updatedLessons });
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
            <Printer className="w-4 h-4" />
            Guía de Estudio PDF / Imprimir
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

                    <div className="text-xs font-semibold leading-snug">
                      {lesson.title}
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
          {/* OVA SENA Identification Header Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Ficha Técnica Curricular del OVA (Estructura SENA)
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600">
                  Visibilidad en Portal de Aprendices:
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Objeto Virtual de Aprendizaje
                </label>
                <input
                  type="text"
                  value={selectedOva.title}
                  onChange={(e) =>
                    handleUpdateSelectedOva({ title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ficha de Caracterización SENA
                </label>
                <input
                  type="text"
                  value={selectedOva.fichaCode}
                  onChange={(e) =>
                    handleUpdateSelectedOva({ fichaCode: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Programa de Formación
                </label>
                <input
                  type="text"
                  value={selectedOva.programName}
                  onChange={(e) =>
                    handleUpdateSelectedOva({ programName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Competencia Asociada
                </label>
                <input
                  type="text"
                  value={selectedOva.competence}
                  onChange={(e) =>
                    handleUpdateSelectedOva({ competence: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resultado de Aprendizaje (RAP)
              </label>
              <input
                type="text"
                value={selectedOva.learningOutcome}
                onChange={(e) =>
                  handleUpdateSelectedOva({ learningOutcome: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Active Lesson Content, Linked Graph Nodes, Quiz & Activity Editor */}
          {selectedLesson && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-indigo-600">
                    Editando Lección 0{selectedLesson.order}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedLesson.title}
                  </h3>
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
                        durationMinutes: Math.max(10, Number(e.target.value)),
                      })
                    }
                    className="w-20 px-2.5 py-1 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título de la Lección
                  </label>
                  <input
                    type="text"
                    value={selectedLesson.title}
                    onChange={(e) =>
                      handleUpdateSelectedLesson({ title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resumen / Objetivo de la Lección
                  </label>
                  <input
                    type="text"
                    value={selectedLesson.summary}
                    onChange={(e) =>
                      handleUpdateSelectedLesson({ summary: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Linked Nodes from Obsidian Canvas */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Nodos del Mapa Mental Vinculados a esta Lección (
                    {selectedLesson.linkedNodeIds.length})
                  </span>
                  <span className="text-slate-500">
                    Sincronizado con el Lienzo en Grafo
                  </span>
                </div>
                {selectedLesson.linkedNodeIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                    {selectedLesson.linkedNodeIds.map((nodeId) => {
                      const n = nodes.find((item) => item.id === nodeId);
                      return (
                        <div
                          key={nodeId}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs flex items-center gap-2"
                        >
                          <span className="font-medium">
                            {n?.title ?? nodeId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Aún no hay nodos vinculados. Puedes enviar cualquier nodo
                    desde la vista &ldquo;Lienzo en Grafo&rdquo; hacia esta
                    lección.
                  </p>
                )}
              </div>

              {/* Markdown Study Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Material de Estudio (Markdown Estructurado)
                </label>
                <textarea
                  rows={8}
                  value={selectedLesson.contentMarkdown}
                  onChange={(e) =>
                    handleUpdateSelectedLesson({
                      contentMarkdown: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-mono leading-relaxed bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Multimedia Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título del Recurso Multimedia / Video
                  </label>
                  <input
                    type="text"
                    value={selectedLesson.mediaTitle ?? ''}
                    onChange={(e) =>
                      handleUpdateSelectedLesson({ mediaTitle: e.target.value })
                    }
                    placeholder="Ej. Video Tutorial / Documentación Oficial"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL del Recurso o Video
                  </label>
                  <input
                    type="url"
                    value={selectedLesson.mediaUrl ?? ''}
                    onChange={(e) =>
                      handleUpdateSelectedLesson({ mediaUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* SENA Activity / Evidence & Reminder Deadline Configurator */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Actividad Evaluable y Fecha Límite para Alertas de Envío
                    </h4>
                    <p className="text-xs text-slate-500">
                      Configura la evidencia que alimenta los recordatorios
                      automáticos y la matriz de aprendices.
                    </p>
                  </div>
                  {!selectedLesson.activity ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateSelectedLesson({
                          activity: {
                            id: `act-${Date.now()}`,
                            title: 'Nueva Evidencia de Aprendizaje',
                            evidenceCode: 'GA1-220501096-AA1-EV01',
                            evidenceType: 'Producto',
                            instructions:
                              'Describe los criterios de entrega para el aprendiz.',
                            dueDate: '2026-11-15',
                            deliverableFormat: 'Repositorio Git o documento PDF',
                          },
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                    >
                      + Asignar Evidencia a esta Lección
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateSelectedLesson({ activity: undefined })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Quitar evidencia
                    </button>
                  )}
                </div>

                {selectedLesson.activity && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Código Evidencia SENA
                        </label>
                        <input
                          type="text"
                          value={selectedLesson.activity.evidenceCode}
                          onChange={(e) =>
                            handleUpdateSelectedLesson({
                              activity: {
                                ...selectedLesson.activity!,
                                evidenceCode: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tipo de Evidencia
                        </label>
                        <select
                          value={selectedLesson.activity.evidenceType}
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
                          <option value="Conocimiento">Conocimiento</option>
                          <option value="Desempeño">Desempeño</option>
                          <option value="Producto">Producto</option>
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
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Instrucciones Detalladas de Entrega
                      </label>
                      <textarea
                        rows={2}
                        value={selectedLesson.activity.instructions}
                        onChange={(e) =>
                          handleUpdateSelectedLesson({
                            activity: {
                              ...selectedLesson.activity!,
                              instructions: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Self-Assessment Quiz Questions Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    Cuestionario de Autoevaluación de la Lección (
                    {selectedLesson.quiz.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuizQuestion}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Pregunta
                  </button>
                </div>

                {selectedLesson.quiz.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const updatedQuiz = selectedLesson.quiz.map(
                            (item, idx) =>
                              idx === qIdx
                                ? { ...item, question: e.target.value }
                                : item
                          );
                          handleUpdateSelectedLesson({ quiz: updatedQuiz });
                        }}
                        className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded"
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
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => {
                              const updatedQuiz = selectedLesson.quiz.map(
                                (item, idx) =>
                                  idx === qIdx
                                    ? { ...item, correctIndex: optIdx }
                                    : item
                              );
                              handleUpdateSelectedLesson({ quiz: updatedQuiz });
                            }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...q.options];
                              newOpts[optIdx] = e.target.value;
                              const updatedQuiz = selectedLesson.quiz.map(
                                (item, idx) =>
                                  idx === qIdx
                                    ? { ...item, options: newOpts }
                                    : item
                              );
                              handleUpdateSelectedLesson({ quiz: updatedQuiz });
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
