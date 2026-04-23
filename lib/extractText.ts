/**
 * Document ingestion. Zero-retention: the incoming buffer lives only in memory.
 *
 * Supported formats:
 *   - application/pdf   → extracted via unpdf (serverless-friendly wrapper over pdfjs-dist)
 *   - application/vnd.openxmlformats-officedocument.wordprocessingml.document (.docx)
 *                        → extracted via mammoth
 *
 * Returns a plain text string, preserving paragraph boundaries with \n\n.
 *
 * Why unpdf? pdfjs-dist directly spawns a worker thread and needs GlobalWorkerOptions.workerSrc
 * to point at its companion worker file. On Vercel serverless, tracing that file in correctly
 * is flaky. unpdf bundles a serverless-safe build of pdfjs-dist and handles workers for us.
 */

import mammoth from 'mammoth';

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
  // unpdf is designed for Node + serverless. It returns an array of per-page
  // strings when mergePages is false; we want one big string with page breaks.
  const { extractText: unpdfExtractText, getDocumentProxy } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await unpdfExtractText(pdf, { mergePages: true });
  return normalise(text);
}

function normalise(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
