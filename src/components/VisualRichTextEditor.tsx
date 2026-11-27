import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Bold,
  Code,
  Eraser,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Strikethrough,
  Type,
  Underline,
  Video,
  X,
} from 'lucide-react';

interface VisualRichTextEditorProps {
  value: string;
  onChange: (nextHtml: string) => void;
  placeholder?: string;
  onSlashShortcut?: () => void;
}

/**
 * Converts any legacy Markdown text into clean semantic HTML so the user
 * never sees raw Markdown symbols (**, ###, `code`, [text](url "comment")) in the editor.
 */
export function normalizeToRichHtml(raw: string): string {
  if (!raw || !raw.trim()) return '';

  // If it already contains rich HTML tags from our visual editor, return as-is
  if (
    /<(p|div|strong|b|em|i|u|ul|ol|li|h3|h4|span|mark|a|code)\b/i.test(raw)
  ) {
    return raw;
  }

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const formatInline = (text: string): string => {
    let out = escapeHtml(text);

    // Convert [video:Label](url "comment") and [Label](url "comment") into visual interactive chips
    out = out.replace(
      /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      (_match, rawLabel: string, url: string, comment?: string) => {
        const isVideo = rawLabel.trim().toLowerCase().startsWith('video:');
        const cleanLabel = isVideo
          ? rawLabel.trim().slice(6).trim()
          : rawLabel.trim();
        const safeComment = (comment || '').replace(/"/g, '&quot;');
        const safeUrl = url.replace(/"/g, '&quot;');
        const kind = isVideo ? 'video' : 'link';
        const badgeStyle = isVideo
          ? 'background:#fff1f2;color:#be123c;border:1px solid #fecdd3;'
          : 'background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;';
        const prefixIcon = isVideo ? '🎬 ' : '🔗 ';
        return `<a href="${safeUrl}" data-preview-kind="${kind}" data-preview-comment="${safeComment}" style="${badgeStyle}padding:1px 7px;border-radius:6px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:3px;">${prefixIcon}${cleanLabel}</a>`;
      }
    );

    // Inline code `...`
    out = out.replace(
      /`([^`]+)`/g,
      '<code style="background:#f1f5f9;color:#0f172a;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.9em;border:1px solid #e2e8f0;">$1</code>'
    );

    // Bold **...**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *...*
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    return out;
  };

  const lines = raw.split('\n');
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      htmlParts.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      htmlParts.push('</ol>');
      inOl = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeLists();
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      closeLists();
      htmlParts.push(
        `<h4 style="font-weight:700;font-size:0.95rem;color:#1e293b;margin:0.5rem 0 0.25rem;">${formatInline(
          trimmed.slice(5)
        )}</h4>`
      );
      continue;
    }

    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      closeLists();
      const clean = trimmed.replace(/^#{2,3}\s+/, '');
      htmlParts.push(
        `<h3 style="font-weight:700;font-size:1.05rem;color:#0f172a;margin:0.6rem 0 0.3rem;">${formatInline(
          clean
        )}</h3>`
      );
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (inOl) {
        htmlParts.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        htmlParts.push(
          '<ul style="list-style-type:disc;padding-left:1.35rem;margin:0.35rem 0;">'
        );
        inUl = true;
      }
      htmlParts.push(
        `<li style="margin:0.15rem 0;">${formatInline(trimmed.slice(2))}</li>`
      );
      continue;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (inUl) {
        htmlParts.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        htmlParts.push(
          '<ol style="list-style-type:decimal;padding-left:1.35rem;margin:0.35rem 0;">'
        );
        inOl = true;
      }
      htmlParts.push(
        `<li style="margin:0.15rem 0;">${formatInline(numMatch[2])}</li>`
      );
      continue;
    }

    closeLists();
    htmlParts.push(
      `<p style="margin:0.35rem 0;line-height:1.65;">${formatInline(
        trimmed
      )}</p>`
    );
  }

  closeLists();
  return htmlParts.join('');
}

const HIGHLIGHT_COLORS = [
  { label: 'Amarillo', color: '#fef08a' },
  { label: 'Verde', color: '#bbf7d0' },
  { label: 'Cian', color: '#a5f3fc' },
  { label: 'Violeta', color: '#e9d5ff' },
  { label: 'Sin fondo', color: 'transparent' },
];

const TEXT_COLORS = [
  { label: 'Pizarra', color: '#0f172a' },
  { label: 'Índigo', color: '#4338ca' },
  { label: 'Esmeralda', color: '#047857' },
  { label: 'Ámbar', color: '#b45309' },
  { label: 'Coral', color: '#be123c' },
];

export const VisualRichTextEditor: React.FC<VisualRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe aquí el contenido con formato visual...',
  onSlashShortcut,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showHighlightPalette, setShowHighlightPalette] =
    useState<boolean>(false);
  const [showTextColorPalette, setShowTextColorPalette] =
    useState<boolean>(false);

  // Floating Bubble Menu coordinates (relative to wrapperRef)
  const [bubblePos, setBubblePos] = useState<{
    top: number;
    left: number;
    visible: boolean;
  }>({ top: 0, left: 0, visible: false });

  // Visual Link / Video Insertion Dialog state
  const [resourceDialog, setResourceDialog] = useState<{
    kind: 'link' | 'video';
    label: string;
    url: string;
    comment: string;
  } | null>(null);

  // Sync external value into contentEditable only when not typing inside it
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const normalized = normalizeToRichHtml(value);
    if (document.activeElement !== el && el.innerHTML !== normalized) {
      el.innerHTML = normalized;
    }
  }, [value]);

  const saveCurrentSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSavedSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  }, []);

  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const execFormatCommand = (command: string, arg?: string) => {
    restoreSavedSelection();
    document.execCommand(command, false, arg);
    saveCurrentSelection();
    emitChange();
  };

  const handleApplyInlineCode = () => {
    restoreSavedSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const text = sel.toString() || 'código';
    const html = `<code style="background:#f1f5f9;color:#0f172a;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.9em;border:1px solid #e2e8f0;">${text}</code>&nbsp;`;
    document.execCommand('insertHTML', false, html);
    saveCurrentSelection();
    emitChange();
  };

  const handleOpenResourceDialog = (kind: 'link' | 'video') => {
    saveCurrentSelection();
    const sel = window.getSelection();
    const selectedText =
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current?.contains(sel.anchorNode)
        ? sel.toString().trim()
        : '';
    setResourceDialog({
      kind,
      label:
        selectedText ||
        (kind === 'video' ? 'Ver video demostrativo' : 'Documentación oficial'),
      url: 'https://',
      comment:
        kind === 'video'
          ? 'Video explicativo paso a paso seleccionado para esta sección.'
          : 'Recurso técnico recomendado para profundizar este tema.',
    });
    setBubblePos((prev) => ({ ...prev, visible: false }));
  };

  const handleConfirmInsertResource = () => {
    if (!resourceDialog) return;
    restoreSavedSelection();
    const isVideo = resourceDialog.kind === 'video';
    const cleanLabel =
      resourceDialog.label.trim() ||
      (isVideo ? 'Video educativo' : 'Enlace de referencia');
    const cleanUrl = resourceDialog.url.trim() || 'https://developer.mozilla.org';
    const cleanComment = resourceDialog.comment.trim().replace(/"/g, '&quot;');
    const badgeStyle = isVideo
      ? 'background:#fff1f2;color:#be123c;border:1px solid #fecdd3;'
      : 'background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;';
    const icon = isVideo ? '🎬 ' : '🔗 ';

    const html = `&nbsp;<a href="${cleanUrl}" data-preview-kind="${resourceDialog.kind}" data-preview-comment="${cleanComment}" style="${badgeStyle}padding:1px 7px;border-radius:6px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:3px;">${icon}${cleanLabel}</a>&nbsp;`;
    document.execCommand('insertHTML', false, html);
    setResourceDialog(null);
    saveCurrentSelection();
    emitChange();
  };

  // Update Floating Selection Bubble Menu whenever text is highlighted inside this editor
  const updateBubbleMenuPosition = useCallback(() => {
    const el = editorRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    const sel = window.getSelection();
    if (
      !sel ||
      sel.isCollapsed ||
      sel.rangeCount === 0 ||
      !sel.toString().trim()
    ) {
      setBubblePos((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) {
      setBubblePos((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    savedRangeRef.current = range.cloneRange();
    const rangeRect = range.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const top = Math.max(-44, rangeRect.top - wrapperRect.top - 46);
    const left = Math.max(
      8,
      Math.min(
        wrapperRect.width - 280,
        rangeRect.left - wrapperRect.left + rangeRect.width / 2 - 140
      )
    );

    setBubblePos({ top, left, visible: true });
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        updateBubbleMenuPosition();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateBubbleMenuPosition]);

  return (
    <div
      ref={wrapperRef}
      className={`relative rounded-xl border transition-all ${
        isFocused
          ? 'border-indigo-400 bg-white shadow-sm ring-2 ring-indigo-500/10'
          : 'border-slate-200/80 bg-white/80 hover:border-slate-300'
      }`}
    >
      {/* 1. FLOATING BUBBLE TOOLBAR ON TEXT SELECTION (Aparece al sombrear texto) */}
      {bubblePos.visible && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          style={{
            top: `${bubblePos.top}px`,
            left: `${bubblePos.left}px`,
          }}
          className="absolute z-40 flex items-center gap-0.5 px-2 py-1 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in duration-150"
        >
          <button
            type="button"
            onClick={() => execFormatCommand('bold')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-100"
            title="Negrita (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('italic')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-100"
            title="Cursiva (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('underline')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-100"
            title="Subrayado (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('backColor', '#fef08a')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-300"
            title="Resaltar texto en amarillo"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleApplyInlineCode}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-cyan-300"
            title="Formato de código"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => handleOpenResourceDialog('link')}
            className="px-2 py-1 rounded-lg hover:bg-indigo-600 text-[11px] font-semibold text-indigo-200 hover:text-white inline-flex items-center gap-1"
            title="Convertir selección en enlace interactivo"
          >
            <Link2 className="w-3 h-3" />
            <span>Enlace</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenResourceDialog('video')}
            className="px-2 py-1 rounded-lg hover:bg-rose-600 text-[11px] font-semibold text-rose-200 hover:text-white inline-flex items-center gap-1"
            title="Convertir selección en video interactivo"
          >
            <Video className="w-3 h-3" />
            <span>Video</span>
          </button>
        </div>
      )}

      {/* 2. VISUAL FORMATTING TOOLBAR IN ACTIVE BLOCK (Barra de herramientas visual tipo procesador de texto) */}
      <div
        onMouseDown={(e) => e.preventDefault()}
        className="flex flex-wrap items-center justify-between gap-1 px-2.5 py-1.5 bg-slate-50/90 border-b border-slate-200/80 rounded-t-xl text-xs"
      >
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Paragraph / Heading size selector */}
          <button
            type="button"
            onClick={() => execFormatCommand('formatBlock', 'P')}
            className="px-1.5 py-1 rounded hover:bg-slate-200/70 text-[11px] font-semibold text-slate-700"
            title="Párrafo normal"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('formatBlock', 'H3')}
            className="px-1.5 py-1 rounded hover:bg-slate-200/70 text-[11px] font-bold text-slate-900 inline-flex items-center gap-0.5"
            title="Título interno"
          >
            <Type className="w-3 h-3" />
            <span>Título</span>
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1" />

          {/* Bold, Italic, Underline, Strikethrough, Code */}
          <button
            type="button"
            onClick={() => execFormatCommand('bold')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Negrita (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('italic')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Cursiva (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('underline')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Subrayado (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('strikeThrough')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Tachado"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleApplyInlineCode}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Resaltar como término de código"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          {/* Highlight Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPalette((v) => !v);
                setShowTextColorPalette(false);
              }}
              className="p-1.5 rounded hover:bg-amber-100 text-amber-700"
              title="Color de resaltado (Marcatexto)"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
            {showHighlightPalette && (
              <div className="absolute top-8 left-0 z-30 p-1.5 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center gap-1">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => {
                      execFormatCommand('backColor', h.color);
                      setShowHighlightPalette(false);
                    }}
                    style={{
                      backgroundColor:
                        h.color === 'transparent' ? '#ffffff' : h.color,
                    }}
                    className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                    title={`Resaltar: ${h.label}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Text Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTextColorPalette((v) => !v);
                setShowHighlightPalette(false);
              }}
              className="p-1.5 rounded hover:bg-indigo-50 text-indigo-700"
              title="Color de letra"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
            {showTextColorPalette && (
              <div className="absolute top-8 left-0 z-30 p-1.5 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center gap-1">
                {TEXT_COLORS.map((tc) => (
                  <button
                    key={tc.label}
                    type="button"
                    onClick={() => {
                      execFormatCommand('foreColor', tc.color);
                      setShowTextColorPalette(false);
                    }}
                    style={{ backgroundColor: tc.color }}
                    className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                    title={`Color: ${tc.label}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-slate-300 mx-1" />

          {/* Bullet & Numbered Lists */}
          <button
            type="button"
            onClick={() => execFormatCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Lista con viñetas"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700"
            title="Lista numerada"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Alignment */}
          <button
            type="button"
            onClick={() => execFormatCommand('justifyLeft')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700 hidden sm:inline-flex"
            title="Alinear a la izquierda"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('justifyCenter')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700 hidden sm:inline-flex"
            title="Centrar texto"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormatCommand('justifyFull')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-700 hidden sm:inline-flex"
            title="Justificar texto"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execFormatCommand('removeFormat')}
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-500"
            title="Limpiar formato del texto seleccionado"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Interactive Link & Video Insertion Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleOpenResourceDialog('link')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors"
          >
            <Link2 className="w-3 h-3" />
            <span>+ Enlace</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenResourceDialog('video')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors"
          >
            <Video className="w-3 h-3" />
            <span>+ Video</span>
          </button>
        </div>
      </div>

      {/* 3. VISUAL RESOURCE INSERTION POPOVER (Zero Markdown syntax) */}
      {resourceDialog && (
        <div className="p-3 bg-slate-100 border-b border-slate-300 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span>
              {resourceDialog.kind === 'video'
                ? '🎬 Insertar Botón de Video con Tarjeta Emergente'
                : '🔗 Insertar Enlace con Tarjeta Emergente'}
            </span>
            <button
              type="button"
              onClick={() => setResourceDialog(null)}
              className="p-0.5 text-slate-500 hover:text-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={resourceDialog.label}
              onChange={(e) =>
                setResourceDialog({ ...resourceDialog, label: e.target.value })
              }
              placeholder="Texto visible del botón..."
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="url"
              value={resourceDialog.url}
              onChange={(e) =>
                setResourceDialog({ ...resourceDialog, url: e.target.value })
              }
              placeholder="https://..."
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={resourceDialog.comment}
              onChange={(e) =>
                setResourceDialog({
                  ...resourceDialog,
                  comment: e.target.value,
                })
              }
              placeholder="Comentario explicativo al pasar el cursor..."
              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleConfirmInsertResource}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shrink-0"
            >
              Insertar en el Texto
            </button>
          </div>
        </div>
      )}

      {/* 4. WYSIWYG CONTENTEDITABLE CANVAS (100% Free of Markdown Syntax) */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
          saveCurrentSelection();
        }}
        onBlur={() => {
          setIsFocused(false);
          setShowHighlightPalette(false);
          setShowTextColorPalette(false);
          window.setTimeout(() => {
            setBubblePos((prev) =>
              prev.visible ? { ...prev, visible: false } : prev
            );
          }, 160);
          emitChange();
        }}
        onInput={() => {
          saveCurrentSelection();
          if (
            onSlashShortcut &&
            editorRef.current?.innerText.trim() === '/'
          ) {
            onSlashShortcut();
          }
          emitChange();
        }}
        onMouseUp={() => {
          saveCurrentSelection();
          updateBubbleMenuPosition();
        }}
        onKeyUp={() => {
          saveCurrentSelection();
          updateBubbleMenuPosition();
        }}
        className="min-h-[84px] px-3.5 py-2.5 text-sm text-slate-800 leading-relaxed focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:text-sm [&_h4]:font-bold [&_p]:my-1 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
      />
    </div>
  );
};
