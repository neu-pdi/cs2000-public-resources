import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { SKILL_COLORS } from '../../data/skill-colors';
import styles from './styles.module.css';

/**
 * A skill's number, in the skill's calendar color: at the start of its heading on
 * the Skills page, and, with `link`, wherever a page links to the skill.
 */
export default function SkillBadge({ skill, link = false }: { skill: number; link?: boolean }) {
  const style = { backgroundColor: SKILL_COLORS[skill] };
  if (!link) {
    return (
      <span className={styles.badge} style={style}>
        {skill}
      </span>
    );
  }
  return (
    <Link
      to={`/skills/#${skill}`}
      className={clsx(styles.badge, styles.link)}
      style={style}
      aria-label={`Skill ${skill}`}
    >
      {skill}
    </Link>
  );
}
