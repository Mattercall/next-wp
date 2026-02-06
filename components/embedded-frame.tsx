"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type EmbeddedFrameProps = {
  title: string;
  src: string;
};

const MIN_HEIGHT = 600;

export function EmbeddedFrame({ title, src }: EmbeddedFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);

  const updateHeight = useCallback((nextHeight: number) => {
    if (!Number.isFinite(nextHeight)) {
      return;
    }

    setHeight((currentHeight) => {
      const safeHeight = Math.max(MIN_HEIGHT, Math.ceil(nextHeight));
      return currentHeight === safeHeight ? currentHeight : safeHeight;
    });
  }, []);

  const measureIframeContentHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return null;
    }

    try {
      const doc = iframe.contentDocument;
      if (!doc) {
        return null;
      }

      const bodyHeight = doc.body?.scrollHeight ?? 0;
      const rootHeight = doc.documentElement?.scrollHeight ?? 0;
      return Math.max(bodyHeight, rootHeight);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const handleLoad = () => {
      const measuredHeight = measureIframeContentHeight();
      if (measuredHeight) {
        updateHeight(measuredHeight);
      }

      iframe.contentWindow?.postMessage({ type: "embed-parent-ready" }, "*");
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [measureIframeContentHeight, updateHeight]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const payload = event.data;

      if (typeof payload === "number") {
        updateHeight(payload);
        return;
      }

      if (typeof payload === "object" && payload !== null) {
        const type = "type" in payload ? payload.type : undefined;

        if (
          type === "embed-height" ||
          type === "set-height" ||
          type === "iframe-height" ||
          type === "resize"
        ) {
          const messageHeight = Number("height" in payload ? payload.height : NaN);
          updateHeight(messageHeight);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [updateHeight]);

  useEffect(() => {
    const pollingId = window.setInterval(() => {
      const measuredHeight = measureIframeContentHeight();
      if (measuredHeight) {
        updateHeight(measuredHeight);
      }
    }, 800);

    return () => window.clearInterval(pollingId);
  }, [measureIframeContentHeight, updateHeight]);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      src={src}
      style={{ height: `${height}px` }}
      className="block w-full overflow-hidden border-0"
      loading="lazy"
      scrolling="no"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
