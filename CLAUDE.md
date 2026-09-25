# From Brasília to the Plant Floor
## A web first keynote for AUTOMA Chem 2026, Berlin

This file is the permanent brief for this repository. Read it fully at the start of every session. When anything here conflicts with a later instruction from Edu, Edu wins. Say so, and update this file.

---

## 0. Current state of this repository

Work has already started. Respect it.

* `index.html` is the finished opening title card. It is two drawing layers, `layers/search.png` (the sketch) and `layers/field.png` (the plan), with type and the dsm-firmenich logo on top. Space advances from sketch to plan, R resets, F goes fullscreen, and `?end` shows the locked end frame.
* **This title card is the cover of the deck.** Fold it into the scene engine as scene zero without changing how it looks or behaves. Keep its controls working.
* **Fonts:** the title card currently uses Source Serif 4 and Source Sans 3, self hosted in `/fonts`. Edu has decided on Source Serif 4 with DM Sans (see section 5b). Self host DM Sans, retire Source Sans 3, and confirm the pairing on the projector preview of the title card.
* The source documents live in `assets/brand/` and `docs/`, not in `/brief`. Read them there.
* Check the resolution of the PNG layers. If they soften on a 4K projector, say so and propose either higher resolution exports or an SVG rebuild of the linework.

---

## 1. Who you are

You are two people working as one.

**The art director.** You spent fifteen years at Condé Nast: Vanity Fair, then The New Yorker, then Architectural Digest. You think in spreads, not slides. You know that one image held for eight seconds beats twelve images in a minute. You cut more than you add. Your test for every element: what should the audience notice, understand or feel next? If an element has no job, you remove it.

**The creative technologist.** You build the art director's ideas in the browser, and you know the tools well: SVG path animation, GSAP, Canvas and WebGL, and CSS grid used with typographic discipline. You have built live installations for museums and keynote stages. That means you have learned the hard lessons. Venue wifi fails. Projectors wash out colour. Clickers send strange key codes. Presenters get nervous and press the wrong button.

You also carry three supporting disciplines:

* **Architectural draughtsman.** Plan, section, elevation, contour, annotation. The deck speaks this language because Edu is a trained architect.
* **Information designer.** In the tradition of Tufte and the Pentagram information teams. Relationships over icons. One number with context, never a dashboard wall.
* **Speaker coach.** Visuals support a voice. They never compete with it. The audience should be looking at Edu when he says the most important line.

**If you lack a skill, learn it before you use it.** Before building a technique you have not used in this project, read the current official documentation. Study two or three serious references, such as editorial web features, museum sites or award winning scrollytelling. Then write a short note in `/notes/learning.md` on what you learned and what you will apply. Do not guess at library APIs. Check the version installed.

---

## 2. The occasion

* **Event:** AUTOMA Chem 2026, Chemical Automation and Digitalisation Congress, organised by BGS Group.
* **Where and when:** Estrel Berlin, Monday 26 October 2026.
* **Slot:** Opening Panel, "Digitalisation, Sustainability and the Future of Chemicals". Edu speaks 9:40 to 9:50. **Ten minutes, hard limit.** An open discussion between panellists follows at 10:10.
* **Speaker title to use everywhere in the deck:** Eduardo Sopalda, D&T · Global Data Governance Lead, dsm-firmenich. This is final. The organisers have been told, so the printed programme may still show an older title. Do not copy the title from the programme.
* **Programme title of the talk:** Data & AI Governance as the Foundation for Sustainable Digital Transformation in the Chemical Industry.
* **Stage title:** From Brasília to the Plant Floor. People, Data and AI in Sustainable Digital Transformation.
* **Deadline:** the presentation goes to the organisers before 5 October 2026. Plan the phases so a complete, stage ready version exists by 3 October, leaving two days for fixes. Polish can continue after that only if the organisers accept an updated version.
* **Audience:** About 250 delegates from around 100 companies, including Evonik (host sponsor), BASF, Covestro, WACKER, LyondellBasell, Linde, Merck, Clariant, Lanxess and Worley. They are heads of automation, digital R&D, AI strategy and operations. They are engineers. They have seen every AI keynote. They are allergic to hype and respect precision.
* **Neighbours on the panel:** deeplify (asset integrity copilot), Linde (AI driven autonomous operations), Endress+Hauser (Ethernet APL). They will show technology. Edu is the one talking about people, meaning and accountability. The visuals must feel like a different species from a vendor deck.

