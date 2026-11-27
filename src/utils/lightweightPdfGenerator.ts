import { InstructorCredentials, Lesson, LessonBlock, OVA } from '../types/ova';
import { ensureLessonBlocks } from '../components/NotionLessonBlocks';

/**
 * MicroPDF Libre Engine — Lightweight, zero-dependency ISO 32000-1 (PDF 1.4) binary generator.
 * Generates a real downloadable multi-page A4 PDF file directly in the browser or Android WebView
 * without invoking window.print(). Supports WinAnsi / Latin-1 Spanish characters.
 */

function stripHtmlAndMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr|blockquote)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '$1 ($2)')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Converts a UTF-8 JS string to a PDF literal string escaped in WinAnsi (CP1252 / Latin-1) octal/char format.
 */
function toPdfWinAnsiLiteral(text: string): string {
  const sanitized = text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '\xb7') // Middle dot / bullet in Latin-1
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');

  let out = '(';
  for (let i = 0; i < sanitized.length; i++) {
    const code = sanitized.charCodeAt(i);
    if (code === 0x28 || code === 0x29 || code === 0x5c) {
      out += '\\' + sanitized[i];
    } else if (code >= 0x20 && code <= 0x7e) {
      out += sanitized[i];
    } else if (code >= 0xa0 && code <= 0xff) {
      out += '\\' + code.toString(8).padStart(3, '0');
    } else {
      out += ' ';
    }
  }
  out += ')';
  return out;
}

function wrapTextToLines(text: string, maxCharsPerLine: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      lines.push('');
      continue;
    }
    const words = trimmed.split(/\s+/);
    let currentLine = '';
    for (const word of words) {
      if (!currentLine) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= maxCharsPerLine) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

interface PdfPageBuilder {
  commands: string[];
  cursorY: number;
}

const PAGE_W = 595.28; // A4 width in pt
const PAGE_H = 841.89; // A4 height in pt
const MARGIN_X = 46;
const TOP_Y = PAGE_H - 52;
const BOTTOM_Y = 54;

