import MDXComponents from '@theme-original/MDXComponents';
import CollapsibleSection from '@site/src/components/CollapsibleSection';

// Registered globally so the collapsible-sections remark plugin can emit
// <CollapsibleSection> without every class page needing an import.
export default {
  ...MDXComponents,
  CollapsibleSection,
};
