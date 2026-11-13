const SS = (() => { try { sessionStorage.setItem("_t", "1"); sessionStorage.removeItem("_t"); return sessionStorage; } catch (e) { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; } })();
/* =====================================================================
   CONFIG: fill these in with the clinic's real details
   ===================================================================== */
const CONFIG = {
  formEndpoint: "",       // optional: Formspree / Getform URL so bookings also arrive by email, e.g. "https://formspree.io/f/xxxx"
  phone: "",        // e.g. "+919876543210"  → turns on every Call button
  whatsapp: "",     // e.g. "919876543210"   → chat booking + WhatsApp button send here
  doctorPhoto: "",  // e.g. "dr-saini.jpg"   → photo on the swinging ID badge
  /* Online consultation via the Swoofi app */
  swoofiConsultUrl: "",   // link that opens Dr. Saini's consult page in the Swoofi app / website
  swoofiAppUrl: "",       // link to download the Swoofi app (Play Store / App Store / smart link)
  consultHours: [9, 21],  // vet is "online" between these hours, India time (9 AM – 9 PM)
  vetOnline: null,        // set true / false to force the status, or null to follow consultHours
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Divine+Pet+Clinic+Palam+Vihar+Pakhowal+Road+Ludhiana"
};
const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=72`;
const MIX = (id, r = 720) => `https://assets.mixkit.co/videos/${id}/${id}-${r}.mp4`;

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover:hover)").matches;
$("#yr") && ($("#yr").textContent = new Date().getFullYear());

function fallback(root = document) {
  $$(".cover img", root).forEach(img => {
    const f = () => img.closest(".cover").classList.add("failed");
    img.addEventListener("error", f); if (img.complete && !img.naturalWidth && img.getAttribute("src")) f();
  });
}
fallback();
function setVideo(v, id, poster) {
  v.poster = poster || ""; v.innerHTML = `<source src="${MIX(id)}" type="video/mp4"><source src="${MIX(id, 360)}" type="video/mp4">`; v.load(); v.play && v.play().catch(() => {});
}
function barcode(el, n) { let h = ""; for (let i = 0; i < n; i++) h += `<i style="width:${[1, 2, 3, 1, 4][Math.floor(Math.random() * 5)]}px;opacity:${Math.random() > .15 ? 1 : 0}"></i>`; el.innerHTML = h; }

/* config wiring */
$$("#mapLink, .js-map").forEach(a => a.href = CONFIG.mapsUrl);
$$(".js-call").forEach(a => { if (CONFIG.phone) a.href = "tel:" + CONFIG.phone; });
if (CONFIG.phone) $$(".js-phone").forEach(e => e.textContent = CONFIG.phone);
if (CONFIG.whatsapp && $("#mmWa")) { const m = $("#mmWa"); m.href = `https://wa.me/${CONFIG.whatsapp}`; m.target = "_blank"; }
if (CONFIG.whatsapp) { const w = $("#waFab"); w.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hi Divine Pet Clinic, I'd like to book a visit.")}`; w.target = "_blank"; w.rel = "noopener"; }
if (CONFIG.doctorPhoto && $("#docPh")) $("#docPh").innerHTML += `<img src="${CONFIG.doctorPhoto}" alt="Dr. Manjinder Saini">`;

/* split headline */
$$(".split").forEach(el => {
  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const fr = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return; if (/^\s+$/.test(w)) { fr.append(" "); return; }
        const wd = document.createElement("span"); wd.className = "wd";
        [...w].forEach(c => { const s = document.createElement("span"); s.className = "ch"; s.style.setProperty("--i", i++); s.textContent = c; wd.append(s); });
        fr.append(wd);
      });
      n.replaceWith(fr);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el);
});

