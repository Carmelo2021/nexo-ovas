import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  ArrowLeftRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code2,
  Cpu,
  Database,
  Edit3,
  ExternalLink,
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
  PortSide,
} from '../types/ova';
import {
  blocksToMarkdown,
  ensureLessonBlocks,
  NotionLessonBlockEditor,
} from './NotionLessonBlocks';
import {
  extractYouTubeEmbedUrl,
  NodeMarkdownRenderer,
} from './NodeMarkdownRenderer';

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

const EDGE_LABEL_PRESETS = [
  'fundamenta',
  'se aplica en',
  'profundiza en',
  'ejemplo práctico',
  'verifica con',
  'depende de',
];

const ALL_PORTS: PortSide[] = ['top', 'right', 'bottom', 'left'];

function getOppositePort(port: PortSide): PortSide {
  switch (port) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
}

function getNodeDims(
  node: KarpathyBrainNode,
  measured?: { w: number; h: number }
): { w: number; h: number } {
  const isCore = node.cluster === 'index';
  const defaultW = node.expanded ? 336 : isCore ? 248 : 212;
  const defaultH = node.expanded ? 240 : isCore ? 64 : 52;
  return {
    w: node.width ?? measured?.w ?? defaultW,
    h: node.height ?? measured?.h ?? defaultH,
  };
}

function getPortPoint(
  node: KarpathyBrainNode,
  port: PortSide,
  dims: { w: number; h: number }
): { x: number; y: number } {
  switch (port) {
    case 'top':
      return { x: node.x, y: node.y - dims.h / 2 };
    case 'right':
      return { x: node.x + dims.w / 2, y: node.y };
    case 'bottom':
      return { x: node.x, y: node.y + dims.h / 2 };
    case 'left':
      return { x: node.x - dims.w / 2, y: node.y };
  }
}

function inferAutoPorts(
  source: KarpathyBrainNode,
  target: KarpathyBrainNode
): { sourcePort: PortSide; targetPort: PortSide } {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourcePort: 'right', targetPort: 'left' }
      : { sourcePort: 'left', targetPort: 'right' };
  }
  return dy >= 0
    ? { sourcePort: 'bottom', targetPort: 'top' }
    : { sourcePort: 'top', targetPort: 'bottom' };
}

function findNearestPortOnNode(
  node: KarpathyBrainNode,
  dims: { w: number; h: number },
  px: number,
  py: number
): PortSide {
  let bestPort: PortSide = 'left';
  let bestDist = Infinity;
  for (const side of ALL_PORTS) {
    const pt = getPortPoint(node, side, dims);
    const d = Math.hypot(px - pt.x, py - pt.y);
    if (d < bestDist) {
      bestDist = d;
      bestPort = side;
    }
  }
  return bestPort;
}

