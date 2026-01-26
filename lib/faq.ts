import { decodeEntities, stripHtml } from "@/lib/metadata";

export type FAQPage = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
};

type FaqMatch = {
  question: string;
  answerText: string;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeQuestion(questionHtml: string) {
  const raw = normalizeWhitespace(decodeEntities(stripHtml(questionHtml)));
  return raw.replace(/^(?:\(?\d+\)?[.)]?\s*|q[:.)\s]+|question[:.)\s]+)/i, "").trim();
}

function htmlToPlainText(html: string) {
  if (!html) return "";

  let text = html;
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/(p|div|section|article|blockquote|table|thead|tbody|tr|td|th)>/gi, "\n");
  text = text.replace(/<(p|div|section|article|blockquote|table|thead|tbody|tr|td|th)[^>]*>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "\n- ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<\/(ul|ol)>/gi, "\n");
  text = text.replace(/<(ul|ol)[^>]*>/gi, "\n");
  const separatorRegex = /^\s*([—–-]{2,}|_{2,}|\*{2,})\s*$/;
  const entitySeparatorRegex = /^\s*(?:&#8212;|&mdash;)\s*$/i;
  const singleDashRegex = /^\s*[—–]\s*$/;

  const lines = text
    .split("\n")
    .map((line) => normalizeWhitespace(decodeEntities(stripHtml(line))))
    .filter(Boolean)
    .filter(
      (line) =>
        !separatorRegex.test(line) &&
        !entitySeparatorRegex.test(line) &&
        !singleDashRegex.test(line),
    );

  return lines.join("\n").trim();
}

function findFaqSectionRange(html: string) {
  const headingRe = /<(h1|h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const [, tagName, attributes, innerHtml] = match;
    const text = normalizeWhitespace(decodeEntities(stripHtml(innerHtml)));
    const idMatch = attributes.match(/id\s*=\s*["']([^"']+)["']/i);
    const idValue = idMatch?.[1] ?? "";

    if (!/faq|faqs/i.test(text) && !/faq/i.test(idValue)) {
      continue;
    }

    const startIndex = match.index + match[0].length;
    const rest = html.slice(startIndex);
    const nextHeadingOffset = rest.search(/<(h1|h2)\b/i);
    const endIndex = nextHeadingOffset >= 0 ? startIndex + nextHeadingOffset : html.length;

    return { startIndex, endIndex, tagName };
  }

  return null;
}

function hasFaqJsonLd(html: string) {
  const scriptRe =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRe.exec(html)) !== null) {
    if (/FAQPage/i.test(match[1])) {
      return true;
    }
  }

  return false;
}

function extractFaqItems(html: string): FaqMatch[] {
  const sectionRange = findFaqSectionRange(html);
  if (!sectionRange) return [];

  const sectionHtml = html.slice(sectionRange.startIndex, sectionRange.endIndex);
  const questionRe = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi;
  const questions: Array<{ start: number; end: number; html: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = questionRe.exec(sectionHtml)) !== null) {
    questions.push({
      start: match.index,
      end: match.index + match[0].length,
      html: match[1] || "",
    });
  }

  if (questions.length === 0) return [];

  const items: FaqMatch[] = [];

  questions.forEach((question, index) => {
    const nextQuestion = questions[index + 1];
    const answerHtml = sectionHtml.slice(question.end, nextQuestion?.start ?? sectionHtml.length);
    const questionText = sanitizeQuestion(question.html);
    const answerText = htmlToPlainText(answerHtml);

    if (!questionText || !answerText) return;

    items.push({ question: questionText, answerText });
  });

  return items;
}

export function extractFaqSchemaFromHtml(html: string): FAQPage | null {
  if (!html || hasFaqJsonLd(html)) return null;

  const items = extractFaqItems(html).filter(
    (item) => item.question.length > 0 && item.answerText.length > 0,
  );

  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText,
      },
    })),
  };
}
