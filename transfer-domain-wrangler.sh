#!/bin/bash
# Transfer domains from old project → new, via wrangler OAuth.
# No API token to copy/paste — wrangler opens an OAuth flow in the
# browser. Pao just clicks "Allow" once, then this script reuses the
# cached token to delete + re-add domains via Cloudflare's API.

set -e
export PATH=/usr/local/bin:/opt/homebrew/bin:$PATH

ACCOUNT="e2ec16fbe18033a4f8e86a4b6bf47020"
OLD="undercatcreatives"
NEW="undercatcreatives-v2"
DOMAINS=("undercatcreatives.com" "www.undercatcreatives.com")
API="https://api.cloudflare.com/client/v4"

echo
echo "── 1 / 3 ── wrangler login (browser will open for OAuth)"
echo "  Approve the prompt in the new tab → come back here when it says 'logged in'"
echo
npx --yes wrangler@latest login

echo
echo "── 2 / 3 ── extract OAuth access token from wrangler cache"
TOKEN=$(grep -A1 'oauth_token' ~/.config/.wrangler/config/default.toml 2>/dev/null \
        | head -2 | tail -1 | sed -E 's/.*"([^"]+)".*/\1/')
if [ -z "$TOKEN" ]; then
  # Fallback: newer wrangler stores it differently
  TOKEN=$(cat ~/.wrangler/config/default.toml 2>/dev/null \
          | grep oauth_token | sed -E 's/.*"([^"]+)".*/\1/')
fi
if [ -z "$TOKEN" ]; then
  echo "✗ couldn't extract OAuth token from wrangler cache."
  echo "  Falling back to direct API token prompt."
  read -s -p "Paste a Cloudflare API token (Pages: Edit): " TOKEN
  echo
fi
echo "✓ token loaded"

# Verify
echo
echo "── verify token ──"
curl -sf -H "Authorization: Bearer $TOKEN" "$API/user/tokens/verify" | head -c 200
echo

echo
echo "── 3 / 3 ── transfer domains"
for d in "${DOMAINS[@]}"; do
  echo
  echo "  removing $d from $OLD …"
  curl -s -X DELETE -H "Authorization: Bearer $TOKEN" \
    "$API/accounts/$ACCOUNT/pages/projects/$OLD/domains/$d" \
    | head -c 300
  echo
done

sleep 2

for d in "${DOMAINS[@]}"; do
  echo
  echo "  adding $d to $NEW …"
  curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "{\"name\":\"$d\"}" \
    "$API/accounts/$ACCOUNT/pages/projects/$NEW/domains" \
    | head -c 300
  echo
done

echo
echo
echo "✓ requests sent. SSL re-provisioning takes ~30s-2min."
echo "  Verify in ~1 min: https://undercatcreatives.com/"
