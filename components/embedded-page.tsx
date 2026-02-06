import type { Metadata } from "next";

import { EmbeddedIframe } from "@/components/embedded-iframe";

type EmbeddedPageProps = {
  title: string;
  description: string;
  url?: string;
  missingEnvVarNames: string[];
};

export const buildEmbeddedPageMetadata = (
  title: string,
  description: string,
  path: string
): Metadata => ({
  title,
  description,
  alternates: {
    canonical: path,
  },
});

export function EmbeddedPage({
  title,
  description,
  url,
  missingEnvVarNames,
}: EmbeddedPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      {url ? (
        <EmbeddedIframe title={title} src={url} />
      ) : (
        <section className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900">
          This page is not configured yet. Set one of the following environment variables:
          <code className="mt-2 block rounded bg-black/10 px-2 py-1 text-xs">
            {missingEnvVarNames.join(" | ")}
          </code>
        </section>
      )}
    </main>
  );
}
