# Diagnostic index

Look up the complaint as the team phrases it. Each entry gives the candidate causes, the
cheapest test that separates them, and where to read further.

**Never prescribe against the complaint.** Most complaints here have three or more causes
that need incompatible fixes, and picking the wrong one costs months.

---

# Gate 1 — Is there a game?

## "Which of these should I make?" / "What should I build next?"

Nothing is built, so there is nothing to diagnose and everything to sequence. Vision
generates the candidates, the market culls them, a stranger picks the winner, and no stage
may be skipped. Check runway first: under 12 months of money the demand tier gets a veto
over all candidates, and a passion pick is off the table regardless of how good it is.

**Test.** Three cheap browser prototypes over three months total, not three months each,
each put in front of strangers. Rank on what strangers did, not on what the team hoped. Excitement is
the tiebreaker between two candidates that both clear the filter, never the veto.

Read: `ideation-and-market.md`, `verdicts.md` §1.

## "Playtesters say it's nice / has potential / looks cool"

The most dangerous data in indie development, because it reads as mild approval and is
usually total rejection delivered politely. Nobody says "nice" about a game they want to
keep playing.

**Candidate causes**
1. The loop does not produce a want-to-continue signal. Check retention behaviour, not
   words.
2. Testers are socially compromised (friends, family, Discord regulars, other devs).
3. The build is visually competent and mechanically hollow, so the compliment is about
   the art.

**Test.** Do not ask anything. Watch strangers play unaided and record it. Five to eight
sessions, and act on what three or more of them do rather than on any single incident.
Then count: did they ask to play again, unprompted? Did they finish? Did anyone play twice
without being asked? Unprompted replay is the only reliable positive signal in the corpus.

Sessions the team already ran count, but only the ones with a verified stranger at the
controls. Friends, Discord regulars and other devs get discarded rather than weighted
down. If that empties the sample, the finding is that the game has never been tested.

**If nobody asks to play again**, treat the loop as unvalidated regardless of how far
production has gone. Go to `prototyping-and-fun.md` and `playtesting.md`.

## "It's not fun and we don't know why"

**Candidate causes**
1. **Flow mismatch.** Challenge and skill are misaligned, or the game is testing several
   disparate skills at once (puzzle logic plus twitch timing), so players weak in one get
   ejected.
2. **Sensory under-stimulation.** The logic container is in flow but the visual and audio
   containers are bored. Graybox that tests well mechanically and feels flat is this.
3. **No interesting decisions.** If the player always knows the mathematically optimal
   move, there are no decisions. The fix is conflicting goals, not more content.
4. **No value chain.** A repeated action with no visible downstream destination feels
   hollow however much juice is on it.
5. **Local minimum.** Every small change makes it worse, so the team concludes it is
   optimal. You cannot feel the difference between optimal and stuck.

**Test.** Name which of the five before changing anything. For 1, narrow the challenge to
one skill for a build. For 2, add juice without touching mechanics and re-test. For 5,
make one big cheap jump that reuses existing assets.

Read: `prototyping-and-fun.md`, `design-clinic.md`.

## "Sessions are short"

**Candidate causes**
1. Friction in the first five minutes: controls, clarity, tutorialization.
2. The loop resolves too completely, so there is no chain pulling forward.
3. Content-volume game where mastery arrives too late.

**Test.** Median session length against demo length. Under 15 minutes on any build is an
alarm. Under 25 on a 20-25 minute demo means people are not finishing.

**Do not add content.** About 1.3% of *Bounden*'s players got past thirty minutes.

## "Players say it's too hard"

Run the attribution test before touching a single number.

Ask the tester to narrate their last three failures out loud.

- **They name a cause** ("I got greedy", "mistimed the dodge") → intended challenge. You
  may now consider tuning quantity.
- **They say "I don't know", "it just hit me", "the controls"**, or describe something the
  game did not do → **barrier**, not difficulty. Fix input responsiveness, telegraphing,
  contrast, camera. Re-test. Do not touch a number.

Four other causes sit behind "too hard": stat inflation on the wrong lever (damage sponges
feel grindy rather than hard), cognitive overload from simultaneous introductions, binary
win/loss gating that hard-locks weaker players, and tone mismatch between mechanical
friction and marketing.

