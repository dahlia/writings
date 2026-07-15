---
published: 2026-07-16T01:00:00+09:00
---

I added ActivityPub to this blog
================================

[I built this blog with Jikji, a static site generator I wrote myself,][1]
almost five years ago.  Back then I barely knew TypeScript or modern web
tooling, and I'd never implemented [ActivityPub].  TypeScript and modern
web tooling are second nature to me now, and ActivityPub has become
central to my work.  I maintain [Fedify], for whatever that's worth, and
it bothered me that my own blog wasn't federated.  So I fixed that.

[1]: https://writings.hongminhee.org/2021/12/new-blog/
[Fedify]: https://fedify.dev/
[ActivityPub]: https://www.w3.org/TR/activitypub/


The old stack: Jikji and PHP
----------------------------

This blog used to run on [Jikji], a static site generator I wrote myself in
Deno.  Calling it a static site generator is a bit of a stretch, though.
Like old [Movable Type] installations, it didn't just produce HTML; it
generated a bit of PHP too.  That PHP existed almost entirely for HTTP
[content negotiation]: it read the browser's [`Accept-Language`] header and
chose among Korean mixed script, hangul-only Korean, English, and
Japanese.  That's all it did.

I first considered adding a thin ActivityPub implementation directly in
PHP, since I was already using it.  But I wasn't really writing that PHP by
hand; Jikji generated it for me, and I had no interest in hand-coding PHP
myself.  Federating meant delivering a `Create(Article)` activity to
followers whenever a new post went up, which meant I'd need something like
a message queue.  Bolting a message queue onto Jikji's generated PHP felt,
to me at least, like more complexity than it was worth maintaining.  And
honestly, with Fedify already around, I had no desire to implement
ActivityPub from scratch again.

So I ripped out PHP entirely and decided to bring in Fedify instead.

