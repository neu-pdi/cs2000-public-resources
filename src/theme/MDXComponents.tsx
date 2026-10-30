import React, { type ComponentProps } from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Aside from '@site/src/components/Aside';
import CollapsibleSection from '@site/src/components/CollapsibleSection';
import DesignRecipe from '@site/src/components/DesignRecipe';
import SkillBadge from '@site/src/components/SkillBadge';

const SKILL_LINK = /^\/skills\/?#(\d+)$/;

// A link to a skill whose text is just its number, as in a page's
// "Skills: [3](</skills/#3>)" line, shows as that skill's badge.
function A(props: ComponentProps<'a'>) {
  const match = SKILL_LINK.exec(props.href ?? '');
  if (match && props.children === match[1]) {
    return <SkillBadge skill={Number(match[1])} link />;
  }
  return <MDXComponents.a {...props} />;
}

// Registered globally so pages can use <Aside>, <DesignRecipe> and <SkillBadge>
// without an import, and so the collapsible-sections remark plugin can emit
// <CollapsibleSection>.
export default {
  ...MDXComponents,
  a: A,
  Aside,
  CollapsibleSection,
  DesignRecipe,
  SkillBadge,
};
