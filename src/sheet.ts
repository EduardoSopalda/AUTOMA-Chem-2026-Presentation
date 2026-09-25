// The one sheet of paper. Everything the audience sees lives in here.
// reset() rebuilds it from nothing, so any beat's state can be reproduced exactly.

import logoUrl from "../layers/logo.svg";
import figureUrl from "../assets/figure/figure.svg";
import { ACTS, type BeatInfo } from "./beats";

export const SVGNS = "http://www.w3.org/2000/svg";

export interface Sheet {
  root: HTMLElement;
  cover: HTMLElement;
  draw: SVGSVGElement;      // linework for the acts
  words: HTMLElement;       // type that belongs to the drawing
  figure: HTMLImageElement; // never moves, never changes
  tb: HTMLElement;          // the living title block
}

const QUESTION = "What is one word in your organisation that means something different depending on which floor you are standing on?";

const coverHtml = `
<div class="cover">
  <div class="plate">
    <header class="top">
      <div class="side"><p class="kicker">Act I</p><h2>The idea</h2><p>You can draw amazing things on paper…</p></div>
      <div class="titleblock">
        <h1>People, Data and AI</h1>
        <p class="theme">in Sustainable Digital Transformation</p>
        <div class="rule" aria-hidden="true"></div>
        <p class="talk">From Brasília to the plant floor</p>
      </div>
      <div class="side right"><p class="kicker">Act II</p><h2>Reality</h2><p>…and then the real world shows up.</p></div>
    </header>
    <div class="art" aria-hidden="true"></div>
    <footer class="bottom">
      <div class="who">
        <p class="name">Eduardo Sopalda</p>
        <p class="role">D&amp;T · Global Data Governance Lead</p>
        <img class="logo" src="${logoUrl}" alt="dsm-firmenich" />
      </div>
      <div class="values">
        <p class="ppp">People <span>|</span> Planet <span>|</span> <b>Progress</b></p>
        <p class="tag">We bring progress to life</p>
      </div>
      <div class="event">
        <p class="conf">AUTOMA Chem 2026</p>
        <p class="meta">Berlin · 26 October 2026</p>
        <p class="meta">Opening panel</p>
      </div>
    </footer>
  </div>
  <p class="question">${QUESTION}</p>
</div>`;

export function createSheet(root: HTMLElement): Sheet {
  root.innerHTML = `${coverHtml}
    <svg class="layer draw" viewBox="0 0 1920 1080" aria-hidden="true"></svg>
    <div class="layer words"></div>
    <img class="figure" src="${figureUrl}" alt="" />
    <div class="tb" style="display:none"></div>`;
  return {
    root,
    cover: root.querySelector(".cover")!,
    draw: root.querySelector("svg.draw")!,
    words: root.querySelector(".words")!,
    figure: root.querySelector(".figure")!,
    tb: root.querySelector(".tb")!,
  };
}

// Title block text changes instantly. Type never animates.
export function setTitleBlock(s: Sheet, beat: BeatInfo, note = "") {
  const a = ACTS[beat.act];
  const act = beat.act === 10 ? "Coda" : `Act ${String(beat.act).padStart(2, "0")}`;
  s.tb.style.display = "";
  s.tb.innerHTML = `
    <div class="wide"><span class="k">Project</span><span class="v">From Brasília to the Plant Floor</span></div>
    <div class="wide"><span class="k">${act}</span><span class="v">${a.title}</span></div>
    <div class="first"><span class="k">Drawing</span><span class="v">${a.drawing}</span></div>
    <div><span class="k">Scale</span><span class="v">${a.scale || "None"}</span></div>
    <div><span class="k">Rev</span><span class="v">C</span></div>
    <div class="wide"><span class="note">${note}</span></div>`;
}

export function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  parent?.appendChild(el);
  return el;
}

export interface TextOpts { size?: number; family?: "serif" | "sans"; weight?: number; fill?: string; anchor?: "start" | "middle" | "end"; italic?: boolean; spacing?: number }

/** Type on the drawing. Never animated except for opacity. */
export function label(parent: Element, x: number, y: number, text: string, o: TextOpts = {}) {
  const t = svg("text", {
    x, y, "font-family": o.family === "serif" ? "var(--serif)" : "var(--sans)", "font-size": o.size ?? 44,
    "font-weight": o.weight ?? (o.family === "serif" ? 500 : 500), fill: o.fill ?? "var(--ink)", "text-anchor": o.anchor ?? "start",
    "letter-spacing": o.spacing ?? 0, ...(o.italic ? { "font-style": "italic" } : {}),
  }, parent);
  t.textContent = text;
  return t;
}
