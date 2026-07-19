#!/usr/bin/env bash
#
# audit-tools.sh — check that the external tools the platform depends on are
# installed, and (optionally) that the runtime services are healthy.
#
# Why: several features shell out to out-of-band binaries that live OUTSIDE the
# repo — ImageMagick (tools/image-resize), the claude CLI (aethery chat),
# cloudflared (the tunnel), pm2 (process mgmt). If one silently goes missing
# (fresh box, failed install, PATH change) the feature breaks with no build
# error. This script makes that visible in one glance.
#
# Meant to be the core of a periodic "audit out-of-band tools" skill: run it on
# the NUC on a schedule, alert when the exit code is non-zero.
#
# Usage:
#   scripts/audit-tools.sh            # tool presence + versions (portable)
#   scripts/audit-tools.sh --health   # also check pm2 apps + brain health (NUC)
#   scripts/audit-tools.sh --json     # machine-readable output (for the skill)
#
# Exit code: 0 = all required tools present (and, with --health, services up);
#            1 = something required is missing / down.

set -uo pipefail

# ── options ─────────────────────────────────────────────────────────────────
JSON=0
HEALTH=0
for arg in "$@"; do
  case "$arg" in
    --json) JSON=1 ;;
    --health) HEALTH=1 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

# ── make sure we can find tools even in a non-interactive shell ──────────────
# (pm2/node/claude live in the nvm bin; cloudflared in ~/.local/bin)
for d in "$HOME"/.nvm/versions/node/*/bin; do [ -d "$d" ] && PATH="$d:$PATH"; done
PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export PATH

# ImageMagick can be pinned via MAGICK_BIN (e.g. a portable AppImage on the NUC).
# Learn it from brain/.env so the audit checks exactly what the brain uses.
# $0-relative works when the script is run in place; the NUC deploy path is a
# fallback for when it's piped in (e.g. `ssh host bash -s < audit-tools.sh`,
# where $0 is not the script's real location).
if [ -z "${MAGICK_BIN:-}" ]; then
  for envf in \
    "$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/brain/.env" \
    "$HOME/prod/xaolonist.eth/brain/.env"; do
    [ -f "$envf" ] || continue
    MAGICK_BIN="$(grep -m1 '^MAGICK_BIN=' "$envf" 2>/dev/null | cut -d= -f2-)"
    [ -n "$MAGICK_BIN" ] && break
  done
fi

# ── pretty output ───────────────────────────────────────────────────────────
if [ -t 1 ] && [ "$JSON" -eq 0 ]; then
  G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; D=$'\033[2m'; N=$'\033[0m'
else
  G=""; R=""; Y=""; D=""; N=""
fi

MISSING=0        # required tools not found
DOWN=0           # required services down (with --health)
RESULTS=()       # name|status|version|required|path|used_by  (for JSON)

# check <name> <required:yes|no> <version_arg> <used_by> <candidate...>
check() {
  local name="$1" required="$2" varg="$3" used="$4"; shift 4
  local found="" path="" bin
  for bin in "$@"; do
    [ -n "$bin" ] || continue
    if command -v "$bin" >/dev/null 2>&1; then found="$bin"; path="$(command -v "$bin")"; break; fi
    if [ -x "$bin" ]; then found="$bin"; path="$bin"; break; fi
  done

  local status version=""
  if [ -n "$found" ]; then
    status="ok"
    # grab the first version-looking token from the tool's own version output
    version="$("$found" $varg 2>&1 | grep -m1 -oE '[0-9]+(\.[0-9]+)+[0-9A-Za-z.\-]*' | head -1)"
    [ -n "$version" ] || version="installed"
  elif [ "$required" = "yes" ]; then
    status="missing"; MISSING=$((MISSING + 1))
  else
    status="absent"   # optional, not found — not an error
  fi

  RESULTS+=("$name|$status|$version|$required|$path|$used")

  [ "$JSON" -eq 1 ] && return
  local icon col detail
  case "$status" in
    ok)      icon="✓"; col="$G"; detail="$version" ;;
    missing) icon="✗"; col="$R"; detail="MISSING  ⚠ REQUIRED" ;;
    absent)  icon="•"; col="$Y"; detail="not installed (optional)" ;;
  esac
  printf "  ${col}[%s] %-14s${N} %-22s ${D}%s${N}\n" "$icon" "$name" "$detail" "$used"
  [ "$status" = "ok" ] && [ -n "$path" ] && printf "      ${D}%s${N}\n" "$path"
}

# ── the tool manifest — add a line here when a new tool becomes a dependency ─
[ "$JSON" -eq 0 ] && echo "${D}tools — external binaries the platform depends on${N}"
check "ImageMagick" yes "-version"  "tools/image-resize"          "${MAGICK_BIN:-}" magick convert
check "node"        yes "-v"        "brain runtime + build"       node
check "yarn"        yes "-v"        "install / build / deploy"    yarn
check "git"         yes "--version" "deploy (git pull on NUC)"    git
check "pm2"         yes "-v"        "process mgmt (brain, tunnel)" pm2
check "cloudflared" yes "--version" "CF tunnel → brain reachable" cloudflared
check "claude"      yes "--version" "aethery chat brain"          claude
check "curl"        no  "--version" "health checks / ops"         curl
check "unzip"       no  "-v"        "ops: inspect resized zips"   unzip

# ── optional runtime health (meaningful on the NUC) ─────────────────────────
HEALTH_RESULTS=()
if [ "$HEALTH" -eq 1 ]; then
  [ "$JSON" -eq 0 ] && echo "" && echo "${D}runtime — pm2 apps + brain health${N}"

  # pm2 apps that must be online (parse pm2 jlist with node for an exact status)
  for app in aethery-brain aethery-tunnel; do
    if ! command -v pm2 >/dev/null 2>&1; then
      state="no-pm2"
    elif ! command -v node >/dev/null 2>&1; then
      state="no-node"
    else
      state="$(pm2 jlist 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);const p=a.find(x=>x.name===process.argv[1]);console.log(p?p.pm2_env.status:"not-found")}catch{console.log("parse-error")}})' "$app" 2>/dev/null)"
      [ -n "$state" ] || state="unknown"
    fi
    HEALTH_RESULTS+=("pm2:$app|$state")
    if [ "$JSON" -eq 0 ]; then
      if [ "$state" = "online" ]; then printf "  ${G}[✓] %-20s${N} %s\n" "$app" "$state"
      else printf "  ${R}[✗] %-20s${N} %s\n" "$app" "$state"; fi
    fi
    [ "$state" != "online" ] && DOWN=$((DOWN + 1))
  done

  # brain health endpoint
  brain="down"
  if command -v curl >/dev/null 2>&1; then
    resp="$(curl -s -m 6 http://127.0.0.1:3123/health 2>/dev/null)"
    echo "$resp" | grep -q '"ok":true' && brain="ok"
  else
    brain="no-curl"
  fi
  HEALTH_RESULTS+=("brain:health|$brain")
  if [ "$JSON" -eq 0 ]; then
    if [ "$brain" = "ok" ]; then printf "  ${G}[✓] %-20s${N} %s\n" "brain /health" "$resp"
    else printf "  ${R}[✗] %-20s${N} %s\n" "brain /health" "$brain"; fi
  fi
  [ "$brain" != "ok" ] && DOWN=$((DOWN + 1))
fi

# ── output / exit ───────────────────────────────────────────────────────────
if [ "$JSON" -eq 1 ]; then
  printf '{\n  "tools": [\n'
  for i in "${!RESULTS[@]}"; do
    IFS='|' read -r name status version required path used <<<"${RESULTS[$i]}"
    printf '    {"name":"%s","status":"%s","version":"%s","required":%s,"path":"%s","used_by":"%s"}' \
      "$name" "$status" "$version" "$([ "$required" = yes ] && echo true || echo false)" "$path" "$used"
    [ "$i" -lt $((${#RESULTS[@]} - 1)) ] && printf ',\n' || printf '\n'
  done
  printf '  ],\n  "health": [\n'
  for i in "${!HEALTH_RESULTS[@]}"; do
    IFS='|' read -r name state <<<"${HEALTH_RESULTS[$i]}"
    printf '    {"name":"%s","state":"%s"}' "$name" "$state"
    [ "$i" -lt $((${#HEALTH_RESULTS[@]} - 1)) ] && printf ',\n' || printf '\n'
  done
  printf '  ],\n  "missing": %d,\n  "down": %d,\n  "ok": %s\n}\n' \
    "$MISSING" "$DOWN" "$([ $((MISSING + DOWN)) -eq 0 ] && echo true || echo false)"
else
  echo ""
  if [ $((MISSING + DOWN)) -eq 0 ]; then
    echo "${G}✓ all required tools present${N}$([ "$HEALTH" -eq 1 ] && echo " ${G}and services healthy${N}")"
  else
    [ "$MISSING" -gt 0 ] && echo "${R}✗ $MISSING required tool(s) missing${N}"
    [ "$DOWN" -gt 0 ] && echo "${R}✗ $DOWN service(s) down${N}"
  fi
fi

[ $((MISSING + DOWN)) -eq 0 ] && exit 0 || exit 1
