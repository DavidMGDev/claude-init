# Playtesting

How to run a test, who to put in front of the build, what to say to them, what to
record, and how to separate real signal from data that will send the prescription in the
wrong direction. Not design fixes — see `design-clinic.md` and `prototyping-and-fun.md`
for what to build once a test names the cause. Not marketing metrics — see
`marketing.md` and `numbers.md`.

Developers are unreliable observers of their own game. You cannot unlearn what you
built, so your mental model of the build is always better than what a stranger
experiences. That is the reason every rule below exists.

## Standing rules — every stage, no exceptions

1. **The build is never frozen between testers.** Trivial bug: fix it in the gap between
   sessions. Design defect with a clear diagnosis: fix it and re-test the very next
   tester (R.I.T.E.). Taste, difficulty, or a stated pillar: hold for a full wave.
2. **Explain nothing about the game.** Two permitted lines: "it's not finished yet," and
   full session logistics — what happens to the recording, how to quit, how long it
   takes. Watermark the build "Pre-Alpha — Everything Subject to Change."
3. **Record video and live audio.** No star ratings, no written questionnaire as the
   primary instrument.
4. **Watch hands and eyes, not lips.** Tense shoulders, controller grip, sighs, eye
   wandering, skipped dialogue, running past objectives, repeated failed inputs,
   hesitation at navigation splits, the moment they quit.
5. **The muted-video test gates every change** (below).
6. **Act on consensus of three or more testers hitting the same spot. Defects need no
   consensus.**
7. **Test in the setting that matches intended play.** Expo footage is marketing data,
   not design data.
8. **Every session runs the whole build.** No UI-only sessions, no combat-only sessions —
   a macro blocker (indistinguishable targets, a local four-player game assuming four
   controllers) hides behind narrow-scope testing.
9. **Sessions are the schedule.** A booked playtest is a milestone against scope creep.
   End every sprint in a testable build, not a polished one.

## The three stages

One protocol, three altitudes. Each answers a different question and changes who is
allowed in the room.

| Stage | Question | Recruits | Count | Intervention |
| --- | --- | --- | --- | --- |
| Prototype | Is it fun, is it viable, will anyone care | Insiders acceptable | 2-3, repeated | Hard bugs only |
| Vertical slice | Does the loop survive strangers, does it hold 30 minutes | Outsiders for Wave 2 | 3 waves of 2-4 | Hard bugs only |
| Pre-launch demo | Will a cold stranger start, understand, and finish it | Cold strangers only | funnel-scaled | Hard bugs only |

### Stage 1 — Prototype

Test appeal before engagement, and with no code at all: a character gif, concept art, or
a two-sentence pitch, shown publicly. If nobody clicks, that is an appeal finding, not a
gameplay finding — don't read it as a mechanics problem. Struggling to recruit even a
handful of testers for an early prototype is itself a warning sign of weak appeal; check
that before treating scarcity as a scheduling problem.

Wave 1 only, and it repeats. 2-3 testers, insiders fine — bias is harmless when the job
is hunting soft locks, crashes, and severe onboarding confusion, not reading subtle
friction. Run a 48-hour loop: day 1 build, day 2 test, day 3 fix, day 4 test. Bring rough
builds to casual social gatherings for cheap volume between formal sessions.

Watch for unprompted emergent behaviour above every other signal at this stage. A
playtester inventing their own goal you never designed — racing for time instead of
playing cautiously, say — outranks everything else you will collect on the project.
Follow it.

Kill criterion: if the prototype still feels like homework by month three, kill it. One
studio spent $45,000 and six months confirming a loop the team itself called "like doing
homework" before stopping.

### Stage 2 — Vertical slice

Scope the artefact first: a 5-10 minute polished slice. Hard-cap total content at 30-45
minutes or one level until this stage clears — the cap exists to stop you building level
12 before level 1 is validated, and it holds even with three testers instead of twenty.

Run the full three waves, per build:

- **Wave 1** — 2-3 testers, smoke test for game-breakers, soft locks, severe onboarding
  confusion. Insiders fine.
- **Wave 2** — the main event, and the first wave where composition is a requirement, not
  a convenience. Outsiders only. Expect 3-5 revision cycles per major issue before adding
  any new content.
- **Wave 3** — a curated group plus fellow developers, verifying that a fix actually
  landed without a regression. Returning testers belong here, never in Wave 2.

Think-aloud narration is the primary instrument: have the player say what they're doing
and why, out loud, continuously. Then hold strict non-intervention. Never explain a
mechanic, guide the player, or defend a design choice while they play, however
uncomfortable watching them fail becomes. The only thing that justifies speaking is a hard
bug that blocks progression, and being stuck is not one: a player stuck for ten minutes is
the finding, and rescuing them deletes it. Say up front that anything confusing is the
build's fault rather than theirs, to keep them candid. If you do have to intervene, log
it, because everything after that point is scaffolded and cannot be used to judge
onboarding.

