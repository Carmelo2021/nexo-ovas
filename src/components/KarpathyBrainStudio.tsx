import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  ArrowLeftRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Edit3,
  Eye,
  FileText,
  FlaskConical,
  GitBranch,
  Globe,
  GripVertical,
  Layers,
  Link2,
  Maximize2,
  Minimize2,
  Moon,
  Move,
  Orbit,
  Plus,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  Unlink,
  Video,
  Wand2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  BrainLayerIconKind,
  BrainMaterialIconKind,
  KarpathyBrainEdge,
  KarpathyBrainNode,
  KarpathyClusterType,
  KarpathyOrbitalZone,
  Lesson,
  LessonBlock,
  LessonBlockType,
  OVA,
} from '../types/ova';
import {
  blocksToMarkdown,
  ensureLessonBlocks,
  NotionLessonBlockEditor,
} from './NotionLessonBlocks';

interface KarpathyBrainStudioProps {
  ovas: OVA[];
  onUpdateOvas: React.Dispatch<React.SetStateAction<OVA[]>>;
  compactMobile?: boolean;
}

const BRAIN_STORAGE_KEYS = {
  NODES: 'nexoova_karpathy_brain_nodes_v1',
  EDGES: 'nexoova_karpathy_brain_edges_v1',
  ZONES: 'nexoova_karpathy_brain_zones_v1',
};

const CLUSTER_META: Record<
  KarpathyClusterType,
  {
    code: string;
    label: string;
    subtitle: string;
    darkBadge: string;
    lightBadge: string;
    darkCard: string;
    lightCard: string;
    strokeColor: string;
    pulseColor: string;
    glowHex: string;
  }
> = {
  index: {
    code: 'index.md',
    label: 'Núcleo index.md',
    subtitle: 'Catálogo Maestro de la OVA',
    darkBadge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50',
    lightBadge: 'bg-cyan-100 text-cyan-900 border-cyan-400',
    darkCard:
      'bg-slate-900/90 border-cyan-400/70 text-white shadow-[0_0_32px_rgba(34,211,238,0.35)]',
    lightCard:
      'bg-white border-cyan-600 text-slate-900 shadow-[0_14px_30px_rgba(8,145,178,0.22)]',
    strokeColor: '#22d3ee',
    pulseColor: '#67e8f9',
    glowHex: 'rgba(34, 211, 238, 0.25)',
  },
  raw: {
    code: 'raw/',
    label: 'Cluster raw/',
    subtitle: 'Fuentes Inmutables, Libros y Videos',
    darkBadge: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    lightBadge: 'bg-amber-100 text-amber-900 border-amber-400',
    darkCard:
      'bg-slate-900/85 border-amber-400/55 text-amber-50 shadow-[0_10px_26px_rgba(245,158,11,0.22)]',
    lightCard:
      'bg-white/95 border-amber-500 text-slate-900 shadow-[0_10px_24px_rgba(245,158,11,0.16)]',
    strokeColor: '#f59e0b',
    pulseColor: '#fde68a',
    glowHex: 'rgba(245, 158, 11, 0.16)',
  },
  wiki: {
    code: 'wiki/',
    label: 'Cluster wiki/',
    subtitle: 'Conceptos Compilados y Código',
    darkBadge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    lightBadge: 'bg-indigo-100 text-indigo-900 border-indigo-400',
    darkCard:
      'bg-slate-900/85 border-indigo-400/55 text-indigo-50 shadow-[0_10px_26px_rgba(99,102,241,0.24)]',
    lightCard:
      'bg-white/95 border-indigo-500 text-slate-900 shadow-[0_10px_24px_rgba(99,102,241,0.16)]',
    strokeColor: '#818cf8',
    pulseColor: '#c7d2fe',
    glowHex: 'rgba(99, 102, 241, 0.16)',
  },
  labs: {
    code: 'labs/',
    label: 'Cluster labs/',
    subtitle: 'Diagramas y Modelos Interactivos',
    darkBadge: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40',
    lightBadge: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-400',
    darkCard:
      'bg-slate-900/85 border-fuchsia-400/55 text-fuchsia-50 shadow-[0_10px_26px_rgba(217,70,239,0.22)]',
    lightCard:
      'bg-white/95 border-fuchsia-500 text-slate-900 shadow-[0_10px_24px_rgba(217,70,239,0.16)]',
    strokeColor: '#e879f9',
    pulseColor: '#f5d0fe',
    glowHex: 'rgba(217, 70, 239, 0.16)',
  },
  practice: {
    code: 'lint/practice/',
    label: 'Cluster lint/practice/',
    subtitle: 'Ejercicios Ejecutables y Verificación',
    darkBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    lightBadge: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    darkCard:
      'bg-slate-900/85 border-emerald-400/55 text-emerald-50 shadow-[0_10px_26px_rgba(16,185,129,0.22)]',
    lightCard:
      'bg-white/95 border-emerald-500 text-slate-900 shadow-[0_10px_24px_rgba(16,185,129,0.16)]',
    strokeColor: '#10b981',
    pulseColor: '#a7f3d0',
    glowHex: 'rgba(16, 185, 129, 0.16)',
  },
};

export function classifyBlockToKarpathy(block: LessonBlock): {
  cluster: Exclude<KarpathyClusterType, 'index'>;
  layerIcon: BrainLayerIconKind;
  materialIcon: BrainMaterialIconKind;
} {
  switch (block.type) {
    case 'quote':
      return {
        cluster: 'raw',
        layerIcon: 'raw_vault',
        materialIcon: 'book',
      };
    case 'video':
      return {
        cluster: 'raw',
        layerIcon: 'raw_vault',
        materialIcon: 'video',
      };
    case 'link':
      return {
        cluster: 'raw',
        layerIcon: 'raw_vault',
        materialIcon: 'link',
      };
    case 'diagram':
      return {
        cluster: 'labs',
        layerIcon: 'lab_model',
        materialIcon: 'diagram',
      };
    case 'interactive':
      return {
        cluster: 'labs',
        layerIcon: 'lab_model',
        materialIcon: 'interactive',
      };
    case 'exercise':
      return {
        cluster: 'practice',
        layerIcon: 'lint_check',
        materialIcon: 'exercise',
      };
    case 'code':
      return {
        cluster: 'wiki',
        layerIcon: 'wiki_node',
        materialIcon: 'code',
      };
    case 'heading':
    case 'text':
    case 'callout':
    default:
      return {
        cluster: 'wiki',
        layerIcon: 'wiki_node',
        materialIcon: 'concept',
      };
  }
}

