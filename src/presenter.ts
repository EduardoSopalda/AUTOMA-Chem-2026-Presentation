// Presenter view: a second window, opened with P. Same file, ?presenter.
// Talks to the deck with postMessage (works from file:// where BroadcastChannel may not).
// Clicker keys pressed while this window has focus are forwarded to the deck.

import { ACTS, BEATS, TALK_BUDGET } from "./beats";

export const NAV_KEYS = new Set(["ArrowRight", "PageDown", " ", "Enter", "ArrowLeft", "PageUp", "Home", "End", "b", "B", ".",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

type Msg = { type: "state"; i: number } | { type: "key"; key: string } | { type: "hello" };

const fmt = (s: number) => {
  const neg = s < 0; s = Math.abs(Math.round(s));
  return `${neg ? "+" : ""}${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function startPresenter(root: HTMLElement) {
  document.title = "Presenter · From Brasília to the Plant Floor";
  document.documentElement.classList.add("presenter-mode");
  root.hidden = false;
  root.innerHTML = `
    <style>
      html.presenter-mode, .presenter-mode body { background: #1c1a18; overflow: auto; }
      .presenter-mode #viewport { display: none; }
      .pv { color: #F1E4D1; font-family: var(--sans); padding: 28px 36px; display: grid; gap: 22px;
            grid-template-columns: 1.3fr 1fr; grid-template-rows: auto 1fr auto; min-height: 100vh; }
      .pv h2 { margin: 0 0 6px; font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: #D89C67; font-weight: 600; }
      .pv .now { grid-column: 1; } .pv .next { grid-column: 2; opacity: 0.75; }
      .pv .cue { font-family: var(--serif); font-size: 34px; line-height: 1.2; margin: 0; }
      .pv .next .cue { font-size: 24px; }
      .pv .words { margin-top: 10px; font-size: 17px; color: #8DB5D2; }
      .pv .meta { font-size: 15px; color: #bdb3a6; margin-top: 8px; }
      .pv .hold { display: inline-block; margin-top: 12px; padding: 4px 10px; border: 1px solid #D89C67; color: #D89C67; font-size: 14px; letter-spacing: 0.12em; }
      .pv .list { grid-column: 1 / -1; font-size: 15px; line-height: 1.6; columns: 2; color: #bdb3a6; }
      .pv .list .cur { color: #F1E4D1; font-weight: 600; }
      .pv .clocks { grid-column: 1 / -1; display: flex; gap: 48px; font-variant-numeric: tabular-nums; }
      .pv .clocks div { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #bdb3a6; }
      .pv .clocks b { display: block; font-size: 44px; letter-spacing: 0; color: #F1E4D1; font-weight: 500; }
      .pv .over b { color: #D89C67; }
      .pv .lost { color: #D89C67; font-size: 15px; }
    </style>
    <div class="pv">
      <section class="now"><h2>Now</h2><p class="cue"></p><div class="words"></div><div class="meta"></div><div class="holdtag"></div></section>
      <section class="next"><h2>Next</h2><p class="cue"></p><div class="words"></div></section>
      <section class="list"></section>
      <section class="clocks">
        <div class="c-talk">Talk<b>0:00</b></div>
        <div class="c-left">Left of 10:00<b>10:00</b></div>
        <div class="c-act">This act<b>0:00</b></div>
        <div class="c-clock">Clock<b></b></div>
        <div class="lost" hidden>Deck not connected. Press P in the deck window.</div>
      </section>
    </div>`;

  const $ = (q: string) => root.querySelector(q) as HTMLElement;
  let i = -1, talkStart = 0, actStart = 0, curAct = -1, lastSeen = 0;

  const deck = () => window.opener as Window | null;
  const send = (m: Msg) => deck()?.postMessage(m, "*");

  function render() {
    const b = BEATS[i], n = BEATS[i + 1];
    if (!b) return;
    $(".now .cue").textContent = b.cue;
    $(".now .words").textContent = b.text.join("  ·  ");
    $(".now .meta").textContent = `${b.act === 0 ? "Cover" : b.act === 10 ? "Coda" : "Act " + b.act} · ${ACTS[b.act].title} · click ${b.n} of ${BEATS.length - 1} · budget ${b.secs} s`;
    $(".now .holdtag").innerHTML = b.hold ? `<span class="hold">HOLD · SILENCE</span>` : "";
    $(".next .cue").textContent = n ? n.cue : "End. Sit down.";
    $(".next .words").textContent = n ? n.text.join("  ·  ") : "";
    $(".list").innerHTML = BEATS.filter((x) => x.act === b.act)
      .map((x) => `<div class="${x === b ? "cur" : ""}">${x.n}. ${x.cue}</div>`).join("");
  }

  function tick() {
    const now = performance.now();
    const talk = talkStart ? (now - talkStart) / 1000 : 0;
    const act = actStart ? (now - actStart) / 1000 : 0;
    const budget = i >= 0 ? ACTS[BEATS[i].act].budget : 0;
    $(".c-talk b").textContent = fmt(talk);
    $(".c-left b").textContent = fmt(TALK_BUDGET - talk);
    $(".c-left").classList.toggle("over", talk > TALK_BUDGET);
    $(".c-act b").textContent = `${fmt(act)} / ${fmt(budget)}`;
    $(".c-act").classList.toggle("over", act > budget);
    $(".c-clock b").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    ($(".lost") as HTMLElement).hidden = Date.now() - lastSeen < 4000;
    requestAnimationFrame(tick);
  }

  window.addEventListener("message", (e) => {
    const m = e.data as Msg;
    if (m?.type !== "state") return;
    lastSeen = Date.now();
    if (m.i === i) return;
    const now = performance.now();
    if (m.i >= 1 && !talkStart) talkStart = now;          // the talk starts when Act 1 starts
    if (m.i === 0) { talkStart = 0; actStart = 0; curAct = 0; }
    const a = BEATS[m.i].act;
    if (a !== curAct) { curAct = a; actStart = now; }
    i = m.i;
    render();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") { talkStart = actStart = 0; return; }   // reset timers
    if (!NAV_KEYS.has(e.key) || e.repeat) return;
    e.preventDefault();
    send({ type: "key", key: e.key });
  });

  setInterval(() => send({ type: "hello" }), 1000);   // lets a reloaded deck find us again
  send({ type: "hello" });
  requestAnimationFrame(tick);
}