/* ============ LOADER (first visit of the session only) ============ */
if (SS.getItem("dpcSeen") || !$("#loader")) { $("#loader") && $("#loader").remove(); document.body.classList.remove("loading"); requestAnimationFrame(() => document.body.classList.add("ready")); }
else (function () {
  SS.setItem("dpcSeen", "1");
  const L = $("#loader"), svg = $("#ecg"), P = $("#ecgP"), G = $("#ecgG"), Hd = $("#ecgH"), D = $("#ldD"), T = $("#ldT"), txt = $("#ldTxt");
  const W = innerWidth, H = innerHeight, S = Math.min(150, W * .34), s = S / 100, cx = W / 2, cy = H / 2 - 24;
  const X = x => cx + (x - 50) * s, Y = y => cy + (y - 52) * s;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const d = `M0 ${cy} H${X(28)} L${X(33)} ${Y(41)} L${X(39)} ${Y(63)} L${X(45)} ${Y(33)} L${X(50)} ${Y(52)} H${W}`;
  P.setAttribute("d", d); G.setAttribute("d", d);
  Object.assign(D.style, { left: X(0) + "px", top: Y(0) + "px", width: S + "px", height: S + "px" });
  T.style.top = (Y(100) + 26) + "px";
  const len = P.getTotalLength(); [P, G].forEach(p => { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
  const say = m => { if (txt.textContent === m) return; txt.classList.add("sw"); setTimeout(() => { txt.textContent = m; txt.classList.remove("sw"); }, 220); };
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const dur = reduce ? 1 : 1700, t0 = performance.now();
  (function f(t) {
    const r = clamp((t - t0) / dur), k = reduce ? 1 : ease(r), at = len * k, pt = P.getPointAtLength(at);
    [P, G].forEach(p => p.style.strokeDashoffset = len - at);
    Hd.setAttribute("cx", pt.x); Hd.setAttribute("cy", pt.y);
    D.style.clipPath = `inset(0 ${100 - clamp((pt.x - X(0)) / S) * 100}% 0 0)`;
    if (r > .5) say("HEART RATE · HAPPY");
    if (r < 1) return requestAnimationFrame(f);
    Hd.style.opacity = 0; say("ALL SYSTEMS PAWSOME ✓"); L.classList.add("beat");
    setTimeout(() => {
      L.classList.add("out"); document.body.classList.remove("loading");
      setTimeout(() => document.body.classList.add("ready"), 150);
      setTimeout(() => L.remove(), 1000);
    }, reduce ? 200 : 900);
  })(t0);
})();

/* ============ SMOOTH SCROLL + ANCHORS ============ */
let lenis = null;
if (typeof Lenis !== "undefined" && !reduce) { lenis = new Lenis({ lerp: .09 }); (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now()); }
/* ============ LINKS: smooth in-page scroll + page transitions ============ */
function goTo(el) { lenis ? lenis.scrollTo(el, { offset: -90, duration: 1.2 }) : el.scrollIntoView({ behavior: "smooth" }); }
const curtain = $("#curtain");
// page enter: slide the curtain away
if (curtain && document.body.classList.contains("page-enter")) {
  const out = () => { curtain.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: reduce ? 1 : 700, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }); document.body.classList.remove("page-enter"); };
  setTimeout(out, 80);
}
function bookingUrl(svc) { return "contact.html" + (svc ? "?service=" + encodeURIComponent(svc) : "") + "#book"; }
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
  const href = a.getAttribute("href");
  // "Book this" buttons carry a service
  if (a.dataset.svc && !$("#appt")) { e.preventDefault(); return leave(bookingUrl(a.dataset.svc)); }
  if (a.dataset.svc && $("#fsvc")) { $("#fsvc").value = a.dataset.svc; window.updatePass && updatePass(); }
  if (href.startsWith("#")) {
    if (href.length < 2) return; const el = $(href); if (!el) return;
    e.preventDefault(); document.body.classList.remove("menu-open"); goTo(el); history.replaceState(null, "", href); return;
  }
  let url = null; try { if (location.protocol !== "about:") url = new URL(href, location.href); } catch (err) { url = null; }
  if (!url) { if (/\.html/.test(href) && !href.startsWith("tel:")) { e.preventDefault(); leave(href); } return; }
  if (url.origin === location.origin && /\.html$|\/$/.test(url.pathname) && !href.startsWith("tel:")) {
    if (url.pathname === location.pathname && url.hash) { const el = $(url.hash); if (el) { e.preventDefault(); document.body.classList.remove("menu-open"); goTo(el); } return; }
    e.preventDefault(); leave(url.href);
  }
});
function leave(to) {
  document.body.classList.remove("menu-open");
  if (!curtain || reduce) { window.__previewNav ? window.__previewNav(to) : (location.href = to); return; }
  const name = (to.match(/(about|services|contact)\.html/) || [, "home"])[1];
  $("#curtainT").textContent = name[0].toUpperCase() + name.slice(1);
  curtain.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 500, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }).onfinish = () => { SS.setItem("dpcEnter", "1"); window.__previewNav ? window.__previewNav(to) : (location.href = to); };
}
addEventListener("pageshow", e => { if (e.persisted && curtain) curtain.animate([{ transform: "translateY(-100%)" }], { duration: 1, fill: "forwards" }); });
// arriving with #hash from another page
if (location.hash && $(location.hash)) setTimeout(() => goTo($(location.hash)), 900);
$("#burger").addEventListener("click", () => document.body.classList.toggle("menu-open"));

/* ============ PAW CURSOR + PRINTS ============ */
if (canHover) {
  const cur = $("#pawCur"); let mx = -100, my = -100, cx = -100, cy = -100, lx = null, ly = null, side = 1, ang = 0;
  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    if (lx === null) { lx = mx; ly = my; }
    const d = Math.hypot(mx - lx, my - ly);
    if (d > 70 && !reduce) {
      ang = Math.atan2(my - ly, mx - lx) * 180 / Math.PI + 90; side *= -1;
      const r = (ang) * Math.PI / 180, off = 9 * side;
      const p = document.createElement("div"); p.className = "print";
      p.innerHTML = '<svg viewBox="0 0 64 64" fill="currentColor"><use href="#paw"/></svg>';
      p.style.left = mx + Math.cos(r) * off + "px"; p.style.top = my + Math.sin(r) * off + "px";
      p.style.setProperty("--t", `rotate(${ang}deg)`); p.style.transform = `rotate(${ang}deg)`;
      document.body.append(p); setTimeout(() => p.remove(), 1400); lx = mx; ly = my;
    }
  });
  (function loop() { cx += (mx - cx) * .35; cy += (my - cy) * .35; cur.style.transform = `translate(${cx}px,${cy}px) rotate(${ang}deg)`; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover", e => cur.classList.toggle("big", !!e.target.closest("a,button,label,input,select,.med,[data-cursor],.badge")));
  $$(".magnetic").forEach(b => {
    b.addEventListener("mousemove", e => { const q = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - q.left - q.width / 2) * .2}px,${(e.clientY - q.top - q.height / 2) * .3}px)`; });
    b.addEventListener("mouseleave", () => b.style.transform = "");
  });
}

/* ============ HERO X-RAY SCANNER ============ */
const SCAN = {
  dog: { img: "1543466835-00a7907e9de1", huds: [[28, 18, "EARS", "clean ✓"], [44, 40, "EYES", "bright ✓"], [56, 58, "NOSE", "cool & wet ✓", 1], [40, 84, "COAT", "shiny ✓"]] },
  cat: { img: "1611843275167-a9bba9aa65dd", huds: [[30, 20, "EARS", "no mites ✓"], [44, 42, "EYES", "sparkly ✓"], [64, 60, "WHISKERS", "on point ✓", 1], [38, 84, "COAT", "glossy ✓"]] }
};
if ($("#scanner")) (function () {
  const screen = $("#screen"), x = $("#xray"), beam = $("#beam"), be1 = $("#be1"), be2 = $("#be2"), huds = $("#huds"), st = $("#scStatus");
  let pet = "dog", target = null, cur = .2, last = 0, down = false, seen = new Set();
  function load(p) {
    pet = p; seen.clear();
    const src = `https://images.unsplash.com/photo-${SCAN[p].img}?auto=format&fit=crop&w=1000&h=1100&q=75`;
    $("#scPhoto").src = src; $("#scX").src = src; screen.querySelector(".cover").classList.remove("failed");
    huds.innerHTML = SCAN[p].huds.map(h => `<div class="hud${h[4] ? " r" : ""}" data-x="${h[0]}" style="left:${h[0]}%;top:${h[1]}%"><i></i><span><b>${h[2]}</b> · ${h[3]}</span></div>`).join("");
    st.textContent = "SCANNING…";
  }
  $$("#scTog button").forEach(b => b.addEventListener("click", () => { $$("#scTog button").forEach(z => z.classList.remove("on")); b.classList.add("on"); load(b.dataset.p); }));
  load("dog"); fallback($("#scanner"));
  $("#scPhoto").addEventListener("error", () => screen.querySelector(".cover").classList.add("failed"));
  const setT = e => { const q = screen.getBoundingClientRect(); target = clamp((e.clientX - q.left) / q.width, 0, 1); last = performance.now(); };
  screen.addEventListener("pointermove", e => { if (canHover || down) setT(e); });
  screen.addEventListener("pointerdown", e => { down = true; setT(e); });
  addEventListener("pointerup", () => down = false);
  (function loop(t) {
    let g = target;
    if (g === null || t - last > 3200) g = .5 + .42 * Math.sin(t * .0006);
    cur += (g - cur) * .12;
    const w = screen.clientWidth, px = cur * w, band = Math.max(70, w * .17);
    x.style.clipPath = `inset(0 ${Math.max(0, w - px - band)}px 0 ${Math.max(0, px - band)}px)`;
    beam.style.left = px + "px"; be1.style.left = px - band + "px"; be2.style.left = px + band + "px";
    $$(".hud", huds).forEach(h => {
      const on = Math.abs(+h.dataset.x / 100 - cur) < band / w + .02;
      h.classList.toggle("on", on); if (on) { h.classList.add("seen"); seen.add(h.dataset.x); }
    });
    if (seen.size === SCAN[pet].huds.length) st.textContent = "HAPPY & HEALTHY ✓";
    $("#hr").textContent = Math.round(72 + 6 * Math.sin(t * .002));
    requestAnimationFrame(loop);
  })(0);
})();

