// Quick sanity check that the PDF generator produces a real, non-empty PDF
// using only react-pdf's built-in fonts (no network fetch).
import { writeFileSync } from 'node:fs';
import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font, renderToBuffer,
} from '@react-pdf/renderer';

Font.registerHyphenationCallback((w) => [w]);

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, backgroundColor: '#FDF8F4', color: '#1C1C1C', lineHeight: 1.5 },
  h1: { fontFamily: 'Times-Bold', fontSize: 22, marginBottom: 10 },
  h2: { fontFamily: 'Times-Bold', fontSize: 13, marginTop: 14, marginBottom: 4 },
  p:  { marginBottom: 6 },
  q:  { backgroundColor: '#FFF0EB', borderLeftWidth: 3, borderLeftColor: '#FF5C3A', padding: 8, marginVertical: 6 },
  bold: { fontFamily: 'Helvetica-Bold' },
});

const doc = React.createElement(Document, null,
  React.createElement(Page, { size: 'A4', style: s.page },
    React.createElement(Text, { style: s.h1 }, 'Clarafy — PDF render smoke test'),
    React.createElement(Text, { style: s.h2 }, 'Clause 1 — Definitions'),
    React.createElement(View, { style: s.q },
      React.createElement(Text, null,
        React.createElement(Text, { style: s.bold }, 'In plain English: '),
        'This section is a glossary.'
      )
    ),
    React.createElement(Text, { style: s.p }, 'The Client pays GenericCorp the fees set out in the relevant Statement of Work.')
  )
);

const pdf = await renderToBuffer(doc);
writeFileSync('/tmp/clarafy-pdf-smoke.pdf', pdf);
console.log('PDF bytes:', pdf.length);
console.log('Starts with %PDF:', pdf.slice(0, 5).toString() === '%PDF-');
