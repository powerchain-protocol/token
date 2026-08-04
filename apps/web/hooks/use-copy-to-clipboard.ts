"use client";

import { useCallback, useState } from "react";

export function useCopyToClipboard(resetAfterMs = 1_800) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), resetAfterMs);
  }, [resetAfterMs]);
  return { copied, copy } as const;
}
