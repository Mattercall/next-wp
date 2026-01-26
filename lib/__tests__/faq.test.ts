import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractFaqSchemaFromHtml } from "../faq";

describe("extractFaqSchemaFromHtml", () => {
  it("returns FAQPage schema when FAQ section with multiple questions is present", () => {
    const html = `
      <h2 id="faq">FAQ</h2>
      <h3>1. What is Next?</h3>
      <p>Next.js is a React framework.</p>
      <p>It supports server rendering.</p>
      <h3>Q: How do I install it?</h3>
      <p>Use your package manager.</p>
      <ul>
        <li>npm install next</li>
        <li>pnpm add next</li>
      </ul>
    `;

    const schema = extractFaqSchemaFromHtml(html);

    assert.ok(schema);
    assert.equal(schema["@type"], "FAQPage");
    assert.equal(schema.mainEntity.length, 2);
    assert.equal(schema.mainEntity[0].name, "What is Next?");
    assert.equal(
      schema.mainEntity[0].acceptedAnswer.text,
      "Next.js is a React framework.\nIt supports server rendering.",
    );
    assert.equal(schema.mainEntity[1].name, "How do I install it?");
    assert.equal(
      schema.mainEntity[1].acceptedAnswer.text,
      "Use your package manager.\n- npm install next\n- pnpm add next",
    );
  });

  it("returns null when no FAQ section is present", () => {
    const html = `
      <h2>Overview</h2>
      <p>This is a regular post.</p>
      <h3>Not a question</h3>
      <p>Still not a FAQ section.</p>
    `;

    const schema = extractFaqSchemaFromHtml(html);

    assert.equal(schema, null);
  });

  it("strips separator-only lines from FAQ answers", () => {
    const html = `
      <h2 id="faq">FAQ</h2>
      <h3>Question one?</h3>
      <p>First line.</p>
      &#8212;
      <p>Second line.</p>
      <h3>Question two?</h3>
      <p>Alpha.</p>
      <p>&#8212;</p>
      <p>Beta.</p>
      <h3>Question three?</h3>
      <p>Start.</p>
      <p>—</p>
      <p>End.</p>
    `;

    const schema = extractFaqSchemaFromHtml(html);

    assert.ok(schema);
    assert.equal(schema.mainEntity.length, 3);
    assert.equal(schema.mainEntity[0].acceptedAnswer.text, "First line.\nSecond line.");
    assert.equal(schema.mainEntity[1].acceptedAnswer.text, "Alpha.\nBeta.");
    assert.equal(schema.mainEntity[2].acceptedAnswer.text, "Start.\nEnd.");
  });

  it("detects FAQ headings with punctuation and extra words", () => {
    const html = `
      <h2>FAQs: Common questions</h2>
      <h3>Question one?</h3>
      <p>First answer.</p>
      <h3>Question two?</h3>
      <p>Second answer.</p>
    `;

    const schema = extractFaqSchemaFromHtml(html);

    assert.ok(schema);
    assert.equal(schema.mainEntity.length, 2);
  });
});
