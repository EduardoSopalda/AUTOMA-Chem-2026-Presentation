// The running order, from STORYBOARD.md. One entry per click. Scene 0 is the cover.
// `text` is what appears on the sheet; `cue` is what Edu is saying as he presses.
// Script of record: docs/AUTOMA-Chem-2026-Script-CUT.md. Seconds are each click's share of its act budget,
// by word count, with silences and laughs reserved first. The recording will replace them.

export interface BeatInfo {
  act: number;          // 0 cover, 1 to 9 acts, 10 coda
  n: number;            // position in the running order, 0 for the cover
  key: string;          // stable storyboard key ("6", "6b"...): builds are looked up by it, so inserting a click renumbers nothing
  pause?: number;       // seconds of silence Edu holds before the next click (shown in the presenter view)
  cue: string;
  anchor: string;       // the exact words in the cut script where this click is pressed
  text: string[];
  secs: number;
  hold?: boolean;       // protected silence: nothing may move once the beat has landed
}

export interface ActInfo { title: string; budget: number; drawing: string; scale: string }

export const ACTS: Record<number, ActInfo> = {
  0: { title: "Cover", budget: 10, drawing: "Cover", scale: "" },
  1: { title: "The Architect", budget: 70, drawing: "Section", scale: "1 : 50" },
  2: { title: "Brasília", budget: 70, drawing: "Plan", scale: "1 : 50 000" },
  3: { title: "When the drawing meets the ground", budget: 70, drawing: "Section A–A", scale: "1 : 1" },
  4: { title: "Sustainability has the same problem", budget: 65, drawing: "Section", scale: "1 : 1" },
  5: { title: "The carbon number", budget: 55, drawing: "Section", scale: "1 : 1" },
  6: { title: "Why don't we just use AI?", budget: 60, drawing: "Plan", scale: "1 : 1" },
  7: { title: "The road to the shiny city", budget: 40, drawing: "Section B–B", scale: "1 : 1" },
  8: { title: "Back at ground level", budget: 95, drawing: "Elevation", scale: "1 : 1" },
  9: { title: "Back to Brasília", budget: 35, drawing: "Plan", scale: "1 : 50 000" },
  10: { title: "The question", budget: 25, drawing: "Blank sheet", scale: "" },
};

