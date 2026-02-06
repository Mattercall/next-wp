"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type EmbeddedIframeProps = {
  src: string;
  title: string;
};

const DEFAULT_HEIGHT = 900;
const MIN_HEIGHT = 600;

export function EmbeddedIframe({ src, title }: EmbeddedIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_HEIGHT);

  const iframeOrigin = useMemo(() => {
    try {
      return new URL(src).origin;
    } catch {
      return null;
    }
  }, [src]);

  const updateHeight = useCallback((nextHeight: number) => {
    if (!Number.isFinite(nextHeight)) {
      return;
    }

    setIframeHeight((currentHeight) => {
      const normalizedHeight = Math.max(Math.round(nextHeight), MIN_HEIGHT);
      return normalizedHeight === currentHeight ? currentHeight : normalizedHeight;
    });
  }, []);

  const syncSameOriginHeight = useCallback(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    try {
      const iframeDocument = iframe.contentWindow?.document;

      if (!iframeDocument) {
        return;
      }

      const bodyHeight = iframeDocument.body?.scrollHeight ?? 0;
      const documentHeight = iframeDocument.documentElement?.scrollHeight ?? 0;
      updateHeight(Math.max(bodyHeight, documentHeight));
    } catch {
      // Cross-origin iframe: ignore and rely on postMessage-based resizing.
    }
  }, [updateHeight]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (iframeOrigin && event.origin !== iframeOrigin) {
        return;
      }

      const payload = event.data;

      if (!payload || typeof payload !== "object") {
        return;
      }

      if (!("type" in payload) || payload.type !== "embedded-page-height") {
        return;
      }

      const candidateHeight = "height" in payload ? Number(payload.height) : NaN;
      updateHeight(candidateHeight);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeOrigin, updateHeight]);

  useEffect(() => {
    const iframeWindow = iframeRef.current?.contentWindow;

    if (!iframeWindow) {
      return;
    }

    iframeWindow.postMessage({ type: "embedded-page-height-request" }, "*");
  }, [src]);

  return (
    <section
      className="w-full rounded-lg border border-border/70 bg-background shadow-sm"
      style={{ height: `${iframeHeight}px` }}
    >
      <iframe
        ref={iframeRef}
        title={title}
        src={src}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={syncSameOriginHeight}
      />
    </section>
  );
}
