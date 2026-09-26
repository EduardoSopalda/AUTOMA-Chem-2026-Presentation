// Which build runs on which click. Acts not yet drawn fall back to a placeholder that shows their words.

import { BEATS } from "../beats";
import { cover, architect } from "./cover";
import { ACT1 } from "./act1";
import { ACT2 } from "./act2";
import { ACT3 } from "./act3";
import { ACT5 } from "./act5";
import { ACT8 } from "./act8";
import { ACT9 } from "./act9";
import { gsap, clearPrevious, type Build } from "./common";
import { setTitleBlock } from "../sheet";

const SOURCE_NOTE = "Scope 1, 2 and 3, 2025: 11,002 kt CO2e. Source: dsm-firmenich Integrated Annual Report 2025.";

/** Placeholder: the beat's on screen words, at reading size, so timing can be rehearsed. */
const placeholder: Build = (s, beat) => {
  const tl = gsap.timeline();
  clearPrevious(s, tl, 0, Array.from(s.draw.querySelectorAll("#plan2, #plan9")));
  const el = document.createElement("div");
  el.className = "ph t";
  const [lead, ...rest] = beat.text.length > 2 && beat.text.every((x) => x.length < 24) ? ["", ...beat.text] : beat.text;
  el.innerHTML = `<p class="tag">Click ${beat.n} · placeholder</p>` + (lead ? `<p class="lead"></p>` : "") + (rest.length ? `<div class="labels"></div>` : "");
  if (lead) el.querySelector(".lead")!.textContent = lead;
  for (const x of rest) { const sp = document.createElement("span"); sp.textContent = x; el.querySelector(".labels")!.appendChild(sp); }
  gsap.set(el, { opacity: 0 });
  tl.call(() => { s.words.appendChild(el); setTitleBlock(s, beat, beat.act === 5 ? SOURCE_NOTE : ""); }, [], 0.5)
    .to(el, { opacity: 1, duration: 0.8, ease: "sine.out" }, 0.55);
  return tl;
};

const BUILDS: Record<number, Build> = {
  0: cover,
  1: architect,
  ...ACT1,
  ...ACT2,
  ...ACT3,
  ...ACT5,
  ...ACT8,
  ...ACT9,
};

export function buildFor(i: number): Build {
  return BUILDS[BEATS[i].n] ?? placeholder;
}
