#!/usr/bin/env bash
#
# Start the deck review app.
#
#   ./review.sh                 # port 5199, opens a browser
#   ./review.sh --port 6000
#   ./review.sh --no-open
#   ./review.sh --stop          # stop the instance this script started
#
# The app itself is `review-app/server.mjs`, and it takes no arguments this script
# invents: everything after `./review.sh` is passed straight through. See
# `review-app/README.md` for what it does.
#
# WHY THIS FILE EXISTS. `node review-app/server.mjs` only works from the repo root,
# and the first thing anybody does is run it from inside the session they were
# already looking at. This script resolves the repo from its OWN location, so it is
# correct from any directory.

set -euo pipefail

# The repo root is wherever this script lives, resolved through any symlink, so
# `~/bin/review -> .../Web Slides/review.sh` still finds the right repo.
ROOT="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
SERVER="$ROOT/review-app/server.mjs"
PIDFILE="$ROOT/review-app/.review.pid"

if [ ! -f "$SERVER" ]; then
  echo "review.sh: cannot find $SERVER" >&2
  echo "  this script must stay at the repo root, beside review-app/" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "review.sh: node is not on PATH" >&2
  exit 1
fi

# Node 18 is where the app's `node:` imports and top-level await are all safe.
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "review.sh: node $(node -v) is too old, this needs 18 or newer" >&2
  exit 1
fi

# ── --stop, so nobody has to hunt for the process ──────────────────────────
if [ "${1:-}" = "--stop" ]; then
  if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    kill "$(cat "$PIDFILE")"
    rm -f "$PIDFILE"
    echo "review app stopped"
  else
    rm -f "$PIDFILE"
    echo "no review app running from this script"
  fi
  exit 0
fi

# A stale pidfile is normal: the app is usually stopped with Ctrl-C, which never
# gets the chance to remove it.
if [ -f "$PIDFILE" ]; then
  if kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    echo "review.sh: already running as pid $(cat "$PIDFILE")" >&2
    echo "  stop it with ./review.sh --stop, or start another on a different port:" >&2
    echo "  ./review.sh --port 5200" >&2
    exit 1
  fi
  rm -f "$PIDFILE"
fi

echo $$ > "$PIDFILE"
# Remove the pidfile however this exits, including Ctrl-C.
trap 'rm -f "$PIDFILE"' EXIT

# `exec` so the app replaces this shell: Ctrl-C then reaches node directly rather
# than orphaning it behind a wrapper that has already gone.
exec node "$SERVER" "$@"
