import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { getChakraThemeSyncPlugin } from './src/plugins/chakra-theme-sync';
import { createCollapsibleSectionsPlugin } from './src/plugins/collapsible-sections';
import { createVariableSubstitutionPlugin } from './src/plugins/variable-substitution';
import { oneDarkTheme, oneLightTheme } from './src/theme/one-dark-themes';
import { getDocumentId } from './src/utils/calendar';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Configuration variables
const dcicDomain = 'https://dcic.pdi.run';

/**
 * Gets the items to show in the Notes dropdown based on today's date/what students may need to see
 * 
 * @returns The items to show in the Notes dropdown
 * 
 * @author Logan Gill
 */
function notesDropdownItems() {
  var startingItems = [
    {
      to: '/current-class/',
      activeBasePath: '/class',
      label: 'Classes',
    },
    {
      to: '/class/style/',
      label: 'Style Guide',
    },
    {
      to: '/pll/',
      activeBasePath: '/pll',
      label: 'PLL Reference',
    },
    {
      to: '/pll/tables/',
      label: 'Tables',
    },
    {
      label: 'Python Documentation',
      href: 'https://docs.python.org/3/',
    },
  ]

  return startingItems;
}

const config: Config = {
  title: 'NEU CS 2000 Public Resources',
  tagline: 'Resources for CS 2000 (Public)',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://neu-pdi.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // Overridable so past semesters can be built into a subpath; see scripts/archive-semester.sh
  baseUrl: process.env.BASE_URL ?? '/cs2000-public-resources/',

  // Custom fields for reusable variables
  customFields: {
    dcicDomain,
  },

  // GitHub pages deployment config.
  organizationName: 'neu-pdi', // Usually your GitHub org/user name.
  projectName: 'cs2000-public-resources', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'class',
          routeBasePath: 'class',
          sidebarPath: './sidebars/class.ts',
          editUrl:
            'https://github.com/neu-pdi/cs2000-public-resources/edit/main/',
          remarkPlugins: [
            remarkMath,
            createVariableSubstitutionPlugin(dcicDomain),
            createCollapsibleSectionsPlugin(),
          ],
          rehypePlugins: [rehypeKatex],
        },
        pages: {},

        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    getChakraThemeSyncPlugin,
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'homework',
        path: 'homework',
        sidebarPath: './sidebars/homework.ts',
        routeBasePath: 'homework',
        remarkPlugins: [createVariableSubstitutionPlugin(dcicDomain)],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lab',
        path: 'lab',
        sidebarPath: './sidebars/lab.ts',
        routeBasePath: 'lab',
        remarkPlugins: [createVariableSubstitutionPlugin(dcicDomain)],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'practice',
        path: 'practice',
        sidebarPath: './sidebars/practice.ts',
        routeBasePath: 'practice',
        remarkPlugins: [createVariableSubstitutionPlugin(dcicDomain)],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'pll',
        path: 'pll',
        sidebarPath: './sidebars/pll.ts',
        routeBasePath: 'pll',
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/qwan-social-card.png',
    navbar: {
      title: 'CS 2000',
      logo: {
        alt: 'Pawtograder Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          position: 'left',
          to: '/syllabus/',
          label: 'Syllabus',
        },
        {
          position: 'left',
          to: '/staff/',
          label: 'Staff',
        },
        {
          position: 'left',
          type: 'dropdown',
          label: 'Notes',
          items: notesDropdownItems(),
        },
        {
          to: '/current-homework/',
          activeBasePath: '/homework',
          position: 'left',
          label: 'Homework',
          docsPluginId: 'homework',
        },
        {
          to: '/current-lab/',
          activeBasePath: '/lab',
          position: 'left',
          label: 'Labs',
          docsPluginId: 'lab',
        },
        {
          type: 'doc',
          docId: getDocumentId('homework'),
          position: 'left',
          label: 'Extra Practice',
          docsPluginId: 'practice',
        },
        {
          position: 'left',
          to: '/skills/',
          label: 'Skills',
        },
        {
          position: 'left',
          to: '/faqs/',
          label: 'FAQs',
        },
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Tutorial',
      //         to: '/docs/intro',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       {
      //         label: 'Stack Overflow',
      //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //       },
      //       {
      //         label: 'Discord',
      //         href: 'https://discordapp.com/invite/docusaurus',
      //       },
      //       {
      //         label: 'X',
      //         href: 'https://x.com/docusaurus',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: '/blog',
      //       },
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/facebook/docusaurus',
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} Daniel Patterson and contributors, Licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">CC-BY-NC-SA 4.0</a>`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      additionalLanguages: ['python', 'javascript'],
      theme: oneLightTheme,
      darkTheme: oneDarkTheme,
    },
  } satisfies Preset.ThemeConfig,
  future: {
    experimental_storage: {
      type: 'localStorage',
      namespace: true,
    },
  },
};

export default config;
