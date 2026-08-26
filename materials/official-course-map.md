# learn-ai-media-domain-with-phoebe - source map and coverage

Built 2026-08-26. Two tracks: editor (a1-a6, 6 x 45 min) and producer (b1-b10, 10 x 45 min).
Palette: broadcast cyan `#0E7490` + warm amber `#E2711D`. Simulator: `assets/media-live.js`.

Fast-moving area - re-verify the Reuters Institute figures and the C2PA adoption number before
delivering live. Rights and licensing statements are orientation, not legal advice.

## Positioning against siblings (state this on the pages)

This course is the **newsroom, publisher and broadcaster** course: verification, provenance,
rights, archives, distribution. It is deliberately NOT:

- `learn-ai-content-with-phoebe` - creator formats and the one-idea-many-formats engine.
- `learn-ai-marketing-with-phoebe` - campaigns, message-market fit, demand.
- `learn-ai-writing-with-phoebe` - the craft of writing itself.

Where they touch, this course points at them rather than repeating them.

---

## Verified facts (use these, do not invent numbers)

| Fact | Source | Where it is taught |
|---|---|---|
| Survey of **280 media leaders across 51 countries**, fielded November-December | Reuters Institute, *Journalism, Media and Technology Trends and Predictions 2026* (Newman) | a1, a5, b1 |
| News executives expect **search referrals to fall about 43% within three years**; **a fifth expect losses above 75%** | Reuters Institute 2026 | a5, a1, b9 |
| Google search traffic to publishers **fell by about a third globally** in the year to November | Chartbeat data reported alongside the 2026 trends work | a5, b9 |
| The hit is **uneven by size**: small publishers (1,000-10,000 daily page views) lost about **60%** of search referrals, medium about **47%**, large about **22%** | Chartbeat / 2026 trends reporting | a5, a6 |
| **Just over two thirds** of surveyed leaders expect AI licensing deals to bring at least some revenue within three years, **most seeing it as a minor source** | Reuters Institute 2026 | a3, a5 |
| **Fewer than 1% of news images or videos published globally carry C2PA metadata**, with pilot adoption growing at agencies and broadcasters including the BBC | Reuters Institute 2026 | a2, b2, b7 |
| **Fewer than four in ten people** report trusting the news they see, with the shift toward social platforms and AI chatbots expected to push it lower | Reuters Institute *Digital News Report 2026* | a1, a2, a4 |
| Five recurring expert themes for 2026: audiences reaching news **through AI**, **rising demand for verification work**, **automation and agents reshaping newsrooms**, **upskilling and AI infrastructure**, **AI empowering data journalism** | Reuters Institute, forecasts from 17 experts | a1, a6, b1 |

Standing honesty rail for the whole course: AI-detection tools are not evidence. Provenance,
sourcing and primary documents are. The simulator's sixth toggle behaves accordingly.

---

## The simulator - `assets/media-live.js`

Container class `.mediabox`. Two modes:

- `data-mode="score"` - the 10-item verification desk, one night's inbound. Headline shows items
  handled correctly plus a separate **false-accusation counter**.
- `data-mode="trace"` with `data-item="flood"` or `data-item="detector"` - step through one item.
- `data-levers="..."` sets which checks start ON. **An empty string is a legitimate value meaning
  every check off** - parsed with `=== null`, never `attr || default`.

Checks: `reverse` (reverse image and video-frame search) · `metadata` (EXIF, file history, C2PA) ·
`cross` (two genuinely independent sources) · `primary` (the filing, dataset or original) ·
`expert` (five minutes with someone who knows the domain).
ANTI-lever: `detector` - an AI-detection tool. It never raises the score and it flags a genuine
wire photograph, driving the false-accusation counter to 1.

### Canon numbers - verified 2026-08-26, do not restate differently

| Rung | Items handled correctly |
|---|---|
| no checks | 1 / 10 |
| + reverse search | 2 / 10 |
| + metadata and C2PA | 4 / 10 |
| + two sources | 6 / 10 |
| + primary document | 8 / 10 |
| + expert call | **10 / 10** |
| all five + ⚠ detector | 9 / 10, **1 false accusation** |

The detector row is a real wire photo of a council vote. Turning the detector on at 10/10 does not
catch anything the desk had missed - it spikes a genuine photograph and implies a supplier faked it.

---

## Per-session coverage

✓ = taught to the working core · ◐ = touched, deeper elsewhere

### Editor track (a1-a6) - editors-in-chief, heads of newsroom, media executives

| Session | Covers | Bar |
|---|---|---|
| a1 What AI changes in a media org | The five 2026 themes, the trust floor (under 4 in 10), where AI genuinely helps and where it costs you the masthead | ✓ |
| a2 Trust and the provenance problem | Deepfakes, C2PA and the under-1% adoption reality, why detection is not evidence, corrections policy | ✓ |
| a3 Rights, licensing and training data | Who owns what, opt-outs and robots directives, the two-thirds-expect-minor-revenue picture, negotiating position | ✓ |
| a4 Newsroom policy and red lines | Disclosure, human-in-the-loop, what may never be generated, bylines, the corrections trigger | ✓ |
| a5 Audience economics after search | The 43% expected fall, the uneven size effect, licensing versus direct audience, what replaces referral | ✓ |
| a6 Leading the change | Roles, upskilling, restructuring without gutting trust, what to tell the newsroom and the board | ✓ |

### Producer track (b1-b10) - reporters, producers, editors, desk staff

| Session | Covers | Bar |
|---|---|---|
| b1 The media practitioner's AI loop | The publish chain, the trust line, the five checks, both simulator modes | ✓ |
| b2 Verification and source checking | The full check ladder, the detector anti-lever, what each check costs in minutes | ✓ |
| b3 Story development from data | Finding stories in datasets, the questions AI is good at, the ones it invents answers to | ✓ |
| b4 Writing and headlines at newsroom standard | House style, headline testing, what AI may draft and what carries a byline | ✓ |
| b5 Audio and podcast | Transcription, editing, synthetic voice and the rules around it | ✓ |
| b6 Video, subtitles and clipping | Rough cuts, subtitles, localisation, what a clip does to context | ✓ |
| b7 Images and synthetic media | What may and may not be generated, labelling, illustration versus depiction, C2PA on your own output | ✓ |
| b8 Archives and search | Making decades of tape and text findable, and the rights questions that come with it | ✓ |
| b9 Distribution and AI answers | Search collapse, AI referrals, newsletters, social cuts, measuring what is left | ✓ |
| b10 Capstone: one story, every format | One story from tip to publication across text, audio and video, provenance intact | ✓ |

## Not covered by design

- Media law in any jurisdiction. Defamation, contempt and privacy are counsel's territory.
- Building or fine-tuning models.
- Vendor-specific tool certifications.
- The craft of writing itself - that is `learn-ai-writing-with-phoebe`.
- Marketing and audience-growth campaigns - that is `learn-ai-marketing-with-phoebe`.
