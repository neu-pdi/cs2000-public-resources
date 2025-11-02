import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { getChakraThemeSyncPlugin } from './src/plugins/chakra-theme-sync';
import { createVariableSubstitutionPlugin } from './src/plugins/variable-substitution';
import { oneDarkTheme, oneLightTheme } from './src/theme/one-dark-themes';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Configuration variables
const dcicDomain = 'https://dcic.pdi.run';

/**
 * Calculates the current assignment number based on today's date. Assignments include recitations.
 * After week 15, the assignment number resets to 1
 *
 * @returns The current assignment number, with a minimum of 1 and a max of 12
 * 
 * @author Logan Gill
 */
function currentAssignmentNumber(): string {
  // Uses Thursday as a start date, since assignments are due Thursdays
  const currWeek = currentWeekNumber(new Date(2025, 8, 4, 0, 0, 0));

  // If the current week is greater than 15, reset to 1 since class is over
  if (currWeek > 15) {
    return '1';
  }
  // Return the current week number, up to 12, since there are only 12 assignments
  return (currWeek > 12 ? 12 : currWeek).toString();
}

/**
 * Calculates the current lab number based on today's date. After week 15, the lab number resets to 1
 * 
 * @returns The current lab number, with a minimum of 1 and a maximum of 10
 * 
 * @author Logan Gill
 */
function currentLabNumber(): string {
  // Uses Friday as a start date, since the last lab of each week is hosted on Fridays
  const currWeek = currentWeekNumber(new Date(2025, 8, 5, 0, 0, 0));

  // If the current week is less than or equal to 6, return the current week as is
  if (currWeek <= 6) {
    return currWeek.toString();
  } else if (currWeek <= 12) {
    // If the current week is between 9 and 12, offset to account for 1st skill bundle
    return (currWeek - 1).toString();
  } else if (currWeek >= 10 && currWeek <= 12) {
    // Accounts for holiday Friday-Tuesday swap
    return '9';
  } else if (currWeek > 15) {
    // If the current week is greater than 15, reset to 1 since class is over
    return '1';
  }
  // If the current week is between 13 and 15, offset to account for both skill bundles, max at 10
  return (currWeek - 2 > 10 ? 10 : currWeek - 2).toString();
}

/**
 * Calculates the current lecture day number based on today's date. After week 15, shows the summery page
 * 
 * @returns Gets the current lecture day number to show
 * 
 * @author Logan Gill
 */
function currentDayNumber(): string {
  // Uses Saturday as a start date, so that Monday is the start of the new week (since ``currentWeekNumber`` rounds up)
  const currWeek = currentWeekNumber(new Date(2025, 7, 31, 0, 0, 0));

  // If the current week is greater than 15, show the summary page
  if (currWeek > 15) {
    return 'l0-summary';
  }

  var currDay = 3 * currWeek;
  const currDayOfWeek = new Date().getDay();
  // Offset based on the current day of the week
  if (currDayOfWeek >= 4 || currDayOfWeek === 0) {
    // Offset by 1 for days after Thursday and when it is Sunday
    currDay -= 1;
  } else if (currDayOfWeek >= 3) {
    // Offset by 2 for Wednesday
    currDay -= 2;
  } else {
    // Offset by 3 for days before Wednesday
    currDay -= 3;
  }

  // Offset to account for skill day 1 (on a Thursday)
  if (currWeek > 5 || (currWeek === 5 && currDay >= 4)) {
    currDay -= 1;
  }

  // Offset to account for holiday (on a Monday)
  if (currWeek >= 7) {
    currDay -= 1;
  }

  // Offset to account for skill day 2 (on a Thursday)
  if (currWeek > 9 || (currWeek === 9 && currDay >= 4)) {
    currDay -= 1;
  }

  // Offset to account for holiday
  // Note: Unsure which day (Mon, Wed, Thu) is skipped since holiday is Tuesday
  if (currWeek >= 11) {
    currDay -= 1;
  }

  // Offset to account for holiday (Wednesday + Thursday)
  if (currWeek > 13 || (currWeek === 13 && currDay >= 4)) {
    currDay -= 2;
  } else if (currWeek === 13 && currDay >= 3) {
    // Offset to account for holiday (Wednesday only)
    currDay -= 1;
  }

  return Math.max(Math.min(currDay, 33), 1).toString();
}

/**
 * Calculates the current week number based on a start date, with a minimum of 1
 * 
 * @param startDate The date to use as a starting point (week 0)
 * 
 * @returns The current week number
 * 
 * @author Logan Gill
 */
function currentWeekNumber(startDate: Date): number {
  // Today's date
  const today = new Date();
  // Reset time to midnight since we do not care about hours
  today.setHours(0, 0, 0, 0);
  // Get the difference between the two times (in milliseconds)
  const msDiff = today.getTime() - startDate.getTime();
  // Convert day days
  const dayDiff = msDiff / (1000 * 60 * 60 * 24);
  // Calculate the current week number
  const currWeek = Math.max(Math.ceil(dayDiff / 7), 1);
  return currWeek;
}

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
      type: 'doc',
      docId: currentDayNumber(),
      label: 'Days',
    },
    {
      to: '/days/style/',
      label: 'Style Guide',
    },
    {
      to: '/tables/',
      label: 'Tables',
    },
    {
      label: 'Pyret Documentation',
      href: 'https://pyret.org/docs/latest/index.html',
    },
  ]

  if (new Date() >= new Date(2025, 10, 3)) {
    startingItems.push({
      label: 'Python Documentation',
      href: 'https://docs.python.org/3/',
    })
  }

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
  baseUrl: '/cs2000-public-resources/',

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
          path: 'days',
          routeBasePath: 'days',
          sidebarPath: './sidebars/days.ts',
          editUrl:
            'https://github.com/neu-pdi/cs2000-public-resources/edit/main/',
          remarkPlugins: [remarkMath, createVariableSubstitutionPlugin(dcicDomain)],
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
        id: 'recitation',
        path: 'recitation',
        sidebarPath: './sidebars/recitation.ts',
        routeBasePath: 'recitation',
        remarkPlugins: [createVariableSubstitutionPlugin(dcicDomain)],
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
          to: '/syllabus/',
          label: 'Syllabus',
        },
        {
          position: 'left',
          type: 'dropdown',
          label: "Schedules",
          items: [
            {
              to: '/schedule/',
              label: 'Class Schedule',
            },
            {
              to: '/officehours/',
              label: 'Office Hours / Recitations',
            },
            {
              to: '/skills/#skill-schedule',
              label: 'Skills Schedule',
            },
          ]
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
          type: 'doc',
          docId: currentAssignmentNumber(),
          position: 'left',
          label: 'Homework',
          docsPluginId: 'homework',
        },
        {
          type: 'doc',
          docId: currentLabNumber(),
          position: 'left',
          label: 'Labs',
          docsPluginId: 'lab',
        },
        {
          type: 'doc',
          docId: currentAssignmentNumber(),
          position: 'left',
          label: 'Recitations',
          docsPluginId: 'recitation',
        },
        {
          position: 'left',
          to: '/skills/',
          label: 'Skills',
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