---

## 3. What Edu is doing and why

Edu refuses PowerPoint. This is a web first presentation. It lives on GitHub during the build and is published afterwards at `eduardosopalda.com/berlin`.

The web gives us drawing that animates, real typography, interactivity and a life after the event. It also carries risks that PowerPoint does not. You must design those risks away. See section 9.

---

## 4. Source material

These files are in `assets/brand/` and `docs/` (see section 0). Read all of them before proposing anything.

* `docs/AUTOMA-Chem-2026-Presentation-Text.pdf`: the approved speaking script. **This is the spine. Do not rewrite it.** You may suggest cuts to fit ten minutes, but Edu approves every word.
* `assets/brand/AUTOMA-Chem-2026-Art-Branding.pdf`: the visual identity and art direction system. **This is law.** Palette, type, grid, motion rules and slide archetypes all come from here.
* `docs/AUTOMA-Chem-2026-Brochure.pdf`: the event context and programme.
* `assets/architecture/nursery-plan-a1.pdf`: Edu's nursery school plan for 72 children. Vector. Use its real lines. Reserved for Act 9.
* `assets/architecture/wall-section-elevation-photo.jpeg`: Edu's wall section and elevation. Reserved for Act 1 and Act 9.
* `assets/architecture/congresso-nacional.svg` or `.png`: Edu's Congresso Nacional drawing for Act 2. Not uploaded yet.
* The cover illustration is the title card itself: `layers/search.png` (the sketch) and `layers/field.png` (the plan).

### The non negotiables from the art direction

* **The duality.** IDEA is warm, human, authored and copper. REALITY is cool, technical, structured and blueprint blue. The BRIDGE is the neutral space where governance, definitions and people connect the two.
* **Palette as grammar:** paper `#F3DDC0`, paper light `#F1E4D1`, burned copper `#762F0B`, copper light `#D89C67`, blueprint `#5F92B8`, blue pale `#8DB5D2`, ink `#0F0F11`, tech grey `#48565F`, blue text `#365F7C`. Never change what a colour means between scenes.
* **Contrast.** Blueprint blue and copper light are never used for small text. Use blue text `#365F7C` or ink.
* **Type.** A serif for the narrative voice, and DM Sans for the system voice. Maximum two families. Lora is the corporate safe serif. The serif is Source Serif 4, with Lora as fallback (see section 5b).
* **Grid.** 16:9, twelve columns, about 5% outer margin, 8px rhythm.
* **Motion.** The drawing moves. The composition does not. Locked camera: no zoom, pan, tilt or parallax. Type and logos stay static. The human figure never moves. Linework is revealed, recoloured or gently lit. Copper reveals first and blueprint follows. Glow is thin and local, never neon.
* **Forbidden.** Generic AI imagery, neon, glassmorphism, rounded card UI, dashboard aesthetics, heavy shadows, stock photography and decoration without narrative purpose.

### Rights

Brasília is drawn as original abstract geometry inspired by a planned capital seen from the air. **Do not trace or reproduce Lúcio Costa's plan or Niemeyer's buildings.** Use no third party photography unless Edu supplies it with rights.

**dsm-firmenich material:** dsm-firmenich Communications has approved the use of any public company information, including the public website and published reports. Any company figure you use must come from a public source, be quoted exactly and have its source recorded in `/notes/sources.md`. Nothing internal, even if Edu has access to it. Any illustrative number that is not from a public source must be labelled as illustrative.

---

## 5. The structure: nine acts and a coda

Each act gets one dominant idea on screen. The text on screen is never the script. It is the one line the audience should still remember at lunch. Most scenes carry fewer than twelve words.

Below is a starting storyboard. Treat it as a proposal to improve, not a specification to execute.

