import { NextRequest, NextResponse } from 'next/server';
import { buildPdfBuffer } from '@/lib/generatePdf';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * Renders Clarafy-translated markdown to a downloadable PDF.
 *
 * The client POSTs the markdown it already has in browser memory — we never
 * store it server-side between the translate call and the PDF call.
 */
export async function POST(req: NextRequest) {
  try {
    const { markdown, filename } = (await req.json()) as {
      markdown?: string;
      filename?: string;
    };
    if (!markdown || markdown.length < 40) {
      return NextResponse.json({ error: 'No translation provided' }, { status: 400 });
    }

    const buffer = await buildPdfBuffer(markdown);
    const safeName = (filename || 'clarafy-translation')
      .replace(/\.(pdf|docx)$/i, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .slice(0, 80);

    // Convert Node Buffer -> Uint8Array -> Blob for NextResponse.
    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}-clarafy.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[clarafy] pdf error:', err);
    const message = err instanceof Error ? err.message : 'PDF generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
