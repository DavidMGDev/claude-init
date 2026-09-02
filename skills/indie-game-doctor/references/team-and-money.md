# Team and Money

Who owns what, how teams break, burnout, runway, publishers, grants, and crowdfunding
mechanics. Not design, not scope sizing, not marketing tactics — those live in the sibling
reference files.

## The ownership audit

Four operational domains exist regardless of team size, and each one needs a named owner
even when one person covers three of them.

| Pillar | Covers |
| --- | --- |
| Business & Operations | Budgeting, payroll, cash flow, legal, grants, publisher pitching |
| Game Direction & Creative Vision | Core design, emotional/narrative target, final creative calls |
| Technical Direction & Engineering | Architecture, tooling, engine integration, performance |
| Art Direction & Visual Aesthetics | Visual tone, UI/UX consistency, asset pipelines, branding |

What breaks, by ownership pattern:

- **No owner.** The discipline doesn't get worse, it gets skipped. Business & Operations is
  the pillar most often left unowned on tiny teams, and the failure mode is specific:
  financial blind spots and administrative delay that nobody notices until a grant deadline
  or a tax filing is missed.
- **Ambiguous shared ownership.** Two people who both think they're covering it produces the
  same gap as nobody covering it, plus the added cost of neither noticing until something is
  overdue.
- **Single point of failure.** On a 1-3 person team, each discipline usually has exactly one
  specialist. If that person is stuck, ill, or leaves, the discipline halts entirely — there
  is no backup, because ownership was never meant to imply redundancy. Mitigate with
  documentation of critical systems and enough cross-role familiarity that someone else can
  keep the lights on, not ship at the owner's level.

Formalize this in writing on day one, even between friends: equity split, IP ownership,
compensation, responsibilities per pillar, and what happens if a founder leaves. Verbal
trust is not a substitute, and the gap it leaves shows up exactly when the team can least
afford a dispute.

Context-switching between pillars costs more than it looks like on a schedule. Block full
days by mode of work — dedicated business days, dedicated deep-creative-or-coding days —
rather than interleaving disciplines within the same day.

Team chemistry and the ability to resolve conflict under pressure is not a soft skill on a
small team, it decides whether the studio survives contact with its first real
disagreement. A good concept fails if the founders can't communicate when things go wrong,
and things go wrong on every project.

## Running day-to-day work

Process should scale to team size and phase, not run on one fixed method imported from a
larger studio.

- **Hybrid Kanban plus KPI.** Set macro weekly targets (one completed asset card per person
  per week, which across a 12-person art sub-team forecasts roughly 48 assets a month), then
  let individuals self-select tasks from a granular backlog. Add a compassionate deferral
  policy — volunteer or zero-hours contributors can skip a week without penalty — so the
  system doesn't punish people who aren't being paid full-time rates.
