import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { getChakraThemeSyncPlugin } from './src/plugins/chakra-theme-sync';
import { createVariableSubstitutionPlugin } from './src/plugins/variable-substitution';
import { oneDarkTheme, oneLightTheme } from './src/theme/one-dark-themes';
import { calendarData, type CalendarDay } from './src/data/calendar-data';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Configuration variables
const dcicDomain = 'https://dcic.pdi.run';

type CalendarItem = keyof Pick<CalendarDay, 'lectures' | 'lab' | 'homework'>;

/**
 * Gets the latest document ID for the given calendar item
 * 
 * @param item The item to get the latest document ID for (lectures, lab, homework)
 * @returns The latest document ID
 * 
 * @author Logan Gill
 */
function getDocumentId(item: CalendarItem): string {
  const href = getLatestCalendarHref(item);
  const fallback = item === 'lectures' ? 'l0-summary' : '1';
  if (isCalendarExpired()) {
    return fallback;
  }
  return getDocumentIdFromHref(href, fallback);
}

/**
 * Checks whether the calendar is more than one month past its final date
 *
 * @returns Whether the calendar has expired
 *
 * @author Logan Gill
 */
function isCalendarExpired(): boolean {
  const calendarDays = calendarData.flatMap((month) =>
    month.weeks.flatMap((week) =>
      week.days.map((calendarDay) =>
        new Date(`${month.month} ${calendarDay.day}, ${month.year}`)
      )
    )
  );

  if (calendarDays.length === 0) {
    return false;
  }

  const lastCalendarDate = new Date(Math.max(...calendarDays.map((date) => date.getTime())));
  lastCalendarDate.setMonth(lastCalendarDate.getMonth() + 1);

  return new Date() >= lastCalendarDate;
}

/**
 * Gets the document ID from a given href
 * 
 * @param href The href to extract the document ID from
 * @param fallback The fallback value to use if the href is undefined or invalid
 * @returns The document ID
 * 
 * @author Logan Gill
 */
function getDocumentIdFromHref(href: string | undefined, fallback: string): string {
  return href?.split('/').pop() ?? fallback;
}

/**
 * Gets the latest href for the given calendar item
 * 
 * @param item The item to get the latest href for (lectures, lab, homework)
 * @returns The latest href, or undefined if not found
 * 
 * @author Logan Gill
 */
function getLatestCalendarHref(item: CalendarItem): string | undefined {
  const calendarDay = getLatestCalendarDay(item);

  if (!calendarDay) {
    return undefined;
  }

  if (item === 'lectures') {
    return calendarDay.lectures?.find(({ href }) => href.startsWith('/days/'))?.href;
  }

  return item === 'lab' ? calendarDay.lab?.href : calendarDay.homework?.href;
}

/**
 * Gets the latest calendar day for the given calendar item
 * 
 * @param item The item to get the latest calendar day for (lectures, lab, homework)
 * @returns The latest calendar day, or undefined if not found
 * 
 * @author Logan Gill
 */
function getLatestCalendarDay(item: CalendarItem): CalendarDay | undefined {
  // Today's date
  const today = new Date();
  // Set time to max since we do not care for it
  today.setHours(23, 59, 59, 999);

  const calendarDays = calendarData
    // Formats the calendar data into a flat array of {calendarDay, date} objects
    .flatMap((month) =>
      month.weeks.flatMap((week) =>
        week.days.map((calendarDay) => ({
          calendarDay,
          date: new Date(`${month.month} ${calendarDay.day}, ${month.year}`),
        }))
      )
    );

  return calendarDays
    // Reverses since we want the last valid item
    .reverse()
    .find(({ calendarDay, date }) => {
      if (date > today) {
        return false;
      }

      // We only show lectures that have days, since we do not want to show skill days or summary days
      if (item === 'lectures') {
        return calendarDay.lectures?.some(({ href }) => href.startsWith('/days/')) ?? false;
      }

      return item === 'lab' ? calendarDay.lab !== undefined : calendarDay.homework !== undefined;
    })?.calendarDay;
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
      docId: getDocumentId('lectures'),
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
  ]

  if (new Date() >= new Date(2026, 10, 3)) {
    startingItems.push({
      to: '/python-setup/',
      label: 'Python Setup + FAQs',
    });
    startingItems.push({
      to: '/pyret-cheatsheet-python/',
      label: 'Python for Pyreteers',
    });
    startingItems.push({
      label: 'Python Documentation',
      href: 'https://docs.python.org/3/',
    })
  }
  startingItems.push({
    label: 'Pyret Documentation',
    href: 'https://pyret.org/docs/latest/index.html',
  });

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
        id: 'practice',
        path: 'practice',
        sidebarPath: './sidebars/practice.ts',
        routeBasePath: 'practice',
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
          docId: getDocumentId('homework'),
          position: 'left',
          label: 'Homework',
          docsPluginId: 'homework',
        },
        {
          type: 'doc',
          docId: getDocumentId('lab'),
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
