/* Paint-palette colour chooser for the old-web theme.
   Renders a little artist's palette (top-right) with one paint dab per theme,
   swaps <html data-palette="...">, and remembers the choice in localStorage. */
(function () {
  var KEY = "site-palette";
  var PALETTES = ["classic", "green", "amber", "blue"];
  var DEFAULT = "classic";

  function clean(p) { return PALETTES.indexOf(p) === -1 ? DEFAULT : p; }

  function saved() {
    try { return clean(localStorage.getItem(KEY)); } catch (e) { return DEFAULT; }
  }

  function apply(p) {
    p = clean(p);
    document.documentElement.setAttribute("data-palette", p);
    try { localStorage.setItem(KEY, p); } catch (e) {}
    var dots = document.querySelectorAll("#palette-chooser .pc-swatch");
    for (var i = 0; i < dots.length; i++) {
      dots[i].setAttribute("aria-pressed",
        dots[i].getAttribute("data-palette") === p ? "true" : "false");
    }
  }

  // Apply immediately to avoid a flash of the wrong palette.
  document.documentElement.setAttribute("data-palette", saved());

  function build() {
    if (document.getElementById("palette-chooser")) return;

    var wrap = document.createElement("div");
    wrap.id = "palette-chooser";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Colour palette");

    var dots = document.createElement("div");
    dots.className = "pc-dots";

    PALETTES.forEach(function (name) {
      var b = document.createElement("button");
      b.className = "pc-swatch";
      b.type = "button";
      b.setAttribute("data-palette", name);
      b.setAttribute("title", name);
      b.setAttribute("aria-label", name + " palette");
      b.onclick = function () { apply(name); };
      dots.appendChild(b);
    });

    wrap.appendChild(dots);
    document.body.appendChild(wrap);

    apply(saved());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