- **Task detail scales with phase.** Pre-production tasks stay low-to-medium detail and
  open-ended ("experiment with particle styles and propose a direction") to preserve
  exploration. Production tasks get high, unambiguous detail ("localized falling-snow
  particle system: 512x512 texture, max 100 particles/sec, scale 0.1-0.3").
- **Feedback turnaround: 24-48 hours.** Longer than that and someone is blocked for no
  reason. Lead with what the creator likes about their own work before critiquing, then give
  specific actionable critique, then reiterate strengths. Avoid feedback with no context
  attached ("looks good, just increase contrast").
- **Meetings degrade with scale.** All-hands meetings turn into unproductive lectures above
  roughly 20 people. One-on-ones become impossible above roughly 70. Past that scale, use a
  tiered structure: sub-team meetings early week, a leads meeting mid-week for blockers, then
  push resolutions back down.
- **Standardize output format, not creation software.** Mandate a specific tool only when
  there's a hard technical requirement — a proprietary plugin, rig compatibility, a pipeline
  script — and say why. Forcing everyone onto the same paint program when the export format
  is what actually matters is a fight nobody needed to have.

This is the flexible, day-to-day layer. It sits on top of the firm, written ownership layer
above — one is legal and role clarity, the other is task execution, and a team that reads
either one as the whole answer will either over-formalize or never converge.

## Creative deadlock

When two co-leads can't agree on direction and the argument doesn't resolve after repeated
discussion, the cause is almost never a genuine disagreement about quality. It's sunk cost:
both people are emotionally attached to the work they personally built, and every argument
about "which is better" is actually an argument about whose investment gets protected.

This does not respond to more debate, and it does not respond to a vote — a vote just
converts the loser's sunk cost into resentment, and a forced compromise that tries to keep
both directions produces bloat instead of a decision.

What works is structural, not persuasive:

- **Swap ownership.** Hand each lead the other's prototype and let them evaluate it as
  outside work. In the Thronefall case, Jonas had built a flower-golfing prototype and Paul
  had built the kingdom-defense prototype that became the game. Swapping let Paul spot the
  dead ends in the flower prototype without a fight — he had no investment in defending it,
  so the flaws were just visible, and Jonas agreed once he saw them from the outside too.
- **Split domain authority.** One person gets unilateral say over art, another over
  gameplay, each inside their own domain. This removes the recurring fight by removing the
  shared jurisdiction that caused it.
- **Limit the number of top-level decision-makers.** Crew members can run their own small
  explorations inside their tasks, but overall direction needs very few people with a final
  say. Every additional decision-maker at the top is another seat at the table sunk cost can
  sit in.

## Burnout

For solo and part-time projects, burnout is named as the primary risk to the project — ahead
of lack of skill, lack of funding, or a bad idea. A team that is technically capable and
financially solvent still stalls out if the people running it are depleted.

What the sources describe as working prevention:

- **Constraints that narrow the decision space.** A fixed color palette, a fixed low
  resolution, a fixed engine choice made early — these speed up decisions and cut scope
  creep by removing options, which removes a source of ongoing fatigue.
- **Pacing over brute force.** Overworking a team through a rough patch produces worse code
  and worse art, and it lengthens debug cycles rather than shortening them. "Time equals
  money, vacation is nonsense" is named directly as a symptom, not a strategy.
- **Talking about it before it turns into silence.** Silence when a project starts turning
  out poorly is the precursor to losing core partners and employees, not a neutral holding
  pattern. Force an uncomfortable, honest check-in on project health when morale visibly
  drops rather than pushing through quietly.
- **A deferral policy that doesn't punish reduced hours.** Volunteer and zero-hours
  contributors need a way to skip a week without penalty, especially across the 2-4+ year
  span a typical indie cycle runs.
- **Treat mental health as a resource to protect, not a personal failing to hide.** Indie
  culture rewards the suffering-martyr story. Depression, imposter syndrome, and a collapse
  in self-worth after a bad launch are named as occupational hazards, not evidence of
  personal fraud. A deal failing or a launch flopping is not evidence about the person. Peer
  support (GDC-style indie roundtables, or any group where failure gets said out loud) and
  explicit permission to pause development for months to address health are both named as
  legitimate responses, not indulgences.
- **A burnt-out founder makes worse strategic decisions**, specifically including the kind
  of desperate deal covered below. Protecting the founder's state is not separate from
  protecting the runway.

## Runway

Runway is months of money divided by burn rate, but reading it well means reading it before
it becomes an emergency, not after.

Order of operations when runway is short:

1. **Downsize or pivot to contract work before signing anything under duress.** A bad
   contract signed to survive the immediate crisis is worse than shrinking the team or
   scaling down scope, because the contract's terms outlive the crisis that produced it.
2. **Build a buffer for technical disaster before you need one.** A major migration or
   server incident can tank revenue to zero for days to weeks even after the immediate fire
   is out. Plan burn rate assuming a 30-to-60-day recovery lag after any major technical
   event, not an immediate bounce-back.
3. **Never let cash reserves hit zero before the next funding decision is made.** Zero
   reserves is the condition under which teams sign terminal deals — see *The Guest*, below.
   The fix is upstream: a runway buffer, or a pivot to a smaller, faster funding instrument
   (a micro-scoped grant application, contract work) started before the number hits zero, not
   after.
4. **If a prototype is being kept alive by fear of admitting it isn't working, that's the
   runway problem, not the prototype's problem.** Continued funding of a loop the team
   privately calls "boring" or "like homework" is runway spent confirming what's already
   known.

## Money sources, ranked

Cheapest and least risky first.

| Source | Terms | Risk |
| --- | --- | --- |
| Grants, prototype grants, incubators | Non-dilutive, no equity given up, often enough to pay market or living wages and fund a vertical slice | Competitive, application overhead, regional availability varies |
| Bootstrapping / contract work | Slow, keeps full ownership and no launch-day cohort spent | Extends timeline, splits attention between paid work and the game |
| Crowdfunding | ~8% total platform cut versus Steam's ~30%; upfront cash, pre-ship | Converts your highest-intent backers into non-Steam-revenue key redemptions; see `verdicts.md` §6 for the full decision and the wishlists-per-backer test before running one |
| Publisher | Cash advance, marketing and QA support, platform expertise | Recoup terms can consume all revenue; the worst case in this corpus made $0 from 25,000+ copies |

Before pursuing equity or a publisher deal, exhaust the non-dilutive route: regional and
national grants, prototype grants, and incubator programs are explicitly named as the way to
pay real wages and fund a polished vertical slice without giving away equity early. This is
also the first door to check before crowdfunding — `verdicts.md` §6 puts it first in the
cheaper-doors list for the same reason.

**Publisher evaluation, before signing anything:** technical and platform expertise
(console porting, SDK compliance, engine-specific pipelines), production and QA
collaboration (pacing, narrative editing, localization, real QA depth), marketing and PR
reach (press lists, influencer keys, event submissions, storefront visibility), and
cultural or relational fit. Don't rush a signature because the alternative feels worse.

**The specific danger of signing at zero reserves:** a 100%-recoup-first deal signed because
cash ran out looks like survival and functions as a terminal clause. Every dollar of revenue
services the advance before the developer sees anything, and a game can sell in real volume
and still return nothing. Evaluate contract terms while there's still a floor under the
team, because contract evaluation done from desperation is not evaluation.

## Crowdfunding mechanics, if a team has decided to run one

This section assumes the decision has already been made per `verdicts.md` §6. It covers how
to run the campaign, not whether to run it.

- **Lead time: 2-4 months before launch.** Finalize the page, USPs, backer tiers, and
  stretch goals; produce the main trailer; pre-write update posts; compile the master
  press/creator/community contact list; pre-arrange launch-day amplification so contacts
  have something ready to reshare on day one.
- **Campaign length: roughly 28 days**, with planned promotional activity for every one of
  them. A campaign does not run itself once it's live.
- **The U-curve.** Big beginning (days 1-3, driven by existing followers and friends) → a
  slow middle that can plateau for the bulk of the campaign, held up only by sustained
  content and community activity → a big ending in the final 48-72 hours, driven by the
  platform's own reminder notifications. Never schedule the end during an off-hour for your
  key regions — end during peak activity to catch the reminder-driven rush.
- **Reward tier economics.** Low tiers (digital keys, OST, art book) are self-explanatory.
  High tiers ($100-$200+: deluxe items, producer credits, custom content) carry
  disproportionately high margin relative to production cost and can be a large share of
  total funds. Underpricing them out of discomfort is a named, avoidable mistake.
- **Digital versus physical.** Avoid physical rewards where feasible. If offering them,
  cost the full pipeline in advance: manufacturing, minimum order quantities, packaging and
  labor, international shipping, customs, and fulfillment delay risk. Uncosted physical
  tiers are a recurring source of post-campaign losses that dwarf the funds raised.
- **The work multiplier is roughly 5x the anticipated effort**, covering campaign
  management and development running simultaneously. The way to absorb it is to move as much
  work as possible into the pre-launch lead time: updates pre-written, media packages
  pre-composed, the contact list built a month out, and community-management shifts rotated
  among the team so no one person carries the live campaign alone.
- **The cannibalization risk is real and scales with campaign proximity to launch and with
  how much of the audience would have bought on Steam day one anyway.** A campaign run close
  to launch sells the exact cohort a Steam page was about to convert, with no time to rebuild
  it before the day-one window that Valve's discovery algorithm weights most heavily. The
  full arithmetic and the break-even ratio are in `verdicts.md` §6 — don't re-derive it here,
  but don't run a campaign without checking it either.

## The failure case file

From the GDC 2019 Failure Workshop. Each is a named studio's own account of what went wrong.

| Case | What happened | Transferable lesson |
| --- | --- | --- |
| Multi-game pack (*Shoot Shoot Mega Pack*) | Four distinct mini-games under one umbrella multiplied production overhead and fragmented PR | A multi-idea pack only works if the modules share core asset and technical pipelines; otherwise overhead compounds per module |
| Prototype sunk-cost (*Solo*) | $45,000 — half the vertical-slice budget — spent over six months on a prototype the team itself called "boring," "like doing homework" | Validate fun during graybox before committing a production pipeline. If a prototype feels like homework by month three, kill it |
| Desperate publishing deal (*The Guest*) | Signed a 100%-recoup-first agreement at zero cash reserves; sold 25,000+ copies over three years and made $0 | Never sign 100%-recoup terms under duress. Build a runway buffer, or downsize/pivot, before desperation forces the signature |
| Crowdfunding under-budgeting | A goal set below true production cost, out of fear of failing to hit a high target; the campaign succeeded and the project still ran out of money mid-production with no marketing budget left | The goal must reflect real cost. Asking for less than the project needs guarantees a slower, more painful failure with broken backer promises |
| Live-ops revenue collapse (*Skullgirls Mobile*) | A major content/server migration tanked revenue to zero for days to weeks before rebounding | Plan burn rate assuming a 30-to-60-day recovery lag after any major technical event; keep a crisis-specific cash buffer |
| Lone-genius isolation (*Actual Humans*) | Founder believed only he understood the vision and treated collaborators as execution units rather than creative partners | Share the psychological weight of the vision early and continuously, or the isolation itself becomes the failure |
| Communication breakdown under burnout | Silence when the project started turning out poorly; hard truths went unsaid because the team was already depleted | Silence is the precursor to losing core people. Force a transparent check-in on project health when morale drops |
| Data-wipe catastrophe (Hidden Variable Studios) | A live shard was accidentally reprovisioned, wiping user data, with no functional backup from a third-party partner | Test the restore yourself; never trust a partner's word on backups. When disaster hits, put the whole team — including leadership — on player support, compensate generously (near-zero marginal cost on virtual goods versus the cost of a lost player), and respond to every public post, not just the Discord |
| Founder mental health | General pattern across the panel: indie culture treats suffering as a badge; depression and imposter syndrome follow bad outcomes | Depression and imposter syndrome after a failure are occupational hazards, not evidence of personal fraud. Peer support and explicit permission to pause are legitimate responses |

## Questions for a team whose problem is people, not the game

Ask these when the presenting complaint is about direction, morale, or money rather than
about whether the loop is fun.

1. **Name the four pillars out loud. Who owns each one?** Any pillar with no name attached,
   or two names attached without a split, is the finding — treat it as the first fix, not a
   hiring problem.
2. **Is there anything in writing?** Equity, IP, compensation, and what happens if someone
   leaves. If the answer is "we trust each other," that's a gap, not an answer.
3. **How many months of runway, and what's the burn rate right now?** Get the number, not an
   impression. If it's under a few months, the order of operations in the runway section
   above outranks everything else on the table.
4. **Has anyone checked the grant and incubator options for this project's region and
   genre?** If not, that's a cheaper door than whatever funding conversation is currently
   happening.
5. **When a creative disagreement comes up, does it get resolved, or does it recur?** A
   recurring argument between the same two people about the same decision is sunk cost, not
   a live disagreement. Propose the swap, the domain split, or fewer decision-makers — not
   another meeting.
6. **What would each founder regret losing if the project ended today?** "The months" is
   sunk cost wearing a vision's clothes. A specific scene, mechanic, or feeling is something
   real to carry into the next attempt.
7. **Is anyone treating vacation as nonsense, or working through a pattern of silence about
   how the project is actually going?** Both are named precursors to losing people, not
   signs of commitment.
8. **If this team signed a contract tomorrow under pressure, what terms would they accept
   that they'd reject with three more months of runway?** If the honest answer is "worse
   ones," fix the runway before the negotiation, not during it.
