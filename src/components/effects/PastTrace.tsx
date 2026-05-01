/**
 * PAST TRACE
 * Dwell > 1s → leave → 1px hairline under one random word for ~900ms.
 * The trace is in the past. The cat does not perform.
 * Re-attaches after chapters render.
 */
import { useEffect } from 'react';

const SELECTOR = 'h1, h2, h3, p, blockquote, [data-trace]';
const DWELL_MIN = 1000;
const TRACE_LIFE = 900;
const FADE_MS = 700;

function collectTextNodes(root: Node): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      const p = n.parentNode as Element | null;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.nodeName.toLowerCase();
      if (tag === 'script' || tag === 'style') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

function randomWordRect(el: HTMLElement): DOMRect | null {
  const nodes = collectTextNodes(el);
  if (!nodes.length) return null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const node = nodes[(Math.random() * nodes.length) | 0];
    const text = node.nodeValue ?? '';
    const words: { start: number; end: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m[0].length >= 2) words.push({ start: m.index, end: m.index + m[0].length });
    }
    if (!words.length) continue;
    const w = words[(Math.random() * words.length) | 0];
    const range = document.createRange();
    try { range.setStart(node, w.start); range.setEnd(node, w.end); } catch { continue; }
    const rects = range.getClientRects();
    if (!rects.length) continue;
    const r = rects[0];
    if (r.width < 6) continue;
    return r;
  }
  return null;
}

function placeTrace(rect: DOMRect) {
  const div = document.createElement('div');
  div.style.cssText = [
    'position:absolute',
    `left:${rect.left + window.scrollX}px`,
    `top:${rect.bottom + window.scrollY + 1}px`,
    `width:${rect.width}px`,
    'height:1px',
    'background:rgba(255,255,255,0.55)',
    'pointer-events:none',
    'z-index:90',
    'transition:opacity 700ms ease',
    'opacity:1',
  ].join(';');
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = '0'; }, TRACE_LIFE);
  setTimeout(() => { div.remove(); }, TRACE_LIFE + FADE_MS + 50);
}

export default function PastTrace() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handlers: Array<{ el: HTMLElement; enter: () => void; leave: (e: MouseEvent) => void }> = [];

    function attach(el: HTMLElement) {
      if (el.dataset.ptAttached) return;
      el.dataset.ptAttached = '1';
      let enteredAt = 0;
      const enter = () => { if (enteredAt === 0) enteredAt = performance.now(); };
      const leave = (e: MouseEvent) => {
        const rt = e.relatedTarget as Node | null;
        if (rt && el.contains(rt)) return;
        const dwell = performance.now() - enteredAt;
        enteredAt = 0;
        if (dwell < DWELL_MIN) return;
        const rect = randomWordRect(el);
        if (rect) placeTrace(rect);
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave as EventListener);
      handlers.push({ el, enter, leave });
    }

    function attachAll() {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(attach);
    }
    attachAll();
    const t1 = setTimeout(attachAll, 800);
    const t2 = setTimeout(attachAll, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave as EventListener);
        delete el.dataset.ptAttached;
      });
    };
  }, []);

  return null;
}
