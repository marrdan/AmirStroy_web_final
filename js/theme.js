// Light and dark mode. This file is loaded in <head>, so the saved mode is applied before the page is painted.
const THEME_KEY = "amirstroy_theme";
const THEME_COLORS = { light: "#E8EFEC", dark: "#161B1A" };

function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch (error) {
    // storage is blocked: fall through to the system setting
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.setAttribute("aria-pressed", theme === "dark");
  }
}

applyTheme(getSavedTheme());

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("theme-toggle");
  applyTheme(getSavedTheme());
  if (!button) {
    return;
  }
  button.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      // the mode still changes, it just is not remembered
    }
    applyTheme(next);
  });
});

// keep several open tabs in sync
window.addEventListener("storage", function (event) {
  if (event.key === THEME_KEY) {
    applyTheme(getSavedTheme());
  }
});
