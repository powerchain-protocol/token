#!/usr/bin/env bash
set -euo pipefail

# Node cannot start when the shell is still inside a directory that has been
# deleted or replaced. Move to a known existing checkout before invoking pnpm.
for candidate in "${POWERCHAIN_ROOT:-}" "/workspaces/token" "$(git rev-parse --show-toplevel 2>/dev/null || true)"; do
  if [[ -n "$candidate" && -f "$candidate/package.json" && -f "$candidate/pnpm-workspace.yaml" ]]; then
    cd "$candidate"
    printf 'Recovered PowerChain workspace: %s\n' "$PWD"
    exec "${SHELL:-/bin/bash}"
  fi
done
printf 'Unable to find the PowerChain workspace. Set POWERCHAIN_ROOT to the checkout path.\n' >&2
exit 1
