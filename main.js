import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Facts for every test. Numbers and inputs come from the attempt records; do not edit by hand.
const PIECES = [
  {
    id: "ice-sheet",
    title: "Ice sheet",
    what: "A frozen windscreen on a winter morning. A gloved hand pushes the whole sheet of ice off in one piece and it bursts on the gravel. One still, one prompt, one continuous shot.",
    variants: [
      { label: "Take", kind: "take", src: "media/ice-sheet.mp4", poster: "media/ice-sheet.jpg", aspect: "16 / 9",
        slate: ["Wan 3.0", "5 s", "1080p", "1 still, GPT Image 2.5", "$1.00 list", "2026-09-30"] }
    ]
  },
  {
    id: "sozu-can",
    title: "Sozu, a spec ad",
    what: "A made-up yuzu ginger soda. The tab cracks on a frosted can and the cold comes off it in the back light. Performance ad product moment, sound from the model.",
    variants: [
      { label: "Take", kind: "take", src: "media/sozu-can.mp4", poster: "media/sozu-can.jpg", aspect: "16 / 9",
        slate: ["Wan 3.0", "5 s", "1080p", "1 still, GPT Image 2.5", "$1.00 list", "2026-09-30"] }
    ]
  },
  {
    id: "potter-avatar",
    title: "Potter, an AI presenter",
    what: "An original presenter, not a real person, in her workshop. One line to camera, lip sync and voice from the model, made to read as a real take.",
    variants: [
      { label: "Take", kind: "take", src: "media/potter-avatar.mp4", poster: "media/potter-avatar.jpg", aspect: "16 / 9",
        slate: ["Wan 3.0", "5 s", "1080p", "1 still, GPT Image 2.5", "$1.00 list", "2026-09-30"] }
    ]
  },
  {
    id: "course-video",
    title: "Course video pilot",
    what: "A programming lesson: a generated teacher in a fixed studio, cut against a rendered IDE that is never generated, all on one narration track with captions on the measured speech.",
    long: true,
    variants: [
      { label: "Lesson", kind: "take", src: "media/course-video-pilot.mp4", poster: "media/course-video-pilot.jpg", aspect: "16 / 9",
        slate: ["Generated teacher + rendered IDE", "2 min 39 s", "480p on this page"] }
    ]
  }
];

const EMAIL = "roxton05@gmail.com";

// Blender stage versions stay in the data but are not shown for now.
const TAKES = PIECES.map(p => ({ ...p, takes: p.variants.filter(v => v.kind !== "stage") }));
const byId = Object.fromEntries(TAKES.map(p => [p.id, p]));
// Costs stay in the data but are not shown to clients.
const shown = v => v.slate.filter(s => !/\blist$/.test(s));

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) root.classList.add("static");
const css = n => getComputedStyle(root).getPropertyValue(n).trim();
const INK = css("--ink"), REC = css("--rec");

// ---------------------------------------------------------------- split text into words and characters

function split(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  words.forEach((word, i) => {
    const w = document.createElement("span");
    w.className = "w";
    for (const ch of word) {
      const c = document.createElement("span");
      c.className = "c";
      c.textContent = ch;
      w.append(c);
    }
    el.append(w);
    if (i < words.length - 1) el.append(" ");
  });
  return [...el.querySelectorAll(".c")];
}

// ---------------------------------------------------------------- cards and the player

const cardsEl = document.getElementById("cards");
const cards = [];
for (const p of TAKES) {
  p.takes.forEach((v, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card";
    b.id = `card-${p.id}-${i}`;
    b.dataset.open = `${p.id}:${i}`;
    b.setAttribute("aria-label", `Watch ${p.title}, ${v.label}`);
    const img = document.createElement("img");
    img.src = v.poster;
    img.alt = "";
    const label = document.createElement("span");
    label.className = "card-label";
    const l = document.createElement("span");
    l.textContent = p.takes.length > 1 ? `${p.title}, ${v.label}` : p.title;
    const r = document.createElement("span");
    r.textContent = v.slate[0].length <= 14 ? v.slate[0] : "";
    label.append(l, r);
    b.append(img, label);
    if (matchMedia("(hover: hover)").matches && !p.long) {
      b.addEventListener("pointerenter", () => {
        let vid = b.querySelector("video");
        if (!vid) {
          vid = document.createElement("video");
          Object.assign(vid, { src: v.src, muted: true, loop: true, playsInline: true });
          b.append(vid);
        }
        vid.play().then(() => b.classList.add("playing")).catch(() => {});
      });
      b.addEventListener("pointerleave", () => {
        const vid = b.querySelector("video");
        if (vid) vid.pause();
        b.classList.remove("playing");
      });
    }
    cardsEl.append(b);
    cards.push(b);
  });
}

