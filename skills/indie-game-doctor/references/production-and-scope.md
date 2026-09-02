# Production and Scope

Reference for sizing a project, cutting it, growing it, and finishing it: production
surface, estimation, subtractive design, MVP/increment ladders, feature creep,
documentation, kill criteria, and the last 10%. Not concept selection, team dynamics,
funding, or marketing — see the other reference files for those.

---

## 1. The production surface audit

Two different things get called "small," and confusing them is the most common scope
error in this field.

- **Production surface**: how many things you must build and maintain — disciplines,
  pipelines, characters, bespoke assets, systems, platforms.
- **Player-facing depth**: how much game the player experiences — hours, replayability,
  strategic variety, mastery ceiling.

Every game cited as proof "small games sell" is small in surface, large in depth.
Reducing surface and reducing depth are not the same action; teams that conflate them
either ship a barren large-surface game or a depthless small one. Full ruling:
`verdicts.md` §4.

**Count surface before arguing about size:**

1. List every discipline needed (design, code, art, animation, audio, narrative, UI,
   netcode, QA, localization, certification) and name an owner for each. A discipline
   with no owner is the first cut, not a hiring problem.
2. List every bespoke asset class (character rigs, biomes, enemy types, voice lines,
   cutscenes, level layouts).
3. Per system, ask: does removing this hurt the pitch? If not, it's surface with no
   depth payoff — a candidate for the first cut.

**Three subtraction strategies**, each trading AAA-scale surface for a surface a small
team can finish without cutting the fantasy itself:

| Strategy | Cuts | Examples |
| --- | --- | --- |
| Character | 3D rigging, animation, AI trees, dialogue trees ("the 3Cs": character, controls, camera) | Isolation narrative (*Gone Home*); vehicle avatar (*Pacific Drive*, *Dredge*); 2D diegetic UI — portraits, cards (*Papers, Please*, *Coffee Talk*); object storytelling, no character model (*Unpacking*) |
| World | Open-world level teams (staffing cited: 10+ on *Cyberpunk 2077*, 16+ on *Elden Ring*, 40+ on *AC Valhalla*) | Fixed single location (*VA-11 Hall-A*); repetition/anomaly loops reusing 95%+ assets (*The Exit 8*); arena/boss-rush (*Devil Daggers*); mastery-replay of small spaces (*Hollow Knight*); star-gated replay (*Overcooked*) |
| Mechanics | The rest of a big genre's overlapping systems | One sub-loop pulled out and made the whole game — inventory management from an ARPG (*Backpack Hero*); tower defense as de-scoped RTS |

Filter every new feature the same way: does it need real-time 3D NPCs, or can
characterization come through radio, portraits, documents? Does it need physical
traversal, or can the setting be one room? Can playtime come from mastery instead of
square footage? Does the cut solve a production bottleneck and a design goal at once —
if yes, it's a primary design candidate, not a compromise (the Miyamoto principle: a
good idea solves more than one problem at a time).

---

## 2. Estimation: overrun is proportional

**A six-month scope takes a year. A one-month scope takes two months.** Overrun scales
with the baseline, so the only lever that shrinks the absolute overrun is shrinking the
baseline — you cannot estimate your way out of proportional error, only scope your way
out of it.

- Ask a team their original estimate and current elapsed time. The ratio, not the months
  remaining, tells you where they really are.
- "How do we estimate this better" is usually the wrong question. The answer is "cut
  until a 2x miss is survivable," not "estimate more carefully."
- "Make small games" is well-known advice indie teams still ignore, because they scope
  from what they want to build rather than what they can execute to a professional
  standard. Two questions separate the mindsets: what can I already do to an exceptional
  standard right now, and what am I flat-out bad at and should exclude rather than fudge.

---

## 3. Cutting: subtractive design

"Make small games" is routinely misread as "make shorter versions of big genres" — a
two-hour open world still needs open-world-grade systems and AI. That misreading
produces a barren, thin game. The correct reading is **subtractive design**: cut the
number of moving parts, not just the runtime, so what remains can be polished past the
market's bar.

