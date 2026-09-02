# Ruling: Design theory and planning vs prototyping and iteration

## The question, sharpened

The briefs agree on far more than the framing suggests. Both accept that theory is explanatory rather than
predictive. Both accept a one-sentence vision statement as a working razor. Both accept that schedules,
task lists and budgets must be written. Both accept that a 30-minute build settles an argument two people
could debate for a week. The iterate advocate concedes the local minimum is real; the theory advocate
concedes iteration is mandatory and that a solo dev on a six-week project should skip the paperwork.

Three disagreements survive:

1. **Authority.** When a framework and a build disagree, which one wins?
2. **The exit from a stall.** When iteration stops improving, does theory supply the way out or only the
   name for the problem?
3. **Documents.** Past a one-sentence pillar, does writing anything down pay for itself on a team of
   1-10?

Both sides also claim the same case, Team Gotham's *Solo* prototype: $45,000 and six months on a build the
team called homework. That contested case decides more than either brief realizes, so it is adjudicated
below.

## Where each side is right

**The build has authority over whether something works.** Dynamics do not exist until a human runs the
rules (GMTK, MDA). Neon White's racing behavior appeared in playtests and no pillar document would have
produced it. Tyroller's retraction list is real evidence that design-level formulas fail their own
authors, including the appeal formula he later replaced and the fun model he discovered was a reinvention
of flow.

**Theory has authority over what a failure means.** The strongest evidence in either brief is IGC's
four-causes analysis of "too hard": intended challenge, a barrier to play, stat inflation on the wrong
lever, or cognitive overload. Those demand four incompatible fixes. A team without that distinction
iterates at random and calls it responsiveness. The red-and-spiky reward item, avoided by players and then
redesigned as a broken mechanic, is a documented case of a build producing a confident wrong answer. So is
de Jongh's entire evil-data talk.

**Documents scale with readers, not with ambition.** The theory brief's conditions are the right ones:
team size above one, asynchronous work, multi-year timelines, money attached. The iterate brief is right
that a document with no reader outside the room is procrastination in a productive costume.

## The contested case: what actually killed *Solo*

The iterate brief reads it as a missing stopping rule. The theory brief reads it as "just build it" taken
to its conclusion. The theory reading is closer, but both understate how cheap the fix was.

The team built for six months. Building was not the error. The error was that nobody had written down, in
advance and while unattached to the answer, what would count as this prototype working. IGC calls that the
Production Point; the GDC panel's own lesson states it as a gate, validate fun during graybox and kill by
month three.

The missing artifact was one written sentence with a date on it. Not a design document, not a theory
chapter. That is the most transferable finding in this debate: **the writing that pays for itself is the
writing that constrains your future self, not the writing that describes your future game.**

## The ruling

**Build to find out what is true. Use theory to find out what it means. Write down only what your future
self or a second person will need to act on.**

Authority splits by question, and the debate mostly comes from conflating two of them. "Is this fun, does
this feel right, will people play it" belongs to the build, always, and no framework may overrule a
playtest on those. "Why did this fail and what should we try next" belongs to theory, because a build
answers it only by accident.

Sequence the spiral so theory sits between iterations rather than before them. On iteration one you have
nothing to diagnose, so build. From iteration two onward, name the cause before you change anything.

For a doctor's use: *your prototype is the experiment and your framework is the hypothesis. A team with no
hypothesis is not iterating, it is guessing repeatedly and calling the repetition rigor.*

## Decision rules

1. **If two people disagree about a design decision, build both cheaply instead of arguing.** Celeste
   settled double jump versus air dash in thirty minutes each. Swapping prototype ownership, as Thronefall
   did, dissolves sunk-cost deadlock better than any document.
2. **If a playtest fails, name the cause category before touching the build.** Barrier to play, challenge
   quality, difficulty quantity, or cognitive load. Changing a number before you have named the category
   is the coin flip.
3. **If every small change makes the game feel worse, you are in a local minimum.** The exit is a big
   cheap jump: a new mode reusing existing assets, or a total rebalance. Theory tells you to jump. Only a
   build tells you where you landed.
4. **Write a kill criterion before you start any prototype longer than two weeks.** One sentence, one
   date, decided while you are still unattached to the answer. This is the highest-return writing in
   indie development.
5. **Scale documentation to readers.** Solo: vision sentence, kill criteria, task list. Two to three
   people: add 2-4 pillars stated as emotions and an explicit MVP boundary. Four or more, remote, or with
   external money: add a minimalist GDD with modal verbs (WILL locked, SHOULD open to playtest, COULD
   exploratory) kept as a living document.
6. **Never write a lore bible before the loop is validated.** IGC names this pathology directly, and the
   150-game review found its symptoms everywhere: thirty unpolished weapons, skill trees built before core
   feel worked.
7. **Do not write pillars before the first prototypes.** Thronefall's "build and defend your castle"
   arrived after months of prototypes including an abandoned deckbuilder detour. Pillars describe a thing
   you have found; they are a cut filter, not a search method.
8. **Check quadrant coverage every few months.** Mechanics, aesthetics, technology, story. A programmer
   iterating on code for two years still ships a tech demo, and no volume of iteration detects that from
   inside the lane.

## What the doctor should watch for

The two failure modes are symmetric, and a team usually has exactly one of them.

*Under-theorized:* changes are reactive, the team quotes the last playtester they spoke to, the same
problem returns under a new name every month, nobody can say why the previous fix failed.

*Over-planned:* the document is longer than the playable build, mechanics are defended by reference to a
plan rather than a session, the team can describe the game in detail and has never watched a stranger
play it.

Both are treatable. Prescribe the opposite of whichever one you see.

## What would change this ruling

- **A solo team on a project under two months.** The document layer collapses entirely; keep the kill
  criterion and nothing else.
- **Competitive multiplayer.** The pipeline inverts, since networking must exist before meaningful
  prototyping, which raises the value of upfront technical planning considerably.
- **A publisher or contract where the document is the deliverable.** Then the document is the product and
  this argument does not apply.
- **Evidence that teams with written design docs ship at measurably higher rates.** Nobody in this corpus
  has that data. If it existed and was strong, rule 5 should move toward more writing at every team size.
