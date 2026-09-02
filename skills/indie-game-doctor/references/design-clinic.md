# Design clinic

Mechanism-level diagnosis for a game that plays badly, feels flat, or gets a complaint the
team cannot localize. Use after `prototyping-and-fun.md` has established that the core
interaction is worth saving. The difficulty ruling lives in `rulings/r1-difficulty.md`;
this file covers the rest of the surface.

## Before changing a mechanic

1. Which container is failing: logic, sensory, or narrative? A graybox that tests well and
   feels flat is a sensory failure, and no mechanical change will fix it.
2. Is the complaint about the mechanic or about how the mechanic is displayed? A rule the
   player cannot perceive is not a mechanic yet.
3. Is this a barrier or a challenge? Barriers get eliminated, never balanced around.
4. Are you adding content to fix a problem in the atomic action? That never works and costs
   the most.
5. Would the change make one option strictly better than another on a single axis? If so
   you are about to delete an option rather than balance it.

## Challenge and difficulty

Difficulty is quantitative: HP pools, damage multipliers, spawn rates, timers. Challenge is
qualitative: which specific skill is being tested. You cannot tune difficulty until the
challenge has been isolated and proven.

**The three design levers.** Each tests a different skill, so pick by which skill you want
under load rather than by how hard the encounter should feel.

| Lever | What changes | Skill tested | Cognitive load |
| --- | --- | --- | --- |
| Volume | 5 goblins become 15 | Spatial crowd control | Low. Chaotic but easy. |
| Stats | The same 5 goblins get 2x HP, 4x damage | Sustained execution focus | Low. Narrow error margin. |
| Archetypes | 1 tank, 2 archers, 1 AoE caster, 1 healer | Threat prioritization | High. Forces sequencing. |

Stat inflation alone produces damage sponges, which read as grindy rather than hard.

**Barriers, which are not difficulty.** Clunky or unresponsive input, unreadable contrast,
missing telegraphs, obscure controls, a camera that hides the threat. Players report all of
these as "too hard." Responding by lowering enemy HP is lowering the tennis net instead of
fixing the racket strings. The attribution test that separates the two is in
`diagnostic-index.md` under "Players say it's too hard."

**Cognitive load.** A new system consumes full conscious attention until it automates.
Introducing several mechanics or enemy types at once exceeds working memory and produces
paralysis. Introduce individually, let each automate, then layer. Do not teach more than
one core mechanic per level or zone.

**The two difficulty axes.** Continuous difficulty is how aggressively the game pushes
toward game-over, producing tension and adrenaline. Aspirational difficulty is how much
room there is for mastery and optimization, producing pride and curiosity. They are
independent, and knowing which one your audience came for prevents most tuning arguments.
High continuous plus low aspirational is a rage game. Low continuous plus high aspirational
is *Balatro*, *Hades*, *Dead Cells*. Low on both is a digital toy, which is a legitimate
target and not a failure state.

**Genre as contract.** Store tags promise a specific mechanical and emotional experience. A
Soulslike without a corpse run has hard combat and no stakes, because the corpse run is not
a combat mechanic but a psychological amplifier that puts *past* accumulated time at risk
rather than current-attempt time. If a game feels like it lacks weight despite difficult
encounters, check what the genre contract promises that you did not implement.

## Loops and chains

The Action → Reward → Reinvestment loop explains that an action repeats. It does not
explain why repeating it feels good, which is why a well-polished loop can still produce
hollow grinding. Chains supply the direction.

**Execution chains** raise emotional stakes per consecutive success. Dropping a combo at
link 2 is mild disappointment; dropping it at link 5 is drama. Structure skill sequences so
tension rises across links rather than staying flat.

**Value chains** give a repeated collection action a destination. Juice cannot rescue a
contextless chore. Picking up junk in *Fallout 4* works because settlement-building
converts a broken fan into essential copper wiring, which reframes the decision from
weight-versus-value math into a fantasy-driven trade. If players cannot say why they are
collecting resource X, no amount of particle effects will fix it.

**Discovery chains** are the chains a player does not know they are inside. A trivial
trigger recurs across runs until they connect it. Roguelike structures host these naturally
because repeated runs create accidental discovery. Keep the input verbs minimal and let
systemic interactions carry the depth; depth does not require more buttons.

