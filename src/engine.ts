// One continuous sheet, advanced one phrase per click. Never autoplays between beats.
// Forward by one: animate. Anything else (back, jump, reload): rebuild and fast forward, so state is exact.

import { gsap } from "gsap";
import { BEATS } from "./beats";
import { buildFor } from "./acts";
import { createSheet, type Sheet } from "./sheet";

export type Listener = (i: number) => void;

export class Engine {
  i = -1;
  sheet!: Sheet;
  private tl?: gsap.core.Timeline;
  private listeners: Listener[] = [];

  constructor(private root: HTMLElement) {}

  get count() { return BEATS.length; }
  onChange(fn: Listener) { this.listeners.push(fn); }

  /** Scene 0 plays its build once, then holds. */
  boot(start = 0) {
    if (start > 0) return this.goto(start, false);
    this.reset();
    this.run(0, true);
  }

  next() { if (this.i < this.count - 1) this.goto(this.i + 1, true); }
  prev() { if (this.i > 0) this.goto(this.i - 1, false); }
  home() { this.goto(0, false); }
  end() { this.goto(this.count - 1, false); }
  act(n: number) {
    const k = BEATS.findIndex((b) => b.act === n);
    if (k >= 0) this.goto(k, false);
  }
  /** R on the cover replays its build, as the title card always did. */
  replayCover() { if (this.i === 0) { this.reset(); this.run(0, true); } }

  goto(k: number, animate: boolean) {
    k = Math.max(0, Math.min(this.count - 1, k));
    if (animate && k === this.i + 1) {
      this.settle();                       // the last beat lands fully before the next begins
      this.run(k, true);
      return;
    }
    this.reset();
    for (let j = 0; j <= k; j++) this.run(j, false);
  }

  private run(k: number, animate: boolean) {
    this.root.classList.remove("hold");
    const beat = BEATS[k];
    const tl = buildFor(k)(this.sheet, beat);
    this.tl = tl;
    this.i = k;
    if (beat.hold) tl.eventCallback("onComplete", () => this.quiet());
    if (!animate) { tl.progress(1); if (beat.hold) this.quiet(); }
    this.listeners.forEach((fn) => fn(k));
  }

  /** Complete whatever is still moving from earlier beats. */
  private settle() {
    this.tl?.progress(1);
    gsap.globalTimeline.getChildren(true, true, false).forEach((t) => t.progress(1));
  }

  /** Protected silence: no residual tween, no glow, no fade. */
  private quiet() {
    this.settle();
    this.root.classList.add("hold");
  }

  private reset() {
    this.tl?.kill();
    gsap.globalTimeline.clear();
    this.sheet = createSheet(this.root);
  }
}
