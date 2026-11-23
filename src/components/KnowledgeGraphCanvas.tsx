import React, { useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  ExternalLink,
  FileText,
  FolderGit2,
  HelpCircle,
  Layers,
  Link2,
  Maximize2,
  Move,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  Video,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  GraphEdge,
  GraphNode,
  GraphRegion,
  Lesson,
  LessonBlock,
  NodeType,
  OVA,
  ResearchStatus,
} from '../types/ova';
import {
  blocksToMarkdown,
  ensureLessonBlocks,
  ensureNodeBlocks,
  HoverPreviewTrigger,
  NotionNodeBlockEditor,
} from './NotionLessonBlocks';

interface KnowledgeGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  regions: GraphRegion[];
  ovas: OVA[];
  onUpdateNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  onUpdateEdges: React.Dispatch<React.SetStateAction<GraphEdge[]>>;
  onUpdateRegions: React.Dispatch<React.SetStateAction<GraphRegion[]>>;
  onUpdateOvas: React.Dispatch<React.SetStateAction<OVA[]>>;
  onPromoteNodeToOva: (
    nodeId: string,
    ovaId: string,
    mode: 'new_lesson' | 'append_first' | 'sync_lesson',
    targetSpecificLessonId?: string
  ) => void;
  onNavigateToOva?: () => void;
}

const STATUS_LABELS: Record<ResearchStatus, string> = {
  to_research: 'Por investigar',
  draft: 'En borrador',
  verified: 'Verificado',
  in_ova: 'Integrado en OVA',
};

const TYPE_LABELS: Record<NodeType, string> = {
  markdown: 'Nota / Bloques',
  media: 'Enlace / Video',
  code: 'Código Fuente',
  quiz: 'Cuestionario',
  activity: 'Evidencia RAP',
};

const REGION_TONE_STYLES: Record<
  GraphRegion['tone'],
  { border: string; bgDark: string; bgLight: string; textDark: string; textLight: string }
> = {
  indigo: {
    border: 'border-indigo-500/40',
    bgDark: 'bg-indigo-950/20',
    bgLight: 'bg-indigo-50/60',
    textDark: 'text-indigo-300',
    textLight: 'text-indigo-900',
  },
  emerald: {
    border: 'border-emerald-500/40',
    bgDark: 'bg-emerald-950/20',
    bgLight: 'bg-emerald-50/60',
    textDark: 'text-emerald-300',
    textLight: 'text-emerald-900',
  },
  amber: {
    border: 'border-amber-500/40',
    bgDark: 'bg-amber-950/20',
    bgLight: 'bg-amber-50/60',
    textDark: 'text-amber-300',
    textLight: 'text-amber-900',
  },
  slate: {
    border: 'border-slate-500/40',
    bgDark: 'bg-slate-900/40',
    bgLight: 'bg-slate-200/50',
    textDark: 'text-slate-300',
    textLight: 'text-slate-800',
  },
};

