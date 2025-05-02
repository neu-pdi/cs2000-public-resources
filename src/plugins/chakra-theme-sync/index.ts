import { Plugin } from '@docusaurus/types';
import { stripIndent } from 'common-tags';

/**
 * Chakra UI v3 requires a `.light` or `.dark` class on the `<html>` element in order
 * to apply color mode–specific CSS variables. It no longer uses `ColorModeScript`,
 * nor does it read from a `data-theme` attribute.
 *
 * This site uses Docusaurus, which manages its color mode independently via a
 * `data-theme="light" | "dark"` attribute and persists user preference using localStorage.
 *
 * We're also using `next-themes` to manage color mode for Chakra. However,
 * `next-themes` expects either a `class` (e.g., `.light` / `.dark`) or `data-theme`
 * attribute to exist on `<html>`, and Chakra specifically requires the class.
 *
 * On initial load, Docusaurus sets `data-theme` via an inline script, but it does not
 * set a corresponding `.light` or `.dark` class. Even worse, it uses `react-helmet`
 * to manage the `<html>` element during hydration, which clobbers any manually added
 * class attributes (including those added in early scripts).
 *
 * This plugin injects a small inline script that:
 *   - Mirrors the value of `data-theme` to a `.light` or `.dark` class on `<html>`
 *   - Reacts to changes to `data-theme` or `class` (e.g., theme toggles, hydration)
 *   - Re-applies the correct theme class if it gets clobbered by React Helmet
 *   - Avoids infinite mutation loops by checking before updating
 *
 * This ensures Chakra and `next-themes` both function correctly while Docusaurus
 * remains the source of truth for theme state (via `data-theme`).
 */
export function getChakraThemeSyncPlugin() {
  return {
    name: 'chakra-theme-sync',
    injectHtmlTags: () => ({
      preBodyTags: [
        {
          tagName: 'script',
          innerHTML: stripIndent`
						(() => {
              const attributeFilter = ['data-theme', 'class'];
              const themes = ['light', 'dark'];
              const html = document.documentElement;
              function applyThemeClass() {
                const theme = html.getAttribute('data-theme');
                if (!themes.includes(theme) || html.classList.contains(theme)) return;

                const remove = themes.filter(t => t !== theme);
                html.classList.remove(...remove);
                html.classList.add(theme);
              }
              applyThemeClass();
              new MutationObserver(mutations => {
                for (const m of mutations) {
                  if (attributeFilter.includes(m.attributeName)) {
                    applyThemeClass();
                    return;
                  }
                }
              }).observe(html, { attributes: true, attributeFilter });
            })();`,
        },
      ],
    }),
  } satisfies Plugin;
}