/* ============ TICKERS ============ */
["t1", "t2"].forEach(id => { const r = $("#" + id); if (r) r.innerHTML = r.innerHTML.repeat(4); });
const tk = [{ el: $("#t1"), x: 0, dir: -1 }, { el: $("#t2"), x: 0, dir: 1 }].filter(t => t.el);

/* ============ WHO WE TREAT SWITCH ============ */
const TREAT = {
  dog: { t: "Dogs, from tiny pups to wise old souls.", p: "Indie dogs and pedigrees alike: from first vaccines to senior check-ups, we look after every stage.", vid: 1550, poster: U("1561037404-61cd46aa615b"),
    l: [["💉", "Vaccines & boosters"], ["🪱", "Deworming & ticks"], ["🦷", "Dental & skin care"], ["✂️", "Spay / neuter"], ["🩺", "Senior check-ups"], ["🏡", "Boarding"]],
    tip: "In Punjab's humid months, check your dog's ears and paws for ticks after every walk." },
  cat: { t: "Cats, handled the calm way.", p: "Quiet handling, patient exams and no rush, because cats deserve vets who truly understand them.", vid: 1535, poster: U("1536589961747-e239b2abbec2"),
    l: [["💉", "Vaccines & boosters"], ["🪱", "Deworming & fleas"], ["✂️", "Sterilisation"], ["🦷", "Dental checks"], ["🧪", "Senior screening"], ["🏡", "Boarding"]],
    tip: "Cats hide pain well. Eating less or hiding more is reason enough to call us." }
};
function renderTreat(k) {
  const d = TREAT[k];
  $("#tT").textContent = d.t; $("#tP").textContent = d.p; $("#tLbl").textContent = "● PATIENT: " + k.toUpperCase();
  $("#tL").innerHTML = d.l.map(i => `<div><span>${i[0]}</span>${i[1]}</div>`).join("");
  $("#tTip").innerHTML = `<b>Tip:</b>${d.tip}`;
  setVideo($("#tVid"), d.vid, d.poster);
}
function moveKnob(sw) { const on = $(".on", sw), k = $(".knob", sw); k.style.left = on.offsetLeft + "px"; k.style.width = on.offsetWidth + "px"; }
if ($("#sw")) (function () {
  const sw = $("#sw"), stage = $("#tstage");
  $$("button", sw).forEach(b => b.addEventListener("click", () => {
    if (b.classList.contains("on")) return;
    $$("button", sw).forEach(z => z.classList.remove("on")); b.classList.add("on"); moveKnob(sw);
    renderTreat(b.dataset.k);
    if (!reduce) { const bx = b.getBoundingClientRect(), sx = stage.getBoundingClientRect(); const ox = bx.left + bx.width / 2 - sx.left, oy = bx.top - sx.top;
      stage.animate([{ clipPath: `circle(0px at ${ox}px ${oy}px)` }, { clipPath: `circle(${Math.hypot(sx.width, sx.height) * 1.1}px at ${ox}px ${oy}px)` }], { duration: 900, easing: "cubic-bezier(.22,1,.36,1)" }); }
  }));
  renderTreat("dog"); moveKnob(sw); addEventListener("resize", () => moveKnob(sw)); document.fonts && document.fonts.ready.then(() => moveKnob(sw));
})();

