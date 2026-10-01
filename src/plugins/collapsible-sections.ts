/**
 * Wraps each `##` section's body in a <CollapsibleSection>, so long class pages can be
 * folded down to their headings.
 *
 * The heading itself is deliberately left at the top level of the tree rather than
 * moved inside the JSX element: Docusaurus builds the page's table of contents from
 * those heading nodes, and ClassSummary sums the "(N mins)" values out of the same
 * `toc` export to show an estimated length per class.
 *
 * Headings that are themselves the content ("Skills: ...", "Reference: ...") get no
 * toggle, since there would be nothing to hide.
 */

const SKIP_HEADING = /^(Skills|Reference)\b/;

function headingText(node: any): string {
  return (node.children ?? [])
    .map((child: any) => (typeof child.value === 'string' ? child.value : ''))
    .join('')
    .trim();
}

export function createCollapsibleSectionsPlugin() {
  return function collapsibleSectionsPlugin() {
    return (tree: any) => {
      const children: any[] = tree.children ?? [];
      const out: any[] = [];
      let i = 0;

      while (i < children.length) {
        const node = children[i];
        out.push(node);
        i++;

        if (node.type !== 'heading' || node.depth !== 2) continue;

        const label = headingText(node);
        if (SKIP_HEADING.test(label)) continue;

        // Everything up to the next h1/h2 belongs to this section (h3s included).
        const body: any[] = [];
        while (i < children.length) {
          const next = children[i];
          if (next.type === 'heading' && next.depth <= 2) break;
          body.push(next);
          i++;
        }
        if (body.length === 0) continue;

        out.push({
          type: 'mdxJsxFlowElement',
          name: 'CollapsibleSection',
          attributes: [{ type: 'mdxJsxAttribute', name: 'label', value: label }],
          children: body,
        });
      }

      tree.children = out;
    };
  };
}
