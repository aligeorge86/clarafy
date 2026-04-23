/**
 * Clarafy smoke test — runs the three things we can verify without calling Claude:
 *   1. DOCX text extraction (mammoth)
 *   2. Markdown parsing
 *   3. PDF generation (@react-pdf/renderer)
 *
 * Run:   node scripts/smoke-test.mjs path/to/reference.docx
 * Usage: put any .docx at the provided path and check you get a PDF at /tmp/clarafy-smoke.pdf.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mammoth from 'mammoth';
import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font, renderToBuffer,
} from '@react-pdf/renderer';

const docxPath = resolve(process.argv[2] || '');
if (!process.argv[2]) {
  console.error('Usage: node scripts/smoke-test.mjs <path-to-docx>');
  process.exit(1);
}

// 1) Extract
const buf = readFileSync(docxPath);
const { value: text } = await mammoth.extractRawText({ buffer: buf });
console.log('1) DOCX extract OK:', text.length, 'chars');

// 2) Minimal markdown parser (matches lib/markdown.ts)
function parseInline(s) {
  const spans = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let last = 0, m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) spans.push({ kind: 'text', text: s.slice(last, m.index) });
    if (m[2]) spans.push({ kind: 'bold', text: m[2] });
    else if (m[3]) spans.push({ kind: 'italic', text: m[3] });
    last = re.lastIndex;
  }
  if (last < s.length) spans.push({ kind: 'text', text: s.slice(last) });
  return spans;
}
function parseMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let para = [];
  const flush = () => {
    if (para.length) {
      const t = para.join(' ').trim();
      if (t) blocks.push({ kind: 'p', spans: parseInline(t) });
    }
    para = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); continue; }
    if (line.startsWith('# ')) { flush(); blocks.push({ kind: 'h1', spans: parseInline(line.slice(2)) }); continue; }
    if (line.startsWith('## ')) { flush(); blocks.push({ kind: 'h2', spans: parseInline(line.slice(3)) }); continue; }
    if (line.startsWith('### ')) { flush(); blocks.push({ kind: 'h3', spans: parseInline(line.slice(4)) }); continue; }
    if (line.startsWith('> ')) { flush(); blocks.push({ kind: 'quote', spans: parseInline(line.slice(2)) }); continue; }
    para.push(line);
  }
  flush();
  return blocks;
}

const md = `# Master Services Agreement
Agreement Reference No. MSA-2026-0042

**What is this document?** This is a contract between two businesses written in plain English.

## Clause 4 — Fees, Invoicing, and Payment

> **In plain English:** The Client pays GenericCorp the agreed fees.

### 4.1 Fees

The Client pays GenericCorp the fees set out in the relevant *Statement of Work*.`;

const blocks = parseMarkdown(md);
console.log('2) Markdown parse OK:', blocks.map(b => b.kind).join(', '));

// 3) PDF render
Font.registerHyphenationCallback((w) => [w]);
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, backgroundColor: '#FDF8F4', color: '#1C1C1C' },
  h1: { fontSize: 22, marginBottom: 10 },
  h2: { fontSize: 14, marginTop: 14, marginBottom: 4 },
  h3: { fontSize: 12, marginTop: 8, marginBottom: 4 },
  p:  { marginBottom: 6, lineHeight: 1.5 },
  q:  { backgroundColor: '#FFF0EB', borderLeftWidth: 3, borderLeftColor: '#FF5C3A', padding: 8, marginVertical: 6 },
  bold: { fontWeight: 700 },
});
const render = (spans) =>
  spans.map((s, i) =>
    s.kind === 'bold'
      ? React.createElement(Text, { key: i, style: styles.bold }, s.text)
      : s.kind === 'italic'
      ? React.createElement(Text, { key: i, style: { fontStyle: 'italic' } }, s.text)
      : React.createElement(Text, { key: i }, s.text)
  );
const doc = React.createElement(Document, null,
  React.createElement(Page, { size: 'A4', style: styles.page },
    ...blocks.map((b, i) => {
      const style = { h1: styles.h1, h2: styles.h2, h3: styles.h3, p: styles.p, quote: styles.q }[b.kind];
      return React.createElement(b.kind === 'quote' ? View : Text, { key: i, style },
        b.kind === 'quote' ? React.createElement(Text, null, render(b.spans)) : render(b.spans)
      );
    })
  )
);
const pdf = await renderToBuffer(doc);
writeFileSync('/tmp/clarafy-smoke.pdf', pdf);
console.log('3) PDF render OK:', pdf.length, 'bytes  →  /tmp/clarafy-smoke.pdf');
console.log('\nAll three subsystems OK. Add ANTHROPIC_API_KEY and run `npm run dev` to test the full pipeline.');
