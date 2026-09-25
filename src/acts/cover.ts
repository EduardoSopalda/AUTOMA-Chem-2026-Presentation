// Scene 0 and the first click of Act 1: the cover draws itself, then goes back to paper.

import { brasilia, COVER, type Plan } from "../draw/brasilia";
import { setTitleBlock } from "../sheet";
import { gsap, drawIn, unDraw, type Build } from "./common";

let plan: Plan | null = null;

/** Copper reveals first; blueprint follows. The composition does not move. */
export const cover: Build = (s) => {
  plan = brasilia(s.draw, "cover", COVER, "cover-plan");
  const circles = plan.detail.filter((e) => e.tagName === "circle");
  const grid = plan.detail.filter((e) => e.tagName === "path");
  gsap.set([...plan.sketch, ...plan.axis, ...plan.wings, ...plan.lake, ...plan.ring.filter((e) => e.tagName === "path")], { drawSVG: "0%" });
  gsap.set([...grid, ...circles, ...plan.blocks, ...plan.ring.filter((e) => e.tagName === "circle")], { opacity: 0 });
  gsap.set(plan.lake, { fillOpacity: 0 });

  const tl = gsap.timeline();
  drawIn(tl, plan.sketch, 1.5, 5, 0.9);
  drawIn(tl, plan.axis, 7, 2.4, 0.4);
  tl.to(grid, { opacity: 1, duration: 3, ease: "sine.inOut" }, 9);
  drawIn(tl, plan.wings, 10, 3, 0.2);
  tl.to(plan.blocks, { opacity: 1, duration: 0.6, stagger: 0.12, ease: "sine.out" }, 11);
  drawIn(tl, plan.lake, 12, 2);
  tl.to(plan.lake, { fillOpacity: 0.45, duration: 2, ease: "sine.inOut" }, 13.5);
  drawIn(tl, plan.ring.filter((e) => e.tagName === "path"), 13, 3, 0.2);
  tl.to(plan.ring.filter((e) => e.tagName === "circle"), { opacity: 1, duration: 0.8, stagger: 0.3 }, 15);
  tl.to(circles, { opacity: 1, duration: 0.8, stagger: 0.04, ease: "sine.out" }, 15.5);
  return tl;
};

/** Act 1, click 1: "I am an architect." The cover type fades and the drawing un-draws into paper. Only the figure stays. */
export const architect: Build = (s, beat) => {
  const p = s.draw.querySelector("#cover-plan");
  const tl = gsap.timeline();
  tl.to(s.cover.querySelectorAll(".top, .bottom, .question"), { opacity: 0, duration: 1.2, ease: "sine.inOut" }, 0)
    .call(() => setTitleBlock(s, beat), [], 0.6);
  if (p && plan) {
    const circles = plan.detail.filter((e) => e.tagName === "circle");
    const grid = plan.detail.filter((e) => e.tagName === "path");
    // Reality leaves first, then the idea: the reverse of how it arrived
    tl.to([...circles, ...plan.ring.filter((e) => e.tagName === "circle")], { opacity: 0, duration: 0.6, stagger: 0.01 }, 0.3);
    tl.to(plan.lake, { fillOpacity: 0, duration: 0.8 }, 0.3);
    unDraw(tl, [...plan.ring.filter((e) => e.tagName === "path"), ...plan.lake], 0.6, 1.2);
    tl.to(plan.blocks, { opacity: 0, duration: 0.4, stagger: { each: 0.05, from: "end" } }, 0.8);
    unDraw(tl, plan.wings, 1.2, 1.4);
    tl.to(grid, { opacity: 0, duration: 1.2 }, 1.4);
    unDraw(tl, [...plan.sketch].reverse(), 2, 1.4, 0.25);
    unDraw(tl, plan.axis, 3.6, 1.2);
    tl.call(() => p.remove(), [], 5);
  }
  return tl;
};
