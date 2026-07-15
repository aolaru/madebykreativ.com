(() => {
  const THEME_KEY = "kreativ-theme";
  const LIGHT_THEME = "light";
  const DARK_THEME = "dark";
  const LIGHT_THEME_COLOR = "#f3f6fb";
  const DARK_THEME_COLOR = "#0f131b";
  const config = window.KREATIV_CONFIG || {};
  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const moonIcon = '<svg class="nav-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5a7.5 7.5 0 1 0 11.7 11.7Z"/></svg>';
  const sunIcon = '<svg class="nav-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';

  function getToggle() {
    return document.getElementById("theme-toggle");
  }

  function getShareButton() {
    return document.getElementById("share-button");
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
    toggle.innerHTML = theme === LIGHT_THEME ? moonIcon : sunIcon;
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

  async function onShare() {
    const shareData = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.getAttribute("content") || document.title,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        trackEvent("Share Page", { method: "native", url: shareData.url });
        return;
      }
    } catch (_) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      trackEvent("Share Page", { method: "clipboard", url: shareData.url });
      const shareButton = getShareButton();
      if (shareButton) {
        shareButton.setAttribute("title", "Link copied");
        window.setTimeout(() => {
          shareButton.setAttribute("title", "Share this page");
        }, 1400);
      }
    } catch (_) {
      trackEvent("Share Page", { method: "unsupported", url: shareData.url });
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

  function wireProjectFilters() {
    const buttons = document.querySelectorAll("[data-project-filter], [data-project-category-filter]");
    const projects = document.querySelectorAll("[data-project-status]");
    const emptyState = document.querySelector("[data-project-empty-state]");
    const resetButton = document.querySelector("[data-project-filter-reset]");
    if (!buttons.length || !projects.length) {
      return;
    }

    const state = {
      status: "all",
      category: "all"
    };

    function updatePressedButtons() {
      document.querySelectorAll("[data-project-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", item.getAttribute("data-project-filter") === state.status ? "true" : "false");
      });
      document.querySelectorAll("[data-project-category-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", item.getAttribute("data-project-category-filter") === state.category ? "true" : "false");
      });
    }

    function applyFilters() {
      let visibleProjects = 0;
      projects.forEach((project) => {
        const statusMatches = state.status === "all" || project.getAttribute("data-project-status") === state.status;
        const categoryMatches = state.category === "all" || project.getAttribute("data-project-category") === state.category;
        const isVisible = statusMatches && categoryMatches;
        project.hidden = !isVisible;
        if (isVisible) {
          visibleProjects += 1;
        }
      });
      document.querySelectorAll(".project-category").forEach((category) => {
        const hasVisibleProject = Boolean(category.querySelector("[data-project-status]:not([hidden])"));
        category.hidden = !hasVisibleProject;
      });
      if (emptyState) {
        emptyState.hidden = visibleProjects > 0;
      }
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const statusFilter = button.getAttribute("data-project-filter");
        const categoryFilter = button.getAttribute("data-project-category-filter");
        const filterType = statusFilter === null ? "category" : "status";
        const filter = statusFilter || categoryFilter || "all";
        state[filterType] = filter;
        updatePressedButtons();
        applyFilters();
        trackEvent("Project Filter", { type: filterType, filter });
      });
    });

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        state.status = "all";
        state.category = "all";
        updatePressedButtons();
        applyFilters();
        trackEvent("Project Filter Reset", { source: "empty-state" });
      });
    }
  }

  function wireContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) {
      return;
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const email = form.getAttribute("data-contact-email");
      if (!email) {
        return;
      }
      const data = new FormData(form);
      const topic = String(data.get("topic") || "Made by Kreativ inquiry");
      const name = String(data.get("name") || "").trim();
      const sender = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const body = [
        name ? `Name: ${name}` : "",
        sender ? `Email: ${sender}` : "",
        "",
        message
      ].join("\n").trim();
      const mailto = new URL(`mailto:${email}`);
      mailto.searchParams.set("subject", topic);
      if (body) {
        mailto.searchParams.set("body", body);
      }
      trackEvent("Contact Form Draft", { topic });
      window.location.href = mailto.toString();
    });
  }

  function wireEmailCopy() {
    const copyButton = document.querySelector("[data-copy-email]");
    const status = document.querySelector("[data-copy-status]");
    if (!copyButton) {
      return;
    }
    copyButton.addEventListener("click", async () => {
      const email = copyButton.getAttribute("data-copy-email");
      if (!email) {
        return;
      }
      try {
        await navigator.clipboard.writeText(email);
        if (status) {
          status.textContent = "Copied";
          window.setTimeout(() => {
            status.textContent = "";
          }, 1600);
        }
        trackEvent("Copy Email", { source: "contact" });
      } catch (_) {
        if (status) {
          status.textContent = email;
        }
      }
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

  function isProductionHost() {
    return Boolean(config.analytics?.productionHost) && window.location.hostname === config.analytics.productionHost;
  }

  function loadPlausible() {
    const plausible = config.analytics?.plausible;
    if (!plausible?.domain || !plausible?.src) {
      return;
    }
    const existing = document.querySelector(`script[data-domain="${plausible.domain}"][src="${plausible.src}"]`);
    if (existing) {
      return;
    }
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = plausible.domain;
    script.src = plausible.src;
    document.head.appendChild(script);
  }

  function loadCloudflareAnalytics() {
    const cloudflare = config.analytics?.cloudflare;
    if (!cloudflare?.token || !cloudflare?.src) {
      return;
    }
    const existing = document.querySelector(`script[src="${cloudflare.src}"]`);
    if (existing) {
      return;
    }
    const script = document.createElement("script");
    script.defer = true;
    script.src = cloudflare.src;
    script.dataset.cfBeacon = JSON.stringify({ token: cloudflare.token });
    document.head.appendChild(script);
  }

  function loadAnalytics() {
    if (!isProductionHost()) {
      return;
    }
    loadPlausible();
    loadCloudflareAnalytics();
  }

  function init() {
    const shareButton = getShareButton();
    const toggle = getToggle();
    const year = document.getElementById("year");
    if (year) {
      year.textContent = new Date().getFullYear();
    }
    if (shareButton) {
      shareButton.addEventListener("click", () => {
        void onShare();
      });
    }
    if (toggle) {
      applyTheme(root.getAttribute("data-theme") === DARK_THEME ? DARK_THEME : LIGHT_THEME);
      toggle.addEventListener("click", onThemeToggle);
    }
    document.addEventListener("keydown", onThemeKeydown);
    wireProductTracking();
    wireProjectFilters();
    wireContactForm();
    wireEmailCopy();
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
