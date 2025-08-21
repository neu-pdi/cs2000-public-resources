import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import type { Token } from '../tree-sitter-highlighter';
import styles from './styles.module.css';

interface TreeSitterLineProps {
  tokens: Token[];
  classNames?: string;
  showLineNumbers?: boolean;
}

export default function TreeSitterLine({
  tokens,
  classNames,
  showLineNumbers,
}: TreeSitterLineProps): ReactNode {
  const lineTokens = tokens.map((token, key) => (
    <span
      key={key}
      className={token.className || 'token'}
    >
      {token.content}
    </span>
  ));

  return (
    <span className={clsx(classNames, showLineNumbers && styles.codeLine)}>
      {showLineNumbers ? (
        <>
          <span className={styles.codeLineNumber} />
          <span className={styles.codeLineContent}>{lineTokens}</span>
        </>
      ) : (
        lineTokens
      )}
      <br />
    </span>
  );
}
