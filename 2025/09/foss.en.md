---
published: 2025-09-12T20:10:00+09:00
---

Recent open source development updates
======================================

I've found myself creating quite a few open source projects lately,
so I thought I'd write up a status report and overview of my ongoing open source
work.  All these projects are interconnected in various ways.


[Hollo]
-------

This project is actually the catalyst for all the open source projects
I've created recently.  After Elon Musk bought Twitter and renamed it to X,
I started using Mastodon more actively than before.
However, writing in [Korean mixed script] made me self-conscious about whether
it might be difficult for others to read.  I considered adding a feature to
Mastodon that would convert Korean mixed script to hangul-only writing using
[Seonbi], but… it seemed unlikely anyone else would use this feature,
making it unrealistic to push upstream to Mastodon.  That would mean maintaining
downstream patches while self-hosting a Mastodon server, which I wanted to avoid
given Mastodon's notorious resource requirements.  So I decided to create my own
lightweight ActivityPub implementation for personal use: [Hollo].
I named it <q>Hollo</q> from the Korean word meaning <q>alone,</q>
since it's a single-user ActivityPub server.

I successfully [dogfooded] it and have now moved my fediverse account to Hollo.
My fediverse handle is [@hongminhee@hollo.social].  I can freely write in
Korean mixed script, with Chinese characters annotated with Korean
pronunciations using [`<ruby>`] tags.

Since achieving dogfooding status, all the features I urgently needed have been
implemented, so I'm mainly doing maintenance and bug fixes now.

