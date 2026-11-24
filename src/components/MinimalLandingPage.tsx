import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bell,
  Calendar,
  Lock,
  Search,
  Sparkles,
} from 'lucide-react';
import { GraphNode, Learner, Lesson, OVA } from '../types/ova';

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
  isInstructorAuth,
  onEnterOvaLesson,
  onEnterEvidencesSchedule,
  onEnterInstructorStudio,
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
  const [hoveredOvaId, setHoveredOvaId] = useState<string | null>(null);
  const [radarFilter, setRadarFilter] = useState<RadarFilter>('all');

  // Filtered Public OVAs
  const visibleOvas = useMemo(() => {
    return publishedOvas.filter((ova) => {
      const matchesFicha =
        selectedFicha === 'all' || ova.fichaCode === selectedFicha;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ova.title.toLowerCase().includes(q) ||
        ova.description.toLowerCase().includes(q) ||
        ova.code.toLowerCase().includes(q) ||
        ova.fichaCode.toLowerCase().includes(q);
      return matchesFicha && matchesSearch;
    });
  }, [publishedOvas, selectedFicha, searchQuery]);

  // Dynamic Evidence Deadlines Stream
  const evidenceReminders = useMemo(() => {
    const items: Array<{
      id: string;
      ova: OVA;
      lesson: Lesson;
      evidenceCode: string;
      activityTitle: string;
      dueDate: string;
      daysDiff: number;
    }> = [];

    const referenceDate = new Date('2026-11-09T00:00:00');

    publishedOvas.forEach((ova) => {
      if (selectedFicha !== 'all' && ova.fichaCode !== selectedFicha) return;
      ova.lessons.forEach((lesson) => {
        if (!lesson.activity) return;
        const due = new Date(`${lesson.activity.dueDate}T00:00:00`);
        const diffMs = due.getTime() - referenceDate.getTime();
        const daysDiff = Math.round(diffMs / (1000 * 60 * 60 * 24));

        items.push({
          id: `${ova.id}-${lesson.id}-${lesson.activity.id}`,
          ova,
          lesson,
          evidenceCode: lesson.activity.evidenceCode,
          activityTitle: lesson.activity.title,
          dueDate: lesson.activity.dueDate,
          daysDiff,
        });
      });
    });

    return items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [publishedOvas, selectedFicha]);

  // Recent OVA Publications Stream
  const recentPublications = useMemo(() => {
    return publishedOvas
      .filter(
        (ova) => selectedFicha === 'all' || ova.fichaCode === selectedFicha
      )
      .map((ova) => ({
        id: `pub-${ova.id}`,
        ova,
        updatedAt: ova.updatedAt,
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [publishedOvas, selectedFicha]);

  return (
    <div className="landing-paper-surface min-h-[calc(100vh-7.5rem)] rounded-2xl border border-stone-300/90 overflow-hidden shadow-xs flex flex-col">
      {/* 1. CLEAN MINIMALIST HEADER & FILTER BAR */}
      <section className="border-b border-stone-300/80 px-6 sm:px-8 py-6 lg:py-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-stone-500">
            <span className="h-2 w-2 rounded-full bg-[#d94e34]" />
            <span>Catálogo Abierto de Objetos Virtuales de Aprendizaje</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-950 leading-tight font-display">
            Contenidos formativos y anuncios de evidencias.
          </h1>
        </div>

        {/* Minimalist Search & Ficha Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar OVA o ficha..."
              className="w-full sm:w-56 pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-stone-300/80">
            {(['all', ...allFichas] as string[]).map((ficha) => {
              const active = selectedFicha === ficha;
              return (
                <button
                  key={ficha}
                  type="button"
                  onClick={() => setSelectedFicha(ficha)}
                  className={`relative px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
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
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-[#d94e34] transition-colors whitespace-nowrap"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isInstructorAuth ? 'Estudio Docente' : 'Instructor'}</span>
          </button>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE:
          LEFT (9 cols): Clean Public OVA Publications (Top-right info, Title, Description, Button to enter OVA)
          RIGHT (3 cols): Slimmer Announcements & Deadlines Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-300/80">
        {/* LEFT COLUMN (9 COLS): CLEAN OVA PUBLICATIONS */}
        <div className="lg:col-span-9 divide-y divide-stone-300/80">
          {visibleOvas.map((ova) => {
            const isHovered = hoveredOvaId === ova.id;

            return (
              <motion.article
                key={ova.id}
                onMouseEnter={() => setHoveredOvaId(ova.id)}
                onMouseLeave={() => setHoveredOvaId(null)}
                className="relative p-6 sm:p-8 bg-transparent hover:bg-white/80 transition-colors"
              >
                {/* Subtle Left Accent on Hover */}
                <motion.div
                  initial={false}
                  animate={{
                    scaleY: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#d94e34] origin-top"
                />

                <div className="space-y-3">
                  {/* Top Row: Title on Left + Metadata Information maintained in Top-Right */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-stone-950 leading-snug font-display">
                      {ova.title}
                    </h2>

                    {/* Information kept strictly in the top-right */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 shrink-0 sm:text-right">
                      <span className="px-2 py-0.5 bg-stone-900 text-stone-100 rounded font-semibold">
                        Ficha {ova.fichaCode}
                      </span>
                      <span>·</span>
                      <span>{ova.lessons.length} lecciones</span>
                      <span>·</span>
                      <span>{ova.estimatedHours}h</span>
                      <span>·</span>
                      <span>{ova.updatedAt}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
                    {ova.description}
                  </p>

                  {/* Single Clean Button to Enter the OVA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEnterOvaLesson(ova.id, ova.lessons[0]?.id)
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-[#d94e34] rounded-lg transition-colors group"
                    >
                      <span>Entrar a la OVA</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}

          {visibleOvas.length === 0 && (
            <div className="p-12 text-center text-sm text-stone-500">
              No se encontraron OVAs públicos con ese criterio de búsqueda.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (3 COLS): SLIM ANNOUNCEMENTS & REMINDERS SIDEBAR */}
        <aside className="lg:col-span-3 bg-[#f3f1ea]/60 flex flex-col">
          <div className="px-4 py-3.5 border-b border-stone-300/80 space-y-2.5 bg-[#f1efe8]/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#d94e34]" />
                <span>Anuncios</span>
              </span>
              <button
                type="button"
                onClick={() => onEnterEvidencesSchedule()}
                className="text-[11px] font-mono text-stone-600 hover:text-[#d94e34] underline"
              >
                Cronograma
              </button>
            </div>

            {/* Compact Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-stone-200/70 rounded-lg text-[10px] font-mono">
              {(
                [
                  { id: 'all', label: 'Todo' },
                  { id: 'deadlines', label: 'Fechas' },
                  { id: 'publications', label: 'Recientes' },
                ] as Array<{ id: RadarFilter; label: string }>
              ).map((tab) => {
                const active = radarFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRadarFilter(tab.id)}
                    className={`py-1 px-1.5 rounded-md transition-colors text-center truncate ${
                      active
                        ? 'bg-white text-stone-950 font-bold shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slim Stream Content */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {(radarFilter === 'all' || radarFilter === 'deadlines') && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Fechas de Evidencias
                </div>
                {evidenceReminders.map((item) => {
                  const isOverdue = item.daysDiff < 0;
                  const isUrgent = item.daysDiff >= 0 && item.daysDiff <= 3;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 2 }}
                      onClick={() =>
                        onEnterOvaLesson(item.ova.id, item.lesson.id)
                      }
                      className="p-3 bg-white border border-stone-300/80 hover:border-stone-900 rounded-lg cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                        <span className="text-stone-500">
                          Ficha {item.ova.fichaCode}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-900'
                              : isUrgent
                              ? 'bg-[#d94e34]/15 text-[#b8371f]'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          <Calendar className="w-2.5 h-2.5" />
                          {item.dueDate}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-900 leading-snug line-clamp-2">
                        {item.activityTitle}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500 truncate">
                        {item.evidenceCode}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {(radarFilter === 'all' || radarFilter === 'publications') && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#1c5d43]" />
                  <span>Publicaciones Recientes</span>
                </div>
                {recentPublications.map((pub) => (
                  <motion.div
                    key={pub.id}
                    whileHover={{ x: 2 }}
                    onClick={() =>
                      onEnterOvaLesson(pub.ova.id, pub.ova.lessons[0]?.id)
                    }
                    className="p-3 bg-white/90 border border-stone-300/80 hover:border-[#1c5d43] rounded-lg cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#1c5d43] font-semibold">
                        {pub.updatedAt}
                      </span>
                      <span className="text-stone-500">
                        Ficha {pub.ova.fichaCode}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900 leading-snug line-clamp-2">
                      {pub.ova.title}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