export function generateAndDownloadOvaPdf(options: {
  ova: OVA;
  instructor: InstructorCredentials;
  includeQuizAnswers?: boolean;
}): { fileName: string; pageCount: number } {
  const { ova, instructor, includeQuizAnswers = false } = options;

  const pages: PdfPageBuilder[] = [];

  const startNewPage = (): PdfPageBuilder => {
    const page: PdfPageBuilder = {
      commands: [],
      cursorY: TOP_Y,
    };
    pages.push(page);

    // Subtle running header on pages 2+
    if (pages.length > 1) {
      page.commands.push(
        '0.45 0.50 0.58 rg',
        'BT /F1 8.5 Tf',
        `${MARGIN_X} ${PAGE_H - 30} Td`,
        `${toPdfWinAnsiLiteral(`SENA · Guía de Estudio OVA: ${ova.code} · Ficha ${ova.fichaCode} — ${ova.title}`)} Tj`,
        'ET',
        '0.82 0.85 0.90 RG 0.6 w',
        `${MARGIN_X} ${PAGE_H - 36} m ${PAGE_W - MARGIN_X} ${PAGE_H - 36} l S`
      );
      page.cursorY = PAGE_H - 56;
    }
    return page;
  };

  let currentPage = startNewPage();

  const ensureVerticalSpace = (neededPt: number) => {
    if (currentPage.cursorY - neededPt < BOTTOM_Y) {
      currentPage = startNewPage();
    }
  };

  const writeTextLines = (
    lines: string[],
    opts: {
      font: 'F1' | 'F2' | 'F3'; // F1: Helvetica, F2: Helvetica-Bold, F3: Courier
      size: number;
      lineHeight: number;
      colorRgb?: [number, number, number];
      indentX?: number;
    }
  ) => {
    const [r, g, b] = opts.colorRgb ?? [0.08, 0.11, 0.18];
    const x = MARGIN_X + (opts.indentX ?? 0);

    for (const line of lines) {
      if (!line) {
        currentPage.cursorY -= opts.lineHeight * 0.55;
        continue;
      }
      ensureVerticalSpace(opts.lineHeight + 2);
      currentPage.commands.push(
        `${r} ${g} ${b} rg`,
        `BT /${opts.font} ${opts.size} Tf`,
        `${x} ${currentPage.cursorY.toFixed(2)} Td`,
        `${toPdfWinAnsiLiteral(line)} Tj`,
        'ET'
      );
      currentPage.cursorY -= opts.lineHeight;
    }
  };

  // --- 1. COVER / INSTITUTIONAL SENA HEADER BANNER ---
  const bannerH = 74;
  const bannerY = currentPage.cursorY - bannerH + 14;
  currentPage.commands.push(
    '0.07 0.10 0.21 rg',
    `${MARGIN_X} ${bannerY.toFixed(2)} ${PAGE_W - MARGIN_X * 2} ${bannerH} re f`,
    '0.22 0.74 0.97 rg',
    `${MARGIN_X} ${bannerY.toFixed(2)} 5 ${bannerH} re f`,
    '0.65 0.92 0.99 rg',
    'BT /F2 8.5 Tf',
    `${MARGIN_X + 16} ${(bannerY + bannerH - 20).toFixed(2)} Td`,
    `${toPdfWinAnsiLiteral(`SERVICIO NACIONAL DE APRENDIZAJE SENA · GUÍA OFICIAL DE ESTUDIO OVA (${ova.code})`)} Tj`,
    'ET',
    '1 1 1 rg',
    'BT /F2 14 Tf',
    `${MARGIN_X + 16} ${(bannerY + bannerH - 40).toFixed(2)} Td`,
    `${toPdfWinAnsiLiteral(ova.title.slice(0, 68))} Tj`,
    'ET',
    '0.80 0.85 0.93 rg',
    'BT /F1 9 Tf',
    `${MARGIN_X + 16} ${(bannerY + 14).toFixed(2)} Td`,
    `${toPdfWinAnsiLiteral(`Ficha: ${ova.fichaCode} · Duración: ${ova.estimatedHours} horas · Instructor: ${instructor.instructorName}`)} Tj`,
    'ET'
  );
  currentPage.cursorY = bannerY - 18;

  // Curricular Metadata Box
  const metaLines = [
    `Programa: ${ova.programName}`,
    `Competencia: ${ova.competence || 'Desarrollo de Software'}`,
    `Resultado de Aprendizaje (RAP): ${ova.learningOutcome || ova.description}`,
    `Centro de Formación: ${instructor.centerName} (${instructor.regionalName})`,
  ];
  for (const mLine of metaLines) {
    const wrapped = wrapTextToLines(mLine, 88);
    writeTextLines(wrapped, {
      font: 'F1',
      size: 9.5,
      lineHeight: 13.5,
      colorRgb: [0.2, 0.25, 0.33],
    });
  }

  currentPage.cursorY -= 6;
  writeTextLines(wrapTextToLines(ova.description, 86), {
    font: 'F1',
    size: 10,
    lineHeight: 14,
    colorRgb: [0.1, 0.14, 0.22],
  });
  currentPage.cursorY -= 12;

  // --- 2. ITERATE OVER VISIBLE LESSONS & SECTIONS ---
  const visibleLessons: Lesson[] = ova.lessons.filter(
    (l) => !l.hiddenFromPublic
  );

  visibleLessons.forEach((lesson) => {
    ensureVerticalSpace(64);

    // Lesson Header Bar
    const lBarH = 26;
    const lBarY = currentPage.cursorY - lBarH + 8;
    currentPage.commands.push(
      '0.93 0.95 0.99 rg',
      `${MARGIN_X} ${lBarY.toFixed(2)} ${PAGE_W - MARGIN_X * 2} ${lBarH} re f`,
      '0.26 0.22 0.79 rg',
      `${MARGIN_X} ${lBarY.toFixed(2)} 4 ${lBarH} re f`
    );
    currentPage.cursorY = lBarY + 8;
    writeTextLines(
      [
        `LECCIÓN 0${lesson.order}: ${lesson.title.toUpperCase()} (${lesson.durationMinutes} MIN)`,
      ],
      {
        font: 'F2',
        size: 11,
        lineHeight: 16,
        colorRgb: [0.12, 0.16, 0.38],
        indentX: 12,
      }
    );
    currentPage.cursorY -= 4;

    if (lesson.summary) {
      writeTextLines(wrapTextToLines(lesson.summary, 86), {
        font: 'F1',
        size: 9.5,
        lineHeight: 13.5,
        colorRgb: [0.32, 0.38, 0.48],
      });
      currentPage.cursorY -= 6;
    }

    const hiddenSections = new Set(lesson.hiddenSections ?? []);
    const sectionOrder =
      lesson.sectionOrder && lesson.sectionOrder.length > 0
        ? lesson.sectionOrder
        : (['blocks', 'activity', 'quiz'] as const);

    for (const secKey of sectionOrder) {
      if (hiddenSections.has(secKey)) continue;

      if (secKey === 'blocks') {
        const rawBlocks = ensureLessonBlocks(lesson);
        const visibleBlocks: LessonBlock[] = [];
        let sectionHidden = false;
        for (const b of rawBlocks) {
          if (b.type === 'heading') {
            sectionHidden = Boolean(b.hiddenFromPublic);
          }
          if (sectionHidden || b.hiddenFromPublic) continue;
          visibleBlocks.push(b);
        }

        for (const blk of visibleBlocks) {
          const cleanContent = stripHtmlAndMarkdown(blk.content);

          if (blk.type === 'heading') {
            ensureVerticalSpace(28);
            currentPage.cursorY -= 4;
            writeTextLines(
              wrapTextToLines(
                stripHtmlAndMarkdown(blk.title || blk.content),
                78
              ),
              {
                font: 'F2',
                size: 11,
                lineHeight: 15,
                colorRgb: [0.18, 0.22, 0.55],
              }
            );
            currentPage.cursorY -= 2;
          } else if (blk.type === 'quote') {
            ensureVerticalSpace(38);
            const qTitle = blk.title ? `Referencia: ${blk.title}` : 'Cita Bibliográfica';
            const qAuthor = blk.quoteAuthor ? ` — ${blk.quoteAuthor}` : '';
            writeTextLines(wrapTextToLines(`${qTitle}${qAuthor}`, 84), {
              font: 'F2',
              size: 9.5,
              lineHeight: 13,
              colorRgb: [0.55, 0.32, 0.05],
              indentX: 10,
            });
            writeTextLines(wrapTextToLines(`"${cleanContent}"`, 82), {
              font: 'F1',
              size: 9.5,
              lineHeight: 13.5,
              colorRgb: [0.25, 0.2, 0.12],
              indentX: 14,
            });
            currentPage.cursorY -= 5;
          } else if (blk.type === 'code') {
            ensureVerticalSpace(36);
            if (blk.title) {
              writeTextLines([`Código (${blk.codeLanguage || 'JS'}): ${blk.title}`], {
                font: 'F2',
                size: 9,
                lineHeight: 12.5,
                colorRgb: [0.15, 0.25, 0.4],
                indentX: 8,
              });
            }
            const codeLines = blk.content.split('\n').slice(0, 28);
            for (const cLine of codeLines) {
              writeTextLines(wrapTextToLines(cLine || ' ', 82), {
                font: 'F3',
                size: 8.5,
                lineHeight: 11.5,
                colorRgb: [0.1, 0.28, 0.22],
                indentX: 14,
              });
            }
            currentPage.cursorY -= 5;
          } else if (blk.type === 'exercise') {
            ensureVerticalSpace(36);
            const badge =
              blk.exerciseCategory === 'corto'
                ? 'Ejercicio Corto'
                : 'Ejercicio de Desarrollo';
            writeTextLines(
              wrapTextToLines(
                `[${badge} · ${blk.exerciseDifficulty || 'Práctico'}] ${blk.title || ''}`,
                82
              ),
              {
                font: 'F2',
                size: 9.5,
                lineHeight: 13.5,
                colorRgb: [0.06, 0.42, 0.32],
                indentX: 6,
              }
            );
            writeTextLines(wrapTextToLines(cleanContent, 84), {
              font: 'F1',
              size: 9.5,
              lineHeight: 13.5,
              colorRgb: [0.15, 0.2, 0.28],
              indentX: 10,
            });
            currentPage.cursorY -= 5;
          } else {
            if (blk.title && blk.type !== 'text') {
              writeTextLines(wrapTextToLines(blk.title, 82), {
                font: 'F2',
                size: 10,
                lineHeight: 14,
                colorRgb: [0.12, 0.16, 0.26],
              });
            }
            if (cleanContent) {
              writeTextLines(wrapTextToLines(cleanContent, 86), {
                font: 'F1',
                size: 9.8,
                lineHeight: 14,
                colorRgb: [0.14, 0.18, 0.25],
              });
            }
            currentPage.cursorY -= 4;
          }
        }
      }

      if (secKey === 'activity' && lesson.activity) {
        ensureVerticalSpace(52);
        currentPage.cursorY -= 4;
        writeTextLines(
          [
            `EVIDENCIA SENA (${lesson.activity.evidenceType}): ${lesson.activity.evidenceCode} — ${lesson.activity.title}`,
          ],
          {
            font: 'F2',
            size: 10,
            lineHeight: 14,
            colorRgb: [0.6, 0.24, 0.08],
          }
        );
        writeTextLines(wrapTextToLines(lesson.activity.instructions, 84), {
          font: 'F1',
          size: 9.5,
          lineHeight: 13.5,
          colorRgb: [0.2, 0.24, 0.3],
          indentX: 8,
        });
        writeTextLines(
          [
            `Fecha límite: ${lesson.activity.dueDate} · Entregable: ${lesson.activity.deliverableFormat}`,
          ],
          {
            font: 'F2',
            size: 9,
            lineHeight: 13,
            colorRgb: [0.35, 0.4, 0.48],
            indentX: 8,
          }
        );
        currentPage.cursorY -= 8;
      }

      if (secKey === 'quiz' && lesson.quiz.length > 0) {
        ensureVerticalSpace(48);
        currentPage.cursorY -= 4;
        writeTextLines(
          [`CUESTIONARIO DE AUTOEVALUACIÓN — LECCIÓN 0${lesson.order}`],
          {
            font: 'F2',
            size: 10,
            lineHeight: 14,
            colorRgb: [0.15, 0.22, 0.55],
          }
        );
        lesson.quiz.forEach((q, qIdx) => {
          ensureVerticalSpace(36);
          writeTextLines(wrapTextToLines(`${qIdx + 1}. ${q.question}`, 84), {
            font: 'F2',
            size: 9.5,
            lineHeight: 13.5,
            colorRgb: [0.1, 0.14, 0.22],
            indentX: 6,
          });
          q.options.forEach((opt, optIdx) => {
            const isCorrect = includeQuizAnswers && q.correctIndex === optIdx;
            const suffix = isCorrect ? '  [RESPUESTA CORRECTA]' : '';
            writeTextLines(
              wrapTextToLines(
                `${String.fromCharCode(65 + optIdx)}) ${opt}${suffix}`,
                80
              ),
              {
                font: isCorrect ? 'F2' : 'F1',
                size: 9,
                lineHeight: 12.5,
                colorRgb: isCorrect ? [0.04, 0.48, 0.32] : [0.24, 0.28, 0.36],
                indentX: 16,
              }
            );
          });
          currentPage.cursorY -= 3;
        });
      }
    }

    currentPage.cursorY -= 12;
  });

  // Add Footer Page Numbers to every page
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.commands.push(
      '0.82 0.85 0.90 RG 0.6 w',
      `${MARGIN_X} 38 m ${PAGE_W - MARGIN_X} 38 l S`,
      '0.45 0.50 0.58 rg',
      'BT /F1 8.5 Tf',
      `${MARGIN_X} 24 Td`,
      `${toPdfWinAnsiLiteral(`NexoOVA Studio · Formación Profesional Integral SENA · Página ${idx + 1} de ${totalPages}`)} Tj`,
      'ET'
    );
  });

  // --- 3. ASSEMBLE ISO 32000-1 PDF 1.4 OBJECTS & XREF TABLE ---
  // Object IDs:
  // 1: Catalog
  // 2: Pages
  // 3: Font F1 (Helvetica)
  // 4: Font F2 (Helvetica-Bold)
  // 5: Font F3 (Courier)
  // 6 + i*2: Page i
  // 7 + i*2: Content Stream for Page i
  const objects: string[] = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  const pageRefs = pages.map((_, idx) => `${6 + idx * 2} 0 R`).join(' ');
  objects[2] = `<< /Type /Pages /Kids [ ${pageRefs} ] /Count ${pages.length} >>`;
  objects[3] =
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] =
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  objects[5] =
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>';

  pages.forEach((p, idx) => {
    const pageObjId = 6 + idx * 2;
    const streamObjId = 7 + idx * 2;
    const streamBody = p.commands.join('\n');
    objects[pageObjId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> ` +
      `/Contents ${streamObjId} 0 R >>`;
    objects[streamObjId] =
      `<< /Length ${streamBody.length} >>\nstream\n${streamBody}\nendstream`;
  });

  let pdfString = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (let id = 1; id < objects.length; id++) {
    offsets[id] = pdfString.length;
    pdfString += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = pdfString.length;
  pdfString += `xref\n0 ${objects.length}\n`;
  pdfString += '0000000000 65535 f \n';
  for (let id = 1; id < objects.length; id++) {
    pdfString += `${offsets[id].toString().padStart(10, '0')} 00000 n \n`;
  }

  pdfString +=
    `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\n` +
    `startxref\n${xrefOffset}\n%%EOF`;

  // Encode to Latin-1 / WinAnsi bytes (1:1 char-to-byte mapping so xref offsets stay exact)
  const bytes = new Uint8Array(pdfString.length);
  for (let i = 0; i < pdfString.length; i++) {
    bytes[i] = pdfString.charCodeAt(i) & 0xff;
  }

  const fileName = `Guia_Estudio_SENA_${ova.code}_Ficha_${ova.fichaCode}.pdf`;
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 3000);

  return { fileName, pageCount: pages.length };
}
