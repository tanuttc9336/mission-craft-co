#!/bin/bash
# Transfer custom domains undercatcreatives.com + www.undercatcreatives.com
# from old Direct Upload project (`undercatcreatives`) → new Git-connected
# project (`undercatcreatives-v2`).
#
# Asks once for a Cloudflare API token. Paste it (input is hidden) and
# the rest is four atomic API calls — total ~5 seconds, no clicks.

set -e

ACCOUNT="e2ec16fbe18033a4f8e86a4b6bf47020"
OLD="undercatcreatives"
NEW="undercatcreatives-v2"
DOMAINS=("undercatcreatives.com" "www.undercatcreatives.com")
API="https://api.cloudflare.com/client/v4"

echo
echo "Paste your Cloudflare API token below."
echo "(Need template: 'Edit Cloudflare Pages' OR Custom token with"
echo " Account → Cloudflare Pages → Edit. Token is hidden as you type.)"
echo
read -s -p "Token: " CF_TOKEN
echo
echo

if [ -z "$CF_TOKEN" ]; then
  echo "✗ no token entered — aborting"
  exit 1
fi

# Quick sanity check — verify token works.
echo "── verify token ──"
VERIFY=$(curl -sf -H "Authorization: Bearer $CF_TOKEN" "$API/user/tokens/verify" || true)
if ! echo "$VERIFY" | grep -q '"status":"active"'; then
  echo "✗ token rejected — check permissions (Account → Cloudflare Pages → Edit)"
  echo "$VERIFY"
  exit 1
fi
echo "✓ token active"
echo

# 1. Remove domains from OLD project.
for d in "${DOMAINS[@]}"; do
  echo "── remove $d from project $OLD ──"
  curl -sf -X DELETE \
    -H "Authorization: Bearer $CF_TOKEN" \
    "$API/accounts/$ACCOUNT/pages/projects/$OLD/domains/$d" \
    | head -c 200
  echo
done

# Tiny pause so Cloudflare propagates internal state before we re-add.
sleep 2

# 2. Add domains to NEW project.
for d in "${DOMAINS[@]}"; do
  echo "── add $d to project $NEW ──"
  curl -sf -X POST \
    -H "Authorization: Bearer $CF_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$d\"}" \
    "$API/accounts/$ACCOUNT/pages/projects/$NEW/domains" \
    | head -c 200
  echo
done

echo
echo "✓ transfer requested. SSL re-provision usually takes 30s-2min."
echo "  Check live in ~1 min: https://undercatcreatives.com/"
