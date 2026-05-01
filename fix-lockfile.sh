#!/bin/bash
# Fix Cloudflare build — drop bun lockfiles, force npm path.
#
# Cloudflare auto-detected bun.lockb in repo and ran:
#   bun install --frozen-lockfile
# which failed because lockfile drifted from package.json.
# Project actually uses npm (package-lock.json is the source of
# truth). Removing bun lockfiles makes Cloudflare fall back to
# npm ci, which we already verified locally builds clean.

set -e
cd "$(dirname "$0")"

echo
echo "── 1 / 3 ── remove bun lockfiles from working tree"
rm -f bun.lockb bun.lock

echo
echo "── 2 / 3 ── add bun lockfiles to .gitignore (so they don't sneak back)"
# Append only if not already present.
grep -q '^bun.lockb$' .gitignore || echo 'bun.lockb' >> .gitignore
grep -q '^bun.lock$'  .gitignore || echo 'bun.lock'  >> .gitignore

echo
echo "── 3 / 3 ── stage + commit + push"
git add -A
if git diff --cached --quiet; then
  echo "(nothing to commit — already clean)"
else
  git commit -m "fix(deploy): drop bun lockfiles, use npm only

Cloudflare's auto-detection picked up bun.lockb and tried bun
install --frozen-lockfile, which failed because the bun lockfile
had drifted from package.json. Project uses npm as its primary
package manager (package-lock.json is in sync). Dropping bun
lockfiles forces Cloudflare to use npm ci, matching the local
build."
fi

git push origin master:main

echo
echo "✓ done. Cloudflare will auto-rebuild from the new commit"
echo "  in ~10-30 seconds. Open the project's Deployments tab to"
echo "  watch progress:"
echo "  https://dash.cloudflare.com/?to=/:account/pages/view/undercatcreatives-v2"
