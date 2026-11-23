import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Printer,
  X,
} from 'lucide-react';
import { GraphEdge, GraphNode, InstructorCredentials, OVA } from '../types/ova';
import { LessonBlocksRenderer } from './NotionLessonBlocks';

interface PrintableStudyGuideModalProps {
  ova: OVA;
  ovas: OVA[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  instructor: InstructorCredentials;
  isInstructorSession: boolean;
  onSelectOva: (ovaId: string) => void;
  onClose: () => void;
}

export const PrintableStudyGuideModal: React.FC<
  PrintableStudyGuideModalProps
> = ({
  ova,
  ovas,
  nodes,
  edges,
  instructor,
  isInstructorSession,
  onSelectOva,
  onClose,
}) => {
  const [includeQuizAnswers, setIncludeQuizAnswers] =
    useState<boolean>(isInstructorSession);
  const [includeConceptMap, setIncludeConceptMap] = useState<boolean>(true);

  const ovaLinkedNodeIds = new Set<string>();
  ova.lessons.forEach((l) =>
    l.linkedNodeIds.forEach((id) => ovaLinkedNodeIds.add(id))
  );
  nodes
    .filter((n) => n.linkedOvaId === ova.id)
    .forEach((n) => ovaLinkedNodeIds.add(n.id));

  const linkedNodes = nodes.filter((n) => ovaLinkedNodeIds.has(n.id));
  const linkedEdges = edges.filter(
    (e) => ovaLinkedNodeIds.has(e.sourceId) || ovaLinkedNodeIds.has(e.targetId)
  );

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadPrintableDocument = () => {
    const docHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Guía de Estudio SENA — ${ova.title} (Ficha ${ova.fichaCode})</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; line-height: 1.55; font-size: 13px; margin: 0; padding: 24px; }
    h1 { font-size: 22px; margin: 8px 0; }
    h2 { font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px; }
    h3 { font-size: 14px; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-weight: 700; width: 28%; }
    .box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin: 12px 0; background: #f8fafc; }
    .print-hint { background: #eef2ff; border: 1px solid #c7d2fe; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; }
    @media print { .print-hint { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="print-hint">
    <strong>Documento listo para PDF:</strong> Presiona <strong>Ctrl + P</strong> (o Cmd + P) y selecciona <em>"Guardar como PDF"</em>.
  </div>
  <div><strong>SERVICIO NACIONAL DE APRENDIZAJE — SENA · GUÍA DE APRENDIZAJE Y ESTUDIO OVA</strong></div>
  <h1>${ova.title}</h1>
  <table>
    <tr><th>Programa de Formación</th><td>${ova.programName}</td></tr>
    <tr><th>Ficha de Caracterización</th><td>${ova.fichaCode} · Código OVA: ${ova.code}</td></tr>
    <tr><th>Competencia</th><td>${ova.competence}</td></tr>
    <tr><th>Resultado de Aprendizaje (RAP)</th><td>${ova.learningOutcome}</td></tr>
    <tr><th>Instructor Formador</th><td>${instructor.instructorName} (${instructor.centerName})</td></tr>
    <tr><th>Duración Estimada</th><td>${ova.estimatedHours} horas</td></tr>
  </table>
  <p>${ova.description}</p>

  ${ova.lessons
    .map(
      (l) => `
    <h2>Lección 0${l.order}: ${l.title} (${l.durationMinutes} min)</h2>
    <p><em>${l.summary}</em></p>
    <div>${l.contentMarkdown.replace(/\n/g, '<br/>')}</div>
    ${
      l.mediaUrl
        ? `<p><strong>Recurso Multimedia de Apoyo:</strong> ${
            l.mediaTitle ?? ''
          } — <a href="${l.mediaUrl}">${l.mediaUrl}</a></p>`
        : ''
    }
    ${
      l.activity
        ? `<div class="box">
            <strong>Evidencia Requerida (${l.activity.evidenceType}): ${l.activity.evidenceCode} — ${l.activity.title}</strong><br/>
            <span>${l.activity.instructions}</span><br/>
            <small><strong>Fecha límite:</strong> ${l.activity.dueDate} · <strong>Formato entregable:</strong> ${l.activity.deliverableFormat}</small>
           </div>`
        : ''
    }
  `
    )
    .join('')}
</body>
</html>`;

    const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Guia_Estudio_SENA_${ova.code}_Ficha_${ova.fichaCode}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs overflow-y-auto p-4 sm:p-8 flex justify-center">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full shadow-xl overflow-hidden my-auto">
        {/* Top Action Bar (Hidden when printing to PDF) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">
                Vista Previa de Exportación PDF / Guía de Aprendizaje Imprimible
              </h3>
              <p className="text-xs text-slate-400">
                Formato institucional SENA optimizado para guardar en PDF o
                subir a LMS (Zajuna / Territorium)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={ova.id}
              onChange={(e) => onSelectOva(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
            >
              {ovas.map((o) => (
                <option key={o.id} value={o.id}>
                  Ficha {o.fichaCode} · {o.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleDownloadPrintableDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Guía Imprimible
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Strip (Hidden when printing) */}
        <div className="no-print bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-5">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeConceptMap}
                onChange={(e) => setIncludeConceptMap(e.target.checked)}
              />
              <span>Incluir Síntesis del Mapa Conceptual (Grafo)</span>
            </label>

            {isInstructorSession && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQuizAnswers}
                  onChange={(e) => setIncludeQuizAnswers(e.target.checked)}
                />
                <span>
                  Incluir Respuestas de Cuestionarios (Copia del Instructor)
                </span>
              </label>
            )}
          </div>
          <span className="text-slate-500">
            Tamaño de página A4 / Carta con saltos limpios
          </span>
        </div>

        {/* Printable Study Guide Document Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-white text-slate-900">
          {/* Formal SENA Header Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-300 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-wider text-slate-600">
                  SERVICIO NACIONAL DE APRENDIZAJE — SENA
                </div>
                <div className="text-sm font-bold text-slate-900">
                  GUÍA DE ESTUDIO Y OBJETO VIRTUAL DE APRENDIZAJE (OVA)
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-700">
                <div>Código: {ova.code}</div>
                <div>Ficha: {ova.fichaCode}</div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {ova.title}
                </h1>
                <p className="text-slate-600 mt-1">{ova.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="font-semibold text-slate-700">
                    Programa de Formación:
                  </span>{' '}
                  <span className="text-slate-900">{ova.programName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">
                    Ficha de Caracterización:
                  </span>{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {ova.fichaCode}
                  </span>{' '}
                  · Duración: {ova.estimatedHours} horas
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-700">
                    Competencia:
                  </span>{' '}
                  <span className="text-slate-900">{ova.competence}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-700">
                    Resultado de Aprendizaje (RAP):
                  </span>{' '}
                  <span className="text-slate-900">{ova.learningOutcome}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-700">
                    Instructor Responsable:
                  </span>{' '}
                  <span className="text-slate-900">
                    {instructor.instructorName} · {instructor.centerName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Concept Graph Synthesis */}
          {includeConceptMap && linkedNodes.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1.5">
                1. Mapa de Conceptos y Relaciones Clave del OVA
              </h2>
              <p className="text-xs text-slate-600">
                Síntesis de los nodos de investigación y sus relaciones
                semánticas construidas en el lienzo de conocimiento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedNodes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border border-slate-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="font-bold text-slate-900">{n.title}</div>
                    <div className="text-slate-600 line-clamp-2">
                      {n.content.replace(/[#*`]/g, '')}
                    </div>
                  </div>
                ))}
              </div>

              {linkedEdges.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-800 mb-1">
                    Conexiones Conceptuales:
                  </div>
                  {linkedEdges.map((edge) => {
                    const src = nodes.find((n) => n.id === edge.sourceId);
                    const tgt = nodes.find((n) => n.id === edge.targetId);
                    return (
                      <div key={edge.id} className="text-slate-700">
                        • <strong>{src?.title}</strong>{' '}
                        <em className="text-indigo-700">({edge.label})</em> →{' '}
                        <strong>{tgt?.title}</strong>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* 2. Numbered Lessons & Activities */}
          <section className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1.5">
              2. Desarrollo de Lecciones y Material de Estudio
            </h2>

            {ova.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="space-y-3 border border-slate-200 rounded-xl p-5"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Lección 0{lesson.order}: {lesson.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Tiempo estimado: {lesson.durationMinutes} min
                  </span>
                </div>

                <p className="text-xs italic text-slate-600">
                  {lesson.summary}
                </p>

                <LessonBlocksRenderer lesson={lesson} />

                {lesson.quiz.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900">
                      Preguntas de Autoevaluación — Lección 0{lesson.order}:
                    </div>
                    {lesson.quiz.map((q, qIdx) => (
                      <div key={q.id} className="text-xs space-y-1 pl-2">
                        <div className="font-semibold text-slate-800">
                          {qIdx + 1}. {q.question}
                        </div>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                          {q.options.map((opt, optIdx) => (
                            <li key={optIdx}>
                              {opt}{' '}
                              {includeQuizAnswers &&
                                q.correctIndex === optIdx && (
                                  <strong className="text-emerald-700">
                                    [Respuesta Correcta]
                                  </strong>
                                )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {lesson.activity && (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-slate-900">
                      Evidencia de {lesson.activity.evidenceType}:{' '}
                      {lesson.activity.evidenceCode} — {lesson.activity.title}
                    </div>
                    <p className="text-slate-700">
                      {lesson.activity.instructions}
                    </p>
                    <div className="text-slate-600 font-mono pt-1">
                      Fecha límite de envío: {lesson.activity.dueDate} ·
                      Entregable: {lesson.activity.deliverableFormat}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};