## Repetition and variation

Repetition teaches the rules and provides comfort. Variation supplies surprise. Too much
repetition is boredom, too much variation is anxiety, and the balance between them is what
"good game design" concretely refers to here.

Variation has to be qualitative context-shifting: new enemy behaviours, terrain
constraints, synergies, modifiers that force a different way of thinking. Raising HP and
shortening timers tests repetition tolerance and nothing else. Variation also has to be
genre-appropriate, since cosmetic hats supply nothing to a 4X audience.

The *Halo* line is usually misquoted as "30 seconds of fun played over and over." The
actual point is repetition multiplied by continuously changing context, and no 30-second
stretch of *Halo* repeats in the same container.

**Nested loops.** Macro (act or questline, hours) → meso (dungeon or level, minutes) →
micro (encounter, seconds) → atomic (input reaction, milliseconds). Flat single-loop games
like *Flappy Bird* are the exception. If a game feels shapeless, one of these tiers is
usually missing rather than badly tuned.

**Wobbly flow.** Optimal engagement is not a straight diagonal where challenge tracks skill
exactly, which produces numbness. Push brief anxiety spikes (boss fights, sudden scarcity)
then dip toward relaxation (safe hubs, debriefs, victory laps) so mastery can internalize
between spikes.

**Three-phase production, and what not to do in each.** Phase 1, mechanical prototype:
validate the atomic unit of fun with 2-3 blind testers, add no content. Phase 2, messy
experiments in variety: intentionally overscope on purpose, prototype diverse modifiers and
gimmicks with dirty code, work out what dev tools full production will need, and do not
open a Steam page yet. Phase 3, full production: mass-produce against the validated
blueprint. Velocity in phase 3 is high precisely because phases 1 and 2 answered the
questions. A team whose velocity stalls entering production usually skipped phase 2.

## Synergy and content efficiency

Twenty isolated non-interacting elements give roughly twenty strategies at full production
cost each. Ten elements built to cross-pollinate give 100+ strategies at roughly half the
asset cost. That is the answer to "we don't have enough content" in almost every case where
the budget is the constraint.

Complexity is how many rules and assets there are to track. Depth is how many meaningful
decisions they produce. Teams routinely add the first while believing they added the
second.