R.I.T.E. runs live inside this stage: fix the defect, re-test the diagnosis on the next
person through the door. Where a real design fork exists — jump versus dash, arrow
versus wiggle — define the observable indicator in advance ("does the player repeatedly
try to jump here"), build both, run them against separate groups, decide on the data.

Stop a wave the moment three testers snag on the same spot. Fix, rebuild, restart with
fresh testers. Start recruiting for the next wave in parallel — see Recruiting, below.

### Stage 3 — Pre-launch demo

No intervention, ever. This build is a fidelity test of the shipping
experience. A player who quits is the finding; rescuing them destroys the only
measurement that matters. Watch the full session anyway.

Run the seam test once before launch. Show the capsule, the trailer, or the pitch
paragraph, and ask what the tester expects to be doing in the first five minutes. Write
it down. Then hand over the build cold and say nothing. The gap between what the pitch
promised and what the build delivered is the highest-value pre-launch finding available,
and no other test surfaces it.

Scale recruitment through a funnel: private community or newsletter (20-50) → public
beta or Steam playtest (1,000+) → targeted closed re-tests → demo release. Instrument
before you investigate: telemetry (drop-off by level, time per encounter, ignored
systems) tells you *what*, never *why*. Every telemetry-flagged hotspot needs at least
one full session — video and live audio, in the player's own setting — before you change
anything on the strength of the numbers alone.

## The eight sources of evil data

Adriaan de Jongh's term, from his GDC talk *Playtesting: Avoiding Evil Data* — data that
is confusing, contradictory, or misleading, and that pushes a team toward guesswork.
Left unchecked it produces the classic over-tutorialization failure: testers get
confused by something genuinely well-designed, ask for an explanation, the team adds a
tutorial arrow or a popup, and the discovery the mechanic was built around dies.

| # | Source | Recognise it by | Countermeasure |
| --- | --- | --- | --- |
| 1 | Location/context mismatch | An intimate, slow, or social game tested in a loud public setting produces false negatives; a booth-optimized opening leaves depth untested | Test in the setting that matches intended play — party games at parties, quiet games at home, mobile on a couch or commute |
| 2 | Tester demographic bias | Coworkers and hardcore friends bring hardcoded genre assumptions, unusual impatience, and read flavor text as mechanical instruction | Diversify: non-gamers, kids, parents, different backgrounds. For a young audience, test parents too — they gatekeep access |
| 3 | Dev-explanation trap | Explaining controls or story before play masks the exact UX failure a real player would hit alone | Explain nothing. The one exception: "the game isn't finished yet," to relieve social anxiety, not to teach content |
| 4 | Macro vs. micro blindness | Obsessing over a jump curve while missing that half the household doesn't own four controllers | Run whole-build sessions, never siloed to one system |
| 5 | Frozen-build friction | A trivial bug — settings popping every level load, an item under the wrong layer — silently ruins ten straight sessions | Fix it in the one minute it takes, the moment it's caught |
| 6 | Problems vs. solutions | Implementing a tester's literal suggestion. Hidden Folks testers asked for a tutorial arrow on a garage door; the arrow made the game patronizing and killed discovery | Discard the proposal, keep the friction. The eventual fix was a subtle directional wiggle and haptic tap-hint, not the arrow |
| 7 | Surveys and rating scales | Star ratings and post-session questionnaires give no "why" and are dominated by recency bias — written feedback mostly reflects the last two minutes | Eliminate post-play surveys. Replace with direct observation and recording |
| 8 | Remote-data hierarchy | Treating any single remote signal as sufficient | Rank, worst to best: written feedback → raw analytics/funnels (what, never why) → click/spatial heatmaps → gameplay video with live audio in a natural setting (best) |

**Recruitment numbers, with attribution.** De Jongh reports in-person playtests get
roughly 100% response. Online invites get roughly 30% response within 7 days, and one
polite reminder adds another 30% within two weeks. Sending 30-50 template invitation
emails yields 20-30 hours of high-value gameplay footage per milestone. Maintain a
standing tester database (spreadsheet by profile, background, platform), a standard
invitation template with recording instructions, and a 7-day automated follow-up. If you
are testing with four people total, you have not sent thirty emails.

## Reading behaviour, not words

**The muted-video test.** Before acting on anything a tester says or does, ask: would I
have caught this from a silent recording, audio off? If yes, it's behaviour — act on it,
fast. If it only exists because someone said it out loud, it's a proposal — downgrade it
to evidence that a friction exists at that location, name the friction in your own
words, and generate your own candidate fixes. The tester's literal suggestion is at best
one candidate among several, and usually the least interesting one.

Role split, held strictly: playtesters are the instrument that surfaces symptoms —
where they hesitate, what they misread, what they stop doing. The developer alone
diagnoses the cause and prescribes the fix. Never implement a tester's proposal
verbatim; synthesize what several sessions are showing you into your own design.

**Trust ranking**, act freely at the top, never at the bottom:

1. **Unprompted emergent behaviour** — highest trust, because it cannot be a request. A
   team watching playtesters spontaneously invent a new way to play (racing each other
   on a route nobody designed as a race) has found the game telling them what it wants
   to be.
2. **Repeated observed friction** — three or more independent testers snagging in the
   same place. Act.
3. **Think-aloud statements of feeling, in the moment** — "I don't know what this does,"
   "I feel lost." Players are almost always right about how they feel. Diagnose the
   cause yourself; don't take their guess at the fix.
4. **Post-session statements of preference** — recency-biased, politeness-biased. Treat
   as a hint about where to look next session, nothing more.
5. **Proposed fixes** — never implement directly. Mine for the friction underneath and
   discard the rest.

## Polite data

"Nice." "Has potential." "Looks cool." This is the most dangerous data a build produces,
because it reads as mild approval and is usually rejection delivered politely. Nobody
says "nice" about a game they want to keep playing.

The only reliable positive signals are behavioural and unprompted: asking to play again
without being invited to, finishing without being told there's more, playing twice
unasked. Verbal praise collected at the end of a session is the same recency bias that
disqualifies written surveys — it mostly reflects the tester's state in the final two
minutes, not the whole build.

A visually finished-looking build makes this worse: testers subconsciously withhold
fundamental criticism because they assume it's too late to change anything. Keep test
builds deliberately rough and watermarked as unfinished so testers believe their
criticism can still land. If you aren't slightly embarrassed by your test build's visual
state, the test came too late.

## When to act on one tester, and when to wait

License single-tester, same-day action only for **defects**: an unreadable affordance,
absent feedback, a broken flow, or the trivial-oversight class above. No player would
choose these; fixing one costs nothing to get wrong.

Hold for a full wave (three or more concordant) on anything touching **design or
taste** — the core loop, difficulty balance, a stated pillar. A single tester's opinion
on these is one data point, not a verdict, and locked pillars exist specifically so that
one loud session can't overrule the project's direction.

R.I.T.E.'s speed is also its hazard. The method fixes glaring design flaws as well as
defects, and the source's own case has it changing single-use spells to multi-use, which
is a balance decision rather than a bug. Keep the discipline that the fix has to be
re-tested on the next tester before it counts as confirmed, or the speed turns into
chasing one tester's noise into a permanent design change.

## Difficulty complaints: run the attribution test first

Before touching a number, ask the tester to narrate their last three failures out loud.
A named cause ("I got greedy," "mistimed the dodge") is intended challenge. "I don't
know," "it just hit me," or a description of something the game didn't actually do is a
barrier — fix responsiveness, telegraphing, or contrast, then re-test, and leave the
numbers alone. This is a playtest technique, not a balance pass; full decision tree and
the attribution threshold are in `verdicts.md` §7 and `rulings/r1-difficulty.md`.

## Recruiting: who's disqualified, and why

| Group | Why they distort the data |
| --- | --- |
| Friends and family | Socially compromised — won't report real friction, and their approval is politeness, not signal |
| Existing Discord / community | Already know the unwritten rules the build never taught them; internal echo chamber |
| Hardcore genre friends | Hardcoded genre assumptions, unusually impatient, treat flavor text as mechanical instruction |
| Other developers | Strong on systems and architecture feedback, but give theoretical solutions instead of raw emotional reaction — useful for Wave 3, not Wave 2 |
| High-level / competitive players | Excellent bug-hunters and exploit-finders, but may hide exploits for advantage and give narrow, hyper-skewed balance advice — observe what they do, ignore what they recommend |

The internal echo chamber is not a hypothetical. One three-person team playtested a
project almost exclusively among themselves, had a genuinely good time with it, and
shipped confusion to every external player who touched it — the team understood all the
unwritten rules and never noticed the game depended on that understanding. The project
was cancelled. Weight fresh, external confusion over internal enthusiasm every time the
two disagree.

Composition still has legitimate, non-disqualified uses: complete casuals are best for
reading onboarding and tutorial clarity but bring low mechanical literacy; genre
outsiders expose assumptions a genre veteran won't notice, at the cost of sometimes
rejecting core tropes outright; genre veterans are good on mechanical depth but carry
preconceptions from other titles in the genre. Match the tester type to the question,
and never let one type stand in for the full wave.
