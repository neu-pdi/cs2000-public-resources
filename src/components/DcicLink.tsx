import React from 'react';
import { useDcicDomain } from '../hooks/useDcicDomain';

interface DcicLinkProps {
  path: string;
  children: React.ReactNode;
}

export function DcicLink({ path, children }: DcicLinkProps) {
  const dcicDomain = useDcicDomain();

  return (
    <a href={`${dcicDomain}${path}`} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
