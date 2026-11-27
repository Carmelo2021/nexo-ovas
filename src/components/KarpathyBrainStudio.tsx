import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  Copy,
  Cpu,
  Database,
  Edit3,
  FileText,
  FlaskConical,
  GitBranch,
  Globe,
  GripVertical,
  Hand,
  HelpCircle,
  Keyboard,
  Layers,
  Link2,
  Maximize2,
  Minimize2,
  Moon,
  MousePointer,
  Move,
  Orbit,
  Plus,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Trash2,
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

type FigmaToolMode = 'select' | 'hand' | 'connect';

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
    defaultLayerIcon: BrainLayerIconKind;
  }
> = {
  index: {
    code: 'index.md',
    label: 'Núcleo index.md',
    subtitle: 'Catálogo Maestro de la OVA',
    darkBadge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50',
    lightBadge: 'bg-cyan-100 text-cyan-900 border-cyan-400',
    darkCard:
      'bg-slate-900/95 border-cyan-400/80 text-white shadow-[0_0_36px_rgba(34,211,238,0.38)]',
    lightCard:
      'bg-white border-cyan-600 text-slate-900 shadow-[0_14px_30px_rgba(8,145,178,0.22)]',
    strokeColor: '#22d3ee',
    pulseColor: '#67e8f9',
    glowHex: 'rgba(34, 211, 238, 0.25)',
    defaultLayerIcon: 'index_hub',
  },
  raw: {
    code: 'raw/',
    label: 'Cluster raw/',
    subtitle: 'Fuentes Inmutables, Libros y Videos',
    darkBadge: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    lightBadge: 'bg-amber-100 text-amber-900 border-amber-400',
    darkCard:
      'bg-slate-900/90 border-amber-400/60 text-amber-50 shadow-[0_10px_26px_rgba(245,158,11,0.22)]',
    lightCard:
      'bg-white/95 border-amber-500 text-slate-900 shadow-[0_10px_24px_rgba(245,158,11,0.16)]',
    strokeColor: '#f59e0b',
    pulseColor: '#fde68a',
    glowHex: 'rgba(245, 158, 11, 0.16)',
    defaultLayerIcon: 'raw_vault',
  },
  wiki: {
    code: 'wiki/',
    label: 'Cluster wiki/',
    subtitle: 'Conceptos Compilados y Código',
    darkBadge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    lightBadge: 'bg-indigo-100 text-indigo-900 border-indigo-400',
    darkCard:
      'bg-slate-900/90 border-indigo-400/60 text-indigo-50 shadow-[0_10px_26px_rgba(99,102,241,0.24)]',
    lightCard:
      'bg-white/95 border-indigo-500 text-slate-900 shadow-[0_10px_24px_rgba(99,102,241,0.16)]',
    strokeColor: '#818cf8',
    pulseColor: '#c7d2fe',
    glowHex: 'rgba(99, 102, 241, 0.16)',
    defaultLayerIcon: 'wiki_node',
  },
  labs: {
    code: 'labs/',
    label: 'Cluster labs/',
    subtitle: 'Diagramas y Modelos Interactivos',
    darkBadge: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40',
    lightBadge: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-400',
    darkCard:
      'bg-slate-900/90 border-fuchsia-400/60 text-fuchsia-50 shadow-[0_10px_26px_rgba(217,70,239,0.22)]',
    lightCard:
      'bg-white/95 border-fuchsia-500 text-slate-900 shadow-[0_10px_24px_rgba(217,70,239,0.16)]',
    strokeColor: '#e879f9',
    pulseColor: '#f5d0fe',
    glowHex: 'rgba(217, 70, 239, 0.16)',
    defaultLayerIcon: 'lab_model',
  },
  practice: {
    code: 'lint/practice/',
    label: 'Cluster lint/practice/',
    subtitle: 'Ejercicios Ejecutables y Verificación',
    darkBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    lightBadge: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    darkCard:
      'bg-slate-900/90 border-emerald-400/60 text-emerald-50 shadow-[0_10px_26px_rgba(16,185,129,0.22)]',
    lightCard:
      'bg-white/95 border-emerald-500 text-slate-900 shadow-[0_10px_24px_rgba(16,185,129,0.16)]',
    strokeColor: '#10b981',
    pulseColor: '#a7f3d0',
    glowHex: 'rgba(16, 185, 129, 0.16)',
    defaultLayerIcon: 'lint_check',
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

const CENTER_X = 850;
const CENTER_Y = 540;
const WORLD_WIDTH = 1700;
const WORLD_HEIGHT = 1080;

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
      radius: 220,
    },
    {
      id: `zone-${ovaId}-wiki`,
      ovaId,
      cluster: 'wiki',
      title: 'wiki/ · Conceptos Compilados',
      subtitle: 'Síntesis teórica, arquitectura y patrones de código',
      x: CENTER_X + 420,
      y: CENTER_Y - 260,
      radius: 220,
    },
    {
      id: `zone-${ovaId}-labs`,
      ovaId,
      cluster: 'labs',
      title: 'labs/ · Modelos Visuales',
      subtitle: 'Diagramas de flujo SVG y laboratorios interactivos',
      x: CENTER_X - 420,
      y: CENTER_Y + 260,
      radius: 220,
    },
    {
      id: `zone-${ovaId}-practice`,
      ovaId,
      cluster: 'practice',
      title: 'lint/practice/ · Ejercicios',
      subtitle: 'Retos ejecutables en vivo y validación sináptica',
      x: CENTER_X + 420,
      y: CENTER_Y + 260,
      radius: 220,
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
    zDepth: 1.2,
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
    let exerciseCountForLesson = 0;
    for (const block of blocks) {
      gIdx += 1;
      if (block.type === 'exercise') {
        exerciseCountForLesson += 1;
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
      const ringIndex = Math.floor(idx / 6);
      const posInRing = idx % 6;
      const countInRing = Math.min(total - ringIndex * 6, 6);
      const angle =
        (posInRing / Math.max(countInRing, 1)) * Math.PI * 2 - Math.PI / 4;
      const radius = 105 + ringIndex * 82;
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
        zDepth: Number((0.88 + (idx % 4) * 0.08).toFixed(2)),
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
  // 1. Sub-view state: 'builder' (Construir OVA primero) | 'brain_canvas' (Canvas 2.5D/3D con motor Figma)
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
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(
          BRAIN_STORAGE_KEYS.ZONES,
          JSON.stringify(brainZones)
        );
      } catch {
        // ignore
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [brainZones]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(
          BRAIN_STORAGE_KEYS.NODES,
          JSON.stringify(brainNodes)
        );
      } catch {
        // ignore
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [brainNodes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(
          BRAIN_STORAGE_KEYS.EDGES,
          JSON.stringify(brainEdges)
        );
      } catch {
        // ignore
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [brainEdges]);

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

  // 4. Visual Theme, Figma Tool Mode, Physics & Viewport State
  const [canvasTheme, setCanvasTheme] = useState<'deep_synapse' | 'light_25d'>(
    'deep_synapse'
  );
  const [toolMode, setToolMode] = useState<FigmaToolMode>('select');
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState<boolean>(false);
  const [isMagneticSnapEnabled, setIsMagneticSnapEnabled] =
    useState<boolean>(true);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  const [cameraTiltDeg, setCameraTiltDeg] = useState<number>(12);
  const [zoom, setZoom] = useState<number>(() =>
    typeof window !== 'undefined' && (window.innerWidth < 768 || compactMobile)
      ? 0.44
      : 0.76
  );
  const [pan, setPan] = useState<{ x: number; y: number }>({
    x: -110,
    y: -60,
  });
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  panRef.current = pan;
  zoomRef.current = zoom;

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTrayOpen, setIsTrayOpen] = useState<boolean>(true);
  const [trayFilterCluster, setTrayFilterCluster] = useState<
    'all' | Exclude<KarpathyClusterType, 'index'>
  >('all');

  // 5. Figma Multi-Selection, Marquee Box, Alignment Guides & Live Synaptic Wire
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const primarySelectedNodeId = selectedNodeIds[0] ?? null;

  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(
    null
  );
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Live Wire Connection (Drag from port or node to another node)
  const [liveWire, setLiveWire] = useState<{
    sourceId: string;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
    snappedTargetId: string | null;
  } | null>(null);

  // Figma Marquee Selection Box (in world coordinates)
  const [marqueeBox, setMarqueeBox] = useState<{
    startX: number;
    startY: number;
    currX: number;
    currY: number;
  } | null>(null);

  // Smart Figma Alignment Guides (horizontal / vertical snap lines)
  const [alignGuides, setAlignGuides] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  // High-Performance Motion Values for Parallax (Zero React re-renders on mouse move!)
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const smoothParallaxX = useSpring(parallaxX, {
    stiffness: 180,
    damping: 24,
  });
  const smoothParallaxY = useSpring(parallaxY, {
    stiffness: 180,
    damping: 24,
  });

  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const trayBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const builderBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Pointer Drag State (Pan, Multi-Node Drag with 5px Slop Threshold, Zone Drag)
  const [dragState, setDragState] = useState<
    | {
        kind: 'pan';
        startX: number;
        startY: number;
        initialPanX: number;
        initialPanY: number;
      }
    | {
        kind: 'nodes';
        primaryNodeId: string;
        startX: number;
        startY: number;
        hasExceededThreshold: boolean;
        initialPositions: Record<string, { x: number; y: number }>;
      }
    | {
        kind: 'zone';
        zoneId: string;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
        containedNodeInitials: Record<string, { x: number; y: number }>;
      }
    | null
  >(null);

  // Quick add material state
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickType, setQuickType] = useState<LessonBlockType>('text');
  const [quickContent, setQuickContent] = useState<string>('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setStatusBanner(msg);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 3600);
  }, []);

  // --- CAMERA & VIEWPORT HELPERS (FIGMA ZOOM-TO-FIT, ZOOM-TO-SELECTION, ZOOM-TO-CURSOR) ---
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const el = canvasViewportRef.current;
    if (!el) return { x: CENTER_X, y: CENTER_Y };
    const rect = el.getBoundingClientRect();
    return {
      x: (clientX - rect.left - panRef.current.x) / zoomRef.current,
      y: (clientY - rect.top - panRef.current.y) / zoomRef.current,
    };
  }, []);

  const centerCanvasViewport = useCallback(
    (customZoom?: number) => {
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
    },
    [compactMobile]
  );

  // Figma Shift + 1: Zoom to Fit All Active Nodes & Zones
  const handleZoomToFitAll = useCallback(() => {
    const el = canvasViewportRef.current;
    if (!el || activeNodes.length === 0) {
      centerCanvasViewport();
      return;
    }
    const rect = el.getBoundingClientRect();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    activeNodes.forEach((n) => {
      minX = Math.min(minX, n.x - 140);
      minY = Math.min(minY, n.y - 80);
      maxX = Math.max(maxX, n.x + 140);
      maxY = Math.max(maxY, n.y + 80);
    });
    activeZones.forEach((z) => {
      minX = Math.min(minX, z.x - z.radius);
      minY = Math.min(minY, z.y - z.radius);
      maxX = Math.max(maxX, z.x + z.radius);
      maxY = Math.max(maxY, z.y + z.radius);
    });

    const boxW = Math.max(maxX - minX, 320);
    const boxH = Math.max(maxY - minY, 240);
    const pad = 70;
    const nextZoom = Math.min(
      1.25,
      Math.max(
        0.34,
        Number(
          Math.min(
            (rect.width - pad * 2) / boxW,
            (rect.height - pad * 2) / boxH
          ).toFixed(2)
        )
      )
    );
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoom(nextZoom);
    setPan({
      x: Math.round(rect.width / 2 - centerX * nextZoom),
      y: Math.round(rect.height / 2 - centerY * nextZoom),
    });
  }, [activeNodes, activeZones, centerCanvasViewport]);

  // Figma Shift + 2: Zoom to Selected Node(s)
  const handleZoomToSelection = useCallback(() => {
    const el = canvasViewportRef.current;
    if (!el) return;
    const selected = activeNodes.filter((n) => selectedNodeIds.includes(n.id));
    if (selected.length === 0) {
      handleZoomToFitAll();
      return;
    }
    const rect = el.getBoundingClientRect();
    const avgX =
      selected.reduce((acc, n) => acc + n.x, 0) / Math.max(selected.length, 1);
    const avgY =
      selected.reduce((acc, n) => acc + n.y, 0) / Math.max(selected.length, 1);
    const targetZoom = selected.length === 1 ? 1.05 : 0.88;
    setZoom(targetZoom);
    setPan({
      x: Math.round(rect.width / 2 - avgX * targetZoom),
      y: Math.round(rect.height / 2 - avgY * targetZoom),
    });
  }, [activeNodes, selectedNodeIds, handleZoomToFitAll]);

  useEffect(() => {
    if (subView === 'brain_canvas') {
      const id = window.setTimeout(() => {
        centerCanvasViewport();
      }, 60);
      return () => window.clearTimeout(id);
    }
  }, [subView, centerCanvasViewport]);

  // --- 60FPS D3-FORCE / VERLET NEURAL PHYSICS ENGINE ---
  useEffect(() => {
    if (!isPhysicsEnabled || subView !== 'brain_canvas' || !selectedOva) return;

    let animFrameId: number;
    const runPhysicsTick = () => {
      setBrainNodes((prevNodes) => {
        const ovaNodes = prevNodes.filter((n) => n.ovaId === selectedOva.id);
        if (ovaNodes.length <= 1) return prevNodes;

        const draggedIds =
          dragState?.kind === 'nodes'
            ? new Set(Object.keys(dragState.initialPositions))
            : new Set<string>();

        const deltas: Record<string, { dx: number; dy: number }> = {};
        ovaNodes.forEach((n) => {
          deltas[n.id] = { dx: 0, dy: 0 };
        });

        // 1. Node-to-Node Coulomb Repulsion (prevents overlapping capsules)
        const minDistance = 175;
        for (let i = 0; i < ovaNodes.length; i++) {
          for (let j = i + 1; j < ovaNodes.length; j++) {
            const a = ovaNodes[i];
            const b = ovaNodes[j];
            const vx = b.x - a.x;
            const vy = b.y - a.y;
            const dist = Math.sqrt(vx * vx + vy * vy) || 1;
            if (dist < minDistance) {
              const force = ((minDistance - dist) / dist) * 0.14;
              const fx = vx * force;
              const fy = vy * force;
              if (a.cluster !== 'index' && !draggedIds.has(a.id)) {
                deltas[a.id].dx -= fx;
                deltas[a.id].dy -= fy;
              }
              if (b.cluster !== 'index' && !draggedIds.has(b.id)) {
                deltas[b.id].dx += fx;
                deltas[b.id].dy += fy;
              }
            }
          }
        }

        // 2. Orbital Cluster Gravity (pulls each node smoothly toward its assigned Karpathy Orbital Zone)
        ovaNodes.forEach((n) => {
          if (n.cluster === 'index' || draggedIds.has(n.id)) return;
          const zone = activeZones.find((z) => z.cluster === n.cluster);
          if (!zone) return;
          const vx = zone.x - n.x;
          const vy = zone.y - n.y;
          const dist = Math.sqrt(vx * vx + vy * vy) || 1;
          const targetOrbit = 120;
          const radialDiff = dist - targetOrbit;
          if (Math.abs(radialDiff) > 12) {
            const pull = (radialDiff / dist) * 0.045;
            deltas[n.id].dx += vx * pull;
            deltas[n.id].dy += vy * pull;
          }
        });

        // 3. Custom Synaptic Edge Spring Attraction (connected non-core nodes attract gently)
        activeEdges.forEach((edge) => {
          const source = ovaNodes.find((n) => n.id === edge.sourceId);
          const target = ovaNodes.find((n) => n.id === edge.targetId);
          if (!source || !target) return;
          if (source.cluster === 'index' || target.cluster === 'index') return;
          const vx = target.x - source.x;
          const vy = target.y - source.y;
          const dist = Math.sqrt(vx * vx + vy * vy) || 1;
          const idealLength = 210;
          const diff = (dist - idealLength) * 0.03;
          const fx = (vx / dist) * diff;
          const fy = (vy / dist) * diff;
          if (!draggedIds.has(source.id)) {
            deltas[source.id].dx += fx;
            deltas[source.id].dy += fy;
          }
          if (!draggedIds.has(target.id)) {
            deltas[target.id].dx -= fx;
            deltas[target.id].dy -= fy;
          }
        });

        // Check if any meaningful movement occurred
        let moved = false;
        const nextNodes = prevNodes.map((n) => {
          if (n.ovaId !== selectedOva.id) return n;
          const d = deltas[n.id];
          if (!d || (Math.abs(d.dx) < 0.25 && Math.abs(d.dy) < 0.25)) {
            return n;
          }
          moved = true;
          return {
            ...n,
            x: Math.round((n.x + d.dx) * 10) / 10,
            y: Math.round((n.y + d.dy) * 10) / 10,
          };
        });

        return moved ? nextNodes : prevNodes;
      });

      animFrameId = window.requestAnimationFrame(runPhysicsTick);
    };

    animFrameId = window.requestAnimationFrame(runPhysicsTick);
    return () => window.cancelAnimationFrame(animFrameId);
  }, [
    isPhysicsEnabled,
    subView,
    selectedOva,
    activeZones,
    activeEdges,
    dragState,
  ]);

  // --- NATIVE WHEEL EVENT LISTENER FOR FIGMA ZOOM-TO-CURSOR & TRACKPAD PAN ---
  useEffect(() => {
    const el = canvasViewportRef.current;
    if (!el || subView !== 'brain_canvas') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Figma Zoom-to-Cursor when holding Ctrl, Cmd, or Alt (or pinch gesture on trackpad)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        const rect = el.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        const currentZoom = zoomRef.current;
        const currentPan = panRef.current;

        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const nextZoom = Math.min(
          1.65,
          Math.max(0.32, Number((currentZoom * zoomFactor).toFixed(3)))
        );

        // Keep the world coordinate under the cursor stationary!
        const worldX = (cursorX - currentPan.x) / currentZoom;
        const worldY = (cursorY - currentPan.y) / currentZoom;

        const nextPanX = Math.round(cursorX - worldX * nextZoom);
        const nextPanY = Math.round(cursorY - worldY * nextZoom);

        setZoom(nextZoom);
        setPan({ x: nextPanX, y: nextPanY });
      } else {
        // Figma 2-Finger Trackpad Pan or Shift+Wheel Horizontal Pan
        const dx = e.shiftKey && e.deltaX === 0 ? e.deltaY : e.deltaX;
        const dy = e.shiftKey && e.deltaX === 0 ? 0 : e.deltaY;
        setPan((prev) => ({
          x: Math.round(prev.x - dx),
          y: Math.round(prev.y - dy),
        }));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [subView]);

  // --- FIGMA KEYBOARD SHORTCUTS ENGINE ---
  useEffect(() => {
    if (subView !== 'brain_canvas') return;

    const isTypingInInput = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target.isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingInInput(e.target)) return;

      // Spacebar -> Temporary Hand Tool (Figma Space + Drag)
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
        return;
      }

      // Tool switching: V (Select), H (Hand), C (Connect Synapse), P (Physics), L (Auto-Layout)
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'v'
      ) {
        setToolMode('select');
        return;
      }
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'h'
      ) {
        setToolMode('hand');
        return;
      }
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'c'
      ) {
        setToolMode('connect');
        showToast(
          'Modo Conector Sináptico (C): arrastra desde cualquier nodo hacia otro para enlazarlos.'
        );
        return;
      }
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'p'
      ) {
        setIsPhysicsEnabled((v) => {
          const next = !v;
          showToast(
            next
              ? 'Física Neuronal Dinámica activada (auto-repulsión y gravedad orbital).'
              : 'Física Neuronal pausada.'
          );
          return next;
        });
        return;
      }
      if (e.key === '?') {
        setShowShortcutsModal((v) => !v);
        return;
      }

      // Figma Framing Shortcuts: Shift+1 / F (Fit All), Shift+2 (Zoom Selection), Shift+0 (100%)
      if ((e.shiftKey && e.code === 'Digit1') || e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleZoomToFitAll();
        return;
      }
      if (e.shiftKey && e.code === 'Digit2') {
        e.preventDefault();
        handleZoomToSelection();
        return;
      }
      if (
        (e.shiftKey && e.code === 'Digit0') ||
        ((e.ctrlKey || e.metaKey) && e.code === 'Digit0')
      ) {
        e.preventDefault();
        centerCanvasViewport(1);
        return;
      }

      // Zoom In / Out with + / -
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom((z) => Math.min(1.65, Number((z + 0.1).toFixed(2))));
        return;
      }
      if (e.key === '-') {
        e.preventDefault();
        setZoom((z) => Math.max(0.32, Number((z - 0.1).toFixed(2))));
        return;
      }

      // Ctrl/Cmd + A: Select All Nodes in Active OVA
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedNodeIds(activeNodes.map((n) => n.id));
        showToast(`${activeNodes.length} nodos seleccionados.`);
        return;
      }

      // Ctrl/Cmd + D: Duplicate Selected Nodes (Figma Duplicate)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (!selectedOva || selectedNodeIds.length === 0) return;
        const toDup = activeNodes.filter(
          (n) => selectedNodeIds.includes(n.id) && n.cluster !== 'index'
        );
        if (toDup.length === 0) return;

        const core = activeNodes.find((n) => n.cluster === 'index');
        const createdNodes: KarpathyBrainNode[] = [];
        const createdEdges: KarpathyBrainEdge[] = [];

        toDup.forEach((orig, idx) => {
          const dupId = `brain-node-dup-${Date.now()}-${idx}`;
          createdNodes.push({
            ...orig,
            id: dupId,
            title: `${orig.title} (Copia)`,
            x: orig.x + 36,
            y: orig.y + 36,
          });
          if (core) {
            createdEdges.push({
              id: `brain-edge-${core.id}-${dupId}`,
              ovaId: selectedOva.id,
              sourceId: core.id,
              targetId: dupId,
              cluster: orig.cluster,
            });
          }
        });

        setBrainNodes((prev) => [...prev, ...createdNodes]);
        setBrainEdges((prev) => [...prev, ...createdEdges]);
        setSelectedNodeIds(createdNodes.map((n) => n.id));
        showToast(`${createdNodes.length} nodo(s) duplicados.`);
        return;
      }

      // Arrow Keys: Nudge selected nodes (10px, or 40px with Shift like Figma)
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
        selectedNodeIds.length > 0
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 40 : 10;
        const dx =
          e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy =
          e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;

        setBrainNodes((prev) =>
          prev.map((n) =>
            selectedNodeIds.includes(n.id)
              ? { ...n, x: n.x + dx, y: n.y + dy }
              : n
          )
        );
        return;
      }

      // Delete / Backspace: Remove selected non-core nodes
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedNodeIds.length > 0
      ) {
        e.preventDefault();
        const deletable = new Set(
          activeNodes
            .filter(
              (n) => selectedNodeIds.includes(n.id) && n.cluster !== 'index'
            )
            .map((n) => n.id)
        );
        if (deletable.size === 0) return;
        setBrainNodes((prev) => prev.filter((n) => !deletable.has(n.id)));
        setBrainEdges((prev) =>
          prev.filter(
            (edge) =>
              !deletable.has(edge.sourceId) && !deletable.has(edge.targetId)
          )
        );
        setSelectedNodeIds([]);
        showToast(`${deletable.size} nodo(s) eliminados del Brain.`);
        return;
      }

      // Escape: Clear selection / cancel wire
      if (e.key === 'Escape') {
        setSelectedNodeIds([]);
        setEditingNodeId(null);
        setLiveWire(null);
        setMarqueeBox(null);
        setShowShortcutsModal(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    subView,
    activeNodes,
    selectedNodeIds,
    selectedOva,
    handleZoomToFitAll,
    handleZoomToSelection,
    centerCanvasViewport,
    showToast,
  ]);

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

  // --- BRAIN GENERATION, ORBITAL RE-LAYOUT & DRAG-AND-DROP SPAWNING ---
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

  // Auto-organize existing nodes into clean orbital rings around their assigned Karpathy cluster
  const handleAutoArrangeOrbitalLayout = () => {
    if (!selectedOva) return;
    const core = activeNodes.find((n) => n.cluster === 'index');
    setBrainNodes((prev) => {
      const next = [...prev];
      (['raw', 'wiki', 'labs', 'practice'] as const).forEach((clusterKey) => {
        const zone = activeZones.find((z) => z.cluster === clusterKey);
        if (!zone) return;
        const clusterNodes = next.filter(
          (n) => n.ovaId === selectedOva.id && n.cluster === clusterKey
        );
        clusterNodes.forEach((node, idx) => {
          const total = Math.max(clusterNodes.length, 1);
          const ringIndex = Math.floor(idx / 6);
          const posInRing = idx % 6;
          const countInRing = Math.min(total - ringIndex * 6, 6);
          const angle =
            (posInRing / Math.max(countInRing, 1)) * Math.PI * 2 - Math.PI / 4;
          const radius = 105 + ringIndex * 82;
          node.x = Math.round(zone.x + Math.cos(angle) * radius);
          node.y = Math.round(zone.y + Math.sin(angle) * radius * 0.78);
        });
      });
      if (core) {
        core.x = CENTER_X;
        core.y = CENTER_Y;
      }
      return next;
    });
    showToast('Nodos auto-organizados en órbitas armónicas por cluster.');
  };

  const handleResetBrainToManualCuration = () => {
    if (!selectedOva) return;
    const core = createCoreIndexNode(selectedOva);
    setBrainNodes((prev) => [
      ...prev.filter((n) => n.ovaId !== selectedOva.id),
      core,
    ]);
    setBrainEdges((prev) => prev.filter((e) => e.ovaId !== selectedOva.id));
    setSelectedNodeIds([core.id]);
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

    const existing = activeNodes.find((n) => n.blockId === block.id);
    if (existing) {
      if (dropCoords) {
        setBrainNodes((prev) =>
          prev.map((n) =>
            n.id === existing.id
              ? {
                  ...n,
                  x: Math.round(dropCoords.x),
                  y: Math.round(dropCoords.y),
                  ...(overrideCluster
                    ? {
                        cluster: overrideCluster,
                        layerIcon:
                          CLUSTER_META[overrideCluster].defaultLayerIcon,
                      }
                    : {}),
                }
              : n
          )
        );
      }
      setSelectedNodeIds([existing.id]);
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
    const radius = 100 + Math.floor(idx / 6) * 76;

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
      layerIcon: CLUSTER_META[targetCluster].defaultLayerIcon,
      materialIcon: classified.materialIcon,
      x: finalX,
      y: finalY,
      zDepth: Number((0.92 + (idx % 4) * 0.08).toFixed(2)),
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
    setSelectedNodeIds([newNode.id]);
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

      const worldPt = screenToWorld(e.clientX, e.clientY);

      const droppedZone = activeZones.find((z) => {
        const dx = worldPt.x - z.x;
        const dy = worldPt.y - z.y;
        return Math.sqrt(dx * dx + dy * dy) <= z.radius + 45;
      });

      spawnBrainNodeFromBlock(lesson, block, worldPt, droppedZone?.cluster);
    } catch {
      // ignore
    }
  };

  // --- FIGMA CANVAS POINTER INTERACTION (PAN, MARQUEE, MULTI-DRAG, MAGNETIC WIRE) ---
  const isHandActive = isSpacePressed || toolMode === 'hand';

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-brain-ui-overlay="true"]')) {
      return;
    }

    // Middle mouse button or Spacebar or Hand tool -> Figma Pan
    if (
      e.button === 1 ||
      isHandActive ||
      !(e.target as HTMLElement).closest('[data-brain-interactive="true"]')
    ) {
      // If in Select mode and user holds Shift (or clicks empty background without Space/Hand), allow Marquee Box with Shift+Drag, or Pan with normal drag
      if (e.shiftKey && toolMode === 'select' && !isSpacePressed) {
        const pt = screenToWorld(e.clientX, e.clientY);
        setMarqueeBox({
          startX: pt.x,
          startY: pt.y,
          currX: pt.x,
          currY: pt.y,
        });
        return;
      }

      if (
        !e.shiftKey &&
        !(e.target as HTMLElement).closest('[data-brain-interactive="true"]')
      ) {
        setSelectedNodeIds([]);
        setEditingNodeId(null);
      }

      setDragState({
        kind: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      });
    }
  };

  // Start dragging a live synaptic wire from a node's magnetic port
  const handleStartLiveWire = (
    e: React.PointerEvent,
    sourceNode: KarpathyBrainNode
  ) => {
    e.stopPropagation();
    setLiveWire({
      sourceId: sourceNode.id,
      startX: sourceNode.x,
      startY: sourceNode.y,
      currX: sourceNode.x,
      currY: sourceNode.y,
      snappedTargetId: null,
    });
  };

  const handleNodePointerDown = (
    e: React.PointerEvent,
    node: KarpathyBrainNode
  ) => {
    e.stopPropagation();

    // If Spacebar or Hand Tool is active, clicking anywhere pans the canvas (Figma behavior!)
    if (isHandActive || e.button === 1) {
      setDragState({
        kind: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      });
      return;
    }

    // If in Connect Tool ('C'), start a live synaptic wire from this node
    if (toolMode === 'connect') {
      handleStartLiveWire(e, node);
      return;
    }

    // Bidirectional Sync with OVA Editor
    if (node.lessonId) {
      setSelectedLessonId(node.lessonId);
    }
    if (node.blockId) {
      setHighlightedBlockId(node.blockId);
      if (isTrayOpen) {
        window.setTimeout(() => {
          const el = trayBlockRefs.current[node.blockId!];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 75);
      }
    }

    // Figma Alt + Drag -> Duplicate node immediately and drag the clone!
    if (e.altKey && node.cluster !== 'index' && selectedOva) {
      const dupId = `brain-node-altdup-${Date.now()}`;
      const dupNode: KarpathyBrainNode = {
        ...node,
        id: dupId,
        title: `${node.title} (Copia)`,
        x: node.x + 12,
        y: node.y + 12,
      };
      const core = activeNodes.find((n) => n.cluster === 'index');
      setBrainNodes((prev) => [...prev, dupNode]);
      if (core) {
        setBrainEdges((prev) => [
          ...prev,
          {
            id: `brain-edge-${core.id}-${dupId}`,
            ovaId: selectedOva.id,
            sourceId: core.id,
            targetId: dupId,
            cluster: dupNode.cluster,
          },
        ]);
      }
      setSelectedNodeIds([dupId]);
      setDragState({
        kind: 'nodes',
        primaryNodeId: dupId,
        startX: e.clientX,
        startY: e.clientY,
        hasExceededThreshold: true,
        initialPositions: {
          [dupId]: { x: dupNode.x, y: dupNode.y },
        },
      });
      showToast('Nodo duplicado con Alt + Arrastrar.');
      return;
    }

    // Ignore drag initiation if user clicked an internal interactive input/select/button inside the node
    if ((e.target as HTMLElement).closest('input, select, button[data-nodrag="true"]')) {
      return;
    }

    // Shift + Click multi-selection
    let nextSelectedIds: string[];
    if (e.shiftKey) {
      nextSelectedIds = selectedNodeIds.includes(node.id)
        ? selectedNodeIds.filter((id) => id !== node.id)
        : [...selectedNodeIds, node.id];
    } else {
      nextSelectedIds = selectedNodeIds.includes(node.id)
        ? selectedNodeIds
        : [node.id];
    }
    setSelectedNodeIds(nextSelectedIds);

    const initialPositions: Record<string, { x: number; y: number }> = {};
    activeNodes.forEach((n) => {
      if (nextSelectedIds.includes(n.id) || n.id === node.id) {
        initialPositions[n.id] = { x: n.x, y: n.y };
      }
    });

    setDragState({
      kind: 'nodes',
      primaryNodeId: node.id,
      startX: e.clientX,
      startY: e.clientY,
      hasExceededThreshold: false,
      initialPositions,
    });
  };

  const handleZonePointerDown = (
    e: React.PointerEvent,
    zone: KarpathyOrbitalZone
  ) => {
    e.stopPropagation();
    if (isHandActive || e.button === 1) {
      setDragState({
        kind: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      });
      return;
    }

    // Move all nodes belonging to this orbital cluster together with the zone!
    const containedNodeInitials: Record<string, { x: number; y: number }> = {};
    activeNodes.forEach((n) => {
      if (n.cluster === zone.cluster) {
        containedNodeInitials[n.id] = { x: n.x, y: n.y };
      }
    });

    setDragState({
      kind: 'zone',
      zoneId: zone.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: zone.x,
      initialY: zone.y,
      containedNodeInitials,
    });
  };

  const handleViewportPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Update high-efficiency MotionValue Parallax (Zero React re-render!)
    if (canvasViewportRef.current) {
      const rect = canvasViewportRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      parallaxX.set(normX * -14);
      parallaxY.set(normY * -14);
    }

    // 2. Live Synaptic Wire Dragging with Magnetic Target Snapping
    if (liveWire) {
      const worldPt = screenToWorld(e.clientX, e.clientY);
      let snappedNode: KarpathyBrainNode | null = null;
      let bestDist = 72; // Magnetic attraction radius in world px

      for (const candidate of activeNodes) {
        if (candidate.id === liveWire.sourceId) continue;
        const d = Math.hypot(candidate.x - worldPt.x, candidate.y - worldPt.y);
        if (d < bestDist) {
          bestDist = d;
          snappedNode = candidate;
        }
      }

      setLiveWire((prev) =>
        prev
          ? {
              ...prev,
              currX: snappedNode ? snappedNode.x : worldPt.x,
              currY: snappedNode ? snappedNode.y : worldPt.y,
              snappedTargetId: snappedNode ? snappedNode.id : null,
            }
          : null
      );
      return;
    }

    // 3. Figma Marquee Lasso Selection Box
    if (marqueeBox) {
      const worldPt = screenToWorld(e.clientX, e.clientY);
      const nextBox = {
        ...marqueeBox,
        currX: worldPt.x,
        currY: worldPt.y,
      };
      setMarqueeBox(nextBox);

      const minX = Math.min(nextBox.startX, nextBox.currX);
      const maxX = Math.max(nextBox.startX, nextBox.currX);
      const minY = Math.min(nextBox.startY, nextBox.currY);
      const maxY = Math.max(nextBox.startY, nextBox.currY);

      const insideIds = activeNodes
        .filter(
          (n) => n.x >= minX && n.x <= maxX && n.y >= minY && n.y <= maxY
        )
        .map((n) => n.id);
      setSelectedNodeIds(insideIds);
      return;
    }

    if (!dragState) return;

    if (dragState.kind === 'pan') {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      setPan({
        x: Math.round(dragState.initialPanX + dx),
        y: Math.round(dragState.initialPanY + dy),
      });
    } else if (dragState.kind === 'nodes') {
      const pixelDist = Math.hypot(
        e.clientX - dragState.startX,
        e.clientY - dragState.startY
      );
      // 5px Drag Slop Threshold: prevents accidental micro-movements from swallowing clean clicks or double-clicks!
      if (!dragState.hasExceededThreshold) {
        if (pixelDist < 5) return;
        setDragState((prev) =>
          prev && prev.kind === 'nodes'
            ? { ...prev, hasExceededThreshold: true }
            : prev
        );
      }

      const rawDx = (e.clientX - dragState.startX) / zoom;
      const rawDy = (e.clientY - dragState.startY) / zoom;

      let snapOffsetX = 0;
      let snapOffsetY = 0;
      let guideX: number | null = null;
      let guideY: number | null = null;

      // Figma Smart Alignment Guides (when dragging a single primary node)
      const primaryInit = dragState.initialPositions[dragState.primaryNodeId];
      if (
        isMagneticSnapEnabled &&
        primaryInit &&
        Object.keys(dragState.initialPositions).length === 1
      ) {
        const candidateX = primaryInit.x + rawDx;
        const candidateY = primaryInit.y + rawDy;
        const snapThreshold = 9;

        for (const other of activeNodes) {
          if (other.id === dragState.primaryNodeId) continue;
          if (
            guideX === null &&
            Math.abs(other.x - candidateX) < snapThreshold
          ) {
            snapOffsetX = other.x - candidateX;
            guideX = other.x;
          }
          if (
            guideY === null &&
            Math.abs(other.y - candidateY) < snapThreshold
          ) {
            snapOffsetY = other.y - candidateY;
            guideY = other.y;
          }
        }
      }
      setAlignGuides({ x: guideX, y: guideY });

      setBrainNodes((prev) =>
        prev.map((n) => {
          const init = dragState.initialPositions[n.id];
          if (!init) return n;
          const nextX = Math.round(init.x + rawDx + snapOffsetX);
          const nextY = Math.round(init.y + rawDy + snapOffsetY);

          // Check if node was dragged into a different Karpathy Orbital Zone -> auto-adopt cluster!
          if (n.cluster !== 'index' && isMagneticSnapEnabled) {
            const hoveredZone = activeZones.find(
              (z) => Math.hypot(nextX - z.x, nextY - z.y) <= z.radius - 15
            );
            if (hoveredZone && hoveredZone.cluster !== n.cluster) {
              return {
                ...n,
                x: nextX,
                y: nextY,
                cluster: hoveredZone.cluster,
                layerIcon: CLUSTER_META[hoveredZone.cluster].defaultLayerIcon,
              };
            }
          }

          return {
            ...n,
            x: nextX,
            y: nextY,
          };
        })
      );
    } else if (dragState.kind === 'zone') {
      const dx = Math.round((e.clientX - dragState.startX) / zoom);
      const dy = Math.round((e.clientY - dragState.startY) / zoom);
      setBrainZones((prev) =>
        prev.map((z) =>
          z.id === dragState.zoneId
            ? {
                ...z,
                x: dragState.initialX + dx,
                y: dragState.initialY + dy,
              }
            : z
        )
      );
      // Move all nodes inside that orbital cluster along with the cluster ring!
      setBrainNodes((prev) =>
        prev.map((n) => {
          const init = dragState.containedNodeInitials[n.id];
          if (!init) return n;
          return {
            ...n,
            x: init.x + dx,
            y: init.y + dy,
          };
        })
      );
    }
  };

  const handleViewportPointerUp = () => {
    // Finish Live Synaptic Wire Connection
    if (liveWire) {
      if (
        liveWire.snappedTargetId &&
        liveWire.snappedTargetId !== liveWire.sourceId &&
        selectedOva
      ) {
        const exists = activeEdges.some(
          (edge) =>
            (edge.sourceId === liveWire.sourceId &&
              edge.targetId === liveWire.snappedTargetId) ||
            (edge.sourceId === liveWire.snappedTargetId &&
              edge.targetId === liveWire.sourceId)
        );
        if (!exists) {
          const targetNode = activeNodes.find(
            (n) => n.id === liveWire.snappedTargetId
          );
          const newEdge: KarpathyBrainEdge = {
            id: `brain-edge-wire-${Date.now()}`,
            ovaId: selectedOva.id,
            sourceId: liveWire.sourceId,
            targetId: liveWire.snappedTargetId,
            cluster:
              targetNode && targetNode.cluster !== 'index'
                ? targetNode.cluster
                : 'wiki',
          };
          setBrainEdges((prev) => [...prev, newEdge]);
          showToast('Sinapsis conectada magnéticamente.');
        }
      }
      setLiveWire(null);
    }

    if (marqueeBox) {
      setMarqueeBox(null);
    }

    setAlignGuides({ x: null, y: null });
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
    setSelectedNodeIds((prev) => prev.filter((id) => id !== nodeId));
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
    () => activeNodes.find((n) => n.id === primarySelectedNodeId) ?? null,
    [activeNodes, primarySelectedNodeId]
  );

  // Set of neighbor node IDs connected to the currently selected or hovered node (for Neural Constellation Focus!)
  const focusedNeighborIds = useMemo(() => {
    const focusId = hoveredNodeId ?? primarySelectedNodeId;
    if (!focusId) return null;
    const set = new Set<string>([focusId]);
    activeEdges.forEach((e) => {
      if (e.sourceId === focusId) set.add(e.targetId);
      if (e.targetId === focusId) set.add(e.sourceId);
    });
    return set;
  }, [hoveredNodeId, primarySelectedNodeId, activeEdges]);

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
                Laboratorio Karpathy Brain · Motor Interactivo & Física 3D
              </h2>
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                60fps · Atajos de Lienzo
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 break-words mt-0.5">
              Navegación avanzada (<code className="font-mono">Space+Arrastrar</code>,{' '}
              <code className="font-mono">Ctrl+Rueda</code> Zoom al cursor,{' '}
              <code className="font-mono">Shift+1</code> Encuadrar,{' '}
              <code className="font-mono">Alt+Arrastrar</code> Duplicar,{' '}
              <code className="font-mono">P</code> Física Neuronal)
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
              setSelectedNodeIds([]);
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

          {/* 2 Sub-vistas conmutables */}
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
          SUB-VISTA 2: CANVAS DEL BRAIN DE KARPATHY 2.5D/3D + MOTOR INTERACTIVO FIGMA
         ===================================================================== */}
      {subView === 'brain_canvas' && selectedOva && (
        <div
          className={`flex flex-col-reverse lg:flex-row gap-3.5 min-w-0 max-w-full ${
            isFullscreen
              ? 'flex-1 min-h-0'
              : compactMobile
              ? 'min-h-[640px]'
              : 'lg:h-[780px]'
          }`}
        >
          {/* LEFT DOCKABLE TRAY: Bandeja de Materiales del Editor de la OVA */}
          {isTrayOpen && (
            <div className="w-full lg:w-96 max-h-[320px] lg:max-h-none lg:h-full bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col overflow-hidden shrink-0">
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

          {/* RIGHT 2D/3D BRAIN CANVAS VIEWPORT WITH FIGMA ENGINE */}
          <div
            ref={canvasViewportRef}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleViewportPointerMove}
            onPointerUp={handleViewportPointerUp}
            className={`flex-1 min-h-[450px] sm:min-h-[540px] lg:h-full rounded-2xl border relative overflow-hidden select-none touch-none transition-colors duration-300 ${
              isHandActive || dragState?.kind === 'pan'
                ? 'cursor-grab active:cursor-grabbing'
                : toolMode === 'connect'
                ? 'cursor-crosshair'
                : 'cursor-default'
            } ${
              isDark
                ? 'bg-[#060a17] border-slate-800 text-slate-100'
                : 'bg-[#f4f6fb] border-slate-300 text-slate-900'
            }`}
          >
            {/* LAYER 0: GPU-Accelerated Motion Parallax 3D Nebula & Grid Background */}
            <motion.div
              className="absolute -inset-8 pointer-events-none"
              style={{
                x: smoothParallaxX,
                y: smoothParallaxY,
                backgroundImage: isDark
                  ? 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.09) 0%, rgba(99, 102, 241, 0.06) 35%, rgba(6, 10, 23, 0) 75%), radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)'
                  : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.05) 40%, rgba(244, 246, 251, 0) 75%), radial-gradient(rgba(100, 116, 139, 0.24) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 28px 28px',
              }}
            />

            {/* TOP FLOATING CONTROLS BAR ON CANVAS */}
            <div
              data-brain-ui-overlay="true"
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
                  onClick={handleAutoArrangeOrbitalLayout}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-cyan-400'
                      : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Auto-organizar los nodos en anillos orbitales limpios"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Auto-Órbita</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBrainToManualCuration}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                      : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Dejar solo el núcleo index.md para arrastrar bloques uno por uno manualmente"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Vaciar</span>
                </button>
              </div>

              {/* Right Controls: 3D Tilt, Theme, Zoom & Shortcuts Help */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div
                  className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-mono backdrop-blur-md ${
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

                <button
                  type="button"
                  onClick={() =>
                    setCanvasTheme((prev) =>
                      prev === 'deep_synapse' ? 'light_25d' : 'deep_synapse'
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-colors ${
                    isDark
                      ? 'bg-slate-900/85 border-cyan-500/40 text-cyan-300 hover:bg-slate-800'
                      : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Deep Synapse</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span className="hidden sm:inline">Claro 2.5D</span>
                    </>
                  )}
                </button>

                {/* Zoom & Figma Fit Controls */}
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
                      setZoom((z) =>
                        Math.max(0.32, Number((z - 0.08).toFixed(2)))
                      )
                    }
                    className="p-1.5 hover:bg-slate-500/20"
                    title="Alejar (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomToFitAll}
                    className="px-2 text-[11px] font-mono hover:bg-slate-500/20"
                    title="Encuadrar todo el Brain (Shift + 1 / F)"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) =>
                        Math.min(1.65, Number((z + 0.08).toFixed(2)))
                      )
                    }
                    className="p-1.5 hover:bg-slate-500/20"
                    title="Acercar (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowShortcutsModal((v) => !v)}
                  className={`p-1.5 rounded-xl border backdrop-blur-md ${
                    isDark
                      ? 'bg-slate-900/85 border-slate-700 text-cyan-300 hover:bg-slate-800'
                      : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Ver atajos de teclado (?)"
                >
                  <Keyboard className="w-4 h-4" />
                </button>

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

            {/* FIGMA KEYBOARD SHORTCUTS POPOVER MODAL */}
            {showShortcutsModal && (
              <div
                data-brain-ui-overlay="true"
                className={`absolute top-16 right-4 z-40 w-80 sm:w-96 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl text-xs space-y-3 ${
                  isDark
                    ? 'bg-slate-900/95 border-slate-700 text-slate-200'
                    : 'bg-white/95 border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <Keyboard className="w-4 h-4" />
                    <span>Atajos de Navegación e Interacción</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowShortcutsModal(false)}
                    className="p-1 hover:bg-slate-500/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Mano (Pan)</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Space + Drag
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Zoom al Cursor</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Ctrl + Rueda
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Encuadrar Todo</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Shift + 1 / F
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Zoom Selección</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Shift + 2
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Herramientas</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      V / H / C
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Física Neuronal</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      P
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Clonar al arrastrar</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Alt + Drag
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Duplicar Nodo</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Ctrl + D
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Caja Selección</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Shift + Drag
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-500/10 px-2 py-1.5 rounded-lg">
                    <span>Mover Preciso</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-800 text-cyan-300 rounded">
                      Flechas / Shift
                    </kbd>
                  </div>
                </div>
              </div>
            )}

            {/* 2D HIT-TESTING WORLD CONTAINER (z=0 affine plane so 100% of clicks are detected accurately) */}
            <div className="w-full h-full">
              <div
                className="w-[1700px] h-[1080px] relative transition-transform duration-75 ease-out"
                style={{
                  transformOrigin: '0 0',
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              >
                <div className="w-full h-full relative">
                  {/* LAYER 1: 4 KARPATHY ORBITAL CLUSTER ZONES (pointer-events-none on disc, pointer-events-auto only on title handle) */}
                  {activeZones.map((zone) => {
                    const meta = CLUSTER_META[zone.cluster];
                    const clusterNodeCount = activeNodes.filter(
                      (n) => n.cluster === zone.cluster
                    ).length;

                    return (
                      <div
                        key={zone.id}
                        style={{
                          left: zone.x - zone.radius,
                          top: zone.y - zone.radius,
                          width: zone.radius * 2,
                          height: zone.radius * 2,
                          background: `radial-gradient(circle, ${meta.glowHex} 0%, transparent 72%)`,
                        }}
                        className={`absolute rounded-full border-2 border-dashed pointer-events-none flex flex-col items-center justify-start pt-4 ${
                          isDark
                            ? 'border-slate-700/80'
                            : 'border-slate-300'
                        }`}
                      >
                        <div
                          className="absolute inset-5 rounded-full border border-dotted pointer-events-none animate-orbital-slow opacity-45"
                          style={{ borderColor: meta.strokeColor }}
                        />

                        <div
                          data-brain-interactive="true"
                          onPointerDown={(e) => handleZonePointerDown(e, zone)}
                          title="Arrastra este encabezado para mover toda la órbita del cluster con sus nodos"
                          className={`pointer-events-auto cursor-move px-3 py-1 rounded-full border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm ${
                            isDark ? meta.darkBadge : meta.lightBadge
                          }`}
                        >
                          <Move className="w-3 h-3 opacity-70" />
                          <span>{zone.title}</span>
                          <span className="opacity-75">
                            ({clusterNodeCount})
                          </span>
                        </div>
                        <span
                          className={`text-[10px] mt-1 px-2 text-center max-w-[230px] pointer-events-none ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {zone.subtitle}
                        </span>
                      </div>
                    );
                  })}

                  {/* LAYER 2: SYNAPTIC SVG CONNECTIONS, SMART ALIGNMENT GUIDES & LIVE WIRE */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Orbital guide lines from index.md core to each of the 4 cluster centers */}
                    {activeZones.map((zone) => {
                      const core = activeNodes.find(
                        (n) => n.cluster === 'index'
                      );
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

                    {/* Figma Smart Alignment Laser Guides */}
                    {alignGuides.x !== null && (
                      <line
                        x1={alignGuides.x}
                        y1={0}
                        x2={alignGuides.x}
                        y2={WORLD_HEIGHT}
                        stroke="#f43f5e"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                    )}
                    {alignGuides.y !== null && (
                      <line
                        x1={0}
                        y1={alignGuides.y}
                        x2={WORLD_WIDTH}
                        y2={alignGuides.y}
                        stroke="#f43f5e"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Synaptic Bezier Edges between Brain Nodes */}
                    {activeEdges.map((edge) => {
                      const source = activeNodes.find(
                        (n) => n.id === edge.sourceId
                      );
                      const target = activeNodes.find(
                        (n) => n.id === edge.targetId
                      );
                      if (!source || !target) return null;

                      const meta =
                        CLUSTER_META[edge.cluster] ?? CLUSTER_META.wiki;
                      const dx = target.x - source.x;
                      const dy = target.y - source.y;
                      const cx1 = Math.round(source.x + dx * 0.45 - dy * 0.12);
                      const cy1 = Math.round(source.y + dy * 0.18 + dx * 0.08);
                      const cx2 = Math.round(source.x + dx * 0.65 - dy * 0.08);
                      const cy2 = Math.round(source.y + dy * 0.82 + dx * 0.05);
                      const pathD = `M ${source.x} ${source.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${target.x} ${target.y}`;

                      const isHighlightedEdge =
                        selectedNodeIds.includes(source.id) ||
                        selectedNodeIds.includes(target.id) ||
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
                          <path
                            d={pathD}
                            fill="none"
                            stroke="transparent"
                            strokeWidth={14}
                          />
                          <path
                            d={pathD}
                            fill="none"
                            stroke={meta.strokeColor}
                            strokeOpacity={
                              isHighlightedEdge ? 0.92 : isDark ? 0.32 : 0.38
                            }
                            strokeWidth={isHighlightedEdge ? 2.8 : 1.6}
                          />
                          <path
                            d={pathD}
                            fill="none"
                            stroke={meta.pulseColor}
                            strokeOpacity={isHighlightedEdge ? 1 : 0.75}
                            strokeWidth={isHighlightedEdge ? 3.2 : 2}
                            className="animate-synapse-flow"
                          />
                        </g>
                      );
                    })}

                    {/* Live Synaptic Wire being dragged by the user */}
                    {liveWire && (
                      <g>
                        <path
                          d={`M ${liveWire.startX} ${liveWire.startY} C ${
                            (liveWire.startX + liveWire.currX) / 2
                          } ${liveWire.startY}, ${
                            (liveWire.startX + liveWire.currX) / 2
                          } ${liveWire.currY}, ${liveWire.currX} ${
                            liveWire.currY
                          }`}
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth={3}
                          strokeDasharray="6 6"
                        />
                        <circle
                          cx={liveWire.currX}
                          cy={liveWire.currY}
                          r={liveWire.snappedTargetId ? 10 : 5}
                          fill="#22d3ee"
                          fillOpacity={0.8}
                        />
                      </g>
                    )}

                    {/* Figma Marquee Selection Box */}
                    {marqueeBox && (
                      <rect
                        x={Math.min(marqueeBox.startX, marqueeBox.currX)}
                        y={Math.min(marqueeBox.startY, marqueeBox.currY)}
                        width={Math.abs(marqueeBox.currX - marqueeBox.startX)}
                        height={Math.abs(marqueeBox.currY - marqueeBox.startY)}
                        fill="rgba(34, 211, 238, 0.14)"
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                    )}
                  </svg>

                  {/* LAYER 3: MINIMALIST 3D-TILT BRAIN NODES WITH MAGNETIC SYNAPSE PORTS */}
                  {activeNodes.map((node) => {
                    const meta = CLUSTER_META[node.cluster];
                    const isCore = node.cluster === 'index';
                    const isSelected = selectedNodeIds.includes(node.id);
                    const isEditing = editingNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isSnappedTarget =
                      liveWire?.snappedTargetId === node.id;

                    // Dim unrelated nodes slightly when hovering or selecting a constellation
                    const isDimmed =
                      focusedNeighborIds !== null &&
                      !focusedNeighborIds.has(node.id) &&
                      !isSelected &&
                      !isCore;

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
                        onPointerLeave={() =>
                          setHoveredNodeId((prev) =>
                            prev === node.id ? null : prev
                          )
                        }
                        style={{
                          left: node.x,
                          top: node.y,
                          transform: `translate(-50%, -50%) scale(${
                            isSelected || isSnappedTarget ? 1.06 : node.zDepth
                          })`,
                        }}
                        className={`absolute z-20 p-1.5 group transition-opacity duration-200 cursor-pointer ${
                          isDimmed ? 'opacity-45' : 'opacity-100'
                        }`}
                      >
                        {/* 4 MAGNETIC SYNAPSE PORTS (Top, Right, Bottom, Left) */}
                        {(isHovered || isSelected || toolMode === 'connect') &&
                          selectedNodeIds.length <= 1 && (
                            <>
                              {(
                                [
                                  {
                                    pos: 'top',
                                    cls: '-top-1 left-1/2 -translate-x-1/2',
                                  },
                                  {
                                    pos: 'right',
                                    cls: 'top-1/2 -right-1 -translate-y-1/2',
                                  },
                                  {
                                    pos: 'bottom',
                                    cls: '-bottom-1 left-1/2 -translate-x-1/2',
                                  },
                                  {
                                    pos: 'left',
                                    cls: 'top-1/2 -left-1 -translate-y-1/2',
                                  },
                                ] as const
                              ).map((port) => (
                                <button
                                  key={port.pos}
                                  type="button"
                                  data-nodrag="true"
                                  onPointerDown={(e) =>
                                    handleStartLiveWire(e, node)
                                  }
                                  title="Arrastra desde este puerto magnético para conectar una sinapsis"
                                  className={`absolute ${port.cls} z-30 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md hover:scale-125 transition-transform cursor-crosshair`}
                                />
                              ))}
                            </>
                          )}

                        <div
                          style={{
                            animationDelay: `${node.floatPhase ?? 0}s`,
                            transform:
                              cameraTiltDeg > 0 && !isHovered && !isSelected && !isEditing
                                ? `perspective(650px) rotateX(${Math.round(
                                    cameraTiltDeg * 0.55
                                  )}deg)`
                                : undefined,
                          }}
                          className={`${
                            isHovered || isSelected || isEditing
                              ? ''
                              : 'animate-brain-levitate'
                          } rounded-2xl border transition-all ${
                            isCore
                              ? 'px-4 py-3 min-w-[210px] max-w-[280px] border-2'
                              : 'px-3 py-2 min-w-[165px] max-w-[235px]'
                          } ${isDark ? meta.darkCard : meta.lightCard} ${
                            isSelected || isSnappedTarget
                              ? 'ring-2 ring-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.5)]'
                              : ''
                          }`}
                        >
                          {/* MINIMALIST NODE CONTENT: ONLY THE PAIR OF CLASSIFICATION ICONS + THE TITLE */}
                          <div className="flex items-center gap-2.5">
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
                                    if (
                                      e.key === 'Enter' ||
                                      e.key === 'Escape'
                                    ) {
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
                                  title={`${node.title} (Doble clic para editar · Alt+Arrastrar para duplicar)`}
                                >
                                  {node.title}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Micro-Toolbar ONLY visible when the node is primary selected */}
                          {isSelected && selectedNodeIds.length === 1 && (
                            <div
                              onPointerDown={(e) => e.stopPropagation()}
                              className={`mt-2 pt-2 border-t flex items-center justify-between gap-1 text-[10px] ${
                                isDark
                                  ? 'border-slate-700/80'
                                  : 'border-slate-200'
                              }`}
                            >
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

                              {!isCore && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBrainNode(node.id)}
                                  className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                  title="Quitar nodo del Brain (Supr)"
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

            {/* FIGMA BOTTOM FLOATING TOOL DOCK (V: Select, H: Hand, C: Connect, P: Physics, Fit) */}
            <div
              data-brain-ui-overlay="true"
              className={`absolute bottom-14 left-1/2 -translate-x-1/2 z-30 px-2 py-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-1 pointer-events-auto ${
                isDark
                  ? 'bg-slate-900/95 border-slate-700 text-slate-200'
                  : 'bg-white/95 border-slate-300 text-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setToolMode('select')}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  toolMode === 'select' && !isSpacePressed
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'hover:bg-slate-500/15'
                }`}
                title="Herramienta Selección (V) · Shift+Arrastrar para selección múltiple"
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Selección</span>
                <kbd className="text-[9px] font-mono opacity-75">V</kbd>
              </button>

              <button
                type="button"
                onClick={() => setToolMode('hand')}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  toolMode === 'hand' || isSpacePressed
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'hover:bg-slate-500/15'
                }`}
                title="Herramienta Mano / Desplazar Lienzo (H o Barra Espaciadora)"
              >
                <Hand className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mano</span>
                <kbd className="text-[9px] font-mono opacity-75">H</kbd>
              </button>

              <button
                type="button"
                onClick={() => setToolMode('connect')}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  toolMode === 'connect'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'hover:bg-slate-500/15'
                }`}
                title="Conector Sináptico Magnético (C) · Arrastra de un nodo a otro"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Conectar</span>
                <kbd className="text-[9px] font-mono opacity-75">C</kbd>
              </button>

              <div className="w-px h-5 bg-slate-500/30 mx-0.5" />

              <button
                type="button"
                onClick={() => setIsPhysicsEnabled((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isPhysicsEnabled
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'hover:bg-slate-500/15'
                }`}
                title="Física Neuronal 60fps: auto-repulsión y gravedad orbital (P)"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Física</span>
                <kbd className="text-[9px] font-mono opacity-75">P</kbd>
              </button>

              <button
                type="button"
                onClick={() => setIsMagneticSnapEnabled((v) => !v)}
                className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isMagneticSnapEnabled
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title="Guías de alineación magnética y adopción automática de cluster"
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Guías</span>
              </button>
            </div>

            {/* INTERACTIVE RADAR MINIMAP (Bottom-Right Corner, Click to Teleport Camera) */}
            <div
              data-brain-ui-overlay="true"
              onClick={(e) => {
                if (!canvasViewportRef.current) return;
                const miniRect = e.currentTarget.getBoundingClientRect();
                const clickRatioX =
                  (e.clientX - miniRect.left) / miniRect.width;
                const clickRatioY =
                  (e.clientY - miniRect.top) / miniRect.height;
                const targetWorldX = clickRatioX * WORLD_WIDTH;
                const targetWorldY = clickRatioY * WORLD_HEIGHT;
                const viewRect =
                  canvasViewportRef.current.getBoundingClientRect();
                setPan({
                  x: Math.round(viewRect.width / 2 - targetWorldX * zoom),
                  y: Math.round(viewRect.height / 2 - targetWorldY * zoom),
                });
              }}
              title="Minimapa Radar (Clic para mover la cámara a cualquier punto)"
              className={`hidden sm:block absolute bottom-14 right-3 z-30 w-36 h-24 rounded-xl border backdrop-blur-md cursor-pointer overflow-hidden shadow-lg ${
                isDark
                  ? 'bg-slate-900/85 border-slate-700'
                  : 'bg-white/90 border-slate-300'
              }`}
            >
              <svg
                viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
                className="w-full h-full"
              >
                {activeZones.map((z) => (
                  <circle
                    key={z.id}
                    cx={z.x}
                    cy={z.y}
                    r={z.radius}
                    fill={CLUSTER_META[z.cluster].strokeColor}
                    fillOpacity={0.14}
                    stroke={CLUSTER_META[z.cluster].strokeColor}
                    strokeWidth={14}
                    strokeOpacity={0.45}
                  />
                ))}
                {activeNodes.map((n) => (
                  <circle
                    key={n.id}
                    cx={n.x}
                    cy={n.y}
                    r={n.cluster === 'index' ? 34 : 20}
                    fill={
                      selectedNodeIds.includes(n.id)
                        ? '#ffffff'
                        : CLUSTER_META[n.cluster].strokeColor
                    }
                  />
                ))}
              </svg>
            </div>

            {/* BOTTOM LEGEND & SELECTED NODE INSPECTOR BAR */}
            <div
              data-brain-ui-overlay="true"
              className={`absolute bottom-2.5 left-3 right-3 z-30 px-3 py-1.5 rounded-xl border backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-[11px] pointer-events-auto ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                  : 'bg-white/95 border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <strong>index.md</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <strong>raw/</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <strong>wiki/</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                  <strong>labs/</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <strong>lint/</strong>
                </span>
              </div>

              {selectedNodeIds.length > 1 ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">
                    {selectedNodeIds.length} nodos seleccionados
                  </span>
                  <span className="opacity-75 hidden sm:inline">
                    (Arrastra en bloque · Flechas para mover · Supr para borrar)
                  </span>
                </div>
              ) : selectedBrainNode ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate max-w-[200px]">
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
                      className="px-2 py-0.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                    >
                      Ver en Editor OVA →
                    </button>
                  )}
                </div>
              ) : (
                <span className="opacity-75 truncate">
                  Space+Arrastrar: Mano · Ctrl+Rueda: Zoom al cursor · Shift+1:
                  Encuadrar · Puertos: Conectar
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
