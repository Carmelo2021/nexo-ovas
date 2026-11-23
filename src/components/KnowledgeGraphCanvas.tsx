import React, { useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
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
  NodeType,
  OVA,
  ResearchStatus,
} from '../types/ova';

interface KnowledgeGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  regions: GraphRegion[];
  ovas: OVA[];
  onUpdateNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  onUpdateEdges: React.Dispatch<React.SetStateAction<GraphEdge[]>>;
  onUpdateRegions: React.Dispatch<React.SetStateAction<GraphRegion[]>>;
  onPromoteNodeToOva: (nodeId: string, ovaId: string, mode: 'new_lesson' | 'append_first') => void;
}

const STATUS_LABELS: Record<ResearchStatus, string> = {
  to_research: 'Por investigar',
  draft: 'En borrador',
  verified: 'Verificado',
  in_ova: 'Integrado en OVA',
};

const TYPE_LABELS: Record<NodeType, string> = {
  markdown: 'Nota Markdown',
  media: 'Video / Recurso',
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
  onPromoteNodeToOva,
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

  const handleCreateNode = (type: NodeType) => {
    const newId = `node-${Date.now()}`;
    const offset = (nodes.length % 5) * 35;
    const newNode: GraphNode = {
      id: newId,
      title:
        type === 'markdown'
          ? 'Nuevo Concepto de Investigación'
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
      content:
        type === 'markdown'
          ? '### Apuntes de Investigación\nDocumenta aquí los hallazgos clave, fórmulas o fragmentos técnicos que luego convertirás en lección del OVA.'
          : type === 'media'
          ? 'Descripción del video, repositorio o documentación oficial de referencia para el aprendiz.'
          : type === 'quiz'
          ? 'Preguntas de autoevaluación para comprobar la apropiación del concepto.'
          : 'Especificación de la evidencia de conocimiento, desempeño o producto requerida por el RAP.',
      mediaUrl: type === 'media' ? 'https://developer.mozilla.org/es/' : undefined,
      mediaKind: type === 'media' ? 'video' : undefined,
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
      tags: ['Investigación', 'SENA'],
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
    onUpdateNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id ? { ...n, ...patch, updatedAt: '2026-11-09' } : n
      )
    );
  };

  const handleUpdateSelectedRegion = (patch: Partial<GraphRegion>) => {
    if (!selectedRegion) return;
    onUpdateRegions((prev) =>
      prev.map((r) => (r.id === selectedRegion.id ? { ...r, ...patch } : r))
    );
  };

  const handleTriggerPromote = (mode: 'new_lesson' | 'append_first') => {
    if (!selectedNode || !targetOvaId) return;
    onPromoteNodeToOva(selectedNode.id, targetOvaId, mode);
    const targetOva = ovas.find((o) => o.id === targetOvaId);
    setPromoteFeedback(
      `Nodo integrado exitosamente en "${targetOva?.title ?? 'OVA'}"`
    );
    setTimeout(() => setPromoteFeedback(null), 3500);
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Nota Markdown
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('media')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Video className="w-3.5 h-3.5 text-sky-600" />
              Video / Recurso
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('quiz')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Cuestionario
            </button>
            <button
              type="button"
              onClick={() => handleCreateNode('activity')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
              Evidencia RAP
            </button>
            <button
              type="button"
              onClick={handleCreateRegion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
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
          className={`flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${
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

            {/* 3. Interactive Draggable Nodes Layer */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isConnectingSource = connectingFromId === node.id;
              const linkedOva = ovas.find((o) => o.id === node.linkedOvaId);

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDownNode(e, node)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${NODE_WIDTH}px`,
                  }}
                  className={`absolute rounded-xl border p-3.5 transition-shadow cursor-grab active:cursor-grabbing ${
                    canvasDark
                      ? 'bg-slate-900/95 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  } ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 border-indigo-500'
                      : 'hover:border-indigo-400'
                  } ${isConnectingSource ? 'ring-2 ring-amber-400' : ''}`}
                >
                  {/* Clean Unboxed Metadata Line (Zero-Pill Rule) */}
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
                        <Video className="w-3.5 h-3.5 text-sky-400 shrink-0" />
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
                    className={`text-xs leading-relaxed line-clamp-2 mb-2.5 ${
                      canvasDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {node.content.replace(/[#*`]/g, '')}
                  </p>

                  {/* Footer Metadata (Unboxed Text with Separators) */}
                  <div
                    className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                      canvasDark
                        ? 'border-slate-800 text-slate-400'
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="truncate">
                      {node.tags.slice(0, 3).join(' · ')}
                    </span>
                    {linkedOva ? (
                      <span className="text-emerald-400 font-mono shrink-0 ml-2">
                        Ficha {linkedOva.fichaCode}
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

      {/* Right Zone: Inspector & Progressive OVA Integration Deck */}
      <aside className="w-full lg:w-[400px] xl:w-[430px] border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/70 flex flex-col h-full overflow-y-auto">
        {selectedNode ? (
          <div className="p-5 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <span>Inspector de Nodo</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedNode.id}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Propiedades y Contenido de Investigación
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
                  Título del Concepto / Nodo
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
                    Tipo de Objeto
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
                    <option value="markdown">Nota Markdown</option>
                    <option value="media">Video / Recurso URL</option>
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

            {/* Markdown / Notes Editor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Desarrollo del Concepto / Notas Markdown
              </label>
              <textarea
                rows={6}
                value={selectedNode.content}
                onChange={(e) =>
                  handleUpdateSelectedNode({ content: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-mono leading-relaxed bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                placeholder="Escribe tus apuntes de investigación en formato Markdown..."
              />
            </div>

            {/* Type-Specific Fields: Media URL */}
            {selectedNode.type === 'media' && (
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Enlace de Video, Documentación o Simulador
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={selectedNode.mediaUrl ?? ''}
                    onChange={(e) =>
                      handleUpdateSelectedNode({ mediaUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                  {selectedNode.mediaUrl && (
                    <a
                      href={selectedNode.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg whitespace-nowrap shrink-0"
                    >
                      Abrir <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

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

            {/* Promote / Link Node to OVA Lesson Section */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  Integrar este Nodo en un OVA SENA
                </h4>
                <span className="text-[11px] text-slate-500">
                  Investigación → Lección
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convierte este nodo en una nueva lección o anéxalo a un OVA activo
                para tus aprendices sin perder el vínculo con el mapa mental.
              </p>

              <select
                value={targetOvaId}
                onChange={(e) => setTargetOvaId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
              >
                {ovas.map((ova) => (
                  <option key={ova.id} value={ova.id}>
                    Ficha {ova.fichaCode} · {ova.title}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerPromote('new_lesson')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  Crear Lección en OVA
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerPromote('append_first')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Anexar a 1ª Lección
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