**Why synergy holds players.** Handing someone an overpowered weapon makes them feel
strong. Letting them engineer their own overpowered setup makes them feel brilliant. Plant
the pieces deliberately, leave the discovery ambiguous enough that the player owns it.
Lenticular design (Mark Rosewater's term) is the version that reads as simple to a beginner
and deep to an expert, which lets one piece of content serve both without separate modes.

**Make the combo cost something.** A combo that fires automatically with no setup becomes
spam. Require primer → trigger → payoff. Planning friction operates at three scales:
micro (sequencing within a turn, debuff before attack), meso (engine-building across an
encounter), macro (across a run, where **subtraction usually beats addition** — give
players tools to prune a build, not only to accumulate).

Permadeath is a safety valve. A combo that lasts one 30-60 minute run can be absurdly
overpowered on purpose without breaking long-term balance. Even so, dominant builds need
environmental counter-pressure, which is what Slay the Spire's Time Eater does by ending
the turn after 12 cards.

**The cog model.** A single mechanism (draw a card, gain energy, buff a stat) has no
gameplay value alone, like a gear out of a gearbox. Design means defining new relationships
between established mechanisms rather than accumulating unique ones. This is also the test
for asymmetry: a character who is +2 attack and -1 defence has a stat delta and not an
asymmetry. Slay the Spire's Silent and Ironclad have different rule relationships, which
is why they play as different games.

**Load-bearing genre axioms.** Before changing a convention, check whether it holds up the
reward loop. Removing end-of-turn discard from a roguelike deckbuilder destroys three
things at once: opportunity cost, the odds of ever drawing a newly-drafted card, and the
pacing that made turns a puzzle rather than a holding pattern. "Innovative on paper,
lifeless in playtest" is usually this.

## Combining genres

Three methods, each with a distinct failure mode.

**Hand-off**, alternating between genre modules (Persona, XCOM, Shovel Knight: King of
Cards). Breaks up repetition over long playtimes. Fails when players who bought genre A
resent being forced into genre B. **The Covert Action rule**: a secondary minigame that is
too long, too intense or too deep severs the player's connection to the macro game. Keep
secondary loops as palate cleansers, offer skips after repeated failure, make them optional
side content rather than mandatory gates, and telegraph mode shifts inside the fiction.

**Play style**, one world with several toolkits (Deus Ex, Dishonored, Prey). Fails on the
jack-of-all-trades trap: judged against dedicated single-genre titles, a hybrid loses on
every single axis. Supporting three playstyles costs roughly three games' worth of content,
AI and animation, and under-resourcing is visible. Every encounter has to be QA'd as
beatable by every intended playstyle, and a mandatory lethal boss in a non-lethal run
breaks the contract the game sold.

**Blend**, true mechanical fusion (Spelunky, Crypt of the NecroDancer, Portal). The highest
ceiling and the most fragile. **The Cancellation Principle** is the thing to look for:
genre A's strengths should cancel genre B's known weaknesses and vice versa. Platformers
suffer from repetitive memorization, which procgen fixes; roguelikes suffer from opaque UI
and complex input, which platformer controls fix. That reciprocity is why Spelunky works.
Blends fail on philosophical incompatibility, where procgen dilutes handcrafted spatial
discovery, or gear scores invalidate an instant-action power fantasy.

Start by looking for genres that already share foundational geometry or input logic: the
same grid, the same turn structure, the same pacing.

## Skill floor and ceiling

Floor is the effort to be minimally effective. Ceiling is maximum expressive depth. They
are independent, and low floor with high ceiling is the target that lets one build serve
both audiences (Bayonetta, Devil May Cry: mashing produces flashy combos, while dodge
offset and score multipliers give experts a different game on the same code).

**Assists that work.** Granular independent toggles rather than a single Easy/Normal/Hard
stat slider, since changing HP does not reduce the number of things a player has to do at
once. Forza separates braking assist, steering damping, traction control, auto-shift and
racing line. Widening a parry window preserves the combat rhythm where zeroing enemy damage
deletes it. Let advanced players turn hints and UI glints off.

**Reward mastery, do not require it.** Beginners clear the content with simple play;
skilled play gets a scoring or ranking language and economic bonuses for self-imposed
challenge.

**Tiered success beats binary gating.** Celeste's screen clear is accessible while its
strawberries demand frame-perfect execution. Overcooked's one star unlocks progression and
three stars rewards mastery. Binary win/loss hard-locks weaker players out of content they
paid for.

**Layer complexity across the campaign, not the tutorial.** Ori and Celeste give run and
jump in hour one, dash and double jump in hour three, bash and grapple in hour six. By hour
ten the player chains six inputs that would have made them quit at hour one.

**Prime for failure.** Frustration is reality violating expectation. Skate frames you as an
amateur filming clips, so failure reads as natural despite brutal controls. If the game is
mechanically punishing, make failure a visible thematic part of the world and the
marketing.

## Visual hierarchy and communication

A rule running under the hood is not a mechanic until the player can perceive, understand
and act on it. When a prototype's visuals mislead (a high-reward item rendered red, spiky
and flashing like a hazard) players avoid it and the team concludes the mechanic is broken.
The redesign then targets the wrong system. Establish clarity, affordance and contrast on
day one with placeholder art.

**The squint test.** Apply a Gaussian blur to gameplay footage, or physically squint. Pass
criteria: the player character is still identifiable, dangerous projectiles and enemies are
still locatable, the background stays indistinct. Judging readability from high-res static
screenshots hides every failure this test catches.

**Tiering, on the Binding of Isaac model.** Tier 1 (player, enemies, projectiles, pickups)
gets bold outlines and high internal contrast. Tier 2 (destructibles, terrain hazards) gets
thinner tinted outlines and moderate contrast. Tier 3 (decoration) gets soft edges, no
outlines, low contrast so it recedes. Keep backgrounds cooler, darker and desaturated;
reserve specific high-intensity colour signatures for gameplay-critical entities and forbid
background decor from reusing those exact values.