function buildPortBezier(
  sx: number,
  sy: number,
  sPort: PortSide,
  tx: number,
  ty: number,
  tPort?: PortSide
): { pathD: string; midX: number; midY: number } {
  const dist = Math.hypot(tx - sx, ty - sy);
  const offset = Math.max(46, Math.min(150, dist * 0.36));

  const dirVec = (p: PortSide) => {
    switch (p) {
      case 'top':
        return { x: 0, y: -1 };
      case 'right':
        return { x: 1, y: 0 };
      case 'bottom':
        return { x: 0, y: 1 };
      case 'left':
        return { x: -1, y: 0 };
    }
  };

  const sv = dirVec(sPort);
  const tv = tPort ? dirVec(tPort) : { x: -sv.x, y: -sv.y };

  const cx1 = Math.round(sx + sv.x * offset);
  const cy1 = Math.round(sy + sv.y * offset);
  const cx2 = Math.round(tx + tv.x * offset);
  const cy2 = Math.round(ty + tv.y * offset);

  const midX = Math.round(0.125 * sx + 0.375 * cx1 + 0.375 * cx2 + 0.125 * tx);
  const midY = Math.round(0.125 * sy + 0.375 * cy1 + 0.375 * cy2 + 0.125 * ty);

  return {
    pathD: `M ${Math.round(sx)} ${Math.round(sy)} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${Math.round(tx)} ${Math.round(ty)}`,
    midX,
    midY,
  };
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

  // 5. Bidirectional Sync, Interactive Ports, Editable Edges & Inline Editing States
  const [selectedBrainNodeId, setSelectedBrainNodeId] = useState<string | null>(
    null
  );
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
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

  // Live rubber-band synaptic connection dragged from a magnetic port
  const [draftConnection, setDraftConnection] = useState<{
    sourceId: string;
    sourcePort: PortSide;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    hoveredTargetId: string | null;
    hoveredTargetPort: PortSide | null;
  } | null>(null);

  // Quick-spawn floating menu when dropping a dragged port wire onto empty canvas
  const [quickSpawnMenu, setQuickSpawnMenu] = useState<{
    sourceId: string;
    sourcePort: PortSide;
    x: number;
    y: number;
    title: string;
    edgeLabel: string;
  } | null>(null);

  // Parallax mouse tracking on canvas
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Canvas Dragging (Pan, Node drag, Node resize, Zone drag)
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const trayBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const builderBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const nodeCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        kind: 'node_resize';
        nodeId: string;
        startX: number;
        startY: number;
        initialW: number;
        initialH: number;
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

  // Keyboard Escape handler to close quick-spawn, inline editor, or active edge popover
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickSpawnMenu(null);
        setDraftConnection(null);
        setConnectingFromNodeId(null);
        setSelectedEdgeId(null);
        setEditingNodeId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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

  // Helper to measure live DOM card dimensions for exact port & arrow anchoring
  const getMeasuredDims = (node: KarpathyBrainNode) => {
    const el = nodeCardRefs.current[node.id];
    const measured =
      el && el.offsetWidth > 0 && el.offsetHeight > 0
        ? { w: el.offsetWidth, h: el.offsetHeight }
        : undefined;
    return getNodeDims(node, measured);
  };

  // Resolve the linked OVA lesson & block for a Brain node (for expanded view & bidirectional inline edit)
  const resolveLinkedBlock = (
    node: KarpathyBrainNode
  ): { lesson: Lesson; block: LessonBlock } | null => {
    if (!selectedOva || !node.lessonId || !node.blockId) return null;
    const lesson = selectedOva.lessons.find((l) => l.id === node.lessonId);
    if (!lesson) return null;
    const block = ensureLessonBlocks(lesson).find((b) => b.id === node.blockId);
    if (!block) return null;
    return { lesson, block };
  };

  // --- CANVAS POINTER PAN, NODE DRAG, NODE RESIZE, PORT CONNECTION & ZONE DRAG ---
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-brain-interactive="true"]')) {
      return;
    }
    setSelectedEdgeId(null);
    setQuickSpawnMenu(null);
    setEditingNodeId(null);
    setDragState({
      kind: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    });
  };

  const handleStartPortDrag = (
    e: React.PointerEvent,
    node: KarpathyBrainNode,
    port: PortSide
  ) => {
    e.stopPropagation();
    const dims = getMeasuredDims(node);
    const pt = getPortPoint(node, port, dims);
    setSelectedEdgeId(null);
    setQuickSpawnMenu(null);
    setConnectingFromNodeId(null);
    setDraftConnection({
      sourceId: node.id,
      sourcePort: port,
      startX: pt.x,
      startY: pt.y,
      currentX: pt.x,
      currentY: pt.y,
      hoveredTargetId: null,
      hoveredTargetPort: null,
    });
  };

  const handleStartNodeResize = (
    e: React.PointerEvent,
    node: KarpathyBrainNode
  ) => {
    e.stopPropagation();
    const dims = getMeasuredDims(node);
    setSelectedBrainNodeId(node.id);
    setSelectedEdgeId(null);
    setQuickSpawnMenu(null);
    setDragState({
      kind: 'node_resize',
      nodeId: node.id,
      startX: e.clientX,
      startY: e.clientY,
      initialW: dims.w,
      initialH: dims.h,
    });
  };

  const handleNodePointerDown = (
    e: React.PointerEvent,
    node: KarpathyBrainNode
  ) => {
    e.stopPropagation();
    setQuickSpawnMenu(null);
    setSelectedEdgeId(null);

    // If user is in legacy click-to-connect synaptic mode
    if (connectingFromNodeId && connectingFromNodeId !== node.id) {
      const sourceNode = activeNodes.find((n) => n.id === connectingFromNodeId);
      const exists = activeEdges.some(
        (edge) =>
          (edge.sourceId === connectingFromNodeId &&
            edge.targetId === node.id) ||
          (edge.sourceId === node.id &&
            edge.targetId === connectingFromNodeId)
      );
      if (!exists && selectedOva && sourceNode) {
        const ports = inferAutoPorts(sourceNode, node);
        const newEdgeId = `brain-edge-custom-${Date.now()}`;
        const newEdge: KarpathyBrainEdge = {
          id: newEdgeId,
          ovaId: selectedOva.id,
          sourceId: connectingFromNodeId,
          targetId: node.id,
          cluster: node.cluster === 'index' ? 'wiki' : node.cluster,
          label: 'se conecta con',
          sourcePort: ports.sourcePort,
          targetPort: ports.targetPort,
        };
        setBrainEdges((prev) => [...prev, newEdge]);
        setSelectedEdgeId(newEdgeId);
        showToast('Sinapsis creada. Edita su etiqueta o invierte su dirección.');
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

    if (editingNodeId === node.id) return;

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
    setSelectedEdgeId(null);
    setQuickSpawnMenu(null);
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
    const rect = canvasViewportRef.current?.getBoundingClientRect();

    // 1. Update subtle 3D parallax offset (paused while dragging wires or resizing for precision)
    if (rect && !draftConnection && dragState?.kind !== 'node_resize') {
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouseParallax({ x: normX * 18, y: normY * 18 });
    }

    // 2. Process live magnetic rubber-band connection wire
    if (draftConnection && rect) {
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;

      let hoveredTargetId: string | null = null;
      let hoveredTargetPort: PortSide | null = null;

      for (const candidate of activeNodes) {
        if (candidate.id === draftConnection.sourceId) continue;
        const dims = getMeasuredDims(candidate);
        const halo = 26;
        if (
          canvasX >= candidate.x - dims.w / 2 - halo &&
          canvasX <= candidate.x + dims.w / 2 + halo &&
          canvasY >= candidate.y - dims.h / 2 - halo &&
          canvasY <= candidate.y + dims.h / 2 + halo
        ) {
          hoveredTargetId = candidate.id;
          hoveredTargetPort = findNearestPortOnNode(
            candidate,
            dims,
            canvasX,
            canvasY
          );
          break;
        }
      }

      setDraftConnection((prev) =>
        prev
          ? {
              ...prev,
              currentX: Math.round(canvasX),
              currentY: Math.round(canvasY),
              hoveredTargetId,
              hoveredTargetPort,
            }
          : null
      );
      return;
    }

    // 3. Process active drag / resize
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
    } else if (dragState.kind === 'node_resize') {
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;
      const nextW = Math.min(560, Math.max(190, Math.round(dragState.initialW + dx)));
      const nextH = Math.min(520, Math.max(64, Math.round(dragState.initialH + dy)));
      setBrainNodes((prev) =>
        prev.map((n) =>
          n.id === dragState.nodeId
            ? {
                ...n,
                width: nextW,
                height: nextH,
                expanded: nextH >= 130 ? true : n.expanded,
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
    // Complete or quick-spawn a dragged port wire
    if (draftConnection && selectedOva) {
      const {
        sourceId,
        sourcePort,
        startX,
        startY,
        currentX,
        currentY,
        hoveredTargetId,
        hoveredTargetPort,
      } = draftConnection;

      if (hoveredTargetId && hoveredTargetId !== sourceId) {
        const targetNode = activeNodes.find((n) => n.id === hoveredTargetId);
        const existingEdge = activeEdges.find(
          (e) => e.sourceId === sourceId && e.targetId === hoveredTargetId
        );
        if (existingEdge) {
          setBrainEdges((prev) =>
            prev.map((e) =>
              e.id === existingEdge.id
                ? {
                    ...e,
                    sourcePort,
                    targetPort: hoveredTargetPort ?? e.targetPort,
                  }
                : e
            )
          );
          setSelectedEdgeId(existingEdge.id);
          showToast('Puertos de la conexión actualizados.');
        } else if (targetNode) {
          const newEdgeId = `brain-edge-port-${Date.now()}`;
          const newEdge: KarpathyBrainEdge = {
            id: newEdgeId,
            ovaId: selectedOva.id,
            sourceId,
            targetId: hoveredTargetId,
            cluster: targetNode.cluster === 'index' ? 'wiki' : targetNode.cluster,
            label: 'se conecta con',
            sourcePort,
            targetPort: hoveredTargetPort ?? getOppositePort(sourcePort),
          };
          setBrainEdges((prev) => [...prev, newEdge]);
          setSelectedBrainNodeId(null);
          setSelectedEdgeId(newEdgeId);
          showToast(
            'Conexión sináptica creada. Puedes nombrar la relación o invertirla ahora.'
          );
        }
      } else {
        const draggedDist = Math.hypot(currentX - startX, currentY - startY);
        if (draggedDist > 30) {
          setQuickSpawnMenu({
            sourceId,
            sourcePort,
            x: Math.max(90, Math.min(1600, currentX)),
            y: Math.max(70, Math.min(1010, currentY)),
            title: '',
            edgeLabel: 'se relaciona con',
          });
        }
      }
      setDraftConnection(null);
    }

    setDragState(null);
  };

  // --- QUICK-SPAWN NEW CONNECTED NODE FROM DROPPED PORT WIRE ---
  const handleQuickSpawnNodeFromWire = (blockType: LessonBlockType) => {
    if (!quickSpawnMenu || !selectedOva) return;
    const defaultLabels: Record<LessonBlockType, string> = {
      quote: 'Nueva Fuente / Cita',
      video: 'Nuevo Video / Recurso',
      link: 'Nueva Documentación Web',
      text: 'Nuevo Concepto Compilado',
      code: 'Nuevo Snippet de Código',
      diagram: 'Nuevo Diagrama Visual',
      interactive: 'Nuevo Laboratorio',
      exercise: 'Nuevo Ejercicio JS',
      heading: 'Nuevo Concepto',
      callout: 'Nota Clave',
    };

    const title = quickSpawnMenu.title.trim() || defaultLabels[blockType];
    const blockId = `blk-spawn-${Date.now()}`;
    const newBlock: LessonBlock = {
      id: blockId,
      type: blockType,
      title,
      content:
        blockType === 'code'
          ? '// Escribe tu código de ejemplo aquí\nconsole.log("Hola Karpathy Brain");'
          : blockType === 'exercise'
          ? `Reto práctico sobre "${title}".`
          : `### ${title}\n- [ ] Investigar y completar síntesis conceptual\n- [ ] Validar ejemplo práctico en la OVA`,
      ...(blockType === 'quote' ? { quoteAuthor: 'Referencia SENA / Bibliografía' } : {}),
      ...(blockType === 'code' ? { codeLanguage: 'javascript' } : {}),
      ...(blockType === 'video' || blockType === 'link'
        ? { url: 'https://developer.mozilla.org/es/' }
        : {}),
      ...(blockType === 'diagram' ? { diagramKind: 'if_else_flow' } : {}),
      ...(blockType === 'interactive' ? { interactiveKind: 'array_lab' } : {}),
      ...(blockType === 'exercise'
        ? {
            exerciseDifficulty: 'Básico',
            exerciseCategory: 'corto',
            exerciseStarterCode: `// Ejercicio rápido: ${title}\nconsole.log("Verificación sináptica activa");`,
          }
        : {}),
    };

    const targetLesson = selectedLesson ?? selectedOva.lessons[0];
    if (targetLesson) {
      const currentBlocks = ensureLessonBlocks(targetLesson);
      handleUpdateLessonBlocks(targetLesson.id, [newBlock, ...currentBlocks]);
    }

    const classified = classifyBlockToKarpathy(newBlock);
    const newNodeId = `brain-node-${selectedOva.id}-${blockId}`;
    const newNode: KarpathyBrainNode = {
      id: newNodeId,
      ovaId: selectedOva.id,
      lessonId: targetLesson?.id,
      blockId: targetLesson ? blockId : undefined,
      title,
      cluster: classified.cluster,
      layerIcon: classified.layerIcon,
      materialIcon: classified.materialIcon,
      x: quickSpawnMenu.x,
      y: quickSpawnMenu.y,
      expanded: true,
      noteContent: newBlock.content,
      zDepth: 1.0,
      floatPhase: (activeNodes.length * 0.5) % 4,
    };

    const newEdgeId = `brain-edge-spawn-${Date.now()}`;
    const newEdge: KarpathyBrainEdge = {
      id: newEdgeId,
      ovaId: selectedOva.id,
      sourceId: quickSpawnMenu.sourceId,
      targetId: newNodeId,
      cluster: classified.cluster,
      label: quickSpawnMenu.edgeLabel.trim() || 'deriva en',
      sourcePort: quickSpawnMenu.sourcePort,
      targetPort: getOppositePort(quickSpawnMenu.sourcePort),
    };

    setBrainNodes((prev) => [...prev, newNode]);
    setBrainEdges((prev) => [...prev, newEdge]);
    setQuickSpawnMenu(null);
    setSelectedBrainNodeId(newNodeId);
    setHighlightedBlockId(blockId);
    setEditingNodeId(newNodeId);
    showToast(`Nodo "${title}" creado, conectado y sincronizado con tu OVA.`);
  };

  // --- EDITABLE EDGES HELPERS ---
  const handleUpdateBrainEdge = (
    edgeId: string,
    patch: Partial<KarpathyBrainEdge>
  ) => {
    setBrainEdges((prev) =>
      prev.map((e) => (e.id === edgeId ? { ...e, ...patch } : e))
    );
  };

  const handleReverseBrainEdge = (edgeId: string) => {
    setBrainEdges((prev) =>
      prev.map((e) =>
        e.id === edgeId
          ? {
              ...e,
              sourceId: e.targetId,
              targetId: e.sourceId,
              sourcePort: e.targetPort,
              targetPort: e.sourcePort,
            }
          : e
      )
    );
    showToast('Dirección de la flecha sináptica invertida.');
  };

  const handleDeleteBrainEdge = (edgeId: string) => {
    setBrainEdges((prev) => prev.filter((e) => e.id !== edgeId));
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
    showToast('Conexión sináptica eliminada.');
  };

  // --- NODE IN-PLACE UPDATE & BIDIRECTIONAL TITLE + CONTENT SYNC ---
  const handleUpdateBrainNode = (
    nodeId: string,
    patch: Partial<KarpathyBrainNode>
  ) => {
    const targetNode = activeNodes.find((n) => n.id === nodeId);
    setBrainNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ...patch } : n))
    );

    // Sync title back to linked LessonBlock in OVA
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

  const handleUpdateNodeContentBidirectional = (
    node: KarpathyBrainNode,
    nextContent: string,
    nextUrl?: string
  ) => {
    setBrainNodes((prev) =>
      prev.map((n) =>
        n.id === node.id ? { ...n, noteContent: nextContent } : n
      )
    );

    if (node.lessonId && node.blockId && selectedOva) {
      const lesson = selectedOva.lessons.find((l) => l.id === node.lessonId);
      if (lesson) {
        const updatedBlocks = ensureLessonBlocks(lesson).map((b) =>
          b.id === node.blockId
            ? {
                ...b,
                content: nextContent,
                ...(nextUrl !== undefined ? { url: nextUrl } : {}),
              }
            : b
        );
        handleUpdateLessonBlocks(lesson.id, updatedBlocks);
      }
    }
  };

  const handleToggleNodeCheckbox = (
    node: KarpathyBrainNode,
    currentText: string,
    lineIndex: number
  ) => {
    const lines = currentText.split('\n');
    const line = lines[lineIndex];
    if (line === undefined) return;
    if (/^(\s*-\s*)\[ \]/.test(line)) {
      lines[lineIndex] = line.replace(/^(\s*-\s*)\[ \]/, '$1[x]');
    } else if (/^(\s*-\s*)\[[xX]\]/.test(line)) {
      lines[lineIndex] = line.replace(/^(\s*-\s*)\[[xX]\]/, '$1[ ]');
    }
    handleUpdateNodeContentBidirectional(node, lines.join('\n'));
  };

  const handleToggleNodeExpanded = (node: KarpathyBrainNode) => {
    const nextExpanded = !node.expanded;
    setBrainNodes((prev) =>
      prev.map((n) =>
        n.id === node.id
          ? {
              ...n,
              expanded: nextExpanded,
              // Reset manual height on collapse so compact card hugs its title cleanly
              height: nextExpanded ? n.height : undefined,
            }
          : n
      )
    );
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

  const selectedBrainEdge = useMemo(
    () => activeEdges.find((e) => e.id === selectedEdgeId) ?? null,
    [activeEdges, selectedEdgeId]
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

                {/* LAYER 2: SYNAPTIC SVG CONNECTIONS WITH DIRECTIONAL ARROWS, PORT ANCHORS & LIVE RUBBER-BAND WIRE */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {(['index', 'raw', 'wiki', 'labs', 'practice'] as const).map(
                      (cKey) => (
                        <marker
                          key={`marker-${cKey}`}
                          id={`brain-arrow-${cKey}`}
                          viewBox="0 0 10 10"
                          refX="8.5"
                          refY="5"
                          markerWidth="6.5"
                          markerHeight="6.5"
                          orient="auto"
                        >
                          <path
                            d="M 0 1 L 10 5 L 0 9 z"
                            fill={CLUSTER_META[cKey].strokeColor}
                          />
                        </marker>
                      )
                    )}
                    <marker
                      id="brain-arrow-active"
                      viewBox="0 0 10 10"
                      refX="8.5"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
                    </marker>
                  </defs>

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
                        strokeOpacity={isDark ? 0.14 : 0.2}
                        strokeWidth={1.5}
                        strokeDasharray="4 8"
                      />
                    );
                  })}

                  {/* Synaptic Bezier Edges between Brain Nodes (Anchored to exact Ports) */}
                  {activeEdges.map((edge) => {
                    const source = activeNodes.find(
                      (n) => n.id === edge.sourceId
                    );
                    const target = activeNodes.find(
                      (n) => n.id === edge.targetId
                    );
                    if (!source || !target) return null;

                    const meta = CLUSTER_META[edge.cluster] ?? CLUSTER_META.wiki;
                    const sDims = getMeasuredDims(source);
                    const tDims = getMeasuredDims(target);
                    const autoPorts = inferAutoPorts(source, target);
                    const sPort = edge.sourcePort ?? autoPorts.sourcePort;
                    const tPort = edge.targetPort ?? autoPorts.targetPort;
                    const sp = getPortPoint(source, sPort, sDims);
                    const tp = getPortPoint(target, tPort, tDims);

                    const { pathD, midX, midY } = buildPortBezier(
                      sp.x,
                      sp.y,
                      sPort,
                      tp.x,
                      tp.y,
                      tPort
                    );

                    const isSelectedEdge = selectedEdgeId === edge.id;
                    const isHighlightedEdge =
                      isSelectedEdge ||
                      selectedBrainNodeId === source.id ||
                      selectedBrainNodeId === target.id ||
                      hoveredNodeId === source.id ||
                      hoveredNodeId === target.id;

                    const labelText = edge.label?.trim();
                    const pillWidth = labelText
                      ? Math.max(82, Math.min(180, labelText.length * 6.8 + 22))
                      : 0;

                    return (
                      <g
                        key={edge.id}
                        data-brain-interactive="true"
                        className="pointer-events-auto cursor-pointer group"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEdgeId(edge.id);
                          setSelectedBrainNodeId(null);
                          setQuickSpawnMenu(null);
                        }}
                      >
                        <title>
                          Clic para editar etiqueta, invertir dirección o eliminar sinapsis
                        </title>
                        {/* Invisible wider hit area for effortless edge selection */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="transparent"
                          strokeWidth={16}
                        />
                        {/* Selection glow halo */}
                        {isSelectedEdge && (
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#22d3ee"
                            strokeOpacity={0.35}
                            strokeWidth={8}
                          />
                        )}
                        {/* Base neural fiber with directional arrowhead */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isSelectedEdge ? '#22d3ee' : meta.strokeColor}
                          strokeOpacity={
                            isHighlightedEdge ? 0.92 : isDark ? 0.4 : 0.45
                          }
                          strokeWidth={isSelectedEdge ? 3.2 : isHighlightedEdge ? 2.6 : 1.8}
                          markerEnd={
                            isSelectedEdge
                              ? 'url(#brain-arrow-active)'
                              : `url(#brain-arrow-${edge.cluster})`
                          }
                        />
                        {/* Animated synaptic action potential pulse */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isSelectedEdge ? '#a5f3fc' : meta.pulseColor}
                          strokeOpacity={isHighlightedEdge ? 1 : 0.72}
                          strokeWidth={isHighlightedEdge ? 2.6 : 1.8}
                          className="animate-synapse-flow"
                        />

                        {/* Semantic Relation Label Plate directly on Curve Midpoint */}
                        {labelText && !isSelectedEdge && (
                          <g>
                            <rect
                              x={midX - pillWidth / 2}
                              y={midY - 11}
                              width={pillWidth}
                              height={22}
                              rx={7}
                              fill={isDark ? '#0f172a' : '#ffffff'}
                              fillOpacity={0.94}
                              stroke={
                                isHighlightedEdge
                                  ? meta.strokeColor
                                  : isDark
                                  ? '#334155'
                                  : '#cbd5e1'
                              }
                              strokeWidth={1.2}
                            />
                            <text
                              x={midX}
                              y={midY + 3.5}
                              textAnchor="middle"
                              fill={isDark ? '#e2e8f0' : '#334155'}
                              fontSize="10"
                              fontWeight="600"
                              className="select-none"
                            >
                              {labelText.length > 24
                                ? `${labelText.slice(0, 23)}…`
                                : labelText}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* LIVE RUBBER-BAND SYNAPTIC WIRE (Dragged from a Magnetic Port) */}
                  {draftConnection && (() => {
                    const targetNode = draftConnection.hoveredTargetId
                      ? activeNodes.find(
                          (n) => n.id === draftConnection.hoveredTargetId
                        )
                      : null;
                    let endX = draftConnection.currentX;
                    let endY = draftConnection.currentY;
                    let targetPort: PortSide | undefined = undefined;

                    if (targetNode && draftConnection.hoveredTargetPort) {
                      const tDims = getMeasuredDims(targetNode);
                      const pt = getPortPoint(
                        targetNode,
                        draftConnection.hoveredTargetPort,
                        tDims
                      );
                      endX = pt.x;
                      endY = pt.y;
                      targetPort = draftConnection.hoveredTargetPort;
                    }

                    const { pathD } = buildPortBezier(
                      draftConnection.startX,
                      draftConnection.startY,
                      draftConnection.sourcePort,
                      endX,
                      endY,
                      targetPort
                    );

                    return (
                      <g className="pointer-events-none">
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#22d3ee"
                          strokeOpacity={0.28}
                          strokeWidth={8}
                        />
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth={2.8}
                          strokeDasharray={targetNode ? undefined : '7 5'}
                          markerEnd="url(#brain-arrow-active)"
                        />
                        <circle
                          cx={endX}
                          cy={endY}
                          r={targetNode ? 7 : 5}
                          fill="#22d3ee"
                          fillOpacity={0.9}
                        />
                      </g>
                    );
                  })()}
                </svg>

                {/* LAYER 2.5: INLINE FLOATING EDGE EDITOR POPOVER (For Selected Synaptic Arrow) */}
                {selectedBrainEdge && (() => {
                  const source = activeNodes.find(
                    (n) => n.id === selectedBrainEdge.sourceId
                  );
                  const target = activeNodes.find(
                    (n) => n.id === selectedBrainEdge.targetId
                  );
                  if (!source || !target) return null;

                  const sDims = getMeasuredDims(source);
                  const tDims = getMeasuredDims(target);
                  const autoPorts = inferAutoPorts(source, target);
                  const sPort =
                    selectedBrainEdge.sourcePort ?? autoPorts.sourcePort;
                  const tPort =
                    selectedBrainEdge.targetPort ?? autoPorts.targetPort;
                  const sp = getPortPoint(source, sPort, sDims);
                  const tp = getPortPoint(target, tPort, tDims);
                  const { midX, midY } = buildPortBezier(
                    sp.x,
                    sp.y,
                    sPort,
                    tp.x,
                    tp.y,
                    tPort
                  );

                  return (
                    <div
                      data-brain-interactive="true"
                      onPointerDown={(e) => e.stopPropagation()}
                      style={{
                        left: midX,
                        top: midY,
                        transform: 'translate(-50%, -50%) translateZ(60px)',
                      }}
                      className={`absolute z-40 w-[290px] rounded-xl border p-3 shadow-2xl backdrop-blur-xl space-y-2.5 ${
                        isDark
                          ? 'bg-slate-900/95 border-cyan-500/60 text-slate-100'
                          : 'bg-white/95 border-indigo-400 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-mono font-bold text-cyan-400 truncate">
                          Editar Sinapsis Dirigida
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedEdgeId(null)}
                          className="p-0.5 text-slate-400 hover:text-white rounded"
                          title="Cerrar editor de flecha"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[10px] opacity-75 truncate">
                        {source.title} → {target.title}
                      </div>

                      <input
                        type="text"
                        autoFocus
                        value={selectedBrainEdge.label ?? ''}
                        onChange={(e) =>
                          handleUpdateBrainEdge(selectedBrainEdge.id, {
                            label: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setSelectedEdgeId(null);
                        }}
                        placeholder="Ej: fundamenta, se aplica en..."
                        className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-400'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                        }`}
                      />

                      {/* Quick Semantic Presets */}
                      <div className="flex flex-wrap gap-1">
                        {EDGE_LABEL_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() =>
                              handleUpdateBrainEdge(selectedBrainEdge.id, {
                                label: preset,
                              })
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                              selectedBrainEdge.label === preset
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                                : isDark
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/40">
                        <button
                          type="button"
                          onClick={() =>
                            handleReverseBrainEdge(selectedBrainEdge.id)
                          }
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                            isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          Invertir Dirección
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteBrainEdge(selectedBrainEdge.id)
                          }
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Borrar
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* LAYER 2.6: QUICK-SPAWN FLOATING MENU (On dropping port wire in empty space) */}
                {quickSpawnMenu && (
                  <div
                    data-brain-interactive="true"
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                      left: quickSpawnMenu.x,
                      top: quickSpawnMenu.y,
                      transform: 'translate(-20%, -20%) translateZ(70px)',
                    }}
                    className={`absolute z-50 w-[300px] rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5 ${
                      isDark
                        ? 'bg-slate-900/95 border-cyan-400/70 text-slate-100'
                        : 'bg-white/95 border-indigo-400 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Crear y Conectar Nodo Rápido
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuickSpawnMenu(null)}
                        className="p-0.5 text-slate-400 hover:text-white rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={quickSpawnMenu.title}
                        onChange={(e) =>
                          setQuickSpawnMenu((prev) =>
                            prev ? { ...prev, title: e.target.value } : null
                          )
                        }
                        placeholder="Título del nuevo nodo (opcional)..."
                        className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-400'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                        }`}
                      />
                      <input
                        type="text"
                        value={quickSpawnMenu.edgeLabel}
                        onChange={(e) =>
                          setQuickSpawnMenu((prev) =>
                            prev ? { ...prev, edgeLabel: e.target.value } : null
                          )
                        }
                        placeholder="Etiqueta de la relación (ej. deriva en)..."
                        className={`w-full px-2.5 py-1 text-[11px] rounded-lg border focus:outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-cyan-200 focus:border-cyan-400'
                            : 'bg-slate-50 border-slate-200 text-indigo-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>

                    <div className="text-[10px] opacity-70">
                      Elige el tipo de material (se sincroniza con la lección activa):
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          {
                            type: 'text' as LessonBlockType,
                            label: 'wiki/ Concepto',
                            icon: <FileText className="w-3.5 h-3.5 text-indigo-400" />,
                          },
                          {
                            type: 'code' as LessonBlockType,
                            label: 'wiki/ Código',
                            icon: <Code2 className="w-3.5 h-3.5 text-indigo-300" />,
                          },
                          {
                            type: 'quote' as LessonBlockType,
                            label: 'raw/ Cita · Libro',
                            icon: <Quote className="w-3.5 h-3.5 text-amber-400" />,
                          },
                          {
                            type: 'video' as LessonBlockType,
                            label: 'raw/ Video · Web',
                            icon: <Video className="w-3.5 h-3.5 text-amber-300" />,
                          },
                          {
                            type: 'diagram' as LessonBlockType,
                            label: 'labs/ Diagrama',
                            icon: <GitBranch className="w-3.5 h-3.5 text-fuchsia-400" />,
                          },
                          {
                            type: 'exercise' as LessonBlockType,
                            label: 'lint/ Ejercicio',
                            icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => handleQuickSpawnNodeFromWire(opt.type)}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-[11px] font-semibold transition-colors text-left ${
                            isDark
                              ? 'bg-slate-800/90 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-slate-100'
                              : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-800'
                          }`}
                        >
                          {opt.icon}
                          <span className="truncate">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LAYER 3: INTERACTIVE, RESIZABLE, EXPANDABLE & INLINE-EDITABLE 3D BRAIN NODES WITH MAGNETIC PORTS */}
                {activeNodes.map((node) => {
                  const meta = CLUSTER_META[node.cluster];
                  const isCore = node.cluster === 'index';
                  const isSelected = selectedBrainNodeId === node.id;
                  const isEditing = editingNodeId === node.id;
                  const isExpanded = Boolean(node.expanded) || isEditing;
                  const isMagneticTarget =
                    draftConnection?.hoveredTargetId === node.id;
                  const isResizingThis =
                    dragState?.kind === 'node_resize' &&
                    dragState.nodeId === node.id;

                  // Disable jarring 3D hover tilt while expanded, editing, or resizing for smooth reading/typing
                  const tilt =
                    isExpanded || isEditing || isResizingThis || draftConnection
                      ? { rx: 0, ry: 0 }
                      : nodeTiltMap[node.id] ?? { rx: 0, ry: 0 };

                  const parallaxX =
                    isExpanded || isEditing || isResizingThis
                      ? 0
                      : mouseParallax.x * (node.zDepth - 0.95) * 1.4;
                  const parallaxY =
                    isExpanded || isEditing || isResizingThis
                      ? 0
                      : mouseParallax.y * (node.zDepth - 0.95) * 1.4;

                  const linked = resolveLinkedBlock(node);
                  const resolvedContent =
                    linked?.block.content ??
                    node.noteContent ??
                    (isCore
                      ? `${selectedOva.description}\n\n- **Ficha SENA:** ${selectedOva.fichaCode}\n- **RAP:** ${selectedOva.learningOutcome}`
                      : 'Doble clic para agregar notas Markdown, listas de verificación o apuntes de investigación...');
                  const resolvedUrl = linked?.block.url;
                  const youtubeEmbed = extractYouTubeEmbedUrl(resolvedUrl);

                  const cardWidth =
                    node.width ?? (isExpanded ? 344 : isCore ? 248 : 216);
                  const cardHeight = node.height;

                  const showPorts =
                    isSelected ||
                    hoveredNodeId === node.id ||
                    Boolean(draftConnection);

                  return (
                    <div
                      key={node.id}
                      data-brain-interactive="true"
                      onPointerDown={(e) => handleNodePointerDown(e, node)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSelectedBrainNodeId(node.id);
                        setEditingNodeId(node.id);
                        if (!node.expanded) {
                          handleUpdateBrainNode(node.id, { expanded: true });
                        }
                      }}
                      onPointerEnter={() => setHoveredNodeId(node.id)}
                      onPointerMove={(e) => {
                        if (
                          isExpanded ||
                          isEditing ||
                          isResizingThis ||
                          draftConnection
                        ) {
                          return;
                        }
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
                            rx: Number((-relY * 18).toFixed(1)),
                            ry: Number((relX * 18).toFixed(1)),
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
                        zIndex: isEditing
                          ? 45
                          : isSelected || isMagneticTarget
                          ? 35
                          : isExpanded
                          ? 26
                          : 20,
                        transform: `translate3d(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px), ${
                          isSelected || isEditing
                            ? 28
                            : Math.round((node.zDepth - 0.85) * 40)
                        }px) rotateX(${tilt.rx}deg) rotateY(${
                          tilt.ry
                        }deg) scale(${
                          isExpanded || isEditing
                            ? 1
                            : isSelected
                            ? 1.04
                            : node.zDepth
                        })`,
                      }}
                      className="absolute brain-node-3d-card"
                    >
                      <div
                        ref={(el) => {
                          nodeCardRefs.current[node.id] = el;
                        }}
                        style={{
                          width: `${cardWidth}px`,
                          height: cardHeight ? `${cardHeight}px` : undefined,
                          animationDelay: `${node.floatPhase ?? 0}s`,
                        }}
                        className={`relative flex flex-col rounded-2xl border backdrop-blur-xl transition-shadow ${
                          isExpanded || isEditing || isResizingThis
                            ? ''
                            : 'animate-brain-levitate'
                        } ${isCore ? 'border-2' : ''} ${
                          isExpanded ? 'px-3.5 py-3' : isCore ? 'px-3.5 py-2.5' : 'px-3 py-2'
                        } ${isDark ? meta.darkCard : meta.lightCard} ${
                          isMagneticTarget
                            ? 'ring-2 ring-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.65)]'
                            : isSelected
                            ? 'ring-2 ring-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.45)]'
                            : ''
                        }`}
                      >
                        {/* 4 MAGNETIC DRAGGABLE CONNECTION PORTS (top, right, bottom, left) */}
                        {ALL_PORTS.map((portSide) => {
                          const posClass =
                            portSide === 'top'
                              ? '-top-2 left-1/2 -translate-x-1/2'
                              : portSide === 'right'
                              ? '-right-2 top-1/2 -translate-y-1/2'
                              : portSide === 'bottom'
                              ? '-bottom-2 left-1/2 -translate-x-1/2'
                              : '-left-2 top-1/2 -translate-y-1/2';

                          const isSnappedPort =
                            isMagneticTarget &&
                            draftConnection?.hoveredTargetPort === portSide;

                          return (
                            <button
                              key={portSide}
                              type="button"
                              aria-label={`Puerto de conexión ${portSide}`}
                              title="Arrastra hacia otro nodo para conectar, o suelta en espacio vacío para crear un nodo rápido"
                              onPointerDown={(e) =>
                                handleStartPortDrag(e, node, portSide)
                              }
                              className={`absolute ${posClass} z-30 w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-crosshair ${
                                isSnappedPort
                                  ? 'scale-125 opacity-100 bg-cyan-400 ring-4 ring-cyan-400/40'
                                  : showPorts
                                  ? 'opacity-95 hover:scale-125 bg-slate-950/90 border-2 border-cyan-400'
                                  : 'opacity-0 pointer-events-none'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSnappedPort ? 'bg-slate-950' : 'bg-cyan-300'
                                }`}
                              />
                            </button>
                          );
                        })}

                        {/* NODE HEADER: Pair of Classification Icons + Title + Expand/Collapse Button */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-xl border shrink-0 ${
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

                          {/* Node Title (Inline Editable) */}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setEditingNodeId(null);
                                  }
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className={`w-full text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                                  isDark
                                    ? 'bg-slate-950 text-white border-cyan-400'
                                    : 'bg-slate-50 text-slate-900 border-indigo-500'
                                }`}
                              />
                            ) : (
                              <div
                                className={`font-bold leading-snug ${
                                  isExpanded ? 'text-xs' : 'truncate text-[11px]'
                                }`}
                                title={`${node.title} (Doble clic para editar inline)`}
                              >
                                {node.title}
                              </div>
                            )}
                          </div>

                          {/* 1-Click Expand / Collapse Content Toggle */}
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isEditing) {
                                setEditingNodeId(null);
                              } else {
                                handleToggleNodeExpanded(node);
                              }
                            }}
                            title={
                              isEditing
                                ? 'Guardar edición inline'
                                : isExpanded
                                ? 'Contraer tarjeta'
                                : 'Expandir vista previa interactiva'
                            }
                            className={`p-1 rounded-lg transition-colors shrink-0 ${
                              isEditing
                                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                : isDark
                                ? 'hover:bg-slate-800 text-slate-400 hover:text-cyan-300'
                                : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-700'
                            }`}
                          >
                            {isEditing ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* EXPANDED VIEW / INLINE CONTENT EDITOR BODY */}
                        {isExpanded && (
                          <div
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`mt-2.5 pt-2.5 border-t flex-1 min-h-0 overflow-y-auto pr-0.5 space-y-2 select-text cursor-auto ${
                              isDark
                                ? 'border-slate-700/70'
                                : 'border-slate-200'
                            }`}
                            style={{
                              maxHeight: cardHeight ? undefined : '260px',
                            }}
                          >
                            {isEditing ? (
                              <div className="space-y-2">
                                <label className="block text-[10px] font-mono uppercase tracking-wider opacity-70">
                                  Edición Inline de Contenido (Sincroniza con OVA)
                                </label>
                                <textarea
                                  rows={5}
                                  value={resolvedContent}
                                  onChange={(e) =>
                                    handleUpdateNodeContentBidirectional(
                                      node,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Escribe apuntes Markdown, - [ ] checklists o código..."
                                  className={`w-full px-2.5 py-2 text-xs font-mono leading-relaxed rounded-lg border focus:outline-none resize-y ${
                                    isDark
                                      ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400'
                                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                                  }`}
                                />
                                {(linked?.block.type === 'video' ||
                                  linked?.block.type === 'link') && (
                                  <input
                                    type="url"
                                    value={resolvedUrl ?? ''}
                                    onChange={(e) =>
                                      handleUpdateNodeContentBidirectional(
                                        node,
                                        resolvedContent,
                                        e.target.value
                                      )
                                    }
                                    placeholder="https://youtube.com/... o URL de documentación"
                                    className={`w-full px-2.5 py-1.5 text-[11px] font-mono rounded-lg border focus:outline-none ${
                                      isDark
                                        ? 'bg-slate-950 border-slate-700 text-cyan-200 focus:border-cyan-400'
                                        : 'bg-slate-50 border-slate-300 text-indigo-800 focus:border-indigo-500'
                                    }`}
                                  />
                                )}
                                <div className="flex items-center justify-between pt-0.5">
                                  <span className="text-[10px] opacity-65">
                                    Esc para cerrar
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setEditingNodeId(null)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                                  >
                                    <Check className="w-3 h-3" />
                                    Listo
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Rich Interactive Expanded Preview */
                              <div className="space-y-2">
                                {/* Quote attribution if Quote block */}
                                {linked?.block.type === 'quote' ? (
                                  <blockquote
                                    className={`text-xs italic leading-relaxed px-2.5 py-2 rounded-lg border ${
                                      isDark
                                        ? 'bg-slate-950/70 border-amber-500/30 text-amber-100'
                                        : 'bg-amber-50/70 border-amber-200 text-slate-800'
                                    }`}
                                  >
                                    “{resolvedContent}”
                                    {linked.block.quoteAuthor && (
                                      <footer className="not-italic text-[10px] font-mono mt-1.5 opacity-75">
                                        — {linked.block.quoteAuthor}
                                      </footer>
                                    )}
                                  </blockquote>
                                ) : linked?.block.type === 'code' ? (
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-mono opacity-70">
                                      <span>
                                        {linked.block.codeLanguage ?? 'code'}
                                      </span>
                                      <span>Snippet wiki/</span>
                                    </div>
                                    <pre className="p-2.5 rounded-lg bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                                      <code>{resolvedContent}</code>
                                    </pre>
                                  </div>
                                ) : linked?.block.type === 'exercise' ? (
                                  <div className="space-y-2">
                                    <NodeMarkdownRenderer
                                      content={resolvedContent}
                                      dark={isDark}
                                      onToggleCheckbox={(lineIdx) =>
                                        handleToggleNodeCheckbox(
                                          node,
                                          resolvedContent,
                                          lineIdx
                                        )
                                      }
                                    />
                                    {linked.block.exerciseStarterCode && (
                                      <pre className="p-2 rounded-lg bg-slate-950 text-cyan-300 font-mono text-[10px] overflow-x-auto border border-emerald-500/30">
                                        <code>
                                          {linked.block.exerciseStarterCode}
                                        </code>
                                      </pre>
                                    )}
                                  </div>
                                ) : (
                                  <NodeMarkdownRenderer
                                    content={resolvedContent}
                                    dark={isDark}
                                    onToggleCheckbox={(lineIdx) =>
                                      handleToggleNodeCheckbox(
                                        node,
                                        resolvedContent,
                                        lineIdx
                                      )
                                    }
                                  />
                                )}

                                {/* Embedded YouTube preview or clickable Resource Link */}
                                {youtubeEmbed && (
                                  <div className="rounded-lg overflow-hidden border border-slate-700/60 aspect-video bg-black">
                                    <iframe
                                      src={youtubeEmbed}
                                      title={node.title}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}

                                {resolvedUrl && (
                                  <a
                                    href={resolvedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                                      isDark
                                        ? 'bg-slate-950/80 border-slate-700 text-cyan-300 hover:border-cyan-400'
                                        : 'bg-slate-50 border-slate-200 text-indigo-700 hover:border-indigo-400'
                                    }`}
                                  >
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                    <span className="truncate max-w-[220px]">
                                      {linked?.block.domainOrSource ||
                                        resolvedUrl}
                                    </span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Quick Micro-Toolbar ONLY visible when the node is selected */}
                        {isSelected && (
                          <div
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`mt-2 pt-2 border-t flex items-center justify-between gap-1 text-[10px] shrink-0 ${
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
                              onClick={() => {
                                setEditingNodeId(isEditing ? null : node.id);
                                if (!isEditing && !node.expanded) {
                                  handleUpdateBrainNode(node.id, {
                                    expanded: true,
                                  });
                                }
                              }}
                              className={`p-1 rounded transition-colors ${
                                isEditing
                                  ? 'bg-cyan-500/25 text-cyan-300'
                                  : 'hover:bg-cyan-500/20 text-cyan-400'
                              }`}
                              title="Editar título y contenido inline"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setConnectingFromNodeId(node.id)}
                              className="p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                              title="Conectar sinapsis con otro nodo (o arrastra cualquier puerto)"
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

                        {/* BOTTOM-RIGHT RESIZE HANDLE (Drag to resize · Double-click to reset size) */}
                        <div
                          onPointerDown={(e) => handleStartNodeResize(e, node)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleUpdateBrainNode(node.id, {
                              width: undefined,
                              height: undefined,
                            });
                            showToast('Tamaño del nodo restaurado al valor automático.');
                          }}
                          title="Arrastra para redimensionar · Doble clic para restablecer tamaño"
                          className={`absolute right-1 bottom-1 w-4 h-4 rounded-br-xl flex items-end justify-end p-0.5 cursor-nwse-resize transition-opacity ${
                            isSelected || hoveredNodeId === node.id || isResizingThis
                              ? 'opacity-90'
                              : 'opacity-0'
                          }`}
                        >
                          <svg
                            viewBox="0 0 10 10"
                            className={`w-2.5 h-2.5 ${
                              isDark ? 'text-cyan-400/80' : 'text-indigo-500/80'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          >
                            <path d="M 9 3 L 3 9 M 9 6.5 L 6.5 9" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>

            {/* BOTTOM LEGEND & SELECTED NODE / EDGE INSPECTOR BAR */}
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
                  <span className="font-semibold truncate max-w-[200px]">
                    Activo: {selectedBrainNode.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleNodeExpanded(selectedBrainNode)}
                    className={`px-2 py-1 rounded-lg font-semibold border transition-colors ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {selectedBrainNode.expanded ? 'Contraer' : 'Expandir Vista'}
                  </button>
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
              ) : selectedBrainEdge ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-semibold">
                    Sinapsis seleccionada: {selectedBrainEdge.label || 'sin etiqueta'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleReverseBrainEdge(selectedBrainEdge.id)}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 font-semibold"
                  >
                    Invertir ↔
                  </button>
                </div>
              ) : (
                <span className="opacity-80">
                  Tip: Arrastra desde un puerto circular para conectar o soltar en vacío (crear nodo) · Clic en una flecha para editarla · Doble clic en un nodo para editar inline
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
