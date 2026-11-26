import React, { useEffect, useState } from 'react';
import {
  Eye,
  Lock,
  LogOut,
  Printer,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { InstructorLoginModal } from './components/InstructorLoginModal';
import { KarpathyBrainStudio } from './components/KarpathyBrainStudio';
import { KnowledgeGraphCanvas } from './components/KnowledgeGraphCanvas';
import { LearnerProgressAndReminders } from './components/LearnerProgressAndReminders';
import { MinimalLandingPage } from './components/MinimalLandingPage';
import { MobileAppShell } from './components/MobileAppShell';
import { OvaBuilderView } from './components/OvaBuilderView';
import {
  blocksToMarkdown,
  ensureLessonBlocks,
  ensureNodeBlocks,
} from './components/NotionLessonBlocks';
import { PrintableStudyGuideModal } from './components/PrintableStudyGuideModal';
import { PublicLearnerPortal } from './components/PublicLearnerPortal';
import {
  DEFAULT_INSTRUCTOR,
  INITIAL_EDGES,
  INITIAL_LEARNERS,
  INITIAL_NODES,
  INITIAL_OVAS,
  INITIAL_REGIONS,
  INITIAL_REMINDER_TEMPLATES,
  INITIAL_SENT_REMINDERS,
} from './data/initialData';
import {
  GraphEdge,
  GraphNode,
  GraphRegion,
  Learner,
  Lesson,
  OVA,
  SentReminderLog,
} from './types/ova';

type InstructorTab = 'graph' | 'ovas' | 'brain' | 'learners' | 'reminders';
type PublicSection = 'catalog' | 'evidences' | 'progress';

const STORAGE_KEYS = {
  NODES: 'nexoova_sena_nodes_v4_js_135ex',
  EDGES: 'nexoova_sena_edges_v4_js_135ex',
  REGIONS: 'nexoova_sena_regions_v4_js_135ex',
  OVAS: 'nexoova_sena_ovas_v4_js_135ex',
  LEARNERS: 'nexoova_sena_learners_v4_js_135ex',
  LOGS: 'nexoova_sena_logs_v4_js_135ex',
  AUTH: 'nexoova_sena_instructor_auth_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Exclusive Instructor Authentication State
  const [isInstructorAuth, setIsInstructorAuth] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.AUTH, false)
  );
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Workspace Mode: when Instructor is logged in, they can work in 'instructor' mode or preview 'public_learner' mode.
  // When not logged in, only 'public_learner' mode is accessible.
  const [workspaceMode, setWorkspaceMode] = useState<
    'instructor' | 'public_learner'
  >(() => (loadFromStorage(STORAGE_KEYS.AUTH, false) ? 'instructor' : 'public_learner'));

  const [instructorTab, setInstructorTab] = useState<InstructorTab>('graph');
  const [publicSection, setPublicSection] = useState<PublicSection>('catalog');

  // Temporary Minimalist Landing Page state & deep-linking
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [deepLinkOvaId, setDeepLinkOvaId] = useState<string | null>(null);
  const [deepLinkLessonId, setDeepLinkLessonId] = useState<string | null>(null);

  // Mobile App Version State (Auto-enabled on mobile screens / Android APK WebView, or toggled from header)
  const [isMobileAppMode, setIsMobileAppMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'mobile') return true;
    return window.innerWidth < 768 || navigator.userAgent.includes('wv');
  });

  // Core Reactive Persistent State
  const [nodes, setNodes] = useState<GraphNode[]>(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.NODES, INITIAL_NODES);
    return loaded.map((node) => {
      if (node.blocks && node.blocks.length > 0) return node;
      const seedNode = INITIAL_NODES.find((sn) => sn.id === node.id);
      if (seedNode?.blocks && seedNode.blocks.length > 0) {
        return {
          ...node,
          type: seedNode.type,
          codeLanguage: node.codeLanguage ?? seedNode.codeLanguage,
          mediaComment: node.mediaComment ?? seedNode.mediaComment,
          blocks: seedNode.blocks,
        };
      }
      return {
        ...node,
        blocks: ensureNodeBlocks(node),
      };
    });
  });
  const [edges, setEdges] = useState<GraphEdge[]>(() =>
    loadFromStorage(STORAGE_KEYS.EDGES, INITIAL_EDGES)
  );
  const [regions, setRegions] = useState<GraphRegion[]>(() =>
    loadFromStorage(STORAGE_KEYS.REGIONS, INITIAL_REGIONS)
  );
  const [ovas, setOvas] = useState<OVA[]>(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.OVAS, INITIAL_OVAS);
    // Hydrate any stored lessons that predate Notion blocks with seed blocks or auto-parsed blocks
    return loaded.map((ova) => {
      const seedOva = INITIAL_OVAS.find((s) => s.id === ova.id);
      return {
        ...ova,
        lessons: ova.lessons.map((lesson) => {
          if (lesson.blocks && lesson.blocks.length > 0) return lesson;
          const seedLesson = seedOva?.lessons.find((sl) => sl.id === lesson.id);
          if (seedLesson?.blocks && seedLesson.blocks.length > 0) {
            return {
              ...lesson,
              blocks: seedLesson.blocks,
              mediaComment: lesson.mediaComment ?? seedLesson.mediaComment,
            };
          }
          return {
            ...lesson,
            blocks: ensureLessonBlocks(lesson),
          };
        }),
      };
    });
  });
  const [learners, setLearners] = useState<Learner[]>(() =>
    loadFromStorage(STORAGE_KEYS.LEARNERS, INITIAL_LEARNERS)
  );
  const [sentLogs, setSentLogs] = useState<SentReminderLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.LOGS, INITIAL_SENT_REMINDERS)
  );

  // Active Learner in Public View
  const [activeLearnerId, setActiveLearnerId] = useState<string>(
    INITIAL_LEARNERS[0].id
  );

  // Printable PDF Study Guide Modal state
  const [printGuideOvaId, setPrintGuideOvaId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
    } catch {
      // ignore storage quota errors
    }
  }, [nodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EDGES, JSON.stringify(edges));
    } catch {
      // ignore
    }
  }, [edges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
    } catch {
      // ignore
    }
  }, [regions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OVAS, JSON.stringify(ovas));
    } catch {
      // ignore
    }
  }, [ovas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNERS, JSON.stringify(learners));
    } catch {
      // ignore
    }
  }, [learners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sentLogs));
    } catch {
      // ignore
    }
  }, [sentLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify(isInstructorAuth)
      );
    } catch {
      // ignore
    }
  }, [isInstructorAuth]);

  const effectiveMode = isInstructorAuth ? workspaceMode : 'public_learner';

  // Handler: Promote or Sync a Node from the Obsidian Graph Canvas into an OVA Lesson
  const handlePromoteNodeToOva = (
    nodeId: string,
    ovaId: string,
    mode: 'new_lesson' | 'append_first' | 'sync_lesson',
    targetSpecificLessonId?: string
  ) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const nodeBlocks = ensureNodeBlocks(node);
    let resolvedLessonId = targetSpecificLessonId || '';

    setOvas((prev) =>
      prev.map((ova) => {
        if (ova.id !== ovaId) return ova;

        if (mode === 'new_lesson' || ova.lessons.length === 0) {
          const newOrder = ova.lessons.length + 1;
          const newLessonId = `les-${Date.now()}`;
          resolvedLessonId = newLessonId;
          const createdLesson: Lesson = {
            id: newLessonId,
            order: newOrder,
            title: node.title,
            durationMinutes: 45,
            summary: `Lección construida desde el Lienzo en Grafo (${node.tags.join(', ')}).`,
            contentMarkdown: blocksToMarkdown(nodeBlocks),
            blocks: nodeBlocks,
            mediaUrl: node.mediaUrl,
            mediaTitle: node.type === 'media' ? node.title : undefined,
            mediaComment: node.mediaComment ?? node.content,
            linkedNodeIds: [node.id],
            quiz: node.quizQuestions ? [...node.quizQuestions] : [],
            activity:
              node.type === 'activity'
                ? {
                    id: `act-${Date.now()}`,
                    title: node.title,
                    evidenceCode: 'GA7-220501096-AA1-EV03',
                    evidenceType: node.evidenceType ?? 'Producto',
                    instructions: node.content,
                    dueDate: node.dueDate ?? '2026-11-16',
                    deliverableFormat: 'Repositorio Git o documento PDF',
                  }
                : undefined,
          };

          return {
            ...ova,
            updatedAt: '2026-11-09',
            lessons: [...ova.lessons, createdLesson],
          };
        }

        // Sync or Append into a specific target lesson (or first lesson if not specified)
        const targetLesson =
          ova.lessons.find((l) => l.id === targetSpecificLessonId) ??
          ova.lessons[0];
        resolvedLessonId = targetLesson.id;

        const existingBlocks = ensureLessonBlocks(targetLesson);
        const hasBlocksFromThisNode = existingBlocks.some(
          (b) => b.sourceNodeId === node.id
        );

        let nextBlocks;
        if (mode === 'sync_lesson' && hasBlocksFromThisNode) {
          // Replace the blocks that belong to this node in place
          const firstIdx = existingBlocks.findIndex(
            (b) => b.sourceNodeId === node.id
          );
          const withoutThisNode = existingBlocks.filter(
            (b) => b.sourceNodeId !== node.id
          );
          nextBlocks = [...withoutThisNode];
          nextBlocks.splice(firstIdx, 0, ...nodeBlocks);
        } else if (
          mode === 'sync_lesson' &&
          targetLesson.linkedNodeIds.length === 1 &&
          targetLesson.linkedNodeIds[0] === node.id
        ) {
          // Lesson is exclusively backed by this node
          nextBlocks = [...nodeBlocks];
        } else {
          // Append heading + node blocks
          const withoutOldFromNode = existingBlocks.filter(
            (b) => b.sourceNodeId !== node.id
          );
          nextBlocks = [
            ...withoutOldFromNode,
            {
              id: `blk-prom-h-${node.id}`,
              type: 'heading' as const,
              title: node.title,
              content: '',
              sourceNodeId: node.id,
            },
            ...nodeBlocks,
          ];
        }

        const updatedLesson: Lesson = {
          ...targetLesson,
          blocks: nextBlocks,
          contentMarkdown: blocksToMarkdown(nextBlocks),
          linkedNodeIds: Array.from(
            new Set([...targetLesson.linkedNodeIds, node.id])
          ),
          quiz: node.quizQuestions
            ? Array.from(
                new Map(
                  [...targetLesson.quiz, ...node.quizQuestions].map((q) => [
                    q.id,
                    q,
                  ])
                ).values()
              )
            : targetLesson.quiz,
        };

        return {
          ...ova,
          updatedAt: '2026-11-09',
          lessons: ova.lessons.map((l) =>
            l.id === targetLesson.id ? updatedLesson : l
          ),
        };
      })
    );

    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              researchStatus: 'in_ova',
              linkedOvaId: ovaId,
              linkedLessonId: resolvedLessonId,
              updatedAt: '2026-11-09',
            }
          : n
      )
    );
  };

  // Learner Interactions in Public Portal (Synchronized in Real Time with Instructor Matrix)
  const handleToggleLessonCompleted = (
    learnerId: string,
    ovaId: string,
    lessonId: string
  ) => {
    setLearners((prev) =>
      prev.map((learner) => {
        if (learner.id !== learnerId) return learner;
        const currentProg = learner.progressByOva[ovaId] ?? {
          ovaId,
          completedLessonIds: [],
          quizScores: {},
          submissions: {},
          lastAccessedAt: '2026-11-09 08:50',
        };
        const exists = currentProg.completedLessonIds.includes(lessonId);
        const nextCompleted = exists
          ? currentProg.completedLessonIds.filter((id) => id !== lessonId)
          : [...currentProg.completedLessonIds, lessonId];

        return {
          ...learner,
          progressByOva: {
            ...learner.progressByOva,
            [ovaId]: {
              ...currentProg,
              completedLessonIds: nextCompleted,
              lastAccessedAt: '2026-11-09 08:50',
            },
          },
        };
      })
    );
  };

  const handleSubmitQuizScore = (
    learnerId: string,
    ovaId: string,
    lessonId: string,
    scorePct: number
  ) => {
    setLearners((prev) =>
      prev.map((learner) => {
        if (learner.id !== learnerId) return learner;
        const currentProg = learner.progressByOva[ovaId] ?? {
          ovaId,
          completedLessonIds: [],
          quizScores: {},
          submissions: {},
          lastAccessedAt: '2026-11-09 08:50',
        };
        const nextCompleted =
          scorePct >= 70
            ? Array.from(
                new Set([...currentProg.completedLessonIds, lessonId])
              )
            : currentProg.completedLessonIds;

        return {
          ...learner,
          progressByOva: {
            ...learner.progressByOva,
            [ovaId]: {
              ...currentProg,
              completedLessonIds: nextCompleted,
              quizScores: {
                ...currentProg.quizScores,
                [lessonId]: scorePct,
              },
              lastAccessedAt: '2026-11-09 08:50',
            },
          },
        };
      })
    );
  };

  const handleSubmitActivityEvidence = (
    learnerId: string,
    ovaId: string,
    lessonId: string,
    activityId: string,
    deliveryLinkOrNote: string
  ) => {
    setLearners((prev) =>
      prev.map((learner) => {
        if (learner.id !== learnerId) return learner;
        const currentProg = learner.progressByOva[ovaId] ?? {
          ovaId,
          completedLessonIds: [],
          quizScores: {},
          submissions: {},
          lastAccessedAt: '2026-11-09 08:50',
        };

        return {
          ...learner,
          progressByOva: {
            ...learner.progressByOva,
            [ovaId]: {
              ...currentProg,
              submissions: {
                ...currentProg.submissions,
                [lessonId]: {
                  lessonId,
                  activityId,
                  status: 'submitted',
                  submittedAt: '2026-11-09',
                  deliveryLinkOrNote,
                },
              },
              lastAccessedAt: '2026-11-09 08:50',
            },
          },
        };
      })
    );
  };

  const handleResetDemoData = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setRegions(INITIAL_REGIONS);
    setOvas(INITIAL_OVAS);
    setLearners(INITIAL_LEARNERS);
    setSentLogs(INITIAL_SENT_REMINDERS);
  };

  const printableOva =
    ovas.find((o) => o.id === printGuideOvaId) ?? ovas[0];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* STRICT 3-ZONE TOP BAR CONTRACT (Hidden on native mobile when MobileAppShell is active) */}
      <header
        className={`no-print items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 ${
          isMobileAppMode ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setShowLandingPage(true);
          }}
          className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0"
        >
          NexoOVA Studio
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        {effectiveMode === 'instructor' && !showLandingPage ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#portada"
              onClick={(e) => {
                e.preventDefault();
                setShowLandingPage(true);
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Portada
            </a>
            <a
              href="#lienzo-grafo"
              onClick={(e) => {
                e.preventDefault();
                setShowLandingPage(false);
                setInstructorTab('graph');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && instructorTab === 'graph'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Lienzo en Grafo
            </a>
            <a
              href="#gestion-ovas"
              onClick={(e) => {
                e.preventDefault();
                setShowLandingPage(false);
                setInstructorTab('ovas');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && instructorTab === 'ovas'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Gestión de OVAs
            </a>
            <a
              href="#brain-karpathy"
              onClick={(e) => {
                e.preventDefault();
                setShowLandingPage(false);
                setInstructorTab('brain');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && instructorTab === 'brain'
                  ? 'text-cyan-600 font-bold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Brain Karpathy 3D
            </a>
            <a
              href="#aprendices-fichas"
              onClick={(e) => {
                e.preventDefault();
                setShowLandingPage(false);
                setInstructorTab('learners');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && instructorTab === 'learners'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Aprendices y Fichas
            </a>
            <a
              href="#recordatorios"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileAppMode(false);
                setShowLandingPage(false);
                setInstructorTab('reminders');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !isMobileAppMode && !showLandingPage && instructorTab === 'reminders'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Recordatorios
            </a>
            <a
              href="#version-movil"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileAppMode((v) => !v);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isMobileAppMode
                  ? 'text-[#d94e34] font-semibold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Versión Móvil
            </a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#portada"
              onClick={(e) => {
                e.preventDefault();
                setShowLandingPage(true);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                showLandingPage
                  ? 'text-[#d94e34] font-semibold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Portada
            </a>
            <a
              href="#catalogo-ovas"
              onClick={(e) => {
                e.preventDefault();
                setWorkspaceMode('public_learner');
                setPublicSection('catalog');
                setShowLandingPage(false);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && publicSection === 'catalog'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Catálogo de OVAs
            </a>
            <a
              href="#mis-evidencias"
              onClick={(e) => {
                e.preventDefault();
                setWorkspaceMode('public_learner');
                setPublicSection('evidences');
                setShowLandingPage(false);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && publicSection === 'evidences'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Mis Evidencias
            </a>
            <a
              href="#mi-progreso"
              onClick={(e) => {
                e.preventDefault();
                setWorkspaceMode('public_learner');
                setPublicSection('progress');
                setShowLandingPage(false);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                !showLandingPage && publicSection === 'progress'
                  ? 'text-indigo-600 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Mi Progreso
            </a>
            <a
              href="#version-movil"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileAppMode((v) => !v);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isMobileAppMode
                  ? 'text-[#d94e34] font-semibold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Versión Móvil
            </a>
            <a
              href="#guia-pdf"
              onClick={(e) => {
                e.preventDefault();
                setPrintGuideOvaId(ovas[0]?.id ?? null);
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Guía de Estudio PDF
            </a>
          </nav>
        )}

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {!isInstructorAuth ? (
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              Acceso Instructor
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPrintGuideOvaId(ovas[0]?.id ?? null)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
            >
              Exportar Guía PDF
            </button>
          )}
        </div>
      </header>

      {/* Workspace Mode & SENA Context Bar (Hidden on native mobile when MobileAppShell is active) */}
      <div
        className={`no-print bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex-wrap items-center justify-between gap-4 text-xs ${
          isMobileAppMode ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-900">
            Formación Profesional Integral SENA
          </span>
          <span aria-hidden="true">·</span>
          <span>{DEFAULT_INSTRUCTOR.centerName}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">
            Instructor: {DEFAULT_INSTRUCTOR.instructorName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isInstructorAuth ? (
            <>
              {/* Dual Mode Switcher for Authenticated Instructor */}
              <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowLandingPage(true)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    showLandingPage
                      ? 'bg-stone-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Portada Minimalista
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLandingPage(false);
                    setWorkspaceMode('instructor');
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    !showLandingPage &&
                    workspaceMode === 'instructor' &&
                    instructorTab !== 'brain'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Panel Instructor (Grafo y Autoría)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLandingPage(false);
                    setWorkspaceMode('instructor');
                    setInstructorTab('brain');
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    !showLandingPage &&
                    workspaceMode === 'instructor' &&
                    instructorTab === 'brain'
                      ? 'bg-slate-900 text-cyan-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Brain Karpathy 2.5D/3D
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLandingPage(false);
                    setWorkspaceMode('public_learner');
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    !showLandingPage && workspaceMode === 'public_learner'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vista Pública de Aprendiz
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetDemoData}
                title="Restaurar datos de ejemplo SENA"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar Semilla
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsInstructorAuth(false);
                  setWorkspaceMode('public_learner');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 bg-white border border-slate-200 rounded-lg whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar Sesión Docente
              </button>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-500">
                Modo actual: <strong>Vista Pública de Aprendiz</strong> (Sin
                contraseña requerida)
              </span>
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1 text-indigo-700 font-semibold hover:underline"
              >
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>¿Eres el Instructor? Inicia sesión aquí</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Mobile Navigation Bar (Only shown when not in dedicated MobileAppShell mode) */}
      {!isMobileAppMode && (
        <div className="no-print md:hidden bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => setShowLandingPage(true)}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            showLandingPage
              ? 'bg-stone-900 text-white'
              : 'text-slate-600 bg-slate-100'
          }`}
        >
          Portada
        </button>
        {effectiveMode === 'instructor' ? (
          <>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setInstructorTab('graph');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && instructorTab === 'graph'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Lienzo en Grafo
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setInstructorTab('ovas');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && instructorTab === 'ovas'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Gestión de OVAs
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setInstructorTab('brain');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && instructorTab === 'brain'
                  ? 'bg-slate-900 text-cyan-300'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Brain Karpathy 3D
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setInstructorTab('learners');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && instructorTab === 'learners'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Aprendices y Fichas
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setInstructorTab('reminders');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && instructorTab === 'reminders'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Recordatorios
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setPublicSection('catalog');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && publicSection === 'catalog'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Catálogo de OVAs
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setPublicSection('evidences');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && publicSection === 'evidences'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Mis Evidencias
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLandingPage(false);
                setPublicSection('progress');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                !showLandingPage && publicSection === 'progress'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              Mi Progreso
            </button>
          </>
        )}
        </div>
      )}

      {/* Main Workspace Viewport */}
      <main
        className={`no-print flex-1 w-full max-w-full overflow-x-hidden mx-auto ${
          isMobileAppMode
            ? 'p-0 md:max-w-[1440px] md:px-6 md:py-6'
            : 'max-w-[1440px] px-4 sm:px-6 py-6'
        }`}
      >
        {isMobileAppMode ? (
          <MobileAppShell
            ovas={ovas}
            learners={learners}
            activeLearnerId={activeLearnerId}
            isInstructorAuth={isInstructorAuth}
            onUpdateOvas={setOvas}
            onSubmitActivityEvidence={handleSubmitActivityEvidence}
            onRequestInstructorLogin={() => setShowLoginModal(true)}
            onExitMobilePreview={() => setIsMobileAppMode(false)}
          />
        ) : showLandingPage ? (
          <MinimalLandingPage
            ovas={ovas}
            nodes={nodes}
            learners={learners}
            isInstructorAuth={isInstructorAuth}
            onEnterOvaLesson={(ovaId, lessonId) => {
              setDeepLinkOvaId(ovaId);
              setDeepLinkLessonId(lessonId ?? null);
              setWorkspaceMode('public_learner');
              setPublicSection('catalog');
              setShowLandingPage(false);
            }}
            onEnterEvidencesSchedule={() => {
              setWorkspaceMode('public_learner');
              setPublicSection('evidences');
              setShowLandingPage(false);
            }}
            onEnterInstructorStudio={() => {
              if (isInstructorAuth) {
                setWorkspaceMode('instructor');
                setShowLandingPage(false);
              } else {
                setShowLoginModal(true);
              }
            }}
            onOpenPrintGuide={(id) => setPrintGuideOvaId(id)}
          />
        ) : effectiveMode === 'instructor' ? (
          <>
            {instructorTab === 'graph' && (
              <KnowledgeGraphCanvas
                nodes={nodes}
                edges={edges}
                regions={regions}
                ovas={ovas}
                onUpdateNodes={setNodes}
                onUpdateEdges={setEdges}
                onUpdateRegions={setRegions}
                onUpdateOvas={setOvas}
                onPromoteNodeToOva={handlePromoteNodeToOva}
                onNavigateToOva={() => setInstructorTab('ovas')}
              />
            )}

            {instructorTab === 'ovas' && (
              <OvaBuilderView
                ovas={ovas}
                nodes={nodes}
                onUpdateOvas={setOvas}
                onUpdateNodes={setNodes}
                onOpenPrintGuide={(id) => setPrintGuideOvaId(id)}
                onNavigateToGraph={() => setInstructorTab('graph')}
                onNavigateToBrain={() => setInstructorTab('brain')}
              />
            )}

            {instructorTab === 'brain' && (
              <KarpathyBrainStudio ovas={ovas} onUpdateOvas={setOvas} />
            )}

            {(instructorTab === 'learners' ||
              instructorTab === 'reminders') && (
              <LearnerProgressAndReminders
                activeSubTab={
                  instructorTab === 'reminders' ? 'reminders' : 'learners'
                }
                learners={learners}
                ovas={ovas}
                templates={INITIAL_REMINDER_TEMPLATES}
                sentLogs={sentLogs}
                onUpdateLearners={setLearners}
                onAddSentLog={(log) => setSentLogs((prev) => [log, ...prev])}
                onPreviewAsLearner={(learnerId) => {
                  setActiveLearnerId(learnerId);
                  setWorkspaceMode('public_learner');
                  setPublicSection('catalog');
                  setShowLandingPage(false);
                }}
              />
            )}
          </>
        ) : (
          <PublicLearnerPortal
            ovas={ovas}
            learners={learners}
            nodes={nodes}
            activeLearnerId={activeLearnerId}
            onSelectLearnerId={setActiveLearnerId}
            onToggleLessonCompleted={handleToggleLessonCompleted}
            onSubmitQuizScore={handleSubmitQuizScore}
            onSubmitActivityEvidence={handleSubmitActivityEvidence}
            onOpenPrintGuide={(id) => setPrintGuideOvaId(id)}
            publicSection={publicSection}
            onChangePublicSection={setPublicSection}
            initialOvaId={deepLinkOvaId}
            initialLessonId={deepLinkLessonId}
          />
        )}
      </main>

      {/* Quiet Footer (Hidden on native mobile when MobileAppShell is active) */}
      <footer
        className={`no-print border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 flex-wrap items-center justify-between gap-4 ${
          isMobileAppMode ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div>
          NexoOVA Studio · Plataforma de Autoría de Objetos Virtuales de
          Aprendizaje y Mapas Conceptuales para Formación SENA
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPrintGuideOvaId(ovas[0]?.id ?? null)}
            className="hover:text-slate-900 transition-colors"
          >
            Exportar Guía de Estudio PDF
          </button>
          <span aria-hidden="true">·</span>
          {!isInstructorAuth ? (
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Acceso Exclusivo Instructor
            </button>
          ) : (
            <span>Sesión Docente Activa</span>
          )}
        </div>
      </footer>

      {/* Exclusive Instructor Login Modal */}
      {showLoginModal && (
        <InstructorLoginModal
          instructor={DEFAULT_INSTRUCTOR}
          onSuccessLogin={() => {
            setIsInstructorAuth(true);
            setWorkspaceMode('instructor');
            setShowLandingPage(false);
            setShowLoginModal(false);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* Printable Study Guide & PDF Export Modal */}
      {printGuideOvaId && printableOva && (
        <PrintableStudyGuideModal
          ova={printableOva}
          ovas={ovas}
          nodes={nodes}
          edges={edges}
          instructor={DEFAULT_INSTRUCTOR}
          isInstructorSession={isInstructorAuth}
          onSelectOva={(id) => setPrintGuideOvaId(id)}
          onClose={() => setPrintGuideOvaId(null)}
        />
      )}
    </div>
  );
}
