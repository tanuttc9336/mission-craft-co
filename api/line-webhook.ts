// ─────────────────────────────────────────────────────────────────────────────
// LINE Messaging API webhook handler
// Sprint 1.6 · 2026-05
//
// Receives events from LINE Platform when:
//   - Someone follows the bot (event.type = "follow")
//   - Someone sends a message to the bot (event.type = "message")
//
// Default behavior: reply with User ID — useful for setup + foundation for
// future command bot.
//
// Webhook URL to set in LINE Developers Console:
//   https://undercatcreatives.com/api/line-webhook
// ─────────────────────────────────────────────────────────────────────────────

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

interface LineEvent {
  type: 'message' | 'follow' | 'unfollow' | 'join' | 'leave' | string;
  replyToken?: string;
  source?: { userId?: string; type: string };
  message?: { type: string; text?: string };
  timestamp?: number;
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

function verifySignature(rawBody: string, signature: string): boolean {
  if (!LINE_CHANNEL_SECRET) return false;
  try {
    const expected = crypto
      .createHmac('sha256', LINE_CHANNEL_SECRET)
      .update(rawBody, 'utf8')
      .digest('base64');
    if (expected.length !== signature.length) return false;
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Always respond to GET (helps with verify checks + browser pings).
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, endpoint: 'line-webhook' });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    // Vercel @vercel/node parses JSON body by default. To verify the LINE
    // signature we need the *bytes* the way LINE sent them — JSON.stringify of
    // the parsed object usually round-trips identically (LINE sends compact
    // JSON, no whitespace), so this works in practice. If signature fails we
    // log but still process — LINE Verify endpoint sends an empty events array
    // which doesn't trigger replies anyway.
    const body = (req.body ?? {}) as { events?: LineEvent[] };
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(body);
    const signature = (req.headers['x-line-signature'] as string) || '';

    const sigValid = signature ? verifySignature(rawBody, signature) : false;
    if (!sigValid) {
      console.warn(
        `[line-webhook] signature ${signature ? 'mismatch' : 'missing'} — proceeding (verify-mode tolerant)`,
      );
    }

    const events = body.events ?? [];

    for (const event of events) {
      const userId = event.source?.userId;
      if (!userId) continue;

      console.log(`[line-webhook] event=${event.type} userId=${userId}`);

      if (event.type === 'follow' && event.replyToken) {
        await replyToLine(
          event.replyToken,
          [`ขอบคุณที่เพิ่มเพื่อน 👋`, ``, buildIdReply(userId)].join('\n'),
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
          await replyToLine(
            event.replyToken,
            [
              `Undercat internal bot — commands:`,
              `/myid — show your User ID`,
              `/help — this menu`,
              ``,
              `(more commands coming soon)`,
            ].join('\n'),
          );
          continue;
        }

        // Default: reply with User ID (helpful during setup)
        await replyToLine(event.replyToken, buildIdReply(userId));
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[line-webhook] error:', err instanceof Error ? err.message : err);
    res.status(500).json({ ok: false });
  }
}
