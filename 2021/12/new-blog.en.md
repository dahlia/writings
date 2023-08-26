---
published: 2021-12-29T03:27:00+09:00
---
My new blog
===========

I've had two blogs in my life.

My first blog, which I started right before I graduated from high school,
lasted about three years and I wrote over a hundred posts.
It was initially created with a software called Typo[^1],
and I moved to WordPress a few months later.

I started my second blog in 2010 and wrote over 200 posts in seven years.
I started it as a Tumblr, but later moved it to GitHub Pages using a static
blog generator -- something most software engineers do at some point.

I stopped blogging for a while in 2017.  As I stopped writing,
I lost what I wanted to write about, and I had no idea what to write about.
So last spring, I decided to write short pieces on what I read.
Writing them made me want to start blogging again,
but my old blog felt dusty and unmotivating.
Even a lot of what I wrote previously seemed unpleasant.
I've changed my mind about a lot of things since then,
so it wasn't enough to make a few changes.

I was also getting tired of my static blog generator,
which was a single file Python script I made myself.  In the meantime,
I had started writing almost all of my private notes in [Korean mixed script]
(國漢文混用體), so I wanted to write my blogs in mixed script,
at least the raw text.[^2]  I had also written a software called [Seonbi],
which converts Korean mixed script to [hangul] only (한글전용).
So I decided to just create a third blog.[^3]

I started by creating a blog with Jekyll, which is available on GitHub Pages
without any setup, but it wasn't long before I realized that this setup made it
difficult to take advantage of Seonbi.
I probably spent a month or two trying out other static blog generators.
After doing some research, I found that many of the requirements I was asking
for were not very reasonable and therefore not commonly asked for.
In 21st century Korea, who would want to write articles in Korean mixed script
and then publish them in hangul only.

For some strange reason, I ended up creating another static blog generator
called [Jikji].  I also used [Deno] to learn a new platform,
and I liked it a lot, so I'm going to use Deno a lot instead of Python
in the future.  It's a shame that I already dislike it right after
I finished making it, but I promised myself to start a blog before 2021. 

Anyway, now that I've created a new blog,
I'm going to start writing regularly again.

[^1]: It was a blogging software written in Ruby on Rails that was popular
      at the time, and I believe it's now called [Publify].

[^2]: Note to non-Korean speakers: Much of the vocabulary of modern Korean comes
      from [Literary Chinese] (漢文), just as much of the vocabulary of modern
      English comes from Latin.

      When these words are written in Chinese characters and the rest of the
      vocabulary is written in hangul, it is called *mixed script*, and when
      all vocabulary is written in Hangul only, it is called *hangul only*.

      See also related entry on Wikipedia: [Debate on mixed script and hangeul
      exclusivity].

[^3]: I moved my blog three times, but I always did my best to keep
      the permalinks.  Although I've stopped updating both the first and second
      blogs, I'm going to keep them as archives.

[Publify]: https://github.com/publify/publify
[Korean mixed script]: https://en.wikipedia.org/wiki/Korean_mixed_script
[hangul]: https://en.wikipedia.org/wiki/Hangul
[Seonbi]: https://github.com/dahlia/seonbi
[Jikji]: https://github.com/dahlia/jikji
[Deno]: https://deno.land/
[Literary Chinese]: https://en.wikipedia.org/wiki/Classical_Chinese
[Debate on mixed script and hangeul exclusivity]: https://en.wikipedia.org/wiki/Debate_on_mixed_script_and_hangeul_exclusivity
