# Ruling: Difficulty, Accessibility, and Player Power

Scope: indie teams of 1–10, premium PC/console, single project. Sources cited by name throughout:
Mark Brown / GMTK (*Who Gets To Be Awesome*, *10 Game Design Lessons Over 10 Years*, *The 100 Games That
Taught Me Game Design*, *How Synergies Make Slay The Spire Fun*, *How Neon White Lets You Speedrun
Speedrunning*, *Roguelikes Versus Roguelites*, *How To Combine Game Genres*, *How To Think Like A Game
Designer*), Indie Game Clinic (*Challenge & Difficulty in Games*, *What Is Fun*, *Game Design Theory: A
Guided Tour*, *Indie Game Genres & Subtractive Design*, *Repetition with Variety*, *What Makes a Good
Roguelike Deckbuilder*), Jonas Tyroller (*How To Make Anything Fun*, *Making Successful Indie Games Is
Simple*, *GameDev Advice I Changed My Mind On*, *This Problem Changes Your Perspective*).

The six tensions are not independent. Four of them collapse onto one axis once you separate **what skill
the game tests** from **how much of it the game demands** — the distinction Indie Game Clinic makes as
Challenge (qualitative) versus Difficulty (quantitative). Rulings below are ordered so that the cheap,
high-certainty calls come first.

---

## Tension 1 — Low floor / high ceiling vs. uniform high floor

**Question.** Should an indie game let a weak player reach competence in minutes and leave headroom above,
or should the entry requirement itself be the product?

### Where low-floor/high-ceiling is right

GMTK's *Who Gets To Be Awesome* plots the three archetypes and calls low-floor/high-ceiling the sweet spot:
Bayonetta and Devil May Cry give a masher flashy, effective combat while dodge-offset, mid-air weapon swap,
and score multipliers run an entirely different game on the same code. This holds when:

- The game is **action/skill-execution** and the intended audience is broader than "people who already
  finished a game in this genre."
- **Playtime comes from content**, not from repeating a small space. Under Indie Game Clinic's subtractive
  design framing, a game whose runtime comes from bought content wants everyone to reach the end of it.
- The team has **enough content that a first clear is a satisfying arc**. GMTK's Lesson 4 (Super Mario:
  accessible critical path plus optional bonus levels, coins, post-game worlds) requires that critical path
  to exist as a separate thing from the mastery content.

### Where the uniform high floor is right

Indie Game Clinic's *Challenge & Difficulty* gives the strongest version of this and it is not sentiment:
**genre is a contract**. The Soulslike tag on a storefront promises demanding combat, boss pattern
recognition, and specifically the corpse run — a mechanic that risks *past* accumulated time rather than
current-attempt time. A Soulslike that removes the corpse run is not a friendlier Soulslike, it has broken
the thing the tag sold. The same file's diagnosis is blunt: an indie Soulslike lacking stakes despite hard
combat is missing the genre-contract psychological amplifier.

Jonas Tyroller supplies the mechanism that makes the high floor defensible rather than merely stubborn. In
*How To Make Anything Fun* he reframes Dark Souls and Getting Over It: the skill being tested is not motor
execution, it is perseverance and hostile-environment adaptation, and for players whose tolerance matches,
that sits in the flow channel like any other skill. So a uniform high floor is right when:

- **Difficulty is the marketed product**, and Indie Game Clinic's tone-alignment rule holds — presentation,
  store page, and trailer all promise the friction that ships.
- The game **extracts playtime from a compact space through mastery loops** (Indie Game Clinic's world-
  subtractive strategy 4: Hollow Knight, arcade games, precision platformers). Here a low floor is actively
  expensive — it shortens the game.
- The audience **self-selects**, which Tyroller calls genre-as-expectation-management. Type 2 fun for one
  player is Type 3 for another (Indie Game Clinic, *What Is Fun*, citing Newberry/Rucker); the fix is
  targeting a friction threshold precisely, not sanding every edge.

### The team-size fact both sides skip

Low floor plus high ceiling done the Bayonetta way is two tuned experiences on one codebase. A 2-person
team cannot afford that. The cheap version is **tiered success on shared content**: Celeste's screens are
clearable at the floor while strawberries demand frame-perfect execution; Overcooked's 1 star unlocks
progression while 3 stars rewards mastery. Both are cited in Indie Game Clinic's *Challenge & Difficulty*
as the fix for binary win/loss gating, and both cost near zero additional content.

