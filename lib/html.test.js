const assert = require("node:assert/strict");
const test = require("node:test");
const { decodeEntities } = require("./html");
const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();

test("decodes common HTML entities after stripping HTML", () => {
  const input = "<p>Hello&nbsp;world&hellip; &amp; friends</p>";
  const output = decodeEntities(stripHtml(input));

  assert.equal(output, "Hello world… & friends");
});

test("leaves plain text untouched", () => {
  const input = "Plain text excerpt";

  assert.equal(decodeEntities(input), input);
});