Read: `rulings/r1-difficulty.md`, `design-clinic.md`, and `playtesting.md` for running
the attribution test without leading the tester into the answer.

## "Combat/movement feels floaty or unsatisfying"

Check animation timing first. Attack, jump and reaction animations outside roughly
0.2-0.3 seconds read as unresponsive regardless of the underlying code.

Then check whether you have 30 unpolished systems instead of 5 tuned ones. Feature bloat
dilutes perceived quality; polish five tightly tuned high-feedback systems.

## "One of our weapons/options is never used"

It is dominated on a single axis by another option. Even a tiny numeric edge elsewhere
makes the loser irrelevant. Give it a genuinely different multi-axis profile, or a
scenario where it is uniquely optimal. Do not buff its numbers.

---

# Gate 2 — Can it be finished?

## "Scope keeps growing despite keeping it small"

**Cause.** The team shrank runtime and content but kept full genre system complexity:
systems, physics, animation, AI. Subtract disciplines, not just playtime.

**Test.** Count production surface: every discipline, pipeline and bespoke asset class,
with the person who owns it named. Any discipline with no owner is the first cut.

**Then check the ratio.** Original estimate against elapsed time. Estimation error is
proportional, so a six-month scope takes a year and a one-month scope takes two months.

Read: `production-and-scope.md`, `rulings/d4-scope.md`.

## "Is this feature creep?"

Not all growth is creep. Compare cost growth against perceived value growth. Value
outrunning cost is scaling and should continue. Cost outrunning value is creep and should
stop this week.

## "We're arguing about direction and can't resolve it"

**Cause, almost always.** Sunk cost, not disagreement about quality. Both people are
attached to their own invested work.

**Fix, structural not persuasive.** Swap prototype ownership. People find dead ends in
work they did not build and concede them without a fight. Or split domain authority. Or
reduce the number of decision-makers.

Read: `team-and-money.md`.

## "We keep making disconnected prototypes with no traction"

No unifying experience vision. Write one experience sentence and re-derive the prototypes
from it. Thronefall's was "build and defend your castle" and it arrived *after* months of
prototypes, including an abandoned deckbuilder detour. Pillars are a cut filter, not a
search method.

## "This is just a small side project"

The stepping-stone framing is usually false. Once progression, leaderboards or procedural
systems arrive, creep is near-inevitable. Apply main-project scope discipline or do not
start.

## "We're running out of money"

Order of operations: cut production surface, then find non-dilutive money, then consider a
worse instrument. Grants and prototype funding come before crowdfunding, which comes
before a publisher deal signed at zero reserves. *The Guest* signed a 100%-recoup deal in
that state and took $0 from 25,000+ copies over three years.

Read: `verdicts.md` §6 for the go/no-go decision first, then `team-and-money.md` for
logistics and `rulings/d6-kickstarter.md` for the full argument. If a wishlist count is on
the table, also run "We have N wishlists" below: campaign viability and launch floor are
two different questions asked of the same number.

---

# Gate 3 — Will anyone find it?

## "We're doing everything and marketing isn't working"

**Cause, usually.** The concept, not the tactics. When a concept fits the market, creators
accept pitches immediately and wishlists climb exponentially rather than linearly. If every
marketing action is an uphill fight, rework the hook.

**Second cause.** The product metrics the algorithm actually tracks are weak: reviews,
retention, click-through, wishlist conversion. Promotional volume does not move those.

## "Screenshots and clips don't land, but the game looks fine to us"

Fails the five-second comprehension test. Too cluttered or too alien to parse instantly.
Simplify the palette, enforce pixel-density consistency, make the core loop read
immediately.

Related: a unique or abstract art style that fails commercially usually neither explains
its mechanics nor taps a recognizable fantasy.

Read: `marketing.md`, `design-clinic.md` (visual hierarchy, squint test).

## "Trailer views don't convert to wishlists"

Check in this order: does it open with logos or slow pans instead of gameplay at second
zero; are there capture artifacts (frame drops, watermark, wrong resolution); is there a
full SFX pass; is the genre legible in the first five seconds; is there one clear CTA
rather than ten social links.

Read: `marketing.md`.

## "Our pitch is 'genre X but with mechanic Y'"

That formulation underperforms. Convert the mechanic into a fantasy someone already wants
or drop it. "Platformer but you turn into a shark" lost to "you and a friend paddle a boat
through lava," which is a simpler concept that reads instantly.

