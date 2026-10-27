import MDXComponents from '@theme-original/MDXComponents';
import Aside from '@site/src/components/Aside';
import CollapsibleSection from '@site/src/components/CollapsibleSection';
import DesignRecipe from '@site/src/components/DesignRecipe';

// Registered globally so pages can use <Aside> and <DesignRecipe> without an
// import, and so the collapsible-sections remark plugin can emit
// <CollapsibleSection>.
export default {
  ...MDXComponents,
  Aside,
  CollapsibleSection,
  DesignRecipe,
};
