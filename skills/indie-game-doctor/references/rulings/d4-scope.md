# Ruling: Radical scope constraint vs ambition-led scope

## The question, sharpened

These briefs agree on the mechanism and disagree only about where the ceiling comes from.

Both endorse the same procedure: validate the loop cheaply, start at a 4-6 week MVP, extend in fixed
6-week blocks while return per added week stays steep, stop at diminishing returns. Both cite Tyroller's
(Fun x Appeal) / Scope. Both agree feature creep is defined by cost outrunning value rather than by
calendar time. The ambition brief is right that treating the 4-6 week MVP figure as a shipping cap
misreads its source, and the constraint brief agrees, calling its own rule a ratchet rather than a
permanent size limit.

What survives: **does the target size come from a minimization default, or from what the chosen genre and
price point require to compete?**

The ambition brief also lands a hit the constraint brief answers only by counterexample. Steam's
thresholds are absolute and do not scale down with team size: roughly $8,000 gross in 24-48 hours for New
& Trending, roughly $150,000 in six months to sustain traction. At a $10-20 price that is 10,000-15,000
units. A three-person team does not get a smaller bar for being three people.

## The word doing the damage

"Small" is being used for two different things, and separating them dissolves most of the disagreement.

**Production surface** is how many things you have to build and maintain: disciplines, pipelines,
characters, bespoke assets, systems, platforms.

**Player-facing depth** is how much game the player experiences: hours, replayability, strategic variety,
mastery ceiling.

Every game the constraint brief cites as proof that small games sell is small in production surface and
large in player-facing depth. Thronefall has no character rigs and hundreds of hours of community
playtime. Balatro is one artist's UI and a combinatorial explosion. Vampire Survivors, Mini Metro, Devil
Daggers, the same shape. Meanwhile the ambition brief's depth requirements, drawn from genre expectations
and the playtime medians, are all player-facing depth claims. Neither brief is arguing for the other's
weak quadrant.

|                            | Shallow player-facing depth | Deep player-facing depth |
| -------------------------- | --------------------------- | ------------------------ |
| **Small production surface** | No viable Steam price. The itch-shaped game. | **The target.** Thronefall, Balatro, Mini Metro. |
| **Large production surface** | Barren open world. The $45k homework prototype. | Needs a studio you do not have. |

## The ruling

**Minimize production surface as hard as the vision survives. Let player-facing depth be set by what the
genre expects and the price demands. Buy the gap between them with combinatorics, not with headcount.**

The constraint brief wins on production surface, decisively, because estimation error is proportional and
because a small team cannot buy the 10 to 40 level designers a large surface implies. The ambition brief
wins on player-facing depth, because Steam's revenue bars and the 25-45 minute demo playtime medians are
absolute, and because there is no viable price for a thin game: EUR 15-17 creates friction on an unrefined
game, EUR 9-10 loses to free.

The conversion mechanism is the reconciliation. GMTK's synergy math is the cleanest statement of it: 20
isolated elements yield about 20 strategies at full production cost each, while 10 interacting elements
yield 100+ at roughly half the asset cost. Procedural generation, mastery-based replay, star-gating and
text volume are the other named routes. A team that needs more depth and reaches for more content is
buying the expensive version of something combinatorics sells cheaply.

For a doctor's use: *your budget is the number of things you have to build. Your target is the number of
hours the genre expects. If those two numbers do not meet, the answer is more interaction between fewer
parts, not more parts.*

## Where each side is right

**Constraint is right** when the team has a burn rate, no shipped title in the genre (so velocity is
uncalibrated), a missing discipline such as animation or netcode, or a loop that can be graybox-validated.
The proportional-overrun argument is the strongest single piece of reasoning in either brief: a 6-month
scope takes a year, a 1-month scope takes two months, so only shrinking the baseline shrinks the absolute
overrun. Constraint is also a negotiating position before it is a design position, since cash desperation
is what produces the 100%-recoup deal that returned $0 on 25,000 copies.

**Ambition is right** when the genre sits on the high-performing list with a demonstrated depth
expectation, the loop is already validated, depth can come from interacting systems rather than bespoke
assets, runway extends past 18 months or an Early Access path exists, and the team has shipped before.
Zukowski's failure mode is scope exceeding execution ability, and an experienced team genuinely can fix
that from the execution side.

## Decision rules

1. **Audit production surface before you argue about size.** Count disciplines, pipelines, and bespoke
   asset classes. If any discipline has no owner on the team, that is the first cut, not a hiring problem.
2. **Set the depth target from the genre's floor, not from preference.** Deckbuilders, roguelites and
   grand strategy have content expectations you cannot unilaterally cut by 80% without a replacement hook.
   If you cannot meet the floor, change genre. Losing a content arms race to the genre leader is worse
   than not entering.
3. **If the demo cannot hold a 25-minute median (45 for systemic and replayable games), the game is too
   thin to price.** Fix depth before fixing marketing.
4. **Every cut needs an artistic reason.** Unjustified limits read as cheap; themed ones read as style.
   Mini Metro's diagram aesthetic removed the entire character pipeline and communicated the fantasy
   better than characters would have. A cut that solves a pipeline bottleneck and a design goal at once is
   a primary design candidate, not a compromise.
5. **Grow in 6-week increments gated on steep returns, never on calendar or ambition.** Both briefs agree.
   The moment return per added week flattens, stop and polish.
6. **If the first five minutes are not fun, more content cannot fix it.** About 1.3% of Bounden's players
   got past 30 minutes. Content behind an unfun opening is content nobody reaches.
7. **If you are reaching for crowdfunding or a publisher to close a scope gap, the scope is wrong.** That
   produces the under-budgeted campaign, asking $30k when $100k is needed, which is a documented route to
   mid-production collapse.
8. **Zero burn rate changes the answer.** A solo dev with income elsewhere can afford four years. Five
   people on payroll cannot, and calling it ambition does not change the arithmetic.

## Diagnostic questions

1. How many separate things must you build and keep working? Name every discipline and who owns it.
2. What is the shortest honest median session your current build supports?
3. What does the genre's median successful entry contain, and what is your plan to reach that number
   without proportional cost?
4. Which of your systems interact with each other, and which are isolated? Isolated systems are where
   depth is being bought at full price.
5. What was your original estimate, what is the current elapsed time, and what is the ratio?
6. If you had to remove one entire system tomorrow, which would hurt the pitch least? Why is it still in?

## What would change this ruling

- **A zero-burn team.** The proportional-overrun argument loses most of its force when overrun costs no
  money, and the ceiling should then come from the vision.
- **A genre whose appeal genuinely is breadth**, in a team that has shipped in it with a known pipeline.
  Then surface minimization fights the product.
- **Evidence on the revenue floor for genuinely small games.** Both briefs argue past each other here
  using selected cases. Median revenue by production-surface tier would settle it.
- **A distribution change that weakens absolute revenue thresholds.** The entire ambition case rests on
  the $8k and $150k bars. If discovery became retention-weighted or curation-led, the depth requirement
  would loosen.
