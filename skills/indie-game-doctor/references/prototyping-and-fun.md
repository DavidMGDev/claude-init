# Prototyping and fun

Diagnostic reference for whether a game is fun, how good games get found, and how to run
prototypes that answer real questions instead of producing reassurance. Not concept or
market selection, not playtest logistics, not scope budgeting — those live in their own
files.

---

## 1. Fun as flow

Jonas Tyroller's working claim, stated as identity rather than analogy: **fun is flow**.
Flow is the channel where challenge matches skill. Skill above challenge produces boredom.
Challenge above skill produces frustration. The player's brain treats both as alarm
signals pulling it back toward the channel, because roughly a fifth of the body's energy
budget runs the brain continuously and an unused mind reads as wasted capacity.

Koster's older claim, folded into the same model: fun is the feel of building and testing
a predictive model of the game's rules. Explore (learning, risk-tolerant, indifferent to
immediate payoff) and Exploit (executing a known pattern) are the two modes in play. Pure
exploit stagnates; pure exploration fails constantly. Fun sits in the exploration half and
does not care about being useful — that indifference is exactly what makes it useful,
because it expands what can later be exploited.

The brain runs many independent "containers" — visual, motor, logic, tactical, auditory,
spatial, discomfort-tolerance — each separately in flow, boredom, or frustration at any
moment. The containers are not weighted evenly: flow in one does not cancel frustration in
another. Roughly, flow reads as strongly positive, boredom as mildly negative, frustration
as severely negative. A single overtuned container can make an otherwise-good build read
as bad. This is why "boring is better than frustrating" — a skill left deliberately trivial
costs little; a skill overtuned even in one corner costs a lot.

**Five distinct ways a game stops being fun**, each with a different fix:

| Symptom | Cause | Fix |
|---|---|---|
| Playtesters disengage, call it stressful or unfair | Challenge exceeds skill in at least one container, or the game tests several unrelated skills at once so a weak one ejects the player | Narrow to one or two closely aligned skill containers; leave the rest trivial on purpose |
| Playtesters call it easy, slow, or "fine" | Skill exceeds challenge; nothing is being learned | Raise challenge in the targeted container, or cut the container entirely |
| A graybox prototype tests well mechanically but plays flat | The logic/decision container is in flow while the visual and auditory containers sit bored — gray boxes give cognitive flow but starve the senses | Add juice (particles, sound, animation, screen shake) without touching mechanics, then re-test |
| A repeated action feels hollow no matter how much polish sits on it | No value chain — the action has no visible downstream destination tied to the player's fantasy | Connect the action to something the player is visibly building toward; juice cannot fix a meaningless action |
| A choice in the system is never actually made | The option fails one of the three tests a decision needs — non-trivial, predictable, still challenging after repetition — usually because a "square hole" 1D stat edge makes one choice strictly dominant | Give the losing option a genuinely different axis (range, speed, area, type), not a bigger number on the same axis |

A decision only counts as a fun decision if it is non-trivial, predictable (not pure
randomness — there is signal to forecast from), and still holds up after dozens of
repetitions. A choice that fails any one of the three is not gameplay, whatever it looks
like on paper.

---

## 2. Name the flavor before arguing whether it's fun

"Is it fun" is not a workable question — too vague to argue about and too vague to test
against. Before a team argues about whether something is fun, agree on which flavor of
engagement is intended.

- **Koster (dopamine/mastery):** fun is the reward for recognizing and mastering a pattern.
  Named limitation: reductive on its own — it does not account for narrative catharsis,
  aesthetic wonder, comedy, or visceral horror.
- **Type 1 / 2 / 3 fun (Newberry/Rucker):** Type 1 is effortless and enjoyable in the
  moment (arcade combat, cozy games). Type 2 is stressful during, rewarding after
  (Soulslikes, Celeste). Type 3 is miserable during and after (*Getting Over It*,
  *A Difficult Game About Climbing*). One player's Type 2 is another's Type 3 — a game
  should target a specific friction threshold on purpose, not sand every edge down for
  everyone.
- **Caillois's four modalities:** Agon (competition, mastery), Alea (chance), Mimicry
  (role-play, identity), Ilinx (vertigo, sensory disruption — speed, disorientation,
  screen shake). Most games mix these in a ratio; naming the ratio clarifies what a new
  mechanic is actually adding.