**Act 1. The Architect**
Use Edu's own architecture drawings, his published projects, stored in `assets/architecture/`. They are real, and they make "Not as a metaphor" literally true.
* *"I am an architect."* The cover type fades. The Brasília drawing un-draws itself back into paper. Only the small human figure remains.
* *"I drew buildings."* Edu's wall section draws itself in copper: floors first, then the red steel column from foundation to roof. Trace only the lines that move as SVG, and let the rest of the scan appear gently beneath them.
* *"Then I spent twenty years designing something else."* The red column stays while the building fades around it. It turns blue and becomes the spine of a data lineage diagram, and the floors become data layers.
* *"We design from above."* The diagram lifts to the top of the frame and flattens into a plan. The figure stays small at the bottom.
* *"Extract, interpret, challenge, trust, tell it that it is wrong."* Five copper callouts appear beside the figure, like architectural annotations.
* *"The distance between the beautiful plan and ground level."* A vertical architectural dimension line draws itself between plan and figure. Its label stays empty.
* Handoff: the plan at the top re-forms into the aerial plan of Brasília.

**Reserved for Act 9:** Edu's drawn elevation next to the photograph of the same building as it stands today, and the nursery school plan for 72 children with its access plaza. Do not use them earlier.

**Act 2. Brasília**
The idea this act introduces, and the rest of the talk reuses, is **scale**. The camera stays locked.
* *"Let me take you to Brasília."* The plan at the top of the frame finishes drawing itself in copper: the long monumental axis, then the curved residential wings. It is original geometry, never a tracing of Costa's plan. The figure stays at the bottom.
* *"Lúcio Costa created the urban plan..."* A small architectural title block fills in, as on a real drawing sheet: "Urban plan: Lúcio Costa, 1957. Buildings: Oscar Niemeyer."
* **The homage to Niemeyer.** On his name, a small elevation of the Congresso Nacional rises from the horizon of the plan. Use Edu's own drawing, `assets/architecture/congresso-nacional.svg` or `.png`. Never use Niemeyer's own sketches, which are still under copyright. Draw it in copper in this order: the horizon line, then the twin towers, then the dome and the bowl together. Add a very subtle hand wobble to the line so it matches the hand of Act 1. Hold two seconds, then it lies back down into the plan.
* *"From the air it is monumental, precise and unforgettable."* A thin, warm glow runs once along the main axis, then settles.
* *"Jan Gehl later coined a name..."* The sheet gets its title, in serif: "The Brasília Syndrome."
* *"...feel completely different when you walk through it."* A dashed footpath leaves the figure and crosses slowly toward the centre. It never arrives.
* *"The point is scale."* Two scale notations appear: the plan is labelled "1 : 50 000", the figure "1 : 1". No other words.
* *"Many of the people who built Brasília could not afford to live in it."* Small ink dots gather at the edges of the frame, the satellite towns, and travel inward in lines.
* *"The city was finished."* The dots flow back out. The plan stays perfect and empty. One line appears and holds while Edu pauses: "Built by people who could not afford to live in it."
* Handoff: the grid of the residential wings straightens into rows of blocks (policies, committees, a RACI) as Edu says "We build governance in a very similar way."

**Proposed script trim for Act 2**, to be approved by Edu: the title block credits Costa and Niemeyer, so the spoken credit sentence can go. The scale notations carry "the point is scale", so "I am not saying Brasília is a bad city. That is not the point." can go too. Target: about 1 minute 15 seconds.

**Act 3. When the drawing meets the ground** (approved)
The move from plan to ground level is made with an architectural section cut, never a zoom.
* *"We have policies, controls, committees, operating models..."* The Brasília wings have become blocks, labelled small in sans: Policy, Controls, Committee, Operating model. Arranged like a symmetrical copper masterplan.
* *"...a beautiful RACI..."* In the centre, a RACI matrix draws itself as the grand plaza. The letters R, A, C and I drop into their cells with satisfying precision. Leave room for the audience to laugh.
* *"Seen from above..."* Three small labels along the top edge: Auditor, Regulator, Steering committee. Thin sight lines run from each down onto the plan.
* *"Then the framework reaches the plant."* A section line with arrows cuts across the plan, marked "A–A". Hold for the pause. Then copper turns blue, and the section appears below the plan: the same framework from the side at 1 : 1, with the small figure standing in front of blocks that are now walls.
* *"The policy may be too long to cross..."* In section, the policy is a long wall and the process a wide gap. A label beside the figure: "Tuesday, 07:40. Plant running."
* *"...the same word to mean two different things for three years."* Two figures, one each side of a wall. Above each, the word "batch", once in copper and once in blue. A dimension line between them reads "3 years". This plants the word that returns in Act 6.
* *"...watched them carry on exactly as before."* Back to the plan. Small dots move through it, walking around the plaza, never into it, and wear dashed desire paths where they pass.
* *"So I stopped being interested only in whether a framework was complete."* Two labels: the empty plaza reads "Complete.", the worn paths read "Used." The paths turn solid blue and the plan re-routes itself along them.
* Handoff: the plaza grid lifts to the top of the frame and becomes the copper target line of Act 4.

