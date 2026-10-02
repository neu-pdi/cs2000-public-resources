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
 */
export default function Aside({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={styles.aside}>
      {title ? <p className={styles.title}>Aside: {title}</p> : null}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
