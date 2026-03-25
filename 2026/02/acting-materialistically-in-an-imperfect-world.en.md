---
published: 2026-02-22T06:40:00+09:00
---

Acting materialistically in an imperfect world: LLMs as means of production and social relations
================================================================================================

<small>This is a follow-up to last month's
[Histomat of F/OSS: We should reclaim LLMs, not reject them][0].</small>

   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Cory Doctorow [celebrated the sixth anniversary of <cite>Pluralistic</cite>][1]
by walking readers through his publishing workflow. Among other things, he
mentioned running each post through Ollama, an open-source LLM, to catch typos
before publication. People reacted exactly as you would expect. Two days later,
German technology critic tante responded with a piece titled
<cite>[Acting ethically in an imperfect world][2]</cite>.

His title was too good not to borrow. Acting ethically in an imperfect
world: that is his question. I want to answer the same question on different
ground. Not ethics, but materialism.

In [my previous piece][0], I pushed licensing too far to the front as a means
of reclaiming LLMs. I was called naïve, and I accept part of that criticism.
I was trying to point to a *direction*, not lay down a program. Here I want
to state that more plainly.

[0]: /2026/01/histomat-foss-llm/
[1]: https://pluralistic.net/2026/02/19/now-we-are-six/
[2]: https://tante.cc/2026/02/20/acting-ethical-in-an-imperfect-world/


Two strawmen
------------

tante makes some fair points. Doctorow portrayed LLM critics as purists who
object to the technology because its creators are bad people—a strawman. The
actual criticisms come from somewhere else: the enormous consumption of
electricity and water, the collection of training data without consent, the
exploitative labeling work done in the Global South, the harm inflicted on the
knowledge commons including the open source ecosystem. Doctorow reduced all of
this to “you just don't like Sam Altman,” and tante was right to call that out.

The Bluesky point lands too. Doctorow refused to create a Bluesky account on
ideological grounds, because he objects to the centralized control Bluesky's
corporation holds over the network. He believes in refusing technology based on
one's values, and he practices it. When others refuse LLMs for the same kind of
reason, he calls it purism. tante identified this double standard precisely.

But tante falls into the same trap.

In critiquing the direction of reclamation, he effectively limits it to one
path: building a frontier model from scratch that rivals GPT. That would take
billions of dollars and produce the same environmental costs, so reclamation is
unrealistic, or so the argument goes. But just as Doctorow oversimplified the
criticism of LLMs, tante oversimplified the paths to reclaiming them. There
is legal resistance through licensing, regulatory pressure that might compel
corporations to release proprietary models, the slower work of building public
foundation models. Which of these can actually work depends on political
and social conditions that haven't settled yet. When I mentioned licensing in
my previous piece, it was the first example that came to mind, nothing more.


Machinery and its capitalist application
----------------------------------------

In the first volume of *Capital*, Marx assessed the Luddite movement in England:

> It took time and experience before the workers learnt to distinguish between
> machinery and its employment by capital, and to transfer their attacks from
> the material instruments of production to the form of society which utilises
> those instruments.

The anger of the workers who smashed the looms was justified. The direction was
wrong. The problem was not the machinery but the capitalist social relations
surrounding it: machinery that extended working hours rather than shortening
them, that turned workers into appendages rather than freeing them. That was
not the nature of machinery; it was the nature of how it was deployed. Marx was
not mocking the Luddites. He was describing how a struggle matures.

tante's approach is fundamentally ethical: he evaluates LLMs on moral grounds
and decides whether to use them accordingly. Doctorow's approach is not so
different; the evaluation just runs in the opposite direction. Both treat
technology as a moral object.

A materialist approach asks different questions. What social relations does
this technology sit inside? Who owns it, whose labor maintains it, where does
the surplus go—and can those relations be changed?

The “for or against AI” framing buries all of this. The reason it looks
inconsistent to criticize the major AI vendors while remaining open to LLMs as
a technology is that the framing assumes the technology and its capitalist
application are the same thing. That assumption is wrong.


Libraries and people
--------------------

LLMs are not libraries. The criticism that a library connects people to the
original source while an LLM produces answers without one is not entirely
wrong. But I think LLMs are closer to people.

Human beings spend their entire lives absorbing text, code, and images, without
asking permission from the copyright holders. They work that material into
something of their own and produce, at times, something that is little more
than pastiche and, at other times, connections nobody had made before.

[Nicholas Carlini at Anthropic recently ran an experiment][3] in which he
tasked Claude Opus 4.6 with writing a C compiler in Rust from scratch, without
internet access, in a clean-room setting. The result was a
hundred-thousand-line compiler that builds the Linux 6.9 kernel on x86, ARM,
and RISC-V; compiles PostgreSQL, FFmpeg, SQLite, and Redis; and passes 99% of
the GCC torture test suite. To my knowledge, no Rust-written C compiler has
come close to that. It is hard to call this reproduction.

That does not make them artists. It does mean the line that they “only
reproduce” is less solid than critics pretend.

Not all generative AI is alike, and the difference is not purely technical. It
is a difference in what kind of labor is displaced and how. When an image
generation model produces work in the style of a specific artist, it directly
encroaches on that artist's market. What gets displaced there is not some
abstract function but a working artist trying to stay alive. Where the surplus
goes in that transaction is telling. Marx's *Verelendung* of labor is more
directly at work in image generation than in LLMs. Whether the same measure
applies to LLMs is a much more complicated question.

[3]: https://www.anthropic.com/engineering/building-c-compiler


The default viewpoint
---------------------

One more thing, and it is personal.

tante's essay is on the web, but it appears to be configured to serve garbage
to LLM scrapers. Korean is my first language; English is my second. A text like
tante's, where the nuances of the argument and its unstated premises matter,
does not survive conventional machine translation intact. You need something at
the level of an LLM for the reasoning to come through. I ended up copying the
essay by hand and feeding it to one.

tante argues that LLMs sever the connection between reader and author: search
engines lead you to the original, while LLMs extract the content and keep you
inside their own loop. There is something to that. But my experience shows
whose perspective shaped that picture. If you already read English fluently,
an LLM can look like a machine for cutting readers off from authors. If you
do not, it can be the thing that lets the argument reach you at all. tante's
decision to block LLM scrapers is consistent with his own logic, but it ended
up reinforcing the asymmetry between readers who are fluent in English and
those who are not.

That is not a side irony. It is the ordinary structure of technology discourse.
Whose viewpoint is set as the default? What social relations produced that
default?

The first question is not whether the technology is pure. It is who it serves,
who labors under it, and who gets shut out. Once you ask that, “reject or
accept” stops being the point. The point is whether these systems remain
capital's property or become something else. I still think that is where we
need to go.
