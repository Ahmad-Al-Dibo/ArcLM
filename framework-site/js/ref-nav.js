/* API reference sidebar (under framework-site/reference/) */
(function () {
  "use strict";

  var NAV = [
    { title: "Reference home", items: [
      { href: "index.html", label: "Introduction" },
      { href: "install.html", label: "Installation" },
      { href: "quickstart.html", label: "Quick start" },
      { href: "packages.html", label: "Package map" }
    ]},
    { title: "Core modules", items: [
      { href: "modules/configs.html", label: "arclm.configs" },
      { href: "modules/tokenizers.html", label: "arclm.tokenizers" },
      { href: "modules/datasets.html", label: "arclm.datasets" },
      { href: "modules/security.html", label: "arclm.security" },
      { href: "modules/agents.html", label: "arclm.agents" },
      { href: "modules/tracking.html", label: "arclm.tracking" },
      { href: "modules/search-hp.html", label: "arclm.search" },
      { href: "modules/logics.html", label: "arclm.logics" },
      { href: "modules/exceptions.html", label: "arclm.exceptions" }
    ]},
    { title: "Training stack", items: [
      { href: "modules/models.html", label: "arclm.models" },
      { href: "modules/training.html", label: "arclm.training" },
      { href: "modules/inference.html", label: "arclm.inference" },
      { href: "modules/finetuning.html", label: "arclm.finetuning" },
      { href: "modules/checkpoints.html", label: "arclm.checkpoints" },
      { href: "modules/evaluation.html", label: "arclm.evaluation" },
      { href: "modules/peft.html", label: "arclm.peft" },
      { href: "modules/inspection.html", label: "arclm.inspection" }
    ]},
    { title: "Reference", items: [
      { href: "cli.html", label: "CLI" },
      { href: "errors.html", label: "Errors" },
      { href: "troubleshooting.html", label: "Troubleshooting" },
      { href: "examples-index.html", label: "Examples catalogue" }
    ]}
  ];

  function root() {
    return "../";
  }

  function active() {
    var path = window.location.pathname.replace(/\\/g, "/");
    var file = path.split("/").pop() || "index.html";
    if (path.indexOf("modules") !== -1) return "modules/" + file;
    return file;
  }

  function buildSidebar() {
    var el = document.getElementById("sidebar");
    if (!el) return;
    var r = root();
    var current = active();
    var html = '<ul><li><a href="' + r + 'index.html">← Framework presentation</a></li></ul>';
    NAV.forEach(function (group) {
      html += "<h2>" + group.title + "</h2><ul>";
      group.items.forEach(function (item) {
        var cls = item.href === current ? ' class="active"' : "";
        html += '<li><a href="' + item.href + '"' + cls + ">" + item.label + "</a></li>";
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
    toc.innerHTML = html + "</ul>";
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var INDEX = [];
  function collectIndex() {
    if (INDEX.length) return INDEX;
    NAV.forEach(function (g) {
      g.items.forEach(function (item) {
        INDEX.push({ title: item.label, href: item.href, section: g.title });
      });
    });
    return INDEX;
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
    var idx = collectIndex();
    var pending = idx.length;
    var out = [];
    idx.forEach(function (e) {
      fetch(e.href)
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (html) {
          var d = document.createElement("div");
          d.innerHTML = html;
          var main = d.querySelector("article") || d;
          out.push({
            title: e.title,
            href: e.href,
            section: e.section,
            text: (main.textContent || "").replace(/\s+/g, " ").toLowerCase()
          });
          if (--pending === 0) finish(q, out, box);
        })
        .catch(function () { if (--pending === 0) finish(q, out, box); });
    });
  }

  function finish(q, out, box) {
    var hits = [];
    out.forEach(function (e) {
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
        '</a> <span class="path">' + escapeHtml(h.e.section) + "</span></div>";
    });
    box.innerHTML = html;
  }

  function bindSearch() {
    var input = document.getElementById("docs-search");
    if (!input) return;
    var t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { search(input.value); }, 200);
    });
    if (input.form) input.form.addEventListener("submit", function (e) {
      e.preventDefault();
      search(input.value);
    });
  }

  function bindCopy() {
    document.querySelectorAll("pre").forEach(function (pre) {
      if (pre.querySelector(".copy-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code.textContent).then(function () {
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

  document.addEventListener("DOMContentLoaded", function () {
    buildSidebar();
    buildToc();
    bindSearch();
    bindCopy();
  });
})();