/* ============ VACCINE CALCULATOR ============ */
const VX = {
  dog: [[6, "First core vaccine", "Distemper, parvovirus & more"], [9, "Core booster", "Second protective dose"], [12, "Anti-rabies + core booster", "First rabies shot"], [16, "Final puppy booster", "If advised by the vet"], [52, "Annual boosters", "Plus a full health check"]],
  cat: [[8, "First core vaccine", "Panleukopenia, herpes & calici"], [12, "Core booster + anti-rabies", "Second dose & first rabies shot"], [16, "Final kitten booster", "If advised by the vet"], [52, "Annual boosters", "Plus a wellness exam"]]
};
if ($("#vBirth")) (function () {
  let sp = "dog"; const bi = $("#vBirth"), today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  bi.max = iso(today); bi.value = iso(new Date(today.getTime() - 7 * 7 * 864e5));
  function calc() {
    if (!bi.value) return;
    const b = new Date(bi.value + "T00:00"); let next = null;
    $("#vtl").innerHTML = VX[sp].map((r, i) => {
      const d = new Date(b.getTime() + r[0] * 7 * 864e5), diff = Math.round((d - today) / 864e5);
      let cls = "", tag = "UPCOMING";
      if (diff < 0) { cls = "past"; tag = "PAST DATE · ASK US"; } else if (diff <= 14) { cls = "soon"; tag = diff === 0 ? "DUE TODAY" : "DUE SOON"; }
      if (diff >= 0 && !next) next = { r, diff };
      return `<li class="${cls}" style="--d:${i * .1}s"><span class="dot"></span><div><b>${r[1]}</b><span>${r[0] < 52 ? r[0] + " weeks old" : "1 year old"} · ${r[2]}</span></div><div class="when">${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<em>${tag}</em></div></li>`;
    }).join("");
    if (next) { $("#vnT").textContent = next.r[1]; $("#vnD").textContent = next.diff; $("#vnU").textContent = next.diff === 1 ? "DAY TO GO" : "DAYS TO GO"; }
    else { $("#vnT").textContent = "First year complete"; $("#vnD").textContent = "✓"; $("#vnU").textContent = "BOOK THE YEARLY CHECK-UP"; }
  }
  $$(".vctl .chip").forEach(c => c.addEventListener("click", () => { $$(".vctl .chip").forEach(z => z.classList.remove("on")); c.classList.add("on"); sp = c.dataset.v; calc(); }));
  bi.addEventListener("change", calc); calc();
})();

