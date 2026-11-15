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


// Subtle pointer lighting and tilt for the hero artwork.
// Touch users and reduced-motion users keep the static composition.
const tiltCard = document.querySelector("[data-tilt]");
const canUsePointerTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion;

if (tiltCard && canUsePointerTilt) {
  tiltCard.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const bounds = tiltCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * 5;
    const rotateX = (0.5 - y) * 5;

    tiltCard.style.setProperty("--spotlight-x", (x * 100).toFixed(1) + "%");
    tiltCard.style.setProperty("--spotlight-y", (y * 100).toFixed(1) + "%");
    tiltCard.style.transform =
      "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
  });

  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.style.transform = "";
    tiltCard.style.removeProperty("--spotlight-x");
    tiltCard.style.removeProperty("--spotlight-y");
  });
}


// Two-theme portfolio switch. Warm Dark remains the default.
const themeOptions = Array.from(document.querySelectorAll("[data-theme-choice]"));
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function setPortfolioTheme(theme, savePreference = true) {
  const selectedTheme = theme === "terracotta" ? "terracotta" : "warm-dark";
  document.documentElement.dataset.theme = selectedTheme;

  themeOptions.forEach((option) => {
    const isSelected = option.dataset.themeChoice === selectedTheme;
    option.setAttribute("aria-pressed", String(isSelected));
  });

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      selectedTheme === "terracotta" ? "#F7F1E8" : "#1C1917"
    );
  }

  if (savePreference) {
    try {
      localStorage.setItem("mahesh-portfolio-theme", selectedTheme);
    } catch (error) {
      // Theme switching remains available for the current page session.
    }
  }
}

const initialTheme = document.documentElement.dataset.theme === "terracotta"
  ? "terracotta"
  : "warm-dark";
setPortfolioTheme(initialTheme, false);

themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setPortfolioTheme(option.dataset.themeChoice);
  });
});
