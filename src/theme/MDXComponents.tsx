import MDXComponents from '@theme-original/MDXComponents';
import Aside from '@site/src/components/Aside';
import CollapsibleSection from '@site/src/components/CollapsibleSection';

// Registered globally so pages can use <Aside> without an import, and so the
// collapsible-sections remark plugin can emit <CollapsibleSection>.
export default {
  ...MDXComponents,
  Aside,
  CollapsibleSection,
};