const dlg = document.getElementById("player");
const pv = document.getElementById("player-video");
const sw = document.getElementById("player-switch");
const slate = document.getElementById("player-slate");

function show(p, i) {
  const v = p.takes[i];
  pv.poster = v.poster;
  pv.src = v.src;
  pv.style.aspectRatio = v.aspect;
  slate.replaceChildren(...shown(v).map(s => Object.assign(document.createElement("span"), { textContent: s })));
  [...sw.children].forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
  pv.play().catch(() => {});
}

function open(id, i) {
  const p = byId[id];
  document.getElementById("player-title").textContent = p.title;
  document.getElementById("player-what").textContent = p.what;
  sw.replaceChildren();
  if (p.takes.length > 1) {
    p.takes.forEach((v, j) => {
      const b = document.createElement("button");
      b.type = "button";
      b.id = `player-v${j}`;
      b.textContent = v.label;
      b.addEventListener("click", () => show(p, j));
      sw.append(b);
    });
  }
  pv.muted = false;
  dlg.showModal();
  show(p, i);
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-open]");
  if (!t) return;
  const [id, i] = t.dataset.open.split(":");
  open(id, Number(i));
});
document.getElementById("player-close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => { pv.pause(); pv.removeAttribute("src"); pv.load(); });

// The answer panel is filled edge to edge with whole rows, none cut at the top
// or bottom: the row size starts from the display clamp in style.css, then
// stretches so a whole number of rows fits the panel height exactly. The rows
// run on their own clock, a little faster than the footer band, so the graphic
// is alive even when the page is not moving.
const flashRows = document.querySelector(".flash-rows");
const fillRows = () => {
  const panel = flashRows.parentElement, first = flashRows.firstElementChild;
  for (const row of flashRows.children) row.style.fontSize = "";
  const cs = getComputedStyle(first);
  const lh = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
  const n = Math.max(1, Math.round(panel.clientHeight / (parseFloat(cs.fontSize) * lh)));
  while (flashRows.children.length > n) flashRows.lastElementChild.remove();
  while (flashRows.children.length < n) flashRows.append(first.cloneNode(true));
  const size = panel.clientHeight / (n * lh) + "px";
  for (const row of flashRows.children) {
    row.style.fontSize = size;
    const span = row.firstElementChild;
    span.style.animationDuration = (span.scrollWidth / 2 / 70).toFixed(1) + "s";   // 70 px/s
  }
};
if (flashRows) {
  for (const span of flashRows.querySelectorAll(".flash-row span"))
    span.append(span.textContent);                    // a second copy to loop through
  fillRows();
  let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(fillRows, 150); });
}

// ---------------------------------------------------------------- marquee
// One group is cloned until the strip is wider than two screens, so the
// loop back to the start never shows a gap on a wide monitor.
const track = document.getElementById("track");
if (track) {
  const group = track.firstElementChild;
  const need = () => track.scrollWidth < innerWidth * 2 + group.offsetWidth;
  for (let i = 0; i < 20 && need(); i++) track.append(group.cloneNode(true));
  const half = track.children.length;
  for (let i = 0; i < half; i++) track.append(track.children[i].cloneNode(true));
  const perSecond = 52;                       // the speed it read at before, in px/s
  track.style.animationDuration = (track.scrollWidth / 2 / perSecond).toFixed(1) + "s";
}

// ---------------------------------------------------------------- email

const mail = document.getElementById("mail");
mail.href = "mailto:" + EMAIL;
mail.textContent = EMAIL;
const copyBtn = document.getElementById("copy-mail");
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copyBtn.textContent = "Copied";
  } catch {
    copyBtn.textContent = EMAIL;
  }
  setTimeout(() => { copyBtn.textContent = "Copy email"; }, 1800);
});