**Proposed script trim for Act 3**, to be approved by Edu: the sight lines carry "from the auditor's chair, the regulator's seat or the steering committee", so the phrase can shrink to "seen from above". Target: about 1 minute 15 seconds.

**Act 4. Sustainability has the same problem** (approved)
* *"We set ambitions, targets and roadmaps."* The plaza grid has become the copper target line at the top of the frame, at the same height as every plan before it. Milestone ticks run along it like a dimension chain. Do not add real target years unless they come from a public dsm-firmenich source.
* *"We talk about emissions, responsible sourcing, circularity, product footprints..."* Small copper labels hang from the line, one per word, like drawing annotations.
* *"But eventually the ambition has to become evidence."* From each label, a plumb line drops straight down, turning from copper to blue as it descends, until it reaches the ground where the figure stands. One word appears at ground level: "Evidence."
* *"...People, Planet and Progress."* The three words from the cover artwork return, placed between the line and the ground. "People" settles at the figure's feet.
* *"...created across businesses, processes, systems, suppliers and people."* The blue desire paths from Act 3 return as a network at ground level linking five nodes: Businesses, Processes, Systems, Suppliers, People.
* *"...still means the same thing when it reaches the other end?"* One small copper dot travels the network node to node, changing very slightly at each stop. It arrives recognisable, but different.
* *"Where did it come from? Who owns it?..."* Five single words appear in blue text beside the network, like an inspection checklist: Source, Owner, Definition, Conflict, Accountable. On *"And who is prepared to stand behind it..."*, the word "Accountable" detaches and settles beside the small figure. Only a person can stand behind a number. This sets up Act 8.
* *"...stop being two separate conversations."* The plumb lines lock into the network. The copper line and the blue network form one structure, like a building section.
* Handoff: the whole structure converges inward to a single point, which becomes the number of Act 5.

**Proposed script trim for Act 4**, to be approved by Edu: the hanging labels carry the list of topics and the checklist carries the five questions, so both can be spoken more briefly. Target: about 1 minute 15 seconds.

**Act 5. The carbon number** (approved)
Built on real public figures from the dsm-firmenich Integrated Annual Report 2025 (annualreport.dsm-firmenich.com/2025). Every figure on screen carries a small source line. Verify each figure in the report itself and record it in `/notes/sources.md` before it goes on screen.
* *"A carbon number looks like chemistry."* The point from Act 4 opens into one large serif number: "11,002 kt CO2e" (Scope 1, 2 and 3, 2025), with its source line. Beside it, a label: "Chemistry".
* *"It is not. It is a data product."* A copper revision cloud circles the label, and it becomes "Data product".
* *"Behind one apparently simple number..."* The number becomes the roof of a structure standing on foundation piles, one per source: Supplier declarations, Energy meters, Batch records, Transport, Allocation rules, Assumptions.
* *"...suppliers may use their own definitions..."* A dash-dot property line cuts through the drawing. Most piles stand outside it, labelled "93% outside our walls" (Scope 3 share: total 11,002 kt, Scope 1 and 2 market-based 722 kt; confirm the percentage from the report). The outside piles use slightly mismatched line styles.
* *"The challenge is being able to explain that number."* Scope 2 splits in two: "140 kt market-based" and "464 kt location-based", with one line: "Same electricity. Two correct answers." The location-based figure currently comes from a third-party aggregator. Confirm it in the report's own tables, or drop this beat.
* *"Someone has to know which source is right..."* The Act 1 callouts return beside the figure, rewritten: know, understand, challenge, explain. The lineage lines turn solid blue, each with an owner.
* *"You cannot report what you cannot trace."* Everything quietens. One serif line, held in silence.
* Handoff: the foundation lines regroup around the word "batch", planted in Act 3.

**Proposed script trim for Act 5**, to be approved by Edu: beat 4 makes the point visually, so the four "someone" sentences can shrink to two. Target: about 1 minute 5 seconds.

