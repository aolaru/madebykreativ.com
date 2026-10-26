import { storefrontHref } from "/product-attribution.mjs";
import { appStoreHref } from "/app-attribution.mjs";
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

  function wireMobileMenu() {
    const menu = document.querySelector(".site-nav-mobile-menu");
    const trigger = menu?.querySelector("summary");
    if (!menu || !trigger) return;
    menu.addEventListener("toggle", () => trigger.setAttribute("aria-label", menu.open ? "Close navigation menu" : "Open navigation menu"));
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menu.open) return;
      event.preventDefault();
      menu.open = false;
      trigger.focus();
    });
    document.addEventListener("pointerdown", (event) => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
    });
  }

  let feedbackTimeout;
  function announce(message) {
    const status = document.getElementById("page-feedback");
    if (!status) return;
    window.clearTimeout(feedbackTimeout);
    status.textContent = message;
    feedbackTimeout = window.setTimeout(() => { status.textContent = ""; }, 6000);
  }

  function canonicalPageUrl() {
    return document.querySelector('link[rel="canonical"]')?.href || `${window.location.origin}${window.location.pathname}`;
  }

  async function onShare() {
    const shareData = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.getAttribute("content") || document.title,
      url: canonicalPageUrl()
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        trackEvent("Share Page", { method: "native", url: shareData.url });
        announce("Page shared.");
        return;
      }
    } catch (error) {
      if (error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      trackEvent("Share Page", { method: "clipboard", url: shareData.url });
      announce("Page link copied.");
    } catch (_) {
      trackEvent("Share Page", { method: "unsupported", url: shareData.url });
      announce("Could not copy the link. You can copy the page address from your browser.");
    }
  }

  function wireProductTracking() {
    const productLinks = document.querySelectorAll("[data-product-cta]");
    productLinks.forEach((link) => {
      link.href = storefrontHref(link.href, {page: link.dataset.page || window.location.pathname, position: link.dataset.position || "product"});
      link.addEventListener("click", () => {
        trackEvent("Product CTA Click", {
          product: link.dataset.product || "unknown",
          stage: link.dataset.stage || "unknown",
          page: link.dataset.page || window.location.pathname,
          position: link.dataset.position || "unknown",
          destination: link.getAttribute("href") || ""
        });
      });
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

  function wireAppTracking() {
    document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach((link) => {
      const url = new URL(link.href);
      if (url.hostname !== "play.google.com") return;
      const app = url.searchParams.get("id");
      link.href = appStoreHref(link.href, { page: window.location.pathname, position: link.dataset.position || "article", search: window.location.search });
      link.addEventListener("click", () => trackEvent("App Store Click", { app, page: window.location.pathname, position: link.dataset.position || "article", store: "Google Play" }));
    });
  }

  function wireAppSupport() {
    const form = document.querySelector("[data-app-support]");
    if (!form) return;
    const select = form.elements.namedItem("app");
    const requested = new URLSearchParams(window.location.search).get("app");
    if ([...select.options].some((option) => option.value === requested)) select.value = requested;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = select.selectedOptions[0].textContent;
      const body = `App: ${name}\nApp version: ${data.get("version") || "Not provided"}\nAndroid and phone: ${data.get("device") || "Not provided"}\n\n${data.get("details")}\n`;
      const url = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`${name} support`)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
      announce("Support email prepared. Review it in your email app before sending.");
    });
    form.querySelector("[data-support-fields]").disabled = false;
  }

  function wireNewsFilters() {
    const entries = document.querySelectorAll("[data-news-entry]");
    const filterButtons = document.querySelectorAll("[data-news-filter]");
    const searchInput = document.querySelector("[data-news-search-input]");
    const emptyState = document.querySelector("[data-news-empty-state]");
    const moreButton = document.querySelector("[data-updates-more]");
    const countLabel = document.querySelector("[data-updates-count]");
    if (!entries.length || !filterButtons.length || !searchInput) {
      return;
    }

    const categories = new Set([...filterButtons].map((button) => button.dataset.newsFilter));
    const pageSize = 12;
    let state;

    function readUrlState() {
      const params = new URLSearchParams(window.location.search);
      const page = Number(params.get("page"));
      state = {
        category: categories.has(params.get("kind")) ? params.get("kind") : "all",
        query: (params.get("q") || "").trim().toLowerCase(),
        limit: Number.isSafeInteger(page) && page > 0 ? Math.min(page, Math.ceil(entries.length / pageSize)) * pageSize : pageSize
      };
      searchInput.value = params.get("q") || "";
      filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.newsFilter === state.category)));
    }

    function writeUrlState(push = false) {
      const url = new URL(window.location.href);
      for (const key of ["kind", "q", "page"]) url.searchParams.delete(key);
      if (state.category !== "all") url.searchParams.set("kind", state.category);
      if (searchInput.value.trim()) url.searchParams.set("q", searchInput.value.trim());
      if (state.limit > pageSize) url.searchParams.set("page", String(Math.ceil(state.limit / pageSize)));
      url.hash = "";
      window.history[push ? "pushState" : "replaceState"](null, "", url);
    }

    function applyNewsFilters() {
      let visibleCount = 0;
      entries.forEach((entry) => {
        const category = entry.getAttribute("data-news-category") || "";
        const searchable = entry.getAttribute("data-news-search") || "";
        const categoryMatches = state.category === "all" || category === state.category;
        const queryMatches = !state.query || searchable.includes(state.query);
        const visible = categoryMatches && queryMatches;
        entry.hidden = !visible || (moreButton && visibleCount >= state.limit);
        if (visible) {
          visibleCount += 1;
        }
      });
      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
      if (moreButton) moreButton.hidden = visibleCount <= state.limit;
      if (countLabel) countLabel.textContent = `Showing ${Math.min(visibleCount, state.limit)} of ${visibleCount} ${visibleCount === 1 ? "update" : "updates"}`;
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.getAttribute("data-news-filter") || "all";
        state.limit = 12;
        filterButtons.forEach((item) => {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        writeUrlState(true);
        applyNewsFilters();
        trackEvent("News Filter", { category: state.category });
      });
    });

    searchInput.addEventListener("input", () => {
      state.query = searchInput.value.trim().toLowerCase();
      state.limit = 12;
      writeUrlState();
      applyNewsFilters();
    });
    moreButton?.addEventListener("click", () => {
      const hiddenEntries = [...entries].filter((entry) => entry.hidden);
      state.limit += pageSize;
      writeUrlState();
      applyNewsFilters();
      const firstAdded = hiddenEntries.find((entry) => !entry.hidden);
      if (firstAdded) { firstAdded.tabIndex = -1; firstAdded.focus(); }
    });
    function revealHashTarget() {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
      const index = [...entries].findIndex((entry) => entry.id === id);
      if (index < 0) return;
      if (entries[index].hidden) {
        state.category = "all";
        state.query = "";
        searchInput.value = "";
        state.limit = Math.max(state.limit, Math.ceil((index + 1) / pageSize) * pageSize);
        filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.newsFilter === "all")));
        applyNewsFilters();
      }
      entries[index].tabIndex = -1;
      entries[index].focus();
    }
    window.addEventListener("popstate", () => { readUrlState(); applyNewsFilters(); revealHashTarget(); });
    window.addEventListener("hashchange", revealHashTarget);
    readUrlState();
    applyNewsFilters();
    revealHashTarget();
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
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    script.defer = true;
    script.dataset.domain = plausible.domain;
    script.src = plausible.src;
    document.head.appendChild(script);
  }

  function loadAnalytics() {
    if (!isProductionHost() || navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") {
      return;
    }
    loadPlausible();
    const beacon = config.analytics?.cloudflare;
    if (beacon?.src && beacon?.token) {
      const script = document.createElement("script");
      script.defer = true;
      script.src = beacon.src;
      script.setAttribute("data-cf-beacon", JSON.stringify({token:beacon.token}));
      document.head.appendChild(script);
    }
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
    wireMobileMenu();
    wireProductTracking();
    wireAppTracking();
    wireAppSupport();
    wireNewsFilters();
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
