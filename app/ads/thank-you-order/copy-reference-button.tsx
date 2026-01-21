"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";

type CopyReferenceButtonProps = {
  reference: string | null;
};

export default function CopyReferenceButton({
  reference,
}: CopyReferenceButtonProps) {
  const [status, setStatus] = useState<string>("");
  const liveRegionId = useId();

  const handleCopy = async () => {
    if (!reference) {
      setStatus("No reference available to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(reference);
      setStatus("Reference copied to clipboard.");
    } catch (error) {
      setStatus("Unable to copy reference. Please copy it manually.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="secondary"
        onClick={handleCopy}
        aria-describedby={liveRegionId}
        disabled={!reference}
      >
        Copy reference
      </Button>
      <span
        id={liveRegionId}
        className="text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {status}
      </span>
    </div>
  );
}