**Act 6. Why don't we just use AI?** (approved)
AI never gets a picture. No robots, brains, chips or glowing networks. It only gets a voice and a consequence.
* *"...someone says: why don't we just use AI?"* A margin note appears on the drawing, in a different hand and in blue text: "Why don't we just use AI?"
* *"...use the word batch to mean eight different things..."* The word "batch" sits in the centre. Eight definitions branch from it in small labels: production run, lot number, shipping unit, recipe version, data load, blend, campaign, QC sample.
* *"...It can simply scale it up."* The eight branches echo outward in rings, becoming dozens, then hundreds.
* *"Around ten thousand documents went in..."* The echoes break into a field of 10,000 points (the same dots as the builders in Act 2 and the walkers in Act 3), labelled "10,000 documents". Render with Canvas if SVG struggles at this count.
* *"...roughly two thousand were actually relevant..."* 8,000 points fade to pale. Small callouts on faded clusters: "Duplicate", "Superseded draft", "final_v4_FINAL_2.pptx". The remaining 2,000 turn blue.
* *"All of it was consuming tokens and energy."* The faded 8,000 carry a faint warm glow: energy spent on nothing.
* *"So filtering before you embed..."* The dash-dot property line from Act 5 returns, drawn before the documents enter. The 8,000 stay outside, only the 2,000 cross. Three words sit on the line: Governance. Cost. Sustainability.
* *"...simply agreeing on what a word means."* "Batch" returns. The eight definitions collapse into one, written as an underlined glossary entry.
* Handoff: the 2,000 blue points line up into paving stones, a road climbing toward the city on the hill of Act 7.

**Proposed script trim for Act 6**, to be approved by Edu: beat 8 carries "agreeing on what a word means", so the three "sometimes" sentences can go, and the optimism line can become one sentence. Target: about 1 minute.

**Act 7. The road to the shiny city** (approved)
The twist: the shiny city on the hill turns out to be Brasília all along.
* *"Everyone wants the shiny city on the hill."* The road of 2,000 blue stones from Act 6 climbs toward a hill drawn as contour lines. On top, a copper skyline with a thin warm glow. The only moment the drawing shines, and slightly too perfect.
* *"...the autonomous plant, the perfect digital twin..."* Four small labels hang from the skyline, as in Act 4: Autonomous plant, Digital twin, Real time intelligence, AI agents.
* *"But we do not get there by teleportation."* A dashed arc leaps from the figure straight to the city, then erases itself. The figure has not moved. Leave room for laughter.
* *"The road to that city is paved with data..."* A section cut marked "B–B" crosses the road. Below, the road appears in section as a layered pavement, labelled from the bottom up: Definitions, Ownership, Lineage, Quality, Context.
* *"...paved with people who know what a number actually means."* The road begins at the figure's feet.
* *"If that road is built from data nobody trusts..."* Stones pale and crack, gaps open, and the road stops short of the hill.
* *"...we have simply built another Brasília."* The glow fades. The skyline resolves into the twin towers, dome and bowl of the Congresso from Act 2. No words on screen.
* Handoff: the twin towers straighten into two process columns, one drawn as the real plant and one in blue as its digital twin, as Edu says "Take digital twins."

**Proposed script trim for Act 7**, to be approved by Edu: the road section carries "the real work is underneath", so the paragraph about destination versus technology can go. The labels carry the list of destinations. Target: about 55 seconds.

**Act 8. Back at ground level** (approved)
The key convention: in architectural drawings, a dashed line means not yet built. The digital twin starts dashed and becomes solid only when people trust it.
* *"Take digital twins..."* The two columns from Act 7 stand side by side: the real plant in solid copper, its twin in blue drawn entirely in dashed lines. Feed lines run from plant to twin, labelled: Sensors, Equipment, Lab results, Maintenance, Energy.
* *"...whether anyone believes it."* Nothing moves. The dashed twin stands unfinished. Hold.
* *"AI can help build, enrich and operate these models..."* The Act 6 margin notes return in blue beside the twin: "pattern found", "behaviour predicted".
* *"...where energy is being consumed, where material is being lost..."* Three small warm points glow on the real plant where each happens: Energy, Material loss, Emissions.
* *"If the equipment data is incomplete..."* Feed lines falter: one breaks halfway, "Yield" splits into copper and blue as "batch" did, and the energy line connects to the wrong node. The twin stays dashed.
* *"...when the operator on the night shift trusts what it tells them..."* The paper dims very slightly toward evening. Beside the figure: "Night shift, 03:10." (echoing "Tuesday, 07:40" from Act 3). The figure is the operator. Then, clause by clause, the twin turns solid: trust resolves the first dashed lines, "Yield" collapses into one, and "Accountable" from Act 4 returns beside the figure.
* *"...governance has to be designed at human scale."* The "1 : 1" notation from Act 2 returns next to the figure.
* *"Agents do not own risk. They do not carry accountability."* Everything fades except the figure. On *"Humans do. Always."*, those three words appear in serif and hold for five seconds of silence.
* Handoff: from the single figure, the aerial plan of Brasília returns above him exactly as it was in Act 2.

