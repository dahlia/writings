---
published: 2026-01-16T15:00:00+09:00
---

Histomat of F/OSS: We should reclaim LLMs, not reject them
==========================================================

A few days ago I read a blog post titled
<cite>[On FLOSS and training LLMs]</cite>. It captures well the frustration
spreading through the free and open source software community. AI companies show
no real respect for F/OSS developers; they exploit open source licensing's
idealistic principles, and the law offers little protection against having our
work scraped as training data for proprietary language models. I nodded along
through most of it.

But I fundamentally disagree with the conclusion.

The proposed solution is denial and isolation: block the crawlers, withdraw from
centralized forges like GitHub, make our work inaccessible to AI scrapers, shun
those who use these “anti-ethical tools” from our communities. I understand the
anger behind it. But I think it misses something important and misreads the
historical pattern that has shaped FLOSS itself.

[On FLOSS and training LLMs]: https://chronicles.mad-scientist.club/tales/on-floss-and-training-llms/


Where we agree
--------------

The author is right about much of this. The current situation is bad. AI
companies have shown genuine disrespect for the sources of their training data.
The phrase “I'm legally allowed to do so, so I will” captures the contempt
these corporations show toward individual developers and communities.
Their aggressive crawling amounts to a distributed denial of service attack;
they ignore creators' explicit wishes and offer no working opt-out mechanism.

The legal battle is likely unwinnable, too. F/OSS licenses permit use for any
purpose without discrimination. [The Open Source Definition]'s sixth principle
explicitly prohibits restrictions on fields of endeavor. Major licenses like GPL
require attribution and have provisions about derived works, but any competent
lawyer could argue that LLM training doesn't constitute creating a derived work
in the traditional sense, and that statistical pattern extraction doesn't
require attribution in the way code reuse does.

The law is inadequate. It was written for a different era, one where *“use”*
meant running software, modifying it, or redistributing it, not feeding it into
neural networks to extract patterns. The law serves power, and in this case,
power resides with the corporations that can afford legal teams to navigate and
exploit these ambiguities.

[The Open Source Definition]: https://opensource.org/osd


Where we diverge
----------------

My answer is different: not rejection, but reclamation.

The author frames this as a battle between respecting developers and allowing AI
training. There's a third way, one more consistent with F/OSS history and more
likely to produce a future we'd actually want. Instead of trying to prevent LLM
training on our code, we should demand that the models themselves be freed.

I *want* my code to be used for LLM training. What I don't want is for that
training to produce proprietary models that become the exclusive property of AI
corporations. The problem isn't the technology or even the training process
itself. The problem is the enclosure of the commons, the privatization of
collective knowledge, the one-way flow of value from the many to the few.

This isn't a new problem. It's the same problem FLOSS has always fought, just
wearing new clothes.


On accepting reality
--------------------

Different views on LLMs often come down to different readings of reality itself.

Salvatore Sanfilippo (antirez), the creator of Redis, recently
[wrote about his experience with AI coding tools]. He's someone who values
hand-crafted code deeply, and like many of us cares about the human touch in
software. Yet he writes: “It is simply impossible not to see the reality of what
is happening. Writing code is no longer needed for the most part… Programming
changed forever, anyway.”

His conclusion: adapt. Learn to use these tools. Don't fall into “anti-AI
hype.” He sees LLMs as democratizing technology, much like open source did in
the 90s, enabling small teams to compete with large companies.

I agree with most of antirez's reading of reality. LLMs have fundamentally
changed programming, and we can't go back. The author of the original post seems
to operate from a different one: resistance is still meaningful, withdrawal can
be effective, we can meaningfully reduce LLMs' access to training data. I'm
skeptical. OpenAI and Anthropic have already scraped what they need. GitHub
already has everyone's code. The training data exists.

That's where I part ways with antirez's optimism. He worries about
centralization but seems to trust that market competition, including open models
from China, will solve it. He focuses on how developers can adapt and use these
tools. That matters, but it sidesteps a deeper question: under what terms does
this transformation happen?

The question isn't whether to use LLMs or adapt to them; that ship has sailed.
The question is who owns the models. Who benefits from the commons that trained
them? If millions of F/OSS developers contributed their code to the public
domain, should the resulting models be proprietary? This isn't just about
centralization or market dynamics. It's about whether the fruits of collective
labor remain collective, or become private property.

[wrote about his experience with AI coding tools]: https://antirez.com/news/158


The materialist reading
-----------------------

The history of free and open source software, read through a materialist lens,
shows a clear pattern: technological change creates new forms of exploitation,
which force new forms of licensing to protect the commons.

The trajectory:

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
in the classic sense: value extraction without reciprocation.

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

Would this be technically feasible? Could it be enforced? Fair questions, but
not new ones. They were asked at every previous GPL evolution.

How do you prove a binary was compiled from your source code? How do you prove
hardware locks prevent modification? How do you prove a service is running your
code? In each case, the answer has been a combination of technical evidence,
community vigilance, and occasional legal action. Perfect enforcement is
impossible, but that doesn't mean the license is worthless. GPL violations
happen, but GPL also works; it has created and protected a massive commons.

The question of proving that specific code was used in training is admittedly
harder than proving source code was used in a binary. But it's not
insurmountable. Training datasets can be documented, model genealogies tracked,
and statistical analysis can sometimes identify training sources. The mere
existence of the license also creates social and legal pressure toward
compliance.

