const namedHtmlEntities: Readonly<Record<string, string>> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(?:#([0-9]+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z]+));/g,
    (
      entity,
      decimal: string | undefined,
      hexadecimal: string | undefined,
      named: string | undefined,
    ) => {
      if (named != null) return namedHtmlEntities[named] ?? entity;
      const codePoint = Number.parseInt(
        hexadecimal ?? decimal!,
        hexadecimal == null ? 10 : 16,
      );
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
    },
  );
}

export function extractDescription(html: string, maxLength = 160): string {
  const text = decodeHtmlEntities(
    html
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${lastSpace > maxLength * 0.8 ? truncated.slice(0, lastSpace) : truncated}…`;
}

export function extractTitle(html: string): string | undefined {
  const heading = extractTitleHtml(html);
  if (heading == null) return undefined;
  return decodeHtmlEntities(heading.replace(/<[^>]+>/g, "")).trim();
}

export function extractTitleHtml(html: string): string | undefined {
  const heading = /<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i.exec(html)?.[1];
  if (heading == null) return undefined;
  return heading
    .replace(/<sup(?:\s[^>]*)?>[\s\S]*?<\/sup>/gi, "")
    .replace(/<!--.*?-->/gs, "")
    .replace(/<a(?:\s[^>]*)?>([\s\S]*?)<\/a>/gi, "$1")
    .trim();
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