// ---------------------------------------------------------------- scroll choreography
// Every section is a .stage: one screen, stuck to the top of the viewport.
// The .hold after it is the scroll that screen owns. All ScrollTriggers hang
// off the holds, which are plain blocks in the flow, so their measurements are
// exact; a sticky element's own rect is not. Mapping, for a hold of height H
// sitting right under its stage:
//   "top bottom"    the stage has just locked to the viewport
//   "bottom bottom" the hold is spent, the next stage starts rising over it
const stages = [...document.querySelectorAll(".stage")];
const holds = Object.fromEntries([...document.querySelectorAll(".hold")].map(h => [h.dataset.hold, h]));
// A screen's own animation starts the moment it begins to arrive, one screen
// of scroll before it locks, so it is never sitting there empty.
const owns = (name, vars) => ({
  trigger: holds[name],
  start: name === "intro" ? "top bottom" : "top bottom+=100%",
  end: "bottom bottom",
  ...vars,
});

const wordChars = split(document.querySelector(".wordmark .split"));
split(document.querySelector(".tagline"));
const line1 = split(document.getElementById("line-1"));
const line2 = split(document.getElementById("line-2"));
const line3 = split(document.getElementById("line-3"));
const bigChars = split(document.querySelector(".explode .split"));
const readLines = [...document.querySelectorAll(".why .split, .steps .split")].map(el => {
  split(el);
  return [el, [...el.querySelectorAll(".w")]];   // word level: a tenth of the nodes, same read
});
const whyWords = readLines.filter(([el]) => el.closest(".why")).map(([, w]) => w);
const stepWords = readLines.filter(([el]) => el.closest(".steps")).map(([, w]) => w);
const stepItems = [...document.querySelectorAll(".steps li")];

// a sticky element's offsetTop is still its resting place in the document
const docTop = el => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };

if (reduce) {
  document.getElementById("intro-video").removeAttribute("autoplay");
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis carries the inertia. ScrollTrigger reads from it, so scrubbed
  // timelines move on the same eased value the page scrolls on.
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      // mid glide Lenis is locked and would drop the scrollTo, leaving jumping stuck on
      if (lenis.isLocked) return;
      jumping = true;
      releasePage();
      lenis.scrollTo(docTop(target), { onComplete: () => { jumping = false; } });
    });
  });
  let jumping = false;                        // a nav jump passes screens without being held

  // A screen can hold the page still while it plays. Lenis swallows the wheel;
  // keys, touch and the scrollbar scroll natively, so they are held here too.
  let heldAt = null;
  const holdPage = y => { heldAt = y; lenis.stop(); };
  const releasePage = () => { heldAt = null; lenis.start(); };
  addEventListener("scroll", () => { if (heldAt !== null && Math.abs(scrollY - heldAt) > 1) scrollTo(0, heldAt); });

  const scrollKeys = [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"];
  addEventListener("keydown", e => { if (lenis.isStopped && scrollKeys.includes(e.key)) e.preventDefault(); });
  addEventListener("touchmove", e => { if (lenis.isStopped) e.preventDefault(); }, { passive: false });

  // A screen arrives by being uncovered, not by sliding in. Its layout slot
  // rises through the viewport over one screen of scroll; we cancel that rise
  // with a linear transform so it stands still at the top, and open it from
  // the bottom edge instead. Its content is in its final place the whole time.
  stages.forEach((stage, i) => {
    if (i === 0) return;
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: stage.previousElementSibling,      // the hold before it
        start: "bottom bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true,
      },
    })
      .fromTo(stage, { y: () => -innerHeight }, { y: 0, duration: 1 }, 0)
      .fromTo(stage, { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.out" }, 0);
  });

  // Snap out of a handover. Inside a screen the scroll is free, so the
  // animation stays under your thumb; but the one screen of scroll where a
  // curtain is half open is not a place to stop, so a scroll that ends in
  // there settles onto the whole screen it was heading for.
  let overs = [];
  const measure = () => {
    overs = stages.slice(1).map(st => {
      const to = docTop(st);
      return { from: to - innerHeight, to };
    });
  };
  measure();
  ScrollTrigger.addEventListener("refresh", measure);

  let settle, snapping = false;
  const stopSnap = () => { snapping = false; clearTimeout(settle); };
  addEventListener("wheel", stopSnap, { passive: true });
  addEventListener("touchstart", stopSnap, { passive: true });
  addEventListener("keydown", stopSnap);

  // the last event of a scroll coming to rest often carries direction 0, so
  // keep the last real one or a stop on the way up reads as going down
  let heading = 1;
  lenis.on("scroll", ({ scroll, direction }) => {
    if (direction) heading = direction;
    if (snapping) return;
    clearTimeout(settle);
    settle = setTimeout(() => {
      const w = overs.find(o => scroll > o.from + 2 && scroll < o.to - 2);
      if (!w) return;
      const p = (scroll - w.from) / (w.to - w.from);
      // go the way the reader was already going, unless they barely moved
      const target = heading === -1 ? (p > 0.92 ? w.to : w.from) : (p < 0.08 ? w.from : w.to);
      snapping = true;
      lenis.scrollTo(target, {
        duration: 0.5, easing: t => 1 - Math.pow(1 - t, 3),
        onComplete: () => { snapping = false; },
      });
    }, 130);
  });

  // a screen that is fully covered stops painting
  stages.forEach((stage, i) => {
    const hold = stage.nextElementSibling;
    if (i === stages.length - 1 || !hold) return;
    ScrollTrigger.create({
      trigger: hold, start: "bottom top", end: "max",
      onToggle: self => stage.classList.toggle("gone", self.isActive),
    });
  });

  // A screen that plays itself: arriving is the only input. Committing to it
  // (the snap's 8%) starts its paused timeline and glides the page to the lock
  // over a fixed 0.5 s, holds the page while the timeline plays at its own
  // speed, and lets go on complete. Not held on a nav jump, a reload further
  // down, or once it has played. Reset only when fully covered on the way up.
  const playsItself = (name, tl) => {
    const stage = holds[name].previousElementSibling;
    // let go only of a hold this screen made: the banner can still be playing
    // unheld (after a reload further up) when How commits and holds
    let held = false;
    tl.eventCallback("onComplete", () => { if (held) { held = false; releasePage(); } });
    ScrollTrigger.create({
      trigger: holds[name], start: "top bottom+=92%", end: "bottom bottom",   // matches the snap threshold
      onEnter: () => {
        const lockY = docTop(stage);
        if (jumping || tl.progress() > 0 || scrollY >= lockY - 2) { tl.play(); return; }
        // it starts now, not at the lock: the glide is a fixed 0.5 s, so the
        // timing is the same at any scroll speed
        tl.play();
        stopSnap(); snapping = true;
        // a native jump (scrollbar, End key) can arrive here before Lenis has
        // caught up; gliding from its stale spot swept the page back up through
        // the banner and held it there
        lenis.scrollTo(scrollY, { immediate: true, force: true });
        lenis.scrollTo(lockY, {
          duration: 0.5, easing: t => 1 - Math.pow(1 - t, 3), lock: true, force: true,
          // a long stalled frame (a hidden tab) can finish the timeline before
          // the glide lands; holding then would never be released
          onComplete: () => { snapping = false; if (tl.progress() < 1) { held = true; holdPage(lockY); } },
        });
      },
    });
    // the reset waits until the screen is fully covered on the way back up;
    // at the 8% mark a strip of it still shows and the start state popped on it
    ScrollTrigger.create({
      trigger: holds[name], start: "top bottom+=100%",
      onLeaveBack: () => { tl.pause(0); if (held) { held = false; releasePage(); } },
    });
  };

  const mm = gsap.matchMedia();

  mm.add({ wide: "(min-width: 52.01rem)", narrow: "(max-width: 52rem)" }, ctx => {
    const { wide } = ctx.conditions;
    const rnd = gsap.utils.random;

    // 1. intro: the tile grows to full bleed, the name breaks apart.
    // It starts just under the tagline, measured, so no word sits on it at rest.
    // Growing over the name as it breaks apart is deliberate: the take speaks for itself.
    const box = document.querySelector(".intro-in").getBoundingClientRect();
    const tagBottom = document.querySelector(".tagline").getBoundingClientRect().bottom - box.top;
    const topPct = Math.min(62, (tagBottom / box.height) * 100 + 3);
    const side = wide ? 34 : 22;
    const startInset = `inset(${topPct.toFixed(2)}% ${side}% 5% ${side}%)`;
    gsap.set(".tile", { clipPath: startInset });
    gsap.timeline({ scrollTrigger: owns("intro", { scrub: 0.6 }) })
      .fromTo(".tile", { clipPath: startInset },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power1.inOut" }, 0)
      .fromTo("#intro-video", { scale: 1.35 }, { scale: 1, duration: 1, ease: "none" }, 0)
      .to(".tagline .w", { yPercent: -120, opacity: 0, stagger: 0.04, duration: 0.3 }, 0.3)
      .to(wordChars, {
        yPercent: () => rnd(-140, 140), xPercent: () => rnd(-60, 60), rotation: () => rnd(-50, 50), opacity: 0,
        stagger: { each: 0.035, from: "random" }, duration: 0.45, ease: "power2.in",
      }, 0.5)
      .to(".intro-foot", { opacity: 1, duration: 0.15 }, 0.9);

    // 2. dialogue: the scroll is the typewriter
    gsap.set([...line1, ...line2, ...line3], { opacity: 0.16 });
    gsap.timeline({ scrollTrigger: owns("talk", { scrub: 0.5 }) })
      .to(line1, { opacity: 1, stagger: 0.05, duration: 0.05, ease: "none" })
      .to(line2, { opacity: 1, stagger: 0.12, duration: 0.12, ease: "none" }, ">+0.35")
      .to(line3, { opacity: 1, stagger: 0.05, duration: 0.05, ease: "none" }, ">+0.35")
      .to({}, { duration: 0.4 });

    // 3. the answer panel opens, holds, then wipes away as the word and the
    // clips rise under it. One screen, so a fast flick cannot skip the panel
    // and land in the middle of the clips.
    // One spot per clip, four clips since 2026-09-30: one in each corner around the word.
    const SPOTS = wide
      ? [[-33, -26, -6], [33, -24, 5], [-31, 25, 5], [31, 27, -5]]
      : [[-24, -34, -5], [24, -31, 4], [-24, 27, 4], [24, 30, -4]];
    gsap.set(cards, { xPercent: -50, yPercent: -50, rotation: i => (i % 2 ? 1 : -1) * (2 + i), scale: 0.9 });

    gsap.set(bigChars, { opacity: 0 });
    const bars = [...document.querySelectorAll(".glitch i")];
    const cut = { duration: 0.05, ease: "steps(1)" };

    // The banner plays itself. You arrive on the work screen and it runs its
    // own length at its own speed: the rows swell, they drift while they slide
    // past each other, then the panel tears apart and the word lands. Scroll is
    // not the projector here. Only the fan out of the clips, after, is scrubbed.
    const G = 1.8;                                  // when the tear starts
    gsap.set(".flash-row span", { "--ty": "110%" });   // set outright: a staggered from state only reaches the first
    const banner = gsap.timeline({ paused: true })
      // the swell: each row's words rise into their own line, top to bottom,
      // then the full wall slides until the tear
      .to(".flash-row span", { "--ty": "0%", duration: 0.5, ease: "power3.out", stagger: { amount: 0.4 } }, 0)
      // the tear: hard one frame cuts, red bars ripping across, nothing eased
      .to(".panel", { x: 12, ...cut }, G)
      .to(".panel", { x: -16, ...cut }, G + 0.05)
      .to(".panel", { x: 5, ...cut }, G + 0.1)
      .to(".panel", { x: 0, ...cut }, G + 0.15)
      .fromTo(".flash-rows", { x: 0 }, { x: -34, ...cut }, G + 0.05)
      .to(".flash-rows", { x: 26, ...cut }, G + 0.1)
      .to(".flash-rows", { x: 0, ...cut }, G + 0.15)
      .fromTo(".panel", { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 54% 0%)", ...cut }, G + 0.15)
      .to(".panel", { clipPath: "inset(38% 0% 24% 0%)", ...cut }, G + 0.2)
      .to(".panel", { clipPath: "inset(72% 0% 6% 0%)", ...cut }, G + 0.25)
      .to(".panel", { clipPath: "inset(100% 0% 0% 0%)", ...cut }, G + 0.3)
      .fromTo(bars, { opacity: 0, x: 0 }, { opacity: 1, x: i => (i % 2 ? -22 : 18), ...cut, stagger: 0.05 }, G + 0.18)
      .to(bars, { opacity: 0, x: 0, ...cut, stagger: 0.05 }, G + 0.26)
      .fromTo(bars[1], { opacity: 0 }, { opacity: 1, ...cut }, G + 0.38)
      .to(bars[1], { opacity: 0, ...cut }, G + 0.43)
      // the word arrives off register, then settles
      .fromTo(bigChars, { yPercent: 90, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: { each: 0.045 } }, G + 0.25)
      .fromTo(".big-word", { x: -14 }, { x: 9, ...cut }, G + 0.3)
      .to(".big-word", { x: -5, ...cut }, G + 0.35)
      .to(".big-word", { x: 0, ...cut }, G + 0.4)
      // and the clips stack up under it and fan out, so the screen always
      // comes to rest finished, never on a pile of cards
      .from(cards, { yPercent: 80, opacity: 0, stagger: 0.03, duration: 0.4, ease: "power2.out" }, G + 0.65)
      .to(cards, {
        x: i => SPOTS[i % SPOTS.length][0] + "vw", y: i => SPOTS[i % SPOTS.length][1] + "vh",
        rotation: i => SPOTS[i % SPOTS.length][2], scale: 1, stagger: 0.05, duration: 0.9, ease: "power2.out",
      }, G + 0.95)
      .to(".explode-hint", { opacity: 1, duration: 0.3 }, G + 1.5);

    // Committing to the screen (the snap's 8%) glides it to the lock and holds
    // the page still while the banner plays at its own speed, then lets go. A
    // fast scroll cannot outrun it and a slow one does not watch it play behind
    // a half open curtain. A nav jump or a reload further down is not held.
    playsItself("work", banner);

    // The scroll owns almost nothing on this screen: the banner runs itself and
    // the clips are left sitting there to be clicked. It keeps a slow drift so
    // a moving scroll is never looking at a frozen frame.
    gsap.timeline({ scrollTrigger: owns("work", { scrub: 0.5 }) })
      .to({}, { duration: 0.5 })
      .to(cards, { scale: 1.05, duration: 1, ease: "none" })
      .to(".big-word", { scale: 1.06, duration: 1, ease: "none" }, "<");

    // 4. doors. Wide: three panels open out from a sliver. Narrow: they sit in
    // a row and the scroll walks along them, one door on screen at a time.
    // narrow starts at the lock, not the arrival, or the walk is a third done
    // by the time the screen locks and it lands between two doors
    const doors = gsap.timeline({ scrollTrigger: owns("make", {
      scrub: 0.6, invalidateOnRefresh: true, ...(wide ? {} : { start: "top bottom" }) }) });
    if (wide) {
      // the start state is set outright: a staggered from() here only hid the
      // first element, so the rest sat visible before the reveal on the first pass
      gsap.set(".door-text > *", { yPercent: 60, opacity: 0 });
      doors
        .fromTo(".door-media", { clipPath: "inset(0% 48% 0% 48%)" },
          { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.12, duration: 0.5, ease: "power2.out" }, 0)
        .to(".door-text > *", { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }, 0.2)
        .to({}, { duration: 0.4 });
    } else {
      const grid = document.querySelector(".door-grid");
      gsap.set(".door-media", { clipPath: "inset(0% 0% 0% 0%)" });
      const walk = () => Math.max(0, grid.scrollWidth - grid.parentElement.clientWidth);
      doors
        .to(grid, { x: () => -walk(), ease: "none", duration: 1 }, 0.1)
        .to({}, { duration: 0.15 });
    }

    // 5. why me: the words light up as they are read
    const why = gsap.timeline({ scrollTrigger: owns("why", { scrub: 0.5 }) });
    whyWords.forEach((words, i) => {
      gsap.set(words, { opacity: 0.16 });
      why.to(words, { opacity: 1, stagger: 0.05, duration: 0.05, ease: "none" }, i * 0.45);
    });
    why.to({}, { duration: 0.2 });

    // 6. the steps, one at a time. They play themselves like the banner: the
    // same reveal, as one paused timeline at a fixed HOW_S seconds from the
    // commit, with the page held while it plays.
    const HOW_S = 2.4;
    const how = gsap.timeline({ paused: true });
    gsap.set(stepItems, { opacity: 0, yPercent: 25 });   // set outright: a staggered from state only reaches the first
    stepItems.forEach((li, i) => {
      gsap.set(stepWords[i], { opacity: 0.16 });
      how.to(li, { opacity: 1, yPercent: 0, duration: 0.25, ease: "power2.out" }, i * 0.2)
        .to(stepWords[i], { opacity: 1, stagger: 0.04, duration: 0.04, ease: "none" }, i * 0.2 + 0.08);
    });
    how.duration(HOW_S);
    playsItself("how", how);
  });
}
