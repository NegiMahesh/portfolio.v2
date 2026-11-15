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

function applyPortfolioTheme(selectedTheme) {
  document.documentElement.dataset.theme = selectedTheme;
  themeOptions.forEach((option) => {
    option.setAttribute("aria-pressed", String(option.dataset.themeChoice === selectedTheme));
  });
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", selectedTheme === "terracotta" ? "#F7F1E8" : "#1C1917");
  }
}

function setPortfolioTheme(theme, savePreference = true) {
  const selectedTheme = theme === "terracotta" ? "terracotta" : "warm-dark";
  const apply = () => applyPortfolioTheme(selectedTheme);

  if (!reduceMotion && typeof document.startViewTransition === "function") {
    document.startViewTransition(apply);
  } else {
    document.documentElement.classList.add("theme-transitioning");
    apply();
    window.setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 280);
  }

  if (savePreference) {
    try {
      localStorage.setItem("mahesh-portfolio-theme", selectedTheme);
    } catch (error) {
      // Theme switching remains available for this page session.
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


// Portfolio command palette and project filters.
const commandTrigger = document.getElementById("command-trigger");
const commandDialog = document.getElementById("command-dialog");
const commandSearch = document.getElementById("command-search");
const commandEmpty = document.getElementById("command-empty");
const commandItems = Array.from(document.querySelectorAll(".command-item"));
const projectDialog = document.getElementById("project-dialog");
const resumeDialog = document.getElementById("resume-dialog");
const toast = document.getElementById("site-toast");
let lastDialogTrigger = null;
let toastTimer = null;

const projectDetails = {
  assistant: {
    kicker: "LOCAL-FIRST PERSONAL ASSISTANT",
    title: "Fast AI Assistant",
    description: "A local-first personal assistant built around a FastAPI backend and local Ollama models, paired with a web interface and experiments in voice and vision.",
    highlights: [
      "Uses locally running language models through Ollama.",
      "Pairs a web interface with a FastAPI backend.",
      "Explores voice and vision capabilities as part of a personal assistant workflow."
    ],
    stack: ["Python", "FastAPI", "Ollama", "JavaScript"],
    repo: "https://github.com/NegiMahesh/AI_assistant"
  },
  traceback: {
    kicker: "AI-POWERED CRASH INVESTIGATION & REPAIR",
    title: "TraceBack",
    description: "A local debugging engine that takes a Python traceback through diagnosis, a proposed patch and regression testing—from stack trace to verified fix.",
    highlights: [
      "Parses Python exceptions and locates the faulty source line and surrounding context.",
      "Uses Git blame to inspect the commit and authorship associated with the broken line.",
      "Uses a local Ollama coding model to propose a targeted patch and regression test.",
      "Requires human approval, runs tests and rolls back automatically when verification fails."
    ],
    stack: ["Python", "FastAPI", "React", "Ollama", "Pytest", "Git", "Monaco"],
    repo: "https://github.com/NegiMahesh/TraceBack"
  },
  portfolio: {
    kicker: "PERSONAL WEBSITE",
    title: "Developer Portfolio",
    description: "A responsive portfolio built to introduce my background, present selected work and share the technologies I'm exploring.",
    highlights: [
      "Built with semantic HTML, CSS and JavaScript.",
      "Includes Warm Dark and Terracotta themes.",
      "Includes responsive navigation, accessible interactions and project showcases."
    ],
    stack: ["HTML5", "CSS3", "JavaScript"],
    repo: "https://github.com/NegiMahesh/portfolio.v2"
  }
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => { toast.hidden = true; }, 220);
  }, 2600);
}

async function copyPortfolioEmail() {
  const email = "negimahesh34@gmail.com";
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(email);
    } else {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Clipboard copy was not available.");
    }
    showToast("Email address copied: " + email);
  } catch (error) {
    showToast("Couldn't copy automatically. Email: " + email);
  }
}

function openDialog(dialog, trigger) {
  if (!dialog || typeof dialog.showModal !== "function") {
    showToast("This browser doesn't support the preview window. Please try an updated browser.");
    return;
  }
  lastDialogTrigger = trigger || document.activeElement;
  if (!dialog.open) dialog.showModal();
  const closeButton = dialog.querySelector("[data-close-dialog]");
  if (closeButton) requestAnimationFrame(() => closeButton.focus());
}

function closeDialog(dialog) {
  if (dialog && dialog.open) dialog.close();
}

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")));
});

[commandDialog, projectDialog, resumeDialog].forEach((dialog) => {
  if (!dialog) return;
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (lastDialogTrigger && typeof lastDialogTrigger.focus === "function") {
      lastDialogTrigger.focus({ preventScroll: true });
    }
  });
});

