/**
 * Create a regex from a template string with a given flag.
 * @param strings The string parts of the template string.
 * @param values The regex parts of the template string.
 * @param flags The flags to use for the regex.
 * @returns A regex with the given flags.
 */
function make_regex(
  strings: TemplateStringsArray,
  values: (RegExp | String)[],
  flags: string,
) {
  return new RegExp(
    strings.reduce((acc, str, i) => {
      const raw_val = values[i];
      const val = raw_val instanceof RegExp ? raw_val.source : raw_val;

      return `${acc}${str}${val ?? ''}`;
    }, ''),
    flags,
  );
}

type TagFunction<Val, Ret> = (
  strings: TemplateStringsArray,
  ...values: Val[]
) => Ret;

/**
 * A tag function to compose regexes together with no flags.
 */
const regex: TagFunction<RegExp | String, RegExp> = (strings, ...values) =>
  make_regex(strings, values, '');

const regexg: TagFunction<RegExp | String, RegExp> = (strings, ...values) =>
  make_regex(strings, values, 'g');

const ident_start = /[a-zA-Z_]/;
const ident_other = /[a-zA-Z0-9_-]/;
const ident = regex`${ident_start}${ident_other}*`;

const before = /(?<![A-Za-z0-9-])/;
const after = /(?![A-Za-z0-9-])/;

const unsigned_dec_num = /[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?/;
const unsigned_rat_num = /[0-9]+\/[0-9]+/;

const check_keywords = [
  'is',
  'is==',
  'is=~',
  'is-not',
  'is-not==',
  'is-not=~',
  'is-not<=>',
  'is-roughly',
  'is-not-roughly',
  'is<=>',
  'because',
  'satisfies',
  'violates',
  'raises',
  'raises-other-than',
  'raises-satisfies',
  'raises-violates',
];

// this helps us avoid some false positives
const block_start_keywords = [
  'check',
  'where',
  'ask',
  'then',
  'otherwise',
  'with',
  'sharing',
  'block',
  // not really block but followed by `:`
  'doc',
  'spy',
  'else',
  'row',
  'source',
  'table',
];

const keywords = [
  'end',
  'fun',
  'data',
  'select',
  'from',
  'sieve',
  'using',
  'order',
  'transform',
  'extract',
  'extend',
  'load-table',
  'cases',
  'for',
  'ref',
  'if',
  'else if',
  'when',
  'shadow',
  'let',
  'letrec',
  'var',
  'spy',
  'lam',
  'method',
  'type',
  'type-let',
  'newtype',
  'lazy',
  'module',
  'sanitize',
  'using',
  'rec',
];

Prism.languages.pyret = {
  'annotation': {
    // TODO: improve this, currently only handles idents
    pattern: regex`${/(?<=(?:::\s*)|(?:->\s*))/}${ident}${/(?![A-Za-z0-9-<])/}`,
  },
  'comment': {
    pattern: /(^|[^\\])#[^|].*/,
    lookbehind: true,
    greedy: true,
  },
  'nested-comment-start': {
    pattern: /#\|/,
    greedy: true,
    alias: 'comment',
  },
  'nested-comment-end': {
    pattern: /\|#/,
    greedy: true,
    alias: 'comment',
  },
  'string': {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: true,
  },
  'multiline_string': {
    pattern: /```[\s\S]*?```/i,
    greedy: true,
    alias: 'string',
  },
  'function': {
    pattern: regexg`${/((?:^|\s)fun[ \t]+)/}${ident}${/(?=\s*\()/}`,
    lookbehind: true,
  },
  'checks-keyword': {
    pattern: regex`${/(?<![^\s])/}(?:${check_keywords.join('|')})${/(?![^\s])/}`,
    alias: 'keyword',
  },
  'import-keyword': {
    pattern: regex`${before}${/(?:include|import|as)/}${after}`,
    alias: 'keyword',
  },
  'provide-keyword': {
    pattern: regex`${before}${/(?:provide|provide-types)/}${after}`,
    alias: 'keyword',
  },
  'english-keyword': {
    pattern: regex`${before}${/(?:and|or)/}${after}`,
    alias: 'keyword',
  },
  'block-keyword': {
    pattern: regex`${before}(?:${block_start_keywords.join('|')})${/(?=:)/}${after}`,
    alias: 'keyword',
  },
  'keyword': regex`${before}(?:${keywords.join('|')})${after}`,
  'builtin': regex`${before}${/(?:raise|file|js-file|my-gdrive|shared-gdrive)/}${after}`,
  'boolean': regex`${before}${/(?:false|true)/}${after}`,
  'number': {
    pattern: regex`${/(?<![A-Za-z0-9-/])/}[~]?[-+]?${unsigned_dec_num}${/(?![A-Za-z0-9-/])/}`,
  },
  'rational': {
    // TODO: does this need separator?
    pattern: regex`[-+]?${unsigned_rat_num}`,
    alias: 'number',
  },
  // TODO: inexact
  /* 'inexact': {
    alias: 'number',
  }, */
  'operator': regex`${before}${/[-+%=<>\|*/]|!|\^|!=|:=|=~/}${after}`,
  'punctuation': /[{}[\];(),.:]/,
};
Prism.languages.arr = Prism.languages.pyret;

/* ======= Everything below is to handle recursively nested comments ======= */

const PrismObj = globalThis.Prism; // globalThis.Prism gets nuked after this file is loaded

Prism.hooks.add('after-tokenize', function (env) {
  if (env.language !== 'pyret') return;
  env.tokens = processNestedComments(env.tokens);
});

function processNestedComments(tokens: Prism.TokenStream): Prism.Token[] {
  const isStart = (t: Prism.Token) =>
    typeof t === 'object' && t.type === 'nested-comment-start';
  const isEnd = (t: Prism.Token) =>
    typeof t === 'object' && t.type === 'nested-comment-end';
  const hasArrayContent = (t: Prism.Token) =>
    typeof t === 'object' && Array.isArray(t.content);

  const out = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (isStart(tok)) {
      let depth = 1;
      const chunk = [tok];
      let j = i + 1;

      while (j < tokens.length && depth > 0) {
        const t = tokens[j];
        chunk.push(t);

        if (isStart(t)) depth++;
        else if (isEnd(t)) depth--;

        j++;
      }

      out.push(buildNestedComment(stringify(chunk)));

      i = j - 1;
    } else if (isEnd(tok)) {
      out.push(makeToken('invalid', '|#'));
    } else if (hasArrayContent(tok)) {
      tok.content = processNestedComments(tok.content);
      out.push(tok);
    } else {
      out.push(tok);
    }
  }
  return out;
}

