import { decodeEntities } from "@/lib/html";

export type FaqItem = { question: string; answerHtml: string };

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function extractFaqsFromHtml(html: string): FaqItem[] {
  if (!html) return [];

  // 1) Find "FAQ" section start (h2 or h3)
  const sectionRe =
    /<(h2|h3)[^>]*>\s*(faq|faqs|frequently asked questions|häufige fragen|haeufige fragen)\s*<\/\1>/i;

  const sectionMatch = html.match(sectionRe);
  if (!sectionMatch || sectionMatch.index == null) return [];

  const startIndex = sectionMatch.index + sectionMatch[0].length;
  const afterFaq = html.slice(startIndex);

  // 2) Stop at next H2 (new major section) if present
  const nextH2 = afterFaq.search(/<h2[^>]*>/i);
  const faqBlock = nextH2 >= 0 ? afterFaq.slice(0, nextH2) : afterFaq;

  // 3) Extract Q/A pairs where Q is an H3
  // Question = <h3>...</h3>
  // Answer = everything until next <h3> or end of block
  const qaRe = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi;

  const out: FaqItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = qaRe.exec(faqBlock)) !== null) {
    const qHtml = m[1] || "";
    const aHtml = (m[2] || "").trim();

    const question = decodeEntities(stripTags(qHtml));
    const answerText = decodeEntities(stripTags(aHtml));

    // guardrails: skip empties / junk
    if (!question || question.length < 3) continue;
    if (!answerText || answerText.length < 3) continue;

    out.push({
      question,
      // For schema we can use text; but we keep HTML too in case you want to render it
      answerHtml: aHtml,
    });
  }

  return out;
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        // Schema expects text (not HTML). We'll strip tags at render time.
        text: decodeEntities(stripTags(f.answerHtml)),
      },
    })),
  };
}
