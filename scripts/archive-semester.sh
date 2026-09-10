#!/usr/bin/env bash
#
# Archive a past semester of the site into static/<label>/, so it stays published
# at <site baseUrl>/<label>/ alongside the current semester.
#
# Anything under static/ is copied verbatim into the build output, so an archive
# is never reprocessed by later Docusaurus upgrades and is exempt from the
# broken-link check. The archive is built from a historical commit in a throwaway
# git worktree, with baseUrl rewritten so its internal links and asset URLs
# resolve under the subpath.
#
# Every page in the archive is stamped with a non-dismissible banner saying which
# past semester it covers, so a student who lands on it can't mistake it for the
# current site, plus a robots noindex so search engines don't surface it in the
# first place. See scripts/stamp-archive-banner.py.
#
# Usage:
#   scripts/archive-semester.sh <commit-ish> <label> [--name "Display Name"] [--force]
#
# <label> is the URL path segment and directory name (e.g. fall2025). --name is how
# the semester is written in the banner, defaulting to <label>.
#
# Example:
#   scripts/archive-semester.sh eab5abd fall2025 --name "Fall 2025"
#
# Nothing is committed -- the result is left in the working tree for review.

set -euo pipefail

usage() {
  # Print the leading comment block (from line 2 up to the first non-comment line).
  sed -n '2,${/^#/!q; s/^#\{1,2\} \{0,1\}//p;}' "$0"
  exit "${1:-1}"
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && usage 0
[[ $# -ge 2 ]] || usage

COMMITISH="$1"
LABEL="$2"
shift 2

FORCE=""
DISPLAY_NAME=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --name)
      [[ -n "${2:-}" ]] || { echo "error: --name needs a value" >&2; exit 1; }
      DISPLAY_NAME="$2"; shift 2 ;;
    *) echo "error: unknown argument '$1'" >&2; usage ;;
  esac
done
DISPLAY_NAME="${DISPLAY_NAME:-$LABEL}"

ROOT="$(git rev-parse --show-toplevel)"
CONFIG="$ROOT/docusaurus.config.ts"

# Label becomes a URL path segment and a directory name.
if [[ ! "$LABEL" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "error: label must be lowercase alphanumeric/dashes, e.g. fall2025 (got '$LABEL')" >&2
  exit 1
fi

COMMIT="$(git rev-parse --verify --quiet "${COMMITISH}^{commit}")" || {
  echo "error: '$COMMITISH' is not a commit in this repository" >&2
  exit 1
}

command -v python3 >/dev/null || {
  echo "error: python3 is required (used to stamp the archive banner)" >&2
  exit 1
}

# Derive the site's base path from the current config so this can't drift.
# Matches both `baseUrl: '/x/'` and `baseUrl: process.env.BASE_URL ?? '/x/'`.
SITE_BASE="${SITE_BASE:-$(sed -n "s|.*baseUrl:.*'\(/[^']*\)'.*|\1|p" "$CONFIG" | head -1)}"
if [[ -z "$SITE_BASE" ]]; then
  echo "error: could not read baseUrl from $CONFIG; set SITE_BASE=/your-base/ to override" >&2
  exit 1
fi
ARCHIVE_BASE="${SITE_BASE%/}/$LABEL/"

DEST="$ROOT/static/$LABEL"
if [[ -e "$DEST" && -z "$FORCE" ]]; then
  echo "error: $DEST already exists (pass --force to replace it)" >&2
  exit 1
fi

WT="$(mktemp -d -t archive-semester-XXXXXX)"
OUT="$(mktemp -d -t archive-build-XXXXXX)"
cleanup() {
  git -C "$ROOT" worktree remove --force "$WT" >/dev/null 2>&1 || true
  rm -rf "$WT" "$OUT"
}
trap cleanup EXIT

echo "==> archiving $(git log -1 --format='%h %ad %s' --date=short "$COMMIT")"
echo "    label     $LABEL"
echo "    banner    \"$DISPLAY_NAME\""
echo "    baseUrl   $ARCHIVE_BASE"
echo "    dest      static/$LABEL/"

echo "==> checking out $COMMIT into a temporary worktree"
git -C "$ROOT" worktree add --detach --quiet "$WT" "$COMMIT"

# Rewrite baseUrl to a literal. Done by patching rather than via the BASE_URL env
# var because commits predating that config change would silently ignore the env.
echo "==> rewriting baseUrl"
[[ -f "$WT/docusaurus.config.ts" ]] || {
  echo "error: $COMMIT has no docusaurus.config.ts" >&2
  exit 1
}
sed -i "s|^\([[:space:]]*\)baseUrl:.*|\1baseUrl: '$ARCHIVE_BASE',|" "$WT/docusaurus.config.ts"
if [[ "$(grep -c "baseUrl: '$ARCHIVE_BASE'," "$WT/docusaurus.config.ts")" != "1" ]]; then
  echo "error: failed to rewrite baseUrl in the checked-out config" >&2
  exit 1
fi

echo "==> installing dependencies (this uses that commit's lockfile)"
if [[ -f "$WT/package-lock.json" ]]; then
  npm --prefix "$WT" ci
else
  npm --prefix "$WT" install
fi

echo "==> building"
npm --prefix "$WT" run build -- --out-dir "$OUT"

# Stamp an "old semester" banner into every built page. Done as a post-build pass
# over the HTML rather than via themeConfig.announcementBar or a plugin, because
# that keeps it independent of whatever config shape and Docusaurus version the
# historical commit happened to use -- and it can't be dismissed.
echo "==> injecting archived-semester banner"
"$ROOT/scripts/stamp-archive-banner.py" "$OUT" "$DISPLAY_NAME" "$SITE_BASE"

echo "==> copying into static/$LABEL/"
rm -rf "$DEST"
mkdir -p "$(dirname "$DEST")"
cp -r "$OUT" "$DEST"

echo
echo "done: static/$LABEL/ ($(du -sh "$DEST" | cut -f1), $(find "$DEST" -type f | wc -l) files)"
echo "will publish at $ARCHIVE_BASE after the next deploy"
echo "nothing was committed; review and commit static/$LABEL/ yourself"
