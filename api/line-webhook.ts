// ─────────────────────────────────────────────────────────────────────────────
// LINE Messaging API webhook handler
// Sprint 1.6 · 2026-05
//
// Receives events from LINE Platform when:
//   - Someone follows the bot (event.type = "follow")
//   - Someone sends a message to the bot (event.type = "message")
//
// Default behavior: reply with User ID — useful for setup + foundation for
// future command bot (capture, billing, etc.).
//
// Webhook URL to set in LINE Developers Console:
//   https://www.undercatcreatives.com/api/line-webhook
//
// Required env vars:
//   - LINE_CHANNEL_ACCESS_TOKEN (already set)
//   - LINE_CHANNEL_SECRET (paste from LINE OA Manager → Messaging API)
// ─────────────────────────────────────────────────────────────────────────────

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

// Vercel parses JSON body by default — disable so we can read raw bytes
// for HMAC-SHA256 signature verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

interface LineEvent {
  type: 'message' | 'follow' | 'unfollow' | 'join' | 'leave' | string;
  replyToken?: string;
  source?: { userId?: string; type: string };
  message?: { type: string; text?: string };
  timestamp?: number;
}

async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as unknown as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function verifySignature(rawBody: string, signature: string): boolean {
  if (!LINE_CHANNEL_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', LINE_CHANNEL_SECRET)
    .update(rawBody)
    .digest('base64');
  // timing-safe compare
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

async function replyToLine(replyToken: string, text: string): Promise<void> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error('[line-webhook] LINE_CHANNEL_ACCESS_TOKEN not set');
    return;
  }
  const resp = await fetch(LINE_REPLY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text: text.slice(0, 5000) }],
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    console.error('[line-webhook] reply failed:', resp.status, errText.slice(0, 200));
  }
}

function buildIdReply(userId: string): string {
  return [
    `Your LINE User ID:`,
    userId,
    ``,
    `Copy this and paste into Vercel env var LINE_USER_ID to receive lead notifications privately.`,
    ``,
    `Future commands:`,
    `/myid · /help · (more soon)`,
  ].join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    const signature = (req.headers['x-line-signature'] as string) || '';

    if (!verifySignature(rawBody, signature)) {
      console.error('[line-webhook] Invalid signature — rejecting');
      res.status(401).end();
      return;
    }

    const body = JSON.parse(rawBody) as { events?: LineEvent[] };
    const events = body.events ?? [];

    for (const event of events) {
      const userId = event.source?.userId;
      if (!userId) continue;

      console.log(`[line-webhook] event=${event.type} userId=${userId}`);

      if (event.type === 'follow' && event.replyToken) {
        await replyToLine(
          event.replyToken,
          [
            `ขอบคุณที่เพิ่มเพื่อน 👋`,
            ``,
            buildIdReply(userId),
          ].join('\n'),
        );
        continue;
      }

      if (event.type === 'message' && event.replyToken) {
        const text = (event.message?.text ?? '').trim().toLowerCase();

        if (text === '/myid' || text === 'myid' || text === 'id') {
          await replyToLine(event.replyToken, buildIdReply(userId));
          continue;
        }

        if (text === '/help' || text === 'help') {
          await replyToLine(event.replyToken, [
            `Undercat internal bot — commands:`,
            `/myid — show your User ID`,
            `/help — this menu`,
            ``,
            `(more commands coming soon)`,
          ].join('\n'));
          continue;
        }

        // Default: reply with User ID (helpful during setup)
        await replyToLine(event.replyToken, buildIdReply(userId));
      }
    }

    res.status(200).end();
  } catch (err) {
    console.error('[line-webhook] error:', err instanceof Error ? err.message : err);
    res.status(500).end();
  }
}
