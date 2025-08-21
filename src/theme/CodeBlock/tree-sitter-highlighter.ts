import { Parser, Node, Language } from 'web-tree-sitter';
import { 
  HighlightConfiguration, 
  Highlighter, 
  HighlightIter, 
  HighlightEvent, 
  Highlight 
} from './highlight';

export interface Token {
  content: string;
  type: string;
  className?: string;
  startIndex?: number;
  endIndex?: number;
}

export interface Line {
  tokens: Token[];
}

export interface HighlightResult {
  lines: Line[];
  className: string;
  style: React.CSSProperties;
}

// Map highlight names to CSS classes
const highlightClassMap: Record<string, string> = {
  // Standard highlight names
  "keyword": "token keyword",
  "string": "token string",
  "comment": "token comment",
  "function": "token function",
  "variable": "token variable",
  "number": "token number",
  "operator": "token operator",
  "punctuation": "token punctuation",
  "type": "token type",
  "constant": "token constant",
  "boolean": "token boolean",
  "property": "token property",
  "class": "token class-name",
  "decorator": "token decorator",
  "escape": "token string",
  "error": "token error",
  
  // Python-specific highlights from official queries
  "function.builtin": "token function",
  "function.method": "token function",
  "constant.builtin": "token constant",
  "constructor": "token class-name",
  "punctuation.special": "token punctuation",
  "embedded": "token string",
  
  // Local variable tracking
  "local.definition": "token variable",
  "local.reference": "token variable",
  
  // Fallback
  "default": "token",
};

// Get CSS class for a highlight
function getHighlightClass(highlight: Highlight, highlightNames: string[]): string {
  if (highlight.value < highlightNames.length) {
    const highlightName = highlightNames[highlight.value];
    return highlightClassMap[highlightName] || highlightClassMap["default"];
  }
  return highlightClassMap["default"];
}

// Convert highlight events to tokens
function eventsToTokens(
  events: HighlightEvent[], 
  source: string, 
  highlightNames: string[]
): Token[] {
  const tokens: Token[] = [];
  let currentHighlight: Highlight | null = null;
  
  console.log('=== TREE-SITTER HIGHLIGHTING DEBUG ===');
  console.log('Source code:', JSON.stringify(source));
  console.log('Highlight names:', highlightNames);
  console.log('Number of events:', events.length);
  
  for (const event of events) {
    switch (event.type) {
      case 'source':
        if (event.start < event.end) {
          const content = source.slice(event.start, event.end);
          const tokenType = currentHighlight ? highlightNames[currentHighlight.value] : 'text';
          const className = currentHighlight ? getHighlightClass(currentHighlight, highlightNames) : 'unmatched-token';
          
          tokens.push({
            content,
            type: tokenType,
            className: className,
            startIndex: event.start,
            endIndex: event.end,
          });
        }
        break;
      case 'highlightStart':
        currentHighlight = event.highlight;
        break;
      case 'highlightEnd':
        currentHighlight = null;
        break;
    }
  }
  
  console.log('Generated tokens:', tokens);
  console.log('=== END DEBUG ===');
  return tokens;
}

// Split tokens into lines while preserving original structure
function splitTokensIntoLines(tokens: Token[], originalCode: string): Line[] {
  const lines: Line[] = [];
  const originalLines = originalCode.split('\n');
  
  // Create a map of character positions to tokens
  const tokenMap = new Map<number, Token>();
  
  for (const token of tokens) {
    if (token.startIndex !== undefined) {
      tokenMap.set(token.startIndex, token);
    }
  }
  
  // Process each original line
  let currentPos = 0;
  for (const originalLine of originalLines) {
    const lineTokens: Token[] = [];
    
    // Find tokens that belong to this line
    for (const [pos, token] of tokenMap) {
      if (pos >= currentPos && pos < currentPos + originalLine.length) {
        lineTokens.push(token);
      }
    }
    
    // Sort tokens by their position within the line
    lineTokens.sort((a, b) => (a.startIndex || 0) - (b.startIndex || 0));
    
    // If no tokens found for this line, create a text token with the original line
    if (lineTokens.length === 0) {
      lineTokens.push({
        content: originalLine,
        type: 'text',
        className: 'token',
      });
    }
    
    lines.push({ tokens: lineTokens });
    currentPos += originalLine.length + 1; // +1 for newline
  }
  
  return lines;
}

// Initialize tree-sitter once
let treeSitterInitialized = false;
let pythonGrammar: any = null;

// Create highlight configurations for different languages
const highlightConfigs = new Map<string, HighlightConfiguration>();

