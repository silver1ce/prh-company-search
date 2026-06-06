#!/usr/bin/env bash
# Create and push to GitHub under silver1ce (Jahangir).
# Uses username + token/password — no device activation flow.
set -euo pipefail

REPO_OWNER="${GITHUB_USERNAME:-silver1ce}"
REPO_NAME="prh-company-search"
REMOTE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

GH_BIN="${GH_BIN:-gh}"
if ! command -v "$GH_BIN" >/dev/null 2>&1; then
  if [ -x /tmp/gh/gh_2.67.0_macOS_amd64/bin/gh ]; then
    GH_BIN=/tmp/gh/gh_2.67.0_macOS_amd64/bin/gh
  else
    echo "GitHub CLI not found. Install from https://cli.github.com/"
    exit 1
  fi
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GitHub no longer accepts account passwords for API/git over HTTPS."
  echo "Use a Personal Access Token from: https://github.com/settings/tokens"
  echo "(Classic token with 'repo' scope is enough.)"
  echo ""
  read -r -p "GitHub username [${REPO_OWNER}]: " INPUT_USER
  REPO_OWNER="${INPUT_USER:-$REPO_OWNER}"
  read -r -s -p "GitHub token or password: " GITHUB_TOKEN
  echo ""
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "No token provided."
  exit 1
fi

echo "Authenticating as ${REPO_OWNER}..."
printf '%s' "$GITHUB_TOKEN" | "$GH_BIN" auth login --hostname github.com --git-protocol https --with-token

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "${REMOTE_URL}"
else
  git remote add origin "${REMOTE_URL}"
fi

if "$GH_BIN" repo view "${REPO_OWNER}/${REPO_NAME}" >/dev/null 2>&1; then
  echo "Repository exists. Pushing..."
  git push -u origin main
else
  echo "Creating repository ${REPO_OWNER}/${REPO_NAME}..."
  "$GH_BIN" repo create "${REPO_OWNER}/${REPO_NAME}" \
    --public \
    --source=. \
    --remote=origin \
    --description "PRH Company Search — Finnish company lookup via PRH open data API" \
    --push
fi

echo "Done: https://github.com/${REPO_OWNER}/${REPO_NAME}"