- **Bartle's player types:** Achiever, Explorer, Socializer, Killer, on axes of action
  versus interaction and player-focus versus world-focus. A large team can try to cover
  all four; a small team gets more out of picking one intersection and going deep.
- **Garneau's 14 Forms of Fun:** Application of an Ability, Advancement & Completion,
  Beauty, Creation, Comedy, Competition, Discovery, Immersion, Intellectual Problem
  Solving, Love/Empathy/Care, Physical Activity, Power, Social Interaction, Thrill of
  Danger. Treat these as a flavor palette, not a checklist to max out — trying to hit all
  fourteen at once ("everything bagel") produces an incoherent mess. Complementary sets
  read cleanly: horror pairs Danger, Immersion, and Discovery; a factory sim pairs Problem
  Solving, Creation, and Advancement.

Design Pillars are the working tool that turns a named flavor into a filter: pick two or
three intended emotional states (max four), and test every proposed feature against them —
does it serve at least one pillar, and does it fight another? If neither question resolves
cleanly, the feature is a cut candidate, not a "maybe later." Pillars are stated as
emotions or experiences, never as genre labels or baseline mechanics.

In playtests, ask for the flavor directly rather than a verdict: where did you feel most
anxious, what gave the strongest sense of accomplishment, what felt tedious or out of
place. "Did you like it" returns a verdict with no diagnostic content.

Jonas's Flow model and the flavor taxonomies above are not fully reconciled with each
other — Flow excludes fantasy from fun by definition, while Garneau, Caillois, and Bartle
all treat narrative, role-play, and social drives as legitimate fun on their own terms.
Both are usable. Pick the vocabulary that matches the question in front of you: Flow for
diagnosing why a mechanic feels bad moment to moment, the flavor taxonomies for naming
what kind of experience a pitch is promising.

---

## 3. The search

Treat game design as a search over an infinite, multi-dimensional space of possible games,
not a plan executed in order. Most stuck projects are search-strategy failures, not
execution failures.

**The lake-versus-ocean problem.** A search process cannot be both fast and accurate at the
same time. Three captains illustrate the tradeoff:

1. **Naive captain** — picks a spot at random, rarely measures, locks in early. High
   failure risk.
2. **Gradient-descent captain** — measures, moves, adjusts based on what got deeper.
   Better, but walks straight into local minima (see §4).
3. **Giga-brain captain** — samples broadly across the space first, identifies the most
   promising regions, teleports there, then switches to local search. Real game design is
   an infinite multi-dimensional ocean, not a small lake — the naive and gradient
   strategies that work on a lake fail on an ocean.

**Named failure modes of a bad search**, each with its own fix:

- **Speed-versus-accuracy mishandled.** Go wide first, narrow in pre-production, then
  spend production's speed budget on execution — never fully switch off measurement.
- **Infinite space with no starting guess.** Use the industry's history rather than chasing
  a unique selling point from nothing. Aim for "recognizable but unique": too close to a
  known game is a worse clone, too far is unreadable and alien.
- **Noisy measurement.** Don't trust one playtest, and don't trust your own read while
  emotionally attached to a build. Let a strong reaction cool before retesting a critical
  assumption.
- **Exploration treated as expensive.** It is the opposite: the lack of exploration is more
  costly than exploration itself, because it defers a dead end to a much later, much more
  expensive stage. Prototypes are disposable scouting boats — no clean architecture, pure
  speed. Prototype art and gameplay separately; building both together is production
  wearing a prototype's clothes. One person per boat; dispatch idle team members solo
  rather than pairing them. Resolve debates with a tiny build, not a meeting.
- **Too many captains.** Creative deadlock between co-leads is almost always sunk cost, not
  a real disagreement about quality. Fix structurally: swap prototype ownership between
  leads, split domain authority (one owns art calls, one owns gameplay calls), or reduce
  the number of people with final say.

---

## 4. Local minima

A local minimum does not feel like being stuck. Every small adjustment makes the build a
little worse, which reads as evidence that the current design is already close to optimal.
It is not — the brain cannot distinguish "this is the best design" from "every nearby
design is worse than this one." A much better design can exist a large jump away and stay
invisible to gradient thinking.

**Four diagnostic red flags**, covering both directions of the failure:

| Symptom | Cause | Fix |
|---|---|---|
| The team never scraps work | Zero exploration, first guess kept by default — a shallow local minimum | Dare a big, cheap jump: a new game mode reusing existing assets under a different win condition, or a full rebalance of the numbers |
| The team constantly scraps work | Commitment failure or a string of bad starting guesses — never actually exits exploration | Set a kill criterion and a date before starting the next attempt, and hold it |
| The team scraps work only after months or years | Skipped cheap early prototyping; the flaw was reachable in a weekend and instead cost a season | Prototype cheaply before committing production time, every time |
| The game ships and fails commercially | The search broke down somewhere upstream | Diagnose which piece — readability, flavor, flow, or scope — actually failed, rather than re-running the whole project |

This is the same split verdicts.md §3 makes between build and theory: whether something is
fun is a build question, always; why a design that felt fine keeps getting worse under
small changes is a theory question, and the answer is usually "you are in a local minimum,
jump instead of nudging." See `verdicts.md` §3 for the full authority split.

---

## 5. Prototyping method

**What a prototype answers.** Exactly one of three questions, cheaply:

1. **Is it fun?** Does the core input loop, the locomotion, the base action feel good
   before anything else is layered on. A mechanic that sounds clever in a meeting can feel
   passive or unassertive on a controller — the only way to know is to build it.
2. **Is it viable?** Can the team actually produce enough content at this design's rate.
   Prototype build time is a leading indicator of full production time: a prototype that
   was slow and painful to build is a scope warning, not something to fix later with
   better tools.
3. **Will people care?** A playable prototype pitches tone and social dynamics better than
   a slide deck or a pitch document ever will.

**The four golden rules of rapid prototyping:**

1. **Strip the chrome.** Programmer art, throwaway code with no architecture, no menus, no
   final audio. Juice is allowed only if the thing being tested is itself tactile or
   visceral (does slicing feel good) — never add juice to disguise a boring core loop from
   yourself.
2. **Expand the medium.** An engine is not required. Paper cards, cardboard, spreadsheets,
   LEGO bricks, a lightweight non-production tool — whatever answers the question fastest.
3. **Atomize the scope.** One prototype answers one question. Keep technical, gameplay,
   art-style, and atmosphere prototypes in separate, disconnected sandboxes. Twenty
   distinct micro-prototypes beat refining one prototype twenty times.
4. **Don't prototype everything.** A prototype proves the seed is planted in fertile
   ground; it does not need to design the systems around it. A jetpack-flapping prototype
   tests the jetpack, not the shop, the missions, or the power-ups — those come later.
   Exit threshold: once Fun, Viability, and Audience Interest are each validated, stop
   prototyping and move to production planning. Prototyping has zero technical debt and
   total creative freedom, which makes it easy to get stuck making an endless series of fun
   mini-demos instead of shipping.

**Comparative prototyping.** A single prototype shown to two friends is close to the worst
way to test a design — there is nothing to compare it against. Build several distinct
prototypes and evaluate them side by side. Keep gameplay prototypes (graybox, tests fun and
scope) separate from visual prototypes (mockup, tests flavor and theme); merge only after
both pass independently. Never fully stop prototyping — treat ongoing development as a
continuous branching search within the vision's bounds, not a phase that ends once.

**Treat playtester behavior as the answer, not noise.** *Neon White* began as an FPS plus
roguelike deckbuilder — random card draws for guns and abilities mid-combat. The randomness
felt frustrating at speed, not empowering, so the team stripped it: fixed, deterministic
cards placed as breadcrumbs through the level. Once deterministic, playtesters
spontaneously stopped playing cautiously and started racing each other for best times,
unprompted. The team read that as the real design and rebuilt the game around
speedrunning. The lesson generalizes: kill a hybrid mechanic early if it turns clunky under
real intensity, and when playtesters do something nobody designed for, that behavior is
the signal — not a distraction from the plan.

Canning a prototype after real indifference is a win, not a loss, because it happens before
the expensive phase. A prototype that felt like a personal breakthrough but drew public
indifference, killed at the prototype stage, is cheaper by an order of magnitude than the
same discovery made after a year of production.

---

## 6. Sizing: the MVP and the increment ladder

Sizing here is about how big a prototype gets before you know whether the fun is real —
not the full project scope debate, which belongs in the scope-budgeting reference and in
`verdicts.md` §4.