### Decision rule

Write down the single number: **minutes from first launch to the player's first self-attributed success.**
Then check it against how your game makes its playtime.

- Playtime from **content volume** → that number must be under ~10 minutes. Build the floor low and put
  mastery in optional overlays (collectibles, star ratings, time targets) on the same levels.
- Playtime from **mastery repetition of a compact space** → the number can be 30–60 minutes, but only if
  every minute of it produces attributable failure (see Tension 3), and only if the store page says so.

### Default for indies

**Low floor, high ceiling, implemented as tiered success on shared content — not as separate difficulty
content and not as a second set of levels.** Reverse this only when the high floor is simultaneously (a) the
marketed identity, (b) the source of your playtime, and (c) something your team personally plays for
pleasure — Indie Game Clinic's rule that you cannot tune nuance in a motivational space you don't inhabit.

### What would change this ruling

Blind playtesters drawn from your actual target persona (not friends, not the team). If they reach
self-attributed success inside your target window and keep playing, the floor is right regardless of which
school you followed. If competent genre-native testers bounce before the first success, the floor is too
high, full stop. Steam refund rate concentrated in the first two hours is the commercial version of the
same signal.

---

## Tension 2 — "Assist modes never threaten authorial vision" vs. designer-intent purism

**Question.** Does shipping assist toggles cost you anything real?

### Where GMTK is right

GMTK's Lesson 5 conditions the claim carefully, and the conditions are the whole argument: Celeste states
the intended experience, invites the player to try defaults first, then offers granular modular toggles
(game speed, infinite stamina, extra dashes, invincibility). It is not one blunt Easy preset. GMTK's *Who
Gets To Be Awesome* adds the mechanical form this should take — difficulty options should alter **speed,
timing windows, and auto-aim**, not just enemy HP, because Easy/Normal/Hard that only scales HP reduces
nothing about cognitive or mechanical load. Widening the parry window (Jedi: Fallen Order) preserves the
core rhythm; zeroing enemy damage deletes it. Forza Horizon 4's independent toggles (braking assist,
steering damping, traction control, auto-shift, racing line) separate *game complexity* from *opponent
difficulty*, which is the actual axis players need moved.

For a single-player game with no shared comparison layer, this is close to free and the purist objection
has no mechanism behind it.

### Where purism has a real mechanism

Two of them, and only two.

1. **A shared comparison layer.** When the game has leaderboards, ghosts, achievements read socially, or
   asynchronous player messaging (Indie Game Clinic cites Elden Ring's messaging as a prosocial emotional
   multiplier), assists change what a result *means*, not just how it was reached. GMTK's own *Neon White*
   breakdown is built entirely on a tiered comparison ladder — Bronze unlocks friends leaderboards, Silver
   your own ghost, Ace the global board and the developer's time. Assists that feed that ladder corrupt it.
2. **Upstream tuning drift.** The Souls-side objection that designers tune encounters slightly safer knowing
   an escape hatch exists is not philosophy, it's a real production failure mode, and it is the same one
   Indie Game Clinic warns about from the other direction: never adjust difficulty parameters in response to
   tester failure until barriers are eliminated. An assist toggle is a very convenient place to hide from
   that discipline.

The cost GMTK understates is production, not artistic. GMTK's own *How To Combine Game Genres* states the
rule for multi-playstyle games: **every encounter must be QA'd as beatable via every intended path.** Every
independent assist toggle is a combination in that matrix. For a 1–3 person team, six toggles is a testing
surface nobody will actually cover.

### Decision rule

Ship an assist only if it is a **scalar on an existing system**: a speed multiplier, a damage multiplier, a
widened timing window, a stamina cap set to infinity, a retry count. If a toggle requires bespoke level
logic, a second enemy behaviour path, or an alternate encounter layout, cut it — that is content, not
accessibility, and you will not test it.

Then: default off, stated intent visible on the screen where they're enabled, and excluded from any
leaderboard, ghost, or comparison ladder you ship.

### Default for indies