function countAll(str: string, pattern: string | RegExp) {
  return (str.match(new RegExp(pattern, 'g')) || []).length;
}

function buildNestedComment(text: string): Prism.Token {
  const stack: Prism.Token[][] = [[]];
  let buffer = '';
  let i = 0;
  let balanced = true;

  while (i < text.length) {
    if (text.startsWith('#|', i)) {
      flushPlain();
      stack[stack.length - 1].push(makeToken('comment-delimiter', '#|'));
      stack.push([]);
      i += 2;
    } else if (text.startsWith('|#', i)) {
      flushPlain();

      if (stack.length === 1) {
        balanced = false;
        break;
      }

      stack[stack.length - 1].push(makeToken('comment-delimiter', '|#'));
      const finished = makeToken('comment', stack.pop()!);
      stack[stack.length - 1].push(finished);
      i += 2;
    } else {
      buffer += text[i++];
    }
  }

  flushPlain();

  if (!balanced || stack.length !== 1) {
    const tokens = stack.flat();
    tokens.push(makeToken('invalid', '|#'));
    return makeToken('comment', tokens);
  }

  return makeToken('comment', stack[0]);

  function flushPlain(): void {
    if (buffer) {
      stack[stack.length - 1].push(makeToken('comment-content', buffer));
      buffer = '';
    }
  }
}

function makeToken(type: string, content: Prism.TokenStream): Prism.Token {
  return new PrismObj.Token(type, content, type, stringify(content));
}

function stringify(content: Prism.TokenStream): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(stringify).join('');
  return stringify(content.content);
}