[Hollo]: https://docs.hollo.social/
[Korean mixed script]: https://en.wikipedia.org/wiki/Korean_mixed_script
[Seonbi]: https://github.com/dahlia/seonbi
[dogfooded]: https://en.wikipedia.org/wiki/Eating_your_own_dog_food
[@hongminhee@hollo.social]: https://hollo.social/@hongminhee
[`<ruby>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby


[Fedify]
--------

When I first started implementing Hollo, I tried to build the ActivityPub
implementation from scratch.  However, I realized the ActivityPub implementation
code was thicker and more complex than expected.  So I paused Hollo development
and created an ActivityPub server framework called [Fedify].
Less than six months after creation, it [received funding from Ghost],
which allowed me to work on Fedify full-time for a while.  Currently,
it's been selected as a participating project in the [OSSCA] hosted by
the [Open Source Software Support Center] under NIPA of South Korea,
and I'm working on it with excellent mentees.

ActivityPub server frameworks existed before Fedify, but none provided the level
of abstraction I needed. Some were closer to small libraries that only provided
WebFinger or signature algorithms, while others were almost complete social
media platform implementations comparable to Mastodon, rather than frameworks.
To use an analogy, there were HTTP libraries and CMS platforms like WordPress,
but nothing comparable to frameworks like Rails or Django.

The goals I had in mind when creating Fedify were:

 1. Make it usable by as many developers as possible.
 2. Be database and storage agnostic. Application developers should be able to
    use whatever database they want.
 3. No restrictions on how to utilize the ActivityPub protocol.
    Don't assume a specific application form like microblogging.
 4. Provide everything needed for ActivityPub implementation: authentication,
    signatures, outbox and inbox queues, etc.
 5. Provide documentation rich enough that even those unfamiliar with
    ActivityPub can use it.
 6. Be type-safe.

As I write this, I believe I've largely achieved these goals.  As a result,
Hollo was rebuilt on Fedify, and other projects like Hackers' Pub (discussed
below) and Ghost have implemented ActivityPub using Fedify.  Additionally,
projects like [Kosmo] and [Cosmoslide] are implementing ActivityPub with Fedify,
though they're not yet complete.

[Fedify]: https://fedify.dev/
[received funding from Ghost]: /2024/07/ghost-funds-fedify/
[OSSCA]: https://www.oss.kr/contribution_academy
[Open Source Software Support Center]: https://www.oss.kr/
[Kosmo]: https://github.com/byulmaru/kosmo
[Cosmoslide]: https://github.com/cosmoslide/cosmoslide
*[OSSCA]: Open Source Software Contribution Academy
*[NIPA]: National IT Industry Promotion Agency


[LogTape]
---------

When I wanted to add logging to Fedify, I searched for JavaScript logging
libraries but couldn't find one that met my requirements,
so I created [LogTape].

My requirements weren't particularly demanding: I just wanted something
equivalent to Python's standard library [`logging`] module.  In retrospect,
the `logging` module is quite well-designed.  My requirements were:

 1. Libraries should be able to log, but applications should control
    the library's log output.  Unless the application configures output,
    library logs shouldn't appear anywhere.
 2. Loggers should be hierarchically managed.  Sinks installed on parent loggers
    should apply to child loggers.
 3. Sinks should have an easy-to-implement interface.
 4. Be type-safe.
 5. Work across various JavaScript runtimes including Node.js, Deno, Bun, edge
    functions, and web browsers.

These were mostly requirements for logging from libraries rather than
applications.  Since I made it for Fedify anyway, I left it alone after creating
it, but it somehow gained word-of-mouth popularity last fall and many people
started using it.

[LogTape]: https://logtape.org/
[`logging`]: https://docs.python.org/3/library/logging.html


[Hackers' Pub]
--------------

I wanted to create a blog for software development posts and started using
[velog][^0] briefly, but was disappointed it didn't support ActivityPub,
so I opened an [issue](https://github.com/velog-io/velog/issues/48) on the velog
issue tracker.  Fortunately, I received
a [positive response about considering it], but the team was busy and there's
been no news since.  Eventually, I decided to create my own social media and
blogging platform for software developers that supports ActivityPub:
[Hackers' Pub].

Shortly after launching last winter, [Lee Jae-yeol] joined.  Despite it being
invitation-only, thanks to Lee Jae-yeol's incredibly enthusiastic promotion of
Hackers' Pub everywhere, many people joined and became active.  The short-term
goal is widespread adoption in Korea, with medium to long-term goals of reaching
across East Asia and English-speaking regions.  However, most contents are still
in Korean, with a few Japanese users occasionally posting Japanese contents.

Since it implements ActivityPub through Fedify, it naturally communicates with
Hollo, Mastodon, Misskey, and others. You can write short posts (`Note`) like X,
or longer articles (`Article`).  It also provides features like emoji reactions
and quotes that Mastodon doesn't have.

Another point of pride for Hackers' Pub is our [code of conduct] for creating
a safe and equitable community. My favorite passage is:

> We distinguish between discriminatory speech and speech that confronts
> discrimination.

On the technical side, it was originally built with [Deno] and [Fresh],
but we're currently migrating to [GraphQL] and [SolidStart] with help from
[Iha Shin], who has deep expertise in web frontend development.[^1]

The source code is available on [GitHub] under [AGPL 3.0].  Many Hackers' Pub
users actively submit pull requests to fix issues they encounter.

My Hackers' Pub account is [@hongminhee@hackers.pub].

[^0]: A blogging platform for software developers widely used in Korea,
      similar to DEV.to.
[^1]: While I regret using Deno for various reasons, we're stuck with it even
      after migration.

[Hackers' Pub]: https://hackers.pub/
[velog]: https://velog.io/
[issue]: https://github.com/velog-io/velog/issues/48
[positive response about considering it]: https://github.com/velog-io/velog/issues/48
[Lee Jae-yeol]: https://kodingwarrior.github.io/
[code of conduct]: https://hackers.pub/coc
[Deno]: https://deno.com/
[Fresh]: https://fresh.deno.dev/
[GraphQL]: https://graphql.org/
[SolidStart]: https://start.solidjs.com/
[Iha Shin]: https://xiniha.dev/
[GitHub]: https://github.com/hackers-pub/hackerspub
[AGPL 3.0]: https://www.gnu.org/licenses/agpl-3.0.en.html
[@hongminhee@hackers.pub]: https://hackers.pub/@hongminhee


[Upyo]
------

While building Hackers' Pub, I needed to send emails and looked for an email
sending library that would allow easy switching between email providers.
Unable to find anything satisfactory, I created [Upyo].  Its name is derived
from the Korean word <q lang="ko">郵票</q> (postage stamp).

I was originally looking for something like .NET's [FluentEmail] in
the JavaScript ecosystem, but was surprised to find nothing suitable.
Is switching or multiplexing email providers less common than I thought?

This was also my first project seriously using an LLM-based coding agent[^2].
Still, my expectations for LLM capabilities aren't that high,
so I did the design and initial coding myself, then got significant help from
the LLM when expanding the variety of transports.  I think it took two days
to build. The coding agent's impressive productivity was notable.

Like my other libraries, it supports various JavaScript runtimes including
Node.js, Deno, Bun, edge functions, and web browsers.

[^2]: I used [Claude Code].

[Upyo]: https://upyo.org/
[Claude Code]: https://docs.anthropic.com/en/docs/claude-code/overview
[FluentEmail]: https://github.com/lukencode/FluentEmail


[Optique]
---------

Fedify provides a CLI tool called the `fedify` command alongside the framework.
I was using [Cliffy], a Deno-specific CLI framework, reasonably well,
but needed to find an alternative when we had to support Node.js and Bun
in addition to Deno[^3].  Following a similar pattern… I couldn't find anything
I liked.

Actually, I already had a near-ideal CLI parser library in mind:
[optparse-applicative], a Haskell library.  I just couldn't use it with Fedify
because it was in Haskell.  The idea behind optparse-applicative is simple:
since CLI parsers are parsers, let's build them with parser combinators.

Anyway, unable to find the CLI parser library I wanted, I had to make my own.
That's how [Optique] was born.

Initially, I tried to port it almost identically to optparse-applicative,
but Haskell and JavaScript have significant differences in expressive power for
constructing DSLs.  After much consideration, I decided to mimic the API of
validation libraries like [Zod](https://zod.dev/), which TypeScript developers
are already familiar with.

Unlike the Upyo project, I used LLM coding agents very limitedly for
documentation and test code writing, which may be why it took over a week
to build.

After completion, I can say I created a fairly unique CLI parser library within
the JavaScript ecosystem.  While many CLI applications don't require such
complex options, I'm confident that anyone building a moderately complex CLI
application won't regret using Optique.

Oh, and like the other libraries I've introduced, it works on Node.js, Deno,
Bun, and even edge functions and web browsers.  You might wonder if that's
necessary; it's just self-satisfaction, I suppose.  However, it did make
the library very easy to test.

[^3]: While the Fedify framework itself already supported Node.js, Deno, Bun,
      Cloudflare Workers, etc., the CLI tool `fedify` command was Deno-only.

[Optique]: https://optique.dev/
[Cliffy]: https://cliffy.io/
[optparse-applicative]: https://github.com/pcapriotti/optparse-applicative
[Zod]: https://zod.dev/


Yak shaving
-----------

Come to think of it, the driving force behind my open source development might
be yak shaving.  I once read Anthony Fu's [*About Yak Shaving*] and was struck
by how similar our motivational approaches are.  When something bothers me and
I try to build a tool to fix it, I encounter another annoyance while building
that tool and end up creating another tool to solve that.  Often I don't
accomplish what I originally set out to do, but the byproducts created along
the way don't just disappear.

Looking back to the very beginning, what I really wanted was to write on
the fediverse in Korean mixed script.  To achieve this, I created Hollo, Fedify,
LogTape, and even Optique.  Along the way, new desires emerged, and I formed
valuable connections through communities like Hackers' Pub.  Oh, and I finally
achieved my original goal of writing in Korean mixed script on the fediverse
late last year!  Though I did have to submit patches to Mastodon and Misskey
in addition to the byproducts I mentioned.[^4]

All this happened over roughly two years, and it's been an incredibly fun and
enriching journey.  I'll likely continue doing open source development full-time
for a while, and I'm grateful for this opportunity and determined to make
the most of it.

[^4]: The receiving side also needed to be able to render `<ruby>` tags.

[*About Yak Shaving*]: https://antfu.me/posts/about-yak-shaving
