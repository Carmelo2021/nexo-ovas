import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Compass,
  FileText,
  Filter,
  Link2,
  Lock,
  Radio,
  Search,
  Sparkles,
  UserCheck,
  Video,
} from 'lucide-react';
import { GraphNode, Learner, Lesson, OVA } from '../types/ova';
import {
  ensureLessonBlocks,
  LessonBlocksRenderer,
} from './NotionLessonBlocks';

interface MinimalLandingPageProps {
  ovas: OVA[];
  nodes: GraphNode[];
  learners: Learner[];
  isInstructorAuth: boolean;
  onEnterOvaLesson: (ovaId: string, lessonId?: string) => void;
  onEnterEvidencesSchedule: (ovaId?: string) => void;
  onEnterInstructorStudio: () => void;
  onOpenPrintGuide: (ovaId: string) => void;
}

type RadarFilter = 'all' | 'deadlines' | 'publications';

export const MinimalLandingPage: React.FC<MinimalLandingPageProps> = ({
  ovas,
  nodes,
  learners,
  isInstructorAuth,
  onEnterOvaLesson,
  onEnterEvidencesSchedule,
  onEnterInstructorStudio,
  onOpenPrintGuide,
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

  const [selectedFicha, setSelectedFicha] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOvaId, setExpandedOvaId] = useState<string | null>(
    publishedOvas[0]?.id ?? null
  );
  const [previewLessonByOva, setPreviewLessonByOva] = useState<
    Record<string, string>
  >({});
  const [hoveredOvaId, setHoveredOvaId] = useState<string | null>(null);

  // Dynamic Reminders & Publications Panel state
  const [radarFilter, setRadarFilter] = useState<RadarFilter>('all');
  const [quickLearnerDoc, setQuickLearnerDoc] = useState<string>('');
  const [matchedLearnerId, setMatchedLearnerId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const matchedLearner = useMemo(
    () => learners.find((l) => l.id === matchedLearnerId) ?? null,
    [learners, matchedLearnerId]
  );

  const handleQuickLearnerCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickLearnerDoc.trim().toLowerCase();
    if (!q) {
      setMatchedLearnerId(null);
      return;
    }
    const found = learners.find(
      (l) =>
        l.documentNumber.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q)
    );
    setMatchedLearnerId(found ? found.id : null);
  };

  // Filtered Public OVAs
  const visibleOvas = useMemo(() => {
    return publishedOvas.filter((ova) => {
      const matchesFicha =
        selectedFicha === 'all' || ova.fichaCode === selectedFicha;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ova.title.toLowerCase().includes(q) ||
        ova.code.toLowerCase().includes(q) ||
        ova.fichaCode.toLowerCase().includes(q) ||
        ova.learningOutcome.toLowerCase().includes(q) ||
        ova.lessons.some((l) => l.title.toLowerCase().includes(q));
      return matchesFicha && matchesSearch;
    });
  }, [publishedOvas, selectedFicha, searchQuery]);

  // Dynamic Evidence Deadlines & Reminders Stream
  const evidenceReminders = useMemo(() => {
    const items: Array<{
      id: string;
      ova: OVA;
      lesson: Lesson;
      evidenceCode: string;
      activityTitle: string;
      evidenceType: 'Conocimiento' | 'Desempeño' | 'Producto';
      dueDate: string;
      deliverableFormat: string;
      daysDiff: number;
      learnerStatus?: 'pending' | 'submitted' | 'late';
    }> = [];

    const referenceDate = new Date('2026-11-09T00:00:00');

    publishedOvas.forEach((ova) => {
      if (selectedFicha !== 'all' && ova.fichaCode !== selectedFicha) return;
      ova.lessons.forEach((lesson) => {
        if (!lesson.activity) return;
        const due = new Date(`${lesson.activity.dueDate}T00:00:00`);
        const diffMs = due.getTime() - referenceDate.getTime();
        const daysDiff = Math.round(diffMs / (1000 * 60 * 60 * 24));

        const sub =
          matchedLearner?.progressByOva?.[ova.id]?.submissions?.[lesson.id];

        items.push({
          id: `${ova.id}-${lesson.id}-${lesson.activity.id}`,
          ova,
          lesson,
          evidenceCode: lesson.activity.evidenceCode,
          activityTitle: lesson.activity.title,
          evidenceType: lesson.activity.evidenceType,
          dueDate: lesson.activity.dueDate,
          deliverableFormat: lesson.activity.deliverableFormat,
          daysDiff,
          learnerStatus: sub?.status,
        });
      });
    });

    return items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [publishedOvas, selectedFicha, matchedLearner]);

  // Recent OVA & Lesson Publications Stream
  const recentPublications = useMemo(() => {
    return publishedOvas
      .filter(
        (ova) => selectedFicha === 'all' || ova.fichaCode === selectedFicha
      )
      .map((ova) => {
        let linkCount = 0;
        let videoCount = 0;
        let codeCount = 0;
        ova.lessons.forEach((l) => {
          const blks = ensureLessonBlocks(l);
          blks.forEach((b) => {
            if (b.type === 'link') linkCount += 1;
            if (b.type === 'video') videoCount += 1;
            if (b.type === 'code') codeCount += 1;
          });
        });
        return {
          id: `pub-${ova.id}`,
          ova,
          updatedAt: ova.updatedAt,
          lessonCount: ova.lessons.length,
          linkCount,
          videoCount,
          codeCount,
        };
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [publishedOvas, selectedFicha]);

  // Global metrics for kinetic header
  const totalMetrics = useMemo(() => {
    let lessons = 0;
    let interactiveBlocks = 0;
    let evidences = 0;
    publishedOvas.forEach((o) => {
      lessons += o.lessons.length;
      o.lessons.forEach((l) => {
        interactiveBlocks += ensureLessonBlocks(l).length;
        if (l.activity) evidences += 1;
      });
    });
    return {
      ovas: publishedOvas.length,
      lessons,
      interactiveBlocks,
      evidences,
    };
  }, [publishedOvas]);

  return (
    <div className="landing-paper-surface min-h-[calc(100vh-7.5rem)] rounded-2xl border border-stone-300/90 overflow-hidden shadow-xs">
      {/* 1. ARCHITECTURAL TELEMETRY TICKER BAR */}
      <div className="border-b border-stone-300/80 px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 bg-[#f1efe8]/80 text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#d94e34]" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d94e34]" />
          </span>
          <span className="font-mono uppercase tracking-widest text-[11px] font-semibold text-stone-800">
            Edición Abierta · Objetos Virtuales y Radar de Evidencias SENA
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-stone-600">
          <span>
            <strong className="text-stone-900">{totalMetrics.ovas}</strong> OVAs
            públicos
          </span>
          <span aria-hidden="true">/</span>
          <span>
            <strong className="text-stone-900">
              {totalMetrics.interactiveBlocks}
            </strong>{' '}
            bloques interactivos
          </span>
          <span aria-hidden="true">/</span>
          <span>
            <strong className="text-[#d94e34]">{totalMetrics.evidences}</strong>{' '}
            fechas de evidencia activas
          </span>
        </div>
      </div>

      {/* 2. ASYMMETRIC EDITORIAL MASTHEAD & LENS CONTROLLER */}
      <section className="border-b border-stone-300/80 px-5 sm:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-400/60 bg-white/70 text-[11px] font-mono text-stone-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d94e34]" />
            <span>
              Acceso directo sin contraseña para aprendices · Sincronizado con
              el Lienzo en Grafo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 leading-[1.08] font-display"
          >
            Conocimiento conectado,{' '}
            <span className="underline decoration-[#d94e34] decoration-2 underline-offset-8">
              bloques vivos
            </span>{' '}
            y cronograma de evidencias en tiempo real.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed"
          >
            Explora los Objetos Virtuales de Aprendizaje construidos desde el
            mapa conceptual del instructor: previsualiza enlaces y videos al
            pasar el cursor, inspecciona segmentos de código fuente y verifica
            las próximas fechas de entrega de tu Ficha.
          </motion.p>
        </div>

        {/* Minimalist Search & Ficha Filter Lens */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-3"
        >
          {/* Search Input with kinetic focus border */}
          <div className="relative group">
            <Search className="w-4 h-4 text-stone-400 group-focus-within:text-[#d94e34] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar OVA, código de ficha, lección o competencia..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-stone-500 hover:text-stone-900"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Animated Ficha Selector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mr-1">
                Ficha:
              </span>
              {(['all', ...allFichas] as string[]).map((ficha) => {
                const active = selectedFicha === ficha;
                return (
                  <button
                    key={ficha}
                    type="button"
                    onClick={() => setSelectedFicha(ficha)}
                    className={`relative px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                      active
                        ? 'text-white font-semibold'
                        : 'text-stone-700 hover:text-stone-950 bg-white/80 border border-stone-300/80'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="ficha-pill-bg"
                        className="absolute inset-0 bg-stone-900 rounded-lg"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {ficha === 'all' ? 'Todas' : `#${ficha}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onEnterInstructorStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:text-[#d94e34] transition-colors group"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#d94e34] transition-colors" />
              <span>
                {isInstructorAuth
                  ? 'Abrir Estudio del Instructor'
                  : 'Autoría Docente'}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 3. CORE ASYMMETRIC ARCHITECTURAL WORKSPACE:
          LEFT (7 cols): Minimalist Interactive OVA Index with In-Situ Block Drawer
          RIGHT (5 cols): Dynamic Radar of Evidence Deadlines & Recent Publications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-300/80">
        {/* LEFT COLUMN (7 COLS): MINIMALIST OVA SPECIMEN INDEX */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="px-5 sm:px-8 py-4 border-b border-stone-300/80 flex items-center justify-between bg-[#f1efe8]/40">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-stone-400">
                01 //
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Índice Público de Contenidos (OVAs)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              Haz clic en un OVA para previsualizar sus bloques o entrar a
              estudiar
            </span>
          </div>

          <div className="divide-y divide-stone-300/80">
            {visibleOvas.map((ova, idx) => {
              const isExpanded = expandedOvaId === ova.id;
              const isHovered = hoveredOvaId === ova.id;
              const activePreviewLessonId =
                previewLessonByOva[ova.id] ?? ova.lessons[0]?.id;
              const activePreviewLesson =
                ova.lessons.find((l) => l.id === activePreviewLessonId) ??
                ova.lessons[0];

              // Calculate block composition for micro-bar
              let textBlocks = 0;
              let linkBlocks = 0;
              let videoBlocks = 0;
              let codeBlocks = 0;
              ova.lessons.forEach((l) => {
                ensureLessonBlocks(l).forEach((b) => {
                  if (b.type === 'link') linkBlocks += 1;
                  else if (b.type === 'video') videoBlocks += 1;
                  else if (b.type === 'code') codeBlocks += 1;
                  else textBlocks += 1;
                });
              });

              return (
                <motion.article
                  key={ova.id}
                  layout="position"
                  onMouseEnter={() => setHoveredOvaId(ova.id)}
                  onMouseLeave={() => setHoveredOvaId(null)}
                  className={`relative transition-colors ${
                    isExpanded
                      ? 'bg-white'
                      : 'hover:bg-white/75 bg-transparent'
                  }`}
                >
                  {/* Kinetic Left Accent Bar on Hover / Active */}
                  <motion.div
                    initial={false}
                    animate={{
                      scaleY: isExpanded || isHovered ? 1 : 0,
                      backgroundColor: isExpanded ? '#d94e34' : '#121211',
                    }}
                    transition={{ duration: 0.22 }}
                    className="absolute left-0 top-0 bottom-0 w-1 origin-top"
                  />

                  {/* Main Minimalist Row Header */}
                  <div className="p-5 sm:p-7 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <motion.span
                          animate={{ x: isHovered ? 3 : 0 }}
                          className="text-sm font-bold text-[#d94e34]"
                        >
                          0{idx + 1}
                        </motion.span>
                        <span className="px-2 py-0.5 bg-stone-900 text-stone-100 rounded text-[11px] font-semibold">
                          Ficha {ova.fichaCode}
                        </span>
                        <span className="text-stone-500">{ova.code}</span>
                      </div>

                      <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                        <span>{ova.lessons.length} lecciones</span>
                        <span>·</span>
                        <span>{ova.estimatedHours}h</span>
                        <span>·</span>
                        <span>Act. {ova.updatedAt}</span>
                      </div>
                    </div>

                    {/* Title & Description with micro-shift */}
                    <div
                      onClick={() =>
                        setExpandedOvaId(isExpanded ? null : ova.id)
                      }
                      className="cursor-pointer group space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-stone-950 group-hover:text-[#d94e34] transition-colors leading-snug font-display">
                          {ova.title}
                        </h3>
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 24,
                          }}
                          className="p-1.5 rounded-full border border-stone-300 text-stone-600 group-hover:border-stone-900 group-hover:text-stone-900 shrink-0 mt-0.5"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                        {ova.description}
                      </p>
                    </div>

                    {/* Micro-Interactive Composition Strip & Direct Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80">
                      {/* Block Composition Telemetry Chips */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-600">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-stone-500" />
                          {textBlocks} texto
                        </span>
                        <span className="inline-flex items-center gap-1 text-indigo-800">
                          <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                          {linkBlocks} enlaces hover
                        </span>
                        <span className="inline-flex items-center gap-1 text-rose-800">
                          <Video className="w-3.5 h-3.5 text-rose-600" />
                          {videoBlocks} videos hover
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-900">
                          <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                          {codeBlocks} segmentos código
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOvaId(isExpanded ? null : ova.id)
                          }
                          className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-300/80 rounded-lg transition-colors"
                        >
                          {isExpanded
                            ? 'Cerrar Previsualización'
                            : 'Explorar Bloques Aquí'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onEnterOvaLesson(ova.id, ova.lessons[0]?.id)
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-[#d94e34] rounded-lg transition-colors group"
                        >
                          <span>Entrar al OVA</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDABLE IN-SITU LESSON & BLOCKS MICRO-READER */}
                  <AnimatePresence initial={false}>
                    {isExpanded && activePreviewLesson && (
                      <motion.div
                        key={`drawer-${ova.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.32,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="overflow-hidden border-t border-stone-200 bg-[#faf9f5]"
                      >
                        <div className="p-5 sm:p-7 space-y-5">
                          {/* Lesson Selector Tabs inside Drawer */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {ova.lessons.map((lesson) => {
                                const isCurrent =
                                  lesson.id === activePreviewLesson.id;
                                return (
                                  <button
                                    key={lesson.id}
                                    type="button"
                                    onClick={() =>
                                      setPreviewLessonByOva((prev) => ({
                                        ...prev,
                                        [ova.id]: lesson.id,
                                      }))
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                      isCurrent
                                        ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                                        : 'bg-white text-stone-700 border border-stone-300/80 hover:border-stone-500'
                                    }`}
                                  >
                                    Lección 0{lesson.order} ·{' '}
                                    {lesson.durationMinutes}m
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenPrintGuide(ova.id)}
                                className="px-2.5 py-1 text-[11px] font-mono text-stone-600 hover:text-stone-950 border border-stone-300 rounded-md bg-white"
                              >
                                Guía PDF
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onEnterOvaLesson(
                                    ova.id,
                                    activePreviewLesson.id
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#d94e34] hover:underline"
                              >
                                Abrir Lección 0{activePreviewLesson.order}{' '}
                                completa →
                              </button>
                            </div>
                          </div>

                          {/* Active Lesson Preview Box with live Hover Previews for Links/Videos & Copyable Code */}
                          <div className="p-5 bg-white border border-stone-200/90 rounded-xl space-y-4 shadow-2xs">
                            <div className="border-b border-stone-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <div className="text-[11px] font-mono text-[#d94e34] font-semibold uppercase tracking-wider">
                                  Vista Rápida Interactiva · Pasa el cursor
                                  sobre enlaces o videos
                                </div>
                                <h4 className="text-base font-bold text-stone-950 mt-0.5">
                                  {activePreviewLesson.title}
                                </h4>
                              </div>
                              {activePreviewLesson.activity && (
                                <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-900 font-mono text-[11px]">
                                  Evidencia vence:{' '}
                                  {activePreviewLesson.activity.dueDate}
                                </span>
                              )}
                            </div>

                            <LessonBlocksRenderer
                              lesson={activePreviewLesson}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): DYNAMIC REMINDERS, EVIDENCE DEADLINES & RECENT PUBLICATIONS RADAR */}
        <aside className="lg:col-span-5 flex flex-col bg-[#f3f1ea]/60">
          {/* Radar Top Header & Filter Switcher */}
          <div className="px-5 sm:px-7 py-4 border-b border-stone-300/80 space-y-3 bg-[#f1efe8]/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-stone-400">
                  02 //
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span>Radar de Recordatorios y Publicaciones</span>
                </h2>
              </div>
              <Radio className="w-4 h-4 text-[#d94e34] animate-pulse" />
            </div>

            {/* 3-Tab Minimalist Filter */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-200/70 rounded-xl text-xs font-mono">
              {(
                [
                  { id: 'all', label: 'Todo el Pulso' },
                  {
                    id: 'deadlines',
                    label: `Evidencias (${evidenceReminders.length})`,
                  },
                  {
                    id: 'publications',
                    label: `Nuevos OVAs (${recentPublications.length})`,
                  },
                ] as Array<{ id: RadarFilter; label: string }>
              ).map((tab) => {
                const active = radarFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRadarFilter(tab.id)}
                    className={`relative py-1.5 px-2 rounded-lg text-[11px] transition-colors text-center truncate ${
                      active
                        ? 'text-stone-950 font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="radar-tab-pill"
                        className="absolute inset-0 bg-white rounded-lg shadow-2xs"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Learner Quick-Check Micro-Widget inside the Reminders Panel */}
          <div className="px-5 sm:px-7 py-3.5 border-b border-stone-300/80 bg-white/60">
            <form
              onSubmit={handleQuickLearnerCheck}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <UserCheck className="w-4 h-4 text-[#1c5d43] shrink-0" />
                <input
                  type="text"
                  value={quickLearnerDoc}
                  onChange={(e) => setQuickLearnerDoc(e.target.value)}
                  placeholder="Tu documento o nombre para personalizar fechas (ej. Valentina o 1032)..."
                  className="w-full text-xs bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              {matchedLearner ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuickLearnerDoc('');
                    setMatchedLearnerId(null);
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-[#1c5d43] text-white rounded shrink-0"
                >
                  {matchedLearner.name.split(' ')[0]} · Ficha{' '}
                  {matchedLearner.fichaCode} ✕
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-2.5 py-1 text-[11px] font-mono font-semibold text-stone-700 hover:text-stone-950 bg-stone-200/70 rounded-md shrink-0"
                >
                  Verificar
                </button>
              )}
            </form>
          </div>

          {/* Dynamic Stream Content */}
          <div className="p-5 sm:p-7 space-y-6 flex-1">
            {/* A. EVIDENCE REMINDERS & DEADLINES SECTION */}
            {(radarFilter === 'all' || radarFilter === 'deadlines') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#d94e34]" />
                    Cronograma y Recordatorios de Evidencias
                  </span>
                  <button
                    type="button"
                    onClick={() => onEnterEvidencesSchedule()}
                    className="text-stone-800 hover:text-[#d94e34] underline"
                  >
                    Ver todas →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {evidenceReminders.map((item) => {
                    const isOverdue = item.daysDiff < 0;
                    const isUrgent = item.daysDiff >= 0 && item.daysDiff <= 3;
                    const isSubmitted = item.learnerStatus === 'submitted';

                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 4 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 28,
                        }}
                        onClick={() =>
                          onEnterOvaLesson(item.ova.id, item.lesson.id)
                        }
                        className="group p-4 bg-white border border-stone-300/90 hover:border-stone-900 rounded-xl cursor-pointer transition-colors shadow-2xs space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">
                              {item.evidenceCode}
                            </span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-600">
                              Ficha {item.ova.fichaCode}
                            </span>
                          </div>

                          {/* Urgency or Personalized Learner Status Badge */}
                          {isSubmitted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Entregada
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                                isOverdue
                                  ? 'bg-rose-100 text-rose-900'
                                  : isUrgent
                                  ? 'bg-[#d94e34]/15 text-[#b8371f]'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              {item.dueDate}{' '}
                              {isOverdue
                                ? '(Plazo cumplido)'
                                : item.daysDiff === 0
                                ? '(Vence hoy)'
                                : `(En ${item.daysDiff}d)`}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-stone-950 group-hover:text-[#d94e34] transition-colors">
                              {item.activityTitle}
                            </h4>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {item.ova.title} · Lección 0{item.lesson.order}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#d94e34] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                          <span>
                            Evidencia de{' '}
                            <strong className="text-stone-700">
                              {item.evidenceType}
                            </strong>
                          </span>
                          <span className="font-mono text-[10px] text-stone-500 truncate max-w-[190px]">
                            {item.deliverableFormat}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* B. RECENT OVA PUBLICATIONS & UPDATES FEED */}
            {(radarFilter === 'all' || radarFilter === 'publications') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1c5d43]" />
                    Publicaciones y Actualizaciones Recientes de OVAs
                  </span>
                </div>

                <div className="space-y-2.5">
                  {recentPublications.map((pub) => (
                    <motion.div
                      key={pub.id}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 28,
                      }}
                      onClick={() =>
                        onEnterOvaLesson(
                          pub.ova.id,
                          pub.ova.lessons[0]?.id
                        )
                      }
                      className="group p-4 bg-white/90 border border-stone-300/80 hover:border-[#1c5d43] rounded-xl cursor-pointer transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#1c5d43]/10 text-[#1c5d43] font-semibold">
                          Publicado · {pub.updatedAt}
                        </span>
                        <span className="text-stone-500">
                          Ficha {pub.ova.fichaCode}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#1c5d43] transition-colors">
                          {pub.ova.title}
                        </h4>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#1c5d43] shrink-0" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-500">
                        <span>{pub.lessonCount} lecciones</span>
                        <span>·</span>
                        <span>+{pub.linkCount} enlaces</span>
                        <span>·</span>
                        <span>+{pub.videoCount} videos</span>
                        <span>·</span>
                        <span>+{pub.codeCount} bloques código</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 4. BOTTOM MINIMALIST CONSTELLATION BAR: LIVE CONNECTION TO KNOWLEDGE GRAPH NODES */}
      <div className="border-t border-stone-300/80 px-5 sm:px-8 py-4 bg-[#f1efe8]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs">
          <Compass className="w-4 h-4 text-[#d94e34] shrink-0" />
          <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-stone-800">
            Nodos del Lienzo Conectados a OVAs:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {nodes
            .filter((n) => n.linkedOvaId)
            .slice(0, 6)
            .map((node) => {
              const isHovered = hoveredNodeId === node.id;
              return (
                <motion.button
                  key={node.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() =>
                    node.linkedOvaId &&
                    onEnterOvaLesson(node.linkedOvaId, node.linkedLessonId)
                  }
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    isHovered
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-300/90'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1c5d43]" />
                  <span className="truncate max-w-[180px]">{node.title}</span>
                </motion.button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
