import type { Metadata } from "next";

type EmbeddedPageProps = {
  title: string;
  description?: string;
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
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </header>

      {url ? (
        <section className="h-[75vh] w-full overflow-hidden rounded-lg border border-border/70 bg-background shadow-sm">
          <iframe
            title={title}
            src={url}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
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
