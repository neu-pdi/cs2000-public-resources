import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useDcicDomain(): string {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields?.dcicDomain as string;
}