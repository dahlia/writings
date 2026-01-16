---
published: 2026-01-16T15:00:00+09:00
---

Histomat of F/OSS: We should reclaim LLMs, not reject them
==========================================================

A few days ago, I came across a blog post titled
<cite>[On FLOSS and training LLMs]</cite> that articulates a growing
frustration within the free and open source software community. The author
makes a compelling case about how AI companies demonstrate an utter lack of
respect toward F/OSS developers, how they exploit the idealistic tenets of open
source licensing, and how the law inadequately protects our work from being
used as training fodder for proprietary language models. I found myself nodding
along through much of the piece.

But I fundamentally disagree with the conclusion.

The author's proposed solution is one of denial and isolation: block the
crawlers, withdraw from centralized forges like GitHub, make our work
inaccessible to AI scrapers, and shun those who use these “anti-ethical tools”
from our communities. It's a strategy of refusal, of pulling up the drawbridge.
While I understand the anger that motivates this stance, I believe it misses a
crucial opportunity and misreads the historical pattern that has shaped FLOSS
itself.

[On FLOSS and training LLMs]: https://chronicles.mad-scientist.club/tales/on-floss-and-training-llms/


Where we agree
--------------

Before I explain where I diverge, let me acknowledge where the author is
absolutely right. The current situation is genuinely troubling. AI companies
have indeed demonstrated a profound disrespect for the sources of their
training data. The phrase “I'm legally allowed to do so, so I will” captures
perfectly the contempt these corporations show toward individual developers and
communities. They perform what amounts to a distributed denial of service
attack through their aggressive crawling, they ignore explicit wishes of
content creators, and they provide not even the courtesy of an opt-out
mechanism that actually works.

The author is also correct that the legal battle is likely unwinnable under
current frameworks. F/OSS licenses, by their very nature and definition, permit
use for any purpose without discrimination. [The Open Source Definition]'s
sixth principle explicitly prohibits restrictions on fields of endeavor. Major
licenses like GPL require attribution and have provisions about derived works,
but as the author rightly points out, any competent lawyer could argue that LLM
training doesn't constitute creating a derived work in the traditional sense,
and that statistical pattern extraction doesn't require attribution in the way
code reuse does.

The law, as it stands, is inadequate. It was written for a different era, one
where *“use”* meant running software, modifying it, or redistributing it, not
feeding it into neural networks to extract patterns. The law serves power, and
in this case, power resides with the corporations that can afford legal teams
to navigate and exploit these ambiguities.

[The Open Source Definition]: https://opensource.org/osd


Where we diverge
----------------

This is where I diverge. I don't believe the answer is rejection. I believe
it's reclamation.

The author frames this as a battle between respecting developers and allowing
AI training. But I would argue there's a third way, one that's more consistent
with F/OSS history and more likely to produce a future we'd actually want to
live in. Instead of trying to prevent LLM training on our code, we should be
demanding that the models themselves be freed.

I *want* my code to be used for LLM training. What I don't want is for that
training to produce proprietary models that become the exclusive property of AI
corporations. The problem isn't the technology or even the training process
itself. The problem is the enclosure of the commons, the privatization of
collective knowledge, the one-way flow of value from the many to the few.

This isn't a new problem. It's the same problem FLOSS has always fought, just
wearing new clothes.


On accepting reality
--------------------

Before going further, I want to address something fundamental: different views
on what's happening with LLMs often stem from different assessments of reality
itself.

Recently, Salvatore Sanfilippo (antirez), creator of Redis,
[wrote about his experience with AI coding tools]. His position is instructive
because it comes from someone who, like many of us, deeply values hand-crafted
code and human touch in software. Yet he writes: “It is simply impossible not
to see the reality of what is happening. Writing code is no longer needed for
the most part… Programming changed forever, anyway.”

His conclusion? Adapt. Learn to use these tools. Don't fall into “anti-AI
hype.” He sees LLMs as democratizing technology, much like open source did in
the 90s—enabling small teams to compete with large companies.

I largely agree with antirez's assessment of reality. LLMs have fundamentally
changed programming, and we can't go back. The author of the original post
seems to operate from a different reality assessment—one where resistance is
still meaningful, where withdrawal can be effective, where we can meaningfully
reduce LLMs' access to training data. I'm skeptical. OpenAI and Anthropic have
already scraped what they need. GitHub already has everyone's code. The
training data exists.

But here's where I part ways with antirez's optimism. He worries about
centralization but seems to trust that market competition—including open models
from China—will solve it. He focuses on how developers can adapt and leverage
these tools. That's important, but it sidesteps the deeper question: under what
terms does this transformation happen?

The question isn't whether to use LLMs or adapt to them—that ship has sailed.
The question is: who owns the models? Who benefits from the commons that
trained them? If millions of F/OSS developers contributed their code to the
public domain, should the resulting models be proprietary? This isn't just
about centralization or market dynamics. It's about whether the fruits of
collective labor remain collective, or become private property.

