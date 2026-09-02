# Ruling: Playtesting Methodology

Reconciles five tensions across Indie Game Clinic (*The Ultimate Playtest Guide*, *Game Design Documents*, *I Played 150 of Your Games*, *Design by Constraint*, *Derek Yu / Spelunky*), GDC (Adriaan de Jongh, *Playtesting: Avoiding Evil Data*), and GMTK (*How Neon White Lets You Speedrun Speedrunning*, *What's The Point Of Prototyping*). Audience: teams of 1–10.

The short version: these sources are not five arguments. They are one method described at four different altitudes — who you invite (3-Wave), what you capture in the room (think-aloud), how it goes wrong (evil data), and what you're allowed to do with the result (problems-not-solutions). Most of the apparent conflict is altitude confusion.

---

## Tension 1 — Non-intervention vs. moderation and debrief

**The question.** A tester is stuck on the same wall for six minutes. Indie Game Clinic's think-aloud protocol says strict non-intervention: never explain, never defend, only intervene for a hard engine-blocking bug. Practitioner counter-wisdom says silent observation with no moderation over-indexes one session's noise and burns a scarce tester's goodwill on a wall you already understand.

**Where non-intervention is right.** During the window in which the friction is still producing new information. IGC's justification is precise: the stuck player is the instrument that exposes weak visual hierarchy, missing affordances, and absent signifiers. The moment you speak, that instrument is destroyed for the rest of the session and cannot be rebuilt — de Jongh's dev-explanation trap (evil data #3) is that any scaffold you supply masks the real UX failure, because the player in the wild gets no scaffold. Derek Yu's curse-of-knowledge point compounds it: you are the person least able to notice which of your controls is counter-intuitive, so your instinct about *when* the tester "obviously" needs help is exactly the instinct that is broken.

**Where moderation is right.** After the information rate hits zero. A tester repeating the same failed input with no new hypothesis is no longer generating data — they are re-confirming a finding you already timestamped, while the entire rest of the build goes untested. On a scarce roster (see Tension 5) that is a wasted tester, not a rigorous one. IGC's own decision rule — act when 3+ independent testers snag on the exact same spot — means one tester's wall is *never* actionable alone anyway; grinding them against it buys nothing you won't get from tester two.

**Decision rule.** Non-intervention is absolute at every stage. The source rule is explicit: never explain a mechanic, guide the player, or defend a design choice during play, and intervene only when a hard bug blocks progression. A tester who is stuck is producing the finding, and the discomfort of watching it is the price of the data. A timed "stuck clock" heuristic was considered here and is *not* adopted: no source in this corpus supports one, and a timer converts the one unambiguous rule in playtesting into a judgement call made under social pressure. When a hard bug does force you to speak, three constraints apply:

- **Give the input, not the model.** "Try dragging the door" unsticks them. "The doors in this game open with a drag because they're heavy" contaminates every door downstream. Say the minimum, then go quiet again.
- **Say it out loud that it's the game's fault.** "That's on us, let me get you moving so you can see the rest." Preserves candour; a tester who feels stupid stops narrating.
- **Log the intervention.** Everything after that point is scaffolded data and cannot be used to judge onboarding.

**Where the debrief goes.** After the build is closed, never during. And the debrief is not a survey — de Jongh's ban (evil data #7) is on rating scales and written questionnaires as the primary instrument, because they're recency-biased toward the last two minutes and yield no "why". Verbal debrief asking about *experience* is a different tool. Ask "what were you trying to do when you were at the door" and "where did you feel most lost". Do not ask "what would you change" (Tension 2).

**Default for indies.** The same rule at every stage: record and stay silent. If a wall is eating a whole session's worth of downstream observation, end the session and fix the wall before the next one rather than talking the tester past it, which contaminates everything after that point. The pre-launch demo is the strictest case, because it is a fidelity test of the shipping experience: a player who quits is the finding, and rescuing them destroys the only measurement that matters. If you cannot bear to watch, that is the result.

---

## Tension 2 — "Players are almost always wrong about the fix" vs. RITE and A/B

**The question.** Derek Yu's tennis-racket rule and de Jongh's problems-vs-solutions countermeasure (evil data #6) both say discard tester-proposed fixes. RITE (IGC, via Adam/FartFish) fixes the flaw between one tester and the next; A/B indicator testing (Alejo) builds both variants and lets the data pick. In practice these look like doing what testers say, fast. The distillations flag this line as asserted rather than distinguished. Here it is distinguished.

**Where "players are wrong" is right.** Whenever the input is a *proposal* — a sentence that only exists because someone said it. de Jongh's Hidden Folks garage door is the canonical case: an unfamiliar drag gesture, testers requested a tutorial arrow, the arrow made the game patronising and killed discovery. The actual fix was a subtle wiggle and haptic on tap. The proposal was wrong; the friction it pointed at was real. IGC's playtester taxonomy sharpens this by tester type — high-level competitive players give hyper-skewed balance advice and may conceal exploits, fellow developers give theoretical architecture solutions instead of emotional reaction. The rule is: **observe their actions, ignore their design suggestions.**

**Where RITE and A/B are right.** Neither one acts on a proposal. RITE acts on an *observed* failure plus the developer's own diagnosis, then re-tests to check the diagnosis. In *Alchemist's Alcove*, testers stalled on single-use spells; the team diagnosed progression stall and shipped multi-use, and the satisfaction jump was the verification, not the request. A/B is stricter still — Alejo's method defines the observable indicator *in advance* ("does the player repeatedly try to jump here, or navigate smoothly"), which makes it impossible for tester opinion to enter at all. Both are behaviour-driven. Yu's rule was never against acting fast; it was against acting on words.

**Decision rule — the muted-video test.** Would you have identified this change from a silent recording of the session with the audio off? If yes, it is behaviour: act, and act fast. If it only exists because someone said it out loud, it is a proposal: downgrade it to *evidence that a friction exists at that location*, name the underlying friction in your own words, then generate your own candidate fixes — of which the tester's suggestion is at best one, and usually the most literal and least interesting one.

**Trust ranking (act freely at the top, never at the bottom).**

1. **Unprompted emergent behaviour** — highest trust, because it cannot be a request. GMTK's Neon White is the model: once the card draws became deterministic, playtesters spontaneously stopped playing cautiously and started racing each other for times. Nobody asked for a speedrunning game. The team rebuilt around it. When you see players inventing their own goal, that is the design telling you what it wants to be.
2. **Repeated observed friction** — 3+ independent testers snagging in the exact same place (IGC consensus rule). Act.
3. **Think-aloud statements of feeling in the moment** — "I don't know what this does", "I feel lost". Trustworthy as symptom, per Yu: players are almost always right about how they feel. Diagnose yourself.
4. **Post-session statements of preference** — recency-biased, politeness-biased. Treat as a hint about where to look next session.
5. **Proposed fixes** — never implement. Mine for the friction underneath and discard the rest.

**Scope limit on RITE.** RITE's speed is also its hazard: it will happily let you chase one tester's noise. Licence it only for **defects** — things no player would choose, like an unreadable affordance, absent feedback, a broken flow, or de Jongh's trivial-oversight class (evil data #5: settings popping up every level load, an item under the wrong visual layer). Do **not** run RITE on matters of taste, difficulty, or design pillars; that is where Derek Yu's "pillars win" rule applies and where you need three waves of evidence, not one tester and an hour.

**Default for indies.** Fix defects between testers, same day, no discussion. Everything touching the core loop, difficulty, or a stated pillar waits for consensus across a full wave.

---

## Tension 3 — "Explain nothing to testers" vs. a maximally legible pitch

**The question.** de Jongh says throw testers in cold, explain nothing (evil data #3). Kickstarter practice (HybridTheory, AskGamedev) says build a maximally legible elevator pitch, GIF-heavy page, and a demo that spells out the hook. These are not in conflict, and the reason matters more than the conclusion.

**They are the same rule.** Both artefacts are being tested for the same property: **can it do its job with no developer in the room?** The pitch is over-explained because a store page has to convert a cold stranger who will never meet you. The build is under-explained in a test because it also has to convert a cold stranger who will never meet you. In both cases the standard is identical — no dev voice present. What differs is only how much explanation each artefact is permitted to carry *natively*. A Kickstarter page has unlimited text budget. A game has almost none: IGC's *Make a Self-Explanatory Game* puts it at two seconds to convey objective, danger, and interaction vectors, with 2–3 minutes before an unknown indie game gets closed.

So: **explain the pitch, never explain the controls.** If you find yourself narrating the game to a tester, you have discovered that the build is carrying explanation it cannot actually carry — that is the finding, not an inconvenience.

**The real conflict, and where it lives.** Not between the two artefacts — at the seam between them. The pitch sets an expectation the first three minutes of the build must pay off, and GMTK's *Who Gets To Be Awesome* names the failure mode exactly: frustration is reality violating expectation. A pitch that promises a tactical puzzler attached to a demo that opens with twitch platforming produces testers who look confused for reasons that have nothing to do with the platforming.

**Decision rule.** Test the seam explicitly, at least once before launch. Show the capsule art, the trailer, or the pitch paragraph. Ask what they expect to be doing in the first five minutes. Write it down. *Then* hand them the build, cold, and say nothing. The gap between the predicted experience and the observed one is the single highest-value finding available in pre-launch testing, and neither the pitch sources nor the playtest sources look for it on their own.

**Two sanctioned things you may always say.** de Jongh's one exception — "the game isn't finished yet" — is social-anxiety relief, not content explanation; it frees testers to be candid instead of protecting their own intelligence. IGC's ugly-prototype rule is the same countermeasure made in-build: watermark it "Pre-Alpha — Everything Subject to Change" and keep the art deliberately rough, because a visually finished game makes testers subconsciously withhold fundamental criticism. Use both. And note the corollary: *"if you aren't slightly embarrassed by your test build's visual state, you waited too long to test."*

**Scope limit.** "Explain nothing" governs game content only. Explain logistics fully and clearly: session length, that you're recording, what happens to the footage, consent, hardware, how to quit. That is not game content, and confusion there corrupts the session for no benefit.

---

## Tension 4 — Eight sources of evil data vs. 3-Wave and think-aloud

**The question.** de Jongh's eight evil-data categories and IGC's 3-Wave + think-aloud read as two competing methodologies. They aren't. 3-Wave answers *who and how many*. Think-aloud answers *what you capture in the room*. Evil data is neither — it is a **validity checklist**, the eight ways any of the above silently produces garbage. It is a layer over the protocol, not a rival to it.

Mapping, so nothing is lost:

| Evil data source | Where it lives in the protocol |
|---|---|
| 1. Location/context mismatch | A precondition on every session. Match the setting to intended play context — party games at parties, quiet narrative games at home. *Bounden* built around 5-minute expo sessions, over-optimised the opening, and only ~1.3% of players engaged past 30 minutes; *Fingle* read as awkward at an IGF booth and natural on a home couch. Expo data is marketing data, not design data. |
| 2. Tester demographic bias | This *is* the wave-composition rule; merge it with IGC's playtester taxonomy (casuals, genre outsiders, genre veterans, competitive players, fellow devs). Coworkers and hardcore friends bring hardcoded genre assumptions and over-read flavour text as instruction. |
| 3. Dev-explanation trap | Think-aloud's non-intervention rule. Tension 1. |
| 4. Macro vs. micro blindness | Never silo a session into UI-only or combat-only. Every session runs the whole build, so macro blockers (indistinguishable targets, a 4-player local game assuming four controllers) can't hide behind jump-curve tuning. |
| 5. Frozen-build friction (1-minute rule) | The mandatory floor of RITE. If a trivial oversight is producing obvious false friction, fix it between testers — otherwise it silently ruins ten consecutive sessions. |
| 6. Problems vs. solutions | The trust ranking. Tension 2. |
| 7. Surveys and rating scales | Replaced by observation plus verbal debrief. Star ratings and questionnaires give no "why" and mostly record the final two minutes. |
| 8. Remote-data hierarchy | Governs Wave 3 and all remote testing: written feedback (worst) → analytics/funnels (*what*, never *why*) → click/spatial heatmaps → gameplay video with live audio in a natural setting (best). |

**Two merges worth stating explicitly.**

RITE and the 1-minute rule are the same move at two severities. The 1-minute rule is compulsory (trivial bug, fix it now, no judgement required); RITE proper is discretionary (design defect, fix it now, requires a diagnosis you might get wrong). Run them as one habit: *the build is never frozen between testers.*

Telemetry and the remote hierarchy interlock. IGC's automated telemetry (drop-off by level or room, time per encounter, which abilities players never touch) sits at hierarchy tier 2 — it is the *what*. **Never let a tier-2 signal drive a design change on its own.** Analytics tells you where to point the camera; a tier-4 session (video + live audio) tells you why 50% quit on level 3. This is the one rule that keeps a public playtest from producing confident, expensive, wrong decisions.

**One clarification that prevents the most common misread.** The 3-Wave model is **per build, not per project.** Every meaningful build runs 1 → 2 → 3. You do not spend year one in Wave 1 and year three in Wave 3.

---

## Tension 5 — The 30-minute / 20-tester rule vs. scarce testers

**The question.** IGC's GDD video: never build more than 30–45 minutes of content or more than one level before getting it in front of 10–20 outside testers (not friends, not family). A solo dev may personally know four people willing to play.

**Where the rule is right.** Its real function is as a **content brake**, not a sample size. It exists to stop you building level 12 before level 1 is validated — the same failure IGC's *150 Games* corpus names as premature content expansion (multiple levels, characters, and skill trees built before core movement feel is validated) and *Design by Constraint* calls turd-polishing: if the first five minutes of the core loop isn't fun, fifty hours of content doesn't fix it. That function is fully intact at three testers. Do not let scarcity become permission to keep building.

**Where scarcity is right.** Twenty fresh outsiders per iteration is not achievable for a solo dev, and twenty is not doing statistical work anyway — it is nowhere near significance for anything. IGC's own actionable threshold is 3+ independent testers on the same spot. More importantly, the rule ignores the actual economics: **a tester is a consumable.** Once someone has played your opening, they can never again give you a first-run experience of it. Spending twenty virgin testers on a build with a known trivial blocker is the most expensive mistake in this whole document (evil data #5).

**Decision rule.** Read it as **3-serial-then-stop, not 20-parallel.** Run testers one at a time. Fix between them. Stop the wave the moment three independent testers hit the same wall — you have the finding, and every further tester on that build is a burned virgin. In practice this turns "20 testers" into four to six waves of three or four across the project's life, which a solo dev can actually source, while preserving the content brake exactly.

**Scarcity is usually a pipeline failure, and sometimes a diagnosis.** de Jongh's low-overhead system is the fix: a tester database (spreadsheet by profile, background, platform), a standardised invitation email with beta key and recording instructions, and an automated 7-day follow-up. Benchmarks: in-person gets ~100% response; online invites ~30% within 7 days, plus roughly another 30% from one polite reminder; 30–50 template emails yields 20–30 hours of gameplay footage per milestone. If you are testing with four people, you have not sent thirty emails.

And per IGC's Chris Jarvis: **struggling to recruit playtesters for an early prototype is itself a warning sign of weak market appeal.** Before you treat scarcity as a logistics problem, check that it isn't a verdict.

**Default for indies.** Minimum three outsiders per build, never zero. Rotate composition: roughly half fresh (the only people who can test onboarding) and half returning (the only people who can verify a fix actually landed without regressions — which is exactly Wave 3's job).

---

# Master Playtest Protocol

One protocol, three stages. Wave 1 → 2 → 3 runs inside each build. Evil-data countermeasures are preconditions, not a separate pass.

## Standing rules (all stages, no exceptions)

1. **The build is never frozen between testers.** Trivial defect → fix now (1-minute rule). Design defect with a clear diagnosis → fix now and re-test on the next tester (RITE). Taste, difficulty, or pillars → wait for wave consensus.
2. **Explain nothing about the game.** Two permitted lines: "it's not finished yet" and full session logistics. Watermark the build "Pre-Alpha — Everything Subject to Change."
3. **Record video plus live audio.** No star ratings, no written questionnaires as your primary instrument.
4. **Watch hands and eyes, not lips.** Tense shoulders, controller grip, sighs, eye wandering; skipped dialogue, running past objectives, repeated failed inputs, hesitation at navigation splits, the quit moment.
5. **The muted-video test gates every change.** Behaviour → act. Words proposing a fix → extract the friction, discard the proposal.
6. **Act on consensus (3+), not on incidents.** Except for defects, which need no consensus.
7. **Test in the setting that matches intended play.** Expo footage is marketing data.
8. **Every session runs the whole build.** No UI-only or combat-only sessions.
9. **Sessions are the schedule.** A booked playtest is an immovable milestone against scope creep and the one-year void; end every 2-week sprint in a testable build.

## Stage 1 — Prototype

**Question being answered:** is it fun, is it viable, will anyone care (GMTK's three prototype hypotheses).

- **Test appeal with zero code first.** IGC's *Engagement vs. Appeal*: appeal validates externally via a single character GIF, concept art, or a pitch paragraph — no build required. Engagement validates internally via private frequent tests. Decouple them; do not read "nobody clicked the GIF" as a gameplay problem.
- **Wave 1 only, and it repeats.** 2–3 testers, insiders acceptable at this stage — bias is harmless when you are hunting soft-locks, crashes, and severe onboarding confusion. Run de Jongh's 48-hour loop (the *Bounden* model): day 1 build, day 2 test, day 3 fix, day 4 test. Impromptu social testing (the *Fingle* model — bring builds to weekly casual gatherings) covers volume cheaply.
- **Stuck clock: 5 minutes**, then unblock with the minimum input.
- **Watch for emergent behaviour above all else.** This is the stage where Neon White's playtesters started racing each other unprompted. Unprompted goal invention outranks every other signal you will collect all project.
- **Kill criteria.** GDC Failure Workshop: if the prototype feels like homework by month 3, kill it. GMTK: canning after public indifference costs weeks, not years.
- **Exit when** fun, viability, and audience interest are each validated — then stop prototyping.

## Stage 2 — Vertical slice

**Question being answered:** does the validated loop survive contact with strangers, and does it hold for 30 minutes.

- **Scope the artefact first.** 5–10 minutes of polished single-level slice (*Design by Constraint*), and hard-cap total content at 30–45 minutes or one level until this stage clears (GDD rule).
- **Full 3-Wave, per build.**
  - *Wave 1* — 2–3 testers, smoke test: game-breakers, soft locks, severe onboarding confusion. Insiders fine.
  - *Wave 2* — the main event, and the first wave where composition is a validity requirement rather than a convenience. Outsiders only: non-gamers, genre outsiders, genre veterans, different ages and cultural backgrounds. If your audience is children, remember parents are gatekeepers — a loop parents can't parse never reaches the kid. Expect 3–5 revision cycles per major issue before you add any new content.
  - *Wave 3* — curated group plus fellow devs, verifying that reworks actually fixed the prior friction without regressions. Returning testers belong here, not in Wave 2.
- **Think-aloud is the primary instrument.** Ask for stream-of-consciousness narration. Strict non-intervention throughout; speak only for a hard bug, and log it when you do.
- **RITE is live.** Fix between testers; re-test the diagnosis on the next person.
- **A/B where a real fork exists.** Define the observable indicator in advance ("does the player repeatedly try to jump here"), build both variants, run against separate groups, decide on the data. GMTK: don't argue double-jump vs. air-dash in a meeting, build both in thirty minutes each.
- **Stop the wave at 3 concordant snags.** Fix, rebuild, restart the wave with fresh testers.
- **Recruitment runs in parallel.** Start the tester database now; send 30–50 invitation emails per milestone; 7-day automated reminder.
- **Do not add content until Wave 3 comes back clean.**

## Stage 3 — Pre-launch demo

**Question being answered:** will a cold stranger who owes you nothing start, understand, and finish this — and does it match what the marketing promised.

- **No intervention at all.** This is a fidelity test of the shipping experience; the quit is the measurement. Watch the full session anyway.
- **Run the seam test.** Show the capsule, trailer, or pitch paragraph. Record what they expect to be doing in the first five minutes. Then hand over the build cold. The prediction-vs-observation gap is the highest-value pre-launch finding available.
- **Scale via the funnel** (IGC/Enkidu): private community or newsletter, 20–50 users → public beta or Steam playtest, 1,000+ → targeted closed re-tests → demo release.
- **Instrument, then investigate.** Telemetry tracks drop-off by level or room, time per encounter, and which systems and abilities players never touch. That is tier 2: it is *what*, never *why*. Every telemetry-flagged hotspot must be followed by at least one tier-4 session — video plus live audio, in the player's natural home setting — before you change anything. Heatmaps (tier 3) are the useful middle: they pinpoint where players tapped and got no expected feedback.
- **Written feedback stays at the bottom.** Read public comments for sentiment and for locating friction. Never treat them as a design input; they are dense with proposed fixes.
- **Remote sessions are worth the setup.** Beta key, recording instructions, unlisted upload guide, 7-day reminder — 30–50 emails buys 20–30 hours of footage.

## The one-line version

Watch, don't talk. Fix defects instantly, taste never. Trust what players do, discard what they propose — except when they invent a goal you never designed, and then follow it.
