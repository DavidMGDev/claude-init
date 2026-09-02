# Numbers: benchmarks, conflicts, and confidence tiers

Six numeric conflicts run through this corpus, and teams make real decisions on them. This resolves each
one, states which figures survive as working numbers, and marks which should never be quoted as fact.

**One epistemic warning up front, applying to every Steam figure below.** Effectively all of them come from
one consultant observing the platform from outside. Valve publishes almost none of it. Nothing here is
disclosed platform data, no figure carries a date or a sample size, and several are inconsistent between
that consultant's own talks. Absolute revenue thresholds also drift upward as release volume rises (the
corpus itself cites 50-100 daily Steam releases). Use these as order-of-magnitude planning figures. A team
that treats them as measured constants will over-plan against noise.

---

## 1. Demo median playtime: 25 minutes or 45 minutes?

**The conflict.** [Ladder] sets the target at ≥25 minutes median. [Q&A] sets it at ≥45 minutes for
replayable and systemic games. Both are stated as firm rules from the same ecosystem.

**Resolution — not a conflict, once you look at demo length.** The same sources put demo *length* at 20-25
minutes ([BlowUp]) and vertical-slice length at 20-30 minutes ([Ladder]). A 45-minute median on a
25-minute demo is not a longer demo. It is players going back in.

So the two figures measure different things:

- **25 minutes = did they finish it.** The completion test. Applies to every demo.
- **45 minutes = did they replay it.** The replay test. Applies only where replayability is the product.

**Working numbers.**

| Demo type | Floor | Target | Alarm |
| --- | --- | --- | --- |
| Linear or narrative | 20 min | Demo length | Under 15 min |
| General | 25 min | Demo length | Under 15 min |
| Systemic, roguelike, replayable | 25 min | 45 min (about 2x demo length) | Under 25 min |

Under 15 minutes on any demo means friction, boredom or bugs. The prescription is unanimous across
sources: stop content work, fix pacing, tutorialization and controls. Do not market a game in this state.

---

## 2. Wishlist thresholds: 7,000, 30,000, or 100,000?

**The conflict.** [BlowUp]/[Q&A] give 5,000-7,000 for Popular Upcoming and 30,000 as the sustainable
"insurance policy," while explicitly warning that treating 100,000+ as a baseline causes scope bloat.
[Ladder] describes a front-page tier needing ~100,000 entering wishlists, and a launch tier of
100,000-200,000+.

**Resolution — three numbers, three different questions.** They only look contradictory because nobody
states which question each answers.

- **5,000-7,000:** a mechanical gate. Steam's Popular Upcoming rank.
- **30,000:** survival with margin. Enough to clear the New & Trending revenue bar even at a poor
  conversion rate.
- **100,000+:** a different objective entirely. Next Fest front-page top 10-12, or a multimillion launch.
  Not a viability threshold and should not be planned against by a small team.

**Derive your own floor instead of picking one.** The bar that actually governs is revenue, not wishlists:
roughly $8,000 gross in 24-48 hours triggers New & Trending. Work backward.

Units needed for $8,000 gross:

| Price | Units |
| --- | --- |
| $10 | 800 |
| $15 | 534 |
| $20 | 400 |

Wishlists needed to produce those units, by launch-window conversion rate:

| Price | at 5% (pessimistic) | at 10% (typical) | at 20% (well-qualified list) |
| --- | --- | --- | --- |
| $10 | 16,000 | 8,000 | 4,000 |
| $15 | 10,700 | 5,340 | 2,670 |
| $20 | 8,000 | 4,000 | 2,000 |

Read across that table and the apparent conflict dissolves. The 7,000 figure is the New & Trending floor at
typical indie pricing and a normal conversion rate. The 30,000 figure is the same floor with a safety
margin for a weak list. They encode the same mechanism at two risk appetites, and both survive.

**Working rule.** Compute your floor from your price and an assumed 10% launch-window conversion. Multiply
by 3 for your comfortable target. Ignore 100,000 unless front-page placement is an explicit goal you have
budgeted for.

**Caveat on the rates.** The separate 10-30% figure is a *first-year* conversion, not launch-window. Do not
substitute it into the table above; it will overstate day-one units by a wide margin. The 1-5% versus
15-25% split is by cohort quality, and per the d5 ruling, quality means the person has seen the game move.

---

## 3. Discovery Queue share: 50% or 20%?

**The conflict.** [BlowUp] says the Discovery Queue drives roughly 50% of launch traffic. [Ladder] says
~20% for top-tier indies. Both are stated without a source.

**Resolution.** Most likely both are true of different populations: for a typical game the queue is the
dominant channel, while a top-tier indie's denominator is inflated by front-page widgets, Global Top
Sellers and press, so the queue's *share* falls even as its absolute contribution holds.

