(function () {
  const docs = window.ARCLM_DOCS;
  const featureList = document.querySelector("#feature-list");
  const moduleList = document.querySelector("#module-list");
  const cliList = document.querySelector("#cli-list");
  const statusFilter = document.querySelector("#status-filter");
  const searchInput = document.querySelector("#search");
  const themeToggle = document.querySelector("#theme-toggle");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function list(items) {
    return `<ul class="meta-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function code(value) {
    return `<pre><code>${escapeHtml(value)}</code></pre>`;
  }

  function matchesQuery(item, query, status) {
    const haystack = JSON.stringify(item).toLowerCase();
    const statusMatches = !status || item.status === status;
    return statusMatches && (!query || haystack.includes(query));
  }

  function renderFeatures() {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    featureList.innerHTML = docs.features
      .filter((feature) => matchesQuery(feature, query, status))
      .map(
        (feature) => `
          <article class="card" id="${escapeHtml(feature.id)}">
            <span class="status">${escapeHtml(feature.status)}</span>
            <h3>${escapeHtml(feature.title)}</h3>
            <p>${escapeHtml(feature.summary)}</p>
            <p class="muted">${escapeHtml(feature.explanation)}</p>
            <p><strong>Import:</strong> <code>${escapeHtml(feature.importPath)}</code></p>
            <p><strong>When to use it:</strong> ${escapeHtml(feature.whenToUse)}</p>
            <p><strong>Returns:</strong> ${escapeHtml(feature.returns)}</p>
            <p><strong>Common errors:</strong></p>
            ${list(feature.commonErrors)}
            <p><strong>Limitations:</strong></p>
            ${list(feature.limitations)}
            ${code(feature.usage)}
          </article>`
      )
      .join("");
  }

  function renderModules() {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    moduleList.innerHTML = docs.modules
      .filter((mod) => matchesQuery(mod, query, status))
      .map(
        (mod) => `
          <article class="module-card">
            <span class="status">${escapeHtml(mod.status)}</span>
            <h3>${escapeHtml(mod.name)}</h3>
            <p><strong>Import path:</strong> <code>${escapeHtml(mod.importPath)}</code></p>
            <p>${escapeHtml(mod.purpose)}</p>
            <p><strong>Main public API:</strong> ${escapeHtml(mod.publicApi.join(", "))}</p>
            <p><strong>How it fits:</strong> ${escapeHtml(mod.fit)}</p>
            <p><strong>Use it when:</strong> ${escapeHtml(mod.whenToUse)}</p>
            <p><strong>Optional dependencies:</strong> ${escapeHtml(mod.optionalDependencies)}</p>
            <p><strong>Limitations:</strong> ${escapeHtml(mod.limitations)}</p>
          </article>`
      )
      .join("");
  }

  function renderCli() {
    cliList.innerHTML = docs.cli
      .map(
        (item) => `
          <article class="card">
            <span class="status">${escapeHtml(item.status)}</span>
            <h3><code>${escapeHtml(item.command)}</code></h3>
            <p>${escapeHtml(item.purpose)}</p>
            ${code(item.example)}
          </article>`
      )
      .join("");
  }

  function renderStudio() {
    const studio = docs.studio;
    document.querySelector("#studio-content").innerHTML = `
      <article class="studio-panel">
        <span class="status">${escapeHtml(studio.status)}</span>
        <p>${escapeHtml(studio.summary)}</p>
        <p>${escapeHtml(studio.explanation)}</p>
        <p><strong>Start:</strong> ${escapeHtml(studio.start)}</p>
        <p><strong>Workflow:</strong></p>
        ${list(studio.workflow)}
        <p><strong>Limitations:</strong></p>
        ${list(studio.limitations)}
      </article>`;
  }

  function renderLimitations() {
    document.querySelector("#limitations").innerHTML = docs.limitations
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  }

  function renderAll() {
    renderFeatures();
    renderModules();
  }

  function initTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem("arclm-doc-theme");
    } catch {
      stored = null;
    }
    if (stored === "dark" || stored === "light") {
      document.documentElement.dataset.theme = stored;
    }
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("arclm-doc-theme", next);
      } catch {
        // The public site remains usable when browser storage is unavailable.
      }
    });
  }

  docs.statuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusFilter.appendChild(option);
  });

  searchInput.addEventListener("input", renderAll);
  statusFilter.addEventListener("change", renderAll);

  initTheme();
  renderFeatures();
  renderModules();
  renderCli();
  renderStudio();
  renderLimitations();
})();
