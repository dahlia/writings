AGENTS.md
=========

This file provides guidance to LLM Agents when working with code in this
repository.


Overview
--------

This is a multilingual blog (洪民憙雜記, Hong Minhee on Things) built with
[Jikji], a static site generator for Deno. The blog supports four language
variants: English (`en`), Korean in pure hangul (`ko-Hang-KR`), Korean in mixed
script with hanja (`ko-Kore`), and Japanese (`ja`).

[Jikji]: https://github.com/dahlia/jikji


Commands
--------

~~~~ bash
# Build the site (outputs to public_html/)
deno task build

# Build and watch for changes with local server
deno task serve

# Cache dependencies
deno task cache
~~~~

Build options (passed after `deno task build`):

 -  `--watch`, `-w`: Watch for file changes
 -  `--serve`, `-s`: Run local HTTP server
 -  `--remove`, `-r`: Empty output directory first
 -  `--php`: Generate PHP files for server-side content negotiation
 -  `--base-url`, `-u`: Set base URL
 -  `--out-dir`, `-o`: Set output directory (default: public_html)


Architecture
------------

### Content structure

Blog posts are Markdown files organized by year/month in directories like
*2024/12/*. Each post has language-specific versions indicated by filename
suffix:

 -  *post-name.en.md*: English (`en`)
 -  *post-name.ko-Kore.md*: Korean (`ko-Kore`, 國漢文混用體,
    mixed hanja and hangul)
 -  *post-name.ja.md*: Japanese (`ja`)

The `ko-Hang-KR` (pure hangul Korean) version is auto-generated from `ko-Kore`
using [Seonbi].

[Seonbi]: https://github.com/dahlia/seonbi

### Markdown Front Matter

Posts use YAML front matter with:

 -  `published`: ISO 8601 datetime
 -  `reads`: Custom hanja-to-hangul reading dictionary for Seonbi (optional)

The post title is taken from the first H1 (`# Title` or `===` underline).

### Key Components

 -  *main.ts*: The build pipeline using Jikji. Handles Markdown processing,
    Seonbi transformations, template rendering, and multi-language content
    negotiation.
 -  *templates/*: EJS templates for pages (*post.ejs*), listings (*list.ejs*),
    and Atom feeds (*feed.ejs*).
 -  *site.yaml*: Site metadata including titles and author info in all supported
    languages.
 -  *Seonbi*: Korean typography processor that transforms `ko-Kore` posts to
    `ko-Hang-KR` and applies typographic enhancements (quotes, dashes, hanja
    ruby annotations).

### Build Pipeline Flow

1.  Scan Markdown files from year directories
2.  Detect language from filename suffix and strip it
3.  Convert paths to directory-style URLs (e.g., *2024/12/post/*)
4.  Compile SCSS to CSS
5.  Extract front matter and render Markdown to HTML
6.  Generate ko-Hang-KR variants from ko-Kore via Seonbi
7.  Apply typographic transformations per language
8.  Create multi-view index pages for content negotiation
9.  Generate per-language Atom feeds and listing pages
10. Render with EJS templates
