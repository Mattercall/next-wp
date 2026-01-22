const HTML_ENTITY_MAP = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
};

function decodeEntities(input) {
  return input.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#")) {
      const isHex = entity[1]?.toLowerCase() === "x";
      const codePoint = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (Number.isNaN(codePoint)) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    }

    const normalized = entity.toLowerCase();
    return HTML_ENTITY_MAP[normalized] ?? match;
  });
}

module.exports = {
  decodeEntities,
};
