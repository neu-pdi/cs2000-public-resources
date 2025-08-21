import { visit } from 'unist-util-visit';

export function createVariableSubstitutionPlugin(dcicDomain: string) {
  const regex = /(?:\{\{|%7B%7B)DCIC_DOMAIN(?:\}\}|%7D%7D)/g;
  return function variableSubstitutionPlugin() {
    return (tree: any) => {
      visit(tree, 'text', (node) => {
        if (typeof node.value === 'string') {
          node.value = node.value.replaceAll(regex.source, dcicDomain);
        }
      });

      visit(tree, 'link', (node) => {
        if (typeof node.url === 'string') {
          node.url = node.url.replaceAll(regex, dcicDomain);
        }
      });
    };
  };
}
