# Marketing

Tactical execution: store page, capsule, trailer, demo, festivals, Next Fest, launch week.
How much time to spend on marketing at all is settled in `verdicts.md` §5. Concept-level
questions (the six Magics, Category A vs B, genre demand) are in `ideation-and-market.md`.

## What the algorithm actually responds to

Valve's system optimizes for gross revenue over time. Not wishlist counts, not follower
counts, and not review positivity beyond roughly "Mixed." A game at 98% positive on 50
reviews gets almost no boost against one at 75% positive on $100k in 48 hours.

The funnel is a test loop. Valve grants baseline visibility, watches whether it converts to
purchases, and reallocates the real estate to a better-monetizing game if conversion
stalls. Every tactic below is an attempt to win one round of that test.

**What kills indie games is apathy, not hatred.** "Looks okay, but not now" is the modal
response and it is fatal. Polarizing and recognizable beats safe and lukewarm.

## Pre-launch checklist in dependency order

Lead times are the reason for the ordering. Items near the top cannot be compressed later.

| # | Item | Start by | Why the lead time |
| --- | --- | --- | --- |
| 1 | Steam "Coming Soon" page live | As soon as you have key art, target screenshots and a clear description | Converts traffic Valve already sends and starts the wishlist clock. Nothing outranks it. |
| 2 | Routine capture pipeline in-engine | Start of production | Debug tooling has to be built before you need footage, not after |
| 3 | Creator and press contact list | Built weekly from the day the page is live; individual outreach about a month before a demo launch or Next Fest | A list assembled in a sprint is a list of strangers. Builds go out 24-48 hours early. |
| 4 | Festival and showcase submissions | 3-6 months before the event | Submission windows close long before the show |
| 5 | Steam Playtest, private or public | Months before the demo | Catches bugs and tuning without generating public reviews |
| 6 | Public demo, quiet launch | 2-3 months before Next Fest | Captures the one-time Trending Free / Popular Demos push |
| 7 | Next Fest with a tested demo | Only above the wishlist floor | See the entry decision below |
| 8 | Launch | After 1-7 | |

**When a lead time has already been missed**, start the item anyway and shorten the ask.
Two items do not survive compression: a festival submission, which has a literal closing
date, and Next Fest, which you only get once. Drop those rather than rush them, and start
everything else late.

## The Steam page

The page is the conversion surface for every other tactic, so fix it before spending on
anything that drives traffic to it.

- **Capsule.** Placeholder or programmer art on the capsule wastes every impression the
  algorithm gives you. The source puts it at the front of the fix-first list
  alongside the trailer, visual readability and the demo, all of which come before spending
  time on promotion. It is also the cheapest of the four to fix, so treat a bad capsule as a
  launch-blocking defect.
- **Genre legibility.** A visitor who cannot tell what kind of game this is in five seconds
  leaves. Screenshots that fail the five-second comprehension test are usually cluttered or
  visually alien rather than ugly.
- **Description.** One clear genre frame first. Feature lists come after the core fantasy
  lands, never before it.
- **Tags.** These feed Search Suggestions and "More Like This," which is rung 2 of the
  ladder. Wrong tags remove you from the surfaces that compound.

If a game's appeal is invisible in a screenshot, that is a design problem and belongs at
gate 1, not here. Tactics games, deckbuilders and visual novels hide their fun inside the
player's head. The documented fix externalizes the invisible decision: Firewatch's moving
cursor and ticking timer bar make hesitation visible on screen; dense pixel-art games use
dynamic framing and zoom on micro-actions so cause and effect reads instantly.

## The trailer

**Structure, with timings.**

| Beat | Length | Job |
| --- | --- | --- |
| Cold open | 3-8 sec | Stop the scroll. One punchy visual or dramatic moment. |
| Intro / baseline | to ~0:15 | Genre, perspective, art style, the avatar. Sets expectations. |
| Escalation | 0:15-0:45 | The hook and USP, then layered mechanics, obstacles, stakes |
| Climax | 0:45-1:15 | Late-game intensity, boss fights, mechanical synergy |
| Title card and CTA | | Name, platform, one clear next step |
| The Button (optional) | 2-4 sec | A humorous or surprising beat after the title card |

Launch and evergreen trailers run 60-90 seconds. Make 1-3 trailers across the whole
campaign, not one per milestone.

**The eight traps, each with its fix.**

1. **Vague intro, unclear genre.** Slow landscape pans, splash screens, logos. Fix: show
   the character moving and interacting inside the first five seconds.
2. **Burying the hook.** 80% generic setup before the twist. Fix: telegraph the tone or
   subversion early through music, audio, or visual juxtaposition.
