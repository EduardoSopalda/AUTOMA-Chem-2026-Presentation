// The running order, from STORYBOARD.md. One entry per click. Scene 0 is the cover.
// `text` is what appears on the sheet; `cue` is what Edu is saying as he presses.
// Seconds are budgets until the cut script and the recording arrive.

export interface BeatInfo {
  act: number;          // 0 cover, 1 to 9 acts, 10 coda
  n: number;            // click number, 0 for the cover
  cue: string;
  text: string[];
  secs: number;
  hold?: boolean;       // protected silence: nothing may move once the beat has landed
}

export interface ActInfo { title: string; budget: number; drawing: string; scale: string }

export const ACTS: Record<number, ActInfo> = {
  0: { title: "Cover", budget: 8, drawing: "Cover", scale: "" },
  1: { title: "The Architect", budget: 55, drawing: "Section", scale: "1 : 50" },
  2: { title: "Brasília", budget: 70, drawing: "Plan", scale: "1 : 50 000" },
  3: { title: "When the drawing meets the ground", budget: 70, drawing: "Section A–A", scale: "1 : 1" },
  4: { title: "Sustainability has the same problem", budget: 60, drawing: "Section", scale: "1 : 1" },
  5: { title: "The carbon number", budget: 60, drawing: "Section", scale: "1 : 1" },
  6: { title: "Why don't we just use AI?", budget: 55, drawing: "Plan", scale: "1 : 1" },
  7: { title: "The road to the shiny city", budget: 50, drawing: "Section B–B", scale: "1 : 1" },
  8: { title: "Back at ground level", budget: 95, drawing: "Elevation", scale: "1 : 1" },
  9: { title: "Back to Brasília", budget: 45, drawing: "Plan", scale: "1 : 50 000" },
  10: { title: "The question", budget: 20, drawing: "Blank sheet", scale: "" },
};

