import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * The design recipe, as one card, so that every class shows the same steps in
 * the same words. Each step links to its section of the Design Recipe page
 * (class/recipe.md), which says more about it.
 *
 * Registered in src/theme/MDXComponents.tsx, so pages use it without importing:
 *
 *     <DesignRecipe focus="Template" />
 *     <DesignRecipe focus="Signature, Docstring" later="Examples, Template" />
 *
 * `focus` highlights the steps a class concentrates on, and `later` marks steps
 * the course hasn't reached yet. Both are comma-separated step names.
 */

const STEPS: { name: string; id: string; text: React.ReactNode }[] = [
  {
    name: 'Data definition',
    id: 'data-definition',
    text: <>what kind of data the function works on, with examples of it</>,
  },
  {
    name: 'Template',
    id: 'template',
    text: (
      <>
        the outline of any function on the kind of input data: a{' '}
        <code>_..._temp</code> function, with a line for each part of the data
      </>
    ),
  },
  {
    name: 'Signature',
    id: 'signature',
    text: (
      <>
        the <code>def</code> line, with the types of the parameters and of the
        result, and <code>...</code> as the body, so the file runs
      </>
    ),
  },
  {
    name: 'Docstring',
    id: 'docstring',
    text: <>what the function does (not how), for someone who will call it</>,
  },
  {
    name: 'Examples',
    id: 'examples',
    text: (
      <>
        a <code>test_</code> function: concrete inputs, and what each should give,
        written before the body
      </>
    ),
  },
  {
    name: 'Body',
    id: 'body',
    text: (
      <>
        copy the template's body in place of the <code>...</code>, and fill it in,
        using the examples
      </>
    ),
  },
  {
    name: 'Test and revise',
    id: 'test-and-revise',
    text: <>run the tests; when anything changes, go back through the steps</>,
  },
];

function names(list?: string): Set<string> {
  return new Set(
    (list ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s !== ''),
  );
}

export default function DesignRecipe({
  focus,
  later,
}: {
  focus?: string;
  later?: string;
}) {
  const focused = names(focus);
  const notYet = names(later);
  for (const name of [...focused, ...notYet]) {
    if (!STEPS.some((step) => step.name.toLowerCase() === name)) {
      throw new Error(`DesignRecipe: no step called "${name}"`);
    }
  }
  return (
    <div className={styles.card}>
      <p className={styles.title}>
        <Link to="/class/recipe">The design recipe</Link>
      </p>
      <ol className={styles.steps}>
        {STEPS.map((step) => {
          const key = step.name.toLowerCase();
          const classes = [
            styles.step,
            focused.has(key) ? styles.focus : '',
            notYet.has(key) ? styles.later : '',
          ].join(' ');
          return (
            <li key={step.id} className={classes}>
              <Link to={`/class/recipe#${step.id}`} className={styles.name}>
                {step.name}
              </Link>
              <span className={styles.text}>
                {step.text}
                {notYet.has(key) ? <em className={styles.tag}> (later)</em> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
