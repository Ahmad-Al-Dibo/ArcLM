const script = `
(function () {
  try {
    var key = "arclm-theme";
    var stored = window.localStorage.getItem(key);
    var root = document.documentElement;
    if (stored === "light" || stored === "dark") {
      root.dataset.theme = stored;
      root.style.colorScheme = stored;
    } else {
      root.removeAttribute("data-theme");
      root.style.colorScheme = "";
    }
  } catch (_) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
