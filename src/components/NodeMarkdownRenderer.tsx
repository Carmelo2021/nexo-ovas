import React from 'react';

interface NodeMarkdownRendererProps {
  content: string;
  dark: boolean;
  onToggleCheckbox?: (lineIndex: number) => void;
}

function renderInlineFormatting(text: string, dark: boolean): React.ReactNode[] {
  // Split by inline code (`...`) and bold (**...**)
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={i}
          className={`px-1 py-0.5 rounded font-mono text-[11px] ${
            dark
              ? 'bg-slate-800 text-indigo-300 border border-slate-700'
              : 'bg-slate-100 text-indigo-700 border border-slate-200'
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong
          key={i}
          className={dark ? 'font-semibold text-white' : 'font-semibold text-slate-900'}
        >
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={i} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={i}>{token}</React.Fragment>;
  });
}

export function extractYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = parsed.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{6,20}$/.test(v)) {
        return `https://www.youtube.com/embed/${v}`;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/')[2];
        if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
          return `https://www.youtube.com/embed/${id}`;
        }
      }
    }
    if (host === 'youtu.be') {
      const id = parsed.pathname.replace('/', '').split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export const NodeMarkdownRenderer: React.FC<NodeMarkdownRendererProps> = ({
  content,
  dark,
  onToggleCheckbox,
}) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h6
              key={idx}
              className={`text-xs font-bold pt-1 ${
                dark ? 'text-indigo-300' : 'text-indigo-800'
              }`}
            >
              {renderInlineFormatting(trimmed.slice(5), dark)}
            </h6>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h5
              key={idx}
              className={`text-xs font-bold pt-1.5 pb-0.5 border-b ${
                dark
                  ? 'text-slate-100 border-slate-800'
                  : 'text-slate-900 border-slate-200'
              }`}
            >
              {renderInlineFormatting(trimmed.slice(4), dark)}
            </h5>
          );
        }

        // Interactive Markdown checklist item
        const checkboxMatch = trimmed.match(/^-\s*\[([ xX])\]\s*(.*)$/);
        if (checkboxMatch) {
          const checked = checkboxMatch[1].toLowerCase() === 'x';
          const label = checkboxMatch[2];
          return (
            <label
              key={idx}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="flex items-start gap-2 cursor-pointer select-text"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleCheckbox?.(idx)}
                className="mt-0.5 rounded border-slate-500 accent-indigo-500 cursor-pointer"
              />
              <span
                className={`${
                  checked
                    ? dark
                      ? 'line-through text-slate-500'
                      : 'line-through text-slate-400'
                    : dark
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                {renderInlineFormatting(label, dark)}
              </span>
            </label>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span
                className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  dark ? 'bg-indigo-400/70' : 'bg-indigo-500/70'
                }`}
              />
              <span className={dark ? 'text-slate-300' : 'text-slate-700'}>
                {renderInlineFormatting(trimmed.slice(2), dark)}
              </span>
            </div>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span
                className={`font-mono text-[11px] font-semibold shrink-0 ${
                  dark ? 'text-indigo-400' : 'text-indigo-600'
                }`}
              >
                {numberedMatch[1]}.
              </span>
              <span className={dark ? 'text-slate-300' : 'text-slate-700'}>
                {renderInlineFormatting(numberedMatch[2], dark)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className={dark ? 'text-slate-300' : 'text-slate-700'}>
            {renderInlineFormatting(trimmed, dark)}
          </p>
        );
      })}
    </div>
  );
};