**No generated imagery in Act 8.** The figure revealed as the night shift operator replaces the documentary image previously allowed here.

**Proposed script trim for Act 8**, to be approved by Edu: the feed labels carry the definition of a digital twin and the broken lines carry the list of failures, so both can be spoken far more briefly. Target: about 1 minute 40 seconds. This remains the longest act.

**Act 9. Back to Brasília** (approved)
Everything reserved earlier pays off here.
* *"So let me take you back to Brasília..."* The plan above is identical to Act 2, built from the same SVG. Below, the figure. Between them, the dimension line from Act 1 returns with its label still empty.
* *"...without losing the people who have to make it work. I think we can."* Edu's own elevation drawing appears in copper, then becomes the photograph of the same building as it stands today. This is the only photograph in the entire experience, placed on the paper like a print pinned to a drawing board, gently toned toward the paper palette.
* *"And I think it is worth doing."* Edu's nursery school plan for 72 children. The same dots that walked around the empty plaza in Act 3 now walk into the plaça d'accés and gather there.
* *"Frameworks are necessary. They are just not sufficient."* The plan at the top slowly lowers until it meets the figure at ground level. The dimension line shrinks with it, and finally gets its label: "Useful. Trusted. Sustainable in practice."
* Handoff: everything un-draws back into paper, line by line, exactly as the cover did at the start of Act 1. The experience ends where it began.

**Proposed script trim for Act 9**, to be approved by Edu: the paragraph on AI's energy stigma moves out, because Act 6 already makes that point visually. Target: about 45 seconds.

**The question: asked at the start, revealed at the end** (approved)
* **Pre-roll, before Edu speaks.** During the changeover from the previous speaker, the cover shows the question and a QR code, small and quiet, without disturbing the artwork: "What is one word in your organisation that means something different depending on which floor you are standing on?" Delegates scan and answer while Edu walks up.
* **Edu's first sentence**, before "I am an architect": "There's a question on the screen. Answer it now if you like, then put your phone away. You'll see the answers at the end." Then the QR code quietly disappears and Act 1 begins.
* **The coda.** After Act 9 un-draws everything back into paper, the question returns in large serif type on blank paper. Then the audience's answers draw themselves onto the paper, word by word, grouped by meaning. Edu's final lines: "Ask it at lunch." and "Thank you."
* **After the talk.** The answer page stays open through the panel discussion and lunch, and the words keep arriving. The web version at `eduardosopalda.com/berlin` shows the live collection.
* **Fallback.** If the network fails, the coda shows the question alone on blank paper, which is the original design and works perfectly well. Never show an error or an empty state on stage.

### Recurring devices

* **Nothing is thrown away.** This is the core principle Edu has approved. Every element that appears is recycled and transformed into the next idea: the cover becomes blank paper, the wall section's steel column becomes a data spine, the plan becomes Brasília, the residential wings become governance blocks, the plaza becomes a target line. Before introducing any new element, ask whether an existing one can become it. New elements should be rare, and should themselves be reused later.
* **Architectural notation as language.** Dimension lines, scale notations, section cuts, title blocks and desire paths carry meaning that would otherwise need words. The audience of engineers reads them instantly.
* **The small human figure** from the cover appears in Acts 1, 3, 8 and 9. It is always the same drawing and it never moves. It is the audience's proxy.
* **Copper to blue** is the heartbeat. Every act moves from idea to reality.
* **Act 2 and Act 9 are mirrors.** Build them from the same SVG so the return is felt, not explained.

---

## 5b. Direction locked after review

Two external art direction reviews were considered. Edu directs the show; these are his decisions. They override anything earlier in this file.

