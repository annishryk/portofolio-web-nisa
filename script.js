// ---------- Theme toggle (remembers choice) ----------
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
} catch (e) {}
document.getElementById("theme").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Live clock (Jakarta time) ----------
const clock = document.getElementById("clock");
function tick() {
  clock.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta",
  }).format(new Date()) + " WIB";
}
tick();
setInterval(tick, 30000);

// ---------- Typewriter in the intro headline ----------
// Edit the words below to change what gets typed.
const words = ["simple", "reliable", "accessible", "automated", "useful"];
const typeEl = document.getElementById("type");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  let w = 0, c = words[0].length, deleting = true;
  (function loop() {
    const word = words[w];
    typeEl.textContent = word.slice(0, c);
    let delay = deleting ? 55 : 95;
    if (!deleting && c === word.length) { deleting = true; delay = 1800; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    else { c += deleting ? -1 : 1; }
    setTimeout(loop, delay);
  })();
}

// ---------- Highlight the current section in the sidebar ----------
const links = [...document.querySelectorAll("[data-spy]")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.dataset.spy === e.target.id));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.1 });
document.querySelectorAll(".card, .skill, .timeline > li, .facts > div, .pub, .contact-card").forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = (i % 3) * 70 + "ms";
  io.observe(el);
});

// ---------- Cursor spotlight on project cards ----------
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

// ---------- Copy email button ----------
const copy = document.getElementById("copy");
copy.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(copy.dataset.email); copy.textContent = "Copied!"; }
  catch (e) { copy.textContent = copy.dataset.email; }
  setTimeout(() => (copy.textContent = "Copy email"), 2000);
});