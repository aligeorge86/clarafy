# Clarafy.ai

> We don't speak legalese.

Clarafy takes legal documents and rewrites them in plain English. Upload a PDF
or Word doc — a solicitor's letter, a tenancy agreement, a contract, an NDA —
and get back the same document, same structure, same clause numbers, but with
every clause rewritten at a clear, adult reading level. No jargon. No confusion.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with Clarafy brand tokens (coral / warm white / ink / sage / gold)
- **Libre Baskerville** (display) + **Nunito** (body)
- **Anthropic SDK** — translation via `claude-sonnet-4-6`
- **mammoth** — `.docx` text extraction
- **pdfjs-dist** — `.pdf` text extraction
- **@react-pdf/renderer** — server-side PDF output

## Architecture

Clarafy runs a **zero-retention architecture**:

1. Upload is streamed into a Node `ArrayBuffer`. Never written to disk.
2. Text is extracted in memory. The buffer is released.
3. Extracted text is sent to Claude. The response is returned to the client.
4. The translated markdown lives only in the user's browser session.
5. The PDF is generated on demand and streamed back — never stored.
6. No request or response bodies are logged.

The `/privacy` page explains this in full, user-facing detail.

## Running locally

```bash
# 1. Install
npm install

# 2. Add your Anthropic API key
cp .env.example .env.local
# then edit .env.local and paste your key from https://console.anthropic.com/

# 3. Start dev server
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Your key. The app will throw a clear error if it's still the placeholder. |
| `CLAUDE_MODEL` | no | Defaults to `claude-sonnet-4-6`. Swap for faster/cheaper models if needed. |
| `NEXT_PUBLIC_SITE_URL` | no | Used for canonical links and OG tags. |

## Project layout

```
app/
  layout.tsx               # Global shell (fonts, metadata)
  page.tsx                 # Landing page
  globals.css              # Brand tokens & doc-prose styles
  translate/page.tsx       # Upload + progress + translated view
  privacy/page.tsx         # Zero-retention policy
  api/
    translate/route.ts     # POST: extract → Claude → markdown
    pdf/route.ts           # POST: markdown → PDF stream
components/
  Nav.tsx  Hero.tsx  UploadBox.tsx
  HowItWorks.tsx  Disclaimer.tsx  Footer.tsx
lib/
  prompt.ts                # The Clarafy translation system prompt (the product)
  anthropic.ts             # Thin SDK wrapper
  extractText.ts           # PDF + DOCX → plain text
  markdown.ts              # Mini parser → HTML + PDF renderer input
  generatePdf.tsx          # @react-pdf/renderer document
```

## The translation prompt

The heart of Clarafy is `lib/prompt.ts`. It teaches Claude to:

- Preserve every clause number, schedule, and signature block exactly.
- Open each clause with `> **In plain English:** …` — a one-line summary.
- Swap "the Party of the first part" for the party's actual name.
- Inline-gloss legal terms on first mention: `UK GDPR *(the data privacy rules kept from the EU after Brexit)*`.
- Preserve ALL-CAPS disclaimers verbatim, then add a plain-English paraphrase.
- Never give legal advice. Never invent content. Never reorder.

Modelled one-for-one on the `MSA_Clarafy.docx` reference translation.

## Smoke test

A pre-Claude sanity check for the pipeline — verifies that DOCX extraction,
markdown parsing, and PDF generation all work:

```bash
node scripts/smoke-test.mjs MSA_Clarafy.docx
# → writes /tmp/clarafy-smoke.pdf
```

## Deploying

The app is Vercel-ready:

```bash
# push to a repo, then in Vercel:
# 1. Import the project
# 2. Set ANTHROPIC_API_KEY in Environment Variables
# 3. Deploy — no other config needed
```

The `/api/translate` route is configured with `maxDuration = 300` so long
documents complete without timing out on Pro/Enterprise plans.

## Disclaimer

Clarafy is a translation tool only, not a legal service. Every output ships
with this disclaimer — in the UI, in the PDF footer, on every page. Always
refer to the original document and consult a qualified solicitor for legal
advice.