[wrote about his experience with AI coding tools]: https://antirez.com/news/158


The materialist reading
-----------------------

If we look at the history of free and open source software through a
materialist lens, we see a clear pattern: technological change creates new
forms of exploitation, which in turn necessitate new forms of licensing to
protect the commons.

Consider the trajectory:

**[GPLv2]** (1991) addressed the problem of binary distribution. Companies were
taking GPL code, compiling it, and distributing only the binaries, effectively
creating proprietary software from free code. The solution was copyleft: if you
distribute the software, you must provide the source code.

**[GPLv3]** (2007) addressed [Tivoization]. Companies like TiVo were
technically providing source code but using hardware locks to prevent users
from actually running modified versions. The solution was to require not just
source code but installation information, ensuring users retained their freedom
to modify.

**[AGPL]** (2007) addressed [the SaaS loophole]. Companies realized they didn't
need to distribute software at all; they could simply run it as a service and
never trigger GPL's distribution requirements. The solution was to treat
network interaction as equivalent to distribution.

Each step followed the same pattern: new technology revealed a gap in existing
licenses, corporations exploited that gap, and the community responded with
evolved licensing that closed it. This isn't idealism meeting reality and
failing; this is dialectical development, the ongoing process of refining our
tools to match changing material conditions.

Now we face a new gap: the training loophole. Companies can use F/OSS code as
training data for proprietary models without any obligation to release those
models or even acknowledge the sources of their training. This is exploitation
in the classic sense—value extraction without reciprocation.

The materialist response isn't to reject the new technology. It's to evolve our
licenses to encompass it.

[GPLv2]: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
[GPLv3]: https://www.gnu.org/licenses/gpl-3.0.html
[Tivoization]: https://en.wikipedia.org/wiki/Tivoization
[AGPL]: https://www.gnu.org/licenses/agpl-3.0.html
[the SaaS loophole]: https://www.gnu.org/licenses/why-affero-gpl.html


What a training copyleft might look like
----------------------------------------

I envision something like a GPLv4 or TGPL (Training GPL) that would include
provisions such as:

Training is explicitly permitted. This code may be used as training data for
machine learning models. This aligns with F/OSS principles of freedom and
avoids discriminating against fields of endeavor.

But the resulting models must be freed. Any model trained on this code must
have its weights released under a compatible copyleft license. Just as GPLv3
requires source code for binaries, a training copyleft would require model
weights for trained systems.

Training data must be documented. Just as we expect documentation of
dependencies, we should expect clear accounting of what data was used for
training.

Fine-tuned models inherit the obligation. If you fine-tune a copyleft model,
your derived model must also be freed. This prevents the “just barely modify
and claim it's new” dodge.

Network use triggers obligations. Following AGPL's lead, providing a model
through an API would be considered distribution, requiring weight release.


Technical challenges and precedents
-----------------------------------

Would this be technically feasible? Could it be enforced? These are fair
questions, but they're not new questions. They're the same questions that were
asked about every previous GPL evolution.

How do you prove a binary was compiled from your source code? How do you prove
hardware locks prevent modification? How do you prove a service is running your
code? In each case, the answer has been a combination of technical evidence,
community vigilance, and occasional legal action. Perfect enforcement is
impossible, but that doesn't mean the license is worthless. GPL violations
happen, but GPL also works—it has created and protected a massive commons.

The question of proving that specific code was used in training is admittedly
more challenging than proving source code was used in a binary. But it's not
insurmountable. Training datasets can be documented, model genealogies can be
tracked, and statistical analysis can sometimes identify training sources. More
importantly, the mere existence of the license creates social and legal
pressure toward compliance.

There are also questions about mixed training sets. What happens when you train
on both TGPL and non-TGPL code? Again, this is analogous to questions about
linking GPL and non-GPL code, which have been worked out through years of
community practice and occasional court cases. The details matter, but the
principle is sound.


Why this matters more than withdrawal
-------------------------------------

The author's strategy of withdrawal has a certain emotional appeal. There's
satisfaction in denying access, in saying “you don't respect us, so you can't
have our work.” But I think this misses the larger picture in several ways.

It concedes the field. If F/OSS developers withdraw their code from public
accessibility, we're not preventing AI training—we're just preventing *open
source* AI training. OpenAI and Anthropic have already scraped everything they
need. They have massive datasets. What withdrawal prevents is projects like
Llama, Mistral, and the broader ecosystem of open source LLMs from having
access to quality training data.

More importantly, it assumes the problem is the technology rather than its
governance. LLMs aren't inherently exploitative any more than compilers or web
servers are. They're tools, and like all tools under capitalism, they can be
used to concentrate power or to distribute it. By focusing on denial rather
than conditions of use, we risk treating the symptom rather than the disease.

