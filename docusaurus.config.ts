import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { getChakraThemeSyncPlugin } from './src/plugins/chakra-theme-sync';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NEU CS 2000 Public Resources',
  tagline: 'Resources for CS 2000 (Public)',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://neu-pdi.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/cs2000-public-resources/',

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
          path: 'days',
          routeBasePath: 'days',
          sidebarPath: './sidebars/days.ts',
          editUrl: 'https://github.com/neu-pdi/cs2000-public-resources/edit/main/days/',
          remarkPlugins: [remarkMath],
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
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lab',
        path: 'lab',
        sidebarPath: './sidebars/lab.ts',
        routeBasePath: 'lab',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'recitation',
        path: 'recitation',
        sidebarPath: './sidebars/recitation.ts',
        routeBasePath: 'recitation',
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
      title: 'CS 2000 Public Resources',
      logo: {
        alt: 'Pawtograder Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          position: 'left',
          to: '/schedule/',
          label: 'Schedule',
        },
        {
          type: 'docSidebar',
          sidebarId: 'daysSidebar',
          position: 'left',
          label: 'Days',
        },
        {
          type: 'doc',
          docId: '1',
          position: 'left',
          label: 'Homework',
          docsPluginId: 'homework',
        },
        {
          type: 'doc',
          docId: '1',
          position: 'left',
          label: 'Labs',
          docsPluginId: 'lab',
        },
        {
          type: 'doc',
          docId: '1',
          position: 'left',
          label: 'Recitations',
          docsPluginId: 'recitation',
        },
        {
          position: 'left',
          to: '/outcomes/',
          label: 'Outcomes',
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
      additionalLanguages: ['java'],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
