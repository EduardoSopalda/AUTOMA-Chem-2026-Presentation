// The script of record, split into the passage Edu speaks on each click.
// Each click's passage runs from its anchor to the next click's anchor.

import raw from "../docs/AUTOMA-Chem-2026-Script-CUT.md?raw";
import { BEATS } from "./beats";

function spokenText(md: string): string {
  const body = md.split("---").slice(1).join(" ");
  return body.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#") && l !== "---").join(" ");
}

export const PASSAGES: string[] = (() => {
  const text = spokenText(raw);
  const pos: number[] = [];
  let from = 0;
  for (const b of BEATS) {
    const i = text.indexOf(b.anchor, from);
    if (i < 0) throw new Error(`Script anchor not found for click ${b.n}: "${b.anchor}"`);
    pos.push(i);
    from = i + 1;
  }
  pos.push(text.length);
  return BEATS.map((_, k) => text.slice(pos[k], pos[k + 1]).trim());
})();

export const WORDS: number[] = PASSAGES.map((p) => p.split(/\s+/).filter(Boolean).length);
