// adapted from https://github.com/navarasu/onedark.nvim

import { PrismTheme } from 'prism-react-renderer';

const darkPalette = {
  black: '#0e1013',
  bg0: '#1f2329',
  bg1: '#282c34',
  bg2: '#30363f',
  bg3: '#323641',
  bg_d: '#181b20',
  bg_blue: '#61afef',
  bg_yellow: '#e8c88c',
  fg: '#a0a8b7',
  purple: '#bf68d9',
  green: '#8ebd6b',
  orange: '#cc9057',
  blue: '#4fa6ed',
  yellow: '#e2b86b',
  cyan: '#48b0bd',
  red: '#e55561',
  grey: '#535965',
  light_grey: '#7a818e',
  dark_cyan: '#266269',
  dark_red: '#8b3434',
  dark_yellow: '#835d1a',
  dark_purple: '#7e3992',
  diff_add: '#272e23',
  diff_delete: '#2d2223',
  diff_change: '#172a3a',
  diff_text: '#274964',
};

const lightPalette = {
  black: '#101012',
  bg0: '#fafafa',
  bg1: '#f0f0f0',
  bg2: '#e6e6e6',
  bg3: '#dcdcdc',
  bg_d: '#c9c9c9',
  bg_blue: '#68aee8',
  bg_yellow: '#e2c792',
  fg: '#383a42',
  purple: '#a626a4',
  green: '#50a14f',
  orange: '#c18401',
  blue: '#4078f2',
  yellow: '#986801',
  cyan: '#0184bc',
  red: '#e45649',
  grey: '#a0a1a7',
  light_grey: '#818387',
  dark_cyan: '#2b5d63',
  dark_red: '#833b3b',
  dark_yellow: '#7c5c20',
  dark_purple: '#79428a',
  diff_add: '#e2fbe4',
  diff_delete: '#fce2e5',
  diff_change: '#e2ecfb',
  diff_text: '#cad3e0',
};

type Pallette = typeof darkPalette & typeof lightPalette;

const theme = (palette: Pallette): PrismTheme => ({
  plain: {
    backgroundColor: palette.bg0,
    color: palette.fg,
  },
  styles: [
    {
      types: ['comment', 'prolog', 'cdata'],
      style: {
        color: palette.grey,
      },
    },
    {
      types: ['doctype', 'entity'],
      style: {
        color: palette.fg,
      },
    },
    {
      types: ['punctuation'],
      style: { color: palette.yellow },
    },
    {
      types: ['boolean'],
      style: { color: palette.red },
    },
    {
      types: [
        'attr-name',
        'class-name',
        'maybe-class-name',
        'constant',
        'number',
        'atrule',
      ],
      style: { color: palette.orange },
    },
    {
      types: ['keyword'],
      style: { color: palette.purple },
    },
    {
      types: ['property', 'tag', 'symbol', 'deleted', 'important'],
      style: {
        color: palette.red,
      },
    },
    {
      types: ['builtin'],
      style: {
        color: palette.cyan,
      },
    },
    {
      types: ['selector', 'string', 'char', 'inserted', 'regex', 'attr-value'],
      style: {
        color: palette.green,
      },
    },
    {
      types: ['variable', 'operator', 'function'],
      style: {
        color: palette.blue,
      },
    },
    {
      types: ['annotation'],
      style: {
        color: palette.light_grey,
      },
    },
    {
      types: ['url'],
      style: {
        color: palette.cyan,
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['important'],
      style: {
        color: palette.fg,
      },
    },
    {
      types: ['invalid'],
      style: {
        color: palette.dark_red,
        backgroundColor: palette.bg_d,
      },
    },
  ],
});

export const oneDarkTheme = theme(darkPalette);
export const oneLightTheme = theme(lightPalette);