**The cut-quality test.** Players don't care that a game was made solo. An unjustified
limitation reads as cheap — a plain rolling ball as the player character because nobody
could rig a human reads as placeholder art. The same limitation, given a theme, reads as
style:

| Unjustified (cheap) | Justified (style) |
| --- | --- |
| Generic ball with no thematic tie | *Rock of Ages*: boulder + Monty Python comedy |
| — | *Exo One*: alien morphing craft across sci-fi vistas |
| — | *Mini Metro*: no characters at all — diagram aesthetic deletes the character pipeline and sells the fantasy better than characters would have |

**Every developer shortcut needs an artistic reason**, stated openly (store page, pitch),
not buried in lore. A cut without a stated reason is a corner cut; a cut with one is a
design decision.

**A thematic filter catches creep directly.** Ask of every addition: does it belong to
this setting? Bazookas in a samurai game are bloat with no filter running. A
100-ingredient crafting tree in a game whose pillars are claustrophobia and
investigation dilutes both — cut it.

**"Turd polishing"**: if the first five minutes of the core loop aren't fun, no amount
of content fixes it. Cut before you polish, or the polish gets spent on material that
gets cut later anyway.

---

## 4. Growing: the MVP and the increment ladder

**Start radically small.** Target a 4-6 week MVP for a first playable loop, deliberately
uncomfortable, because production complexity always compounds past the initial estimate
(§2).

**Extend only in fixed increments, gated on return, never on calendar or ambition.**
Documented method (Slots & Daggers): build the 6-week MVP, then extend in further
6-week blocks only while return per added block stays steep. Stop and lock scope the
moment returns diminish.

**Gate question at every boundary**: is the value added by the next block still growing
faster than its cost? If yes, take the block. If value growth has flattened relative to
cost, that's the stop signal — not "we haven't hit our target scope yet." This is the
feature-creep test in §5, applied at the increment level instead of the single-feature
level.

---

## 5. Feature creep: the test

**Feature creep isn't "the project grew." It's cost growing faster than perceived
value.** The converse isn't creep: a small addition making value grow faster than its
cost is healthy scaling, and refusing it in the name of staying small is its own mistake.

Formally: **Real Value = Value / Cost.** A feature earning 5x more attention but taking
5x longer to build is a wash, not a win — raw output isn't the metric, return per unit
cost is.

1. State cost in discipline-hours, not vaguely.
2. State value concretely: does it serve a pillar, close a genre-demanded depth gap,
   convert playtesters who were bouncing?
3. Compare growth rates, not totals — high absolute value can still be bad scaling if
   its cost curve is steeper.
4. If cost outgrows value: cut, or redesign the feature to buy more value per hour.

**Buy depth with combinatorics before content.** Twenty isolated elements yield roughly
twenty strategies, each at full production cost. Ten elements designed to interact
yield 100+ emergent strategies at roughly half the total asset cost. A team reaching for
more isolated content when it needs more depth is buying the expensive version of what
system interaction sells cheap — the mechanism behind every small-surface, large-depth
game cited in this file.

---

## 6. Documentation that pays for itself

Documentation is production surface. Scale it to the number of people who will read it,
not to the size of the ambition (`verdicts.md` §3).

| Team | Write | Do not write |
| --- | --- | --- |
| Solo | Vision sentence, kill criterion with a date, task list | Anything with no reader but yourself |
| 2-3 people | Above, plus 2-4 design pillars stated as emotions (not genre/art labels), plus an explicit MVP boundary | A full GDD; pillars before the first prototypes exist to describe |
| 4+ people, remote, or external money | Above, plus a minimalist living GDD | A static PDF that goes stale the day production starts |

**A minimalist GDD, when a team needs one, runs general to specific and never opens with
specifics**: elevator pitch and core loop → 2-3 design pillars → audience, business
model, tone → core systems, verbs, MVP boundary → pacing/session length → visual
hierarchy and mood → deep specifics (levels, dialogue, items), deferred last. If the
core idea changes, specifics written early are the waste this order avoids.

