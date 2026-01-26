import { createHash } from "crypto";
import React from "react";

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

type JsonLdProps = {
  data: JsonLdData;
  idPrefix?: string;
};

function toJsonLdString(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function createStableId(json: string, prefix = "jsonld") {
  const hash = createHash("sha256").update(json).digest("hex").slice(0, 10);
  return `${prefix}-${hash}`;
}

export default function JsonLd({ data, idPrefix }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item) => {
        const json = toJsonLdString(item);
        const id = createStableId(json, idPrefix);

        return (
          <script
            key={id}
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
          />
        );
      })}
    </>
  );
}
