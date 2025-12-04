---
published: 2025-12-10T00:00:00+09:00
---

My 2025 with the fediverse
==========================

Last year, I wrote an article titled <cite>[A year with the fediverse]</cite>, and this year
I find myself writing on a similar theme again. Since I've started working
full-time on open source software related to the fediverse,[^1] I have a feeling
I'll be writing articles like this every year as long as I continue this work.

[^1]: A decentralized social media network, also known as the fediverse.
      The key concept is that various social media software and services
      implement the [ActivityPub] protocol, a [W3C] Recommendation,
      enabling interoperability between them.

[A year with the fediverse]: /2024/12/a-year-with-the-fediverse/
[W3C]: https://www.w3.org/
[ActivityPub]: https://www.w3.org/TR/activitypub/
*[W3C]: World Wide Web Consortium


*Thinking Penguin Magazine Vol.0*
---------------------------------

I had the opportunity to contribute to *[Thinking Penguin Magazine Vol.0]*,
the first doujinshi published by [FediLUG], a gathering of fediverse developers
in Japan. My article was titled <cite>From mixed script Korean to Hollo</cite>
(<cite lang="ja">国漢文混用体からHolloまで</cite>), covering how I came to create
[Fedify][][^2] and [Hollo][][^3]. This magazine was also exhibited at the 11th
[Gishohaku] (Technical Book Doujinshi Fair). Although I couldn't attend in person
due to time constraints, just being part of the exhibition was a valuable
experience.

[^2]: An ActivityPub server framework written in TypeScript.

[^3]: A single-user ActivityPub server built on top of Fedify. I created it
      because Mastodon was too heavy and had too many unnecessary features
      for solo use.

[FediLUG]: https://fedilug.y-zu.org/
[Thinking Penguin Magazine Vol.0]: https://gishohaku.dev/gishohaku11/books/PmvnNyNv4Rh7dHmt14EH
[Fedify]: https://fedify.dev/
[Hollo]: https://docs.hollo.social/
[Gishohaku]: https://gishohaku.dev/


BotKit
------

Early this year, I created [BotKit], an ActivityPub bot framework built on top
of Fedify. I believe I initially wanted to create some kind of fediverse bot
account, but I honestly can't remember what it was anymore.

In any case, BotKit was born out of frustration with the limitations of creating
an account on an ActivityPub server like Mastodon or Misskey and using their
respective APIs to post. Instead, BotKit apps function as their own ActivityPub
servers. This architecture provides freedom from various constraints like
maximum character limits and rate limits.

After releasing it, several fediverse bots have been created using BotKit,
though admittedly it's not widely used yet.

[BotKit]: https://botkit.fedify.dev/


Hackers' Pub
------------

