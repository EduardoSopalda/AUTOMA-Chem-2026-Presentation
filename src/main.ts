import "./styles.css";
import { Engine } from "./engine";
import { BEATS } from "./beats";
import { NAV_KEYS, startPresenter } from "./presenter";
import { runCheck } from "./check";

const params = new URLSearchParams(location.search);

if (params.has("presenter")) {
  startPresenter(document.getElementById("app-presenter")!);
} else {
  startDeck();
}

function startDeck() {
  const t0 = performance.now();
  const sheetEl = document.getElementById("sheet")!;
  const blank = document.getElementById("blank")!;
  const engine = new Engine(sheetEl);
  let presenter: Window | null = null;

  // Scale the fixed 1920 by 1080 composition to fit, letterboxed in paper.
  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    sheetEl.style.position = "absolute";
    sheetEl.style.left = "50%";
    sheetEl.style.top = "50%";
    sheetEl.style.transform = `translate(-50%, -50%) scale(${s})`;
  };
  addEventListener("resize", fit);
  fit();

  // Keep the current beat in the URL, so a reload on stage comes back to the same moment.
  engine.onChange((i) => {
    history.replaceState(null, "", i ? `#${i}` : location.pathname + location.search);
    presenter?.postMessage({ type: "state", i }, "*");
  });

  const act = (key: string) => {
    switch (key) {
      case "ArrowRight": case "PageDown": case " ": case "Enter": engine.next(); break;
      case "ArrowLeft": case "PageUp": engine.prev(); break;
      case "Home": engine.home(); break;
      case "End": engine.end(); break;
      case "b": case "B": case ".": blank.hidden = !blank.hidden; break;
      case "0": engine.act(10); break;
      default: if (/^[1-9]$/.test(key)) engine.act(Number(key));
    }
  };

  let last = 0, lastKey = "";
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "f" || e.key === "F") { toggleFullscreen(); return; }
    if (e.key === "p" || e.key === "P") { presenter = open(location.pathname + "?presenter", "presenter", "width=1280,height=800"); return; }
    if (e.key === "r" || e.key === "R") { engine.replayCover(); return; }
    if (!NAV_KEYS.has(e.key)) return;
    e.preventDefault();
    if (e.repeat) return;                              // a held key never races through the talk
    const now = performance.now();
    if (e.key === lastKey && now - last < 150) return; // clicker bounce: the same key twice, too fast
    last = now; lastKey = e.key;
    act(e.key);
  });

  // The presenter window forwards the clicker when it has focus, and says hello so we can find it after a reload.
  addEventListener("message", (e) => {
    const m = e.data;
    if (m?.type === "hello") { presenter = e.source as Window; presenter.postMessage({ type: "state", i: engine.i }, "*"); }
    if (m?.type === "key" && typeof m.key === "string") act(m.key);
  });

  // Hide the cursor when it rests.
  let idle = 0;
  addEventListener("mousemove", () => {
    document.body.classList.remove("idle");
    clearTimeout(idle);
    idle = window.setTimeout(() => document.body.classList.add("idle"), 1500);
  });

  const start = Number(location.hash.slice(1)) || 0;
  engine.boot(start > 0 && start < BEATS.length ? start : 0);

  if (params.has("check")) runCheck(engine, t0);
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}