**Grouping without text.** Cluster by function so subsystems separate without a tutorial
(survival resources top-left, economic currencies top-right) and standardize the syntax
across every tracked variable (`[icon] + [number]`) so recognition transfers to new
resources.

**Affordance.** Form dictates perceived function, and players project real-world intuition
onto game objects. A door that looks openable and is not reads as a bug. The fix is to
change the affordance so the visual state justifies the game state: weld it, board it,
cover it in goop. Same logic for economy assets, where a sharp faceted crystal signals
"valuable, mined, used in crafting" before any tutorial line.

**Motion as attention.** The eye detects peripheral movement, so animate counters ticking
up rather than snapping, use multi-stage flashing on health depletion under stress, and
guide pathing with animated environmental elements (flags, LEDs, torches) instead of
intrusive waypoints. A HUD number that snaps leaves players unsure the action registered.

## Teaching without tutorials

Players give an unknown indie game 2-3 minutes before quitting, in a jam, on Next Fest, in
a publisher pitch, on a storefront. If the opening requires reading anything or fighting
unresponsive controls, that budget is already spent.

**The two-second target.** Looking at the screen for two seconds should convey the
objective, the danger, and the interaction vectors. If a mechanic needs a multi-step verbal
explanation before it becomes fun, it is over-engineered or badly presented, and adding
more explanation treats the symptom.

**Non-verbal substitutes that work.** Health and state through visual degradation (cracks,
limping, smoke, colour fade, screen pulse) rather than `HP: 85/100`. Resources through
physical containers (emptying magazines, item piles, filling gauges) rather than counters.
Input glyphs are fine only when paired with a picture or animation of the action they
perform.

**Juice is functional.** Screen shake, particles, SFX, squash and stretch and lighting get
scheduled as end-of-project polish, and they are actually the primary language the game
uses to talk to the player. Hit feedback communicates whether an attack connected and how
heavy it was. Particle trails communicate trajectory and boundaries. Sound telegraphs
threat and timing without a UI bar. Scheduling them last means shipping a game that cannot
speak until the final month.

**The micro-game principle.** Never ship a 10% slice of an epic. A self-contained 3-6
minute experience that is understandable in 30 seconds and completable in 5 beats an
unpolished fragment of a 20-hour RPG in every context where a stranger is deciding whether
to keep playing.

## Framework quick reference

| Framework | Use it to | Source |
| --- | --- | --- |
| MDA (mechanics/dynamics/aesthetics) | Trace a felt problem back to the rule that causes it | GMTK |
| Vision statement as razor | Cut features that do not serve the stated experience | GMTK |
| Three design levers | Change what kind of skill an encounter tests | Indie Game Clinic |
| Barriers vs intended challenge | Decide whether to fix or to tune | Indie Game Clinic |
| Continuous vs aspirational difficulty | Pick a difficulty profile from the audience | Indie Game Clinic |
| Execution / value / discovery chains | Give a working loop direction | Indie Game Clinic |
| Nested loops (macro→atomic) | Find the missing structural tier | Indie Game Clinic |
| Wobbly flow | Pace tension across a session | Csikszentmihalyi via IGC |
| Three-phase production | Know what is illegal to do in the current phase | Indie Game Clinic |
| Cog model | Judge whether a new mechanic adds depth | Indie Game Clinic |
| Content efficiency math | Answer "not enough content" without more assets | GMTK |
| Lenticular design | Serve beginners and experts with one asset | Rosewater via GMTK |
| Hand-off / play style / blend | Choose how two genres meet | GMTK |
| Covert Action rule | Size a secondary minigame | Sid Meier via GMTK |
| Cancellation Principle | Test whether a blend is worth attempting | GMTK |
| Skill floor × ceiling | Position against the audience you want | GMTK |
| Tiered success | Replace binary win/loss gating | GMTK / IGC |
| Squint test | Verify readability in one minute | Indie Game Clinic |
| Affordance | Fix a mechanic players refuse to use | Norman via IGC |

Design formulas are scaffolding, not physics. Jonas Tyroller's own formula failed on his
own projects, which is the reason each framework here is paired with the symptom it
diagnoses rather than offered as a rule to follow in the abstract.