If the pitch needs a second sentence of setup, it is a genre salad. Cut until one clause
survives against a known genre frame.

Read: `rulings/d2-hook.md`, `ideation-and-market.md`.

## "We have N wishlists — is that enough?"

There is no single answer, and three circulating numbers answer three different questions.
Derive your own floor: units needed for ~$8,000 gross at your price, divided by an assumed
10% launch-window conversion, times three for margin.

Read: `numbers.md`.

## "Should we enter Next Fest?"

Below ~2,000 wishlists entering, breakout is rare and you spend the one-time slot. Next
Fest multiplies existing momentum and a multiplier on a small number stays small. Also do
not debut the demo during Next Fest; debut it quietly months earlier to capture the New &
Trending Free push, and save the Fest for the polished capstone.

Read: `marketing.md`.

## "A creator covered us and nothing happened"

The audience watched and rejected the concept. Treat that as validation data rather than
bad luck, and go back to gate 1.

---

# Gate 4 — Is it worth keeping?

## "It's polished but nobody replays it"

**Candidate causes**
1. Closed loop with no escalation or consequence. Add chain structure: execution chains
   that escalate stakes, or discovery chains with secrets.
2. Isolated systems. Twenty non-interacting elements give about twenty strategies at full
   production cost each; ten interacting elements give 100+ at roughly half the cost.
3. Meta-progression missing in a genre whose retention driver is meta-progression. Copying
   a trend's surface mechanic while missing its fun engine is a documented pattern.

Read: `design-clinic.md`, `rulings/d4-scope.md`.

## "Our open world feels empty"

Small teams cannot sustain the asset density and hand-crafted encounters open worlds
require. This is the most expensive thing a small team can attempt and the diagnosis is to
not attempt the structure. Isolate one beloved sub-system and build only that.

## "Our meta-progression removed all the tension"

No loss condition on in-run currency. Bank only at checkpoints, forfeit unbanked gains on
death. Or tax unspent currency at run start to force high-yield single runs.

## "Permadeath is making players resent us"

Death is a pure fail state with no payoff. Make it deliver story: hub beats reactive to
how, where and to whom the player died.

## "The game feels tonally off despite good mechanics"

Mismatch between mechanical friction and presentation. A punishing core wrapped in cozy
marketing underperforms on Steam even when the mechanics are sound. Align the two, in
whichever direction is cheaper.

## "Our Early Access game stalled after launch"

Check update cadence before anything else. Twelve or more months without a dev update
reads as abandonment and kills incoming sales regardless of the original quality.

---

# Cross-cutting

## "Our design document is enormous and we're still stuck"

Developer bias, sometimes called the fugue state: one pillar gets 500 pages of lore or
shader specification while the others are untouched. Force a minimalist top-down pass
across mechanics, aesthetics, technology and story. Check quadrant coverage every few
months; a programmer iterating on code for two years still ships a tech demo.

Never write a lore bible before the loop is validated.

## "Our internal playtests are great but the market disagrees"

Internal echo chamber. The team knows every unwritten rule and quirk; strangers do not.
Weight fresh external confusion over internal enthusiasm, always. This killed a funded
project by an experienced team.

## "Players need us to explain the rules during playtests"

The design will not survive contact with the market. Do not patch with more explanation;
fix the clarity and fantasy mismatch underneath.

## "We keep layering sub-rules and edge cases onto a friction point"

That masks a broken foundational loop and makes the ruleset arbitrary. Address the core
loop directly.

## "We worked incredibly hard and it has under 10 reviews"

Effort is not the bottleneck and the team is auditing the wrong variable. Check trailer
pacing, juice, visual clarity, genre quality bar, and price-to-polish match. Mid-tier
pricing on modest visual fidelity creates purchase friction.

## "Should we kill this?"

Ask what they would regret losing if they cancelled today. "The months" is sunk cost
wearing a vision's clothes. A specific scene, mechanic or feeling is something real to
rescue into the next project.

Then check whether a kill criterion was ever written. If not, write one now, with a date,
and diagnose against it in two weeks rather than deciding under emotional load today.

Read: `SKILL.md` (detaching a team from a broken concept), `rulings/d3-theory-vs-iterate.md`.