**But the ruling is to drop the number.** No decision a developer can make changes based on whether the
figure is 20% or 50%. Queue placement is not purchasable, not directly optimizable, and is downstream of
the revenue velocity you were already trying to maximize. Quoting either figure gives a team a fact it
cannot act on.

Marked **decision-irrelevant**. Do not cite.

---

## 4. Organic weekly wishlist tiers

**The apparent problem.** The [Ladder] bands overlap heavily: Bronze 0-40/week, Silver 15-120, Gold
100-700, Diamond 300-3,000. A game at 110/week is simultaneously Silver, Gold and nearly Diamond.

**Resolution.** The overlaps are the tell that these are fuzzy order-of-magnitude bands, not thresholds,
and they should be read as such. Use the source's own labels rather than the numbers: Bronze means the game
"lacks magic or genre alignment," Gold means "strong organic interest," and Diamond is where the source says
"the algorithm begins compounding visibility." The one reading that survives the overlap is that a game
sitting in the Bronze-only range, under about 40/week, has a concept or store-page problem rather than a
promotion problem. Between roughly 40 and 300 the bands say nothing decision-relevant, and no source in this
corpus names a single threshold inside that span. Do not quote one.

The tiers are also *rates*, which matters for the d5 ruling: they presume a standing pipeline rather than
four discrete events.

---

## 5. Next Fest gain tiers versus front-page numbers

**The apparent conflict.** [BlowUp]'s scale calls 10,000+ wishlists gained during Next Fest "Diamond,"
while [Ladder] says front-page games gain 65,000-100,000 and unfeatured games gain about 700.

**Resolution — consistent, different populations.** [Ladder] describes the global top 10-12 entering with
~100,000 wishlists. [BlowUp] describes what a well-prepared normal indie should expect. A 10,000-wishlist
gain is an excellent outcome for a game that is not on the front page. Both scales stand.

The number worth keeping from this cluster is the inflection: **below ~2,000 wishlists entering Next Fest,
breakout is rare; above 2,000, and ideally above 7,000, the range widens sharply.** That is the only
figure here that gates a decision, and the decision is whether to enter or delay.

Also keep the shape, which is not disputed anywhere: days 1-2 give every game ~10,000-40,000 impressions,
and on day 3 the algorithm evaluates engagement and suppresses low performers. Next Fest is an
administered product test with two days of free traffic, not a demand generator.

---

## 6. The 90/10 product-to-promotion split

**Status: not a number.** It appears in the corpus as rhetoric and every advocate on every side of the
arena conceded it has no methodology, no sample, and no attribution. It is quoted to make the point that
the game matters more than the tweeting, which is true and does not need a fake ratio.

**Never quote it as fact.** Where a ratio is genuinely needed, use the d5 stage table, which is derived
from lead times rather than from a slogan.

---

## Confidence tiers for everything else

**Reasonably reliable — mechanism is visible, figure is approximate:**

- ~$8,000 gross in 24-48 hours for New & Trending.
- ~$150,000 gross in six months for sustained traction.
- ~$300,000 gross for Valve-curated front-page events, ~2 per year.
- ~5,000-7,000 wishlists for Popular Upcoming.
- Older wishlists do not meaningfully decay in conversion. Called a myth, and consistent across talks.
- Qualified versus unqualified conversion split (15-25% vs 1-5%).
- Paid ads inefficient below roughly 75,000-100,000 wishlists.
- Kickstarter's ~8% total cut versus Steam's 30%.
- Campaign work multiplier ~5x; 2-4 months prep, ~28 days live.

**Use directionally only:**

- Viral spike yields ($1,000-12,000 wishlists in 24-48 hours). The band spans an order of magnitude.
- Next Fest impression counts (10,000-40,000/day).
- 10-30% first-year wishlist-to-sale conversion. Wide, and blends cohorts of very different quality.
- Every genre-demand ranking in the corpus. Backward-looking, survivorship-biased, Steam-only.

**Do not quote:**

- The 90/10 split.
- Discovery Queue share, either figure.
- Any single wishlist number presented as *the* target.

---

## Numbers that do not exist and that teams keep asking for

Naming these is as useful as resolving the conflicts, because a doctor asked for one of them should say so
rather than improvise.

- **Median revenue by production-surface tier.** Would settle the d4 scope debate. Nobody has it.
- **Wishlists generated per Kickstarter backer.** The single number the d6 ruling turns on. Unpublished.
- **Whether teams with written design documents ship at higher rates.** Would settle d3. No data.
- **Attribution for any sustained-marketing cadence.** The GDC 1-hour-a-day system reports a process and
  no outcomes: no wishlists, no revenue, no attribution.
- **Console and itch demand data.** The entire demand map here is Steam-derived and does not transfer.
- **Anything about the games that never shipped.** Every dataset in this corpus is conditioned on release,
  which is the largest survivorship problem in it and is never corrected for.

When a team asks for one of these, the honest answer is that the number does not exist, followed by the
cheapest experiment that would produce a local version of it for their game.
