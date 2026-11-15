// Mahesh Negi — portfolio interactions
document.documentElement.classList.add("js-enabled");

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const siteHeader = document.querySelector(".site-header");
const yearElement = document.getElementById("current-year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile navigation
function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });
}

// Add a delicate shadow to the sticky navigation after scrolling.
function updateHeader() {
  if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Reveal content as it enters the viewport. The page remains readable
// without JavaScript because the reveal styles are enabled only above.
const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Keep the footer year up to date.
if (yearElement) yearElement.textContent = String(new Date().getFullYear());


// Reading progress indicator.
const progressBar = document.getElementById("reading-progress");
const progressFill = document.getElementById("reading-progress-fill");
function updateReadingProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0
    ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
    : 0;
  if (progressFill) progressFill.style.width = progress + "%";
  if (progressBar) progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
}
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

// Floating back-to-top control.
const backToTop = document.getElementById("back-to-top");
function updateBackToTop() {
  if (!backToTop) return;
  const visible = window.scrollY > 480;
  backToTop.classList.toggle("is-visible", visible);
  backToTop.setAttribute("aria-hidden", String(!visible));
  backToTop.tabIndex = visible ? 0 : -1;
}
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

// Mark the navigation item for the section currently in view.
const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveSection(sectionId) {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === "#" + sectionId;
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visibleEntries[0]) setActiveSection(visibleEntries[0].target.id);
  }, {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0, 0.15, 0.35, 0.6]
  });
  observedSections.forEach((section) => sectionObserver.observe(section));
}
