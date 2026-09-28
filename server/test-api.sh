#!/usr/bin/env bash
set -euo pipefail

# By default registration creates an account in the configured database.
# Set REGISTER=0, EMAIL and PASSWORD to reuse an existing test account.
BASE_URL="${BASE_URL:-http://localhost:3000}"
BASE_URL="${BASE_URL%/}"
REGISTER="${REGISTER:-1}"
if [[ "$REGISTER" != 0 && "$REGISTER" != 1 ]]; then
  echo 'REGISTER must be 0 or 1.' >&2
  exit 1
fi
if [[ "$REGISTER" == 0 && ( -z "${EMAIL:-}" || -z "${PASSWORD:-}" ) ]]; then
  echo 'Set EMAIL and PASSWORD when REGISTER=0.' >&2
  exit 1
fi
export EMAIL="${EMAIL:-test-$(date +%s)-${RANDOM}@example.invalid}"
export PASSWORD="${PASSWORD:-TestoweHaslo123!}"
command -v curl >/dev/null
command -v node >/dev/null
BODY=$(node -e 'process.stdout.write(JSON.stringify({email:process.env.EMAIL,password:process.env.PASSWORD}))')
RESPONSE_FILE=$(mktemp)
trap 'rm -f "$RESPONSE_FILE"' EXIT

request() {
  local expected="$1" method="$2" path="$3"
  shift 3
  local status
  status=$(curl --silent --show-error --connect-timeout 10 --max-time 30 \
    --output "$RESPONSE_FILE" --write-out '%{http_code}' \
    --request "$method" "$BASE_URL$path" "$@")
  if [[ "$status" != "$expected" ]]; then
    echo "FAIL: $method $path returned HTTP $status; expected $expected." >&2
    exit 1
  fi
  echo "OK: $method $path → $status"
}

if [[ "$REGISTER" == 1 ]]; then
  echo "Registering test account: $EMAIL (account remains in the database)."
  request 201 POST /api/auth/register \
    -H 'Content-Type: application/json' --data "$BODY"
fi

request 200 POST /api/auth/login \
  -H 'Content-Type: application/json' --data "$BODY"

TOKEN=$(node --input-type=module - "$RESPONSE_FILE" <<'JS'
import { readFileSync } from 'node:fs';
try {
  const body = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  if (typeof body.accessToken !== 'string' || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(body.accessToken)) {
    throw new Error('Login must return a JWT in the accessToken field. Check whether login calls generateAccessToken().');
  }
  process.stdout.write(body.accessToken);
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
JS
)

echo 'OK: login returned accessToken (token value hidden).'
request 200 GET /api/products -H "Authorization: Bearer $TOKEN"
echo 'Requests passed. This does not verify JWT enforcement: /api/products currently has no authentication middleware.'
