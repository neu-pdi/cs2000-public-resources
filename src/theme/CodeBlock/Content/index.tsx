import React, { type ComponentProps, type ReactNode } from 'react';
import clsx from 'clsx';
import { useCodeBlockContext } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/CodeBlock/Content';
import TreeSitterLine from '../Line/TreeSitterLine';
import { useTreeSitterHighlight } from '../useTreeSitterHighlight';

import styles from './styles.module.css';

// TODO Docusaurus v4: remove useless forwardRef
const Pre = React.forwardRef<HTMLPreElement, ComponentProps<'pre'>>(
  (props, ref) => {
    return (
      <pre
        ref={ref}
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={0}
        {...props}
        className={clsx(props.className, styles.codeBlock, 'thin-scrollbar')}
      />
    );
  },
);

function Code(props: ComponentProps<'code'>) {
  const { metadata } = useCodeBlockContext();
  return (
    <code
      {...props}
      className={clsx(
        props.className,
        styles.codeBlockLines,
        metadata.lineNumbersStart !== undefined &&
          styles.codeBlockLinesWithNumbering,
      )}
      style={{
        ...props.style,
        counterReset:
          metadata.lineNumbersStart === undefined
            ? undefined
            : `line-count ${metadata.lineNumbersStart - 1}`,
      }}
    />
  );
}

export default function CodeBlockContent({
  className: classNameProp,
}: Props): ReactNode {
  const { metadata, wordWrap } = useCodeBlockContext();
  const { code, language, lineNumbersStart, lineClassNames } = metadata;
  
  const { result, loading, error } = useTreeSitterHighlight(code, language);
  
  if (loading) {
    return (
      <Pre
        ref={wordWrap.codeBlockRef}
        className={clsx(classNameProp, 'language-text')}
      >
        <Code>
          <span>Loading...</span>
        </Code>
      </Pre>
    );
  }
  
  if (!result) {
    return (
      <Pre
        ref={wordWrap.codeBlockRef}
        className={clsx(classNameProp, 'language-text')}
      >
        <Code>
          <span>No highlighting available</span>
        </Code>
      </Pre>
    );
  }
  
  return (
    <Pre
      ref={wordWrap.codeBlockRef}
      className={clsx(classNameProp, result.className)}
      style={result.style}
    >
      <Code>
        {result.lines.map((line, i) => (
          <TreeSitterLine
            key={i}
            tokens={line.tokens}
            classNames={lineClassNames[i] ? lineClassNames[i].join(' ') : undefined}
            showLineNumbers={lineNumbersStart !== undefined}
          />
        ))}
      </Code>
    </Pre>
  );
}