**Yes to assists, on the Celeste model, restricted to scalar knobs.** Separately and non-negotiably: input
remapping, colour-independent readability, subtitle and text scaling, and a hold-vs-toggle option for held
inputs are not assist modes and are not up for this debate. They are barriers under Indie Game Clinic's
taxonomy and belong in Tension 3.

### What would change this ruling

Telemetry on assist adoption versus completion. If assists are on for a meaningful share of players who
then finish, they paid for themselves. If almost nobody enables them and your bug tracker has entries that
only reproduce with a toggle set, delete the toggles. If your game grows a competitive or comparison layer
mid-development, re-run this ruling — the answer genuinely flips.

---

## Tension 3 — The broken tennis racket

**Question.** When testers say "too hard," what do you touch first?

This is the least contested item in the corpus and the most frequently skipped in practice.

### Where Indie Game Clinic is right — which is essentially always

The fallacy, attributed to Derek Yu: players experiencing bad controls, unreadable contrast, or missing
telegraphs report "this game is too hard." They do not report "your input buffer is too short." A designer
who responds by lowering enemy HP is lowering the net instead of restringing the racket. Three independent
sources converge on this:

- GMTK's Celeste entry names the specific repairs — coyote time, jump buffering, corner correction — under
  the rule of intent: execute what the player meant, not the literal frame.
- GMTK's Lesson 9 says the same about comprehension: testers who get lost or misuse a mechanic are
  producing diagnostic data about signposting and affordances, not committing player error.
- Jonas Tyroller ranks visual clarity and self-explanatory-ness at #1 or #2 in art direction priority,
  having demoted them to #3 and #5 in his earlier framework and watched Ovus Nova and Will You Snail? pay
  for it. His *Can You Guess Which Game Is a Success* checklist treats a screenshot that fails the 5-second
  comprehension test as a commercial death sentence, independent of difficulty.

### Where it needs a boundary

"Barrier" and "intended challenge" are not self-evident categories, and Indie Game Clinic's own list
(clunky input, unreadable contrast, obscure controls, missing feedback) would flag several deliberate
designs as broken. GMTK's *100 Games* holds up Getting Over It's awkward mouse physics as a thematically
justified choice, Skate's Flickit stick gestures as a deliberate trade of arcade ease for tactile struggle,
and Far Cry 2's jamming weapons and breaking vehicles as friction that produces the target emotion where
Far Cry 4's frictionless version produces the opposite one. Rigid barrier-elimination would sand all three
into their own opposites.

The separator is **attribution**, not comfort. Getting Over It's controls are hard and completely legible:
you know exactly why you fell. An unreadable telegraph is not. Friction the player can name is challenge;
friction they cannot name is a barrier.

Second boundary: "fix barriers first" needs a stop condition or it becomes infinite polish. The stop
condition is attribution reaching threshold, not perfection.

### Decision rule

For every "too hard" report, ask the tester to **narrate their last three failures out loud.**

