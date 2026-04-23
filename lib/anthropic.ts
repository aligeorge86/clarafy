/**
 * Thin wrapper over the Anthropic SDK.
 * Pulls model + key from env so nothing is hardcoded.
 */

import Anthropic from '@anthropic-ai/sdk';
import { TRANSLATION_SYSTEM_PROMPT, buildTranslationMessages } from './prompt';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.startsWith('sk-ant-placeholder')) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Copy .env.example → .env.local and add your key.'
    );
  }
  client = new Anthropic({ apiKey });
  return client;
}

export async function translateDocument(legalText: string): Promise<string> {
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
  const a = getClient();

  const resp = await a.messages.create({
    model,
    max_tokens: 16_000,
    system: TRANSLATION_SYSTEM_PROMPT,
    messages: buildTranslationMessages(legalText),
  });

  // Join all text blocks together. The model may emit multiple if it's long.
  const out: string[] = [];
  for (const block of resp.content) {
    if (block.type === 'text') out.push(block.text);
  }
  return out.join('\n').trim();
}
