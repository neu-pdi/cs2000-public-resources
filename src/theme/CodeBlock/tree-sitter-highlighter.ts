import { Parser, Node, Language } from 'web-tree-sitter';

export interface Token {
  content: string;
  type: string;
  className?: string;
}

export interface Line {
  tokens: Token[];
}

export interface HighlightResult {
  lines: Line[];
  className: string;
  style: React.CSSProperties;
}

// Map tree-sitter node types to CSS classes
const tokenTypeMap: Record<string, string> = {
  // Common token types
  string: 'token string',
  string_literal: 'token string',
  comment: 'token comment',
  keyword: 'token keyword',
  identifier: 'token variable',
  number: 'token number',
  operator: 'token operator',
  function: 'token function',
  class: 'token class-name',
  decorator: 'token decorator',
  type: 'token type',
  punctuation: 'token punctuation',
  delimiter: 'token punctuation',

  // Python-specific node types
  import_statement: 'token keyword',
  import_from_statement: 'token keyword',
  function_definition: 'token function',
  class_definition: 'token class-name',
  decorated_definition: 'token decorator',
  assignment: 'token variable',
  attribute: 'token property',
  call: 'token function',
  argument_list: 'token punctuation',
  parameter_list: 'token punctuation',
  lambda: 'token keyword',
  conditional_expression: 'token keyword',
  boolean_operator: 'token operator',
  comparison_operator: 'token operator',
  unary_operator: 'token operator',
  binary_operator: 'token operator',
  integer: 'token number',
  float: 'token number',
  true: 'token boolean',
  false: 'token boolean',
  none: 'token constant',
  escape_sequence: 'token string',
  interpolation: 'token string',
  format_specifier: 'token string',
};

// Get CSS class for a token type
function getTokenClass(nodeType: string): string {
  return tokenTypeMap[nodeType] || 'token';
}

// Recursively extract tokens from tree-sitter parse tree
function extractTokens(node: Node, source: string): Token[] {
  const tokens: Token[] = [];

  // If this is a leaf node (has no children), it's a token
  if (node.childCount === 0) {
    const content = source.slice(node.startIndex, node.endIndex);
    if (content.trim()) {
      tokens.push({
        content,
        type: node.type,
        className: getTokenClass(node.type),
      });
    }
  } else {
    // Recursively process child nodes
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        tokens.push(...extractTokens(child, source));
      }
    }
  }

  return tokens;
}

// Split tokens into lines
function splitTokensIntoLines(tokens: Token[]): Line[] {
  const lines: Line[] = [];
  let currentLine: Token[] = [];

  for (const token of tokens) {
    const content = token.content;
    const linesInToken = content.split('\n');

    if (linesInToken.length === 1) {
      // Single line token
      currentLine.push(token);
    } else {
      // Multi-line token
      for (let i = 0; i < linesInToken.length; i++) {
        const lineContent = linesInToken[i];
        if (i === 0) {
          // First line - add to current line
          if (lineContent) {
            currentLine.push({ ...token, content: lineContent });
          }
        } else if (i === linesInToken.length - 1) {
          // Last line - start new line
          if (lineContent) {
            lines.push({ tokens: currentLine });
            currentLine = [{ ...token, content: lineContent }];
          } else {
            lines.push({ tokens: currentLine });
            currentLine = [];
          }
        } else {
          // Middle lines - end current line and start new one
          lines.push({ tokens: currentLine });
          currentLine = lineContent ? [{ ...token, content: lineContent }] : [];
        }
      }
    }
  }

  // Add the last line if it has tokens
  if (currentLine.length > 0) {
    lines.push({ tokens: currentLine });
  }

  return lines;
}

// Initialize tree-sitter once
let treeSitterInitialized = false;
let pythonGrammar: any = null;

// Main highlighting function
export async function highlightWithTreeSitter(
  code: string,
  language: string,
): Promise<HighlightResult> {
  try {
    // Initialize tree-sitter if not already done
    if (!treeSitterInitialized) {
      treeSitterInitialized = true;
    }

    await Parser.init();
    // Create parser
    const parser = new Parser();

    // Set language based on the language parameter
    let lang: any = null;

    if (language === 'python' || language === 'py') {
      pythonGrammar ??= await Language.load(
        '/cs2000-public-resources/tree-sitter-python.wasm',
      );
      lang = pythonGrammar;
      if (!lang) {
        throw new Error('Failed to load Python grammar');
      }
    } else if (language === 'pyret') {
      // For now, we'll use a fallback since we don't have the grammar loaded
      // In a real implementation, you would load the grammar here
      throw new Error('Pyret grammar not loaded');
    } else {
      // Unsupported language - fall back to basic highlighting
      const lines = code.split('\n').map((line) => ({
        tokens: [{ content: line, type: 'text', className: 'token' }],
      }));

      return {
        lines,
        className: `language-${language}`,
        style: {},
      };
    }

    // Set the language
    if (lang) {
      console.log(lang);
      console.log(parser);

      parser.setLanguage(lang);
    }

    // Parse the code
    const tree = parser.parse(code);
    if (!tree) {
      throw new Error('Failed to parse code');
    }
    const rootNode = tree!.rootNode;

    // Extract tokens
    const tokens = extractTokens(rootNode, code);

    // Split into lines
    const lines = splitTokensIntoLines(tokens);

    // Clean up
    parser.delete();
    tree!.delete();

    return {
      lines,
      className: `language-${language}`,
      style: {},
    };
  } catch (error) {
    // Fallback to basic highlighting without tree-sitter
    console.warn(
      'Tree-sitter highlighting failed, falling back to basic highlighting:',
      error,
    );

    // Provide a simple fallback that at least preserves the code structure
    const lines = code.split('\n').map((line) => ({
      tokens: [{ content: line, type: 'text', className: 'token' }],
    }));

    return {
      lines,
      className: `language-${language}`,
      style: {},
    };
  }
}

// Cleanup function for when the component unmounts
export function cleanupTreeSitter() {
  // Tree-sitter cleanup if needed
}
