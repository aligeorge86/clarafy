/**
 * A small, purpose-built Markdown parser/renderer for Clarafy's translation output.
 *
 * We control the shape of the output via the translation prompt, so we don't need
 * a full CommonMark library — we just need to handle: H1/H2/H3, blockquotes,
 * paragraphs, plus inline **bold** and *italic*. Keeping this in-house avoids
 * pulling in a heavy dependency.
 */

export type InlineSpan =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'italic'; text: string };

export type Block =
  | { kind: 'h1'; spans: InlineSpan[] }
  | { kind: 'h2'; spans: InlineSpan[] }
  | { kind: 'h3'; spans: InlineSpan[] }
  | { kind: 'quote'; spans: InlineSpan[] }
  | { kind: 'p'; spans: InlineSpan[] };

export function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ').trim();
    if (text) blocks.push({ kind: 'p', spans: parseInline(text) });
    paragraph = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      blocks.push({ kind: 'h1', spans: parseInline(line.slice(2).trim()) });
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      blocks.push({ kind: 'h2', spans: parseInline(line.slice(3).trim()) });
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push({ kind: 'h3', spans: parseInline(line.slice(4).trim()) });
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph();
      blocks.push({ kind: 'quote', spans: parseInline(line.slice(2).trim()) });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
}

/**
 * Inline parser: **bold** and *italic*. We don't support nested emphasis —
 * the prompt doesn't produce it.
 */
export function parseInline(text: string): InlineSpan[] {
  const spans: InlineSpan[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      spans.push({ kind: 'text', text: text.slice(lastIndex, m.index) });
    }
    if (m[2] !== undefined) {
      spans.push({ kind: 'bold', text: m[2] });
    } else if (m[3] !== undefined) {
      spans.push({ kind: 'italic', text: m[3] });
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    spans.push({ kind: 'text', text: text.slice(lastIndex) });
  }
  return spans;
}

/**
 * Render blocks to HTML for the /translate preview.
 * We wrap blockquotes with the .plain-english class (so the coral callout
 * styling in globals.css kicks in).
 */
export function renderHtml(blocks: Block[]): string {
  return blocks.map(renderBlock).join('\n');
}

function renderBlock(b: Block): string {
  switch (b.kind) {
    case 'h1':
      return `<h1>${renderSpans(b.spans)}</h1>`;
    case 'h2':
      return `<h2>${renderSpans(b.spans)}</h2>`;
    case 'h3':
      return `<h3>${renderSpans(b.spans)}</h3>`;
    case 'quote':
      return `<div class="plain-english">${renderSpans(b.spans)}</div>`;
    case 'p':
      return `<p>${renderSpans(b.spans)}</p>`;
  }
}

function renderSpans(spans: InlineSpan[]): string {
  return spans.map((s) => {
    const safe = escapeHtml(s.text);
    if (s.kind === 'bold') return `<strong>${safe}</strong>`;
    if (s.kind === 'italic') return `<span class="gloss">${safe}</span>`;
    return safe;
  }).join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
