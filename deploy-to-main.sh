#!/bin/bash
# Undercat — promote v4 test → origin/main with safe Lovable backup.
#
# Run with:
#   bash deploy-to-main.sh
#
# What this does (in order):
#   1. Backup Lovable's current main → branch `lovable-archive`
#      (so Pao can recover IndustryGolfPage / CapabilityPage later
#      if ever wanted)
#   2. Add a real .gitignore — kill dist-* clutter, *.zip, .DS_Store
#   3. Stage + commit every session edit on local `master`
#   4. Force-push local master → origin main
#
# After this, set up Cloudflare Git connection (Pages → Settings →
# connect GitHub → repo mission-craft-co → branch main → build cmd
# `npm run build` → output `dist`). After that, every `git push`
# from anywhere triggers an automatic Cloudflare deploy. No more
# drag-drop.
#
# GitHub will prompt once for username + password. Use a Personal
# Access Token (PAT) as the password — generate at:
#   https://github.com/settings/tokens
# Scope: `repo` is enough. macOS Keychain caches it after first use.

set -e

cd "$(dirname "$0")"

echo
echo "── 1 / 4 ── backup Lovable history → origin/lovable-archive"
git push origin refs/remotes/origin/main:refs/heads/lovable-archive

echo
echo "── 2 / 4 ── update .gitignore"
cat > .gitignore <<'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build output
node_modules
dist
dist-*/
*.zip

# Env
.env
.env.local
.env.*.local

# Editor / OS
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vite cache + ephemeral
vite.config.ts.timestamp-*
EOF

echo
echo "── 3 / 4 ── stage + commit session edits"
git add -A
git commit -m "feat: SEO foundation, brand voice, Home polish, mobile drawer

Round 1 — Home end-to-end polish
- Typography: Space Grotesk → General Sans (humanist body), drop
  unused font imports, retune scale + tracking
- Hero copy locked to tagline 'Content with direction. Production
  with taste.' Footer rewritten — drop adjective fluff (masterful,
  refuse to blend in)
- Top nav consolidated 7 → 5 (Work / Industries / Briefing Room /
  Credentials / Contact). Industries dropdown now wraps Golf +
  Drone. Page-level numbering removed (chapter narrative owns 01-04)
- REEL pulse 2.4s → 4s (calm, not alarm)
- a11y baseline: skip-to-content, prefers-reduced-motion, focus
  rings, aria-labels on nav

Round 2 — SEO + AEO foundation
- index.html JSON-LD @graph: Organization, LocalBusiness (geo,
  hours, phone), WebSite (SearchAction), Person (founder), 4
  Service entities. Drop OfferCatalog + 'Starting at 49,000 THB'
  meta (Pattern 4 violation — same-room language)
- src/lib/seo.tsx: SeoHead, breadcrumbSchema, creativeWorkSchema,
  workIndexSchema, serviceSchema, faqSchema generators
- Per-page Helmet via SeoHead — Work, CaseDetail (18 pages),
  Golf, Drone, Services
- public/sitemap.xml: 9 → 27 URLs (case studies indexed)
- public/robots.txt: explicit allow GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, Applebot-Extended, CCBot
- public/og-default.jpg: 1200×630 baseline

Round 3 — AEO content + nav consolidation
- src/components/FAQSection.tsx + src/data/faq.ts: 8 Q&A pairs
  injected on /services with FAQPage schema
- PageTopBar consolidation + mobile drawer (was hidden on mobile)

Bug fix
- src/components/briefing-room/PhaseVibe.tsx: extra </div> at line
  955 broke production build, removed
"

echo
echo "── 4 / 4 ── force-push local master → origin main"
git push origin master:main --force

echo
echo "✓ done. Cloudflare Pages will auto-build on next polling cycle"
echo "  (or after Git connection is set up — see header comment)."
echo
echo "Next: connect Cloudflare Pages to GitHub:"
echo "  https://dash.cloudflare.com/?to=/:account/pages/view/undercatcreatives/settings"