- They name a cause ("I got greedy on the third hit", "mistimed the dodge", "went left, should have gone
  right") → intended challenge. You may now consider tuning quantity.
- They say "I don't know", "it just hit me", "the controls", or they describe something the game did not
  actually do → barrier. Fix input responsiveness, telegraphing, contrast, or camera. Re-test. Do not touch
  a number.

Barriers are done when roughly 4 of 5 blind testers can attribute the majority of their deaths. That is the
gate onto the difficulty spreadsheet — the same gate Indie Game Clinic places at the Production Point
(Benjamin Kean Anderson's term), before which you should not be building balance data pipelines at all.

### Default for indies

**Adopt the ordering unconditionally. Add the attribution test as the stop condition.** It costs one
playtest question and it is the single highest-yield diagnostic in this entire ruling.

### What would change this ruling

Nothing about the ordering. What changes is whether you're finished: if attribution is above threshold and
testers still quit at the same point, the quantity really is wrong and you tune. If attribution is high and
they quit at *different* points, you have a skill-container problem instead (Tension 6).

---

## Tension 4 — Output randomness vs. determinism

**Question.** May a die roll resolve after the player has committed?

### Where output randomness is right

GMTK's XCOM entry states the condition inside the claim: an 85% shot that misses demands contingency
planning, **and the designer must supply the contingency tools** so a bad roll doesn't erase good play. The
claim was never that output randomness is safe unconditionally. It works when:

- The **retry loop is short relative to the loss**. A missed 85% in a 40-minute XCOM mission with squad
  permadeath is a different event from a bad roll 20 seconds into a roguelike fight.
- The loss is **partially recoverable in-fiction** — overwatch, a second squad member, a reroll item, a
  bail-out. GMTK also cites Prince of Persia's Dagger of Time as the general pattern: convert failure into a
  quick tactical reset instead of a load screen.
- The genre contract includes it. Tactics-RPG buyers arrive expecting hit chances.

### Where determinism is right

GMTK's *Into the Breach* entry is the counter-case in the same catalogue: enemies show exact target and
turn order before the player acts, converting a guessing game into a deterministic repositioning puzzle.
The *Neon White* breakdown documents the pivot empirically — random card draws mid-combat felt chaotic
rather than empowering, the team replaced them with fixed deterministic cards placed as level breadcrumbs,
and playtesters spontaneously started racing each other. That is the strongest evidence in the corpus for
determinism when the hook is speed, mastery, or optimization.

Jonas Tyroller's three criteria for a fun decision resolve the dispute cleanly: a decision must be
**non-trivial, predictable, and still challenging after repetition.** Output randomness attacks
"predictable." Pure determinism attacks "challenging after repetition" — the puzzle solves out.

### The reconciliation

Both are satisfied by putting the randomness **before** the decision rather than after it. Into the Breach
is not a deterministic game; its boards, missions, and enemy sets are procedurally varied. It is
deterministic *at the moment of commitment*. Indie Game Clinic's deckbuilder file makes the same point from
the genre side: procedural draft and draw are what stop a solved meta, while the tactical turn itself
resolves exactly as shown. GMTK's Slay the Spire entry sits in the same place — enemy intent icons give full
information every turn while card draw stays random.

Loss aversion is the cost multiplier. Indie Game Clinic cites Prospect Theory via Geoffrey Engelstein:
losing hurts roughly twice as much as the equivalent gain feels good. Output randomness manufactures loss
specifically, so it costs about double what a naive expected-value model says.

### Decision rule

Randomize **before** the player decides — draft, draw, drops, map layout, spawn composition — reveal it all
at decision time, and resolve deterministically after commitment.

If you keep post-commitment rolls, satisfy this bound: **a single worst-case roll must cost less player time
than one retry loop, or there must be a named in-game tool that absorbs it.** If neither holds, the roll is
producing "I did everything right and lost," which is the most common negative review sentence in the genre.

### Default for indies

**Input randomness plus deterministic resolution.** It is cheaper to communicate, cheaper to balance, and
it removes an entire class of complaint. It also fits the small-team economics in GMTK's *How Synergies
Make Slay The Spire Fun*: variance you can author once at the drop table is cheaper than variance you have
to mitigate everywhere downstream.

### What would change this ruling

Two symptoms, opposite fixes. If testers describe the game as solved or routine after ~5 hours, you need
more **input** variance — more drop diversity, more layout variance, more starting conditions. If they
describe it as unfair or luck-based, you have output randomness without mitigation, or a telegraph they
cannot read (which is Tension 3, not this one). Never fix the first symptom with post-commitment rolls.

---

## Tension 5 — Deliberately overpowered synergies vs. balance-as-bug-fixing

**Question.** Is a build that trivialises the game a feature or a defect?

### Where the Slay the Spire licence holds

GMTK's synergy breakdown makes both arguments an indie should care about. The psychological one: being
handed an overpowered weapon makes you feel strong, engineering your own overpowered setup makes you feel
brilliant. The production one is arithmetic — 20 isolated elements give roughly 20 strategies at full asset
cost each, while 10 elements designed to cross-pollinate give 100+ emergent strategies at about half the
cost. For a small team that is the difference between shipping and not.

But the licence is not "we have permadeath." It's three conditions the video states and the summary often
loses:

1. **A bounded reset.** The break expires in 30–60 minutes and the player returns to baseline.
2. **Multi-step assembly.** Primer → trigger → payoff. A combo that fires automatically with no setup cost
   degrades into mindless spam.
3. **Environmental counter-pressure.** Slay the Spire's Time Eater ends the turn after 12 cards, punishing
   pure zero-cost Shiv spam. At least one encounter has to check the dominant pattern.

Jonas Tyroller's "square hole" argument reinforces this from the balance side: one-dimensional power
balancing is unfixable even when numerically even, because whichever option is marginally better becomes
the only option. Genuinely asymmetric, situational profiles are the fix — and a build that is devastating
in its own lane and mediocre outside it is exactly that.

### Where balance-as-bug-fixing is right

The licence evaporates the moment any of the three conditions fails:

- **Persistent progression that carries the break past the reset.** GMTK's *Roguelikes Versus Roguelites*
  flags the inverted-difficulty-curve paradox — hardest while learning, gone once maxed. A meta-tree that
  makes the break permanent turns a spike into a flat line.
- **Multiplayer, competitive play, or a shared leaderboard.** No reset boundary contains it.
- **A break with no assembly cost.** That's not a synergy, that's a mis-set number.

### Decision rule

Before patching a strong build, check three things:

1. **Assembly time.** How many distinct pieces, over how many decisions, does it take to come online?
2. **Reset boundary.** Does the power survive the run?
3. **Coverage.** Is there at least one encounter it loses to?

Patch only if assembly is near zero, the power survives the reset, or nothing checks it. **Never patch a
build merely for being strong.**

### Default for indies

**Design breaks deliberately.** Plant the pieces, leave the discovery ambiguous enough that players feel
ownership of finding it, and build one hard check into the encounter set. This is the highest
content-per-hour pattern available to a small team, and it directly serves Indie Game Clinic's aspirational
difficulty axis — mastery, optimisation, and self-directed depth — without producing more assets.

### What would change this ruling

Win rate crossed with assembly time, per archetype. The archetype with both the highest win rate and the
shortest assembly time is a bug. An archetype that wins often, takes the longest to assemble, and loses to
one specific encounter should ship untouched. If you have no telemetry, the substitute is a run log: how
many runs into a session before a player first assembles the build, and whether they still lose afterwards.

---

## Tension 6 — The Single Core Skill Rule and Fun = Flow

**Question.** Can a game challenge more than one kind of skill at once?

### Note that Tyroller states the rule twice, at different strengths

*Making Successful Indie Games Is Simple* gives the hard version: challenge only one main skill, or very few
closely aligned ones. *How To Make Anything Fun* gives the softer, better-supported version: target 2–3
skill containers, nail them, and deliberately leave the rest trivial. The soft version is defensible. The
hard version would flag most of the action-RPG, immersive-sim, and tactics design space as unshippable, and
would fail to explain games in this same corpus that work.

### Where the rule is right

The mechanism is sound and specific. Tyroller's asymmetric weighting — flow +6, boredom −1, frustration −10
— means one frustrated container can sink an experience in which several others are in flow. Skill
distributions across containers (motor, spatial, logic, perceptual, endurance) vary independently between
players, so testing two demanding axes simultaneously multiplies the fraction of your audience that gets
ejected from flow on at least one of them. "Boring is better than frustrating" follows directly, and it is
the correct default for every system that isn't your headline.

Indie Game Clinic's Cognitive Load Theory section supports it from a different direction: new systems
consume full conscious attention until they automate, so introducing multiple new mechanics at once
overwhelms working memory and produces paralysis. GMTK's *Who Gets To Be Awesome* independently arrives at
"don't teach more than one core mechanic per level" and the Ori/Celeste layering model — run and jump in
hour 1, dash and double-jump by hour 3, six chained inputs by hour 10 that would have caused a quit in
hour 1.

### Where multi-skill genres are right

The rule conflates **simultaneous** with **sequential**. The successful multi-skill games separate their
demands in time:

- GMTK's *How To Combine Game Genres* hand-off method: Persona's day-sim and dungeon-crawl, XCOM's base
  phase and mission phase. Each container gets a turn.
- Hitman's clockwork schedules (GMTK's *100 Games*) put spatial-perceptual scouting before execution.
- Indie Game Clinic's wobbly flow and Tyroller's own sawtooth rule both prescribe the same pacing valve:
  when one axis spikes, relax the other. Tyroller states it explicitly — whenever a new mechanic is
  introduced, temporarily drop execution demand so the player has bandwidth to absorb it.

And Indie Game Clinic's Archetype lever deliberately loads cognitive plus perceptual at once: one tank, two
archers, an AoE wizard, and a healer force threat prioritisation under sensory load. That's two containers
simultaneously, and it's the recommended alternative to stat inflation. The reconciliation is that those two
containers are *adjacent* — both cognitive-perceptual, both served by the same practice — which is exactly
Tyroller's "very few closely aligned skills" escape clause. Simultaneous **distant** containers (twitch
timing plus deductive logic) is the actual failure mode.