3. **Flat looping music.** A raw 60-second in-game loop has no arc. Fix: use or compose
   music with a rise, hit points, and an ending.
4. **The Ice Cream Shop Fallacy.** Listing "50+ Weapons! 16 Biomes!" instead of the core
   fantasy. Fix: pitch the loop and the emotion first. Variety only after appeal lands.
5. **Lore dump.** 500 years of history in text or voiceover. Nobody cares about lore before
   they care about characters or mechanics. Fix: ground the story in active conflict
   visible on screen.
6. **Visual overload.** Rapid disorienting cuts, cluttered HUD. Fix: clean eye trace and
   composition.
7. **Missing SFX.** A music-only mix loses game feel and reads as low production value.
   Fix: mix crisp Foley and SFX underneath the music.
8. **Missing or scattered CTA.** No purchase link, or ten competing social links. Fix: one
   unified low-friction CTA.

Other recurring mistakes: mimicking AAA and Hollywood tropes with 10-20 seconds of logos,
black screens and lore voiceover; hard-selling through buzzword title cards ("AN EPIC
ROGUELIKE ADVENTURE" against *Hades*' "A God-like Rogue-like"); and a montage of cool shots
with no mechanical logic, which leaves the viewer with no progression of understanding.
Text cards are the developer jumping in front of the screen. Keep them to a minimum.

**The Lucas Pope Test.** If you cannot already picture the trailer, change the concept.
Running this at the prototype stage costs nothing and is a design decision rather than a
marketing one.

**Animated trailers.** Roughly $1,000 per second of custom 2D animation, $25,000-$60,000+
total, which can consume an indie's entire marketing budget. Two failure modes: rug-pull
backlash when an unknown studio's cartoon trailer does not match a low-res or tactical-grid
game, and identity confusion where viewers think they are seeing a show rather than a game.
Appropriate for sequels and established IP where the audience already knows the gameplay,
for publishers with dedicated audiences, or when the animation directly mirrors in-game
fidelity.

**Trailer archetypes.** Announcement (establish existence, tone, genre hook). Gameplay
(the loop, input feel, responsiveness). Story (must still contain gameplay; pure cutscenes
fail because how it plays determines investment in the narrative). Launch/evergreen (the
permanent store-page anchor). Update/DLC (skip the basics, go straight to what's new).
Accolade (review scores, quotes).

**Capture tooling to build into the engine early:** state and progression jumping, spawn
and despawn on command, independent music and SFX mute toggles, loadout grants, free-cam
with FOV and full HUD toggle, and hotkey macros that chain a whole capture setup. Baked-in
music with no separation ruins editing flexibility.

## The demo

- **Length:** 20-25 minutes, tightly polished. Vertical-slice demos run 20-30.
- **Median playtime is the metric**, not wishlist count. Working figure is ≥25 minutes for
  the completion test, ≥45 for replayable and systemic games where replay is the product.
  Under 15 minutes on any demo is a design alarm. See `numbers.md` §1 for why those two
  numbers are not in conflict.
- **Ship it quietly, months before Next Fest.** A demo debuting during Next Fest drowns in
  the clutter and forfeits the one-time New & Trending Free push it would have got in the
  quiet season.
- **In-game wishlist CTAs, four non-intrusive placements:** main menu, pause menu,
  end-of-demo completion screen, exit popup. Never solicit Steam reviews inside a demo. It
  violates policy and does not affect the algorithm anyway.
- **Expect a Venn mismatch.** Most Next Fest wishlisters never play the demo and most demo
  players do not wishlist. Only a small overlap does both. That pattern alone is not a
  failure signal.

**Itch as a petri dish.** Browser-playable builds draw roughly 10x the engagement of
downloads. Three browser prototypes over three months is the cheapest validation
instrument in the corpus, and the rule attached to it is that people who will not play it
free will not pay $15-20.

## Next Fest

**How it runs.** Days 1-2, every game receives roughly 10,000-40,000 impressions per day
on equal footing. On day 3 the algorithm evaluates engagement — clicks, downloads,
playtime, wishlist actions — and suppresses low performers to a floor. Front-page widgets
are ranked by pre-existing total wishlists, so the visible ordering is decided before the
event starts.

**The entry decision.** Below roughly 2,000 wishlists entering, breakout is rare and you
spend a slot you only get once. Above 2,000, and better above 7,000, the outcome range
widens sharply. Next Fest multiplies existing momentum, and a multiplier on a small number
stays small.

**How close to launch can it sit?** No source in this corpus gives a figure for the gap
between Next Fest and launch, so treat it as a number that does not exist and reason from
the mechanics. The Fest generates wishlists that need a launch to land on, and the demo
needs iterating on afterwards. Under three months to a fixed launch date, entering means
shipping the demo, running the Fest and shipping the game in one window with no room to
act on what the Fest tells you. Move the launch or skip the Fest.

**Capstone, not debut.** Enter with a demo that has already been tested and iterated. The
debut-during-Fest pattern is a documented underperformance case.

For what counts as a good gain and why the top-tier numbers look unreachable, see
`numbers.md` §5.

## The visibility ladder

Six rungs, compounding, and skipping one strands you.

1. **Spark.** Every game starts at zero. Category A games generate first traction from a
   viral hook on Reddit, TikTok or Twitter. Category B games send an early demo to genre
   streamers, because their appeal needs to be played to be seen.
2. **Continued growth.** Discovery Queue, Search Suggestions, "More Like This." Steam
   matches external traffic conversion by inserting the game into more recommendation
   surfaces. YouTube coverage has a long sustained tail; Twitch and Twitter spike sharply
   and stop.
3. **Curated exposure, by trading up.** The worked example: *Paranormal Tales* posted a
   trailer that hit 30,000+ Twitter likes → pitched IGN using the viral proof → IGN hosted
   the trailer → +40,000 wishlists → used IGN and the numbers to pitch PC Gaming Show, Day
   of the Devs and larger outlets → +100,000 wishlists. Each rung was reachable only
   because the previous one had been worked.
4. **Next Fest**, entered above the floor.
5. **Launch execution.** Day-one velocity into New & Trending and Global Top Sellers.
6. **Post-launch curation.** Past roughly $300,000 gross, you can work with Valve reps on
   curated front-page events, typically about two a year.

Major curated showcases (Summer Game Fest, PC Gaming Show, Game Awards, Wholesome Direct,
Triple-I) function as an outsourced curation layer the algorithm trusts. That is why rung 3
is worth the outreach effort rather than being vanity.

## Launch week

The bar is revenue velocity in the first 24-48 hours. Derive the wishlist floor from your
price rather than quoting a single target; the method and the tables are in `numbers.md`
§2.

- Older wishlists do not meaningfully decay in conversion. Wishlist spoilage is a myth, so
  a two-year-old wishlist is day-one purchasing power preserved intact.
- Qualified wishlists convert at 15-25% against 1-5% for unqualified ones. Qualification
  means the person has seen the game move, whatever channel they arrived from.
- Reviews from Steam keys land in the "Other" bucket and by default carry no algorithmic
  weight. That is the load-bearing mechanic in the crowdfunding ruling, `verdicts.md` §6.
- Asking your community and peers for honest reviews at full launch is fine. Soliciting
  inside a demo is not.

## Do not spend time on this

- **Daily social posting for its own sake.** It produces impressions, which Steam already
  supplies for free.
- **Follower-count work.** Followers convert at the unqualified 1-5% rate. A demo player
  who has seen the game move converts at 15-25%, so the same hour spent getting people
  into the demo is worth several times the hour spent gaining followers.
- **Audience polling on design decisions.** Letting followers vote on mechanics, UI or art
  produces average, appeal-to-nobody results, which is the apathy that kills indie games.
- **Giveaways and key drops for wishlist count.** They inflate the number that looks good
  and deflate the conversion rate that decides the first 48 hours.
- **Cold press kits to outlets that do not cover your genre.** Creator outreach outranks
  press outreach for indies.
- **Conventions and paid ads pre-launch on a small budget.** Paid ads only start being
  efficient somewhere above 75,000-100,000 wishlists.
- **Marketing anything with a broken core loop.** It converts strangers into people who
  know your game is thin, and spends the qualified audience you cannot get back.

## Diagnostic questions for underperforming marketing

1. Which of the six Magics is this game's primary one? "Polish" is not an answer.
2. Does the capsule survive a five-second glance from someone who has never seen the game?
3. Does the trailer show a character moving and interacting before second five?
4. What is the demo's median playtime, from Steamworks rather than from vibes?
5. How many net-new wishlists per week, and is the rate rising or flat? The source bands
   are fuzzy and overlapping (0-40, 15-120, 100-700, 300-3,000), and the label attached to
   the bottom one is "lacks magic or genre alignment." See `numbers.md` §4 before quoting
   any of them as a threshold.
6. Has a creator covered it? If yes and nothing happened, the audience watched and rejected
   the concept, which is validation data rather than bad luck. Go back to gate 1.
7. What is the wishlist floor implied by your price, and where are you against it?
8. Is every marketing hour ending with a stranger watching the game move? If not, it was
   not marketing.

One number you will see quoted and should not repeat: the 90/10 product-to-promotion split
has no methodology, no sample and no attribution behind it anywhere in this corpus.