[Jikji]: https://github.com/dahlia/jikji
[Movable Type]: https://movabletype.org/
[content negotiation]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation
[`Accept-Language`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language


The new stack: Astro and Netlify
--------------------------------

The first decision was to drop Jikji and PHP for [Astro], a JavaScript
framework built for static-content-heavy sites.  I chose Astro largely
because it already had a [@fedify/astro] integration.

I reused as much of the existing CSS and HTML as I could.  I'm happy with
the current design, and redoing it alongside everything else felt like
scope creep waiting to happen.  Permalinks stayed exactly as they were.
I wanted to replace the stack underneath without visitors noticing
anything had changed at all.

For hosting, I went back and forth between Cloudflare Workers and Netlify,
and settled on Netlify partly because Fedify had never run there before,
and this seemed like a good excuse to add that support.  I've hosted
static sites on Netlify plenty of times, but this was my first time
pairing it with edge functions.  The idea of a mostly static site with a
few dynamic slices reminded me of the late-nineties web, when a site was
static HTML except for whatever lived in `/cgi-bin/`.

Publishing used to mean committing a Markdown file to Git, pushing, letting
GitHub Actions build the static site, and deploying it over SFTP.  Now
GitHub Actions is out of the build pipeline entirely, since Netlify builds
the site itself.  It ended up simpler overall.

I'm happy with Astro, and the migration went smoothly.  It beats Jikji,
which I'd barely touched since building it five years ago.  Jikji is now
archived; there's no reason left for me to keep maintaining it.

[Astro]: https://astro.build/
[@fedify/astro]: https://fedify.dev/manual/integration#astro


Fitting Fedify into Astro
-------------------------

### Updating @fedify/astro

Once I actually tried to add Fedify to Astro, I ran into a problem:
@fedify/astro didn't support Astro 7, the current version.  The Astro APIs
it relied on hadn't changed much internally, but the package's declared
compatibility range, and its tests, only went up to Astro 5.  So before I
could federate the blog, I had to fix @fedify/astro first.

That meant more than widening a version range.  The existing tests built a
fake Astro context and called the middleware directly, which couldn't
catch problems with Vite's SSR configuration, compatibility across
adapters, or request routing on a built server.  So I wrote new
compatibility tests that pack `@fedify/astro` for real, install it into a
small Astro app, build and start the app, and send real HTTP requests to
it.

Those tests check, across Astro 5, 6, and 7, that HTML requests reach
Astro's pages, that ActivityPub and WebFinger requests are handled by
Fedify, and that Astro's `404 Not Found` still applies to everything else.
For Astro 7 specifically, I also run the tests against Deno and Bun, not
just the Node.js adapter.

[That work][2] has already been merged upstream and will ship in
Fedify 2.4.0.

[2]: https://github.com/fedify-dev/fedify/pull/936

### Static pages, dynamic endpoints

The Astro project as a whole builds with server output, but the existing
blog pages are still prerendered, same as before.  WebFinger, the actor,
the inbox and outbox, the followers collection, and ActivityPub objects
are the exceptions: Fedify handles those dynamically, per request.  The
middleware @fedify/astro provides looks at a request's URL and `Accept`
header and only intercepts what Fedify is meant to handle.  The same URL
can return the existing Astro page for an HTML request and a Fedify-built
object for an ActivityPub one.

What visitors see is still, for all practical purposes, a static site.
Nearly all the new dynamic surface lives somewhere only other fediverse
servers ever touch.  That's the CGI comparison again.

### `Person` and `Article`

Adding ActivityPub also meant deciding what counts as an actor here, and
what counts as an object.  I gave the blog's actor a [`Person`] type.
Publishing itself is automated, but the actor represents me, the person
writing these posts, not a piece of software or a service.  So the handle
is `@hongminhee@writings.hongminhee.org`, and the actor's web URL points at
the blog.

Each post gets an [`Article`].  It has a title and a body, and it lives at
its own permalink as a long-form document, which fits `Article` better
than `Note`.  Most major ActivityPub implementations support `Article`
these days, Mastodon included.  Human-facing permalinks stayed put;
ActivityPub objects got their own URIs instead, shaped like
`/ap/articles/{year}/{month}/{slug}`.  `Article`'s `url` points back at the
original permalink, so the object's identity and the web page people
actually read stay separate.

Multiple languages took more thought.  Representing each language as its
own `Article` would scatter likes and shares for the same post across
several objects.  So I merged the Korean mixed script, hangul-only Korean,
English, and Japanese versions under a single `Article`, all sharing one
permalink.  Title, summary, and body each carry language-tagged values for
every version, which serialize to JSON-LD as `nameMap`, `summaryMap`, and
`contentMap`.  For implementations that don't handle per-language values,
`name`, `summary`, and `content` also carry a default: English if there's
an English version, Korean mixed script otherwise.  Each language's HTML
page also gets a `Link` on `Article`'s `url`, tagged with `hreflang`.

That way, a receiving server that understands multiple languages can pick
a title and body matching the reader's language, and one that doesn't can
still fall back to the default.  In practice, though, I know of hardly any
ActivityPub implementation that renders these multilingual values properly
yet.  There's [an open issue for it on Mastodon's
tracker][mastodon/mastodon#11013], and [a similar proposal on Hackers'
Pub's][hackers-pub/hackerspub#330], but neither has a timeline.  Some of
that is probably a UI design problem as much as anything else.

[`Person`]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-person
[`Article`]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-article
[mastodon/mastodon#11013]: https://github.com/mastodon/mastodon/issues/11013
[hackers-pub/hackerspub#330]: https://github.com/hackers-pub/hackerspub/issues/330


Running Fedify on Netlify
-------------------------

Unlike serving plain static files, an ActivityPub server needs some state
that outlives any single deploy.  The actor's signing key can't rotate on
every deploy.  The followers list can't disappear on the next one either.
Both live in [Netlify Database].

Incoming and outgoing activities go through a message queue built on
[Async Workloads].  Delivery can be slow or fail outright depending on the
receiving server, so it can't all happen inside the function handling the
HTTP request.  Queuing it separates accepting a request from actually
delivering it, and failed deliveries can be retried later.  [Fedify
already abstracts this][3], with pluggable backend adapters, but there
wasn't yet an adapter for Netlify's Async Workloads.  So I wrote
[the @fedify/netlify package][4], which uses Async Workloads as the queue
and keeps delivery-order state in Netlify Database.

Announcing new posts to the fediverse turned out to be a separate problem.
A static site finishing its build doesn't tell a running ActivityPub
server anything about which posts changed.  So on every successful
production deploy, I diff the current post list against the previous
deploy's.  New posts get a `Create(Article)`; edited ones, whether the
content or just the timestamp changed, get an `Update(Article)`; removed
ones get a `Delete(Article)`.  All of it goes out to followers.  Retries
reuse the same activity ID for the same change, and deploy ordering is
checked so that an older deploy syncing late can't undo a newer one.

Netlify's deploy previews and branch deploys have federation turned off
entirely.  Otherwise every preview would spin up an actor claiming to be
this same blog, and a test deploy could end up sending activities to real
followers.  Locally, I develop against an in-memory store and queue;
production is the only place using the persistent database and queue.

Fedify now runs on Netlify Functions, alongside Deno Deploy and Cloudflare
Workers, on top of its usual support for Node.js, Deno, and Bun.

[Netlify Database]: https://docs.netlify.com/build/data-and-storage/netlify-database/
[Async Workloads]: https://docs.netlify.com/build/async-workloads/get-started/
[3]: https://fedify.dev/manual/mq
[4]: https://github.com/fedify-dev/fedify/pull/934


Wrapping up
-----------

None of this gives the blog a timeline, a reply box, or any other social
feature.  Writing and reading still work the way they always did, and the
permalinks and design are basically untouched.  What changed is that the
blog, and every post on it, now has a name and address the fediverse
understands.  Follow `@hongminhee@writings.hongminhee.org` to get new
posts, or look up a post's ActivityPub object URI to find the original.

I've maintained Fedify long enough to show other developers how to
implement ActivityPub, and I dogfooded it plenty while building [Hollo]
and [Hackers' Pub].  But this was the first time I'd added it to a site
that was already live, and static at that.  Along the way I got a
compatibility test suite for the Astro integration, Netlify support, and a
handful of deployment and operational problems that no amount of reading
docs or unit tests would have surfaced.  It turns out Fedify isn't just
for building new social networks from scratch; it works just as well for
bringing an existing site into the fediverse without changing how it
looks.

[Hollo]: https://docs.hollo.social/
[Hackers' Pub]: https://hackers.pub/
