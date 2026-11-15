// Mahesh Negi — Portfolio interactions
document.documentElement.classList.add("js-enabled");

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const header = document.querySelector(".site-header");

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
    if (window.innerWidth > 680) closeMenu();
  });
}

// Add a subtle header border after the page starts scrolling.
function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 12);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Rotate the short role labels in the hero section.
const typedRole = document.getElementById("typed-role");
const roles = ["Web development", "C programming", "Java & problem solving", "Python and local AI"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typedRole && !reduceMotion) {
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;

  function typeNext() {
    const currentRole = roles[roleIndex];

    if (deleting) {
      characterIndex -= 1;
      typedRole.textContent = currentRole.slice(0, Math.max(0, characterIndex));
      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      window.setTimeout(typeNext, 45);
      return;
    }

    const nextRole = roles[roleIndex];
    characterIndex += 1;
    typedRole.textContent = nextRole.slice(0, characterIndex);

    if (characterIndex >= nextRole.length) {
      deleting = true;
      window.setTimeout(typeNext, 1500);
    } else {
      window.setTimeout(typeNext, 75);
    }
  }

  window.setTimeout(typeNext, 1800);
}

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Keep the copyright year current.
const yearElement = document.getElementById("current-year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
