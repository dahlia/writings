import { describe, expect, test } from "vitest";
import { extractDescription, extractTitle, extractTitleHtml } from "./html";

describe("HTML text extraction", () => {
  test("decodes named, decimal, and hexadecimal character references", () => {
    expect(
      extractDescription(
        "<h1>Title</h1><p>A&#x3001; B&#12290; &amp; &lt;C&gt; &quot;D&quot; &#39;E&#x27;</p>",
      ),
    ).toBe(`A、 B。 & <C> "D" 'E'`);
    expect(extractTitle("<h1>A&#x3001; B&#12290;</h1>")).toBe("A、 B。");
  });

  test("decodes character references only once", () => {
    expect(extractDescription("<p>&amp;#x3002;</p>")).toBe("&#x3002;");
  });

  test("preserves title markup but removes footnotes and links", () => {
    const html =
      '<h1><cite class="series"><a href="/book">A &amp; B</a></cite><sup><a href="#fn-1">1</a></sup></h1>';
    expect(extractTitleHtml(html)).toBe(
      '<cite class="series">A &amp; B</cite>',
    );
    expect(extractTitle(html)).toBe("A & B");
  });
});