/* ============ PHARMACY FILTER ============ */
$$("#filters button").forEach(b => b.addEventListener("click", () => {
  $$("#filters button").forEach(z => z.classList.remove("on")); b.classList.add("on"); let n = 0;
  $$(".med").forEach(m => { const s = b.dataset.f === "all" || m.dataset.c === b.dataset.f; m.classList.toggle("hide", !s);
    if (s && !reduce) m.animate([{ opacity: 0, transform: "translateY(24px) rotate(-2deg)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: n++ * 50, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }); });
}));

/* ============ SWINGING ID BADGE (pendulum physics) ============ */
$("#bcode") && barcode($("#bcode"), 40);
const pend = { th: reduce ? 0 : .5, om: 0, drag: false };
if ($("#swing")) (function () {
  const sw = $("#swing"), badge = $("#badge"), stage = $("#lstage"); let lastTh = 0, lastT = 0;
  badge.addEventListener("pointerdown", e => { pend.drag = true; badge.classList.add("grab"); badge.setPointerCapture(e.pointerId); lastT = performance.now(); lastTh = pend.th; });
  badge.addEventListener("pointermove", e => {
    if (!pend.drag) return; const r = stage.getBoundingClientRect(); const ax = r.left + r.width / 2, ay = r.top + 6;
    const th = clamp(-Math.atan2(e.clientX - ax, Math.max(40, e.clientY - ay)), -1.3, 1.3), now = performance.now();
    pend.om = (th - lastTh) / Math.max(.008, (now - lastT) / 1000); lastTh = th; lastT = now; pend.th = th;
  });
  const up = () => { if (!pend.drag) return; pend.drag = false; badge.classList.remove("grab"); pend.om = clamp(pend.om, -8, 8); };
  badge.addEventListener("pointerup", up); badge.addEventListener("pointercancel", up);
  let pt = performance.now();
  (function loop(t) {
    const dt = Math.min(.033, (t - pt) / 1000); pt = t;
    if (!pend.drag) { pend.om += (-9 * Math.sin(pend.th) - 1.1 * pend.om) * dt; pend.th += pend.om * dt; }
    sw.style.transform = `rotate(${pend.th}rad)`; requestAnimationFrame(loop);
  })(pt);
})();

/* ============ INFINITE DRAG CANVAS ============ */
if ($("#canvas")) (function () {
  const items = [
    ["1769072532894-d0a4ad06d415", "sunshine pup ☀"], ["1498100152307-ce63fd6c5424", "dressed for the vet"], ["v:45843:1530281700549-e82e7bf110d6", "zoomies!"],
    ["1533738363-b7f9aef128ce", "too cool for fever"], ["1534361960057-19889db9621e", "first shots ✓"], ["1573865526739-10659fec78a5", "purr-fectly fine"],
    ["1530281700549-e82e7bf110d6", "back to full speed"], ["1560114928-40f1f1eb26a0", "tiny & brave"], ["1552053831-71594a27632d", "flowers for the doc"],
    ["v:1779:1592194996308-7b43878e84a6", "playtime"], ["1518717758536-85ae29035b6d", "good boy, officially"], ["1574144611937-0df059b5ef3e", "kitten check ✓"],
    ["1587300003388-59208cc962cb", "fluffy & fit"], ["1536589961747-e239b2abbec2", "calm patient"], ["1548199973-03cce0bbc87b", "best buddies"],
    ["1583795128727-6ec3642408f8", "nap after shots"], ["1543466835-00a7907e9de1", "all smiles"], ["1561948955-570b270e7c36", "snow-white kitten"],
    ["1517849845537-4d257902454a", "pug life"], ["1596854372745-0906a0593bca", "hello friend"], ["1654895716780-b4664497420d", "safe in arms"]
  ];
  const cv = $("#canvas"), COLS = 7, ROWS = 3, CW = 320, CH = 420;
  const W = COLS * CW, H = ROWS * CH; const tiles = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const it = items[(r * COLS + c) % items.length], el = document.createElement("div"); el.className = "tile";
    if (it[0].startsWith("v:")) { const [, vid, po] = it[0].split(":"); el.dataset.video = MIX(vid);
      el.innerHTML = `<span class="vb">▶ VIDEO</span><div class="cover"><video muted loop playsinline autoplay preload="metadata" poster="${U(po)}"><source src="${MIX(vid)}" type="video/mp4"><source src="${MIX(vid, 360)}" type="video/mp4"></video></div><div class="cap">${it[1]}</div>`; }
    else { el.dataset.img = it[0]; el.innerHTML = `<div class="cover"><img src="${U(it[0])}" alt="${it[1]}" loading="lazy"></div><div class="cap">${it[1]}</div>`; }
    cv.append(el); tiles.push({ el, c, r, oy: (c % 2) * 120 });
  }
  fallback(cv);
  let ox = -200, oy = -80, vx = -.35, vy = 0, drag = false, sx, sy, lx, ly, moved = false, idle = 0;
  cv.addEventListener("pointerdown", e => { drag = true; moved = false; sx = lx = e.clientX; sy = ly = e.clientY; cv.setPointerCapture(e.pointerId); cv.classList.add("grab"); vx = vy = 0; });
  cv.addEventListener("pointermove", e => { if (!drag) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; ox += dx; oy += dy; vx = dx; vy = dy; if (Math.hypot(e.clientX - sx, e.clientY - sy) > 6) moved = true; });
  cv.addEventListener("pointerup", e => {
    drag = false; cv.classList.remove("grab"); idle = performance.now();
    if (!moved) { const t = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList && n.classList.contains("tile")); if (t) {
      if (t.dataset.video) openLB(`<video src="${t.dataset.video}" controls autoplay playsinline></video>`);
      else if (!$(".cover", t).classList.contains("failed")) openLB(`<img src="${U(t.dataset.img).replace("w=900", "w=1600")}" alt="">`); } }
  });
  const mod = (a, n) => ((a % n) + n) % n;
  (function loop(t) {
    if (!drag) { vx *= .94; vy *= .94; if (Math.abs(vx) < .3 && Math.abs(vy) < .3 && t - idle > 1500 && !reduce) { vx = -.35; } ox += vx; oy += vy; }
    tiles.forEach(o => { const x = mod(o.c * CW + ox, W) - CW, y = mod(o.r * CH + o.oy + oy, H) - CH; o.el.style.transform = `translate3d(${x}px,${y}px,0)`; });
    requestAnimationFrame(loop);
  })(0);
})();

/* ============ SERVICE EXPLORER ============ */
const SVX = [{"name": "General Check-ups", "h": "General <span class='it'>Check-ups</span>", "ref": "CONSULT", "img": "1770836037793-95bdbf190f71", "svc": "General check-up", "ic": "🩺", "intro": "Catch problems early. Keep them thriving.", "dark": false, "pts": [["🩺", "Full body exam", "Eyes, ears, teeth, skin & coat."], ["⚖️", "Weight & growth", "Healthy weight, steady growth."], ["❤️", "Heart & breathing", "Heartbeat and vital signs."], ["🍽️", "Digestion", "Appetite, tummy & bowel issues."], ["🔍", "Early detection", "Infections & allergies, caught early."], ["🥗", "Care advice", "Diet, exercise & hygiene tips."]]}, {"name": "Vaccinations", "h": "Vaccina<span class='it'>tions</span>", "ref": "PREVENTIVE", "img": "1770836037275-38b44e4b101f", "svc": "Vaccination", "ic": "💉", "intro": "Protection from serious, preventable diseases.", "dark": false, "pts": [["🛡️", "Core vaccines", "Rabies, distemper, parvovirus."], ["🧭", "Lifestyle vaccines", "Based on your pet's risks."], ["🐾", "Puppy & kitten", "Age-right schedules."], ["💉", "Boosters", "On-time follow-up doses."], ["📋", "Records", "Every dose tracked."], ["🩺", "Health check first", "Checked before every shot."]]}, {"name": "Deworming & Tick Care", "h": "Deworming & <span class='it'>Tick Care</span>", "ref": "PARASITES", "img": "1503256207526-0d5d80fa2f47", "svc": "Deworming / tick control", "ic": "🪱", "intro": "Freedom from worms, ticks and fleas.", "dark": false, "pts": [["🪱", "Deworming", "Round, hook & tapeworms."], ["🕷️", "Tick prevention", "Stops tick-borne disease."], ["🧴", "Flea control", "No more itching."], ["✨", "Skin & coat check", "Redness, hair loss, irritation."], ["💊", "Prevention plans", "Oral or topical options."], ["📅", "Regular schedule", "The right intervals."]]}, {"name": "Surgery & Sterilisation", "h": "Surgery & <span class='it'>Sterilisation</span>", "ref": "SURGERY", "img": "1770836037289-e00e5f351d11", "svc": "Surgery / sterilisation", "ic": "🏥", "intro": "Safe procedures. Careful recovery.", "dark": false, "pts": [["♀️", "Spaying", "Sterilisation for females."], ["♂️", "Neutering", "Sterilisation for males."], ["🩹", "Wound repair", "Cleaned, stitched, healed."], ["🔬", "Lump removal", "Checked and safely removed."], ["📈", "Anaesthesia care", "Monitored throughout."], ["🛏️", "Post-op care", "Recovery & follow-ups."]]}, {"name": "Emergency Care 24×7", "h": "Emergency Care <span class='it'>24×7</span>", "ref": "EMERGENCY · ANY HOUR", "img": "1644675272883-0c4d582528d8", "svc": "Emergency", "ic": "🚑", "intro": "Sudden illness or accident? Come in, any hour.", "dark": true, "pts": [["🚑", "Accidents", "Wounds, falls, fractures."], ["☠️", "Poisoning", "Swallowed something harmful."], ["🫁", "Breathing trouble", "Urgent respiratory care."], ["⚡", "Seizures & collapse", "Immediate assessment."], ["🩸", "Bleeding", "Fast wound control."], ["📈", "Critical care", "Close monitoring."]]}, {"name": "Lab & Diagnostics", "h": "Lab & <span class='it'>Diagnostics</span>", "ref": "DIAGNOSTICS", "img": "1770836037816-4445dbd449fd", "svc": "Lab tests", "ic": "🔬", "intro": "Find the cause. Treat it right.", "dark": false, "pts": [["🩸", "Blood tests", "Counts, organs, infection."], ["🧪", "Urine tests", "Kidney & urinary health."], ["🧫", "Stool tests", "Parasites & digestion."], ["🦴", "X-ray", "Bones, joints & chest."], ["📡", "Ultrasound", "Organs & pregnancy."], ["🔬", "Biopsy", "Lumps and growths."]]}, {"name": "Pet Boarding", "h": "Pet <span class='it'>Boarding</span>", "ref": "BOARDING", "img": "1649609152484-970b013af72a", "svc": "Pet boarding", "ic": "🏠", "intro": "A safe, loving stay while you're away.", "dark": false, "pts": [["🏠", "Comfy stay", "Clean, quiet spaces."], ["🍲", "Regular meals", "Their usual diet & routine."], ["🎾", "Play time", "Daily, supervised exercise."], ["🧼", "Hygiene", "Cleaned every day."], ["💊", "Medicines", "Given on schedule."], ["👀", "Health watch", "Checked throughout the stay."]]}, {"name": "Puppy & Kitten Care", "h": "Puppy & Kitten <span class='it'>Care</span>", "ref": "LITTLE ONES", "img": "1574144611937-0df059b5ef3e", "svc": "Puppy / kitten care", "ic": "🐾", "intro": "The right start for a healthy life.", "dark": false, "pts": [["🩺", "First check-up", "A full head-to-tail exam."], ["💉", "Vaccine plan", "Shots at the right age."], ["🪱", "Deworming", "Protection from day one."], ["🥣", "Nutrition", "What & how often to feed."], ["🎓", "Behaviour", "Socialising & early training."], ["🛁", "Grooming", "Baths, nails & ears."]]}];
if ($("#orbit")) (function () {
  const SHORT = ["Check-ups", "Vaccines", "Deworming", "Surgery", "Emergency", "Lab tests", "Boarding", "Puppy & Kitten"];
  const orbit = $("#orbit"), wrap = $("#orbPlanets"), line = $("#orbLine"), txt = $("#orbTxt"), img = $("#orbImg"), book = $("#orbBook");
  wrap.innerHTML = SVX.map((s, i) => `<button class="planet${s.dark ? " urgent" : ""}" data-i="${i}" aria-label="${s.name}"><span class="bub">${s.ic}</span><span class="lb">${SHORT[i]}</span></button>`).join("");
  const planets = $$(".planet", wrap); let sel = -1, hover = false, ang = -Math.PI / 2, speed = .0012;
  function select(i) {
    if (i === sel) return; sel = i; const s = SVX[i];
    planets.forEach((p, k) => p.classList.toggle("on", k === i)); orbit.classList.add("has-sel");
    img.style.opacity = 0;
    setTimeout(() => { img.closest(".cover").classList.remove("failed"); img.src = U(s.img); img.alt = s.name; img.style.opacity = ""; }, 220);
    $("#orbK").textContent = s.dark ? "OPEN 24 × 7" : "SERVICE 0" + (i + 1);
    $("#orbH").innerHTML = s.h; $("#orbP").textContent = s.intro;
    $("#orbIcons").innerHTML = s.pts.map((p, n) => `<span style="--n:${n}" data-t="${p[1]}" title="${p[1]}">${p[0]}</span>`).join("");
    book.hidden = false; book.textContent = s.dark ? "Call / book now →" : "Book this →"; book.dataset.svc = s.svc;
    txt.classList.remove("swap"); void txt.offsetWidth; txt.classList.add("swap");
  }
  img.addEventListener("error", () => img.closest(".cover").classList.add("failed"));
  planets.forEach((p, i) => {
    p.addEventListener("mouseenter", () => { hover = true; if (canHover) select(i); });
    p.addEventListener("mouseleave", () => hover = false);
    p.addEventListener("click", () => select(i)); p.addEventListener("focus", () => select(i));
  });
  
  let spin = 0, lastSY = scrollY;
  (function loop() {
    const w = orbit.clientWidth, R = w * .42, c = w / 2;
    const dy = scrollY - lastSY; lastSY = scrollY; spin += (dy * .0006 - spin) * .1;
    if (!reduce && !hover) ang += speed + spin;
    planets.forEach((p, i) => {
      const a = ang + i * Math.PI * 2 / planets.length, x = c + R * Math.cos(a), y = c + R * Math.sin(a);
      p.style.transform = `translate(${x}px,${y}px)`;
      if (i === sel) { line.setAttribute("x2", 50 + 42 * Math.cos(a)); line.setAttribute("y2", 50 + 42 * Math.sin(a)); }
    });
    requestAnimationFrame(loop);
  })();
})();

/* pharmacy bento: icon follows the cursor */
$$(".bt").forEach(t => {
  t.addEventListener("pointermove", e => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5) * 2); t.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5) * 2); });
  t.addEventListener("pointerleave", () => { t.style.setProperty("--mx", 0); t.style.setProperty("--my", 0); });
});
/* ============ VET ONLINE STATUS (badge + consult section) ============ */
(function () {
  const fmtH = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60), am = hh < 12 || hh === 24; return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${am ? "AM" : "PM"}`; };
  function online() {
    if (CONFIG.vetOnline === true || CONFIG.vetOnline === false) return CONFIG.vetOnline;
    const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })), h = ist.getHours() + ist.getMinutes() / 60;
    const [a, b] = CONFIG.consultHours; return a <= b ? h >= a && h < b : h >= a || h < b;
  }
  const consultUrl = CONFIG.swoofiConsultUrl, appUrl = CONFIG.swoofiAppUrl;
  if (appUrl && $("#cApp")) { const a = $("#cApp"); a.href = appUrl; a.target = "_blank"; a.rel = "noopener"; }
  let secs = 0;
  const T = (sel, fn) => { const el = $(sel); if (el) fn(el); };
  function apply() {
    const on = online(), back = fmtH(CONFIG.consultHours[0]);
    const book = "contact.html#book", consultLocal = $("#consult") ? "#consult" : "services.html#consult";
    T("#vbadge", b => { b.classList.toggle("off", !on); $(".vt", b).textContent = on ? "Vet online" : "Vet offline"; $(".vc", b).textContent = on ? "Consult now" : "Book later"; b.href = on ? (consultUrl || consultLocal) : book; if (on && consultUrl) { b.target = "_blank"; b.rel = "noopener"; } else b.removeAttribute("target"); });
    T(".cstatus", c => { c.classList.toggle("off", !on); $(".cs-t", c).textContent = on ? "Dr. Saini is online now" : `Dr. Saini is offline · back at ${back}`; });
    T("#cMain", m => { m.classList.toggle("off", !on); $(".cm-t", m).textContent = on ? "🎥 Consult now on Swoofi" : "📅 Book for later"; m.href = on ? (consultUrl || appUrl || book) : book; if (on && (consultUrl || appUrl)) { m.target = "_blank"; m.rel = "noopener"; } else m.removeAttribute("target"); });
    T("#mmLive", m => { m.classList.toggle("off", !on); $("b", m).textContent = on ? "Vet online now" : "Vet offline"; $("small", m).textContent = on ? "Video consult · replies in minutes" : `Back at ${back} · book a visit instead`; m.setAttribute("href", on ? consultLocal : book); });
    T("#tbConsult", tb => { tb.classList.toggle("off", !on); $("em", tb).textContent = on ? "Consult" : "Book later"; tb.setAttribute("href", on ? consultLocal : book); });
    T(".vphone", v => { v.classList.toggle("off", !on); $(".vo-t").textContent = `Back online at ${back}`; $(".vl-t").textContent = on ? "LIVE" : "AWAY"; });
  }
  apply(); setInterval(apply, 60000);
  if ($("#vtime")) setInterval(() => { secs++; $("#vtime").textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`; }, 1000);
})();