- Pick a first attempt that feels almost too small: a 4–6 week target, because production
  complexity always compounds past the initial estimate.
- When tempted to abandon a working project for a shinier idea, spend a weekend
  prototyping the new one before deciding anything. Usually the flaws show up fast enough
  to cure the urge. If it is immediately fun in a weekend, that is a real signal, not
  impulsiveness.
- Build the MVP as a fixed block (six weeks in the sourced case), then extend only in
  further fixed blocks of the same size, continuing only while the return on the last block
  stayed steep. Stop and lock scope the moment returns flatten. This is a scoping discipline
  for testing whether a design is worth more investment, not a claim about how large a
  finished game must be.

---

## 7. Feel: juice, timing, and when it is the right fix

**The golden animation rule:** nothing in the game should appear, disappear, trigger, or
update without an animation.

**The timing standard:** roughly 95% of gameplay and UI animations should run 0.2 to 0.3
seconds. Longer reads as sluggish; shorter reads as unpolished or missing entirely. Use
overshoot easing (ease-out-back, ease-in-back) where physical weight is the goal.

**Directional feedback:** screen shake and other juice should point in the direction of
the causing action — shake backward on facial damage, shake right when coins fly right —
and tie nearby environmental props into the same beat rather than isolating the effect to
one object.

**Sensory Flow:** a graybox prototype can deliver real cognitive flow while leaving the
visual and auditory containers bored, because those senses have nothing to respond to yet.
Juice — particles, sound, animation, screen shake — brings those containers into flow too,
which compounds the total feel of fun rather than merely decorating it.

**When juice is the right fix versus a distraction — the two symptoms look identical and
need opposite treatment:**

| Looks like | Actually is | Right move |
|---|---|---|
| Mechanically sound prototype that plays flat | Sensory under-stimulation — logic container in flow, senses starved | Add juice; it will genuinely raise the fun |
| A repetitive action (gathering, chores) that stays hollow no matter how much VFX/SFX is added | No value chain — the action has no visible destination in the player's fantasy | Juice will not fix it. Connect the action to something the player is visibly working toward first |

Testing whether juice or feel is the actual hook: only add juice during prototyping if the
hook itself is tactile or visceral and the question is whether that sensation lands (does
slicing fruit feel good). If the hook is decision-making, strategy, or narrative, juice is
a later production concern, not a prototyping question.

---

## 8. Retractions, and why formulas fail their own authors

Advice these same sources later walked back, kept here because the reversal is more useful
than the original claim:

- **A four-part, self-devised model of fun (impact/reward, challenge, fantasy, plus an
  implicit fourth) was retired in favor of Flow.** The old model was an independent,
  incomplete reinvention of Csikszentmihalyi's Flow theory from 1990. Once recognized, Fun
  and Flow collapsed into the same thing.
- **"Flow is one ingredient in fun" became "Flow is fun, full stop."** The earlier framing
  treated flow as a contributing factor alongside others; the later framing treats it as
  identical to fun itself.
- **"Fun competes with motivation for design priority" was dropped as a false dichotomy.**
  Fun is a direct source of intrinsic motivation, not a separate axis fighting it for
  attention.
- **"Gameplay first, skin it later" was believed and then broken by its own believers under
  production pressure.** A canceled project (dodos on flying blocks) assumed fun core
  movement plus a cute skin could substitute for a driving fantasy. It could not — the
  team's own stated rule was fantasy-first design, and they built the opposite anyway once
  deep in production. Their own summary: it is easy to give good game-dev advice and
  exceptionally hard to follow it once inside active production.
- **A genre-clashing formula that worked once actively hurt the next project it touched.**
  Adding a progression and customization system to a Vampire-Survivors-style game tanked
  its appeal, because the addition fought the genre's actual draw — immediate simplicity,
  fast dopamine — instead of reinforcing it. The same move had worked in a different genre
  with different foundations.

The pattern across all five: a rule that felt load-bearing in one project turned out to be
scoped to that project's specific mix of genre, audience, and team, and broke when carried
somewhere else unexamined — including a later, more general-sounding version of the same
rule offered by the same person. Treat every named formula in this file, including Flow
equals fun, as a hypothesis to run against your own build, not a conclusion to defend when
the build disagrees with it. See `verdicts.md` §3 for which of the two — build or theory —
has authority when they conflict.
