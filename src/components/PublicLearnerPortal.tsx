import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  FolderGit2,
  HelpCircle,
  Printer,
  Send,
  User,
  Video,
} from 'lucide-react';
import { GraphNode, Learner, OVA } from '../types/ova';
import { LessonBlocksRenderer } from './NotionLessonBlocks';

interface PublicLearnerPortalProps {
  ovas: OVA[];
  learners: Learner[];
  nodes: GraphNode[];
  activeLearnerId: string;
  onSelectLearnerId: (id: string) => void;
  onToggleLessonCompleted: (
    learnerId: string,
    ovaId: string,
    lessonId: string
  ) => void;
  onSubmitQuizScore: (
    learnerId: string,
    ovaId: string,
    lessonId: string,
    scorePct: number
  ) => void;
  onSubmitActivityEvidence: (
    learnerId: string,
    ovaId: string,
    lessonId: string,
    activityId: string,
    deliveryLinkOrNote: string
  ) => void;
  onOpenPrintGuide: (ovaId: string) => void;
  publicSection: 'catalog' | 'evidences' | 'progress';
  onChangePublicSection: (sec: 'catalog' | 'evidences' | 'progress') => void;
  initialOvaId?: string | null;
  initialLessonId?: string | null;
}

export const PublicLearnerPortal: React.FC<PublicLearnerPortalProps> = ({
  ovas,
  learners,
  nodes,
  activeLearnerId,
  onSelectLearnerId,
  onToggleLessonCompleted,
  onSubmitQuizScore,
  onSubmitActivityEvidence,
  onOpenPrintGuide,
  publicSection,
  onChangePublicSection,
  initialOvaId,
  initialLessonId,
}) => {
  const activeLearner =
    learners.find((l) => l.id === activeLearnerId) ?? learners[0];

  const publishedOvas = useMemo(
    () => ovas.filter((o) => o.status === 'published'),
    [ovas]
  );

  const [selectedOvaId, setSelectedOvaId] = useState<string>(
    publishedOvas.find((o) => o.fichaCode === activeLearner?.fichaCode)?.id ??
      publishedOvas[0]?.id ??
      ''
  );

  const currentOva =
    publishedOvas.find((o) => o.id === selectedOvaId) ?? publishedOvas[0];

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    currentOva?.lessons[0]?.id ?? ''
  );

  const currentLesson =
    currentOva?.lessons.find((l) => l.id === selectedLessonId) ??
    currentOva?.lessons[0];

  useEffect(() => {
    if (initialOvaId) {
      setSelectedOvaId(initialOvaId);
      const targetOva = publishedOvas.find((o) => o.id === initialOvaId);
      if (initialLessonId) {
        setSelectedLessonId(initialLessonId);
      } else if (targetOva?.lessons[0]) {
        setSelectedLessonId(targetOva.lessons[0].id);
      }
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  }, [initialOvaId, initialLessonId, publishedOvas]);

  // Quiz state for current lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Evidence submission input state
  const [evidenceInputUrl, setEvidenceInputUrl] = useState<string>('');
  const [evidenceSavedBanner, setEvidenceSavedBanner] = useState<string | null>(
    null
  );

  // Document number quick lookup for public learners
  const [docSearch, setDocSearch] = useState<string>('');
  const [docLookupMsg, setDocLookupMsg] = useState<string | null>(null);

  const handleSelectOva = (ova: OVA) => {
    setSelectedOvaId(ova.id);
    setSelectedLessonId(ova.lessons[0]?.id ?? '');
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleDocSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = learners.find(
      (l) =>
        l.documentNumber === docSearch.trim() ||
        l.name.toLowerCase().includes(docSearch.trim().toLowerCase())
    );
    if (found) {
      onSelectLearnerId(found.id);
      const matchingOva = publishedOvas.find(
        (o) => o.fichaCode === found.fichaCode
      );
      if (matchingOva) {
        handleSelectOva(matchingOva);
      }
      setDocLookupMsg(`Perfil de aprendiz cargado: ${found.name} (Ficha ${found.fichaCode})`);
    } else {
      setDocLookupMsg('No se encontró un aprendiz con ese documento o nombre.');
    }
    setTimeout(() => setDocLookupMsg(null), 4000);
  };

  const learnerProgress = currentOva
    ? activeLearner?.progressByOva[currentOva.id]
    : undefined;

  const isCurrentLessonDone = currentLesson
    ? learnerProgress?.completedLessonIds.includes(currentLesson.id) ?? false
    : false;

  const currentSubmission = currentLesson
    ? learnerProgress?.submissions?.[currentLesson.id]
    : undefined;

  // Compute pending/upcoming deadlines for the active learner
  const learnerPendingEvidences = useMemo(() => {
    if (!activeLearner) return [];
    const list: Array<{
      ova: OVA;
      lessonId: string;
      lessonTitle: string;
      evidenceCode: string;
      activityTitle: string;
      dueDate: string;
      instructions: string;
      status: 'pending' | 'submitted' | 'late';
      deliveryLink?: string;
    }> = [];

    publishedOvas
      .filter((o) => o.fichaCode === activeLearner.fichaCode)
      .forEach((ova) => {
        const prog = activeLearner.progressByOva[ova.id];
        ova.lessons.forEach((lesson) => {
          if (!lesson.activity) return;
          const sub = prog?.submissions?.[lesson.id];
          const status =
            sub?.status ??
            (lesson.activity.dueDate < '2026-11-09' ? 'late' : 'pending');
          list.push({
            ova,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            evidenceCode: lesson.activity.evidenceCode,
            activityTitle: lesson.activity.title,
            dueDate: lesson.activity.dueDate,
            instructions: lesson.activity.instructions,
            status,
            deliveryLink: sub?.deliveryLinkOrNote,
          });
        });
      });

    return list;
  }, [activeLearner, publishedOvas]);

  const handleGradeQuiz = () => {
    if (!currentLesson || !currentOva || !activeLearner) return;
    const total = currentLesson.quiz.length;
    if (total === 0) return;
    let correct = 0;
    currentLesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    const pct = Math.round((correct / total) * 100);
    setQuizSubmitted(true);
    onSubmitQuizScore(activeLearner.id, currentOva.id, currentLesson.id, pct);
  };

  const handleSendEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !currentLesson?.activity ||
      !currentOva ||
      !activeLearner ||
      !evidenceInputUrl.trim()
    ) {
      return;
    }
    onSubmitActivityEvidence(
      activeLearner.id,
      currentOva.id,
      currentLesson.id,
      currentLesson.activity.id,
      evidenceInputUrl.trim()
    );
    setEvidenceInputUrl('');
    setEvidenceSavedBanner(
      'Evidencia registrada exitosamente. El progreso del instructor se ha sincronizado.'
    );
    setTimeout(() => setEvidenceSavedBanner(null), 4000);
  };

  if (!activeLearner || !currentOva) return null;

  const completedCount =
    learnerProgress?.completedLessonIds.length ?? 0;
  const totalLessons = currentOva.lessons.length;
  const ovaProgressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Public Learner Identification Bar (No Password Needed) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">
              Vista Pública de Aprendiz SENA (Acceso Abierto)
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">
              Ficha Activa: {activeLearner.fichaCode}
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeLearner.programName}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Bienvenido(a), {activeLearner.name}
          </h1>
        </div>

        {/* Select Learner or Search by Document Number */}
        <div className="flex flex-wrap items-center gap-2.5">
          <form
            onSubmit={handleDocSearchSubmit}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Buscar por documento o nombre..."
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 w-48 focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Identificarme
            </button>
          </form>

          <select
            aria-label="Cambiar aprendiz activo"
            value={activeLearner.id}
            onChange={(e) => {
              const newId = e.target.value;
              onSelectLearnerId(newId);
              const l = learners.find((item) => item.id === newId);
              const matchOva = publishedOvas.find(
                (o) => o.fichaCode === l?.fichaCode
              );
              if (matchOva) {
                handleSelectOva(matchOva);
              }
            }}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 focus:outline-none"
          >
            {learners.map((l) => (
              <option key={l.id} value={l.id}>
                Ficha {l.fichaCode} · {l.name} (CC {l.documentNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {docLookupMsg && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2.5 rounded-xl text-xs font-medium">
          {docLookupMsg}
        </div>
      )}

      {/* In-App Upcoming & Overdue Evidence Reminders Banner */}
      {learnerPendingEvidences.some((ev) => ev.status !== 'submitted') && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Recordatorio de Envío de Evidencias SENA (Ficha{' '}
                {activeLearner.fichaCode})
              </span>
            </div>
            <p className="text-xs text-amber-800">
              Tienes{' '}
              <strong className="font-mono">
                {
                  learnerPendingEvidences.filter(
                    (ev) => ev.status !== 'submitted'
                  ).length
                }
              </strong>{' '}
              evidencia(s) pendiente(s) de entrega. Revisa las fechas límite y
              registra tu enlace de entrega en la lección correspondiente.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChangePublicSection('evidences')}
            className="px-3.5 py-2 text-xs font-semibold text-amber-950 bg-amber-200/80 hover:bg-amber-300/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Ver Cronograma de Evidencias
          </button>
        </div>
      )}

      {/* Section View Switch: 1) 'evidences', 2) 'progress', or 3) 'catalog' (OVA Study Reader) */}
      {publicSection === 'evidences' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Cronograma de Actividades y Entrega de Evidencias RAP
              </h2>
              <p className="text-xs text-slate-500">
                Haz clic en cualquier actividad para ir directamente a la lección
                y registrar tu envío.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangePublicSection('catalog')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              Volver al Lector de Lecciones
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            {learnerPendingEvidences.map((ev, i) => (
              <div
                key={`${ev.lessonId}-${i}`}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-mono font-semibold text-indigo-700">
                      {ev.evidenceCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{ev.ova.title}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">
                      Fecha límite: {ev.dueDate}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {ev.activityTitle}
                  </h3>
                  <p className="text-xs text-slate-600">{ev.instructions}</p>
                  {ev.deliveryLink && (
                    <div className="text-xs text-emerald-700 font-mono">
                      Entrega registrada: {ev.deliveryLink}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold ${
                      ev.status === 'submitted'
                        ? 'text-emerald-700'
                        : ev.status === 'late'
                        ? 'text-red-600'
                        : 'text-amber-700'
                    }`}
                  >
                    {ev.status === 'submitted'
                      ? '✓ Entregada'
                      : ev.status === 'late'
                      ? '▲ Plazo vencido'
                      : '● Pendiente de envío'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectOva(ev.ova);
                      handleSelectLesson(ev.lessonId);
                      onChangePublicSection('catalog');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg whitespace-nowrap"
                  >
                    Ir a la Lección
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : publicSection === 'progress' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mi Progreso Individual de Formación — {activeLearner.name}
              </h2>
              <p className="text-xs text-slate-500">
                Resumen consolidado de lecciones estudiadas, cuestionarios y
                evidencias entregadas en la Ficha {activeLearner.fichaCode}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangePublicSection('catalog')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              Continuar Estudiando
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {publishedOvas.map((ova) => {
              const prog = activeLearner.progressByOva[ova.id];
              const done = prog?.completedLessonIds.length ?? 0;
              const pct =
                ova.lessons.length > 0
                  ? Math.round((done / ova.lessons.length) * 100)
                  : 0;
              return (
                <div
                  key={ova.id}
                  className="p-5 border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-indigo-700 font-semibold">
                      {ova.code} · Ficha {ova.fichaCode}
                    </span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {pct}% completado
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {ova.title}
                  </h3>
                  <p className="text-xs text-slate-600">{ova.learningOutcome}</p>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-emerald-600 transition-all"
                    />
                  </div>

                  <div className="pt-2 space-y-1.5">
                    {ova.lessons.map((l) => {
                      const isDone =
                        prog?.completedLessonIds.includes(l.id) ?? false;
                      const qScore = prog?.quizScores?.[l.id];
                      return (
                        <div
                          key={l.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span
                            className={
                              isDone
                                ? 'text-emerald-700 font-medium'
                                : 'text-slate-600'
                            }
                          >
                            {isDone ? '✓' : '○'} Lección {l.order}: {l.title}
                          </span>
                          {qScore !== undefined && (
                            <span className="font-mono text-indigo-600">
                              Quiz: {qScore}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main Study Reader View ('catalog') */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar (4 cols): OVA Selector & Lesson Syllabus */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-bold text-slate-900">
                Objetos Virtuales de Aprendizaje (OVAs)
              </h2>
              <div className="space-y-2">
                {publishedOvas.map((ova) => {
                  const isSelected = ova.id === currentOva.id;
                  const prog = activeLearner.progressByOva[ova.id];
                  const doneCount = prog?.completedLessonIds.length ?? 0;
                  const pct =
                    ova.lessons.length > 0
                      ? Math.round((doneCount / ova.lessons.length) * 100)
                      : 0;

                  return (
                    <button
                      key={ova.id}
                      type="button"
                      onClick={() => handleSelectOva(ova)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 text-slate-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-mono font-semibold text-indigo-700">
                          Ficha {ova.fichaCode}
                        </span>
                        <span className="font-mono text-slate-500">
                          {ova.code}
                        </span>
                      </div>
                      <div className="text-sm font-bold leading-snug">
                        {ova.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {ova.lessons.length} lecciones · {ova.estimatedHours}{' '}
                        horas estimadas
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lessons Navigation of Selected OVA (Without Progress Bars) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Contenido del OVA ({totalLessons} lecciones)
                </h3>
              </div>

              <div className="space-y-2 pt-1">
                {currentOva.lessons.map((lesson) => {
                  const isSelected = currentLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => handleSelectLesson(lesson.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className={`font-mono ${
                            isSelected ? 'text-indigo-300' : 'text-slate-500'
                          }`}
                        >
                          Lección 0{lesson.order} · {lesson.durationMinutes} min
                        </span>
                      </div>

                      <div className="text-xs font-semibold leading-snug">
                        {lesson.title}
                      </div>

                      {lesson.activity && (
                        <div
                          className={`text-[11px] mt-1.5 flex items-center gap-2 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          <span>
                            Evidencia vence: {lesson.activity.dueDate}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onOpenPrintGuide(currentOva.id)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                Descargar Guía de Estudio en PDF
              </button>
            </div>
          </div>

          {/* Right Main Content (8 cols): Active Lesson Study Material, Multimedia, Quiz & Evidence Submission */}
          <div className="lg:col-span-8 space-y-6">
            {currentLesson && (
              <>
                <article className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                  {/* Curricular Context Header */}
                  <div className="border-b border-slate-200 pb-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-indigo-700 font-semibold">
                        {currentOva.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        Lección 0{currentLesson.order} de{' '}
                        {currentOva.lessons.length}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">
                        {currentLesson.durationMinutes} minutos de lectura
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {currentLesson.title}
                    </h2>

                    <p className="text-sm text-slate-600">
                      {currentLesson.summary}
                    </p>

                    <div className="pt-1 text-xs text-slate-500">
                      <strong>Resultado de Aprendizaje (RAP):</strong>{' '}
                      {currentOva.learningOutcome}
                    </div>
                  </div>

                  {/* Lesson Study Body: Notion-Style Rich Blocks (Text, Hover Links, Hover Videos, Copyable Code Segments) */}
                  <LessonBlocksRenderer lesson={currentLesson} />

                  {/* Linked Concept Nodes from the Instructor's Knowledge Graph */}
                  {currentLesson.linkedNodeIds.length > 0 && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                      <div className="text-xs font-bold text-slate-800">
                        Nodos Conceptuales de Investigación del Instructor
                        Asociados a esta Lección
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentLesson.linkedNodeIds.map((nid) => {
                          const node = nodes.find((n) => n.id === nid);
                          if (!node) return null;
                          return (
                            <div
                              key={nid}
                              className="p-3 bg-white border border-slate-200 rounded-lg space-y-1"
                            >
                              <div className="text-[11px] text-indigo-600 font-medium">
                                Nodo del Grafo · {node.tags.join(' · ')}
                              </div>
                              <div className="text-xs font-bold text-slate-900">
                                {node.title}
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {node.content.replace(/[#*`]/g, '')}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>

                {/* Interactive Self-Assessment Quiz */}
                {currentLesson.quiz.length > 0 && (
                  <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Cuestionario Interactivo de Comprobación
                        </h3>
                        <p className="text-xs text-slate-500">
                          Verifica tu apropiación de los conceptos de esta
                          lección. Tu puntaje se guarda automáticamente en tu
                          progreso.
                        </p>
                      </div>
                      {learnerProgress?.quizScores?.[currentLesson.id] !==
                        undefined && (
                        <div className="text-xs font-mono font-bold text-emerald-700">
                          Último puntaje:{' '}
                          {learnerProgress.quizScores[currentLesson.id]}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {currentLesson.quiz.map((q, qIdx) => {
                        const selectedOpt = quizAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
                          >
                            <div className="text-xs font-bold text-slate-900">
                              {qIdx + 1}. {q.question}
                            </div>
                            <div className="space-y-1.5">
                              {q.options.map((opt, optIdx) => {
                                const isChosen = selectedOpt === optIdx;
                                const isRight = q.correctIndex === optIdx;
                                return (
                                  <label
                                    key={optIdx}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                      quizSubmitted
                                        ? isRight
                                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                          : isChosen
                                          ? 'bg-red-50 border-red-300 text-red-900'
                                          : 'bg-white border-slate-200 text-slate-600'
                                        : isChosen
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-medium'
                                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`quiz-${q.id}`}
                                      checked={isChosen}
                                      onChange={() =>
                                        setQuizAnswers((prev) => ({
                                          ...prev,
                                          [q.id]: optIdx,
                                        }))
                                      }
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                            {quizSubmitted && (
                              <div className="text-xs text-slate-600 pt-1">
                                <strong>Explicación:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleGradeQuiz}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                        Calificar Autoevaluación y Guardar Avance
                      </button>
                    </div>
                  </section>
                )}

                {/* Activity / Evidence Delivery Section */}
                {currentLesson.activity && (
                  <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="text-xs text-slate-500 font-mono">
                          Evidencia de {currentLesson.activity.evidenceType} ·{' '}
                          {currentLesson.activity.evidenceCode}
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {currentLesson.activity.title}
                        </h3>
                      </div>

                      <div className="text-xs font-mono">
                        Fecha límite:{' '}
                        <strong className="text-amber-700">
                          {currentLesson.activity.dueDate}
                        </strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {currentLesson.activity.instructions}
                    </p>

                    <div className="text-xs text-slate-500">
                      <strong>Formato de entrega esperado:</strong>{' '}
                      {currentLesson.activity.deliverableFormat}
                    </div>

                    {currentSubmission?.status === 'submitted' && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                        <div className="font-bold">
                          ✓ Evidencia Entregada el{' '}
                          {currentSubmission.submittedAt}
                        </div>
                        <div className="font-mono break-all">
                          Enlace/Nota registrada:{' '}
                          {currentSubmission.deliveryLinkOrNote}
                        </div>
                      </div>
                    )}

                    {evidenceSavedBanner && (
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 font-medium">
                        {evidenceSavedBanner}
                      </div>
                    )}

                    <form
                      onSubmit={handleSendEvidence}
                      className="flex flex-col sm:flex-row gap-2.5 pt-1"
                    >
                      <input
                        type="text"
                        required
                        value={evidenceInputUrl}
                        onChange={(e) => setEvidenceInputUrl(e.target.value)}
                        placeholder="Pega la URL de tu repositorio Git, Drive o nota de entrega..."
                        className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {currentSubmission?.status === 'submitted'
                          ? 'Actualizar Entrega'
                          : 'Registrar Entrega de Evidencia'}
                      </button>
                    </form>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
