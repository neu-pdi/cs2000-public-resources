import { visit } from 'unist-util-visit';

export function createVariableSubstitutionPlugin(dcicDomain: string) {
  return function variableSubstitutionPlugin() {
    return (tree: any) => {
      visit(tree, 'text', (node) => {
        if (typeof node.value === 'string') {
          node.value = node.value.replace(/\{\{DCIC_DOMAIN\}\}/g, dcicDomain);
        }
      });
      
      visit(tree, 'link', (node) => {
        if (typeof node.url === 'string') {
          node.url = node.url.replace(/\{\{DCIC_DOMAIN\}\}/g, dcicDomain);
        }
      });
    };
  };
}