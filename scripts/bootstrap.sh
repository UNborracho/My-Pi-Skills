#!/usr/bin/env bash
# Bootstrap pi configuration on a new machine from this repo.
#
# What it does:
#   - settings.json       (no secrets)  → applied, previous version backed up
#   - auth.json           (SECRET)      → only created if missing, never overwritten
#   - web-search.json     (SECRET)      → only created if missing, never overwritten
#
# Usage:
#   bash scripts/bootstrap.sh [--force-settings]
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${PI_AGENT_DIR:-$HOME/.pi/agent}"
BACKUP_DIR="$DEST/backups/$(date +%Y%m%d-%H%M%S)"

info() { printf '\033[1;32m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

mkdir -p "$DEST" "$BACKUP_DIR"

FORCE_SETTINGS=0
for arg in "$@"; do
  case "$arg" in
    --force-settings) FORCE_SETTINGS=1 ;;
    *) die "unknown argument: $arg" ;;
  esac
done

apply_settings() {
  local src="$REPO_DIR/config/settings.example.json" dst="$DEST/settings.json"
  if [ -f "$dst" ] && [ "$FORCE_SETTINGS" != "1" ]; then
    warn "settings.json already exists — skipping (use --force-settings to overwrite; backup in $BACKUP_DIR)"
    return
  fi
  if [ -f "$dst" ]; then
    cp "$dst" "$BACKUP_DIR/settings.json"
    info "backed up settings.json → $BACKUP_DIR/"
  fi
  cp "$src" "$dst"
  info "applied settings.json"
}

apply_auth() {
  local src="$REPO_DIR/config/auth.example.json" dst="$DEST/auth.json"
  if [ -f "$dst" ]; then
    warn "auth.json already exists — keeping your existing API keys"
    return
  fi
  cp "$src" "$dst"
  info "created auth.json from template — EDIT IT: $dst"
}

apply_websearch() {
  local src="$REPO_DIR/config/web-search.example.json" dst="$HOME/.pi/web-search.json"
  if [ -f "$dst" ]; then
    warn "web-search.json already exists — keeping existing key"
    return
  fi
  mkdir -p "$HOME/.pi"
  cp "$src" "$dst"
  info "created web-search.json from template — EDIT IT: $dst"
}

apply_settings
apply_auth
apply_websearch

cat <<'EOF'

Next steps:
  1. Fill in API keys:
       ~/.pi/agent/auth.json
       ~/.pi/web-search.json
  2. Load skills + extensions from this repo:
       pi install git:github.com/UNborracho/my-pi-skills
     Install any npm packages listed in settings.json:
       pi update --all
  3. Restart pi (or run /reload)

Keeping machines in sync after changes:
  - this machine:  edit + git push
  - other machines: git pull && bash scripts/bootstrap.sh --force-settings && pi update --all
EOF