I created [Hackers' Pub], an invite-only ActivityPub-based community for
software developers, late last year. This year, it gained a lot of traction,
and I got to interact with a truly diverse group of software developers.
In particular, [Lee Jae-yeol] enthusiastically promoted Hackers' Pub,
which brought many people to the community.

In the summer, I commissioned designer [Bak Eunji] to create
[Hackers' Pub's visual identity], and we ended up with an adorable cat logo.
Fortunately, people on Hackers' Pub loved this cat, and it even earned
the nickname <q>Pub Kitty</q> (<span lang="ko">펍냥이</span>). We also made
T-shirts and stickers featuring Pub Kitty, and the response was great.

If you're reading this and are interested in Hackers' Pub, feel free to contact
me personally and I can send you an invitation.

[Hackers' Pub]: https://hackers.pub/
[Lee Jae-yeol]: https://kodingwarrior.github.io/
[Bak Eunji]: https://www.instagram.com/eunjibak/
[Hackers' Pub's visual identity]: https://github.com/hackers-pub/visual-identity


*Software Sessions* appearance
------------------------------

This spring, I had the opportunity to appear on *[Software Sessions]*,
an internet radio show hosted by [Jeremy Jung], to talk about ActivityPub and
Fedify: <cite>[Hong Minhee on ActivityPub]</cite>. However, since it was conducted in
English, I was quite nervous and rambled a lot, which I still regret. I thought I
should practice English conversation more. (But as always, I only thought about
it and never actually followed through...)

[Jeremy Jung]: https://bsky.app/profile/jeremyjung.com
[Software Sessions]: https://www.softwaresessions.com/
[Hong Minhee on ActivityPub]: https://www.softwaresessions.com/episodes/activitypub/


*Finding Our Code* appearance
-----------------------------

For the first time in my life, I also appeared on YouTube. I was featured on
the *Finding Our Code* (<span lang="ko">우리의 코드를 찾아서</span>) series
on [Park Hyunwoo]'s [One Day Dev] channel, in an episode titled
<cite>[Exploring Fedify & Hollo with Minhee]</cite>
(<cite lang="ko">民憙 님과 Fedify & Hollo 알아보기</cite>).
I was able to share the behind-the-scenes story of how I came to create Fedify
and Hollo in a relaxed atmosphere.

[Park Hyunwoo]: https://lqez.dev/
[One Day Dev]: https://www.youtube.com/user/lqez
[Exploring Fedify & Hollo with Minhee]: https://youtu.be/sqxR8zscSDo


Open Source Software Contribution Academy (OSSCA)
-------------------------------------------------

Fedify was selected as a participating project for the 2025
[Open Source Software Contribution Academy][OSSCA] (OSSCA), hosted by the Open Source
Software Integration Support Center (Open UP) under Korea's National IT Industry
Promotion Agency (NIPA). This gave me the opportunity to connect with many
excellent contributors. Over 90 people applied, and I was able to work on
the Fedify project with about 20 of them.

In fact, [Fedify 1.8] and [Fedify 1.9] couldn't have been released without
the contributions of the people I met through OSSCA.

In particular, [ChanHaeng Lee], [Hyeonseo Kim], [Jiwon Kwon], and
[Lee Jae-yeol][][^4] have continued to contribute to Fedify even after the OSSCA
period ended, which is incredibly reassuring. Thanks to this connection,
we all traveled to Fukuoka together in November.

[^4]: Listed in alphabetical order.

[OSSCA]: https://www.oss.kr/contribution_academy
[Fedify 1.8]: https://github.com/fedify-dev/fedify/discussions/354
[Fedify 1.9]: https://github.com/fedify-dev/fedify/discussions/462
[Jiwon Kwon]: https://kwonjiwon.org/
[Hyeonseo Kim]: https://hackers.pub/@gaebalgom
[ChanHaeng Lee]: https://chomu.dev/
*[OSSCA]: Open Source Software Contribution Academy
*[NIPA]: National IT Industry Promotion Agency


Fedify investment
-----------------

Last summer, after receiving [funding from Ghost][Ghost funds Fedify],
I was able to work full-time on the Fedify project for a while. However,
that ended in the first quarter of this year, leaving me back at square one.
To find new funding sources, I applied to [NLnet] this spring, but unfortunately
was rejected. Just as I was considering getting a job, fortunately my
application to [STF] was accepted. I ended up receiving a much more generous
investment than what I could have received from NLnet, turning misfortune into
a blessing. I wrote about this in detail in <cite>[STF invests in Fedify]</cite>.

In any case, I'm grateful that I'll be able to focus full-time on the Fedify
project for the next year.

[Ghost funds Fedify]: /2024/07/ghost-funds-fedify/
[NLnet]: https://nlnet.nl/
[STF]: https://www.sovereign.tech/programs/fund
[STF invests in Fedify]: /2025/10/stf-fedify/
*[STF]: Sovereign Tech Fund


Various presentations
---------------------

This year, I had many opportunities to present at various meetups and
conferences.

My first presentation of the year was at the 8th FediLUG study meetup[^5] held
in early April. I presented under the same title as my article in
*Thinking Penguin Magazine Vol.0*: <cite>[From mixed script Korean to Hollo]</cite>
(<cite lang="ja">国漢文混用体からHolloまで</cite>). The content was largely
the same as the article. Since I couldn't afford to travel to Japan,
the presentation was conducted online.

My next presentation was also in Japan, at the <cite>[Making the fediverse: From
the frontlines of developers and administrators][Fediverse seminar]</cite>
(<cite lang="ja">Fediverseのつくりかた 〜開発者・管理者たちの現場から〜</cite>)
seminar held at [OSC 2025 Kyoto] in early August. I presented on
<cite>[BotKit by Fedify: Easy ActivityPub bot creation for everyone][BotKit talk]</cite>
(<cite lang="ja">BotKit by Fedify：誰でも簡単に作れるActivityPubボット</cite>).
This time too, I participated online since I couldn't make it to Kyoto.

In the fall, I gave the keynote speech at [FOSS for All Conference 2025],
Korea's first free and open source software conference, titled
<cite>[Embracing yak shaving]</cite>
(<cite lang="ko">야크 셰이빙: 새로운 오픈 소스의 原動力</cite>). This
presentation was based on my Japanese presentation <cite>From mixed script Korean
to Hollo</cite>, but also covered my open source projects unrelated to the fediverse.

In winter, I presented at [liftIO 2025], a Korean functional programming conference,
with a talk titled <cite>[Optique: Replacing CLI validation with TypeScript type
inference][Optique talk]</cite>
(<cite lang="ko">Optique: TypeScript의 타입 推論으로 CLI 有效性 檢查를 代替하기</cite>).
This was the only presentation I gave this year that wasn't related to
the fediverse.

[^5]: A study meetup held bimonthly by [FediLUG] in Japan.

[From mixed script Korean to Hollo]: https://speakerdeck.com/minhee/guo-han-wen-hun-yong-ti-karahollomade
[OSC 2025 Kyoto]: https://event.ospn.jp/osc2025-kyoto/
[Fediverse seminar]: https://event.ospn.jp/osc2025-kyoto/session/2211664
[BotKit talk]: https://speakerdeck.com/minhee/botkit-by-fedify-shui-demojian-dan-nizuo-reruactivitypubbotuto
[FOSS for All Conference 2025]: https://2025.fossforall.org/
[Embracing yak shaving]: https://docs.google.com/presentation/d/1BtUm8A8JuEZXxoovPRUPrvgMDTMf4kBOEBKe64cjrFI/edit?usp=sharing
[liftIO 2025]: https://event-us.kr/liftioconf/event/114005
[Optique talk]: https://hongminhee.codeberg.page/optique-liftio-2025/
*[OSC]: Open Source Conference
*[CLI]: command-line interface


Wrapping up the year
--------------------

I thought I hadn't done much, but looking back, I actually accomplished
quite a lot this year. Since the STF investment extends until the end of
next year, I'll likely continue many activities related to the fediverse,
centered around the Fedify project. Personally, I'm worried that ActivityPub
and the fediverse haven't yet established a solid foothold—despite X falling
into Elon Musk's hands. I hope the situation improves next year.