// Create a Python highlight configuration
function createPythonHighlightConfig(language: Language): HighlightConfiguration {
  const highlightsQuery = `
    ; Comments must come first to avoid conflicts
    (comment) @comment
    
    ; Literals
    (string) @string
    (escape_sequence) @escape
    [
      (none)
      (true)
      (false)
    ] @constant.builtin
    [
      (integer)
      (float)
    ] @number

    ; Operators
    [
      "-"
      "-="
      "!="
      "*"
      "**"
      "**="
      "*="
      "/"
      "//"
      "//="
      "/="
      "&"
      "&="
      "%"
      "%="
      "^"
      "^="
      "+"
      "->"
      "+="
      "<"
      "<<"
      "<<="
      "<="
      "<>"
      "="
      ":="
      "=="
      ">"
      ">="
      ">>"
      ">>="
      "|"
      "|="
      "~"
      "@="
      "and"
      "in"
      "is"
      "not"
      "or"
      "is not"
      "not in"
    ] @operator

    ; Keywords
    [
      "as"
      "assert"
      "async"
      "await"
      "break"
      "class"
      "continue"
      "def"
      "del"
      "elif"
      "else"
      "except"
      "exec"
      "finally"
      "for"
      "from"
      "global"
      "if"
      "import"
      "lambda"
      "nonlocal"
      "pass"
      "print"
      "raise"
      "return"
      "try"
      "while"
      "with"
      "yield"
      "match"
      "case"
    ] @keyword

    ; Function calls
    (decorator) @function
    (decorator
      (identifier) @function)

    (call
      function: (attribute attribute: (identifier) @function.method))
    (call
      function: (identifier) @function)

    ; Builtin functions
    ((call
      function: (identifier) @function.builtin)
     (#match?
       @function.builtin
       "^(abs|all|any|ascii|bin|bool|breakpoint|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip|__import__)$"))

    ; Function definitions
    (function_definition
      name: (identifier) @function)

    (attribute attribute: (identifier) @property)
    (type (identifier) @type)

    ; Identifier naming conventions (must come last)
    ((identifier) @constructor
     (#match? @constructor "^[A-Z]"))

    ((identifier) @constant
     (#match? @constant "^[A-Z][A-Z_]*$"))

    (identifier) @variable

    (interpolation
      "{" @punctuation.special
      "}" @punctuation.special) @embedded
  `;

  const injectionQuery = `
    ; No injections for now - can be added later if needed
  `;

  const localsQuery = `
    ; Local variable definitions and references
    (module (expression_statement (assignment left: (identifier) @local.definition)))

    (class_definition
      name: (identifier) @local.definition)

    (function_definition
      name: (identifier) @local.definition)

    (call
      function: [
          (identifier) @local.reference
          (attribute
            attribute: (identifier) @local.reference)
      ])

    (identifier) @local.reference
  `;

  return new HighlightConfiguration(
    language,
    "python",
    highlightsQuery,
    injectionQuery,
    localsQuery
  );
}

// Main highlighting function using the new highlight library
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
      parser.setLanguage(lang);
    }

    // Debug: Parse the code and see what tree-sitter produces
    const tree = parser.parse(code);
    if (tree) {
      console.log('=== TREE-SITTER TREE DEBUG ===');
      console.log('Tree root node:', tree.rootNode.toString());
      console.log('Tree root node type:', tree.rootNode.type);
      console.log('Tree root node text:');
      console.dir(tree.rootNode.text)
      console.log('=== END TREE DEBUG ===');
      tree.delete();
    }

    // Clear existing configs to ensure fresh configuration
    highlightConfigs.clear();
    
    // Create highlight configuration
    let config: HighlightConfiguration;
    if (language === 'python' || language === 'py') {
      config = createPythonHighlightConfig(lang);
      highlightConfigs.set(language, config);
    } else {
      throw new Error(`No highlight configuration for language: ${language}`);
    }

    // Configure recognized highlight names - must match the order in the query
    const recognizedNames = [
      "comment",           // 0
      "string",           // 1
      "escape",           // 2
      "constant.builtin", // 3
      "number",           // 4
      "operator",         // 5
      "keyword",          // 6
      "function",         // 7
      "function.method",  // 8
      "function.builtin", // 9
      "function",         // 10
      "property",         // 11
      "type",             // 12
      "constructor",      // 13
      "constant",         // 14
      "variable",         // 15
      "punctuation.special", // 16
      "embedded",         // 17
      "local.definition", // 18
      "local.reference"   // 19
    ];
    
    console.log('=== CONFIGURATION DEBUG ===');
    console.log('Configuring with names:', recognizedNames);
    config.configure(recognizedNames);
    console.log('Configuration complete');
    console.log('=== END CONFIGURATION DEBUG ===');

    // Create highlighter and highlight the code
    const highlighter = new Highlighter();
    const highlightIter = highlighter.highlight(config, code);

    // Collect all highlight events
    const events: HighlightEvent[] = [];
    let event = highlightIter.next();
    while (event !== null) {
      events.push(event);
      event = highlightIter.next();
    }

    console.log('=== TREE-SITTER PARSER DEBUG ===');
    console.log('Raw highlight events:', events);
    console.log('First few events:', events.slice(0, 10));
    console.log('=== END PARSER DEBUG ===');

    // Convert events to tokens
    const tokens = eventsToTokens(events, code, recognizedNames);

    // Split into lines
    const lines = splitTokensIntoLines(tokens, code);

    // Clean up
    parser.delete();

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
      tokens: [{ content: line, type: 'text', className: 'fallback-token' }],
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
  highlightConfigs.clear();
}
