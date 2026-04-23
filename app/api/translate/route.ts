import { NextRequest, NextResponse } from 'next/server';
import { extractText, sniffMime } from '@/lib/extractText';
import { translateDocument } from '@/lib/anthropic';

export const runtime = 'nodejs';
// Translation can take a minute on long docs; raise the function timeout.
export const maxDuration = 300;

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB — generous for a legal doc

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Max size is 15 MB.' },
        { status: 413 }
      );
    }

    const mime = sniffMime(file.name, file.type);
    if (!mime) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or .docx document.' },
        { status: 415 }
      );
    }

    // Everything below stays in memory. Zero-retention architecture:
    // we never write the file, the extracted text, or the translation to disk.
    const buf = await file.arrayBuffer();
    const legalText = await extractText(buf, mime);

    if (!legalText || legalText.length < 80) {
      return NextResponse.json(
        {
          error:
            "We couldn't find any readable text in that document. If it's a scanned PDF, try running it through OCR first.",
        },
        { status: 422 }
      );
    }

    const translatedMarkdown = await translateDocument(legalText);

    return NextResponse.json(
      {
        translatedMarkdown,
        originalFilename: file.name,
        charCount: legalText.length,
      },
      {
        headers: {
          // Belt-and-braces: ask browsers and CDNs not to cache the response.
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed';
    // eslint-disable-next-line no-console
    console.error('[clarafy] translate error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
