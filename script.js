const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const toast = document.querySelector(".toast");
const demoButton = document.querySelector(".demo-button");
const demoStages = Array.from(document.querySelectorAll(".demo-stage"));
const rewardButtons = Array.from(document.querySelectorAll(".reward-card button"));
const navDropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
const carouselSlides = Array.from(document.querySelectorAll(".carousel-slide"));
const carouselDots = Array.from(document.querySelectorAll(".carousel-dots button"));
const carouselPrev = document.querySelector(".carousel-arrow.prev");
const carouselNext = document.querySelector(".carousel-arrow.next");
let carouselIndex = 0;
let toastTimer;

const liveDemoUrl =
  demoButton?.dataset.replitUrl?.trim() ||
  "https://foothill-innovation-challenge-2026-01-child-home-focu--keioashj.replit.app";

function showToast(message, actionLabel, actionUrl) {
  if (!toast) return;

  toast.textContent = "";
  const messageText = document.createElement("span");
  messageText.textContent = message;
  toast.appendChild(messageText);

  if (actionLabel && actionUrl) {
    const action = document.createElement("a");
    action.href = actionUrl;
    action.target = "_blank";
    action.rel = "noopener";
    action.textContent = actionLabel;
    toast.appendChild(action);
  }

  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 6500);
}

function closeDropdowns(exceptDropdown) {
  navDropdowns.forEach((dropdown) => {
    if (dropdown === exceptDropdown) return;
    dropdown.classList.remove("open");
    const button = dropdown.querySelector(".nav-drop-button");
    if (button) button.setAttribute("aria-expanded", "false");
  });
}

function scrollToSection(hash) {
  const target = document.querySelector(hash);
  if (!target) return;

  const headerOffset = 94;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest(".nav-drop-button")) return;
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
}

navDropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".nav-drop-button");
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    closeDropdowns(dropdown);
    const isOpen = dropdown.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("click", (event) => {
  if (navDropdowns.some((dropdown) => dropdown.contains(event.target))) return;
  closeDropdowns();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeDropdowns();
});

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetUrl = new URL(link.href);
    const isSamePage =
      targetUrl.pathname === window.location.pathname ||
      targetUrl.pathname.endsWith("/index.html") && window.location.pathname.endsWith("/index.html");

    if (!isSamePage || !targetUrl.hash) return;

    if (!document.querySelector(targetUrl.hash)) return;

    event.preventDefault();
    scrollToSection(targetUrl.hash);
    history.pushState(null, "", targetUrl.hash);

    if (siteNav && menuToggle) {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }

    closeDropdowns();
  });
});

window.addEventListener("load", () => {
  if (window.location.hash) {
    setTimeout(() => scrollToSection(window.location.hash), 80);
  }
});

function showCarouselSlide(index) {
  if (!carouselSlides.length) return;
  carouselIndex = (index + carouselSlides.length) % carouselSlides.length;

  carouselSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === carouselIndex);
  });

  carouselDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === carouselIndex);
  });
}

function showDemoStage(selectedStage) {
  demoStages.forEach((stage) => {
    const isSelected = stage === selectedStage;
    stage.classList.toggle("active", isSelected);
    stage.setAttribute("aria-expanded", String(isSelected));
  });
}

if (carouselPrev) {
  carouselPrev.addEventListener("click", () => showCarouselSlide(carouselIndex - 1));
}

if (carouselNext) {
  carouselNext.addEventListener("click", () => showCarouselSlide(carouselIndex + 1));
}

carouselDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => showCarouselSlide(dotIndex));
});

demoStages.forEach((stage) => {
  stage.addEventListener("click", () => {
    showDemoStage(stage);
  });
});

if (demoButton) {
  demoButton.addEventListener("click", (event) => {
    if (!liveDemoUrl || liveDemoUrl === "PASTE_YOUR_REPLIT_LINK_HERE" || !liveDemoUrl.startsWith("http")) {
      event.preventDefault();
      showToast("Paste your live Replit URL into data-replit-url first.");
      return;
    }

    event.preventDefault();
    window.open(liveDemoUrl, "_blank", "noopener,noreferrer");
  });
}

rewardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rewardName = button.dataset.reward || "This reward";
    button.dataset.status = "Approved";
    button.textContent = "Approved";
    showToast(
      `${rewardName} is approved in this website preview. Open the demo app to request rewards live.`,
      "Open demo app",
      liveDemoUrl
    );
  });
});