There's also the risk of fragmenting the community. The author calls for
shunning people who use “anti-ethical tools,” making them feel unwelcome,
isolating them. But what constitutes use? What if someone uses GitHub Copilot
to write a contribution to a F/OSS project? What if they use ChatGPT to debug
their code? Where exactly is the line, and who decides? This kind of purity
testing has historically been more effective at splintering movements than at
achieving their goals.

But most critically, it abandons the fundamental F/OSS strategy that has
actually worked: ensuring freedom through licensing conditions rather than
through access control. The genius of GPL wasn't that it prevented anyone from
using the code; it was that it guaranteed everyone's freedom by requiring that
freedom be passed along. Withdrawal is the opposite philosophy.


The future we should build
--------------------------

I want to live in a future where powerful AI models exist and are accessible to
everyone, not just to corporations that can afford to train them. It should be
a world where the knowledge encoded in millions of F/OSS projects becomes part
of a commons rather than privatized into proprietary models—where if my code
helps train a model, that model is available for me and everyone else to use,
study, modify, and share.

This future doesn't come from withdrawal. It comes from engagement, from
evolution of our licensing tools, from building the open source AI ecosystem we
want to see. It comes from the same strategy that built [GNU]/[Linux], that
created the web as we know it, that gave us the tools we use every day.

The author writes that respect is earned, not given, and that those who
disrespect us should be treated in kind. I agree with this principle but arrive
at a different application. The disrespect isn't in the training itself; it's
in the enclosure, in the refusal to share back. The appropriate response isn't
to refuse sharing in turn—that's a race to the bottom—but to demand
reciprocity, to insist on the same freedoms we've always insisted upon.

When Linus Torvalds released Linux under GPL rather than keeping it
proprietary, he didn't say “corporations can't use this.” He said “anyone can
use this, but if you improve it, you must share those improvements.” That
condition, that requirement of reciprocity, built an ecosystem that includes
both volunteer developers and massive corporations, that powers everything from
smartphones to supercomputers, that demonstrates the viability of commons-based
production.

We need to apply the same principle to the AI era. Not “you can't train on our
code,” but “if you train on our code, you must free your models.” Not
withdrawal, but terms of engagement. Not rejection, but reclamation.

[GNU]: https://www.gnu.org/
[Linux]: https://www.kernel.org/


A historical opportunity
------------------------

The materialist view of history isn't about inevitability; it's about
recognizing patterns and acting on them. Every major transition in F/OSS
licensing has followed the pattern of problem identification, community
discussion, legal innovation, and gradual adoption. We're at the beginning of
that cycle now with respect to LLMs.

This is an opportunity. The conversation is happening right now about what
norms should govern AI training and model release. There's real energy in the
community around these questions. Open source AI models are proliferating, and
there's genuine uncertainty about what licensing frameworks should apply to
them.

If F/OSS developers withdraw from this conversation, if we cede the field and
focus solely on denial, we'll wake up in five years to find that the norms have
been set by corporations and corporate-friendly courts. The training loophole
will be firmly established, and open source AI will be permanently
disadvantaged relative to proprietary alternatives.

But if we engage, if we push for training copyleft, if we start releasing code
under licenses that require model freedom, we can shape that future. It won't
be easy. It will require legal work, community organizing, and probably some
court cases. It took years for GPL to be tested and validated. But it worked,
and there's no reason a training copyleft couldn't work too.


Conclusion
----------

I respect the anger and frustration expressed in
<cite>[On FLOSS and training LLMs]</cite>. The author is right that current AI
companies are behaving badly, that they're exploiting our work, that the law is
inadequate. Where I differ is in believing that the response should be
evolution rather than rejection, engagement rather than withdrawal, licensing
innovation rather than access denial.

The question isn't whether LLM training on F/OSS code is ethical in some
abstract sense. The question is: under what conditions is it ethical? And the
answer, I believe, is the same answer F/OSS has always given: when the freedoms
we grant are preserved and passed on, when improvements return to the commons,
when knowledge remains free.

Rather than blocking crawlers, we need to change the rules they crawl under.
Rather than withdrawing from GitHub, we should demand that GitHub's training
respect copyleft. Rather than shunning people who use AI tools, we should build
better AI tools that respect our freedoms.

Historical materialism teaches us that new forces of production require new
relations of production. LLMs are a new force of production. Training copyleft
would be the new relation of production that brings them into alignment with
F/OSS values.

The code I write, I write to be free. I want it to remain free even when it
passes through neural networks and emerges as model weights. That's not naïve
idealism; it's the same principle that's guided F/OSS for decades. We've
protected software freedom through multiple technological transitions, and we
can do it again.

We should reclaim LLMs, not reject them. The alternative is to watch from the
sidelines as our commons becomes their private gardens. I would rather fight
for a future where AI models, like the code they train on, belong to everyone.
