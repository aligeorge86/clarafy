/**
 * Renders the Clarafy-translated markdown to a downloadable PDF.
 *
 * Uses @react-pdf/renderer — pure React, server-side, no headless browser.
 * Fonts are fetched from Google Fonts at render time; they're cached for the
 * life of the Node process.
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

// Register the two brand fonts. @react-pdf only supports TTF/OTF from a URL.
Font.register({
  family: 'Libre Baskerville',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/librebaskerville/v14/kmKnZrc3Hgbbcjq75U4uslyuy4kn0pNeYRI4CN2V.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/librebaskerville/v14/kmKiZrc3Hgbbcjq75U4uslyuy4kn0qNcaxYaDc2V2ro.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://fonts.gstatic.com/s/librebaskerville/v14/kmKhZrc3Hgbbcjq75U4uslyuy4kn0qviTjY1_ExT.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
  ],
});
Font.register({
  family: 'Nunito',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshRTM9jo7eTWk.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhRTM9jo7eTWk.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLAhRTM9jo7eTWk.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDKUkRTM9jo7eTWk.ttf',
      fontWeight: 700,
    },
  ],
});

// Hyphenation off — legal defined terms must not break across lines.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FDF8F4',
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 56,
    fontFamily: 'Nunito',
    fontSize: 10.5,
    color: '#1C1C1C',
    lineHeight: 1.6,
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
    color: '#AAA',
  },
  logo: { fontFamily: 'Libre Baskerville', fontSize: 14, color: '#1C1C1C' },
  logoA: { fontFamily: 'Libre Baskerville', fontSize: 14, fontStyle: 'italic', color: '#FF5C3A' },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    borderTopWidth: 1,
    borderTopColor: '#EDE6DC',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#BBB',
    fontWeight: 300,
    lineHeight: 1.5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 14,
    right: 56,
    fontSize: 8,
    color: '#CCC',
  },
  h1: {
    fontFamily: 'Libre Baskerville',
    fontWeight: 700,
    fontSize: 22,
    color: '#1C1C1C',
    marginTop: 6,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Libre Baskerville',
    fontWeight: 700,
    fontSize: 13,
    color: '#1C1C1C',
    marginTop: 18,
    marginBottom: 6,
  },
  h3: {
    fontFamily: 'Libre Baskerville',
    fontWeight: 700,
    fontSize: 11,
    color: '#1C1C1C',
    marginTop: 10,
    marginBottom: 4,
  },
  p: { marginBottom: 6 },
  quote: {
    backgroundColor: '#FFF0EB',
    borderLeftWidth: 3,
    borderLeftColor: '#FF5C3A',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 4,
    fontSize: 10,
  },
  bold: { fontWeight: 700 },
  italic: { fontStyle: 'italic', color: '#888' },
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
