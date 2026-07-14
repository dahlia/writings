AGENTS.md
=========

This file provides guidance to LLM agents working in this repository.

Overview
--------

This is a multilingual blog (洪民憙雜記, Hong Minhee on Things) built with
Astro on Node.js 26 and deployed to Netlify. Existing pages are prerendered,
while ActivityPub endpoints use Netlify Functions. It supports English
(`en`), Korean in pure Hangul (`ko-Hang-KR`), Korean in mixed script
(`ko-Kore`), and Japanese (`ja`).

Commands
--------

```bash
mise run dev       # Start Astro's development server
mise run build     # Build the site into dist/
mise run check     # Format, type, unit, and production-build checks
pnpm netlify:dev   # Include Netlify Edge/Functions, local DB, and workloads
```

Content
-------

Posts are Markdown files under year/month directories. Source filenames end
in `.en.md`, `.ko-Kore.md`, or `.ja.md`; never write a `.ko-Hang-KR.md` file,
because that representation is derived from `ko-Kore` with Seonbi.

Front matter contains a `published` ISO 8601 timestamp and may contain a
`reads` map for custom Hanja readings. The first H1 is the post title.

Architecture
------------

- `src/loaders/posts.ts` scans and renders Markdown, obtains deterministic
  update times from Git history, runs Seonbi, and creates all language entries.
- `src/pages/` produces the existing explicit language URLs, directory-style
  canonical fallbacks, listing pages, and Atom feeds.
- `src/lib/federation/` defines the `hongminhee` actor, multilingual Articles,
  persistent followers and keys, runtime selection, and deploy reconciliation.
- `src/middleware.ts` routes non-prerendered requests through `@fedify/astro`.
- `netlify/functions/` consumes Fedify queue jobs, reacts to production
  deploys, and performs a daily publication reconciliation.
- `static/style.scss` preserves the horizontal and vertical layouts.
- `netlify/edge-functions/negotiate-language.ts` negotiates canonical URLs by
  cookie and `Accept-Language`. Unsupported or empty preferences fall back to
  English when present, then `ko-Kore`.
- `site.yaml` contains localized site and author metadata.

The WebFinger endpoint remains at `/.well-known/webfinger`, as required by the
protocol. All actor, inbox, outbox, followers, and Article endpoints live below
`/ap/`. Deploy previews and branch deploys must not expose federation endpoints
or process federation workloads.

Keep explicit files such as `index.ko-kore.html` stable. Netlify Pretty URLs
must remain disabled, or Netlify rewrites these public URLs.
