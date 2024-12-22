---
published: 2024-12-24T00:00:00+09:00
---

A year with the fediverse
=========================

2024 was truly a year where I was deeply immersed in the fediverse.
I worked on various projects, both large and small, related to the fediverse and
ActivityPub, and some of them received quite positive responses from many people.
I'm writing this to preserve these good memories.


What is the fediverse?
----------------------

Let me briefly explain what the fediverse is—it's a network where different
types of social media can communicate with each other. In other words, two
accounts on completely different social media platforms can follow each other,
comment on each other's posts, and like each other's content. Technically,
this interoperability between different social media platforms is implemented
using the W3C technical standard called [ActivityPub].

Currently, notable social media platforms participating in the fediverse include
[Mastodon], [Pixelfed], [Akkoma], [Misskey], [WordPress], and many more projects
too numerous to list. Most of them are also open source projects. Additionally,
while not open source, Meta's [Threads] has been gradually implementing
ActivityPub since this summer and can now be considered somewhat part of
the fediverse.

Since it's a way for different social media platforms to communicate,
accounts in the fediverse include not just a username but also a server name.
This address format, commonly called a <q>fediverse handle</q>, looks similar to
an email address: @username@host. Through this, accounts belonging to different
servers and platforms can follow and communicate with each other. I also have
a fediverse account, and you can follow me at [@hongminhee@hollo.social].

[ActivityPub]: https://activitypub.rocks/
[Mastodon]: https://joinmastodon.org/
[Pixelfed]: https://pixelfed.org/
[Akkoma]: https://akkoma.social/
[Misskey]: https://misskey-hub.net/en/
[WordPress]: https://ko.wordpress.org/
[Threads]: https://www.threads.net/
[@hongminhee@hollo.social]: https://hollo.social/@hongminhee


Fedify
------

[Fedify] is probably my biggest achievement this year.
Fedify is an ActivityPub server framework written in TypeScript,
which I created because I couldn't find an appropriate level of abstraction for
implementing ActivityPub servers. I initially tried building an ActivityPub
server app from scratch several times and managed to create something that worked,
but I wasn't entirely satisfied with the code. As I started writing it again
with proper abstraction in mind, I realized I was essentially building a framework,
and this made me deeply appreciate the necessity of an ActivityPub server
framework like Fedify.

Fedify went through four rewrites—initially in TypeScript, then Python, then
C#, and finally back to TypeScript. The language choice involved several
considerations. First, it needed to support [JSON-LD], ActivityPub's data
exchange format, and needed to be somewhat dynamic to handle JSON-LD easily.
Second, even as a dynamic language, it needed good static typing support,
specifically what's known as [gradual typing].
Finally, it needed to have a large user base and rich ecosystem because I wanted
Fedify to be widely used. After considering everything, I settled on TypeScript.

Including all the rewrites, I started working on it in early December last year,
but counting from the final rewrite, I [began development in late February][1]
and released the first [version 0.1.0] in early March. Before release,
I had planned to call it Fedikit, but [just before release, I discovered there
was already a project with the same name, so I quickly changed it to Fedify][2].
The Python version I worked on under the codename Fedikit is [still available on
GitHub][3].

I can proudly say that Fedify currently provides the most comprehensive set of
features needed for building an ActivityPub server. The fediverse isn't just
about implementing ActivityPub—you need to handle many specifications including
JSON-LD, [Activity Vocabulary], WebFinger, [NodeInfo], [HTTP Signatures],
[Linked Data Signatures], and [Object Integrity Proofs]. Fedify covers all of
these. In fact, Fedify implements many features that aren't even implemented in
major ActivityPub implementations like Mastodon or Misskey. I often see people
who mistakenly think implementing an ActivityPub server is simple after just
skimming the ActivityPub spec, start without any ActivityPub framework,
and end up overwhelmed by its complexity. I strongly recommend using Fedify for
anyone thinking about building an ActivityPub server.

Another aspect I focused on while building Fedify was [documentation][Fedify].
I believed it needed not just [reference documentation] but also comprehensive
manuals covering all of Fedify's features. I would even write the manual
documentation first before implementing new features. As a result,
the documentation has grown quite extensive, and now I'm contemplating how to
translate it into languages other than English.

Finally, my greatest achievement with Fedify was the [Ghost's funding of
Fedify][4]. This allowed me to work on open source full-time for the first time
in my life. Moreover, Ghost is Fedify's biggest user. Ghost's ActivityPub
implementation is well underway and currently in private beta. It will likely
be released to the public next year.

[Fedify]: https://fedify.dev/
[JSON-LD]: https://json-ld.org/
[gradual typing]: https://en.wikipedia.org/wiki/Gradual_typing
[1]: https://github.com/dahlia/fedify/commit/9858cea9db609e7aa7a65b3bcec8dd0d8838b574
[version 0.1.0]: https://github.com/dahlia/fedify/releases/tag/0.1.0
[2]: https://todon.eu/@hongminhee/111976051313889872
[3]: https://github.com/dahlia/fedikit
[Activity Vocabulary]: https://fedify.dev/manual/vocab
[NodeInfo]: https://fedify.dev/manual/nodeinfo
[HTTP Signatures]: https://fedify.dev/manual/send#http-signatures
[Linked Data Signatures]: https://fedify.dev/manual/send#linked-data-signatures
[Object Integrity Proofs]: https://fedify.dev/manual/send#object-integrity-proofs
[reference documentation]: https://jsr.io/@fedify/fedify/doc
[4]: https://writings.hongminhee.org/2024/07/ghost-funds-fedify/


