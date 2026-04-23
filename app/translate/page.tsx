'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import UploadBox from '@/components/UploadBox';
import Disclaimer from '@/components/Disclaimer';
import { parseMarkdown, renderHtml } from '@/lib/markdown';

type Stage = 'idle' | 'uploading' | 'translating' | 'done' | 'error';

export default function TranslatePage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  async function handleFile(file: File) {
    setStage('uploading');
    setError(null);
    setFilename(file.name);

    try {
      const form = new FormData();
      form.append('file', file);

      setStage('translating');
      const resp = await fetch('/api/translate', {
        method: 'POST',
        body: form,
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || 'Something went wrong translating your document.');
      }
      setMarkdown(data.translatedMarkdown as string);
      setStage('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Translation failed');
      setStage('error');
    }
  }

  async function handleDownloadPdf() {
    if (!markdown) return;
    setDownloadingPdf(true);
    try {
      const resp = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown, filename }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || 'PDF generation failed');
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(filename || 'translation').replace(/\.(pdf|docx)$/i, '')}-clarafy.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'PDF download failed');
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[860px] px-6 pb-24 pt-12">
        <header className="mb-10 text-center">
          <div className="mb-5 inline-block rounded-[20px] border border-coral-border bg-coral-soft px-4 py-1.5 text-[0.75rem] font-medium uppercase tracking-[2px] text-coral">
            Translate a document
          </div>
          <h1 className="mb-2.5 font-display text-[2.4rem] leading-[1.12] tracking-tighter text-ink">
            Drop it in.{' '}
            <em className="not-italic brand-italic">We&apos;ll handle the jargon.</em>
          </h1>
          <p className="mx-auto max-w-[520px] text-[0.95rem] font-light leading-[1.7] text-muted">
            PDF or Word. Translated clause-by-clause, same structure, plain English. Nothing is
            stored — your document stays in memory and is discarded the moment you leave this page.
          </p>
        </header>

        {stage === 'idle' && (
          <>
            <UploadBox onFile={handleFile} />
            <Disclaimer />
          </>
        )}

        {(stage === 'uploading' || stage === 'translating') && (
          <div className="mx-auto max-w-[600px] rounded-[20px] border-2 border-dashed border-crust bg-white px-10 py-16 text-center">
            <div className="mx-auto mb-6 clarafy-spinner" aria-hidden />
            <div className="mb-2 font-display text-[1.15rem] text-ink">
              {stage === 'uploading' ? 'Reading your document…' : 'Translating into plain English…'}
            </div>
            <div className="text-[0.85rem] font-light text-muted">
              This usually takes 20–60 seconds depending on length. Nothing is saved — your
              document lives only in memory for this session.
            </div>
          </div>
        )}

        {stage === 'error' && (
          <div className="mx-auto max-w-[600px] rounded-[14px] border border-coral-border bg-coral-soft px-6 py-5">
            <div className="mb-1 font-semibold text-ink">Something went wrong.</div>
            <div className="mb-4 text-[0.9rem] text-muted">{error}</div>
            <button
              onClick={() => setStage('idle')}
              className="rounded-lg bg-coral px-5 py-2 text-[0.85rem] font-semibold text-white shadow-coral"
            >
              Try another document
            </button>
          </div>
        )}

        {stage === 'done' && (
          <>
            <div className="mx-auto mb-8 flex max-w-[720px] flex-col items-center justify-between gap-3 rounded-2xl border border-rule bg-white px-6 py-4 md:flex-row">
              <div>
                <div className="font-display text-[1rem] text-ink">
                  Translated · <span className="text-muted">{filename}</span>
                </div>
                <div className="text-[0.78rem] font-light text-muted">
                  Scroll to read. Download the PDF to keep a copy — we don&apos;t store it.
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="rounded-lg bg-coral px-5 py-2.5 text-[0.85rem] font-semibold text-white shadow-coral-lg disabled:opacity-60"
                >
                  {downloadingPdf ? 'Preparing PDF…' : 'Download PDF'}
                </button>
                <button
                  onClick={() => {
                    setStage('idle');
                    setMarkdown('');
                    setFilename('');
                  }}
                  className="rounded-lg border border-rule bg-white px-5 py-2.5 text-[0.85rem] font-medium text-ink hover:border-coral"
                >
                  New document
                </button>
              </div>
            </div>

            <article
              className="doc-prose mx-auto max-w-[720px] rounded-2xl border border-rule bg-white px-10 py-10"
              dangerouslySetInnerHTML={{ __html: renderHtml(parseMarkdown(markdown)) }}
            />
            <Disclaimer className="mt-6" />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
