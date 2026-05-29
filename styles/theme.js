/* Dark / light mode toggle.
   Adds a small fixed button, swaps <html data-theme="...">, persists choice. */
(function () {
  var KEY = "site-theme-v2"; /* bumped: ignore older stored prefs, default dark */
  var DEFAULT = "dark";

  function clean(t) { return t === "dark" ? "dark" : "light"; }

  function saved() {
    try { return clean(localStorage.getItem(KEY) || DEFAULT); }
    catch (e) { return DEFAULT; }
  }

  function label(t) { return t === "dark" ? "☀ light" : "☾ dark"; }

  function apply(t) {
    t = clean(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = label(t);
  }

  // Apply immediately to avoid a flash.
  document.documentElement.setAttribute("data-theme", saved());

  // Icon-only social links injected into the sidebar (SVGs use currentColor
  // so they adapt to light/dark automatically).
  var SOCIALS = [
    { title: "Email",    href: "mailto:modishreshtha48@gmail.com",
      svg: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
    { title: "LinkedIn", href: "https://linkedin.com/in/shreshthamodi",
      svg: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>' },
    { title: "GitHub",   href: "https://github.com/shreshtha48",
      svg: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>' },
    { title: "Kaggle",   href: "https://www.kaggle.com/shreshthamodi",
      svg: '<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="10"/>' },
    { title: "Blog",     href: "https://shreshtha.hashnode.dev/",
      svg: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>' }
  ];

  function buildSocials() {
    var host = document.querySelector("nav.sidebar .p-4") ||
               document.querySelector("nav.sidebar");
    if (!host || document.getElementById("sidebar-socials")) return;

    var box = document.createElement("div");
    box.id = "sidebar-socials";

    SOCIALS.forEach(function (s) {
      var a = document.createElement("a");
      a.href = s.href;
      a.title = s.title;
      a.setAttribute("aria-label", s.title);
      if (s.href.indexOf("mailto:") !== 0) a.target = "_blank";
      a.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
        'stroke-linejoin="round">' + s.svg + '</svg>';
      box.appendChild(a);
    });

    host.appendChild(box);
  }

  function build() {
    try { buildSocials(); } catch (e) {}
    if (document.getElementById("theme-toggle")) return;
    var btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.textContent = label(saved());
    btn.onclick = function () {
      var cur = document.documentElement.getAttribute("data-theme");
      apply(cur === "dark" ? "light" : "dark");
    };
    document.body.appendChild(btn);
  }

  // Build as soon as possible, and again on full load, in case the sidebar
  // markup wasn't ready yet. Both calls are idempotent (guarded by IDs).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
  window.addEventListener("load", build);
})();
