"use client";

import { useId, useState } from "react";

type CopyReferenceButtonProps = {
  reference: string | null;
};

export default function CopyReferenceButton({
  reference,
}: CopyReferenceButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const liveRegionId = useId();

  const handleCopy = async () => {
    if (!reference) {
      return;
    }

    try {
      await navigator.clipboard.writeText(reference);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy reference", error);
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const statusLabel =
    status === "copied"
      ? "Reference copied"
      : status === "error"
        ? "Copy failed"
        : "";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        disabled={!reference}
        className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={reference ? "Copy order reference" : "No order reference to copy"}
      >
        Copy reference
      </button>
      <span
        id={liveRegionId}
        aria-live="polite"
        className="text-xs text-slate-500"
      >
        {statusLabel}
      </span>
    </div>
  );
}