Hollo
-----

[Hollo] is a single-user ActivityPub server. While people typically create
fediverse accounts by joining a Mastodon or Misskey server they like,
some software engineers prefer to set up their own server connected to their
own domain name. However, software like Mastodon or Misskey is designed for
multiple users and has many features unnecessary for single users,
making it heavy and complicated to install. Hollo was created for such people.
Hollo only needs PostgreSQL to run, making installation relatively simple,
and it only includes features necessary for single users,
which is its main advantage.

The background of creating Hollo is somewhat complex. Actually,
Hollo could be said to be the catalyst for creating Fedify,
as it was while starting to build an ActivityPub server like Hollo that
I realized the need for an ActivityPub server framework.
However, the code from that initial project wasn't reused in Hollo,
and the project name wasn't even Hollo at that time, so strictly speaking,
Hollo wasn't the direct cause for creating Fedify.
But it's true that after creating Fedify,
what I ultimately wanted to build was something like Hollo.

However, after creating Fedify, Fedify itself became what I wanted to focus on,
and the original motivation somewhat faded. So by the time I actually started
building Hollo, its main purpose had become creating a demo for Fedify.
In fact, while building Hollo, I added needed features to Fedify and fixed bugs.
However, since it was part of the Fedify project, Hollo's code quality is much
lower compared to Fedify. I started addressing this issue after Hollo stopped
being considered part of the Fedify project, but there's still much room for
improvement in code quality.

Unexpectedly, Hollo gained a user base in Japan, leading me to translate
the official documentation into Japanese and even set up a booth at an event
called [Open Source Conference 2024 Tokyo/Fall] in Japan. At this event,
I received tremendous help from [Esurio],
a local Hollo user who helped manage the booth with me.

Recently, for [dogfooding], I migrated from my Mastodon account to Hollo.

[Hollo]: https://docs.hollo.social/
[Open Source Conference 2024 Tokyo/Fall]: https://event.ospn.jp/osc2024-fall/
[Esurio]: https://c.koliosky.com/@esurio1673
[dogfooding]: https://en.wikipedia.org/wiki/Eating_your_own_dog_food


FediDev KR
----------

One day, I realized there wasn't much exchange between developers creating
fediverse software in Korea. So I convinced [Lee Jae-yeol],
who had created a [Mastodon client for Neovim][5],
to help establish the [FediDev KR]. We first set up a [Discord server][6] where
quite a few developers gathered.

We also planned regular sprint meetups and held our [first meetup][7] on August
31st at the [returnzero] office, which surprisingly attracted many participants.
I still maintain connections in the fediverse with people I met there.

Recently, offline interactions have been less frequent due to the year-end,
but we plan to resume active engagement next year.

[Lee Jae-yeol]: https://kodingwarrior.github.io/
[5]: https://github.com/kode-team/mastodon.nvim
[FediDev KR]: https://fedidev.kr/
[6]: https://discord.gg/B2ABMBpHNA
[7]: https://sprints.fedidev.kr/posts/2024-08-31-sprint/
[returnzero]: https://www.rtzr.ai/


First doujinshi sale
--------------------

Since fall this year, I started actively engaging in the Japanese-speaking
fediverse, which led to interactions with Japanese Hollo users.
Among them, [Esurio] suggested participating in the Open Source Conference in
Japan, and after some consideration, I decided to exhibit. Since it was my first
time both participating in a Japanese event and setting up a booth, I received
various forms of help from Esurio. I want to take this opportunity to express
my gratitude.

Anyway, since we decided to exhibit, we needed something to display, so as part
of this, I decided to print and sell a paper version of the Japanese translation
of Fedify's tutorial [Creating your own federated microblog]
(<q lang="ja">[自分だけのフェディバースのマイクロブログを作ろう！]</q>).
Fortunately, most of the books we brought were sold, so we could return quite
light. One of the book purchasers, [Monaco Koukoku]
(<span lang="ja">モナコ広告</span>), even gave a talk titled
[I tried making an ActivityPub server with Fedify]
(<q lang="ja">FedifyでActivityPubサーバを作ってみた</q>) at a [FediLUG]
study meetup, sharing their experience following the tutorial.

It was great to interact with people, even those who didn't buy the book, despite my limited Japanese.

[Creating your own federated microblog]: https://fedify.dev/tutorial/microblog
[自分だけのフェディバースのマイクロブログを作ろう！]: https://github.com/dahlia/fedify-microblog-tutorial-ja
[Monaco Koukoku]: https://monaco.every-little.com/
[I tried making an ActivityPub server with Fedify]: https://www.docswell.com/s/monaco_koukoku/5DN28R-fedilug05-20241123
[FediLUG]: https://fedilug.y-zu.org/


Full-time fediverse development
-------------------------------

Unexpectedly, things have taken a direction I couldn't have predicted at
the beginning of the year, and I've become a sort of full-time fediverse developer.
Next year, I plan to focus on expanding the fediverse's foundation.
As part of this effort, I'm working on creating an ActivityPub-based social
platform for software engineers, which I hope to release soon.