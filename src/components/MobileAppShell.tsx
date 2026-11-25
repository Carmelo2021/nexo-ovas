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
    <div className="w-full max-w-full overflow-x-hidden flex flex-col items-center">
      {/* Desktop Preview Control Bar (hidden on native mobile screens) */}
      {onExitMobilePreview && (
        <div className="hidden md:flex w-full max-w-4xl mb-4 px-4 py-2.5 bg-white border border-stone-300 rounded-xl items-center justify-between text-xs text-stone-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#d94e34]" />
            <span className="font-bold text-stone-900">
              Vista de Aplicación Móvil (NexoOVA APK / Android)
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">
              Sin scroll horizontal · Optimizada para pantallas táctiles Android
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

      {/* Mobile Viewport Shell: Full-bleed 100dvh on Android / mobile, framed on desktop */}
      <div
        className={`w-full max-w-full bg-[#f6f5f0] text-stone-900 flex flex-col overflow-x-hidden overflow-y-hidden transition-all h-dvh md:h-auto ${
          framedOnDesktop
            ? 'md:max-w-[412px] md:h-[820px] md:rounded-[36px] md:border-[8px] md:border-stone-900 md:shadow-2xl'
            : 'md:min-h-[calc(100vh-8rem)] md:rounded-2xl md:border md:border-stone-300'
        }`}
      >
        {/* 1. NATIVE ANDROID TOP APP BAR */}
        <header className="px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 bg-white/95 backdrop-blur-xs border-b border-stone-200/90 flex items-center justify-between gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d94e34] shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-stone-950 font-display truncate">
                  NexoOVA
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-stone-900 text-white rounded shrink-0">
                  SENA JS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compact Ficha Filter Dropdown */}
            <select
              aria-label="Filtrar por ficha"
              value={selectedFicha}
              onChange={(e) => setSelectedFicha(e.target.value)}
              className="max-w-[128px] px-2 py-1 text-[11px] font-mono bg-stone-100 border border-stone-300/80 rounded-lg text-stone-800 focus:outline-none truncate"
            >
              <option value="all">Todas las Fichas</option>
              {allFichas.map((f) => (
                <option key={f} value={f}>
                  Ficha #{f}
                </option>
              ))}
            </select>

            {/* Quick Instructor Access Pill */}
            <button
              type="button"
              onClick={() => {
                if (isInstructorAuth) {
                  setActiveTab('builder');
                } else {
                  onRequestInstructorLogin();
                }
              }}
              title={
                isInstructorAuth
                  ? 'Sesión Docente Activa'
                  : 'Acceso Exclusivo Instructor'
              }
              className={`p-1.5 rounded-lg border text-[10px] font-semibold transition-colors shrink-0 ${
                isInstructorAuth
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-100 border-stone-300/80 text-stone-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* 2. SCROLLABLE MOBILE BODY (Strictly Vertical Scroll Only, Zero Horizontal Scroll) */}
        <div className="flex-1 min-w-0 max-w-full overflow-y-auto overflow-x-hidden overscroll-x-none">
          {/* TAB 1: HOME — CLEAN MINIMALIST OVA FEED */}
          {activeTab === 'home' && (
            <div className="p-3.5 space-y-3.5 min-w-0 max-w-full">
              {/* Mobile Search Input + Quick Stats Banner */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar OVA de JavaScript, tema o ficha..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-stone-300/90 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 shadow-2xs"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 px-1 text-[11px] text-stone-500 font-mono">
                  <span>{visibleOvas.length} OVAs interactivas disponibles</span>
                  <span>Toque cualquier tarjeta para estudiar</span>
                </div>
              </div>

              {/* Clean OVA Publication Cards (Top-right info, Title, Description, Enter Button) */}
              <div className="space-y-3 min-w-0 max-w-full">
                {visibleOvas.map((ova, ovaIdx) => (
                  <motion.article
                    key={ova.id}
                    whileTap={{ scale: 0.99 }}
                    className="p-3.5 bg-white border border-stone-200/90 rounded-2xl shadow-2xs space-y-2.5 min-w-0 max-w-full overflow-hidden"
                  >
                    {/* Top-right metadata with flex-wrap so it never overflows narrow screens */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono text-stone-500">
                      <span className="px-2 py-0.5 bg-amber-500/15 text-amber-900 border border-amber-400/40 rounded-md font-bold">
                        Módulo 0{ovaIdx + 1} · {ova.code}
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-stone-900 text-white rounded font-semibold">
                          Ficha {ova.fichaCode}
                        </span>
                        <span>·</span>
                        <span>{ova.lessons.length} lec</span>
                        <span>·</span>
                        <span>{ova.estimatedHours}h</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-[15px] font-bold text-stone-950 leading-snug font-display break-words">
                      {ova.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed break-words">
                      {ova.description}
                    </p>

                    {/* Quick Lesson Preview Pills (Wrapped, no horizontal scroll) */}
                    <div className="pt-0.5 flex flex-wrap gap-1.5">
                      {ova.lessons.map((les) => (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => handleOpenOvaInReader(ova.id, les.id)}
                          className="px-2 py-1 text-[10px] font-mono bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 rounded-lg text-left transition-colors max-w-full truncate"
                        >
                          L0{les.order}: {les.title}
                        </button>
                      ))}
                    </div>

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
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: READER — CLEAN MOBILE LESSON VIEWER (ZERO HORIZONTAL SCROLL) */}
          {activeTab === 'reader' && currentOva && (
            <div className="p-3.5 space-y-3.5 min-w-0 max-w-full overflow-x-hidden">
              {/* OVA Switcher & Wrapped Lesson Grid (No horizontal scroll) */}
              <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs min-w-0 max-w-full">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 text-xs font-semibold text-stone-700 active:bg-stone-200 shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Catálogo</span>
                  </button>

                  {/* Compact OVA Switcher Dropdown */}
                  <select
                    aria-label="Cambiar OVA activa"
                    value={currentOva.id}
                    onChange={(e) => handleOpenOvaInReader(e.target.value)}
                    className="min-w-0 flex-1 max-w-[210px] px-2 py-1 text-[11px] font-mono font-semibold bg-stone-100 border border-stone-200 rounded-lg text-stone-800 truncate"
                  >
                    {publishedOvas.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.code} · {o.title}
                      </option>
                    ))}
                  </select>
                </div>

                <h2 className="text-xs font-bold text-stone-900 leading-snug break-words">
                  {currentOva.title}
                </h2>

                {/* Wrapped Grid Lesson Selector (Eliminates horizontal scrolling) */}
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
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
                        className={`px-2 py-2 rounded-xl text-[11px] font-mono text-center transition-colors min-w-0 truncate ${
                          active
                            ? 'bg-stone-900 text-white font-bold shadow-2xs'
                            : 'bg-stone-100 text-stone-700 border border-stone-200/80 active:bg-stone-200'
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
                <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 space-y-4 shadow-2xs min-w-0 max-w-full overflow-hidden">
                  <div className="border-b border-stone-100 pb-3 space-y-1 min-w-0">
                    <div className="text-[10px] font-mono text-[#d94e34] uppercase tracking-wider font-semibold break-words">
                      Lección 0{currentLesson.order} ·{' '}
                      {currentLesson.durationMinutes} min · Interactiva
                    </div>
                    <h3 className="text-base font-bold text-stone-950 leading-snug break-words">
                      {currentLesson.title}
                    </h3>
                    {currentLesson.summary && (
                      <p className="text-xs text-stone-500 leading-relaxed break-words">
                        {currentLesson.summary}
                      </p>
                    )}
                  </div>

                  {/* Notion-Style Blocks (Diagrams, Interactive JS Labs, Code & Text all fit 100% width) */}
                  <div className="min-w-0 max-w-full overflow-hidden">
                    <LessonBlocksRenderer lesson={currentLesson} />
                  </div>

                  {/* Optional Self-Assessment Quiz */}
                  {currentLesson.quiz.length > 0 && (
                    <div className="pt-4 border-t border-stone-200 space-y-3 min-w-0 max-w-full">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Autoevaluación de la Lección
                      </h4>
                      {currentLesson.quiz.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs min-w-0 max-w-full"
                        >
                          <div className="font-bold text-stone-900 break-words">
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
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors break-words ${
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
                            <p className="text-[11px] text-stone-600 pt-1 break-words">
                              <strong>Explicación:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setQuizSubmitted(true)}
                        className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 active:bg-indigo-700 rounded-xl"
                      >
                        Verificar Respuestas
                      </button>
                    </div>
                  )}

                  {/* Optional Activity / Evidence Submission */}
                  {currentLesson.activity && (
                    <div className="pt-4 border-t border-stone-200 space-y-2.5 min-w-0 max-w-full">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono">
                        <span className="text-indigo-700 font-bold break-all">
                          {currentLesson.activity.evidenceCode}
                        </span>
                        <span className="text-amber-800">
                          Vence: {currentLesson.activity.dueDate}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-900 break-words">
                        {currentLesson.activity.title}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed break-words">
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
                        className="flex flex-col sm:flex-row gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={evidenceUrl}
                          onChange={(e) => setEvidenceUrl(e.target.value)}
                          placeholder="URL de entrega (GitHub / Drive)..."
                          className="w-full sm:flex-1 px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl min-w-0"
                        />
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 active:bg-emerald-700 rounded-xl inline-flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Evidencia</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Prev / Next Lesson Thumb Navigation */}
                  <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                    {prevLesson ? (
                      <button
                        type="button"
                        onClick={() => setSelectedLessonId(prevLesson.id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 active:bg-stone-200 rounded-xl truncate"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                        <span>Lección 0{prevLesson.order}</span>
                      </button>
                    ) : (
                      <div />
                    )}
                    {nextLesson && (
                      <button
                        type="button"
                        onClick={() => setSelectedLessonId(nextLesson.id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-semibold text-white bg-stone-900 active:bg-[#d94e34] rounded-xl truncate"
                      >
                        <span>Lección 0{nextLesson.order}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS — SLIM MOBILE DEADLINES & RECENT PUBLICATIONS */}
          {activeTab === 'announcements' && (
            <div className="p-3.5 space-y-5 min-w-0 max-w-full overflow-x-hidden">
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d94e34] shrink-0" />
                  <span>Fechas de Evidencias ({evidenceDeadlines.length})</span>
                </div>
                {evidenceDeadlines.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() =>
                      handleOpenOvaInReader(ev.ova.id, ev.lesson.id)
                    }
                    className="p-3.5 bg-white border border-stone-200/90 rounded-xl space-y-1 cursor-pointer active:bg-stone-50 min-w-0 max-w-full overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="font-semibold text-stone-600 break-all">
                        Ficha {ev.ova.fichaCode} · {ev.evidenceCode}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#d94e34]/15 text-[#b8371f] font-bold shrink-0">
                        {ev.dueDate}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-950 break-words">
                      {ev.title}
                    </div>
                    <div className="text-[11px] text-stone-500 break-words">
                      {ev.ova.title} · Lección 0{ev.lesson.order}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1c5d43] shrink-0" />
                  <span>Publicaciones Recientes</span>
                </div>
                {publishedOvas.map((ova) => (
                  <div
                    key={ova.id}
                    onClick={() =>
                      handleOpenOvaInReader(ova.id, ova.lessons[0]?.id)
                    }
                    className="p-3.5 bg-white border border-stone-200/90 rounded-xl space-y-1 cursor-pointer active:bg-stone-50 min-w-0 max-w-full overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="text-[#1c5d43] font-semibold">
                        Publicado · {ova.updatedAt}
                      </span>
                      <span className="text-stone-500">
                        Ficha {ova.fichaCode}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900 break-words">
                      {ova.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BUILDER — MOBILE OVA AUTHORING IN-SITU (ZERO HORIZONTAL SCROLL) */}
          {activeTab === 'builder' && (
            <div className="p-3.5 space-y-3.5 min-w-0 max-w-full overflow-x-hidden">
              {!isInstructorAuth ? (
                <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center space-y-3">
                  <Lock className="w-8 h-8 text-stone-400 mx-auto" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Autoría Móvil de OVAs (Modo Instructor)
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Inicia sesión como docente para crear OVAs y editar textos,
                    código, diagramas y gráficos interactivos en el mismo lugar
                    desde tu dispositivo Android.
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
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <select
                      value={currentOva?.id ?? ''}
                      onChange={(e) => {
                        const next = ovas.find((o) => o.id === e.target.value);
                        setSelectedOvaId(e.target.value);
                        setSelectedLessonId(next?.lessons[0]?.id ?? '');
                      }}
                      className="min-w-0 flex-1 px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-xl text-stone-900 truncate"
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
                      <span>Nueva</span>
                    </button>
                  </div>

                  {currentOva && (
                    <div className="p-3.5 bg-white border border-stone-200 rounded-2xl space-y-2.5 min-w-0 max-w-full">
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
                        className="w-full px-3 py-1.5 text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg min-w-0"
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
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg min-w-0"
                      />

                      {/* Wrapped Lesson Pills + Add Clean Lesson (Zero horizontal scroll) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {currentOva.lessons.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setSelectedLessonId(l.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono max-w-full truncate ${
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
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-indigo-700 bg-indigo-50"
                        >
                          + Lección vacía
                        </button>
                      </div>
                    </div>
                  )}

                  {currentLesson && (
                    <div className="space-y-3 min-w-0 max-w-full overflow-hidden">
                      <input
                        type="text"
                        value={currentLesson.title}
                        onChange={(e) =>
                          handleUpdateCurrentLesson({ title: e.target.value })
                        }
                        placeholder="Título de la lección..."
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-200 rounded-xl min-w-0"
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

        {/* 3. NATIVE ANDROID BOTTOM TAB NAVIGATION BAR */}
        <nav className="bg-white border-t border-stone-200 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] grid grid-cols-4 gap-1 shrink-0 z-20">
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
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
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
            <span>Editar</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
