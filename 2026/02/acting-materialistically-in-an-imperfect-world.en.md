---
published: 2026-02-22T06:40:00+09:00
---

Acting materialistically in an imperfect world: LLMs as means of production and social relations
================================================================================================

<small>This is a follow-up to last month's
[Histomat of F/OSS: We should reclaim LLMs, not reject them][0].</small>

   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Cory Doctorow [celebrated the sixth anniversary of <cite>Pluralistic</cite>][1] by walking
readers through his publishing workflow. Among other things, he mentioned
running each post through Ollama, an open-source LLM, to catch typos before
publication. The predictable pushback followed. Two days later, German
technology critic tante responded with a piece titled
<cite>[Acting ethically in an imperfect world][2]</cite>.

Borrowing his title felt like the right place to start. Acting ethically in an
imperfect world—that is his question. I want to answer the same question with a
different framework. Not ethics, but materialism.

In [my previous piece][0], I pushed licensing too far to the front as a means
of reclaiming LLMs. I took criticism for being naïve, and I accept some of it.
What I was arguing for was a *direction*, not a *prescription*. This piece
tries to sharpen that direction.

[0]: /2026/01/histomat-foss-llm/
[1]: https://pluralistic.net/2026/02/19/now-we-are-six/
[2]: https://tante.cc/2026/02/20/acting-ethical-in-an-imperfect-world/


Two strawmen
------------

tante makes some fair points. Doctorow portrayed LLM critics as purists who
object to the technology because its creators are bad people—a strawman. The
actual criticisms come from somewhere else entirely: the enormous consumption
of electricity and water, the collection of training data without consent, the
exploitative labeling work done in the Global South, the harm inflicted on the
knowledge commons including the open source ecosystem. Doctorow reduced all of
this to “you just don't like Sam Altman,” and tante was right to call that out.

The Bluesky point lands too. Doctorow refused to create a Bluesky account on
ideological grounds, because he objects to the centralized control Bluesky's
corporation holds over the network. He believes in, and practices, refusing
technology based on one's values. When others refuse LLMs for the same kind of
reason, he calls it purism. tante identified this double standard precisely.

But tante falls into the same trap.

In critiquing the direction of reclamation, he effectively limits it to one
path: building a frontier model from scratch that rivals GPT. That would take
billions of dollars and produce the same environmental costs in the process, so
reclamation is unrealistic—or so the argument goes. But just as Doctorow
oversimplified the criticism of LLMs, tante oversimplified the paths to
reclaiming them. Legal resistance through licensing is one path. Regulatory
pressure that compels corporations to release proprietary models is another.
Collectively building public foundation models is another still. Which of these
might actually work depends on political and social conditions that remain
open. When I mentioned licensing in my previous piece, it was the first example
that came to mind, nothing more.


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
them, that turned workers into appendages of the machine rather than freeing
them. That was not the nature of machinery; it was the nature of how machinery
was deployed. Marx was not mocking the Luddites. He was describing how a
struggle matures.

This framework still holds in the LLM debate. tante's approach is fundamentally
ethical: he evaluates the technology itself on moral grounds and decides
whether to use it accordingly. Doctorow's approach is not so different—the
evaluation just runs in the opposite direction. Both treat technology as a
moral object.

A materialist approach asks different questions. What social relations does
this technology sit inside? Who owns it, whose labor maintains it, and where
does the surplus go? And can those relations be changed?

The “for or against AI” framing buries these questions. The reason it looks
inconsistent to criticize the major AI vendors while remaining open to LLMs as
a technology is that the framing assumes the technology and its capitalist
application are the same thing. That assumption is wrong.


Libraries and people
--------------------

LLMs are not libraries. The criticism that a library connects people to the
original source while an LLM produces answers without one is not entirely
wrong. But I think LLMs are closer to people.

Human beings spend their entire lives absorbing vast quantities of text, code,
and images, without asking permission from the copyright holders. They work
that material into something of their own and produce, at times, something that
is little more than pastiche and, at other times, connections nobody had made
before.

[Nicholas Carlini at Anthropic recently ran an experiment][3] in which he
tasked Claude Opus 4.6 with writing a C compiler in Rust from scratch, without
internet access, in a clean-room setting. The result was a
hundred-thousand-line compiler that builds the Linux 6.9 kernel on x86, ARM,
and RISC-V; compiles PostgreSQL, FFmpeg, SQLite, and Redis; and passes 99% of
the GCC torture test suite. To my knowledge, no Rust-written C compiler has
come close to that. It is hard to call this reproduction.

LLMs are not always creative, of course, any more than people always are. The
point of the analogy is not to flatter LLMs. It is that the criticism built on
the premise that “LLMs only reproduce” is standing on shakier ground than it
appears.

The same framework makes clearer why not all generative AI is alike. The
difference between LLMs and image generation models is not a technical one—it
is a difference in what kind of labor is displaced and how. When an image
generation model produces work in the style of a specific artist, it directly
encroaches on that artist's market. This is not the replacement of a function;
it is the replacement of an existence. Where the surplus goes in that
transaction is telling. Marx's concept of the *Verelendung* of labor plays out
more directly in image generation than anywhere else in this space. Whether the
same measure applies to LLMs is a much more complicated question.

[3]: https://www.anthropic.com/engineering/building-c-compiler


The default viewpoint
---------------------

There is one more thing I want to say, and it is personal.

tante's essay is on the web, but it appears to be configured to serve garbage
to LLM scrapers. Korean is my first language; English is my second. A text like
tante's, where the nuances of the argument and its unstated premises matter,
does not survive conventional machine translation intact. You need something at
the level of an LLM for the reasoning to come through. I ended up copying the
essay by hand and feeding it to one.

tante argues that LLMs sever the connection between reader and author: search
engines lead you to the original, while LLMs extract the content and keep you
inside their own loop. There is something to that. But my experience shows
whose perspective that picture was drawn from. For a fluent English reader, an
LLM might well be a technology that cuts connections. For a reader working in a
second language, an LLM is sometimes the technology that *makes* connection
possible in the first place. tante's decision to block LLM scrapers is
consistent with his own logic, but it ended up reinforcing the asymmetry
between readers who are fluent in English and those who are not.

This is not just an irony. The asymmetry operates across the whole of
technology discourse. Whose viewpoint is set as the default? What social
relations produced that default?

Acting materialistically means starting by refusing to take that default for
granted. Before asking whether a technology is good or bad, ask who it works
for, on whose labor it runs, and in whose interest. That question is not a
reason to reject the technology. It is a reason to reclaim it, and I still
think that is where we need to go.