/* lightbox */
const lb = $("#lb"), lbf = $("#lbFr");
if (!lb) window.openLB = () => {};
function openLB(h) { lbf.innerHTML = h; lb.classList.add("on"); lenis && lenis.stop(); }
function closeLB() { lb.classList.remove("on"); lenis && lenis.start(); setTimeout(() => lbf.innerHTML = "", 450); }
lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".x")) closeLB(); });
addEventListener("keydown", e => e.key === "Escape" && closeLB());

/* FAQ */
$$(".qa button").forEach(b => b.addEventListener("click", () => { const q = b.parentElement, w = q.classList.contains("is-open"); $$(".qa").forEach(z => { z.classList.remove("is-open"); $("button", z).setAttribute("aria-expanded", "false"); }); if (!w) { q.classList.add("is-open"); b.setAttribute("aria-expanded", "true"); } }));

/* ============ CHAT BOOKING + LIVE PASS ============ */

const EMO = { Dog: "🐶", Cat: "🐱" };
let lastPet = "";
function updatePass() {
  const form = $("#appt"); if (!form) return;
  const pet = (form.querySelector("[name=pet]:checked") || {}).value || "Dog", d = $("#fdate").value;
  $("#pName").textContent = $("#fpet").value.trim() || "Your pet";
  $("#pParent").textContent = $("#fname").value.trim() || "—";
  $("#pType").textContent = pet; $("#pSvc").textContent = $("#fsvc").value || "—";
  $("#pDate").textContent = d ? new Date(d + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Any day";
  if (pet !== lastPet) { const e = $("#pEmo"); e.textContent = EMO[pet]; e.classList.remove("pop"); void e.offsetWidth; e.classList.add("pop"); lastPet = pet; }
}
if ($("#appt")) (function () {
  const form = $("#appt"), dateIn = $("#fdate");
  $("#pid").textContent = "DPC-" + Math.floor(1000 + Math.random() * 9000); barcode($("#pbc"), 46);
  const td = new Date(); dateIn.min = new Date(td.getTime() - td.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const qs = new URLSearchParams(location.search).get("service"); if (qs) $("#fsvc").value = qs;
  form.addEventListener("input", updatePass); form.addEventListener("change", updatePass); updatePass();
  const setErr = (el, bad) => el.closest(".f").classList.toggle("err", bad);
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#fname"), phone = $("#fphone"), svc = $("#fsvc");
    const digits = phone.value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    const checks = [[name, name.value.trim().length < 2], [phone, !/^[6-9]\d{9}$/.test(digits)], [svc, !svc.value], [dateIn, !!dateIn.value && dateIn.value < dateIn.min]];
    checks.forEach(([el, bad]) => setErr(el, bad));
    const bad = checks.find(c => c[1]);
    if (bad) { bad[0].focus(); form.animate([{ transform: "none" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "none" }], { duration: 360 }); return; }
    const d = Object.fromEntries(new FormData(form));
    const pass = $("#pass"); pass.classList.remove("done"); void pass.offsetWidth; pass.classList.add("done"); burst(pass);
    $("#subTxt").textContent = "Request sent ✓"; $("#after").classList.add("on");
    if (CONFIG.whatsapp) {
      const text = `🐾 Appointment request (${$("#pid").textContent})\nName: ${d.name}\nPhone: ${digits}\nPet: ${d.pet}${d.petname ? " (" + d.petname + ")" : ""}\nService: ${d.service}\nDate: ${$("#pDate").textContent}\nNotes: ${d.message || "-"}`;
      setTimeout(() => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank"), 900);
    }
    if (CONFIG.formEndpoint) {
      $("#formStatus").textContent = "Sending…";
      fetch(CONFIG.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(r => $("#formStatus").textContent = r.ok ? "✓ Sent to the clinic. We'll call you soon." : "Couldn't send. Please call or WhatsApp us.")
        .catch(() => $("#formStatus").textContent = "Couldn't send. Please call or WhatsApp us.");
    }
    if (innerWidth <= 980) goTo(pass);
  });
  $$("input,select", form).forEach(el => el.addEventListener("input", () => el.closest(".f") && setErr(el, false)));
  $("#again").addEventListener("click", e => { $("#formStatus").textContent = ""; e.preventDefault(); form.reset(); $("#pass").classList.remove("done"); $("#subTxt").textContent = "Request appointment"; $("#after").classList.remove("on"); updatePass(); });
})();
function burst(host) {
  if (reduce) return; const r = host.getBoundingClientRect(), cols = ["#7BBFC1", "#00898C", "#006D70", "#004E53"];
  for (let i = 0; i < 22; i++) {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "svg"); p.setAttribute("viewBox", "0 0 64 64"); p.innerHTML = '<use href="#paw"/>';
    const s = 14 + Math.random() * 16; Object.assign(p.style, { position: "fixed", left: r.left + r.width / 2 + "px", top: r.top + r.height * .44 + "px", width: s + "px", height: s + "px", fill: cols[i % 4], zIndex: 400, pointerEvents: "none" });
    document.body.append(p); const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 220;
    p.animate([{ transform: "translate(-50%,-50%) scale(.2)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d + 60}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 0 }], { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = () => p.remove();
  }
}

/* ============ FOOTER: "Divine Pets" reveal, halo, walking paws ============ */
(function () {
  const ft = $("#foot"), g = $("#ftGiant"); if (!ft || !g) return;
  let n = 0;
  $$(".w1,.w2", g).forEach(w => { w.innerHTML = `<span class="wd">${[...w.textContent].map(c => `<span class="ch" style="--i:${n++}">${c}</span>`).join("")}</span>`; });
  const halo = $("#ftHalo");
  function placeHalo() {
    const i = $$(".w1 .ch", g)[1]; if (!i) return;
    let x = 0, y = 0, el = i; while (el && el !== g) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    halo.style.left = (x + i.offsetWidth * .72 - halo.offsetWidth / 2) + "px"; halo.style.top = (y - halo.offsetHeight * .2) + "px";
  }
  addEventListener("resize", placeHalo); document.fonts && document.fonts.ready.then(placeHalo); setTimeout(placeHalo, 1500);
  const paws = $("#ftPaws"); let timer = null, step = 0, side = 1, row = 0;
  function walk() {
    const w = ft.clientWidth, h = ft.clientHeight, x = (step * 70) % (w + 140) - 70; if (x < 0) row = Math.random();
    side *= -1; const p = document.createElement("i"); p.className = "fpaw";
    p.innerHTML = '<svg viewBox="0 0 64 64" fill="currentColor"><use href="#paw"/></svg>';
    p.style.left = x + "px"; p.style.top = (h * (.25 + row * .5) + side * 12 - x * .08) + "px"; p.style.transform = "rotate(80deg)";
    paws.append(p); setTimeout(() => p.remove(), 3600); step++;
  }
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { ft.classList.add("in"); placeHalo(); if (!reduce && !timer) timer = setInterval(walk, 420); }
    else if (timer) { clearInterval(timer); timer = null; }
  }), { threshold: .15 }).observe(ft);
})();

/* services: stagger the "what's included" points */
$$("#stack .pts li:not(.pts-h)").forEach(li => li.style.setProperty("--n", [...li.parentNode.children].indexOf(li)));
const cio2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("seen"); cio2.unobserve(e.target); } }), { threshold: .15 });
$$("#stack .card").forEach(c => cio2.observe(c));
/* reveals */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
$$("[data-reveal]").forEach(el => io.observe(el));

