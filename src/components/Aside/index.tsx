import React from 'react';
import styles from './styles.module.css';

/**
 * A side-note: material that is worth knowing where it comes up, but is not the
 * through-line of the section. Deliberately quieter than an admonition (which this
 * site uses for per-page callouts like the Tables reference), so it reads as a step
 * off to the side rather than a warning.
 *
 * Registered in src/theme/MDXComponents.tsx, so pages use it without importing:
 *
 *     <Aside title="Lists">
 *
 *     ...markdown, including code fences...
 *
 *     </Aside>
 *
 * Each aside is linkable. The id defaults to the slugified title prefixed with
 * `aside-` (so "Lists" is `#aside-lists`, which cannot collide with a heading's own
 * id). Pass `id` explicitly to keep a link stable across a retitling.
 */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Aside({
  title,
  id,
  children,
}: {
  title?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const anchorId = id ?? (title ? `aside-${slugify(title)}` : undefined);
  const label = title ? `Aside: ${title}` : 'Aside';

  return (
    <aside id={anchorId} className={styles.aside}>
      {title ? (
        <p className={styles.title}>
          {label}
          {anchorId && (
            // `hash-link` is the theme's own class, so this behaves like the anchor
            // on a heading: hidden until the line is hovered or the link is focused.
            <a
              className="hash-link"
              href={`#${anchorId}`}
              aria-label={`Direct link to ${label}`}
              title={`Direct link to ${label}`}
            >
              &#8203;
            </a>
          )}
        </p>
      ) : null}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