export function getShortBlockTitle(block: LessonBlock, index: number): string {
  if (block.title && block.title.trim().length > 0) {
    return block.title.trim();
  }
  const clean = block.content
    .replace(/[#*`>_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length > 0) {
    return clean.length > 44 ? `${clean.slice(0, 44)}…` : clean;
  }
  return `Material #${index + 1} (${block.type})`;
}

function renderLayerIcon(kind: BrainLayerIconKind, className = 'w-3.5 h-3.5') {
  switch (kind) {
    case 'index_hub':
      return <Brain className={className} />;
    case 'raw_vault':
      return <Database className={className} />;
    case 'wiki_node':
      return <BookOpen className={className} />;
    case 'lab_model':
      return <Cpu className={className} />;
    case 'lint_check':
      return <ShieldCheck className={className} />;
  }
}

function renderMaterialIcon(
  kind: BrainMaterialIconKind,
  className = 'w-3.5 h-3.5'
) {
  switch (kind) {
    case 'core':
      return <Orbit className={className} />;
    case 'book':
      return <Quote className={className} />;
    case 'code':
      return <Code2 className={className} />;
    case 'exercise':
      return <Terminal className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'diagram':
      return <GitBranch className={className} />;
    case 'interactive':
      return <FlaskConical className={className} />;
    case 'link':
      return <Globe className={className} />;
    case 'concept':
    default:
      return <FileText className={className} />;
  }
}

const LAYER_ICON_LABELS: Record<BrainLayerIconKind, string> = {
  index_hub: 'Núcleo index.md',
  raw_vault: 'Capa raw/ (Fuente)',
  wiki_node: 'Capa wiki/ (Concepto)',
  lab_model: 'Capa labs/ (Modelo Visual)',
  lint_check: 'Capa lint/ (Ejercicio/Verificación)',
};

const MATERIAL_ICON_LABELS: Record<BrainMaterialIconKind, string> = {
  core: 'Índice Maestro OVA',
  book: 'Libro / Cita Bibliográfica',
  code: 'Snippet de Código',
  exercise: 'Ejercicio Ejecutable',
  video: 'Video / Multimedia',
  diagram: 'Diagrama Arquitectónico',
  interactive: 'Laboratorio Interactivo',
  concept: 'Concepto Teórico',
  link: 'Documentación Externa',
};

const CENTER_X = 820;
const CENTER_Y = 500;

function createDefaultZonesForOva(ovaId: string): KarpathyOrbitalZone[] {
  return [
    {
      id: `zone-${ovaId}-raw`,
      ovaId,
      cluster: 'raw',
      title: 'raw/ · Fuentes y Libros',
      subtitle: 'Citas bibliográficas, videos y documentación cruda',
      x: CENTER_X - 420,
      y: CENTER_Y - 260,
      radius: 215,
    },
    {
      id: `zone-${ovaId}-wiki`,
      ovaId,
      cluster: 'wiki',
      title: 'wiki/ · Conceptos Compilados',
      subtitle: 'Síntesis teórica, arquitectura y patrones de código',
      x: CENTER_X + 420,
      y: CENTER_Y - 260,
      radius: 215,
    },
    {
      id: `zone-${ovaId}-labs`,
      ovaId,
      cluster: 'labs',
      title: 'labs/ · Modelos Visuales',
      subtitle: 'Diagramas de flujo SVG y laboratorios interactivos',
      x: CENTER_X - 420,
      y: CENTER_Y + 260,
      radius: 215,
    },
    {
      id: `zone-${ovaId}-practice`,
      ovaId,
      cluster: 'practice',
      title: 'lint/practice/ · Ejercicios',
      subtitle: 'Retos ejecutables en vivo y validación sináptica',
      x: CENTER_X + 420,
      y: CENTER_Y + 260,
      radius: 215,
    },
  ];
}

function createCoreIndexNode(ova: OVA): KarpathyBrainNode {
  return {
    id: `brain-core-${ova.id}`,
    ovaId: ova.id,
    title: `index.md · ${ova.title}`,
    cluster: 'index',
    layerIcon: 'index_hub',
    materialIcon: 'core',
    x: CENTER_X,
    y: CENTER_Y,
    zDepth: 1.22,
    floatPhase: 0,
  };
}

function buildGeneratedBrainForOva(
  ova: OVA,
  zones: KarpathyOrbitalZone[]
): {
  nodes: KarpathyBrainNode[];
  edges: KarpathyBrainEdge[];
} {
  const coreNode = createCoreIndexNode(ova);
  const generatedNodes: KarpathyBrainNode[] = [coreNode];
  const generatedEdges: KarpathyBrainEdge[] = [];

  // Group blocks by Karpathy cluster
  const grouped: Record<
    Exclude<KarpathyClusterType, 'index'>,
    Array<{ lesson: Lesson; block: LessonBlock; globalIndex: number }>
  > = {
    raw: [],
    wiki: [],
    labs: [],
    practice: [],
  };

  let gIdx = 0;
  for (const lesson of ova.lessons) {
    const blocks = ensureLessonBlocks(lesson);
    // Keep a representative selection per lesson so the orbital brain is clean & readable,
    // while allowing any remaining blocks to be dragged in manually!
    let exerciseCountForLesson = 0;
    for (const block of blocks) {
      gIdx += 1;
      if (block.type === 'exercise') {
        exerciseCountForLesson += 1;
        // Include up to 3 representative executable exercises per lesson in auto-generation
        // (the rest remain ready to drag & drop from the editor tray anytime)
        if (exerciseCountForLesson > 3) continue;
      }
      const { cluster } = classifyBlockToKarpathy(block);
      grouped[cluster].push({ lesson, block, globalIndex: gIdx });
    }
  }

  (['raw', 'wiki', 'labs', 'practice'] as const).forEach((clusterKey) => {
    const items = grouped[clusterKey];
    const zone =
      zones.find((z) => z.cluster === clusterKey) ??
      createDefaultZonesForOva(ova.id).find((z) => z.cluster === clusterKey)!;

    items.forEach((item, idx) => {
      const total = Math.max(items.length, 1);
      // Spiral orbital placement inside the cluster zone
      const ringIndex = Math.floor(idx / 6);
      const posInRing = idx % 6;
      const countInRing = Math.min(total - ringIndex * 6, 6);
      const angle =
        (posInRing / Math.max(countInRing, 1)) * Math.PI * 2 - Math.PI / 4;
      const radius = 105 + ringIndex * 78;
      const nx = Math.round(zone.x + Math.cos(angle) * radius);
      const ny = Math.round(zone.y + Math.sin(angle) * radius * 0.78);

      const { layerIcon, materialIcon } = classifyBlockToKarpathy(item.block);
      const nodeId = `brain-node-${ova.id}-${item.block.id}`;

      generatedNodes.push({
        id: nodeId,
        ovaId: ova.id,
        lessonId: item.lesson.id,
        blockId: item.block.id,
        title: getShortBlockTitle(item.block, item.globalIndex),
        cluster: clusterKey,
        layerIcon,
        materialIcon,
        x: nx,
        y: ny,
        zDepth: Number((0.88 + ((idx % 4) * 0.09)).toFixed(2)),
        floatPhase: (idx * 0.65) % 4.5,
      });

      generatedEdges.push({
        id: `brain-edge-${coreNode.id}-${nodeId}`,
        ovaId: ova.id,
        sourceId: coreNode.id,
        targetId: nodeId,
        cluster: clusterKey,
      });
    });
  });

  return { nodes: generatedNodes, edges: generatedEdges };
}

export const KarpathyBrainStudio: React.FC<KarpathyBrainStudioProps> = ({
  ovas,
  onUpdateOvas,
  compactMobile = false,
}) => {
  // 1. Sub-view state: 'builder' (Construir OVA primero) | 'brain_canvas' (Canvas 2.5D/3D con bandeja arrastrable)
  const [subView, setSubView] = useState<'builder' | 'brain_canvas'>('builder');

  // 2. Selected OVA & Lesson
  const [selectedOvaId, setSelectedOvaId] = useState<string>(
    ovas[0]?.id ?? ''
  );
  const selectedOva = useMemo(
    () => ovas.find((o) => o.id === selectedOvaId) ?? ovas[0],
    [ovas, selectedOvaId]
  );

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    selectedOva?.lessons[0]?.id ?? ''
  );
  const selectedLesson = useMemo(
    () =>
      selectedOva?.lessons.find((l) => l.id === selectedLessonId) ??
      selectedOva?.lessons[0],
    [selectedOva, selectedLessonId]
  );

  useEffect(() => {
    if (
      selectedOva &&
      !selectedOva.lessons.some((l) => l.id === selectedLessonId)
    ) {
      setSelectedLessonId(selectedOva.lessons[0]?.id ?? '');
    }
  }, [selectedOva, selectedLessonId]);

  // 3. Persistent Brain State (Zones, Nodes, Edges)
  const [brainZones, setBrainZones] = useState<KarpathyOrbitalZone[]>(() => {
    try {
      const raw = localStorage.getItem(BRAIN_STORAGE_KEYS.ZONES);
      if (raw) {
        const parsed = JSON.parse(raw) as KarpathyOrbitalZone[];
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return ovas.flatMap((o) => createDefaultZonesForOva(o.id));
  });

  const [brainNodes, setBrainNodes] = useState<KarpathyBrainNode[]>(() => {
    try {
      const raw = localStorage.getItem(BRAIN_STORAGE_KEYS.NODES);
      if (raw) {
        const parsed = JSON.parse(raw) as KarpathyBrainNode[];
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    // Start with the core index.md node for each OVA so the user can curate manually via Drag & Drop OR click 'Generar Brain'
    return ovas.map((o) => createCoreIndexNode(o));
  });

  const [brainEdges, setBrainEdges] = useState<KarpathyBrainEdge[]>(() => {
    try {
      const raw = localStorage.getItem(BRAIN_STORAGE_KEYS.EDGES);
      if (raw) return JSON.parse(raw) as KarpathyBrainEdge[];
    } catch {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        BRAIN_STORAGE_KEYS.ZONES,
        JSON.stringify(brainZones)
      );
    } catch {
      // ignore
    }
  }, [brainZones]);

  useEffect(() => {
    try {
      localStorage.setItem(
        BRAIN_STORAGE_KEYS.NODES,
        JSON.stringify(brainNodes)
      );
    } catch {
      // ignore
    }
  }, [brainNodes]);

  useEffect(() => {
    try {
      localStorage.setItem(
        BRAIN_STORAGE_KEYS.EDGES,
        JSON.stringify(brainEdges)
      );
    } catch {
      // ignore
    }
  }, [brainEdges]);

  // Ensure current OVA has orbital zones and its index.md core node
  useEffect(() => {
    if (!selectedOva) return;
    setBrainZones((prev) => {
      if (prev.some((z) => z.ovaId === selectedOva.id)) return prev;
      return [...prev, ...createDefaultZonesForOva(selectedOva.id)];
    });
    setBrainNodes((prev) => {
      if (prev.some((n) => n.ovaId === selectedOva.id && n.cluster === 'index'))
        return prev;
      return [...prev, createCoreIndexNode(selectedOva)];
    });
  }, [selectedOva]);

  // Filtered Brain Elements for Active OVA
  const activeZones = useMemo(
    () => brainZones.filter((z) => z.ovaId === selectedOva?.id),
    [brainZones, selectedOva]
  );
  const activeNodes = useMemo(
    () => brainNodes.filter((n) => n.ovaId === selectedOva?.id),
    [brainNodes, selectedOva]
  );
  const activeEdges = useMemo(
    () => brainEdges.filter((e) => e.ovaId === selectedOva?.id),
    [brainEdges, selectedOva]
  );

  // 4. Visual Theme & 2.5D/3D Microanimation Controls
  const [canvasTheme, setCanvasTheme] = useState<'deep_synapse' | 'light_25d'>(
    'deep_synapse'
  );
  const [cameraTiltDeg, setCameraTiltDeg] = useState<number>(14);
  const [zoom, setZoom] = useState<number>(() =>
    typeof window !== 'undefined' && (window.innerWidth < 768 || compactMobile)
      ? 0.44
      : 0.76
  );
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: -110, y: -60 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTrayOpen, setIsTrayOpen] = useState<boolean>(true);
  const [trayFilterCluster, setTrayFilterCluster] = useState<
    'all' | Exclude<KarpathyClusterType, 'index'>
  >('all');

  const centerCanvasViewport = (customZoom?: number) => {
    const el = canvasViewportRef.current;
    const isSmall =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || compactMobile);
    const targetZoom = customZoom ?? (isSmall ? 0.44 : 0.76);
    setZoom(targetZoom);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 40 && rect.height > 40) {
        setPan({
          x: Math.round(rect.width / 2 - CENTER_X * targetZoom),
          y: Math.round(rect.height / 2 - CENTER_Y * targetZoom),
        });
        return;
      }
    }
    setPan(isSmall ? { x: -180, y: -45 } : { x: -110, y: -60 });
  };

  useEffect(() => {
    if (subView === 'brain_canvas') {
      const id = window.setTimeout(() => {
        centerCanvasViewport();
      }, 60);
      return () => window.clearTimeout(id);
    }
  }, [subView, compactMobile]);

  // 5. Bidirectional Sync & Editing States
  const [selectedBrainNodeId, setSelectedBrainNodeId] = useState<string | null>(
    null
  );
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(
    null
  );
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [connectingFromNodeId, setConnectingFromNodeId] = useState<
    string | null
  >(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [nodeTiltMap, setNodeTiltMap] = useState<
    Record<string, { rx: number; ry: number }>
  >({});

  // Parallax mouse tracking on canvas
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Canvas Dragging (Pan, Node drag, Zone drag)
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const trayBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const builderBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [dragState, setDragState] = useState<
    | {
        kind: 'pan';
        startX: number;
        startY: number;
        initialPanX: number;
        initialPanY: number;
      }
    | {
        kind: 'node';
        nodeId: string;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
      }
    | {
        kind: 'zone';
        zoneId: string;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
      }
    | null
  >(null);

  // Quick add material state in builder/tray
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickType, setQuickType] = useState<LessonBlockType>('text');
  const [quickContent, setQuickContent] = useState<string>('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // --- OVA & LESSON CRUD HELPERS ---
  const handleCreateNewOva = () => {
    const newOvaId = `ova-brain-${Date.now()}`;
    const firstLessonId = `les-brain-${Date.now()}-1`;
    const newOva: OVA = {
      id: newOvaId,
      code: `OVA-BRAIN-0${ovas.length + 1}`,
      title: 'Nueva OVA para Cerebro Karpathy',
      fichaCode: '2874512',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      competence: 'Construcción de Software y Gestión de Conocimiento',
      learningOutcome:
        'Estructurar materiales de estudio compilados en un grafo neuronal Karpathy.',
      status: 'published',
      description:
        'Objeto Virtual de Aprendizaje diseñado para compilación sináptica en 4 clusters orbitales (raw, wiki, labs, lint/practice).',
      estimatedHours: 12,
      updatedAt: '2026-11-26',
      lessons: [
        {
          id: firstLessonId,
          order: 1,
          title: 'Lección 1: Fundamentos y Fuentes',
          durationMinutes: 45,
          summary: 'Materiales base para el Brain de Karpathy',
          contentMarkdown: '',
          blocks: [
            {
              id: `blk-${Date.now()}-1`,
              type: 'quote',
              title: 'Cita Fundacional (raw/)',
              content:
                'El conocimiento duradero no se recupera en fragmentos aislados; se compila en una red viva de conceptos interconectados.',
              quoteAuthor: 'Andrej Karpathy · Arquitectura LLM Wiki',
            },
            {
              id: `blk-${Date.now()}-2`,
              type: 'text',
              title: 'Concepto Nuclear (wiki/)',
              content:
                'Cada concepto sintetiza múltiples fuentes crudas y las enlaza con modelos visuales y pruebas ejecutables.',
            },
            {
              id: `blk-${Date.now()}-3`,
              type: 'diagram',
              title: 'Flujo de Compilación Sináptica (labs/)',
              content: 'Diagrama del ciclo INGEST -> WIKI -> LINT.',
              diagramKind: 'if_else_flow',
            },
            {
              id: `blk-${Date.now()}-4`,
              type: 'exercise',
              title: 'Reto Ejecutable de Verificación (lint/)',
              content:
                'Verifica mediante código JavaScript la transformación de una nota cruda en un nodo compilado.',
              exerciseDifficulty: 'Básico',
              exerciseCategory: 'corto',
              exerciseStarterCode:
                'const rawNote = { titulo: "Closures en JS", capa: "wiki" };\nconsole.log("Nodo compilado:", JSON.stringify(rawNote));',
            },
          ],
          linkedNodeIds: [],
          quiz: [],
        },
      ],
    };

    onUpdateOvas((prev) => [newOva, ...prev]);
    setSelectedOvaId(newOvaId);
    setSelectedLessonId(firstLessonId);
    setBrainZones((prev) => [...prev, ...createDefaultZonesForOva(newOvaId)]);
    setBrainNodes((prev) => [...prev, createCoreIndexNode(newOva)]);
    showToast(
      'Nueva OVA creada con 4 materiales semilla listos para curar o generar el Brain.'
    );
  };

  const handleUpdateSelectedOva = (patch: Partial<OVA>) => {
    if (!selectedOva) return;
    onUpdateOvas((prev) =>
      prev.map((o) =>
        o.id === selectedOva.id
          ? { ...o, ...patch, updatedAt: '2026-11-26' }
          : o
      )
    );
    if (patch.title) {
      setBrainNodes((prev) =>
        prev.map((n) =>
          n.ovaId === selectedOva.id && n.cluster === 'index'
            ? { ...n, title: `index.md · ${patch.title}` }
            : n
        )
      );
    }
  };

  const handleAddLesson = () => {
    if (!selectedOva) return;
    const nextOrder = selectedOva.lessons.length + 1;
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      order: nextOrder,
      title: `Lección ${nextOrder}: Nuevo Tema`,
      durationMinutes: 45,
      summary: '',
      contentMarkdown: '',
      blocks: [
        {
          id: `blk-${Date.now()}`,
          type: 'text',
          title: `Concepto Principal · Lección ${nextOrder}`,
          content: 'Escribe aquí el desarrollo teórico o código del material.',
        },
      ],
      linkedNodeIds: [],
      quiz: [],
    };
    handleUpdateSelectedOva({
      lessons: [...selectedOva.lessons, newLesson],
    });
    setSelectedLessonId(newLesson.id);
  };

  const handleUpdateLessonBlocks = (
    lessonId: string,
    nextBlocks: LessonBlock[]
  ) => {
    if (!selectedOva) return;
    const updatedLessons = selectedOva.lessons.map((l) =>
      l.id === lessonId
        ? {
            ...l,
            blocks: nextBlocks,
            contentMarkdown: blocksToMarkdown(nextBlocks),
          }
        : l
    );
    handleUpdateSelectedOva({ lessons: updatedLessons });

    // Sync any updated block title directly to its linked Brain node
    setBrainNodes((prev) =>
      prev.map((node) => {
        if (node.ovaId !== selectedOva.id || !node.blockId) return node;
        const matchingBlock = nextBlocks.find((b) => b.id === node.blockId);
        if (!matchingBlock) return node;
        const { cluster, layerIcon, materialIcon } =
          classifyBlockToKarpathy(matchingBlock);
        return {
          ...node,
          title: getShortBlockTitle(matchingBlock, 0),
          cluster: node.cluster === 'index' ? 'index' : cluster,
          layerIcon: node.cluster === 'index' ? 'index_hub' : layerIcon,
          materialIcon: node.cluster === 'index' ? 'core' : materialIcon,
        };
      })
    );
  };

  const handleQuickAddMaterial = (alsoAddToBrain: boolean) => {
    if (!selectedOva || !selectedLesson) return;
    const cleanTitle =
      quickTitle.trim() || `Nuevo Material (${quickType.toUpperCase()})`;
    const newBlock: LessonBlock = {
      id: `blk-${Date.now()}`,
      type: quickType,
      title: cleanTitle,
      content:
        quickContent.trim() ||
        `Contenido de estudio para "${cleanTitle}" dentro de ${selectedLesson.title}.`,
      ...(quickType === 'quote'
        ? { quoteAuthor: 'Referencia Bibliográfica OVA' }
        : {}),
      ...(quickType === 'code' ? { codeLanguage: 'javascript' } : {}),
      ...(quickType === 'diagram' ? { diagramKind: 'var_let_const' } : {}),
      ...(quickType === 'interactive' ? { interactiveKind: 'array_lab' } : {}),
      ...(quickType === 'exercise'
        ? {
            exerciseDifficulty: 'Básico',
            exerciseCategory: 'corto',
            exerciseStarterCode: `// Ejercicio ejecutable: ${cleanTitle}\nconsole.log("Verificando nodo en el Brain...");`,
          }
        : {}),
    };

    const currentBlocks = ensureLessonBlocks(selectedLesson);
    handleUpdateLessonBlocks(selectedLesson.id, [newBlock, ...currentBlocks]);
    setQuickTitle('');
    setQuickContent('');

    if (alsoAddToBrain) {
      spawnBrainNodeFromBlock(selectedLesson, newBlock);
      showToast(
        `Material "${cleanTitle}" añadido a la OVA y conectado al Brain.`
      );
    } else {
      showToast(
        `Material "${cleanTitle}" creado en la lección. Puedes arrastrarlo al Brain cuando quieras.`
      );
    }
  };

  // --- BRAIN GENERATION & DRAG-AND-DROP SPAWNING ---
  const handleGenerateFullBrainFromOva = () => {
    if (!selectedOva) return;
    const currentZones =
      activeZones.length === 4
        ? activeZones
        : createDefaultZonesForOva(selectedOva.id);

    const { nodes: genNodes, edges: genEdges } = buildGeneratedBrainForOva(
      selectedOva,
      currentZones
    );

    setBrainZones((prev) => [
      ...prev.filter((z) => z.ovaId !== selectedOva.id),
      ...currentZones,
    ]);
    setBrainNodes((prev) => [
      ...prev.filter((n) => n.ovaId !== selectedOva.id),
      ...genNodes,
    ]);
    setBrainEdges((prev) => [
      ...prev.filter((e) => e.ovaId !== selectedOva.id),
      ...genEdges,
    ]);
    setSubView('brain_canvas');
    showToast(
      `Brain Karpathy generado con ${genNodes.length} nodos distribuidos en los 4 clusters orbitales.`
    );
  };

  const handleResetBrainToManualCuration = () => {
    if (!selectedOva) return;
    const core = createCoreIndexNode(selectedOva);
    setBrainNodes((prev) => [
      ...prev.filter((n) => n.ovaId !== selectedOva.id),
      core,
    ]);
    setBrainEdges((prev) => prev.filter((e) => e.ovaId !== selectedOva.id));
    setSelectedBrainNodeId(core.id);
    showToast(
      'Lienzo listo para Curación Manual: arrastra cualquier material desde la bandeja del editor hacia los 4 clusters del Brain.'
    );
  };

  const spawnBrainNodeFromBlock = (
    lesson: Lesson,
    block: LessonBlock,
    dropCoords?: { x: number; y: number },
    overrideCluster?: Exclude<KarpathyClusterType, 'index'>
  ) => {
    if (!selectedOva) return;

    // Check if block already exists in Brain
    const existing = activeNodes.find((n) => n.blockId === block.id);
    if (existing) {
      if (dropCoords) {
        setBrainNodes((prev) =>
          prev.map((n) =>
            n.id === existing.id
              ? {
                  ...n,
                  x: dropCoords.x,
                  y: dropCoords.y,
                  ...(overrideCluster ? { cluster: overrideCluster } : {}),
                }
              : n
          )
        );
      }
      setSelectedBrainNodeId(existing.id);
      setHighlightedBlockId(block.id);
      showToast(`Nodo "${existing.title}" reposicionado en el Brain.`);
      return;
    }

    const classified = classifyBlockToKarpathy(block);
    const targetCluster = overrideCluster ?? classified.cluster;
    const targetZone =
      activeZones.find((z) => z.cluster === targetCluster) ??
      createDefaultZonesForOva(selectedOva.id).find(
        (z) => z.cluster === targetCluster
      )!;

    const clusterPeers = activeNodes.filter((n) => n.cluster === targetCluster);
    const idx = clusterPeers.length;
    const angle = (idx / 6) * Math.PI * 2 - Math.PI / 3;
    const radius = 100 + Math.floor(idx / 6) * 72;

    const finalX = dropCoords
      ? Math.round(dropCoords.x)
      : Math.round(targetZone.x + Math.cos(angle) * radius);
    const finalY = dropCoords
      ? Math.round(dropCoords.y)
      : Math.round(targetZone.y + Math.sin(angle) * radius * 0.78);

    const coreNode =
      activeNodes.find((n) => n.cluster === 'index') ??
      createCoreIndexNode(selectedOva);

    const newNode: KarpathyBrainNode = {
      id: `brain-node-${selectedOva.id}-${block.id}-${Date.now()}`,
      ovaId: selectedOva.id,
      lessonId: lesson.id,
      blockId: block.id,
      title: getShortBlockTitle(block, idx),
      cluster: targetCluster,
      layerIcon: classified.layerIcon,
      materialIcon: classified.materialIcon,
      x: finalX,
      y: finalY,
      zDepth: Number((0.92 + ((idx % 4) * 0.08)).toFixed(2)),
      floatPhase: (idx * 0.7) % 4,
    };

    const newEdge: KarpathyBrainEdge = {
      id: `brain-edge-${coreNode.id}-${newNode.id}`,
      ovaId: selectedOva.id,
      sourceId: coreNode.id,
      targetId: newNode.id,
      cluster: targetCluster,
    };

    setBrainNodes((prev) => [...prev, newNode]);
    setBrainEdges((prev) => [...prev, newEdge]);
    setSelectedBrainNodeId(newNode.id);
    setHighlightedBlockId(block.id);
    showToast(
      `Nodo "${newNode.title}" incorporado al cluster ${CLUSTER_META[targetCluster].code}`
    );
  };

  // --- HTML5 DRAG AND DROP FROM OVA EDITOR TRAY TO BRAIN CANVAS ---
  const handleTrayDragStart = (
    e: React.DragEvent,
    lesson: Lesson,
    block: LessonBlock
  ) => {
    e.dataTransfer.setData(
      'application/x-nexoova-brain-block',
      JSON.stringify({
        ovaId: selectedOva?.id,
        lessonId: lesson.id,
        blockId: block.id,
      })
    );
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!selectedOva || !canvasViewportRef.current) return;
    const raw = e.dataTransfer.getData('application/x-nexoova-brain-block');
    if (!raw) return;

    try {
      const payload = JSON.parse(raw) as {
        ovaId: string;
        lessonId: string;
        blockId: string;
      };
      const lesson = selectedOva.lessons.find(
        (l) => l.id === payload.lessonId
      );
      if (!lesson) return;
      const blocks = ensureLessonBlocks(lesson);
      const block = blocks.find((b) => b.id === payload.blockId);
      if (!block) return;

      const rect = canvasViewportRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;

      // Check if dropped inside one of the 4 orbital cluster zones
      const droppedZone = activeZones.find((z) => {
        const dx = canvasX - z.x;
        const dy = canvasY - z.y;
        return Math.sqrt(dx * dx + dy * dy) <= z.radius + 45;
      });

      spawnBrainNodeFromBlock(
        lesson,
        block,
        { x: canvasX, y: canvasY },
        droppedZone?.cluster
      );
    } catch {
      // ignore malformed payload
    }
  };

  // --- CANVAS POINTER PAN & NODE/ZONE DRAG ---
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-brain-interactive="true"]')) {
      return;
    }
    setDragState({
      kind: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    });
  };

  const handleNodePointerDown = (
    e: React.PointerEvent,
    node: KarpathyBrainNode
  ) => {
    e.stopPropagation();

    // If user is in synaptic connection mode
    if (connectingFromNodeId && connectingFromNodeId !== node.id) {
      const exists = activeEdges.some(
        (edge) =>
          (edge.sourceId === connectingFromNodeId &&
            edge.targetId === node.id) ||
          (edge.sourceId === node.id &&
            edge.targetId === connectingFromNodeId)
      );
      if (!exists && selectedOva) {
        const newEdge: KarpathyBrainEdge = {
          id: `brain-edge-custom-${Date.now()}`,
          ovaId: selectedOva.id,
          sourceId: connectingFromNodeId,
          targetId: node.id,
          cluster: node.cluster === 'index' ? 'wiki' : node.cluster,
        };
        setBrainEdges((prev) => [...prev, newEdge]);
        showToast('Nueva conexión sináptica establecida entre nodos.');
      }
      setConnectingFromNodeId(null);
      return;
    }

    // Bidirectional Sync: Focus and highlight the corresponding block in the OVA Editor!
    setSelectedBrainNodeId(node.id);
    if (node.lessonId) {
      setSelectedLessonId(node.lessonId);
    }
    if (node.blockId) {
      setHighlightedBlockId(node.blockId);
      if (!isTrayOpen) setIsTrayOpen(true);
      window.setTimeout(() => {
        const el = trayBlockRefs.current[node.blockId!];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 90);
    }

    setDragState({
      kind: 'node',
      nodeId: node.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: node.x,
      initialY: node.y,
    });
  };

  const handleZonePointerDown = (
    e: React.PointerEvent,
    zone: KarpathyOrbitalZone
  ) => {
    e.stopPropagation();
    setDragState({
      kind: 'zone',
      zoneId: zone.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: zone.x,
      initialY: zone.y,
    });
  };

  const handleViewportPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Update subtle 3D parallax offset
    if (canvasViewportRef.current) {
      const rect = canvasViewportRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouseParallax({ x: normX * 18, y: normY * 18 });
    }

    // 2. Process active drag
    if (!dragState) return;

    if (dragState.kind === 'pan') {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      setPan({
        x: dragState.initialPanX + dx,
        y: dragState.initialPanY + dy,
      });
    } else if (dragState.kind === 'node') {
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;
      setBrainNodes((prev) =>
        prev.map((n) =>
          n.id === dragState.nodeId
            ? {
                ...n,
                x: Math.round(dragState.initialX + dx),
                y: Math.round(dragState.initialY + dy),
              }
            : n
        )
      );
    } else if (dragState.kind === 'zone') {
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;
      setBrainZones((prev) =>
        prev.map((z) =>
          z.id === dragState.zoneId
            ? {
                ...z,
                x: Math.round(dragState.initialX + dx),
                y: Math.round(dragState.initialY + dy),
              }
            : z
        )
      );
    }
  };

  const handleViewportPointerUp = () => {
    setDragState(null);
  };

  // --- NODE IN-PLACE UPDATE & BIDIRECTIONAL TITLE SYNC ---
  const handleUpdateBrainNode = (
    nodeId: string,
    patch: Partial<KarpathyBrainNode>
  ) => {
    const targetNode = activeNodes.find((n) => n.id === nodeId);
    setBrainNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ...patch } : n))
    );

    // If title was edited and node is linked to a LessonBlock, sync the title back to the OVA block
    if (
      patch.title !== undefined &&
      targetNode?.lessonId &&
      targetNode?.blockId &&
      selectedOva
    ) {
      const lesson = selectedOva.lessons.find(
        (l) => l.id === targetNode.lessonId
      );
      if (lesson) {
        const updatedBlocks = ensureLessonBlocks(lesson).map((b) =>
          b.id === targetNode.blockId ? { ...b, title: patch.title } : b
        );
        handleUpdateLessonBlocks(lesson.id, updatedBlocks);
      }
    }
  };

  const handleDeleteBrainNode = (nodeId: string) => {
    setBrainNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setBrainEdges((prev) =>
      prev.filter((e) => e.sourceId !== nodeId && e.targetId !== nodeId)
    );
    if (selectedBrainNodeId === nodeId) setSelectedBrainNodeId(null);
    if (editingNodeId === nodeId) setEditingNodeId(null);
  };

  const handleJumpToFullBuilderForBlock = (
    lessonId?: string,
    blockId?: string
  ) => {
    if (lessonId) setSelectedLessonId(lessonId);
    if (blockId) setHighlightedBlockId(blockId);
    setSubView('builder');
    if (blockId) {
      window.setTimeout(() => {
        const el = builderBlockRefs.current[blockId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  };

  const selectedBrainNode = useMemo(
    () => activeNodes.find((n) => n.id === selectedBrainNodeId) ?? null,
    [activeNodes, selectedBrainNodeId]
  );

  // Count materials in OVA vs nodes in Brain
  const totalOvaMaterials = useMemo(() => {
    if (!selectedOva) return 0;
    return selectedOva.lessons.reduce(
      (acc, l) => acc + ensureLessonBlocks(l).length,
      0
    );
  }, [selectedOva]);

  const placedBlockIds = useMemo(
    () =>
      new Set(
        activeNodes.map((n) => n.blockId).filter((id): id is string => !!id)
      ),
    [activeNodes]
  );

  const isDark = canvasTheme === 'deep_synapse';

  return (
    <div
      className={`flex flex-col gap-4 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-3 overflow-hidden'
          : 'w-full'
      }`}
    >
      {/* TOP MODULE HEADER: Switchable Sub-Views (1. Construir OVA -> 2. Generar/Curar Brain Canvas 2.5D/3D) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3.5 min-w-0 max-w-full overflow-hidden">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-cyan-600 to-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 font-display break-words">
                Laboratorio Karpathy Brain · Autoría OVA & Grafo 2.5D/3D
              </h2>
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                index.md + 4 Clusters
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 break-words mt-0.5">
              Fase 1: Construye la OVA · Fase 2: Arrastra o genera los 4
              clusters orbitales (
              <code className="font-mono text-indigo-600">raw/</code>,{' '}
              <code className="font-mono text-indigo-600">wiki/</code>,{' '}
              <code className="font-mono text-indigo-600">labs/</code>,{' '}
              <code className="font-mono text-indigo-600">lint/</code>)
            </p>
          </div>
        </div>

        {/* OVA Selector + Two Switchable Sub-View Tabs + Generate Brain Action */}
        <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
          <select
            value={selectedOva?.id ?? ''}
            onChange={(e) => {
              const nextId = e.target.value;
              setSelectedOvaId(nextId);
              const nextOva = ovas.find((o) => o.id === nextId);
              setSelectedLessonId(nextOva?.lessons[0]?.id ?? '');
              setSelectedBrainNodeId(null);
            }}
            className="min-w-0 flex-1 sm:flex-none px-2.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-full sm:max-w-[260px] truncate"
          >
            {ovas.map((ova) => (
              <option key={ova.id} value={ova.id}>
                {ova.code} · {ova.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCreateNewOva}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva OVA</span>
          </button>

          {/* 2 Sub-vistas conmutables (Respuesta A1 del usuario) */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSubView('builder')}
              className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all truncate ${
                subView === 'builder'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">
                1. Materiales ({totalOvaMaterials})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSubView('brain_canvas')}
              className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all truncate ${
                subView === 'brain_canvas'
                  ? 'bg-slate-900 text-cyan-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="truncate">
                2. Brain 3D ({activeNodes.length})
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerateFullBrainFromOva}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 shrink-0" />
            <span>Generar Brain de la OVA</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Banner */}
      {statusBanner && (
        <div className="bg-slate-900 text-cyan-200 border border-cyan-500/40 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          SUB-VISTA 1: CONSTRUCTOR DE OVA Y MATERIALES DE ESTUDIO
         ===================================================================== */}
      {subView === 'builder' && selectedOva && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: OVA Structure, Lessons & Quick Karpathy Material Creator */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* OVA Identity Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-600">
                  Ficha Técnica de la OVA (Núcleo index.md)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {placedBlockIds.size}/{totalOvaMaterials} en el Brain
                </span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título de la OVA
                </label>
                <input
                  type="text"
                  value={selectedOva.title}
                  onChange={(e) =>
                    handleUpdateSelectedOva({ title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Código OVA
                  </label>
                  <input
                    type="text"
                    value={selectedOva.code}
                    onChange={(e) =>
                      handleUpdateSelectedOva({ code: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Horas Estimadas
                  </label>
                  <input
                    type="number"
                    value={selectedOva.estimatedHours}
                    onChange={(e) =>
                      handleUpdateSelectedOva({
                        estimatedHours: Number(e.target.value) || 4,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Resultado de Aprendizaje (RAP)
                </label>
                <textarea
                  rows={2}
                  value={selectedOva.learningOutcome}
                  onChange={(e) =>
                    handleUpdateSelectedOva({
                      learningOutcome: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg resize-none"
                />
              </div>
            </div>

            {/* Lessons List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lecciones de la OVA ({selectedOva.lessons.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir Lección
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedOva.lessons.map((lesson) => {
                  const blocks = ensureLessonBlocks(lesson);
                  const inBrainCount = blocks.filter((b) =>
                    placedBlockIds.has(b.id)
                  ).length;
                  const isSelected = lesson.id === selectedLesson?.id;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-400 text-indigo-950 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {lesson.order}. {lesson.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {blocks.length} materiales ·{' '}
                          <span className="font-semibold text-indigo-600">
                            {inBrainCount} en el Brain
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Material Creator Classified by Karpathy Layer */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Añadir Material Clasificado para el Brain
                </h3>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Título del Nodo / Material
                </label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Ej: Event Loop y Microtareas..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Tipo de Material → Cluster Karpathy Destino
                </label>
                <select
                  value={quickType}
                  onChange={(e) =>
                    setQuickType(e.target.value as LessonBlockType)
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-cyan-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="quote">
                    📖 Cita de Libro / Fuente → Cluster raw/
                  </option>
                  <option value="video">
                    🎬 Video Multimedia → Cluster raw/
                  </option>
                  <option value="link">
                    🌐 Documentación Web → Cluster raw/
                  </option>
                  <option value="text">
                    🧠 Concepto Teórico → Cluster wiki/
                  </option>
                  <option value="code">
                    💻 Snippet de Código → Cluster wiki/
                  </option>
                  <option value="diagram">
                    📊 Diagrama de Flujo SVG → Cluster labs/
                  </option>
                  <option value="interactive">
                    🔬 Laboratorio Interactivo → Cluster labs/
                  </option>
                  <option value="exercise">
                    ⚡ Ejercicio Ejecutable JS → Cluster lint/practice/
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Contenido / Explicación / Enunciado
                </label>
                <textarea
                  rows={3}
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  placeholder="Escribe el contenido o código base del material..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 resize-none focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickAddMaterial(false)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
                >
                  + Guardar en OVA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddMaterial(true)}
                  className="px-3 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors"
                >
                  + Guardar y Enviar al Brain
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Active Lesson Study Materials & Direct Block Editor */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {selectedLesson ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex-1 min-w-[240px]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 font-bold">
                      Lección {selectedLesson.order} · Materiales de Estudio
                    </span>
                    <input
                      type="text"
                      value={selectedLesson.title}
                      onChange={(e) => {
                        const updatedLessons = selectedOva.lessons.map((l) =>
                          l.id === selectedLesson.id
                            ? { ...l, title: e.target.value }
                            : l
                        );
                        handleUpdateSelectedOva({ lessons: updatedLessons });
                      }}
                      className="w-full mt-1 text-base font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubView('brain_canvas')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <Orbit className="w-3.5 h-3.5 text-indigo-600" />
                      Ir al Brain para Arrastrar Materiales
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateFullBrainFromOva}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Generar Brain Completo Ahora
                    </button>
                  </div>
                </div>

                {/* Summary Matrix of Materials by Karpathy Cluster in this Lesson */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['raw', 'wiki', 'labs', 'practice'] as const).map(
                    (clusterKey) => {
                      const meta = CLUSTER_META[clusterKey];
                      const lessonBlocks = ensureLessonBlocks(selectedLesson);
                      const matching = lessonBlocks.filter(
                        (b) => classifyBlockToKarpathy(b).cluster === clusterKey
                      );
                      return (
                        <div
                          key={clusterKey}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${meta.lightBadge}`}
                            >
                              {meta.code}
                            </span>
                            <span className="text-sm font-bold text-slate-900 font-mono">
                              {matching.length}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1.5">
                            {meta.subtitle}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Quick Index of Blocks in Lesson with 1-Click Send to Brain & Highlight Anchor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Mapa de Bloques de la Lección (Clic para enviar al Brain o
                      editar abajo)
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {ensureLessonBlocks(selectedLesson).map((blk, idx) => {
                      const { cluster, layerIcon, materialIcon } =
                        classifyBlockToKarpathy(blk);
                      const meta = CLUSTER_META[cluster];
                      const isInBrain = placedBlockIds.has(blk.id);
                      const isHighlighted = highlightedBlockId === blk.id;
                      return (
                        <div
                          key={blk.id}
                          ref={(el) => {
                            builderBlockRefs.current[blk.id] = el;
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            isHighlighted
                              ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/50'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-lg border text-[10px] font-mono shrink-0 ${meta.lightBadge}`}
                              title={`${LAYER_ICON_LABELS[layerIcon]} · ${MATERIAL_ICON_LABELS[materialIcon]}`}
                            >
                              {renderLayerIcon(layerIcon, 'w-3 h-3')}
                              {renderMaterialIcon(materialIcon, 'w-3 h-3')}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                              {getShortBlockTitle(blk, idx)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              spawnBrainNodeFromBlock(selectedLesson, blk)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
                              isInBrain
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {isInBrain ? '✓ En Brain' : '+ Al Brain'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Full Interactive Block Editor (NotionLessonBlockEditor) */}
                <div className="pt-2 border-t border-slate-200 min-w-0 max-w-full overflow-x-hidden">
                  <NotionLessonBlockEditor
                    lesson={selectedLesson}
                    onUpdateLesson={(patch) => {
                      if (patch.blocks) {
                        handleUpdateLessonBlocks(
                          selectedLesson.id,
                          patch.blocks
                        );
                      } else {
                        const updatedLessons = selectedOva.lessons.map((l) =>
                          l.id === selectedLesson.id ? { ...l, ...patch } : l
                        );
                        handleUpdateSelectedOva({ lessons: updatedLessons });
                      }
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VISTA 2: CANVAS DEL BRAIN DE KARPATHY 2.5D/3D + BANDEJA DRAG & DROP
         ===================================================================== */}
      {subView === 'brain_canvas' && selectedOva && (
        <div
          className={`flex flex-col-reverse lg:flex-row gap-3.5 min-w-0 max-w-full ${
            isFullscreen
              ? 'flex-1 min-h-0'
              : compactMobile
              ? 'min-h-[640px]'
              : 'lg:h-[760px]'
          }`}
        >
          {/* LEFT DOCKABLE TRAY (Bottom drawer on mobile, Left panel on desktop): Bandeja de Materiales del Editor de la OVA */}
          {isTrayOpen && (
            <div className="w-full lg:w-96 max-h-[320px] lg:max-h-none lg:h-full bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col overflow-hidden shrink-0">
              {/* Tray Header */}
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold truncate">
                      Editor OVA · Materiales Arrastrables
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Arrastra cualquier bloque al Canvas o haz clic en un nodo
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTrayOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                  title="Ocultar bandeja"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lesson & Cluster Filter Bar */}
              <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedLesson?.id ?? ''}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800"
                  >
                    {selectedOva.lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        Lección {l.order}: {l.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setSubView('builder')}
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg whitespace-nowrap"
                    title="Volver al Constructor completo de la OVA"
                  >
                    Editar OVA
                  </button>
                </div>

                {/* Filter pills by Karpathy layer */}
                <div className="flex flex-wrap items-center gap-1">
                  {(
                    [
                      { id: 'all', label: 'Todos' },
                      { id: 'raw', label: 'raw/' },
                      { id: 'wiki', label: 'wiki/' },
                      { id: 'labs', label: 'labs/' },
                      { id: 'practice', label: 'lint/' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTrayFilterCluster(tab.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors ${
                        trayFilterCluster === tab.id
                          ? 'bg-slate-900 text-cyan-300'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Draggable Material Items List (Bidirectionally synced on click!) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedLesson ? (
                  ensureLessonBlocks(selectedLesson)
                    .filter((blk) => {
                      if (trayFilterCluster === 'all') return true;
                      return (
                        classifyBlockToKarpathy(blk).cluster ===
                        trayFilterCluster
                      );
                    })
                    .map((blk, idx) => {
                      const { cluster, layerIcon, materialIcon } =
                        classifyBlockToKarpathy(blk);
                      const meta = CLUSTER_META[cluster];
                      const isInBrain = placedBlockIds.has(blk.id);
                      const isHighlighted = highlightedBlockId === blk.id;

                      return (
                        <div
                          key={blk.id}
                          ref={(el) => {
                            trayBlockRefs.current[blk.id] = el;
                          }}
                          draggable
                          onDragStart={(e) =>
                            handleTrayDragStart(e, selectedLesson, blk)
                          }
                          className={`p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${
                            isHighlighted
                              ? 'bg-indigo-50/95 border-indigo-500 ring-2 ring-indigo-400 shadow-md'
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {/* The 2 Classification Icons */}
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-mono font-bold shrink-0 ${meta.lightBadge}`}
                              >
                                {renderLayerIcon(layerIcon, 'w-3 h-3')}
                                {renderMaterialIcon(materialIcon, 'w-3 h-3')}
                                <span>{meta.code}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {isInBrain ? (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                                  En Brain
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    spawnBrainNodeFromBlock(selectedLesson, blk)
                                  }
                                  className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors"
                                  title="Añadir este material a su cluster orbital en el Brain"
                                >
                                  + Soltar
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Editable Block Title directly in the Tray (Bidirectional sync!) */}
                          <div className="mt-2">
                            <input
                              type="text"
                              value={getShortBlockTitle(blk, idx)}
                              onChange={(e) => {
                                const nextBlocks = ensureLessonBlocks(
                                  selectedLesson
                                ).map((b) =>
                                  b.id === blk.id
                                    ? { ...b, title: e.target.value }
                                    : b
                                );
                                handleUpdateLessonBlocks(
                                  selectedLesson.id,
                                  nextBlocks
                                );
                              }}
                              className="w-full text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                            />
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                              {blk.content}
                            </p>
                          </div>

                          {isHighlighted && (
                            <div className="mt-2 pt-2 border-t border-indigo-200 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold text-indigo-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Sincronizado con nodo activo
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleJumpToFullBuilderForBlock(
                                    selectedLesson.id,
                                    blk.id
                                  )
                                }
                                className="text-[10px] font-bold text-indigo-700 underline hover:text-indigo-900"
                              >
                                Abrir en Editor OVA →
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">
                    Selecciona una lección para ver sus materiales.
                  </p>
                )}
              </div>

              {/* Quick Create & Drag Footer inside Tray */}
              <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Crear Material Rápido y Enviar al Brain
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="Título del nuevo nodo..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={quickType}
                    onChange={(e) =>
                      setQuickType(e.target.value as LessonBlockType)
                    }
                    className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                  >
                    <option value="quote">raw/Libro</option>
                    <option value="video">raw/Video</option>
                    <option value="text">wiki/Teoría</option>
                    <option value="code">wiki/Código</option>
                    <option value="diagram">labs/Diagrama</option>
                    <option value="interactive">labs/Lab</option>
                    <option value="exercise">lint/Ejercicio</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleQuickAddMaterial(true)}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    title="Crear material en la OVA y añadirlo al Brain"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT 2D/3D BRAIN CANVAS VIEWPORT */}
          <div
            ref={canvasViewportRef}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleViewportPointerMove}
            onPointerUp={handleViewportPointerUp}
            className={`flex-1 min-h-[430px] sm:min-h-[520px] lg:h-full rounded-2xl border relative overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing transition-colors duration-300 ${
              isDark
                ? 'bg-[#060a17] border-slate-800 text-slate-100'
                : 'bg-[#f4f6fb] border-slate-300 text-slate-900'
            }`}
          >
            {/* LAYER 0: Deep Parallax 3D Nebula & Multi-Depth Starfield/Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none transition-transform duration-150 ease-out"
              style={{
                transform: `translate3d(${mouseParallax.x * -0.6}px, ${
                  mouseParallax.y * -0.6
                }px, 0)`,
                backgroundImage: isDark
                  ? 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.09) 0%, rgba(99, 102, 241, 0.06) 35%, rgba(6, 10, 23, 0) 75%), radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)'
                  : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.05) 40%, rgba(244, 246, 251, 0) 75%), radial-gradient(rgba(100, 116, 139, 0.24) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 28px 28px',
              }}
            />

            {/* TOP FLOATING CONTROLS BAR ON CANVAS */}
            <div
              data-brain-interactive="true"
              className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {!isTrayOpen && (
                  <button
                    type="button"
                    onClick={() => setIsTrayOpen(true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-md backdrop-blur-md ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-700 text-cyan-300 hover:bg-slate-800'
                        : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                    Abrir Bandeja OVA ({totalOvaMaterials})
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleGenerateFullBrainFromOva}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md hover:opacity-95 transition-opacity"
                  title="Compilar automáticamente los materiales de la OVA en los 4 clusters orbitales"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Generar Brain (4 Clusters)
                </button>

                <button
                  type="button"
                  onClick={handleResetBrainToManualCuration}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                      : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Dejar solo el núcleo index.md para arrastrar bloques uno por uno manualmente"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Modo Manual (Vaciar)
                </button>
              </div>

              {/* Right Controls: Theme Switcher (Deep Synapse Dark / Academic Light 2.5D), 3D Tilt Angle, Zoom, Fullscreen */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* 3D Perspective Tilt Slider */}
                <div
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-mono backdrop-blur-md ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                      : 'bg-white/90 border-slate-300 text-slate-700'
                  }`}
                >
                  <span>3D Tilt: {cameraTiltDeg}°</span>
                  <input
                    type="range"
                    min={0}
                    max={26}
                    value={cameraTiltDeg}
                    onChange={(e) => setCameraTiltDeg(Number(e.target.value))}
                    className="w-16 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Theme Toggle (Respuesta A4: Oscuro Neuronal Conmutable con Modo Claro) */}
                <button
                  type="button"
                  onClick={() =>
                    setCanvasTheme((prev) =>
                      prev === 'deep_synapse' ? 'light_25d' : 'deep_synapse'
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-colors ${
                    isDark
                      ? 'bg-slate-900/85 border-cyan-500/40 text-cyan-300 hover:bg-slate-800'
                      : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      Deep Synapse
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Claro 2.5D
                    </>
                  )}
                </button>

                {/* Zoom Controls */}
                <div
                  className={`flex items-center rounded-xl border backdrop-blur-md overflow-hidden ${
                    isDark
                      ? 'bg-slate-900/85 border-slate-700 text-slate-200'
                      : 'bg-white/95 border-slate-300 text-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.max(0.32, Number((z - 0.08).toFixed(2))))
                    }
                    className="p-1.5 hover:bg-slate-500/20"
                    title="Alejar"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => centerCanvasViewport()}
                    className="px-2 text-[11px] font-mono"
                    title="Centrar vista en el núcleo index.md"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.min(1.45, Number((z + 0.08).toFixed(2))))
                    }
                    className="p-1.5 hover:bg-slate-500/20"
                    title="Acercar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreen((f) => !f)}
                  className={`p-1.5 rounded-xl border backdrop-blur-md ${
                    isDark
                      ? 'bg-slate-900/85 border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                  title={
                    isFullscreen
                      ? 'Salir de pantalla completa'
                      : 'Pantalla completa'
                  }
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Connection Mode Active Banner */}
            {connectingFromNodeId && (
              <div
                data-brain-interactive="true"
                className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-cyan-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>
                  Haz clic en otro nodo del Brain para conectar una sinapsis
                </span>
                <button
                  type="button"
                  onClick={() => setConnectingFromNodeId(null)}
                  className="ml-1 underline"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* 2.5D / 3D PERSPECTIVE WORLD CONTAINER */}
            <div className="w-full h-full brain-perspective-stage">
              <div
                className="w-[1700px] h-[1080px] relative transition-transform duration-75 ease-out"
                style={{
                  transformOrigin: '0 0',
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="w-full h-full relative"
                  style={{
                    transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                    transform: `rotateX(${cameraTiltDeg}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                {/* LAYER 1: 4 KARPATHY ORBITAL CLUSTER ZONES (raw/, wiki/, labs/, lint/practice/) */}
                {activeZones.map((zone) => {
                  const meta = CLUSTER_META[zone.cluster];
                  const clusterNodeCount = activeNodes.filter(
                    (n) => n.cluster === zone.cluster
                  ).length;

                  return (
                    <div
                      key={zone.id}
                      data-brain-interactive="true"
                      onPointerDown={(e) => handleZonePointerDown(e, zone)}
                      style={{
                        left: zone.x - zone.radius,
                        top: zone.y - zone.radius,
                        width: zone.radius * 2,
                        height: zone.radius * 2,
                        background: `radial-gradient(circle, ${meta.glowHex} 0%, transparent 72%)`,
                      }}
                      className={`absolute rounded-full border-2 border-dashed transition-shadow cursor-move flex flex-col items-center justify-start pt-4 ${
                        isDark
                          ? 'border-slate-700/80 hover:border-slate-500'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {/* Rotating orbital inner ring */}
                      <div
                        className="absolute inset-5 rounded-full border border-dotted pointer-events-none animate-orbital-slow opacity-45"
                        style={{ borderColor: meta.strokeColor }}
                      />

                      {/* Cluster Header Pill */}
                      <div
                        className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
                          isDark ? meta.darkBadge : meta.lightBadge
                        }`}
                      >
                        <Move className="w-3 h-3 opacity-70" />
                        <span>{zone.title}</span>
                        <span className="opacity-75">({clusterNodeCount})</span>
                      </div>
                      <span
                        className={`text-[10px] mt-1 px-2 text-center max-w-[230px] ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {zone.subtitle}
                      </span>
                    </div>
                  );
                })}

                {/* LAYER 2: SYNAPTIC SVG CONNECTIONS WITH ANIMATED 3D PULSES */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Orbital guide lines from index.md core to each of the 4 cluster centers */}
                  {activeZones.map((zone) => {
                    const core = activeNodes.find((n) => n.cluster === 'index');
                    if (!core) return null;
                    const meta = CLUSTER_META[zone.cluster];
                    return (
                      <line
                        key={`orbit-guide-${zone.id}`}
                        x1={core.x}
                        y1={core.y}
                        x2={zone.x}
                        y2={zone.y}
                        stroke={meta.strokeColor}
                        strokeOpacity={isDark ? 0.16 : 0.22}
                        strokeWidth={1.5}
                        strokeDasharray="4 8"
                      />
                    );
                  })}

                  {/* Synaptic Bezier Edges between Brain Nodes */}
                  {activeEdges.map((edge) => {
                    const source = activeNodes.find(
                      (n) => n.id === edge.sourceId
                    );
                    const target = activeNodes.find(
                      (n) => n.id === edge.targetId
                    );
                    if (!source || !target) return null;

                    const meta = CLUSTER_META[edge.cluster] ?? CLUSTER_META.wiki;
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const cx1 = Math.round(source.x + dx * 0.45 - dy * 0.12);
                    const cy1 = Math.round(source.y + dy * 0.18 + dx * 0.08);
                    const cx2 = Math.round(source.x + dx * 0.65 - dy * 0.08);
                    const cy2 = Math.round(source.y + dy * 0.82 + dx * 0.05);
                    const pathD = `M ${source.x} ${source.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${target.x} ${target.y}`;

                    const isHighlightedEdge =
                      selectedBrainNodeId === source.id ||
                      selectedBrainNodeId === target.id ||
                      hoveredNodeId === source.id ||
                      hoveredNodeId === target.id;

                    return (
                      <g
                        key={edge.id}
                        data-brain-interactive="true"
                        className="pointer-events-auto cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBrainEdges((prev) =>
                            prev.filter((item) => item.id !== edge.id)
                          );
                          showToast('Conexión sináptica eliminada.');
                        }}
                      >
                        <title>Clic para desconectar esta sinapsis</title>
                        {/* Invisible wider hit area for easy edge clicking */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="transparent"
                          strokeWidth={14}
                        />
                        {/* Base neural fiber */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={meta.strokeColor}
                          strokeOpacity={
                            isHighlightedEdge ? 0.85 : isDark ? 0.32 : 0.38
                          }
                          strokeWidth={isHighlightedEdge ? 2.6 : 1.6}
                        />
                        {/* Animated synaptic action potential pulse */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={meta.pulseColor}
                          strokeOpacity={isHighlightedEdge ? 1 : 0.75}
                          strokeWidth={isHighlightedEdge ? 3 : 2}
                          className="animate-synapse-flow"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* LAYER 3: MINIMALIST 3D-TILT BRAIN NODES (Title + 2 Classification Icons, Editable & Draggable) */}
                {activeNodes.map((node) => {
                  const meta = CLUSTER_META[node.cluster];
                  const isCore = node.cluster === 'index';
                  const isSelected = selectedBrainNodeId === node.id;
                  const isEditing = editingNodeId === node.id;
                  const tilt = nodeTiltMap[node.id] ?? { rx: 0, ry: 0 };

                  // 3D depth parallax offset per node
                  const parallaxX =
                    mouseParallax.x * (node.zDepth - 0.95) * 1.4;
                  const parallaxY =
                    mouseParallax.y * (node.zDepth - 0.95) * 1.4;

                  return (
                    <div
                      key={node.id}
                      data-brain-interactive="true"
                      onPointerDown={(e) => handleNodePointerDown(e, node)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingNodeId(node.id);
                      }}
                      onPointerEnter={() => setHoveredNodeId(node.id)}
                      onPointerMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const relX =
                          (e.clientX - rect.left) / Math.max(rect.width, 1) -
                          0.5;
                        const relY =
                          (e.clientY - rect.top) / Math.max(rect.height, 1) -
                          0.5;
                        setNodeTiltMap((prev) => ({
                          ...prev,
                          [node.id]: {
                            rx: Number((-relY * 22).toFixed(1)),
                            ry: Number((relX * 22).toFixed(1)),
                          },
                        }));
                      }}
                      onPointerLeave={() => {
                        setHoveredNodeId((prev) =>
                          prev === node.id ? null : prev
                        );
                        setNodeTiltMap((prev) => {
                          if (!prev[node.id]) return prev;
                          const next = { ...prev };
                          delete next[node.id];
                          return next;
                        });
                      }}
                      style={{
                        left: node.x,
                        top: node.y,
                        transform: `translate3d(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px), ${
                          isSelected ? 28 : Math.round((node.zDepth - 0.85) * 45)
                        }px) rotateX(${tilt.rx}deg) rotateY(${
                          tilt.ry
                        }deg) scale(${isSelected ? 1.07 : node.zDepth})`,
                      }}
                      className="absolute z-20 brain-node-3d-card"
                    >
                      <div
                        style={{
                          animationDelay: `${node.floatPhase ?? 0}s`,
                        }}
                        className={`animate-brain-levitate rounded-2xl border backdrop-blur-xl transition-all ${
                          isCore
                            ? 'px-4 py-3 min-w-[210px] max-w-[280px] border-2'
                            : 'px-3 py-2 min-w-[165px] max-w-[235px]'
                        } ${isDark ? meta.darkCard : meta.lightCard} ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.45)]'
                            : ''
                        }`}
                      >
                        {/* MINIMALIST NODE CONTENT: ONLY THE PAIR OF CLASSIFICATION ICONS + THE TITLE */}
                        <div className="flex items-center gap-2.5">
                          {/* Pair of Classification Icons (Icon 1: Karpathy Layer + Icon 2: Material Type) */}
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl border shrink-0 ${
                              isDark ? meta.darkBadge : meta.lightBadge
                            }`}
                            title={`${LAYER_ICON_LABELS[node.layerIcon]} · ${MATERIAL_ICON_LABELS[node.materialIcon]}`}
                          >
                            {renderLayerIcon(node.layerIcon, 'w-3.5 h-3.5')}
                            {renderMaterialIcon(
                              node.materialIcon,
                              'w-3.5 h-3.5'
                            )}
                          </div>

                          {/* Node Title (Inline Editable on Double-Click or Edit Mode) */}
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <input
                                type="text"
                                autoFocus
                                value={node.title}
                                onChange={(e) =>
                                  handleUpdateBrainNode(node.id, {
                                    title: e.target.value,
                                  })
                                }
                                onBlur={() => setEditingNodeId(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Escape') {
                                    setEditingNodeId(null);
                                  }
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className={`w-full text-xs font-bold px-1.5 py-0.5 rounded border focus:outline-none ${
                                  isDark
                                    ? 'bg-slate-950 text-white border-cyan-400'
                                    : 'bg-slate-50 text-slate-900 border-indigo-500'
                                }`}
                              />
                            ) : (
                              <div
                                className={`font-bold leading-snug truncate ${
                                  isCore ? 'text-xs' : 'text-[11px]'
                                }`}
                                title={`${node.title} (Doble clic para editar)`}
                              >
                                {node.title}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Micro-Toolbar ONLY visible when the node is selected */}
                        {isSelected && (
                          <div
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`mt-2 pt-2 border-t flex items-center justify-between gap-1 text-[10px] ${
                              isDark ? 'border-slate-700/80' : 'border-slate-200'
                            }`}
                          >
                            {/* Edit Icon 1 (Layer) & Icon 2 (Material) */}
                            <select
                              value={node.layerIcon}
                              onChange={(e) => {
                                const nextLayer = e.target
                                  .value as BrainLayerIconKind;
                                const clusterMap: Record<
                                  BrainLayerIconKind,
                                  KarpathyClusterType
                                > = {
                                  index_hub: 'index',
                                  raw_vault: 'raw',
                                  wiki_node: 'wiki',
                                  lab_model: 'labs',
                                  lint_check: 'practice',
                                };
                                handleUpdateBrainNode(node.id, {
                                  layerIcon: nextLayer,
                                  cluster: clusterMap[nextLayer],
                                });
                              }}
                              className={`px-1 py-0.5 rounded border text-[9px] font-mono ${
                                isDark
                                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                                  : 'bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                              title="Cambiar Icono Clasificador 1 (Capa Karpathy)"
                            >
                              <option value="raw_vault">raw/</option>
                              <option value="wiki_node">wiki/</option>
                              <option value="lab_model">labs/</option>
                              <option value="lint_check">lint/</option>
                              <option value="index_hub">index</option>
                            </select>

                            <select
                              value={node.materialIcon}
                              onChange={(e) =>
                                handleUpdateBrainNode(node.id, {
                                  materialIcon: e.target
                                    .value as BrainMaterialIconKind,
                                })
                              }
                              className={`px-1 py-0.5 rounded border text-[9px] font-mono ${
                                isDark
                                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                                  : 'bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                              title="Cambiar Icono Clasificador 2 (Tipo de Material)"
                            >
                              <option value="book">Libro</option>
                              <option value="concept">Concepto</option>
                              <option value="code">Código</option>
                              <option value="diagram">Diagrama</option>
                              <option value="interactive">Lab</option>
                              <option value="exercise">Ejercicio</option>
                              <option value="video">Video</option>
                              <option value="link">Web</option>
                              <option value="core">Core</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setEditingNodeId(node.id)}
                              className="p-1 rounded hover:bg-cyan-500/20 text-cyan-400"
                              title="Editar título del nodo"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setConnectingFromNodeId(node.id)}
                              className="p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                              title="Conectar sinapsis con otro nodo"
                            >
                              <Link2 className="w-3 h-3" />
                            </button>

                            {!isCore && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBrainNode(node.id)}
                                className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                title="Quitar nodo del Brain"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>

            {/* BOTTOM LEGEND & SELECTED NODE INSPECTOR BAR */}
            <div
              data-brain-interactive="true"
              className={`absolute bottom-3 left-3 right-3 z-30 px-3.5 py-2 rounded-xl border backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] pointer-events-auto ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                  : 'bg-white/95 border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-cyan-400">
                  Arquitectura Karpathy:
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <strong>index.md</strong> (Núcleo)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <strong>raw/</strong> (Fuentes/Libros)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <strong>wiki/</strong> (Conceptos/Código)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                  <strong>labs/</strong> (Diagramas/Labs)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <strong>lint/practice/</strong> (Ejercicios)
                </span>
              </div>

              {selectedBrainNode ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate max-w-[220px]">
                    Activo: {selectedBrainNode.title}
                  </span>
                  {selectedBrainNode.blockId && (
                    <button
                      type="button"
                      onClick={() =>
                        handleJumpToFullBuilderForBlock(
                          selectedBrainNode.lessonId,
                          selectedBrainNode.blockId
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                    >
                      Ver en Editor OVA →
                    </button>
                  )}
                </div>
              ) : (
                <span className="opacity-75">
                  Tip: Arrastra bloques desde la bandeja izquierda · Doble clic
                  en cualquier nodo para editar su título e iconos
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