/* ============ MAIN SCROLL LOOP ============ */
const halfL = $("#halfL"), halfR = $("#halfR"), about = $("#story"), aC = $("#aboutCenter"), aCue = $("#aCue");
const cards = $$("#stack .card"), jr = $("#journey"), msgs = $$("#msgs .msg"), jsteps = $$("#jsteps .jstep"), typingEl = $("#typing");
let lastY = scrollY, vel = 0, navHidden = false;
(function frame() {
  const y = scrollY, vh = innerHeight, dy = y - lastY; lastY = y; vel += (dy - vel) * .12;
  $("#prog") && ($("#prog").style.transform = `scaleX(${clamp(y / (document.documentElement.scrollHeight - vh))})`);
  const nav = $("#nav"), hide = dy > 2 && y > 700 && !document.body.classList.contains("menu-open");
  if (Math.abs(dy) > 2 && hide !== navHidden) { nav.classList.toggle("hide", hide); navHidden = hide; }

  tk.forEach(t => { t.x += t.dir * (.6 + Math.abs(vel) * .25); const w = t.el.scrollWidth / 4; if (t.x < -w) t.x += w; if (t.x > 0) t.x -= w; t.el.style.transform = `translateX(${t.x}px) skewX(${clamp(-vel * .25, -12, 12)}deg)`; });

  // about: dog & cat slide apart
  if (about) {
  const ar = about.getBoundingClientRect(), ap = reduce ? 1 : clamp(-ar.top / (ar.height - vh) * 1.25);
  const mob = innerWidth < 760, e = 1 - Math.pow(1 - ap, 3);
  if (mob) { halfL.style.width = halfR.style.width = "100%"; halfL.style.height = halfR.style.height = "50%"; halfR.style.top = "auto";
    halfL.style.transform = `translateY(${-e * 64}%) scale(${1 - e * .3})`; halfR.style.transform = `translateY(${e * 64}%) scale(${1 - e * .3})`; }
  else { halfL.style.cssText = ""; halfR.style.cssText = "";
    halfL.style.transform = `translateX(${-e * 36}vw) scale(${1 - e * .5}) rotate(${-e * 7}deg)`; halfR.style.transform = `translateX(${e * 36}vw) scale(${1 - e * .5}) rotate(${e * 7}deg)`; }
  const r2 = 8 + e * 40; halfL.style.borderRadius = halfR.style.borderRadius = r2 + "px";
  aC.style.opacity = clamp((ap - .35) / .35); aC.style.transform = `scale(${.9 + clamp((ap - .35) / .35) * .1})`; aCue.style.opacity = 1 - clamp(ap * 4);
  }

  // services stack
  if (!reduce) cards.forEach((c, i) => { const n = cards[i + 1], inner = c.firstElementChild; if (!n) return; if (getComputedStyle(c).position !== "sticky") { inner.style.transform = inner.style.filter = ""; return; }
    const top = parseFloat(getComputedStyle(c).top), k = clamp(1 - (n.getBoundingClientRect().top - top) / (vh * .75));
    inner.style.transform = `scale(${1 - k * .06})`; inner.style.filter = `brightness(${1 - k * .12})`; });

  // journey phone
  if (jr) {
  const jrr = jr.getBoundingClientRect(), jp = reduce ? 1 : clamp(-jrr.top / (jrr.height - vh));
  let lastShown = -1;
  msgs.forEach((m, i) => { const s = jp >= +m.dataset.at; m.classList.toggle("show", s); if (s) lastShown = i; });
  const nextMsg = msgs[lastShown + 1]; typingEl.classList.toggle("show", !!nextMsg && nextMsg.classList.contains("c") && jp > +nextMsg.dataset.at - .07);
  const si = Math.min(3, Math.floor(jp * 4)); jsteps.forEach((s, i) => s.classList.toggle("on", i === si));
  }

  // badge: scroll nudges the swing
  if ($("#swing") && !pend.drag && !reduce) pend.om += clamp(dy, -40, 40) * .004;
  requestAnimationFrame(frame);
})();