### On Fun = Flow

Tyroller asserts the identity literally and removes fantasy from it. Take it as a **tuning model for the
challenge axis**, where it is precise and useful, and reject it as a definition of game quality, where it
isn't. Tyroller himself concedes fantasy sells the game, and his *What Sells on Steam* position is that
players buy the experience, not the mechanic. Indie Game Clinic's Garneau 14 forms and Caillois modalities
name a dozen engagement sources — Beauty, Comedy, Discovery, Love/Empathy, Immersion — that flow does not
model at all. Use flow to answer "is this encounter tuned right." Do not use it to answer "is this a good
game."

### Decision rule

Name your **one primary skill container** in a sentence. Then classify every other system as either
sequenced (it gets its own phase, with the primary relaxed) or trivial (deliberately unchallenging).
Anything that is neither is a bug. If two demanding containers must coexist, verify they are adjacent
(both cognitive, or both motor) — not one of each.

### Default for indies

**One primary container, one adjacent or sequenced secondary, everything else deliberately trivial.**
Trivialise by default: a boring side system costs −1, an overtuned one you never had budget to balance
costs −10 and a refund.

### What would change this ruling

Split your playtesters by skill profile — recruit some who are strong at twitch execution and weak at
puzzles, and some who are the reverse. If the two groups stall at **different** places, you are testing two
containers at once and should sequence or trivialise one. If they stall at the **same** place, it's a
single-container quantity problem and you tune the number. This split is worth doing with as few as six
testers; the signal is qualitative and appears fast.

