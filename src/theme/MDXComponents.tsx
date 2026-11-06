import React, { Children, isValidElement, type ComponentProps } from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Aside from '@site/src/components/Aside';
import CollapsibleSection from '@site/src/components/CollapsibleSection';
import { ClassDate } from '@site/src/components/DateView/DateView';
import DesignRecipe from '@site/src/components/DesignRecipe';
import SkillBadge from '@site/src/components/SkillBadge';
import Unreviewed from '@site/src/components/Unreviewed';

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

// A paragraph holding a <ClassDate />, as in a class page's "Date: <ClassDate />"
// line, is a <div> spaced like a paragraph: the notices ClassDate shows under the
// date are blocks, which can't go inside a <p>.
function P(props: ComponentProps<'p'>) {
  const holdsClassDate = Children.toArray(props.children).some(
    (child) => isValidElement(child) && child.type === ClassDate,
  );
  if (holdsClassDate) {
    return <div style={{ marginBottom: 'var(--ifm-leading)' }}>{props.children}</div>;
  }
  return <p {...props} />;
}

// Registered globally so pages can use <Aside>, <DesignRecipe>, <SkillBadge> and
// <Unreviewed> without an import, and so the collapsible-sections remark plugin
// can emit <CollapsibleSection>.
export default {
  ...MDXComponents,
  a: A,
  p: P,
  Aside,
  CollapsibleSection,
  DesignRecipe,
  SkillBadge,
  Unreviewed,
};