function openProjectDetails(projectId, trigger) {
  const details = projectDetails[projectId];
  if (!details || !projectDialog) return;
  document.getElementById("project-dialog-kicker").textContent = details.kicker;
  document.getElementById("project-dialog-title").textContent = details.title;
  document.getElementById("project-dialog-description").textContent = details.description;

  const highlights = document.getElementById("project-dialog-highlights");
  highlights.replaceChildren();
  details.highlights.forEach((highlight) => {
    const item = document.createElement("li");
    item.textContent = highlight;
    highlights.appendChild(item);
  });

  const stack = document.getElementById("project-dialog-stack");
  stack.replaceChildren();
  details.stack.forEach((technology) => {
    const tag = document.createElement("span");
    tag.textContent = technology;
    stack.appendChild(tag);
  });

  const repoLink = document.getElementById("project-dialog-repo");
  repoLink.href = details.repo;
  openDialog(projectDialog, trigger);
}

document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => openProjectDetails(button.dataset.openProject, button));
});

document.querySelectorAll("[data-open-resume]").forEach((button) => {
  button.addEventListener("click", () => openDialog(resumeDialog, button));
});

const resumePrint = document.getElementById("resume-print");
if (resumePrint) {
  resumePrint.addEventListener("click", () => {
    closeDialog(resumeDialog);
    // Open the print dialog after the résumé dialog has closed.
    window.setTimeout(() => window.print(), 100);
  });
}

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", copyPortfolioEmail);
});

// Category filtering only hides/shows existing project cards; no project is removed.
const filterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
const projectCards = Array.from(document.querySelectorAll(".project-card[data-project-categories]"));
const filterCount = document.getElementById("project-filter-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.projectFilter;
    let visibleCount = 0;

    filterButtons.forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter === button));
    });

    projectCards.forEach((card) => {
      const categories = (card.dataset.projectCategories || "").split(/\s+/);
      const visible = category === "all" || categories.includes(category);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (filterCount) {
      filterCount.textContent = "Showing " + visibleCount + (visibleCount === 1 ? " project" : " projects");
    }
  });
});

// Search, keyboard navigation and command activation.
function visibleCommandItems() {
  return commandItems.filter((item) => !item.hidden);
}

function filterCommands() {
  const query = (commandSearch?.value || "").trim().toLowerCase();
  let count = 0;
  commandItems.forEach((item) => {
    const searchable = ((item.dataset.search || "") + " " + item.textContent).toLowerCase();
    item.hidden = query !== "" && !searchable.includes(query);
    item.classList.remove("is-active");
    if (!item.hidden) count += 1;
  });
  if (commandEmpty) commandEmpty.hidden = count !== 0;
  if (commandSearch) commandSearch.removeAttribute("aria-activedescendant");
}

function openCommandPalette(trigger = commandTrigger) {
  if (!commandDialog) return;
  if (commandSearch) commandSearch.value = "";
  filterCommands();
  openDialog(commandDialog, trigger);
  if (commandSearch) requestAnimationFrame(() => commandSearch.focus());
}

if (commandTrigger) commandTrigger.addEventListener("click", () => openCommandPalette(commandTrigger));

if (commandSearch) {
  commandSearch.addEventListener("input", filterCommands);
  commandSearch.addEventListener("keydown", (event) => {
    const items = visibleCommandItems();
    if (!items.length) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      let current = items.findIndex((item) => item.classList.contains("is-active"));
      current = (current + direction + items.length) % items.length;
      items.forEach((item, index) => item.classList.toggle("is-active", index === current));
      commandSearch.setAttribute("aria-activedescendant", items[current].id || "");
      if (!items[current].id) items[current].id = "command-item-" + current;
      commandSearch.setAttribute("aria-activedescendant", items[current].id);
      items[current].scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = items.find((item) => item.classList.contains("is-active")) || items[0];
      active.click();
    }
  });
}

function runCommand(item) {
  const action = item.dataset.command;
  closeDialog(commandDialog);

  if (action === "section") {
    const target = document.querySelector(item.dataset.target);
    if (target) {
      closeMenu();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  } else if (action === "project") {
    openProjectDetails(item.dataset.projectId, commandTrigger);
  } else if (action === "resume") {
    openDialog(resumeDialog, commandTrigger);
  } else if (action === "copy-email") {
    copyPortfolioEmail();
  } else if (action === "theme") {
    setPortfolioTheme(item.dataset.themeChoice);
    showToast("Theme changed to " + (item.dataset.themeChoice === "terracotta" ? "Terracotta Editorial" : "Warm Dark"));
  }
}

commandItems.forEach((item) => item.addEventListener("click", () => runCommand(item)));

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandPalette(commandTrigger);
  }
});

// Keep the three scroll-driven effects on one animation-frame callback.
let scrollUpdateQueued = false;
function scheduleScrollUpdates() {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;
  window.requestAnimationFrame(() => {
    scrollUpdateQueued = false;
    updateHeader();
    updateReadingProgress();
    updateBackToTop();
  });
}
window.addEventListener("scroll", scheduleScrollUpdates, { passive: true });
window.addEventListener("resize", scheduleScrollUpdates);
