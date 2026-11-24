import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  FileEdit,
  Home,
  Lock,
  Maximize2,
  Monitor,
  Plus,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Learner, Lesson, OVA } from '../types/ova';
import {
  LessonBlocksRenderer,
  NotionLessonBlockEditor,
} from './NotionLessonBlocks';

interface MobileAppShellProps {
  ovas: OVA[];
  learners: Learner[];
  activeLearnerId: string;
  isInstructorAuth: boolean;
  onUpdateOvas: React.Dispatch<React.SetStateAction<OVA[]>>;
  onSubmitActivityEvidence: (
    learnerId: string,
    ovaId: string,
    lessonId: string,
    activityId: string,
    deliveryLinkOrNote: string
  ) => void;
  onRequestInstructorLogin: () => void;
  onExitMobilePreview?: () => void;
}

type MobileTab = 'home' | 'reader' | 'announcements' | 'builder';

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  ovas,
  learners,
  activeLearnerId,
  isInstructorAuth,
  onUpdateOvas,
  onSubmitActivityEvidence,
  onRequestInstructorLogin,
  onExitMobilePreview,
}) => {
  const publishedOvas = useMemo(
    () => ovas.filter((o) => o.status === 'published'),
    [ovas]
  );

  const allFichas = useMemo(() => {
    const set = new Set<string>();
    publishedOvas.forEach((o) => set.add(o.fichaCode));
    return Array.from(set);
  }, [publishedOvas]);

  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [selectedFicha, setSelectedFicha] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [framedOnDesktop, setFramedOnDesktop] = useState<boolean>(true);

  // Active OVA & Lesson in Reader / Builder
  const [selectedOvaId, setSelectedOvaId] = useState<string>(
    publishedOvas[0]?.id ?? ovas[0]?.id ?? ''
  );
  const currentOva =
    ovas.find((o) => o.id === selectedOvaId) ??
    publishedOvas[0] ??
    ovas[0];

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    currentOva?.lessons[0]?.id ?? ''
  );
  const currentLesson =
    currentOva?.lessons.find((l) => l.id === selectedLessonId) ??
    currentOva?.lessons[0];

  // Quiz & Evidence state in mobile reader
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [evidenceNotice, setEvidenceNotice] = useState<string | null>(null);

  const activeLearner =
    learners.find((l) => l.id === activeLearnerId) ?? learners[0];

  const visibleOvas = useMemo(() => {
    return publishedOvas.filter((ova) => {
      const matchesFicha =
        selectedFicha === 'all' || ova.fichaCode === selectedFicha;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ova.title.toLowerCase().includes(q) ||
        ova.description.toLowerCase().includes(q) ||
        ova.fichaCode.toLowerCase().includes(q);
      return matchesFicha && matchesSearch;
    });
  }, [publishedOvas, selectedFicha, searchQuery]);

  const evidenceDeadlines = useMemo(() => {
    const list: Array<{
      id: string;
      ova: OVA;
      lesson: Lesson;
      evidenceCode: string;
      title: string;
      dueDate: string;
    }> = [];
    publishedOvas.forEach((ova) => {
      if (selectedFicha !== 'all' && ova.fichaCode !== selectedFicha) return;
      ova.lessons.forEach((lesson) => {
        if (!lesson.activity) return;
        list.push({
          id: `${ova.id}-${lesson.id}`,
          ova,
          lesson,
          evidenceCode: lesson.activity.evidenceCode,
          title: lesson.activity.title,
          dueDate: lesson.activity.dueDate,
        });
      });
    });
    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [publishedOvas, selectedFicha]);

  const handleOpenOvaInReader = (ovaId: string, lessonId?: string) => {
    const target = ovas.find((o) => o.id === ovaId);
    setSelectedOvaId(ovaId);
    setSelectedLessonId(lessonId ?? target?.lessons[0]?.id ?? '');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveTab('reader');
  };

  // Builder helpers (no default elements, everything optional)
  const handleCreateCleanMobileOva = () => {
    const newOvaId = `ova-${Date.now()}`;
    const firstLessonId = `les-${Date.now()}-1`;
    const newOva: OVA = {
      id: newOvaId,
      code: `OVA-MOV-${new Date().getFullYear()}-0${ovas.length + 1}`,
      title: 'Nueva OVA Móvil',
      fichaCode: '2874512',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      competence: '',
      learningOutcome: '',
      status: 'published',
      description: '',
      estimatedHours: 12,
      updatedAt: '2026-11-09',
      lessons: [
        {
          id: firstLessonId,
          order: 1,
          title: 'Lección 1',
          durationMinutes: 30,
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

  const handleAddCleanMobileLesson = () => {
    if (!currentOva) return;
    const nextOrder = currentOva.lessons.length + 1;
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      order: nextOrder,
      title: `Lección ${nextOrder}`,
      durationMinutes: 30,
      summary: '',
      contentMarkdown: '',
      blocks: [],
      linkedNodeIds: [],
      quiz: [],
      activity: undefined,
    };
    onUpdateOvas((prev) =>
      prev.map((o) =>
        o.id === currentOva.id
          ? { ...o, lessons: [...o.lessons, newLesson] }
          : o
      )
    );
    setSelectedLessonId(newLesson.id);
  };

  const handleUpdateCurrentLesson = (patch: Partial<Lesson>) => {
    if (!currentOva || !currentLesson) return;
    onUpdateOvas((prev) =>
      prev.map((o) =>
        o.id === currentOva.id
          ? {
              ...o,
              updatedAt: '2026-11-09',
              lessons: o.lessons.map((l) =>
                l.id === currentLesson.id ? { ...l, ...patch } : l
              ),
            }
          : o
      )
    );
  };

  const currentLessonIndex = currentOva
    ? currentOva.lessons.findIndex((l) => l.id === currentLesson?.id)
    : -1;
  const prevLesson =
    currentOva && currentLessonIndex > 0
      ? currentOva.lessons[currentLessonIndex - 1]
      : null;
  const nextLesson =
    currentOva &&
    currentLessonIndex >= 0 &&
    currentLessonIndex < currentOva.lessons.length - 1
      ? currentOva.lessons[currentLessonIndex + 1]
      : null;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Desktop Preview Control Bar (hidden on native mobile screens) */}
      {onExitMobilePreview && (
        <div className="hidden md:flex w-full max-w-4xl mb-4 px-4 py-2.5 bg-white border border-stone-300 rounded-xl items-center justify-between text-xs text-stone-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#d94e34]" />
            <span className="font-bold text-stone-900">
              Vista de Aplicación Móvil (NexoOVA APK / PWA)
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">
              Optimizada para uso con el pulgar y previsualización táctil
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFramedOnDesktop((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              {framedOnDesktop ? 'Expandir Ancho' : 'Marco Smartphone (390px)'}
            </button>
            <button
              type="button"
              onClick={onExitMobilePreview}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-stone-900 text-white hover:bg-stone-800 font-semibold"
            >
              <Monitor className="w-3.5 h-3.5" />
              Volver a Escritorio
            </button>
          </div>
        </div>
      )}

      {/* Mobile Viewport Shell */}
      <div
        className={`w-full bg-[#f6f5f0] text-stone-900 flex flex-col overflow-hidden transition-all ${
          framedOnDesktop
            ? 'md:max-w-[412px] md:h-[820px] md:rounded-[36px] md:border-[8px] md:border-stone-900 md:shadow-2xl'
            : 'min-h-[calc(100vh-8rem)] rounded-2xl border border-stone-300'
        }`}
      >
        {/* 1. NATIVE MOBILE TOP APP BAR */}
        <header className="px-4 pt-3.5 pb-3 bg-white/95 backdrop-blur-xs border-b border-stone-200/90 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d94e34] shrink-0" />
            <span className="text-sm font-bold tracking-tight text-stone-950 font-display truncate">
              NexoOVA
            </span>
            {currentOva && activeTab === 'reader' && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-stone-900 text-white rounded shrink-0">
                #{currentOva.fichaCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compact Ficha Filter Dropdown */}
            <select
              aria-label="Filtrar por ficha"
              value={selectedFicha}
              onChange={(e) => setSelectedFicha(e.target.value)}
              className="px-2 py-1 text-[11px] font-mono bg-stone-100 border border-stone-300/80 rounded-lg text-stone-800 focus:outline-none"
            >
              <option value="all">Todas las Fichas</option>
              {allFichas.map((f) => (
                <option key={f} value={f}>
                  Ficha #{f}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* 2. SCROLLABLE MOBILE BODY */}
        <div className="flex-1 overflow-y-auto">
          {/* TAB 1: HOME — CLEAN MINIMALIST OVA FEED */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              {/* Mobile Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar OVA..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300/90 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Clean OVA Publication Cards (Top-right info, Title, Description, Enter Button) */}
              <div className="space-y-3">
                {visibleOvas.map((ova) => (
                  <motion.article
                    key={ova.id}
                    whileTap={{ scale: 0.99 }}
                    className="p-4 bg-white border border-stone-200/90 rounded-2xl shadow-2xs space-y-2.5"
                  >
                    {/* Top-right metadata */}
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-stone-500">
                      <span className="px-1.5 py-0.5 bg-stone-900 text-white rounded font-semibold">
                        Ficha {ova.fichaCode}
                      </span>
                      <span>·</span>
                      <span>{ova.lessons.length} lec</span>
                      <span>·</span>
                      <span>{ova.estimatedHours}h</span>
                      <span>·</span>
                      <span>{ova.updatedAt}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-bold text-stone-950 leading-snug font-display">
                      {ova.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {ova.description}
                    </p>

                    {/* Enter OVA Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenOvaInReader(ova.id, ova.lessons[0]?.id)
                        }
                        className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 active:bg-[#d94e34] hover:bg-[#d94e34] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Entrar a la OVA</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: READER — CLEAN MOBILE LESSON VIEWER (NO PROGRESS BARS) */}
          {activeTab === 'reader' && currentOva && (
            <div className="p-4 space-y-4">
              {/* OVA Switcher & Horizontal Lesson Pills */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-950"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Catálogo</span>
                  </button>
                  <span className="text-[10px] font-mono text-stone-500">
                    {currentOva.code}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-stone-900 leading-snug">
                  {currentOva.title}
                </h2>

                {/* Horizontal Scrollable Lesson Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {currentOva.lessons.map((lesson) => {
                    const active = currentLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          setSelectedLessonId(lesson.id);
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap shrink-0 transition-colors ${
                          active
                            ? 'bg-stone-900 text-white font-semibold'
                            : 'bg-white text-stone-700 border border-stone-300/80'
                        }`}
                      >
                        Lección 0{lesson.order}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Lesson Content Card */}
              {currentLesson && (
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 space-y-4 shadow-2xs">
                  <div className="border-b border-stone-100 pb-3 space-y-1">
                    <div className="text-[10px] font-mono text-[#d94e34] uppercase tracking-wider font-semibold">
                      Lección 0{currentLesson.order} ·{' '}
                      {currentLesson.durationMinutes} min · Toca enlaces/videos
                      para previsualizar
                    </div>
                    <h3 className="text-base font-bold text-stone-950 leading-snug">
                      {currentLesson.title}
                    </h3>
                    {currentLesson.summary && (
                      <p className="text-xs text-stone-500">
                        {currentLesson.summary}
                      </p>
                    )}
                  </div>

                  {/* Notion-Style Blocks with Tap-to-Preview Bottom Sheet on Mobile */}
                  <LessonBlocksRenderer lesson={currentLesson} />

                  {/* Optional Self-Assessment Quiz */}
                  {currentLesson.quiz.length > 0 && (
                    <div className="pt-4 border-t border-stone-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Autoevaluación de la Lección
                      </h4>
                      {currentLesson.quiz.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs"
                        >
                          <div className="font-bold text-stone-900">
                            {qIdx + 1}. {q.question}
                          </div>
                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const chosen = quizAnswers[q.id] === optIdx;
                              const isRight = q.correctIndex === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setQuizAnswers((prev) => ({
                                      ...prev,
                                      [q.id]: optIdx,
                                    }))
                                  }
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                                    quizSubmitted
                                      ? isRight
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                        : chosen
                                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                                        : 'bg-white border-stone-200 text-stone-600'
                                      : chosen
                                      ? 'bg-stone-900 text-white border-stone-900 font-medium'
                                      : 'bg-white border-stone-200 text-stone-800'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="text-[11px] text-stone-600 pt-1">
                              <strong>Explicación:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setQuizSubmitted(true)}
                        className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
                      >
                        Verificar Respuestas
                      </button>
                    </div>
                  )}

                  {/* Optional Activity / Evidence Submission */}
                  {currentLesson.activity && (
                    <div className="pt-4 border-t border-stone-200 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-indigo-700 font-bold">
                          {currentLesson.activity.evidenceCode}
                        </span>
                        <span className="text-amber-800">
                          Vence: {currentLesson.activity.dueDate}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-900">
                        {currentLesson.activity.title}
                      </div>
                      <p className="text-xs text-stone-600">
                        {currentLesson.activity.instructions}
                      </p>
                      {evidenceNotice && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs">
                          {evidenceNotice}
                        </div>
                      )}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!evidenceUrl.trim() || !currentLesson.activity)
                            return;
                          onSubmitActivityEvidence(
                            activeLearner.id,
                            currentOva.id,
                            currentLesson.id,
                            currentLesson.activity.id,
                            evidenceUrl.trim()
                          );
                          setEvidenceUrl('');
                          setEvidenceNotice('Evidencia enviada correctamente.');
                          setTimeout(() => setEvidenceNotice(null), 3500);
                        }}
                        className="flex gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={evidenceUrl}
                          onChange={(e) => setEvidenceUrl(e.target.value)}
                          placeholder="URL de entrega (Git / Drive)..."
                          className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl inline-flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Enviar
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Prev / Next Lesson Thumb Navigation */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    {prevLesson ? (
                      <button
                        type="button"
                        onClick={() => setSelectedLessonId(prevLesson.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 rounded-xl"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Lección 0{prevLesson.order}
                      </button>
                    ) : (
                      <div />
                    )}
                    {nextLesson && (
                      <button
                        type="button"
                        onClick={() => setSelectedLessonId(nextLesson.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl"
                      >
                        Lección 0{nextLesson.order}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS — SLIM MOBILE DEADLINES & RECENT PUBLICATIONS */}
          {activeTab === 'announcements' && (
            <div className="p-4 space-y-5">
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d94e34]" />
                  <span>Fechas de Evidencias</span>
                </div>
                {evidenceDeadlines.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() =>
                      handleOpenOvaInReader(ev.ova.id, ev.lesson.id)
                    }
                    className="p-3.5 bg-white border border-stone-200/90 rounded-xl space-y-1 cursor-pointer active:bg-stone-50"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold text-stone-600">
                        Ficha {ev.ova.fichaCode} · {ev.evidenceCode}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#d94e34]/15 text-[#b8371f] font-bold">
                        {ev.dueDate}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-950">
                      {ev.title}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {ev.ova.title} · Lección 0{ev.lesson.order}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1c5d43]" />
                  <span>Publicaciones Recientes</span>
                </div>
                {publishedOvas.map((ova) => (
                  <div
                    key={ova.id}
                    onClick={() =>
                      handleOpenOvaInReader(ova.id, ova.lessons[0]?.id)
                    }
                    className="p-3.5 bg-white border border-stone-200/90 rounded-xl space-y-1 cursor-pointer active:bg-stone-50"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#1c5d43] font-semibold">
                        Publicado · {ova.updatedAt}
                      </span>
                      <span className="text-stone-500">
                        Ficha {ova.fichaCode}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      {ova.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BUILDER — MOBILE OVA AUTHORING (NO DEFAULT ELEMENTS, ADD ON DEMAND) */}
          {activeTab === 'builder' && (
            <div className="p-4 space-y-4">
              {!isInstructorAuth ? (
                <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center space-y-3">
                  <Lock className="w-8 h-8 text-stone-400 mx-auto" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Autoría Móvil de OVAs (Modo Instructor)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Inicia sesión como docente para crear OVAs limpias y
                    agregar bloques de texto, enlaces, videos o código desde tu
                    dispositivo móvil.
                  </p>
                  <button
                    type="button"
                    onClick={onRequestInstructorLogin}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-xl"
                  >
                    Iniciar Sesión Docente
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={currentOva?.id ?? ''}
                      onChange={(e) => {
                        const next = ovas.find((o) => o.id === e.target.value);
                        setSelectedOvaId(e.target.value);
                        setSelectedLessonId(next?.lessons[0]?.id ?? '');
                      }}
                      className="flex-1 px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-xl text-stone-900"
                    >
                      {ovas.map((o) => (
                        <option key={o.id} value={o.id}>
                          Ficha {o.fichaCode} · {o.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleCreateCleanMobileOva}
                      className="px-3 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl shrink-0 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Nueva OVA
                    </button>
                  </div>

                  {currentOva && (
                    <div className="p-3.5 bg-white border border-stone-200 rounded-2xl space-y-2.5">
                      <input
                        type="text"
                        value={currentOva.title}
                        onChange={(e) =>
                          onUpdateOvas((prev) =>
                            prev.map((o) =>
                              o.id === currentOva.id
                                ? { ...o, title: e.target.value }
                                : o
                            )
                          )
                        }
                        placeholder="Título de la OVA..."
                        className="w-full px-3 py-1.5 text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg"
                      />
                      <textarea
                        rows={2}
                        value={currentOva.description}
                        onChange={(e) =>
                          onUpdateOvas((prev) =>
                            prev.map((o) =>
                              o.id === currentOva.id
                                ? { ...o, description: e.target.value }
                                : o
                            )
                          )
                        }
                        placeholder="Descripción breve de la OVA..."
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                      />

                      {/* Lesson Pills + Add Clean Lesson */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                        {currentOva.lessons.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setSelectedLessonId(l.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap ${
                              currentLesson?.id === l.id
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            L0{l.order}: {l.title}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddCleanMobileLesson}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-700 bg-indigo-50 whitespace-nowrap"
                        >
                          + Lección vacía
                        </button>
                      </div>
                    </div>
                  )}

                  {currentLesson && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={currentLesson.title}
                        onChange={(e) =>
                          handleUpdateCurrentLesson({ title: e.target.value })
                        }
                        placeholder="Título de la lección..."
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-200 rounded-xl"
                      />

                      <NotionLessonBlockEditor
                        lesson={currentLesson}
                        onUpdateLesson={handleUpdateCurrentLesson}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 3. NATIVE BOTTOM TAB NAVIGATION BAR */}
        <nav className="bg-white border-t border-stone-200 px-2 py-2 grid grid-cols-4 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
              activeTab === 'home'
                ? 'text-[#d94e34] bg-[#d94e34]/10'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>OVAs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reader')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
              activeTab === 'reader'
                ? 'text-[#d94e34] bg-[#d94e34]/10'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Lectura</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
              activeTab === 'announcements'
                ? 'text-[#d94e34] bg-[#d94e34]/10'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Bell className="w-4 h-4 mb-0.5" />
            <span>Anuncios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
              activeTab === 'builder'
                ? 'text-[#d94e34] bg-[#d94e34]/10'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <FileEdit className="w-4 h-4 mb-0.5" />
            <span>Construir</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
