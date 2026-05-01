#!/bin/bash
# Continue deploy from step 3 — backup + .gitignore already done.

set -e
cd "$(dirname "$0")"

echo
echo "── cleanup index.lock ──"
rm -f .git/index.lock

echo
echo "── 3 / 4 ── stage + commit session edits ──"
git add -A

# Skip empty commit gracefully if everything already committed.
if git diff --cached --quiet; then
  echo "(nothing to commit — already staged in a previous run)"
else
  git commit -F - <<'COMMIT_MSG'
feat: SEO foundation, brand voice, Home polish, mobile drawer

Round 1 — Home end-to-end polish
- Typography: Space Grotesk -> General Sans (humanist body), drop
  unused font imports, retune scale + tracking
- Hero copy locked to tagline. Footer rewritten -- drop adjective
  fluff (masterful, refuse to blend in)
- Top nav consolidated 7 -> 5 (Work / Industries / Briefing Room /
  Credentials / Contact). Industries dropdown wraps Golf + Drone.
  Page-level numbering removed (chapter narrative owns 01-04)
- REEL pulse 2.4s -> 4s (calm, not alarm)
- a11y baseline: skip-to-content, prefers-reduced-motion, focus rings

Round 2 — SEO + AEO foundation
- index.html JSON-LD @graph: Organization, LocalBusiness (geo, hours,
  phone), WebSite (SearchAction), Person (founder), 4 Service entities.
  Drop OfferCatalog + price meta (brand voice Pattern 4 violation)
- src/lib/seo.tsx: SeoHead, breadcrumbSchema, creativeWorkSchema,
  workIndexSchema, serviceSchema, faqSchema generators
- Per-page Helmet via SeoHead -- Work, CaseDetail (18 pages), Golf,
  Drone, Services
- public/sitemap.xml: 9 -> 27 URLs (case studies indexed)
- public/robots.txt: explicit allow GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, Applebot-Extended, CCBot
- public/og-default.jpg: 1200x630 baseline

Round 3 — AEO content + nav consolidation
- FAQSection + faq.ts: 8 Q&A pairs on /services with FAQPage schema
- PageTopBar consolidation + mobile drawer (was hidden on mobile)

Bug fix
- PhaseVibe.tsx: stray closing div broke production build, removed
COMMIT_MSG
fi

echo
echo "── 4 / 4 ── force-push master -> origin main ──"
git push origin master:main --force

echo
echo "✓ done. Cloudflare auto-poll detect ภายใน 30 วินาที"
echo "  ดู deploy progress ที่ https://dash.cloudflare.com/?to=/:account/pages/view/undercatcreatives"