export const KnowledgeGraphCanvas: React.FC<KnowledgeGraphCanvasProps> = ({
  nodes,
  edges,
  regions,
  ovas,
  onUpdateNodes,
  onUpdateEdges,
  onUpdateRegions,
  onUpdateOvas,
  onPromoteNodeToOva,
  onNavigateToOva,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [canvasDark, setCanvasDark] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(0.88);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 16 });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id ?? null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [newEdgeLabel, setNewEdgeLabel] = useState<string>('se relaciona con');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ResearchStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<NodeType | 'all'>('all');

  const [targetOvaId, setTargetOvaId] = useState<string>(ovas[0]?.id ?? '');
  const [targetLessonId, setTargetLessonId] = useState<string>(
    ovas[0]?.lessons[0]?.id ?? ''
  );
  const [showCreateOvaInline, setShowCreateOvaInline] = useState<boolean>(false);
  const [newOvaTitle, setNewOvaTitle] = useState<string>('');
  const [newOvaFicha, setNewOvaFicha] = useState<string>('2874512');
  const [newOvaRap, setNewOvaRap] = useState<string>(
    'RAP 01 · Construir componentes de software cumpliendo especificaciones técnicas'
  );
  const [promoteFeedback, setPromoteFeedback] = useState<string | null>(null);

  // Dragging state for nodes, regions, or canvas pan
  const [dragState, setDragState] = useState<{
    kind: 'node' | 'region' | 'pan';
    id?: string;
    startClientX: number;
    startClientY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? null;

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || node.researchStatus === statusFilter;
    const matchesType = typeFilter === 'all' || node.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));

  const handlePointerDownCanvas = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.canvasBg === 'true') {
      setSelectedRegionId(null);
      setDragState({
        kind: 'pan',
        startClientX: e.clientX,
        startClientY: e.clientY,
        initialX: pan.x,
        initialY: pan.y,
      });
    }
  };

  const handlePointerDownNode = (e: React.PointerEvent<HTMLDivElement>, node: GraphNode) => {
    e.stopPropagation();

    // If user is in connection mode, complete the directed edge
    if (connectingFromId && connectingFromId !== node.id) {
      const exists = edges.some(
        (edge) => edge.sourceId === connectingFromId && edge.targetId === node.id
      );
      if (!exists) {
        const newEdge: GraphEdge = {
          id: `edge-${Date.now()}`,
          sourceId: connectingFromId,
          targetId: node.id,
          label: newEdgeLabel.trim() || 'se conecta con',
        };
        onUpdateEdges((prev) => [...prev, newEdge]);
      }
      setConnectingFromId(null);
      setSelectedNodeId(node.id);
      return;
    }

    setSelectedNodeId(node.id);
    setSelectedRegionId(null);
    setDragState({
      kind: 'node',
      id: node.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialX: node.x,
      initialY: node.y,
    });
  };

  const handlePointerDownRegion = (e: React.PointerEvent<HTMLDivElement>, region: GraphRegion) => {
    e.stopPropagation();
    setSelectedRegionId(region.id);
    setSelectedNodeId(null);
    setDragState({
      kind: 'region',
      id: region.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialX: region.x,
      initialY: region.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState) return;

    if (dragState.kind === 'pan') {
      const dx = e.clientX - dragState.startClientX;
      const dy = e.clientY - dragState.startClientY;
      setPan({ x: dragState.initialX + dx, y: dragState.initialY + dy });
      return;
    }

    const dx = (e.clientX - dragState.startClientX) / zoom;
    const dy = (e.clientY - dragState.startClientY) / zoom;

    if (dragState.kind === 'node' && dragState.id) {
      const newX = Math.max(10, Math.round(dragState.initialX + dx));
      const newY = Math.max(10, Math.round(dragState.initialY + dy));
      onUpdateNodes((prev) =>
        prev.map((n) => (n.id === dragState.id ? { ...n, x: newX, y: newY } : n))
      );
    } else if (dragState.kind === 'region' && dragState.id) {
      const newX = Math.max(10, Math.round(dragState.initialX + dx));
      const newY = Math.max(10, Math.round(dragState.initialY + dy));
      onUpdateRegions((prev) =>
        prev.map((r) => (r.id === dragState.id ? { ...r, x: newX, y: newY } : r))
      );
    }
  };

  const handlePointerUp = () => {
    if (dragState) {
      setDragState(null);
    }
  };

  const handleCreateNode = (
    type: NodeType,
    presetKind?: 'link' | 'video' | 'code'
  ) => {
    const newId = `node-${Date.now()}`;
    const offset = (nodes.length % 5) * 35;

    let starterBlocks: LessonBlock[];
    if (presetKind === 'link') {
      starterBlocks = [
        {
          id: `${newId}-blk-1`,
          type: 'text',
          content:
            'Contexto conceptual del recurso web investigado en el lienzo.',
          sourceNodeId: newId,
        },
        {
          id: `${newId}-blk-2`,
          type: 'link',
          title: 'Documentación Oficial / Estándar Técnico de Referencia',
          url: 'https://developer.mozilla.org/es/docs/Web/HTTP',
          domainOrSource: 'MDN Web Docs',
          content: 'Guía técnica de referencia para la lección del OVA.',
          relevanceComment:
            'Este enlace es clave porque detalla el contrato técnico que el aprendiz debe aplicar en su evidencia de proyecto.',
          sourceNodeId: newId,
        },
      ];
    } else if (presetKind === 'video' || (type === 'media' && !presetKind)) {
      starterBlocks = [
        {
          id: `${newId}-blk-1`,
          type: 'text',
          content:
            'Síntesis de los puntos clave demostrados en la cápsula en video.',
          sourceNodeId: newId,
        },
        {
          id: `${newId}-blk-2`,
          type: 'video',
          title: 'Video Explicativo: Implementación Técnica Paso a Paso',
          url: 'https://www.youtube.com/watch?v=7YcW25PHnAA',
          domainOrSource: 'YouTube · Cápsula Técnica SENA',
          videoTimestamp: 'Min 02:15 - 09:40',
          content: 'Demostración práctica del patrón arquitectónico.',
          relevanceComment:
            'Presta especial atención a partir del minuto 02:15 donde se explica la validación y estructura del componente.',
          sourceNodeId: newId,
        },
      ];
    } else if (type === 'code' || presetKind === 'code') {
      starterBlocks = [
        {
          id: `${newId}-blk-1`,
          type: 'text',
          content:
            'Explicación del patrón de implementación y su integración en el proyecto formativo.',
          sourceNodeId: newId,
        },
        {
          id: `${newId}-blk-2`,
          type: 'code',
          codeLanguage: 'typescript',
          title: 'src/services/moduloOva.service.ts',
          content: `export async function procesarEvidenciaAprendiz(fichaCode: string, payload: unknown) {\n  if (!fichaCode) throw new Error('Código de ficha SENA requerido');\n  return { ok: true, fichaCode, timestamp: new Date().toISOString() };\n}`,
          relevanceComment:
            'Segmento de código fuente listo para copiar y adaptar en la capa de servicios del proyecto.',
          sourceNodeId: newId,
        },
      ];
    } else {
      starterBlocks = [
        {
          id: `${newId}-blk-1`,
          type: 'heading',
          title: '1. Concepto y Fundamento Técnico',
          content: '',
          sourceNodeId: newId,
        },
        {
          id: `${newId}-blk-2`,
          type: 'text',
          content:
            'Documenta aquí tus hallazgos en el lienzo. Puedes agregar bloques de enlaces con previsualización, videos comentados o segmentos de código fuente que se sincronizarán directamente con el OVA.',
          sourceNodeId: newId,
        },
      ];
    }

    const newNode: GraphNode = {
      id: newId,
      title:
        presetKind === 'link'
          ? 'Nuevo Enlace Técnico con Previsualización'
          : presetKind === 'video'
          ? 'Nuevo Video Educativo con Previsualización'
          : type === 'code'
          ? 'Nuevo Segmento de Código Fuente'
          : type === 'markdown'
          ? 'Nuevo Concepto Modular (Bloques Notion)'
          : type === 'media'
          ? 'Nuevo Recurso Multimedia / Video'
          : type === 'quiz'
          ? 'Nuevo Cuestionario de Verificación'
          : 'Nueva Evidencia de Aprendizaje RAP',
      type,
      researchStatus: 'draft',
      x: Math.round((180 - pan.x) / zoom + offset),
      y: Math.round((140 - pan.y) / zoom + offset),
      regionId: regions[0]?.id,
      content: blocksToMarkdown(starterBlocks),
      blocks: starterBlocks,
      mediaUrl:
        presetKind === 'link'
          ? 'https://developer.mozilla.org/es/docs/Web/HTTP'
          : presetKind === 'video' || type === 'media'
          ? 'https://www.youtube.com/watch?v=7YcW25PHnAA'
          : undefined,
      mediaKind:
        presetKind === 'link'
          ? 'article'
          : presetKind === 'video' || type === 'media'
          ? 'video'
          : undefined,
      mediaComment: starterBlocks.find(
        (b) => b.type === 'link' || b.type === 'video'
      )?.relevanceComment,
      codeLanguage: type === 'code' ? 'typescript' : undefined,
      quizQuestions:
        type === 'quiz'
          ? [
              {
                id: `q-${Date.now()}`,
                question: '¿Cuál es el propósito central de este concepto técnico dentro del proyecto?',
                options: [
                  'Garantizar modularidad, mantenibilidad y cumplimiento de estándares',
                  'Omitir las pruebas de integración del sistema',
                  'Eliminar la capa de validación de datos',
                  'Deshabilitar el control de versiones',
                ],
                correctIndex: 0,
                explanation: 'Permite estructurar la solución siguiendo buenas prácticas de ingeniería de software.',
              },
            ]
          : undefined,
      dueDate: type === 'activity' ? '2026-11-18' : undefined,
      evidenceType: type === 'activity' ? 'Producto' : undefined,
      tags: ['Lienzo', 'SENA'],
      updatedAt: '2026-11-09',
    };

    onUpdateNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setSelectedRegionId(null);
  };

  const handleCreateRegion = () => {
    const newId = `reg-${Date.now()}`;
    const newRegion: GraphRegion = {
      id: newId,
      title: `Región 0${regions.length + 1} · Nuevo Bloque Temático`,
      subtitle: 'Agrupa nodos relacionados arrastrándolos dentro de esta zona',
      x: Math.round((140 - pan.x) / zoom),
      y: Math.round((120 - pan.y) / zoom),
      width: 580,
      height: 380,
      tone: 'indigo',
    };
    onUpdateRegions((prev) => [...prev, newRegion]);
    setSelectedRegionId(newId);
    setSelectedNodeId(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    onUpdateNodes((prev) => prev.filter((n) => n.id !== nodeId));
    onUpdateEdges((prev) =>
      prev.filter((e) => e.sourceId !== nodeId && e.targetId !== nodeId)
    );
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(nodes.find((n) => n.id !== nodeId)?.id ?? null);
    }
  };

  const handleDeleteEdge = (edgeId: string) => {
    onUpdateEdges((prev) => prev.filter((e) => e.id !== edgeId));
  };

  const handleUpdateSelectedNode = (patch: Partial<GraphNode>) => {
    if (!selectedNode) return;
    const updatedNode: GraphNode = {
      ...selectedNode,
      ...patch,
      updatedAt: '2026-11-09',
    };
    onUpdateNodes((prev) =>
      prev.map((n) => (n.id === selectedNode.id ? updatedNode : n))
    );

    // Bidirectional Live Sync: if this node is linked to an OVA Lesson, automatically update the OVA lesson's blocks!
    if (updatedNode.linkedOvaId) {
      const nodeBlocks = ensureNodeBlocks(updatedNode);
      onUpdateOvas((prevOvas) =>
        prevOvas.map((ova) => {
          if (ova.id !== updatedNode.linkedOvaId) return ova;
          return {
            ...ova,
            updatedAt: '2026-11-09',
            lessons: ova.lessons.map((lesson) => {
              const isLinkedLesson =
                lesson.id === updatedNode.linkedLessonId ||
                lesson.linkedNodeIds.includes(updatedNode.id);
              if (!isLinkedLesson) return lesson;

              const currentLessonBlocks = ensureLessonBlocks(lesson);
              const hasNodeBlocks = currentLessonBlocks.some(
                (b) => b.sourceNodeId === updatedNode.id
              );

              let nextBlocks: LessonBlock[];
              if (
                lesson.linkedNodeIds.length === 1 &&
                lesson.linkedNodeIds[0] === updatedNode.id
              ) {
                nextBlocks = nodeBlocks;
              } else if (hasNodeBlocks) {
                const firstIdx = currentLessonBlocks.findIndex(
                  (b) => b.sourceNodeId === updatedNode.id
                );
                const withoutNode = currentLessonBlocks.filter(
                  (b) => b.sourceNodeId !== updatedNode.id
                );
                nextBlocks = [...withoutNode];
                nextBlocks.splice(firstIdx, 0, ...nodeBlocks);
              } else {
                nextBlocks = [...currentLessonBlocks, ...nodeBlocks];
              }

              return {
                ...lesson,
                ...(lesson.linkedNodeIds.length === 1 && patch.title
                  ? { title: patch.title }
                  : {}),
                blocks: nextBlocks,
                contentMarkdown: blocksToMarkdown(nextBlocks),
              };
            }),
          };
        })
      );
    }
  };

  const handleUpdateSelectedRegion = (patch: Partial<GraphRegion>) => {
    if (!selectedRegion) return;
    onUpdateRegions((prev) =>
      prev.map((r) => (r.id === selectedRegion.id ? { ...r, ...patch } : r))
    );
  };

  const handleTriggerPromote = (
    mode: 'new_lesson' | 'append_first' | 'sync_lesson'
  ) => {
    if (!selectedNode || !targetOvaId) return;
    onPromoteNodeToOva(
      selectedNode.id,
      targetOvaId,
      mode,
      targetLessonId || undefined
    );
    const targetOva = ovas.find((o) => o.id === targetOvaId);
    setPromoteFeedback(
      mode === 'new_lesson'
        ? `Nueva lección creada y sincronizada en "${targetOva?.title ?? 'OVA'}"`
        : `Bloques sincronizados bidireccionalmente con "${targetOva?.title ?? 'OVA'}"`
    );
    setTimeout(() => setPromoteFeedback(null), 3500);
  };

  const handleCreateNewOvaFromNode = () => {
    if (!selectedNode) return;
    const newOvaId = `ova-${Date.now()}`;
    const firstLessonId = `les-${Date.now()}-1`;
    const nodeBlocks = ensureNodeBlocks(selectedNode);

    const createdOva: OVA = {
      id: newOvaId,
      code: `OVA-SENA-${new Date().getFullYear()}-0${ovas.length + 1}`,
      title:
        newOvaTitle.trim() || `OVA: ${selectedNode.title}`,
      fichaCode: newOvaFicha.trim() || '2874512',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      competence:
        '220501096 · Desarrollar la solución de software de acuerdo con el diseño',
      learningOutcome:
        newOvaRap.trim() ||
        'RAP 01 · Construir componentes técnicos según requerimientos del proyecto formativo',
      status: 'published',
      description: `Objeto Virtual de Aprendizaje creado y sincronizado directamente desde el Lienzo en Grafo a partir del nodo "${selectedNode.title}".`,
      estimatedHours: 16,
      updatedAt: '2026-11-09',
      lessons: [
        {
          id: firstLessonId,
          order: 1,
          title: selectedNode.title,
          durationMinutes: 45,
          summary: `Lección construida desde el nodo "${selectedNode.title}" (${selectedNode.tags.join(', ')}).`,
          contentMarkdown: blocksToMarkdown(nodeBlocks),
          blocks: nodeBlocks,
          mediaUrl: selectedNode.mediaUrl,
          mediaTitle: selectedNode.title,
          mediaComment: selectedNode.mediaComment,
          linkedNodeIds: [selectedNode.id],
          quiz: selectedNode.quizQuestions
            ? [...selectedNode.quizQuestions]
            : [],
        },
      ],
    };

    onUpdateOvas((prev) => [createdOva, ...prev]);
    handleUpdateSelectedNode({
      researchStatus: 'in_ova',
      linkedOvaId: newOvaId,
      linkedLessonId: firstLessonId,
    });
    setTargetOvaId(newOvaId);
    setTargetLessonId(firstLessonId);
    setShowCreateOvaInline(false);
    setNewOvaTitle('');
    setPromoteFeedback(
      `Nuevo OVA "${createdOva.title}" creado y vinculado en tiempo real con este nodo.`
    );
    setTimeout(() => setPromoteFeedback(null), 4000);
  };

  const handleBuildOvaFromRegion = (region: GraphRegion) => {
    const regionNodes = nodes.filter(
      (n) =>
        n.regionId === region.id ||
        (n.x >= region.x &&
          n.x <= region.x + region.width &&
          n.y >= region.y &&
          n.y <= region.y + region.height)
    );
    if (regionNodes.length === 0) return;

    const newOvaId = `ova-reg-${Date.now()}`;
    const nodeLessonMap: Record<string, string> = {};

    const lessons: Lesson[] = regionNodes.map((n, idx) => {
      const lesId = `les-${Date.now()}-${idx + 1}`;
      nodeLessonMap[n.id] = lesId;
      const nBlocks = ensureNodeBlocks(n);
      return {
        id: lesId,
        order: idx + 1,
        title: n.title,
        durationMinutes: 45,
        summary: `Lección ${idx + 1} generada desde la región "${region.title}".`,
        contentMarkdown: blocksToMarkdown(nBlocks),
        blocks: nBlocks,
        mediaUrl: n.mediaUrl,
        mediaTitle: n.title,
        mediaComment: n.mediaComment,
        linkedNodeIds: [n.id],
        quiz: n.quizQuestions ? [...n.quizQuestions] : [],
        activity:
          n.type === 'activity'
            ? {
                id: `act-${Date.now()}-${idx}`,
                title: n.title,
                evidenceCode: `GA7-220501096-AA1-EV0${idx + 1}`,
                evidenceType: n.evidenceType ?? 'Producto',
                instructions: n.content,
                dueDate: n.dueDate ?? '2026-11-16',
                deliverableFormat: 'Repositorio Git o documento PDF',
              }
            : undefined,
      };
    });

    const newOva: OVA = {
      id: newOvaId,
      code: `OVA-REG-${new Date().getFullYear()}-0${ovas.length + 1}`,
      title: region.title.replace(/^Región\s+\d+\s*·\s*/i, ''),
      fichaCode: '2874512',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      competence:
        '220501096 · Desarrollar la solución de software de acuerdo con el diseño',
      learningOutcome: `RAP · ${region.subtitle}`,
      status: 'published',
      description: `OVA construido automáticamente desde la región temática "${region.title}" del Lienzo en Grafo con ${lessons.length} lecciones sincronizadas.`,
      estimatedHours: lessons.length * 6,
      updatedAt: '2026-11-09',
      lessons,
    };

    onUpdateOvas((prev) => [newOva, ...prev]);
    onUpdateRegions((prev) =>
      prev.map((r) => (r.id === region.id ? { ...r, linkedOvaId: newOvaId } : r))
    );
    onUpdateNodes((prev) =>
      prev.map((n) =>
        nodeLessonMap[n.id]
          ? {
              ...n,
              researchStatus: 'in_ova',
              linkedOvaId: newOvaId,
              linkedLessonId: nodeLessonMap[n.id],
              updatedAt: '2026-11-09',
            }
          : n
      )
    );
    setTargetOvaId(newOvaId);
    setPromoteFeedback(
      `OVA "${newOva.title}" creado con ${lessons.length} lecciones sincronizadas desde esta región.`
    );
    setTimeout(() => setPromoteFeedback(null), 4000);
  };

  const resetView = () => {
    setZoom(0.85);
    setPan({ x: 24, y: 20 });
  };

  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 156;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8.5rem)] min-h-[680px] bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Left / Main Zone: Interactive Obsidian-Style Knowledge Graph Stage */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Canvas Floating Controls & Creation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 z-20">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 whitespace-nowrap shrink-0">
              Añadir al Lienzo:
            </span>
            <button
              type="button"
              onClick={() => handleCreateNode('markdown')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Nota / Bloques
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('media', 'link')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              Enlace con Preview
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('media', 'video')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Video className="w-3.5 h-3.5 text-rose-600" />
              Video con Preview
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('code', 'code')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-100 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Código Fuente
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('quiz')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Cuestionario
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('activity')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
              Evidencia RAP
            </button>
            <button
              type="button"
              onClick={handleCreateRegion}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Región Temática
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar concepto o etiqueta..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 w-48"
              />
            </div>

            <select
              aria-label="Filtrar por estado de investigación"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ResearchStatus | 'all')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los estados ({nodes.length})</option>
              <option value="to_research">Por investigar</option>
              <option value="draft">En borrador</option>
              <option value="verified">Verificado</option>
              <option value="in_ova">Integrado en OVA</option>
            </select>

            <select
              aria-label="Filtrar por tipo de nodo"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NodeType | 'all')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="markdown">Notas Markdown</option>
              <option value="media">Videos / Recursos</option>
              <option value="quiz">Cuestionarios</option>
              <option value="activity">Evidencias RAP</option>
            </select>
          </div>
        </div>

        {/* Active Connection Mode Banner */}
        {connectingFromId && (
          <div className="bg-indigo-600 text-white px-4 py-2 text-xs flex items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold">
                Modo Conexión Conceptual Activo:
              </span>
              <span>
                Haz clic sobre otro nodo del grafo para trazar la flecha desde{' '}
                <strong>
                  {nodes.find((n) => n.id === connectingFromId)?.title}
                </strong>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-200">Etiqueta de relación:</span>
                <input
                  type="text"
                  value={newEdgeLabel}
                  onChange={(e) => setNewEdgeLabel(e.target.value)}
                  className="px-2 py-0.5 text-xs rounded bg-indigo-700 text-white border border-indigo-400 focus:outline-none"
                  placeholder="ej. prerrequisito de"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConnectingFromId(null)}
              className="px-2.5 py-1 bg-indigo-800 hover:bg-indigo-900 rounded text-xs font-medium whitespace-nowrap shrink-0"
            >
              Cancelar conexión
            </button>
          </div>
        )}

        {/* Interactive Graph Viewport */}
        <div
          ref={containerRef}
          data-canvas-bg="true"
          onPointerDown={handlePointerDownCanvas}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`flex-1 relative overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing ${
            canvasDark ? 'canvas-dot-grid-dark text-slate-100' : 'canvas-dot-grid-light text-slate-900'
          }`}
        >
          {/* Transform Plane */}
          <div
            data-canvas-bg="true"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '2200px',
              height: '1400px',
            }}
            className="relative"
          >
            {/* 1. Thematic Regions Layer */}
            {regions.map((region) => {
              const tone = REGION_TONE_STYLES[region.tone];
              const isSelected = selectedRegionId === region.id;
              return (
                <div
                  key={region.id}
                  onPointerDown={(e) => handlePointerDownRegion(e, region)}
                  style={{
                    left: `${region.x}px`,
                    top: `${region.y}px`,
                    width: `${region.width}px`,
                    height: `${region.height}px`,
                  }}
                  className={`absolute rounded-2xl border-2 transition-shadow ${tone.border} ${
                    canvasDark ? tone.bgDark : tone.bgLight
                  } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div className="px-4 py-3 border-b border-slate-500/20 flex items-center justify-between gap-2 cursor-move">
                    <div>
                      <h4
                        className={`text-sm font-semibold tracking-tight ${
                          canvasDark ? tone.textDark : tone.textLight
                        }`}
                      >
                        {region.title}
                      </h4>
                      <p
                        className={`text-xs ${
                          canvasDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {region.subtitle}
                      </p>
                    </div>
                    <Move
                      className={`w-4 h-4 shrink-0 ${
                        canvasDark ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {/* 2. Directed SVG Edges Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrow-indigo"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                </marker>
                <marker
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 0 1 L 10 5 L 0 9 z"
                    fill={canvasDark ? '#64748b' : '#94a3b8'}
                  />
                </marker>
              </defs>

              {edges.map((edge) => {
                if (
                  !visibleNodeIds.has(edge.sourceId) ||
                  !visibleNodeIds.has(edge.targetId)
                ) {
                  return null;
                }
                const source = nodes.find((n) => n.id === edge.sourceId);
                const target = nodes.find((n) => n.id === edge.targetId);
                if (!source || !target) return null;

                const sx = source.x + NODE_WIDTH / 2;
                const sy = source.y + NODE_HEIGHT / 2;
                const tx = target.x + NODE_WIDTH / 2;
                const ty = target.y + NODE_HEIGHT / 2;

                const dx = tx - sx;
                const dy = ty - sy;
                const cx1 = sx + dx * 0.38;
                const cy1 = sy + dy * 0.12;
                const cx2 = sx + dx * 0.62;
                const cy2 = sy + dy * 0.88;

                const midX = (sx + tx) / 2;
                const midY = (sy + ty) / 2;

                const isHighlighted =
                  selectedNodeId === edge.sourceId ||
                  selectedNodeId === edge.targetId;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`}
                      fill="none"
                      stroke={
                        isHighlighted
                          ? '#6366f1'
                          : canvasDark
                          ? '#475569'
                          : '#94a3b8'
                      }
                      strokeWidth={isHighlighted ? 2.6 : 1.8}
                      strokeDasharray={isHighlighted ? undefined : '5 3'}
                      markerEnd={
                        isHighlighted ? 'url(#arrow-indigo)' : 'url(#arrow-muted)'
                      }
                    />
                    <rect
                      x={midX - 64}
                      y={midY - 11}
                      width={128}
                      height={22}
                      rx={6}
                      fill={canvasDark ? '#1e293b' : '#ffffff'}
                      stroke={
                        isHighlighted
                          ? '#6366f1'
                          : canvasDark
                          ? '#334155'
                          : '#cbd5e1'
                      }
                      strokeWidth={1}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fill={
                        isHighlighted
                          ? canvasDark
                            ? '#a5b4fc'
                            : '#4338ca'
                          : canvasDark
                          ? '#cbd5e1'
                          : '#475569'
                      }
                      fontSize="10"
                      fontWeight="500"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 3. Interactive Draggable Nodes Layer with Direct Hover Previews for Links/Videos & Code Badges */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isConnectingSource = connectingFromId === node.id;
              const linkedOva = ovas.find((o) => o.id === node.linkedOvaId);
              const nodeBlocks = ensureNodeBlocks(node);
              const mediaBlocks = nodeBlocks.filter(
                (b) => b.type === 'link' || b.type === 'video'
              );
              const codeBlock = nodeBlocks.find((b) => b.type === 'code');

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDownNode(e, node)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${NODE_WIDTH}px`,
                  }}
                  className={`absolute rounded-xl border p-3.5 transition-shadow cursor-grab active:cursor-grabbing hover:z-30 ${
                    canvasDark
                      ? 'bg-slate-900/95 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  } ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 border-indigo-500 z-20'
                      : 'hover:border-indigo-400'
                  } ${isConnectingSource ? 'ring-2 ring-amber-400' : ''}`}
                >
                  {/* Clean Unboxed Metadata Line */}
                  <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                    <div
                      className={`flex items-center gap-1.5 truncate ${
                        canvasDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {node.type === 'markdown' && (
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                      {node.type === 'media' && (
                        <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      {node.type === 'code' && (
                        <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {node.type === 'quiz' && (
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {node.type === 'activity' && (
                        <FolderGit2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-medium">{TYPE_LABELS[node.type]}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          node.researchStatus === 'in_ova'
                            ? 'text-emerald-400 font-medium'
                            : node.researchStatus === 'verified'
                            ? 'text-sky-400 font-medium'
                            : node.researchStatus === 'draft'
                            ? 'text-amber-400 font-medium'
                            : 'text-slate-400'
                        }
                      >
                        {STATUS_LABELS[node.researchStatus]}
                      </span>
                    </div>

                    <button
                      type="button"
                      title="Trazar conexión hacia otro nodo"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConnectingFromId(
                          connectingFromId === node.id ? null : node.id
                        );
                      }}
                      className={`p-1 rounded transition-colors ${
                        isConnectingSource
                          ? 'bg-indigo-600 text-white'
                          : canvasDark
                          ? 'hover:bg-slate-800 text-slate-400 hover:text-indigo-300'
                          : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Node Title */}
                  <h5 className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2">
                    {node.title}
                  </h5>

                  {/* Snippet / Content Preview */}
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 mb-2 ${
                      canvasDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {node.content.replace(/[#*`>]/g, '')}
                  </p>

                  {/* Interactive Hover Preview Chips for Links, Videos & Source Code directly on the Canvas Node */}
                  {(mediaBlocks.length > 0 || codeBlock) && (
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      className="flex flex-wrap items-center gap-1.5 mb-2"
                    >
                      {mediaBlocks.slice(0, 2).map((mb) => (
                        <HoverPreviewTrigger
                          key={mb.id}
                          kind={mb.type === 'video' ? 'video' : 'link'}
                          title={
                            mb.title
                              ? mb.title.length > 26
                                ? `${mb.title.slice(0, 26)}…`
                                : mb.title
                              : mb.type === 'video'
                              ? 'Video'
                              : 'Enlace'
                          }
                          url={mb.url || 'https://'}
                          relevanceComment={
                            mb.relevanceComment ||
                            mb.content ||
                            'Recurso vinculado en este nodo del lienzo.'
                          }
                          domainOrSource={mb.domainOrSource}
                          videoTimestamp={mb.videoTimestamp}
                          inline
                        />
                      ))}
                      {codeBlock && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                            canvasDark
                              ? 'bg-slate-950 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-900 text-emerald-300 border-slate-700'
                          }`}
                          title={
                            codeBlock.relevanceComment || codeBlock.content
                          }
                        >
                          <Code2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>
                            {codeBlock.codeLanguage || 'code'}
                            {codeBlock.title ? ` · ${codeBlock.title.split('/').pop()}` : ''}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Metadata */}
                  <div
                    className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                      canvasDark
                        ? 'border-slate-800 text-slate-400'
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="truncate">
                      {nodeBlocks.length} bloques · {node.tags.slice(0, 2).join(' · ')}
                    </span>
                    {linkedOva ? (
                      <span className="text-emerald-400 font-mono shrink-0 ml-2">
                        ⇄ OVA {linkedOva.fichaCode}
                      </span>
                    ) : (
                      <span className="font-mono shrink-0 ml-2">
                        ({node.x}, {node.y})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom-Left Canvas HUD Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/90 text-slate-100 border border-slate-700 rounded-lg p-1.5 shadow-sm z-20">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.45, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
              title="Alejar lienzo"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tabular-nums px-2">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
              title="Acercar lienzo"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-700 mx-0.5" />
            <button
              type="button"
              onClick={resetView}
              className="px-2 py-1 text-xs hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Centrar Vista
            </button>
            <button
              type="button"
              onClick={() => setCanvasDark((d) => !d)}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors whitespace-nowrap"
            >
              {canvasDark ? 'Fondo Claro' : 'Fondo Oscuro'}
            </button>
          </div>

          {/* Bottom-Right Graph Stats */}
          <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 bg-slate-900/90 text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono tabular-nums z-20">
            <span>{nodes.length} Nodos</span>
            <span aria-hidden="true">·</span>
            <span>{edges.length} Relaciones</span>
            <span aria-hidden="true">·</span>
            <span>{regions.length} Regiones</span>
          </div>
        </div>
      </div>

      {/* Right Zone: Inspector & Bidirectional Notion-Style OVA Authoring Deck */}
      <aside className="w-full lg:w-[480px] xl:w-[540px] border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/70 flex flex-col h-full overflow-y-auto">
        {selectedNode ? (
          <div className="p-5 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <span>Inspector de Nodo y Autoría OVA</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedNode.id}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Editar Bloques del Nodo y Sincronizar con OVA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar nodo del grafo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Type/Status Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Concepto / Lección en el Lienzo
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) =>
                    handleUpdateSelectedNode({ title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría Principal del Nodo
                  </label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) =>
                      handleUpdateSelectedNode({
                        type: e.target.value as NodeType,
                      })
                    }
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="markdown">Nota / Bloques Notion</option>
                    <option value="media">Enlace / Video con Preview</option>
                    <option value="code">Segmento de Código Fuente</option>
                    <option value="quiz">Cuestionario Interactivo</option>
                    <option value="activity">Evidencia RAP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado de Investigación
                  </label>
                  <select
                    value={selectedNode.researchStatus}
                    onChange={(e) =>
                      handleUpdateSelectedNode({
                        researchStatus: e.target.value as ResearchStatus,
                      })
                    }
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="to_research">Por investigar</option>
                    <option value="draft">En borrador</option>
                    <option value="verified">Verificado</option>
                    <option value="in_ova">Integrado en OVA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Región Temática
                  </label>
                  <select
                    value={selectedNode.regionId ?? ''}
                    onChange={(e) =>
                      handleUpdateSelectedNode({
                        regionId: e.target.value || undefined,
                      })
                    }
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Sin región asignada</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={selectedNode.tags.join(', ')}
                    onChange={(e) =>
                      handleUpdateSelectedNode({
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Full Notion-Style Block Editor directly inside the Canvas Node Inspector */}
            <NotionNodeBlockEditor
              node={selectedNode}
              onUpdateNode={handleUpdateSelectedNode}
            />

            {/* Type-Specific Fields: Activity / Evidence */}
            {selectedNode.type === 'activity' && (
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Evidencia SENA
                  </label>
                  <select
                    value={selectedNode.evidenceType ?? 'Producto'}
                    onChange={(e) =>
                      handleUpdateSelectedNode({
                        evidenceType: e.target.value as
                          | 'Conocimiento'
                          | 'Desempeño'
                          | 'Producto',
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Conocimiento">Conocimiento</option>
                    <option value="Desempeño">Desempeño</option>
                    <option value="Producto">Producto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha Límite Sugerida
                  </label>
                  <input
                    type="date"
                    value={selectedNode.dueDate ?? '2026-11-15'}
                    onChange={(e) =>
                      handleUpdateSelectedNode({ dueDate: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Type-Specific Fields: Interactive Quiz Builder inside Node */}
            {selectedNode.type === 'quiz' && (
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Preguntas del Nodo ({selectedNode.quizQuestions?.length ?? 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = selectedNode.quizQuestions ?? [];
                      handleUpdateSelectedNode({
                        quizQuestions: [
                          ...current,
                          {
                            id: `q-${Date.now()}`,
                            question: 'Nueva pregunta de comprobación',
                            options: ['Opción A (Correcta)', 'Opción B', 'Opción C'],
                            correctIndex: 0,
                            explanation: 'Retroalimentación para el aprendiz.',
                          },
                        ],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir pregunta
                  </button>
                </div>
                {(selectedNode.quizQuestions ?? []).map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs"
                  >
                    <div className="font-medium text-slate-800">
                      {idx + 1}. {q.question}
                    </div>
                    <div className="text-slate-500">
                      Respuesta correcta: {q.options[q.correctIndex]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create, Edit & Bidirectional Sync Node <-> OVA Lesson Section */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Crear o Editar OVA directamente desde el Lienzo
                </h4>
                <button
                  type="button"
                  onClick={() => setShowCreateOvaInline((v) => !v)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                >
                  {showCreateOvaInline ? 'Cancelar' : '+ Nuevo OVA aquí'}
                </button>
              </div>

              {/* Active Bidirectional Sync Status if Node is already linked to an OVA */}
              {selectedNode.linkedOvaId && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Sincronización Bidireccional Activa
                    </span>
                    {onNavigateToOva && (
                      <button
                        type="button"
                        onClick={onNavigateToOva}
                        className="text-[11px] font-semibold text-emerald-800 underline hover:text-emerald-950"
                      >
                        Ver en Gestión de OVAs →
                      </button>
                    )}
                  </div>
                  <div className="text-emerald-800 text-[11px]">
                    Todos los bloques de texto, enlaces con previsualización,
                    videos y código fuente que edites en este nodo actualizan en
                    tiempo real el OVA{' '}
                    <strong>
                      {ovas.find((o) => o.id === selectedNode.linkedOvaId)
                        ?.title ?? selectedNode.linkedOvaId}
                    </strong>
                    .
                  </div>
                </div>
              )}

              {/* Inline Create New OVA Form right inside the Canvas Inspector */}
              {showCreateOvaInline && (
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-lg space-y-2.5 text-xs">
                  <div className="font-bold text-indigo-950">
                    Crear Nuevo OVA SENA con este Nodo como 1ª Lección
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Título del Nuevo OVA
                    </label>
                    <input
                      type="text"
                      value={newOvaTitle}
                      onChange={(e) => setNewOvaTitle(e.target.value)}
                      placeholder={`Ej. OVA: ${selectedNode.title}`}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ficha SENA
                      </label>
                      <input
                        type="text"
                        value={newOvaFicha}
                        onChange={(e) => setNewOvaFicha(e.target.value)}
                        className="w-full px-2.5 py-1.5 font-mono bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Resultado de Aprendizaje (RAP)
                      </label>
                      <input
                        type="text"
                        value={newOvaRap}
                        onChange={(e) => setNewOvaRap(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewOvaFromNode}
                    className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    ✨ Crear OVA y Vincular Nodo Ahora
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-600">
                  1. Seleccionar OVA Destino:
                </label>
                <select
                  value={targetOvaId}
                  onChange={(e) => {
                    const nextOvaId = e.target.value;
                    setTargetOvaId(nextOvaId);
                    const found = ovas.find((o) => o.id === nextOvaId);
                    setTargetLessonId(found?.lessons[0]?.id ?? '');
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  {ovas.map((ova) => (
                    <option key={ova.id} value={ova.id}>
                      Ficha {ova.fichaCode} · {ova.title}
                    </option>
                  ))}
                </select>

                <label className="block text-[11px] font-semibold text-slate-600">
                  2. Lección del OVA a Sincronizar / Anexar:
                </label>
                <select
                  value={targetLessonId}
                  onChange={(e) => setTargetLessonId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  {(
                    ovas.find((o) => o.id === targetOvaId)?.lessons ?? []
                  ).map((l) => (
                    <option key={l.id} value={l.id}>
                      Lección 0{l.order}: {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleTriggerPromote('sync_lesson')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sincronizar en Lección Seleccionada
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerPromote('new_lesson')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Crear como Nueva Lección
                </button>
              </div>

              {promoteFeedback && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{promoteFeedback}</span>
                </div>
              )}
            </div>

            {/* Connected Edges Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  Relaciones Conceptuales del Nodo
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setConnectingFromId(
                      connectingFromId === selectedNode.id
                        ? null
                        : selectedNode.id
                    )
                  }
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  + Conectar con otro nodo
                </button>
              </div>

              <div className="space-y-1.5">
                {edges
                  .filter(
                    (e) =>
                      e.sourceId === selectedNode.id ||
                      e.targetId === selectedNode.id
                  )
                  .map((edge) => {
                    const otherId =
                      edge.sourceId === selectedNode.id
                        ? edge.targetId
                        : edge.sourceId;
                    const otherNode = nodes.find((n) => n.id === otherId);
                    const isOutgoing = edge.sourceId === selectedNode.id;
                    return (
                      <div
                        key={edge.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="truncate">
                          <span className="text-slate-400">
                            {isOutgoing ? '→' : '←'}
                          </span>{' '}
                          <span className="font-medium text-indigo-600">
                            {edge.label}
                          </span>{' '}
                          <span className="text-slate-700">
                            {otherNode?.title ?? otherId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEdge(edge.id)}
                          className="text-slate-400 hover:text-red-600 shrink-0"
                          title="Eliminar relación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : selectedRegion ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs text-slate-500">
                  Inspector de Región Temática
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Editar Agrupación Visual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateRegions((prev) =>
                    prev.filter((r) => r.id !== selectedRegion.id)
                  );
                  setSelectedRegionId(null);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título de la Región
              </label>
              <input
                type="text"
                value={selectedRegion.title}
                onChange={(e) =>
                  handleUpdateSelectedRegion({ title: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtítulo / Alcance Conceptual
              </label>
              <input
                type="text"
                value={selectedRegion.subtitle}
                onChange={(e) =>
                  handleUpdateSelectedRegion({ subtitle: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ancho (px)
                </label>
                <input
                  type="number"
                  value={selectedRegion.width}
                  onChange={(e) =>
                    handleUpdateSelectedRegion({
                      width: Math.max(300, Number(e.target.value)),
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alto (px)
                </label>
                <input
                  type="number"
                  value={selectedRegion.height}
                  onChange={(e) =>
                    handleUpdateSelectedRegion({
                      height: Math.max(240, Number(e.target.value)),
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tono Visual
              </label>
              <select
                value={selectedRegion.tone}
                onChange={(e) =>
                  handleUpdateSelectedRegion({
                    tone: e.target.value as GraphRegion['tone'],
                  })
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
              >
                <option value="indigo">Índigo Académico</option>
                <option value="emerald">Esmeralda SENA</option>
                <option value="amber">Ámbar Evidencias</option>
                <option value="slate">Pizarra Neutro</option>
              </select>
            </div>

            {/* Build a Full OVA from all Nodes inside this Region */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  Construir OVA Completo desde esta Región
                </h4>
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convierte todos los nodos agrupados dentro de esta región en un
                nuevo Objeto Virtual de Aprendizaje con sus lecciones, enlaces,
                videos y segmentos de código sincronizados.
              </p>
              <button
                type="button"
                onClick={() => handleBuildOvaFromRegion(selectedRegion)}
                className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Crear Nuevo OVA con los Nodos de esta Región
              </button>
              {promoteFeedback && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{promoteFeedback}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center my-auto space-y-2">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800">
              Selecciona un Nodo o Región del Lienzo
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Haz clic en cualquier tarjeta del mapa mental para editar tus notas
              de investigación, trazar relaciones o enviarlas a un OVA.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};
