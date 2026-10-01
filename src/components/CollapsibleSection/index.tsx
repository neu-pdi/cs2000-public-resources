import React, { useState } from 'react';
import styles from './styles.module.css';

/**
 * Collapsible body for one `##` section of a class page, inserted by the
 * collapsible-sections remark plugin. The section's heading stays above this in the
 * document (see that plugin for why), so the toggle sits just under it.
 */
export default function CollapsibleSection({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const bodyId = `section-${(label ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className={styles.chevron} aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
        {open ? 'Hide' : 'Show'}
        {label ? <span className={styles.srOnly}> {label}</span> : null}
      </button>
      <div id={bodyId} hidden={!open}>
        {children}
      </div>
    </div>
  );
}
