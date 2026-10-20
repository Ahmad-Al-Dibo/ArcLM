/* ArcLM framework presentation — nav, search, TOC, copy */
(function () {
  "use strict";

  var NAV = [
    { title: "Overview", items: [
      { href: "index.html", label: "Introduction" },
      { href: "philosophy.html", label: "Motivation & design" },
      { href: "getting-started.html", label: "Getting started" }
    ]},
    { title: "Understanding ArcLM", items: [
      { href: "concepts.html", label: "Core concepts" },
      { href: "architecture.html", label: "Architecture" },
      { href: "workflows.html", label: "How it works" }
    ]},
    { title: "Capabilities", items: [
      { href: "features-data.html", label: "Data & tokenizers" },
      { href: "features-training.html", label: "Models & training" },
      { href: "features-inference.html", label: "Inference & eval" },
      { href: "features-agents.html", label: "Agents & security" },
      { href: "features-platform.html", label: "Platform & tooling" }
    ]},
    { title: "Practice", items: [
      { href: "examples.html", label: "Examples" },
      { href: "audiences.html", label: "Developer workflows" }
    ]},
    { title: "Context", items: [
      { href: "positioning.html", label: "Positioning" },
      { href: "status.html", label: "Status & limits" },
      { href: "roadmap.html", label: "Future roadmap" }
    ]},
    { title: "API reference", items: [
      { href: "reference/index.html", label: "Reference home" },
      { href: "reference/quickstart.html", label: "Quick start (API)" },
      { href: "reference/cli.html", label: "CLI" },
      { href: "reference/modules/configs.html", label: "Module docs →" }
    ]}
  ];

  window.__ARCLM_NAV_INDEX = [
    { href: "index.html", title: "Introduction", section: "Overview" },
    { href: "philosophy.html", title: "Motivation & design", section: "Overview" },
    { href: "getting-started.html", title: "Getting started", section: "Overview" },
    { href: "concepts.html", title: "Core concepts", section: "Understanding" },
    { href: "architecture.html", title: "Architecture", section: "Understanding" },
    { href: "workflows.html", title: "How it works", section: "Understanding" },
    { href: "features-data.html", title: "Data & tokenizers", section: "Capabilities" },
    { href: "features-training.html", title: "Models & training", section: "Capabilities" },
    { href: "features-inference.html", title: "Inference & eval", section: "Capabilities" },
    { href: "features-agents.html", title: "Agents & security", section: "Capabilities" },
    { href: "features-platform.html", title: "Platform & tooling", section: "Capabilities" },
    { href: "examples.html", title: "Examples", section: "Practice" },
    { href: "audiences.html", title: "Developer workflows", section: "Practice" },
    { href: "positioning.html", title: "Positioning", section: "Context" },
    { href: "status.html", title: "Status & limits", section: "Context" },
    { href: "roadmap.html", title: "Future roadmap", section: "Context" }
  ];

  function pathFromRoot() {
    return window.DOCS_ROOT || "";
  }

  function activeHref() {
    var path = window.location.pathname.replace(/\\/g, "/");
    return path.split("/").pop() || "index.html";
  }

  function buildSidebar() {
    var el = document.getElementById("sidebar");
    if (!el) return;
    var root = pathFromRoot();
    var current = activeHref();
    var html = "";
    NAV.forEach(function (group) {
      html += "<h2>" + group.title + "</h2><ul>";
      group.items.forEach(function (item) {
        var cls = item.href === current ? ' class="active"' : "";
        html += '<li><a href="' + root + item.href + '"' + cls + ">" + item.label + "</a></li>";
      });
      html += "</ul>";
    });
    el.innerHTML = html;
  }

  function buildToc() {
    var toc = document.getElementById("toc");
    var article = document.querySelector("article");
    if (!toc || !article) return;
    var headings = article.querySelectorAll("h2, h3");
    if (!headings.length) { toc.style.display = "none"; return; }
    var html = '<div class="toc-title">On this page</div><ul>';
    headings.forEach(function (h, i) {
      if (!h.id) h.id = "sec-" + i;
      var pad = h.tagName === "H3" ? ' style="padding-left:0.75rem"' : "";
      html += "<li" + pad + '><a href="#' + h.id + '">' + h.textContent + "</a></li>";
    });
    html += "</ul>";
    toc.innerHTML = html;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function loadIndex(cb) {
    if (window.__ARCLM_IDX) { cb(window.__ARCLM_IDX); return; }
    var idx = window.__ARCLM_NAV_INDEX || [];
    var root = pathFromRoot();
    var pending = idx.length;
    if (!pending) { cb([]); return; }
    var out = [];
    idx.forEach(function (e) {
      fetch(root + e.href)
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (html) {
          var d = document.createElement("div");
          d.innerHTML = html;
          var main = d.querySelector("article") || d;
          out.push({
            title: e.title,
            href: root + e.href,
            section: e.section,
            text: (main.textContent || "").replace(/\s+/g, " ").toLowerCase()
          });
          if (--pending === 0) { window.__ARCLM_IDX = out; cb(out); }
        })
        .catch(function () {
          if (--pending === 0) { window.__ARCLM_IDX = out; cb(out); }
        });
    });
  }

  function search(q) {
    var box = document.getElementById("search-results");
    var article = document.getElementById("doc-content");
    if (!box) return;
    q = (q || "").trim().toLowerCase();
    if (q.length < 2) {
      box.classList.remove("visible");
      box.innerHTML = "";
      if (article) article.style.display = "";
      return;
    }
    if (article) article.style.display = "none";
    box.classList.add("visible");
    box.innerHTML = "<p>Searching…</p>";
    loadIndex(function (idx) {
      var hits = [];
      idx.forEach(function (e) {
        var score = 0;
        if (e.title.toLowerCase().indexOf(q) !== -1) score += 10;
        if (e.text.indexOf(q) !== -1) score += 3;
        if (score > 0) hits.push({ e: e, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      hits = hits.slice(0, 40);
      if (!hits.length) {
        box.innerHTML = "<p>No results for <code>" + escapeHtml(q) + "</code>.</p>";
        return;
      }
      var html = "<p>" + hits.length + " result(s)</p>";
      hits.forEach(function (h) {
        html += '<div class="hit"><a href="' + h.e.href + '">' + escapeHtml(h.e.title) +
          '</a> <span class="path">' + escapeHtml(h.e.section || "") + "</span></div>";
      });
      box.innerHTML = html;
    });
  }

  function bindSearch() {
    var input = document.getElementById("docs-search");
    if (!input) return;
    var t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { search(input.value); }, 200);
    });
    var form = input.form;
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      search(input.value);
    });
  }

  function bindCopy() {
    document.querySelectorAll("pre.code, pre").forEach(function (pre) {
      if (pre.querySelector(".copy-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        var text = code.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = "Copied";
            setTimeout(function () { btn.textContent = "Copy"; }, 1500);
          });
        }
      });
      pre.style.position = "relative";
      btn.style.position = "absolute";
      btn.style.top = "4px";
      btn.style.right = "4px";
      btn.style.fontSize = "0.75rem";
      btn.style.padding = "0.15rem 0.4rem";
      pre.appendChild(btn);
    });
  }

  function bindPager() {
    var el = document.getElementById("pager");
    if (!el) return;
    var root = pathFromRoot();
    var html = "<span></span>";
    if (window.DOCS_PREV) html = '<a href="' + root + window.DOCS_PREV[0] + '">← ' + window.DOCS_PREV[1] + "</a>";
    if (window.DOCS_NEXT) html += '<a href="' + root + window.DOCS_NEXT[0] + '" style="margin-left:auto">' + window.DOCS_NEXT[1] + " →</a>";
    el.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildSidebar();
    buildToc();
    bindSearch();
    bindCopy();
    bindPager();
  });
})();