There are also questions about mixed training sets. What happens when you train
on both TGPL and non-TGPL code? This is analogous to questions about linking
GPL and non-GPL code, worked out through years of community practice and
occasional court cases. The details matter, but the principle is sound.


Why this matters more than withdrawal
-------------------------------------

The strategy of withdrawal has its appeal. There's satisfaction in
saying “you don't respect us, so you can't have our work.” But it misses the
larger picture.

It concedes the field. If F/OSS developers withdraw their code
from public accessibility, we're not preventing AI training; we're just
preventing *open source* AI training. OpenAI and Anthropic have already scraped
everything they need; they have massive datasets. What withdrawal actually
prevents is projects like Llama and Mistral from having access to quality
training data.

It also mistakes the problem. LLMs aren't inherently exploitative
any more than compilers or web servers are. They're tools, and like all tools
under capitalism, they can concentrate power or distribute it. Focusing on
denial rather than conditions of use means treating the symptom rather than the
disease.

Then there's the purity problem. The author calls for shunning people who use
“anti-ethical tools,” making them feel unwelcome. But where is the line? What
if someone uses GitHub Copilot to write a contribution to a F/OSS project? What
if they use ChatGPT to debug their code? Who decides? This kind of purity
testing has historically been better at splintering movements than at achieving
their goals.

The deepest problem is that withdrawal abandons the fundamental F/OSS
strategy that has actually worked: ensuring freedom through licensing
conditions, not access control. GPL's genius wasn't that it prevented anyone
from using the code; it was that it guaranteed everyone's freedom by requiring
that freedom be passed along. Withdrawal is the opposite philosophy.


The future we should build
--------------------------

I want to live in a future where powerful AI models exist and are accessible to
everyone, not just to corporations that can afford to train them. A world where
the knowledge encoded in millions of F/OSS projects becomes part of a commons
rather than privatized into proprietary models; where if my code helps train a
model, that model is available for me and everyone else to use, study, modify,
and share.

This future doesn't come from withdrawal. It comes from engagement, from
building the open source AI ecosystem we actually want. The strategy is the same
one that built [GNU]/[Linux] and gave us the web as we know it.

The author writes that respect is earned, not given, and that those who
disrespect us should be treated in kind. I agree with the principle, but apply
it differently. The disrespect isn't in the training itself; it's in the
enclosure, in the refusal to share back. Refusing to share in turn is a race to
the bottom. The right response is to demand reciprocity, to insist on the same
freedoms we've always insisted upon.

When Linus Torvalds released Linux under GPL rather than keeping it proprietary,
he didn't say “corporations can't use this.” He said “anyone can use this, but
if you improve it, you must share those improvements.” That condition, that
requirement of reciprocity, built an ecosystem spanning volunteer developers and
massive corporations alike, powering everything from smartphones to
supercomputers, demonstrating what commons-based production can actually do.

The same principle applies to the AI era. Not “you can't train on our code,”
but “if you train on our code, you must free your models.” Terms of engagement,
not withdrawal.

[GNU]: https://www.gnu.org/
[Linux]: https://www.kernel.org/


A historical opportunity
------------------------

The materialist view of history isn't about inevitability; it's about
recognizing patterns and acting on them. Each major shift in F/OSS licensing
went through the same rough cycle: someone identified the problem, the community
argued about it, lawyers got creative, adoption was slow, then suddenly it
wasn't. With respect to LLMs, we're at the beginning of that cycle now.

The conversation about what norms should govern AI training and model release
is happening right now, while things are still in flux. Open source AI models
are proliferating, and what licensing frameworks should apply to them remains
genuinely unsettled.

If F/OSS developers withdraw from this conversation and focus solely on denial,
we'll wake up in five years to find the norms set by corporations and
corporate-friendly courts. The training loophole will be firmly established, and
open source AI will be permanently disadvantaged relative to proprietary
alternatives.

If we engage, push for training copyleft, and start releasing code under
licenses that require model freedom, we can shape that future. It won't be easy.
Legal work, community organizing, and probably some court cases will be needed.
It took years for GPL to be tested and validated. But it worked, and there's no
reason training copyleft couldn't work too.


Conclusion
----------

I respect the anger and frustration expressed in
<cite>[On FLOSS and training LLMs]</cite>. The author is right that current AI
companies are behaving badly, that they're exploiting our work, that the law is
inadequate. Where I differ is on the response. The situation calls for
evolution, not rejection; for engagement on better terms, not withdrawal.

The question isn't whether LLM training on F/OSS code is ethical in some
abstract sense. The question is: under what conditions is it ethical? The
answer, I think, is the same one F/OSS has always given: when the freedoms we
grant are preserved and passed on, when improvements return to the commons,
when knowledge stays free.

Block crawlers, and you've changed nothing; change the rules they crawl under,
and you might. Withdraw from GitHub, and open source AI loses training data
while proprietary labs lose nothing; demand that GitHub's training respect
copyleft, and you've shifted the terms. The tools already exist for this kind
of pressure. We built them once before.

Historical materialism says that new forces of production require new relations
of production. LLMs are a new force of production; training copyleft would be
the relation of production that brings them into alignment with F/OSS values.

The code I write, I write to be free. I want it to remain free even when it
passes through neural networks and emerges as model weights. That's not naïve
idealism; it's the same principle that's guided F/OSS for decades. We've
protected software freedom through multiple technological transitions, and we
can do it again.

We should reclaim LLMs, not reject them. The alternative is to watch from the
sidelines as our commons becomes their private gardens. I would rather fight for
a future where AI models, like the code they train on, belong to everyone.
