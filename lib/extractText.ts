/**
 * Document ingestion. Zero-retention: the incoming buffer lives only in memory.
 *
 * Supported formats:
 *   - application/pdf  → extracted via pdfjs-dist (pure JS, no system canvas)
 *   - application/vnd.openxmlformats-officedocument.wordprocessingml.document (.docx)
 *                       → extracted via mammoth
 *
 * Returns a plain text string, preserving paragraph boundaries with \n\n.
 */

import mammoth from 'mammoth';

// Minimal structural type for the pdfjs-dist legacy API we use. The legacy
// ESM bundle doesn't export types, so we model the shape locally.
type PdfTextItem = { str?: string; hasEOL?: boolean };
type PdfPage = {
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
};
type PdfDocumentLike = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

export type SupportedMime =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function sniffMime(filename: string, declared?: string): SupportedMime | null {
  if (declared === 'application/pdf') return 'application/pdf';
  if (
    declared ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return null;
}

export async function extractText(
  buffer: ArrayBuffer,
  mime: SupportedMime
): Promise<string> {
  if (mime === 'application/pdf') {
    return extractPdfText(buffer);
  }
  return extractDocxText(buffer);
}

async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const nodeBuffer = Buffer.from(buffer);
  const result = await mammoth.extractRawText({ buffer: nodeBuffer });
  return normalise(result.value);
}

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  // pdfjs-dist is ESM; we load the legacy build which works in Node without canvas.
  // The legacy bundle ships without TS types, hence the dynamic-import typing.
  const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as unknown as {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (opts: Record<string, unknown>) => { promise: Promise<PdfDocumentLike> };
  };

  // Disable the worker in Node — we run everything on the main thread.
  pdfjs.GlobalWorkerOptions.workerSrc = '';

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    isEvalSupported: false,
    useSystemFonts: false,
  }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it: PdfTextItem) => it.str ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    pages.push(pageText);
  }

  await doc.destroy();
  return normalise(pages.join('\n\n'));
}

function normalise(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
