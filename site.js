(() => {
  const THEME_KEY = "kreativ-theme";
  const LIGHT_THEME = "light";
  const DARK_THEME = "dark";
  const LIGHT_THEME_COLOR = "#f3f6fb";
  const DARK_THEME_COLOR = "#0f131b";
  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function getToggle() {
    return document.getElementById("theme-toggle");
  }

  function loadSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme === LIGHT_THEME || savedTheme === DARK_THEME ? savedTheme : LIGHT_THEME;
    } catch (_) {
      return LIGHT_THEME;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {
      // Ignore persistence errors and keep the current session theme.
    }
  }

  function setThemeMeta(theme) {
    if (!themeMeta) {
      return;
    }
    themeMeta.setAttribute("content", theme === LIGHT_THEME ? LIGHT_THEME_COLOR : DARK_THEME_COLOR);
  }

  function applyTheme(theme) {
    const toggle = getToggle();
    root.setAttribute("data-theme", theme);
    setThemeMeta(theme);
    if (!toggle) {
      return;
    }
    toggle.setAttribute("aria-pressed", theme === DARK_THEME ? "true" : "false");
    toggle.setAttribute("aria-label", theme === LIGHT_THEME ? "Switch to dark mode" : "Switch to light mode");
    toggle.setAttribute("title", theme === LIGHT_THEME ? "Switch to dark mode" : "Switch to light mode");
    toggle.innerHTML = theme === LIGHT_THEME
      ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
  }

  function onThemeToggle() {
    const currentTheme = root.getAttribute("data-theme") === LIGHT_THEME ? LIGHT_THEME : DARK_THEME;
    const nextTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  }

  function onThemeKeydown(event) {
    const toggle = getToggle();
    if (!toggle) {
      return;
    }
    if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const target = event.target;
    const tag = (target && target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (target && target.isContentEditable)) {
      return;
    }
    if (event.key.toLowerCase() === "t") {
      toggle.click();
    }
  }

  function wireProductTracking() {
    const productLinks = document.querySelectorAll(".pillar[data-product]");
    productLinks.forEach((link) => {
      link.addEventListener("click", () => {
        trackEvent("Product Click", { product: link.dataset.product });
      });
    });
  }

  function trackEvent(eventName, props) {
    if (typeof window.plausible === "function") {
      window.plausible(eventName, { props });
    }
  }

  function wireLinkTracking(selector, eventName, source) {
    document.querySelectorAll(selector).forEach((link) => {
      link.addEventListener("click", () => {
        trackEvent(eventName, {
          source,
          label: link.textContent.trim(),
          href: link.getAttribute("href") || ""
        });
      });
    });
  }

  function loadAnalytics() {
    const existing = document.querySelector('script[data-domain="madebykreativ.com"][src="https://plausible.io/js/script.js"]');
    if (existing) {
      return;
    }
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = "madebykreativ.com";
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  function init() {
    const toggle = getToggle();
    const year = document.getElementById("year");
    if (year) {
      year.textContent = new Date().getFullYear();
    }
    if (toggle) {
      toggle.addEventListener("click", onThemeToggle);
    }
    document.addEventListener("keydown", onThemeKeydown);
    wireProductTracking();
    wireLinkTracking(".site-nav a", "Navigation Click", "site-nav");
    wireLinkTracking(".ecosystem-links a", "Footer Link Click", "footer");
    loadAnalytics();
  }

  root.classList.add("js-ready");
  applyTheme(loadSavedTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
