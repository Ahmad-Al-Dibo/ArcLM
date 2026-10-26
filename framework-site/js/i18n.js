/* English ↔ Nederlands toggle for framework-site */
(function () {
  "use strict";

  var STORAGE_KEY = "arclm-site-lang";

  // UI chrome + common navigation labels
  var UI = {
    nl: {
      "Search this site…": "Zoek op deze site…",
      "Search…": "Zoeken…",
      "Search documentation…": "Zoek documentatie…",
      "On this page": "Op deze pagina",
      "Copy": "Kopiëren",
      "Copied": "Gekopieerd",
      "Home": "Start",
      "Overview": "Overzicht",
      "Understanding ArcLM": "ArcLM begrijpen",
      "Capabilities": "Mogelijkheden",
      "Practice": "Praktijk",
      "Context": "Context",
      "API reference": "API-referentie",
      "Introduction": "Introductie",
      "Motivation & design": "Motivatie & ontwerp",
      "Getting started": "Aan de slag",
      "Core concepts": "Kernconcepten",
      "Architecture": "Architectuur",
      "How it works": "Hoe het werkt",
      "Data & tokenizers": "Data & tokenizers",
      "Models & training": "Modellen & training",
      "Inference & eval": "Inferentie & evaluatie",
      "Agents & security": "Agents & beveiliging",
      "Platform & tooling": "Platform & tools",
      "Examples": "Voorbeelden",
      "Developer workflows": "Ontwikkelaars-workflows",
      "Positioning": "Positionering",
      "Status & limits": "Status & beperkingen",
      "Future roadmap": "Toekomstige roadmap",
      "Reference home": "Referentie start",
      "Quick start (API)": "Quick start (API)",
      "CLI": "CLI",
      "Module docs →": "Module-docs →",
      "← Framework presentation": "← Framework-presentatie",
      "Framework presentation": "Framework-presentatie",
      "ArcLM Framework": "ArcLM Framework"
    }
  };

  // Longer content blocks: keyed by exact trimmed English text (first match wins)
  var CONTENT = {
    nl: {
      "A compact Python toolkit for language-model data workflows, tokenizers, optional PyTorch training, Hugging Face inference, agents, and security. The core install is light; PyTorch is an extra, not a requirement.":
        "Een compacte Python-toolkit voor taalmodel-workflows: data, tokenizers, optionele PyTorch-training, Hugging Face-inferentie, agents en beveiliging. De kerninstallatie is licht; PyTorch is een extra, geen vereiste.",
      "ArcLM is a compact Python toolkit for language-model":
        "ArcLM is een compacte Python-toolkit voor taalmodel",
      "Start with Getting started if you want a working install.":
        "Begin met ‘Aan de slag’ als je een werkende installatie wilt.",
      "Read Architecture before extending the code.":
        "Lees ‘Architectuur’ voordat je de code uitbreidt.",
      "Browse Examples for runnable patterns.":
        "Bekijk ‘Voorbeelden’ voor uitvoerbare patronen.",
      "Check Status & limits before production decisions.":
        "Controleer ‘Status & beperkingen’ vóór productiebeslissingen.",
      "The roadmap separates implemented work from proposals.":
        "De roadmap scheidt geïmplementeerd werk van voorstellen."
    }
  };

  function detect() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "nl";
    } catch (e) {
      return "nl";
    }
  }

  function store(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* ignore */ }
  }

  function translateTree(lang) {
    if (lang !== "nl") return;
    var ui = UI.nl;
    var content = CONTENT.nl;

    // UI strings
    document.querySelectorAll(
      "input[type=search], .sidebar a, .toc-title, .copy-btn, .brand, .crumbs a"
    ).forEach(function (el) {
      var t = el.textContent.trim();
      if (ui[t]) el.textContent = ui[t];
      if (el.placeholder && ui[el.placeholder]) el.placeholder = ui[el.placeholder];
    });

    // Headings
    document.querySelectorAll("h1, h2, h3").forEach(function (el) {
      var t = el.textContent.trim();
      if (ui[t]) {
        // keep badges inside h1/h2
        var badge = el.querySelector(".badge");
        if (badge && el.childNodes[0] && el.childNodes[0].nodeType === 3) {
          el.childNodes[0].textContent = ui[t] + " ";
        } else if (!badge) {
          el.textContent = ui[t];
        }
      }
    });

    // Exact long paragraphs
    document.querySelectorAll("p, li, td, .lead").forEach(function (el) {
      var t = el.textContent.trim();
      if (content[t]) el.textContent = content[t];
    });

    // Common lead fragments — replace leading English sentence if matched
    document.querySelectorAll("p.lead, article > p").forEach(function (el) {
      var t = el.textContent.trim();
      Object.keys(content).forEach(function (key) {
        if (t.indexOf(key) === 0 && t.length > key.length) {
          el.textContent = content[key] + t.slice(key.length);
        }
      });
    });
  }

  function setLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    store(lang);
    var btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.textContent = lang === "nl" ? "EN" : "NL";
      btn.setAttribute("aria-label", lang === "nl" ? "Switch to English" : "Schakel naar Nederlands");
      btn.title = lang === "nl" ? "English" : "Nederlands";
    }
    if (lang === "nl") {
      translateTree("nl");
    } else {
      // Reloading is simplest for EN restore without storing every original string
      // Only reload if we already translated once this session
      if (document.body.getAttribute("data-translated") === "1") {
        window.location.reload();
        return;
      }
    }
    document.body.setAttribute("data-translated", lang === "nl" ? "1" : "0");
  }

  function injectToggle() {
    var top = document.querySelector(".topbar");
    if (!top || document.getElementById("lang-toggle")) return;
    var btn = document.createElement("button");
    btn.id = "lang-toggle";
    btn.type = "button";
    btn.className = "lang-btn";
    btn.textContent = "EN";
    btn.setAttribute("aria-label", "Switch to English");
    btn.title = "English";
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-lang") || "nl";
      setLang(cur === "nl" ? "en" : "nl");
    });
    var form = top.querySelector("form");
    if (form && form.nextSibling) {
      top.insertBefore(btn, form.nextSibling);
    } else {
      top.appendChild(btn);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectToggle();
    document.documentElement.setAttribute("data-lang", "nl");
    document.body.setAttribute("data-translated", "0");
  });
})();
