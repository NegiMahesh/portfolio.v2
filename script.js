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
