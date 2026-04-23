/**
 * Renders the Clarafy-translated markdown to a downloadable PDF.
 *
 * Uses @react-pdf/renderer — pure React, server-side, no headless browser.
 *
 * Fonts: we use react-pdf's built-in Helvetica (body) and Times-Roman (headings).
 * We deliberately do NOT pull Libre Baskerville / Nunito from Google Fonts here —
 * on Vercel serverless cold starts those fetches were timing out / failing. Times
 * gives us a similar "serif-for-headlines" feel and ships with the library itself.
 *
 * Every page shows the Clarafy wordmark in the header and the disclaimer in
 * the footer. The disclaimer appearing on every page is intentional — it's
 * part of the product promise.
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from '@react-pdf/renderer';
import { parseMarkdown, type Block, type InlineSpan } from './markdown';

// Hyphenation off — legal defined terms must not break across lines.
Font.registerHyphenationCallback((word) => [word]);

// react-pdf ships these four families out of the box. No network fetch needed.
const SERIF = 'Times-Roman';
const SERIF_BOLD = 'Times-Bold';
const SERIF_ITALIC = 'Times-Italic';
const SANS = 'Helvetica';
const SANS_BOLD = 'Helvetica-Bold';
const SANS_ITALIC = 'Helvetica-Oblique';

const CORAL = '#FF5C3A';
const INK = '#1C1C1C';
const WARM = '#FDF8F4';
const SOFT = '#FFF0EB';
const RULE = '#EDE6DC';
const MUTED = '#888888';
const HUSH = '#BBBBBB';

const styles = StyleSheet.create({
  page: {
    backgroundColor: WARM,
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 56,
    fontFamily: SANS,
    fontSize: 10.5,
    color: INK,
    lineHeight: 1.55,
  },
  header: {
    position: 'absolute',
    top: 28,
    left: 56,
    right: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    color: MUTED,
  },
  logo: { fontFamily: SERIF_BOLD, fontSize: 14, color: INK },
  logoA: { fontFamily: SERIF_ITALIC, fontSize: 14, color: CORAL },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 8,
    fontSize: 7.5,
    color: HUSH,
    lineHeight: 1.5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 14,
    right: 56,
    fontSize: 8,
    color: HUSH,
  },
  h1: {
    fontFamily: SERIF_BOLD,
    fontSize: 22,
    color: INK,
    marginTop: 6,
    marginBottom: 14,
  },
  h2: {
    fontFamily: SERIF_BOLD,
    fontSize: 13,
    color: INK,
    marginTop: 18,
    marginBottom: 6,
  },
  h3: {
    fontFamily: SERIF_BOLD,
    fontSize: 11,
    color: INK,
    marginTop: 10,
    marginBottom: 4,
  },
  p: { marginBottom: 6 },
  quote: {
    backgroundColor: SOFT,
    borderLeftWidth: 3,
    borderLeftColor: CORAL,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 4,
    fontSize: 10,
  },
  bold: { fontFamily: SANS_BOLD },
  italic: { fontFamily: SANS_ITALIC, color: MUTED },
});

function renderSpan(span: InlineSpan, idx: number) {
  if (span.kind === 'bold') {
    return (
      <Text key={idx} style={styles.bold}>
        {span.text}
      </Text>
    );
  }
  if (span.kind === 'italic') {
    return (
      <Text key={idx} style={styles.italic}>
        {span.text}
      </Text>
    );
  }
  return <Text key={idx}>{span.text}</Text>;
}

function renderBlock(block: Block, idx: number) {
  const content = block.spans.map(renderSpan);
  switch (block.kind) {
    case 'h1':
      return (
        <Text key={idx} style={styles.h1}>
          {content}
        </Text>
      );
    case 'h2':
      return (
        <Text key={idx} style={styles.h2}>
          {content}
        </Text>
      );
    case 'h3':
      return (
        <Text key={idx} style={styles.h3}>
          {content}
        </Text>
      );
    case 'quote':
      return (
        <View key={idx} style={styles.quote} wrap={false}>
          <Text>{content}</Text>
        </View>
      );
    case 'p':
    default:
      return (
        <Text key={idx} style={styles.p}>
          {content}
        </Text>
      );
  }
}

function ClarafyDocument({ markdown }: { markdown: string }) {
  const blocks = parseMarkdown(markdown);
  return (
    <Document
      title="Clarafy — Plain-English Translation"
      author="Clarafy.ai"
      creator="Clarafy.ai"
      producer="Clarafy.ai"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text>
            <Text style={styles.logo}>Clar</Text>
            <Text style={styles.logoA}>a</Text>
            <Text style={styles.logo}>fy</Text>
          </Text>
          <Text>Plain-English translation</Text>
        </View>

        {blocks.map(renderBlock)}

        <View style={styles.footer} fixed>
          <Text>
            Clarafy is a translation tool only, not a legal service. Always refer to your original
            document and consult a qualified solicitor for legal advice.
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

export async function buildPdfBuffer(markdown: string): Promise<Buffer> {
  return renderToBuffer(<ClarafyDocument markdown={markdown} />);
}