export const BEATS: BeatInfo[] = [
  { act: 0, n: 0, key: "0", cue: "There's a question on the screen. Keep it in mind. I'll come back to it at the end.", anchor: "There's a question on the screen.", text: [], secs: 10  },
  { act: 1, n: 1, key: "1", cue: "I am an architect.", anchor: "I am an architect.", text: [], secs: 4  },
  { act: 1, n: 2, key: "2", cue: "I studied architecture. I drew buildings.", anchor: "I studied architecture.", text: [], secs: 24  },
  { act: 1, n: 3, key: "3", cue: "We design from above.", anchor: "We design from above,", text: [], secs: 16  },
  { act: 1, n: 4, key: "4", cue: "Someone has to extract the data…", anchor: "Someone has to extract the data,", text: ["Extract.", "Interpret.", "Challenge.", "Trust.", "Tell it that it is wrong."], secs: 26  },
  { act: 2, n: 5, key: "5", cue: "Let me take you to Brasília.", anchor: "Let me take you to Brasília.", text: ["Urban plan: Lúcio Costa, 1957. Buildings: Oscar Niemeyer."], secs: 11  },
  { act: 2, n: 6, key: "6", cue: "Jan Gehl gave a name…", anchor: "Jan Gehl gave a name", text: ["The Brasília Syndrome."], secs: 24  },
  { act: 2, n: 7, key: "6b", cue: "The point is scale.", anchor: "The point is scale.", text: ["1 : 50 000", "1 : 1"], secs: 12 },
  { act: 2, n: 8, key: "7", cue: "Many of the people who built Brasília…", anchor: "Many of the people who built Brasília", text: [], secs: 10  },
  { act: 2, n: 9, key: "8", cue: "The city was finished.", anchor: "The city was finished.", text: ["Built by people who could not afford to live in it."], secs: 13  },
  { act: 3, n: 10, key: "9", cue: "We build governance in a very similar way.", anchor: "We build governance in a very similar way.", text: ["Policy.", "Controls.", "Committee.", "Operating model."], secs: 15  },
  { act: 3, n: 11, key: "10", cue: "Seen from above…", anchor: "Seen from above,", text: ["Auditor.", "Regulator.", "Steering committee."], secs: 3  },
  { act: 3, n: 12, key: "11", cue: "Then the framework reaches the plant.", anchor: "Then the framework reaches the plant.", text: ["A–A"], secs: 5  },
  { act: 3, n: 13, key: "12", cue: "The policy is too long to cross.", anchor: "The policy is too long to cross.", text: ["Tuesday, 07:40. Plant running.", "batch", "batch", "3 years"], secs: 22  },
  { act: 3, n: 14, key: "13", cue: "I have been the person with the beautiful drawing.", anchor: "I have been the person with the beautiful drawing.", text: [], secs: 18  },
  { act: 3, n: 15, key: "14", cue: "So I stopped asking whether a framework was complete.", anchor: "So I stopped asking", text: ["Complete.", "Used."], secs: 7  },
  { act: 4, n: 16, key: "15", cue: "Sustainability has the same problem.", anchor: "Sustainability has the same problem.", text: ["Emissions.", "Sourcing.", "Circularity.", "Footprints."], secs: 9  },
  { act: 4, n: 17, key: "16", cue: "But eventually the ambition has to become evidence.", anchor: "But eventually the ambition has to become evidence.", text: ["Evidence.", "People.", "Planet.", "Progress."], secs: 14  },
  { act: 4, n: 18, key: "17", cue: "The ambition may be global…", anchor: "The ambition may be global,", text: ["Businesses.", "Processes.", "Systems.", "Suppliers.", "People."], secs: 23  },
  { act: 4, n: 19, key: "18", cue: "Where did it come from?", anchor: "Where did it come from?", text: ["Source.", "Owner.", "Definition.", "Conflict.", "Accountable."], secs: 19  },
  { act: 5, n: 20, key: "19", cue: "A carbon number looks like chemistry.", anchor: "A carbon number looks like chemistry.", text: ["11,002 kt CO2e", "Data product"], secs: 6  },
  { act: 5, n: 21, key: "20", cue: "Behind one simple number…", anchor: "Behind one simple number", text: ["93% outside our walls"], secs: 16  },
  { act: 5, n: 22, key: "21", cue: "So the challenge is not calculating the number.", anchor: "So the challenge is not calculating the number.", text: ["140 kt market based", "464 kt location based", "Same electricity. Two correct answers."], secs: 14  },
  { act: 5, n: 23, key: "22", cue: "Someone has to know which source is right.", anchor: "Someone has to know which source is right.", text: ["Know.", "Understand.", "Challenge.", "Explain."], secs: 12  },
  { act: 5, n: 24, key: "23", cue: "You cannot report what you cannot trace.", anchor: "You cannot report what you cannot trace.", text: ["You cannot report what you cannot trace."], secs: 7, hold: true  },
  { act: 6, n: 25, key: "24", cue: "…why don't we just use AI?", anchor: "And then, inevitably, someone says", text: ["Why don't we just use AI?"], secs: 13  },
  { act: 6, n: 26, key: "25", cue: "If five people use the word batch…", anchor: "If five people use the word batch", text: ["batch"], secs: 11  },
  { act: 6, n: 27, key: "26", cue: "In one agent project I saw…", anchor: "In one agent project I saw", text: ["10,000 documents"], secs: 18  },
  { act: 6, n: 28, key: "27", cue: "So filtering before you embed…", anchor: "So filtering before you embed", text: ["Governance.", "Cost.", "Sustainability."], secs: 18  },
  { act: 7, n: 29, key: "28", cue: "Everyone wants the shiny city on the hill.", anchor: "Everyone wants the shiny city on the hill.", text: ["Autonomous plant.", "Digital twin.", "Real time intelligence.", "AI agents."], secs: 9  },
  { act: 7, n: 30, key: "29", cue: "But we do not get there by teleportation.", anchor: "But we do not get there by teleportation.", text: [], secs: 6  },
  { act: 7, n: 31, key: "30", cue: "The road to that city is paved with data.", anchor: "The road to that city is paved with data.", text: ["Definitions.", "Ownership.", "Lineage.", "Quality.", "Context."], secs: 11  },
  { act: 7, n: 32, key: "31", cue: "If that road is built from data nobody trusts…", anchor: "If that road is built from data nobody trusts", text: [], secs: 9  },
  { act: 7, n: 33, key: "32", cue: "We have simply built another Brasília.", anchor: "We have simply built another Brasília.", text: [], secs: 5  },
  { act: 8, n: 34, key: "33", cue: "Take digital twins.", anchor: "Take digital twins.", text: ["Sensors.", "Equipment.", "Lab results.", "Maintenance.", "Energy."], secs: 11, hold: true  },
  { act: 8, n: 35, key: "34", cue: "AI can help build and run these models.", anchor: "AI can help build and run these models.", text: ["pattern found", "behaviour predicted"], secs: 20  },
  { act: 8, n: 36, key: "35", cue: "But the twin is only as good as what flows into it.", anchor: "But the twin is only as good as what flows into it.", text: ["Yield", "Yield"], secs: 17  },
  { act: 8, n: 37, key: "36", cue: "It becomes sustainable, in both senses…", anchor: "It becomes sustainable, in both senses,", text: ["Night shift, 03:10.", "Accountable"], secs: 16  },
  { act: 8, n: 38, key: "36b", cue: "That is why governance has to be designed at human scale.", anchor: "That is why governance has to be designed at human scale.", text: ["1 : 1"], secs: 19 },
  { act: 8, n: 39, key: "37", cue: "Agents do not own risk.", anchor: "Agents do not own risk.", text: [], secs: 4  },
  { act: 8, n: 40, key: "38", cue: "Humans do. Always.", anchor: "Humans do. Always.", text: ["Humans do. Always."], secs: 8, hold: true  },
  { act: 9, n: 41, key: "39", cue: "So let me take you back to Brasília.", anchor: "So let me take you back to Brasília.", text: [], secs: 15  },
  { act: 9, n: 42, key: "40", cue: "I think we can.", anchor: "I think we can.", text: [], secs: 4  },
  { act: 9, n: 43, key: "41", cue: "And I think it is worth doing.", anchor: "And I think it is worth doing.", text: [], secs: 7, pause: 3 },
  { act: 9, n: 44, key: "42", cue: "Frameworks are necessary.", anchor: "Frameworks are necessary.", text: ["Useful. Trusted. Sustainable in practice."], secs: 9  },
  { act: 10, n: 45, key: "43", cue: "So here is the question from the start.", anchor: "So here is the question from the start.", text: ["What is one word in your organisation that means something different depending on which floor you are standing on?"], secs: 25  },










];

export const TALK_BUDGET = 600;