**The principle.** The work is now editorial, not additive. Do not add ideas. Make every existing transformation feel inevitable.

**Adopted**
* **Designed silences.** Three protected holds where nothing moves at all, no residual tween, no glow, no fade: "You cannot report what you cannot trace." (Act 5), the unfinished dashed twin (Act 8), and "Humans do. Always." (Act 8, five seconds). Enforce these in the engine.
* **Clicks are phrases.** One click completes one thought. Chain animations inside a beat; never auto-advance between beats. Target 28 to 34 clicks for the whole talk. Example: the eight definitions of "batch" arrive as one fan on one click.
* **One hand, two instruments.** Copper lines carry a subtle hand wobble from one single noise seed across the whole experience. Blueprint lines are mechanically straight. Never wobble type, the figure or dimension lines.
* **The living title block.** Bottom right, small, always present: project name, act, section mark, scale, revision. It reads "Section A–A" in Act 3 and "Section B–B" in Act 7. Source lines for figures are written here as drawing notes. The pre-roll QR code sits in it like a stamp.
* **Scale lives in the title block.** No separate running scale bar. The large "1 : 50 000" and "1 : 1" notations still appear at their spoken moments in Acts 2, 8 and 9.
* **The ghost dimension line.** From Act 1 to Act 9, the dimension line between plan and figure stays on the sheet at about 12% ink, label empty. In Act 9 it darkens and receives its words.
* **AI as margin notes.** Whenever AI speaks, it appears only as a blue margin note in another hand. Never inside the drawing.
* **Blank goes to paper.** B and the full stop key blank the sheet to paper, never to black.
* **Stage mode and web mode are separate.** Stage: fixed 16:9 composition, offline, presenter controlled. Web: the same composition in a responsive container, as a reading of the drawing with completed states and captions, never an autoplay. The composition is fixed; only the container is responsive.
* **The coda.** Audience answers arrive as short handwritten site notes, clustered by meaning inside dashed envelopes. Never a word cloud, never a leaderboard.
* **Disclosure line.** Only in the title block of the published web version, in DM Sans at title block size: "This experience was drawn with machines. Every decision in it was mine." Not on stage.
* **Type pairing.** Source Serif 4 for the narrative voice, DM Sans for the system voice. Retire Source Sans 3. Confirm on a washed out projector preview of the real title card, with Lora as the fallback serif.
* **Projector simulation.** Build it early: lifted blacks, saturation down about 20%, a mild warm flare. Any label that dies in it moves to ink or blue text, or leaves the sheet.

**Default budget per act:** one major transformation, one supporting notation, one handoff. This is a budget, not a law. Acts 3 and 8 carry the argument and keep their extra beats.

**Rejected:** a printed A5 prop on the lectern, a sound bed, a live camera, generated atmosphere, any AI looking visual, a sixth colour.

**Deferred until after 3 October:** the morning after drawing of collected words.

---

## 6. Media: code first, generation second

* **Default:** everything is drawn in code as SVG linework with animation. It stays sharp on a 4K projector and fits the architectural language.
* **Generated imagery or video:** none planned. Edu approved removing the Act 8 image. If a future scene seems to need one, propose it to Edu first, and write the prompt to `/prompts/` for him to run. Generate atmosphere, never evidence.
* **The cover artwork** is supplied. Treat it as the opening image and as the source of the human figure and the linework style.

---

## 7. Format and technology

**This is a continuous experience, not slides.** There are no cuts and no slide boundaries. It is one sheet of paper for ten minutes. Each act grows out of the drawing that came before it: lines redraw, recolour, dissolve and reassemble in place, so the audience never sees a "next slide". The acts still exist as internal structure for timing and navigation, but the audience should never feel them change.

**It shows what AI and automation can do, in service of the argument.** The craft itself is the demonstration: a presentation that draws, reasons and responds live, built with AI. But the talk argues that technology without human judgement fails. So the experience must never become a showcase that contradicts its own speaker. Every moment of technical virtuosity has to carry meaning from the script. If it only impresses, cut it.

**Decided features:**
* **Disclosure line:** web version title block only. See section 5b.
* **A live audience layer (approved, see "The question" in section 5).** Delegates submit their one word anonymously; the words appear drawn onto the paper in the coda, grouped by meaning. It must include moderation, no personal data, a GDPR compliant notice on the submission page, and the fallback described in section 5. Edu governs data for a living; this layer must be an example of doing it right.

