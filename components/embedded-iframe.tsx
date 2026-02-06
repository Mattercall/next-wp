"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EmbeddedIframeProps = {
  title: string;
  src: string;
};

const DEFAULT_HEIGHT = 900;
const MIN_HEIGHT = 600;

export function EmbeddedIframe({ title, src }: EmbeddedIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_HEIGHT);

  const allowedOrigin = useMemo(() => {
    try {
      return new URL(src).origin;
    } catch {
      return null;
    }
  }, [src]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (allowedOrigin && event.origin !== allowedOrigin) {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const payload = event.data as
        | number
        | {
            height?: number;
            iframeHeight?: number;
            data?: { height?: number; iframeHeight?: number };
          };

      const nextHeight =
        typeof payload === "number"
          ? payload
          : payload?.height ?? payload?.iframeHeight ?? payload?.data?.height ?? payload?.data?.iframeHeight;

      if (typeof nextHeight === "number" && Number.isFinite(nextHeight)) {
        setIframeHeight(Math.max(Math.round(nextHeight), MIN_HEIGHT));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [allowedOrigin]);

  return (
    <section
      className="w-full rounded-lg border border-border/70 bg-background shadow-sm"
      style={{ minHeight: `${MIN_HEIGHT}px` }}
    >
      <iframe
        ref={iframeRef}
        title={title}
        src={src}
        className="block w-full"
        style={{ height: `${iframeHeight}px`, border: 0 }}
        loading="lazy"
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
