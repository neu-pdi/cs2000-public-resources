import React from 'react';

/**
 * Marks a page that hasn't been reviewed yet. Put `<Unreviewed />` near the top
 * of the page: it shows a small label there, and while it is on the page, the
 * whole page is tinted orange (`.unreviewed-marker` in src/css/custom.css). Take it
 * off once the page has been reviewed.
 *
 * Registered in src/theme/MDXComponents.tsx, so pages use it without importing.
 */
export default function Unreviewed() {
  return <div className="unreviewed-marker">Pending Review</div>;
}