---

## Diagnostic checklist

Ask in this order. Do not skip forward — each question invalidates the ones below it if answered wrong.

1. **Who complained, and are they your target player?** A complaint from outside your persona is data about
   your store page, not your balance. (GMTK Lesson 3; Indie Game Clinic's pillars and Bartle/Quantic
   Foundry check.)
2. **Does the store page, trailer, and art promise the friction the game delivers?** Punishing core wrapped
   in cozy marketing reads as broken rather than hard. (Indie Game Clinic tone alignment; Tyroller,
   genre as expectation management.)
3. **Can testers narrate what killed them?** Make them say it out loud, three deaths each. If they cannot,
   stop here and fix input, telegraph, contrast, or camera. (Broken tennis racket.)
4. **Do different testers stall in different places, and does it track their skill profile?** If yes, you
   are testing two distant containers at once. Sequence or trivialise one. (Tyroller's Fun-o-Gram.)
5. **How many minutes to first self-attributed success?** Compare against how your game generates playtime:
   content-driven wants under ten, mastery-driven can afford an hour.
6. **When they lose, is it to a decision they made or to a roll after they committed?** If the latter, name
   the mitigation tool. If there isn't one, the roll is the bug.
7. **How long is the retry loop, in seconds?** Neon White's 10–30 second levels make failure frictionless.
   A three-minute retry converts every difficulty issue into a quitting issue.
8. **Did you introduce more than one new mechanic or enemy archetype in the span where they stalled?**
   (Cognitive load; Ori/Celeste layering; the sawtooth rule.)
9. **Is difficulty rising through stat inflation, or through a changed challenge lever?** Damage-sponge
   complaints mean stats. Reach for Volume or Archetypes instead. (Indie Game Clinic's three levers.)
10. **Is success binary?** If there is no star, medal, time, or collectible gradient, add one before you
    consider a difficulty setting. It's cheaper and it serves both ends of the skill range.
11. **Is there a relief beat after the spike?** Flat sustained tension reads as monotony, not challenge.
    (Sawtooth curve; wobbly flow.)
12. **Only now: which number would you change, and what evidence names that number?** If the answer is
    "enemy HP" and the evidence is "testers died a lot," go back to question 3.
