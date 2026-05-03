#!/bin/bash
# Finalize domain transfer — undercatcreatives.com → project v2.
#
# Three things have to happen and Cloudflare's API needs all of
# them in this order:
#   1. Update the CNAME records in the zone so they point at
#      `undercatcreatives-v2.pages.dev` instead of the old project.
#   2. Remove the custom domain from the old Pages project.
#   3. Add the custom domain to the new Pages project, which
#      triggers Cloudflare to provision a fresh SSL cert.
#
# This needs an API token with two permissions:
#   - Zone → DNS: Edit
#   - Account → Cloudflare Pages: Edit

set -e
ACCOUNT="e2ec16fbe18033a4f8e86a4b6bf47020"
ZONE="b4dbcd76eacf710fea87fb78d96d2ffa"
OLD="undercatcreatives"
NEW="undercatcreatives-v2"
API="https://api.cloudflare.com/client/v4"
NEW_TARGET="undercatcreatives-v2.pages.dev"

echo
echo "Paste your Cloudflare API token below (input is hidden)."
echo "Token must have: Zone DNS:Edit + Account Cloudflare Pages:Edit"
echo
read -s -p "Token: " TOKEN
echo
echo

if [ -z "$TOKEN" ]; then
  echo "✗ no token entered — aborting"
  exit 1
fi

# Verify token works on both surfaces.
echo "── verify token has correct permissions ──"
VERIFY=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/user/tokens/verify")
if ! echo "$VERIFY" | grep -q '"status":"active"'; then
  echo "✗ token rejected:"
  echo "$VERIFY" | head -c 400
  exit 1
fi
echo "✓ token active"
echo

# Quick spot-check on zone:edit (list DNS records).
ZONE_TEST=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/zones/$ZONE/dns_records?per_page=1")
if echo "$ZONE_TEST" | grep -q '"success":false'; then
  echo "✗ token cannot read zone — needs Zone DNS:Edit permission:"
  echo "$ZONE_TEST" | head -c 400
  exit 1
fi
echo "✓ zone access OK"
echo

# 1. List DNS records and find the ones we need to change.
echo "── 1/4 list DNS records for undercatcreatives.com ──"
curl -s -H "Authorization: Bearer $TOKEN" "$API/zones/$ZONE/dns_records?per_page=100" > /tmp/dns.json
python3 << 'PYEOF'
import json
with open('/tmp/dns.json') as f:
    data = json.load(f)
print(f"\n{'TYPE':6} {'NAME':40} {'CONTENT':50} PROXIED  ID")
print("-" * 130)
for r in data.get('result', []):
    print(f"{r['type']:6} {r['name']:40} {r['content']:50} {str(r.get('proxied')):8} {r['id']}")
PYEOF

# 2. For each name we care about, find the CNAME and patch it
#    to the new target.
for name in "undercatcreatives.com" "www.undercatcreatives.com"; do
  echo
  echo "── 2/4 update $name → $NEW_TARGET ──"
  RECORD_ID=$(python3 -c "
import json
with open('/tmp/dns.json') as f:
    data = json.load(f)
for r in data.get('result', []):
    if r['name'] == '$name' and r['type'] == 'CNAME':
        print(r['id'])
        break
")
  if [ -z "$RECORD_ID" ]; then
    echo "(no CNAME found for $name — Cloudflare Pages will create one when domain is added)"
    continue
  fi
  echo "  patching record $RECORD_ID …"
  curl -s -X PATCH \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"content\":\"$NEW_TARGET\"}" \
    "$API/zones/$ZONE/dns_records/$RECORD_ID" \
    | head -c 300
  echo
done

# Give DNS edits a moment to settle.
sleep 3

# 3. Remove domain from OLD project.
for d in "undercatcreatives.com" "www.undercatcreatives.com"; do
  echo
  echo "── 3/4 remove $d from $OLD ──"
  curl -s -X DELETE -H "Authorization: Bearer $TOKEN" \
    "$API/accounts/$ACCOUNT/pages/projects/$OLD/domains/$d" | head -c 200
  echo
done

sleep 3

# 4. Add domain to NEW project — triggers SSL provision.
for d in "undercatcreatives.com" "www.undercatcreatives.com"; do
  echo
  echo "── 4/4 add $d to $NEW ──"
  curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "{\"name\":\"$d\"}" \
    "$API/accounts/$ACCOUNT/pages/projects/$NEW/domains" | head -c 400
  echo
done

echo
echo "✓ DNS + Pages routing updated. SSL provisioning runs ~30s-2min."
echo "  Watching status …"
echo

# Poll status until both domains active or 3 minutes elapse.
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  sleep 15
  ROOT_STATUS=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "$API/accounts/$ACCOUNT/pages/projects/$NEW/domains/undercatcreatives.com" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin).get("result",{}).get("status","?"))')
  WWW_STATUS=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "$API/accounts/$ACCOUNT/pages/projects/$NEW/domains/www.undercatcreatives.com" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin).get("result",{}).get("status","?"))')
  echo "  [${i}/12] root=$ROOT_STATUS  www=$WWW_STATUS"
  if [ "$ROOT_STATUS" = "active" ] && [ "$WWW_STATUS" = "active" ]; then
    echo
    echo "✓ both domains active. Live now: https://undercatcreatives.com/"
    exit 0
  fi
done

echo
echo "(timed out after 3 minutes — sometimes SSL takes longer."
echo " check https://dash.cloudflare.com/?to=/:account/pages/view/undercatcreatives-v2/domains)"
