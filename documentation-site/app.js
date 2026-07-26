
(function () {
  const docs = window.ARCLM_DOCS;
  const nav = window.ARCLM_NAVIGATION;
  const api = window.ARCLM_API_CATALOG || [];
  const modules = window.ARCLM_MODULE_CATALOG || [];
  const examplesData = window.ARCLM_EXAMPLES || { examples: [], projects: [] };
  const models = window.ARCLM_SUPPORTED_MODELS || [];
  const datasetFormats = window.ARCLM_DATASET_FORMATS || [];
  const configRows = window.ARCLM_CONFIGURATION_CATALOG || [];
  const errors = window.ARCLM_ERRORS || [];
  const searchIndex = window.ARCLM_SEARCH_INDEX || [];
  const pageId = document.body.dataset.pageId;
  const page = docs.pages.find((item) => item.id === pageId) || docs.pages[0];
  const prefix = relativePrefix(document.body.dataset.pageHref || "index.html");

  function relativePrefix(href) {
    const depth = href.split("/").length - 1;
    return "../".repeat(depth);
  }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  }
  function codeBlock(code, language, filename) {
    const download = filename ? `<a class="download-link" href="${esc(prefix + filename)}" download>Download</a>` : "";
    return `<pre><span class="code-label">${esc(language || "text")}</span><span class="code-tools"><button type="button" class="copy-code">Copy</button>${download}</span><code>${esc(code)}</code></pre>`;
  }
  function table(columns, rows) {
    return `<table><thead><tr>${columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }
  function list(items) {
    return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }
  function renderNav() {
    const container = document.querySelector("#site-nav");
    container.innerHTML = `<input id="site-search" class="nav-search" type="search" placeholder="Search docs" aria-label="Search documentation" />` + nav.map((group) => {
      const open = group.items.some((item) => item.id === pageId) ? " open" : "";
      return `<details class="nav-group"${open}><summary>${esc(group.group)}</summary>${group.items.map((item) => `<a class="nav-link" href="${esc(prefix + item.href)}" ${item.id === pageId ? 'aria-current="page"' : ""}>${esc(item.title)}</a>`).join("")}</details>`;
    }).join("");
    document.querySelector("#site-search").addEventListener("input", handleSearch);
  }
  function renderPage() {
    const article = document.querySelector("#page-content");
    article.className = "doc-article";
    article.innerHTML = `<span class="status">${esc(page.status)}</span><h1>${esc(page.title)}</h1><p class="summary">${esc(page.summary)}</p>${page.sections.map(renderSection).join("")}${specialContent()}`;
    document.querySelector("#breadcrumbs").innerHTML = `<a href="${prefix}index.html">ArcLM Docs</a><span>/</span><span>${esc(page.title)}</span>`;
    renderToc();
    renderPrevNext();
    renderFeedback();
    enhanceCodeBlocks();
  }
  function renderSection(section) {
    const id = slug(section.title);
    let html = `<section id="${id}"><h2>${esc(section.title)}</h2>`;
    if (section.body) html += `<p>${esc(section.body)}</p>`;
    if (section.items) html += list(section.items);
    if (section.table) html += table(section.table.columns, section.table.rows);
    if (section.code) html += codeBlock(section.code, section.language, section.filename);
    html += "</section>";
    return html;
  }
  function specialContent() {
    if (pageId === "api-index") return apiIndex();
    if (pageId.startsWith("api-") && pageId !== "api-index") return apiDetails(pageId.replace("api-", ""));
    if (pageId === "modules") return moduleExplorer();
    if (pageId === "classes") return apiKindIndex("class", "Public classes");
    if (pageId === "functions") return apiKindIndex("function", "Public functions");
    if (pageId === "deprecated-apis") return apiStatusIndex("Deprecated", "Deprecated public APIs");
    if (pageId === "supported-models") return supportedModels();
    if (pageId === "dataset-formats") return datasetFormatsView();
    if (pageId === "configuration") return configurationView();
    if (pageId === "errors") return errorsView();
    if (pageId.startsWith("examples-")) return examplesView();
    return "";
  }
  function apiIndex() {
    return `<section id="api-search"><h2>Search APIs</h2><div class="filter-row"><input id="api-filter" type="search" placeholder="Search API names, imports and categories" /></div><div id="api-results" class="card-grid"></div></section>`;
  }
  function apiCard(entry) {
    return `<article class="card api-card" id="${slug(entry.name)}"><span class="status">${esc(entry.status)}</span><h3>${esc(entry.name)}</h3><p><strong>Fully qualified:</strong> <code>${esc(entry.qualifiedName || entry.importPath)}</code></p><p><strong>Canonical import:</strong> <code>${esc(entry.canonicalImport || entry.importPath)}</code></p>${entry.alternativeImport ? `<p><strong>Alternative import:</strong> <code>${esc(entry.alternativeImport)}</code></p>` : ""}<p>${esc(entry.summary)}</p><p><strong>Signature:</strong> <code>${esc(entry.signature)}</code></p>${table(["Parameter", "Type", "Default"], entry.parameters || [])}${entry.members && entry.members.length ? table(["Member", "Purpose"], entry.members) : ""}<p><strong>Returns:</strong> ${esc(entry.returns || "See docstring.")}</p><p><strong>Raises:</strong> ${esc((entry.errors || []).join(", ") || "No documented public errors.")}</p><p><strong>Optional dependencies:</strong> ${esc(entry.optionalDependencies || "None")}</p><p><strong>Security:</strong> ${esc(entry.security || "Follow subsystem guide.")}</p><p><strong>Limitations:</strong> ${esc(entry.limitations || "None listed.")}</p>${codeBlock(entry.usage, "python")}</article>`;
  }
  function apiDetails(category) {
    const entries = api.filter((entry) => entry.category === category);
    return `<section id="api-members"><h2>API members</h2><div class="card-grid">${entries.map(apiCard).join("") || "<p>No public entries in this category yet.</p>"}</div></section>`;
  }
  function apiKindIndex(kind, title) {
    const entries = api.filter((entry) => entry.kind === kind || (kind === "function" && entry.kind === "async function") || (kind === "class" && entry.kind === "exception"));
    return `<section id="${slug(title)}"><h2>${esc(title)}</h2><div class="filter-row"><input id="kind-filter" type="search" placeholder="Search ${esc(title.toLowerCase())}" /><select id="kind-status"><option value="">All statuses</option>${docs.statuses.map((status) => `<option>${esc(status)}</option>`).join("")}</select></div><div id="kind-results" class="card-grid"></div></section>`;
  }
  function apiStatusIndex(status, title) {
    const entries = api.filter((entry) => entry.status === status);
    return `<section id="${slug(title)}"><h2>${esc(title)}</h2><div class="card-grid">${entries.map(apiCard).join("") || "<p>No deprecated public APIs are documented.</p>"}</div></section>`;
  }
  function moduleExplorer() {
    return `<section id="module-list"><h2>Modules</h2><div class="card-grid">${modules.map((mod) => `<article class="card"><span class="status">${esc(mod.status)}</span><h3><code>${esc(mod.importPath)}</code></h3><p>${esc(mod.purpose)}</p><p><strong>Use when:</strong> ${esc(mod.whenToUse)}</p><p><strong>Public exports:</strong> ${esc(mod.exportCount || 0)}</p><p><strong>Examples:</strong> ${esc((mod.examples || []).join(", ") || "None mapped")}</p><p><strong>Optional dependencies:</strong> ${esc(mod.optionalDependencies)}</p><p><strong>Limitations:</strong> ${esc(mod.limitations || "")}</p></article>`).join("")}</div></section>`;
  }
  function supportedModels() {
    const providers = Array.from(new Set(models.map((m) => m.provider)));
    const families = Array.from(new Set(models.map((m) => m.family)));
    const tasks = Array.from(new Set(models.flatMap((m) => m.tasks || [])));
    const extras = Array.from(new Set(models.flatMap((m) => m.optionalDependencies || [])));
    return `<section id="model-catalog"><h2>Model catalog</h2><div class="filter-row"><input id="model-filter" type="search" placeholder="Search models" /><select id="model-status"><option value="">All statuses</option><option value="native">Native</option><option value="tested">Tested</option><option value="compatible">Compatible by integration</option><option value="experimental">Experimental</option><option value="unsupported">Unsupported</option></select><select id="model-provider"><option value="">All providers</option>${providers.map((p) => `<option>${esc(p)}</option>`).join("")}</select><select id="model-family"><option value="">All families</option>${families.map((f) => `<option>${esc(f)}</option>`).join("")}</select><select id="model-task"><option value="">All tasks</option>${tasks.map((task) => `<option>${esc(task)}</option>`).join("")}</select><select id="model-extra"><option value="">All extras</option>${extras.map((extra) => `<option>${esc(extra)}</option>`).join("")}</select></div><div id="model-results" class="model-grid"></div><h2>Comparison table</h2><div id="model-table"></div></section>`;
  }
  function datasetFormatsView() {
    return `<section id="formats"><h2>Formats</h2>${datasetFormats.map((fmt) => `<article class="card" id="${esc(fmt.id)}"><span class="status">${esc(fmt.status)}</span><h3>${esc(fmt.name)}</h3><p><strong>Structure:</strong> ${esc(fmt.structure)}</p><p><strong>Required fields:</strong> ${esc(fmt.requiredFields)}</p><p><strong>When to use:</strong> ${esc(fmt.whenToUse)}</p>${list(fmt.commonMistakes)}${codeBlock(fmt.usage, "python")}</article>`).join("")}<h2>Downloadable tiny datasets</h2>${list(["assets/datasets/tiny-causal.txt", "assets/datasets/tiny-records.json", "assets/datasets/tiny-records.jsonl", "assets/datasets/tiny-instructions.jsonl", "assets/datasets/tiny-table.csv"].map((href) => `<a href="${prefix + href}" download>${href.split("/").pop()}</a>`))}</section>`;
  }
  function configurationView() {
    return `<section id="configuration-fields"><h2>Fields</h2>${table(["Area", "Field", "Type", "Default", "Meaning"], configRows)}</section>`;
  }
  function errorsView() {
    return `<section id="error-list"><h2>Error codes</h2>${table(["Code", "Meaning", "How to fix", "Where it appears"], errors)}</section>`;
  }
  function examplesView() {
    const isComplete = pageId === "examples-complete";
    if (isComplete) {
      return `<section id="complete-projects"><h2>Projects</h2><div class="card-grid">${examplesData.projects.map((project) => `<article class="card"><h3>${esc(project.title)}</h3><p>${esc(project.goal)}</p>${table(["Part", "Value"], [["Files", project.files.join(", ")], ["Dataset", project.dataset], ["Tokenizer", project.tokenizer], ["Model", project.modelConfiguration], ["Training", project.trainingConfiguration], ["Expected output", project.expectedOutput]])}<a href="${prefix + project.download}" download>Download starter file</a></article>`).join("")}</div></section>`;
    }
    const tags = Array.from(new Set(examplesData.examples.flatMap((example) => example.tags || [])));
    return `<section id="example-cards"><h2>Examples</h2><div class="filter-row"><input id="example-filter" type="search" placeholder="Search examples" /><select id="example-difficulty"><option value="">All difficulties</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><select id="example-tag"><option value="">All topics</option>${tags.map((tag) => `<option>${esc(tag)}</option>`).join("")}</select></div><div id="example-results" class="example-grid"></div></section>`;
  }
  function renderToc() {
    const links = Array.from(document.querySelectorAll("#page-content h2")).map((heading) => `<a href="#${heading.parentElement.id}">${esc(heading.textContent)}</a>`);
    document.querySelector("#toc").innerHTML = links.length ? `<strong>On this page</strong>${links.join("")}` : "";
  }
  function renderPrevNext() {
    const prevTitle = document.body.dataset.prevTitle;
    const prevHref = document.body.dataset.prevHref;
    const nextTitle = document.body.dataset.nextTitle;
    const nextHref = document.body.dataset.nextHref;
    document.querySelector("#prev-next").innerHTML = `${prevTitle ? `<a href="${esc(prevHref)}">Previous: ${esc(prevTitle)}</a>` : "<span></span>"}${nextTitle ? `<a href="${esc(nextHref)}">Next: ${esc(nextTitle)}</a>` : "<span></span>"}`;
  }
  function renderFeedback() {
    const issueTitle = encodeURIComponent(`Docs feedback: ${page.title}`);
    const issueBody = encodeURIComponent(`Page: ${page.title}\nVersion: ${docs.version}\nURL: ${page.href}\n\nDescribe the issue or improvement:\n`);
    document.querySelector("#feedback").innerHTML = `<h2>Page feedback</h2><p>This local widget does not submit or track anything automatically.</p><div class="feedback-actions"><button type="button" id="helpful-yes">Helpful</button><button type="button" id="copy-page-id">Copy page ID</button><a class="button-link external" target="_blank" rel="noopener noreferrer" href="https://github.com/ahmad-al-dibo/arclm/issues/new?title=${issueTitle}&body=${issueBody}">Open issue draft</a></div><p id="feedback-status" role="status"></p>`;
    const status = document.querySelector("#feedback-status");
    document.querySelector("#helpful-yes").addEventListener("click", () => {
      status.textContent = "Thanks. Stored only in this browser session.";
      try { sessionStorage.setItem(`arclm-docs-helpful-${page.id}`, "true"); } catch {}
    });
    document.querySelector("#copy-page-id").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(`${page.id} (${docs.version})`);
        status.textContent = "Page ID copied.";
      } catch {
        status.textContent = `${page.id} (${docs.version})`;
      }
    });
  }
  function enhanceCodeBlocks() {
    document.querySelectorAll(".copy-code").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.closest("pre").querySelector("code").textContent;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
        } catch {
          button.textContent = "Copy unavailable";
        }
        setTimeout(() => { button.textContent = "Copy"; }, 1200);
      });
    });
  }
  function setupSpecialFilters() {
    const apiFilter = document.querySelector("#api-filter");
    if (apiFilter) {
      const results = document.querySelector("#api-results");
      const draw = () => {
        const q = apiFilter.value.toLowerCase();
        results.innerHTML = api.filter((entry) => JSON.stringify(entry).toLowerCase().includes(q)).map(apiCard).join("");
        enhanceCodeBlocks();
      };
      apiFilter.addEventListener("input", draw);
      draw();
    }
    const kindFilter = document.querySelector("#kind-filter");
    if (kindFilter) {
      const results = document.querySelector("#kind-results");
      const status = document.querySelector("#kind-status");
      const wantClass = pageId === "classes";
      const draw = () => {
        const q = kindFilter.value.toLowerCase();
        const s = status.value;
        const filtered = api.filter((entry) => {
          const kindMatches = wantClass ? (entry.kind === "class" || entry.kind === "exception") : (entry.kind === "function" || entry.kind === "async function");
          return kindMatches && (!s || entry.status === s) && (!q || JSON.stringify(entry).toLowerCase().includes(q));
        });
        results.innerHTML = filtered.map(apiCard).join("");
        enhanceCodeBlocks();
      };
      kindFilter.addEventListener("input", draw);
      status.addEventListener("change", draw);
      draw();
    }
    const modelFilter = document.querySelector("#model-filter");
    if (modelFilter) {
      const draw = () => {
        const q = modelFilter.value.toLowerCase();
        const status = document.querySelector("#model-status").value;
        const provider = document.querySelector("#model-provider").value;
        const family = document.querySelector("#model-family").value;
        const task = document.querySelector("#model-task").value;
        const extra = document.querySelector("#model-extra").value;
        const filtered = models.filter((model) => (!q || JSON.stringify(model).toLowerCase().includes(q)) && (!status || model.status === status) && (!provider || model.provider === provider) && (!family || model.family === family) && (!task || (model.tasks || []).includes(task)) && (!extra || (model.optionalDependencies || []).includes(extra)));
        document.querySelector("#model-results").innerHTML = filtered.map((model) => `<article class="card" id="${esc(model.id)}"><span class="status">${esc(model.status)}</span><h3>${esc(model.name)}</h3><p>${model.modelId ? `<code>${esc(model.modelId)}</code> <button type="button" class="copy-model" data-model="${esc(model.modelId)}">Copy</button>` : "Native ArcLM model"}</p><p>${esc(model.notes)}</p><p><strong>Tasks:</strong> ${esc(model.tasks.join(", "))}</p><p><strong>Operations:</strong> ${esc(model.testedOperations.join(", ") || "None")}</p><p><strong>Required extras:</strong> ${esc(model.optionalDependencies.join(", ") || "None")}</p><p><strong>Limitations:</strong> ${esc((model.limitations || []).join(", ") || "None listed")}</p>${model.url ? `<a class="external" target="_blank" rel="noopener noreferrer" href="${esc(model.url)}">Model page</a>` : ""}</article>`).join("");
        document.querySelector("#model-table").innerHTML = table(["Model", "Provider", "Model ID", "Status", "Tasks", "Operations", "Extras"], filtered.map((model) => [model.name, model.provider, model.modelId || "Native", model.status, model.tasks.join(", "), model.testedOperations.join(", ") || "None", model.optionalDependencies.join(", ") || "None"]));
        document.querySelectorAll(".copy-model").forEach((button) => button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(button.dataset.model); button.textContent = "Copied"; } catch { button.textContent = "Copy unavailable"; } }));
      };
      ["input", "change"].forEach((event) => {
        modelFilter.addEventListener(event, draw);
        document.querySelector("#model-status").addEventListener(event, draw);
        document.querySelector("#model-provider").addEventListener(event, draw);
        document.querySelector("#model-family").addEventListener(event, draw);
        document.querySelector("#model-task").addEventListener(event, draw);
        document.querySelector("#model-extra").addEventListener(event, draw);
      });
      draw();
    }
    const exampleFilter = document.querySelector("#example-filter");
    if (exampleFilter) {
      const results = document.querySelector("#example-results");
      const difficulty = document.querySelector("#example-difficulty");
      const tag = document.querySelector("#example-tag");
      const draw = () => {
        const q = exampleFilter.value.toLowerCase();
        const d = difficulty.value;
        const t = tag.value;
        results.innerHTML = examplesData.examples.filter((ex) => (!q || JSON.stringify(ex).toLowerCase().includes(q)) && (!d || ex.difficulty === d) && (!t || (ex.tags || []).includes(t))).map((ex) => `<article class="card"><h3>${esc(ex.title)}</h3><span class="status">${esc(ex.difficulty)}</span><p>${esc(ex.teaches)}</p><p><strong>Runtime:</strong> ${esc(ex.runtime)}. <strong>Device:</strong> ${esc(ex.device)}.</p><p><strong>Tags:</strong> ${esc(ex.tags.join(", "))}</p>${codeBlock(ex.code, "python", ex.download)}</article>`).join("");
        enhanceCodeBlocks();
      };
      exampleFilter.addEventListener("input", draw);
      difficulty.addEventListener("change", draw);
      tag.addEventListener("change", draw);
      draw();
    }
  }
  function handleSearch(event) {
    const q = event.target.value.trim().toLowerCase();
    const panel = document.querySelector("#search-panel");
    if (!q) {
      panel.hidden = true;
      return;
    }
    const results = searchIndex.filter((item) => JSON.stringify(item).toLowerCase().includes(q)).slice(0, 30);
    panel.hidden = false;
    panel.innerHTML = `<h2>Search results</h2>${results.map((item) => `<a class="card" href="${prefix + item.page}${item.section ? "#" + item.section : ""}"><strong>${esc(item.title)}</strong><br /><span>${esc(item.type)} - ${esc(item.description)}</span></a>`).join("") || "<p>No results.</p>"}`;
  }
  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem("arclm-doc-theme"); } catch {}
    if (stored === "dark" || stored === "light") document.documentElement.dataset.theme = stored;
    document.querySelector("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("arclm-doc-theme", next); } catch {}
    });
  }
  function initVersionSelector() {
    const selector = document.querySelector("#version-select");
    const versions = docs.versions || [{ label: `Current (${docs.version})`, href: "index.html", current: true }];
    selector.innerHTML = versions.map((version) => `<option value="${esc(version.href)}" ${version.current ? "selected" : ""}>${esc(version.label)}</option>`).join("");
    selector.addEventListener("change", () => {
      const selected = selector.value;
      if (selected && selected !== "index.html") window.location.href = prefix + selected;
    });
  }
  document.querySelector("#nav-toggle").addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    document.querySelector("#nav-toggle").setAttribute("aria-expanded", String(open));
  });
  initTheme();
  initVersionSelector();
  renderNav();
  renderPage();
  setupSpecialFilters();
})();