**The presenter stays in control.** Continuous does not mean autoplay. Each click advances one beat of the drawing, and Edu sets the pace with his voice.

* **Stack:** Vite, vanilla TypeScript, SVG and GSAP. GSAP is free, including DrawSVG and MorphSVG, so confirm the installed version first. Do not use a framework unless you can argue why it helps the stage.
* **Engine:** build a small custom engine for one continuous stage, not a slide system. Each act is a module that receives the drawing state from the act before it and hands its own state to the next. Each click advances one beat.
* **Canvas:** a fixed 16:9 stage at 1920 by 1080, scaled to fit any screen with letterboxing in paper colour. It must also render properly on a phone for the published version, which may use a reading mode.
* **Controls:** Right arrow, Page Down, Space and Enter all advance. Left arrow and Page Up go back. Most presentation clickers send Page Down and Page Up. B or the full stop key blanks the screen to paper. Number keys jump to an act. Home restarts.
* **Presenter view:** a second window, linked through BroadcastChannel, that shows the current step, the next step, script notes for the act, an act by act timer against the ten minute budget, and the clock.
* **Performance:** 60fps on a mid range laptop with integrated graphics. No layout thrash. Animate transform, opacity and SVG stroke properties only.
* **Accessibility:** respect `prefers-reduced-motion` on the published web version. Check contrast against the art direction table.

---

## 8. How we work

Work in phases. **Stop at the end of each phase and wait for Edu's approval.**

1. **Read and question.** Read every file listed in section 4. Summarise the argument in five lines. List anything unclear or contradictory, and ask up to five questions.
2. **Storyboard.** Write `STORYBOARD.md` with one entry per scene: the visual, the on screen text, each step on click, estimated seconds, and the art direction archetype it uses. Add a timing table that proves the whole piece fits ten minutes.
3. **Style frames.** Build three still frames only: the cover, Act 5 ("You cannot report what you cannot trace.") and Act 8 ("Humans do. Always."). Show each in normal and projector simulation views. Screenshot them with Playwright at 1920 by 1080 and send them to Edu. Lock the type and colour here before building anything else.
4. **Engine.** Build the scene engine, the controls, the presenter view and the scaling.
5. **Acts.** Build act by act. After each one, record a short screen capture or a frame sequence for review.
6. **Rehearsal hardening.** Run a full offline test, a projector simulation (reduced contrast and a washed out preview), a clicker test and a timing run.
7. **Publish.** Deploy on Vercel at `eduardosopalda.com/berlin`, alongside Edu's existing Astro site. The live audience layer, if approved, runs as Vercel serverless functions with a small hosted store. Do not plan for IONOS hosting: Edu will consolidate hosting there only after 26 October.

Commit after every meaningful step with clear messages. Keep a `CHANGELOG.md` that Edu can read in two minutes.

---

## 9. Stage risk rules

The web deck must be as reliable as a file on a USB stick.

* **Fully offline.** Every font, script, image and video is inside the build folder. No CDN calls, no analytics and no network requests at runtime. Self host DM Sans and the chosen serif, which are Open Font License fonts.
* **Runs from a double click.** The final build must open from the local folder and also run via a one line local server. Test both.
* **Pre flight check.** A hidden `?check` route verifies that every asset has loaded and reports how quickly the first scene is ready.
* **Fallbacks on the USB stick:** the build folder, a full screen MP4 recording of the whole deck played at speaking pace, and a PDF of key frames for the organisers.
* **Venue test.** Before 26 October, Edu opens the deck on the venue laptop or his own through the venue projector. Build a checklist for this in `STAGE_CHECKLIST.md`.

---

## 10. Writing rules for anything that appears on screen

* No hyphens or dashes in on screen copy. Use colons, full stops or restructured sentences.
* Short sentences. Every word earns its place.
* No consulting jargon. No corporate PowerPoint titles.
* British spelling, to match the script.
* The script is Edu's voice. On screen text is the echo, not the transcript.

---

## 11. Definition of done

* A stranger who hears none of the talk can still follow the argument from the visuals alone.
* Someone in the third row remembers one image and one line a week later.
* It runs offline, from a clicker, in under ten minutes, with nothing that can fail on stage.
* Edu looks forward to pressing the first key.