export const BEATS: BeatInfo[] = [
  { act: 0, n: 0, cue: "There's a question on the screen. Keep it in mind. I'll come back to it at the end.", text: [], secs: 8 },

  { act: 1, n: 1, cue: "I am an architect.", text: [], secs: 8 },
  { act: 1, n: 2, cue: "I drew buildings.", text: [], secs: 20 },
  { act: 1, n: 3, cue: "We design from above.", text: [], secs: 10 },
  { act: 1, n: 4, cue: "Someone has to extract the data…", text: ["Extract.", "Interpret.", "Challenge.", "Trust.", "Tell it that it is wrong."], secs: 17 },

  { act: 2, n: 5, cue: "Let me take you to Brasília.", text: ["Urban plan: Lúcio Costa, 1957. Buildings: Oscar Niemeyer."], secs: 24 },
  { act: 2, n: 6, cue: "Jan Gehl later coined a name…", text: ["The Brasília Syndrome.", "1 : 50 000", "1 : 1"], secs: 22 },
  { act: 2, n: 7, cue: "Many of the people who built Brasília…", text: [], secs: 10 },
  { act: 2, n: 8, cue: "The city was finished.", text: ["Built by people who could not afford to live in it."], secs: 14 },

  { act: 3, n: 9, cue: "We build governance in a very similar way.", text: ["Policy.", "Controls.", "Committee.", "Operating model."], secs: 14 },
  { act: 3, n: 10, cue: "Seen from above…", text: ["Auditor.", "Regulator.", "Steering committee."], secs: 8 },
  { act: 3, n: 11, cue: "Then the framework reaches the plant.", text: ["A–A"], secs: 5 },
  { act: 3, n: 12, cue: "The policy may be too long to cross.", text: ["Tuesday, 07:40. Plant running.", "batch", "batch", "3 years"], secs: 20 },
  { act: 3, n: 13, cue: "I have been the person with the beautiful drawing.", text: [], secs: 13 },
  { act: 3, n: 14, cue: "So I stopped being interested…", text: ["Complete.", "Used."], secs: 10 },

  { act: 4, n: 15, cue: "We set ambitions, targets and roadmaps.", text: ["Emissions.", "Sourcing.", "Circularity.", "Footprints."], secs: 12 },
  { act: 4, n: 16, cue: "But eventually the ambition has to become evidence.", text: ["Evidence.", "People.", "Planet.", "Progress."], secs: 14 },
  { act: 4, n: 17, cue: "…created across businesses, processes…", text: ["Businesses.", "Processes.", "Systems.", "Suppliers.", "People."], secs: 16 },
  { act: 4, n: 18, cue: "Where did it come from?", text: ["Source.", "Owner.", "Definition.", "Conflict.", "Accountable."], secs: 18 },

  { act: 5, n: 19, cue: "A carbon number looks like chemistry.", text: ["11,002 kt CO2e", "Data product"], secs: 10 },
  { act: 5, n: 20, cue: "Behind one apparently simple number…", text: ["93% outside our walls"], secs: 16 },
  { act: 5, n: 21, cue: "The challenge is being able to explain that number.", text: ["140 kt market based", "464 kt location based", "Same electricity. Two correct answers."], secs: 12 },
  { act: 5, n: 22, cue: "Someone has to know which source is right.", text: ["Know.", "Understand.", "Challenge.", "Explain."], secs: 10 },
  { act: 5, n: 23, cue: "You cannot report what you cannot trace.", text: ["You cannot report what you cannot trace."], secs: 12, hold: true },

  { act: 6, n: 24, cue: "…why don't we just use AI?", text: ["Why don't we just use AI?"], secs: 10 },
  { act: 6, n: 25, cue: "…the word batch to mean eight different things…", text: ["batch"], secs: 13 },
  { act: 6, n: 26, cue: "Around ten thousand documents went in…", text: ["10,000 documents"], secs: 17 },
  { act: 6, n: 27, cue: "So filtering before you embed…", text: ["Governance.", "Cost.", "Sustainability."], secs: 15 },

  { act: 7, n: 28, cue: "Everyone wants the shiny city on the hill.", text: ["Autonomous plant.", "Digital twin.", "Real time intelligence.", "AI agents."], secs: 12 },
  { act: 7, n: 29, cue: "But we do not get there by teleportation.", text: [], secs: 7 },
  { act: 7, n: 30, cue: "The road to that city is paved with data.", text: ["Definitions.", "Ownership.", "Lineage.", "Quality.", "Context."], secs: 14 },
  { act: 7, n: 31, cue: "If that road is built from data nobody trusts…", text: [], secs: 8 },
  { act: 7, n: 32, cue: "We have simply built another Brasília.", text: [], secs: 9 },

  { act: 8, n: 33, cue: "Take digital twins.", text: ["Sensors.", "Equipment.", "Lab results.", "Maintenance.", "Energy."], secs: 18, hold: true },
  { act: 8, n: 34, cue: "AI can help build, enrich and operate…", text: ["pattern found", "behaviour predicted"], secs: 17 },
  { act: 8, n: 35, cue: "If the equipment data is incomplete…", text: ["Yield", "Yield"], secs: 14 },
  { act: 8, n: 36, cue: "…when the operator on the night shift trusts…", text: ["Night shift, 03:10.", "Accountable", "1 : 1"], secs: 28 },
  { act: 8, n: 37, cue: "Agents do not own risk.", text: [], secs: 6 },
  { act: 8, n: 38, cue: "Humans do. Always.", text: ["Humans do. Always."], secs: 12, hold: true },

  { act: 9, n: 39, cue: "So let me take you back to Brasília.", text: [], secs: 10 },
  { act: 9, n: 40, cue: "I think we can.", text: [], secs: 10 },
  { act: 9, n: 41, cue: "And I think it is worth doing.", text: [], secs: 10 },
  { act: 9, n: 42, cue: "Frameworks are necessary.", text: ["Useful. Trusted. Sustainable in practice."], secs: 15 },

  { act: 10, n: 43, cue: "So I want to leave you with one question.", text: ["What is one word in your organisation that means something different depending on which floor you are standing on?"], secs: 20 },
];

export const TALK_BUDGET = 600;