**Mark how locked each line is with modal verbs**: WILL = non-negotiable, SHOULD =
intended, open to playtest revision, COULD = exploratory, not locked.

**Never write a lore bible before the loop is validated, never write pillars before the
first prototypes exist.** Pillars describe something the team already found by building
— a cut filter applied afterward, not a search method applied before. A lore document
with zero passes on the other pillars is comfort-zone bias (writers over-write lore,
programmers over-polish one system), not thoroughness.

---

## 7. Kill criteria and the Production Point

**Write the kill criterion before the prototype starts, not after it stalls.** One
sentence, one date, decided while still unattached to the answer — the single
highest-return piece of writing in indie production, and almost nobody writes it.

**The Production Point** is the deliberate gate between pre-production and full
production. Before it: rapid prototypes, paper designs, validating the qualitative
challenge — explicitly no balance spreadsheets or data pipelines yet, since that work is
wasted if the loop doesn't survive testing. The gate asks three questions together:

1. Has the core loop proven fun?
2. Is the aesthetic/fantasy hook resonant?
3. Is scope and architecture realistic to finish?

Only a clean pass on all three opens the door to data-driven balancing and content
production.

**The "glimmer of hope" standard**: kill a project early if it no longer carries a
genuine chance of being exceptional, even absent financial pressure. A merely-fine
project is an active opportunity cost against whatever else the team could build.
Cancellation isn't a full loss — tooling and skills (an art pipeline, a netcode stack)
carry forward into the next project.

**The stepping-stone trap**: a "small warm-up" project, explicitly scoped down from the
real ambition, is where teams most reliably lose scope discipline, precisely because it
doesn't feel like a real project. Feature scope (abilities, leaderboards, procedural
systems) creeps until the quick side project has consumed 6-9 months of real production.
Treat any side project with the same discipline as a main one, or don't start it.

---

## 8. Named failure cases from the GDC Failure Workshop

**Prototype sunk cost — *Solo* (Team Gotham).** $45,000, half the vertical-slice budget,
six months on a prototype the team itself called "boring," "like doing homework" —
funded past the first sign it wasn't fun. Proves: validate fun during graybox before
committing a pipeline; if a prototype feels like homework by month three, that's the
answer, not a reason to extend it.

**Multi-game pack scoping — *Shoot Shoot Mega Pack* (*Zoom*, *Sync*, *Void*, Team
Gotham).** Four distinct mini-games under one umbrella multiplied production overhead
and fragmented PR into four small pushes instead of one focused one. Proves: a
multi-idea structure raises risk sharply unless the modules genuinely share core asset
and technical pipelines — bundled "small" games without shared surface aren't small.

**Genre/platform port done right — *Skullgirls Mobile* (Hidden Variable Studios).** The
contrast case, not a failure: porting a hand-animated fighting game to F2P mobile
required redesigning the input paradigm (swipe/tap vs. joystick) and the progression
layer (skill trees, rarity, daily loops) from scratch, not shrinking the original as-is.
Proves: crossing a real production-surface boundary is a redesign, not a resize.

---

## 9. The last 10%

**The final 10% of a project — bug fixing, edge cases, certification, cleanup —
consumes roughly 90% of the total grind**, and is the point of highest risk for
abandoning the project for a shinier new prototype. Teams budget it proportionally to
the rest; it isn't proportional. Remaining risk and remaining hours both concentrate
there at once, which is why it gets mis-budgeted: the visible task list looks short
while the actual work doesn't shrink at the same rate.

Treat the phase as universal and predictable, not a sign this particular project has
gone wrong. Finishing one flawed game teaches more than starting ten prototypes that
never leave the prototype phase. If burned out during this phase specifically, step
away for one to two weeks, then return with an objective punch list rather than pushing
through in the state that produced the burnout.

**The two-stage pipeline** some teams use to manage this cost: ship a freeware or
vertical-slice stage first (lightweight engine, minimalist art, the raw loop) to prove
the loop is fun and build an early following — then, only once validated, rebuild for a
commercial stage (full engine, tutorials, accessibility, certification) rather than
carrying a prototype's technical debt through the whole last-10% phase.
