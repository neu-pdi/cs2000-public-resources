import { Parser, Node, Language, Query, QueryMatch, QueryCapture, Point, Range, Tree } from 'web-tree-sitter';

// Constants from the Rust implementation
const CANCELLATION_CHECK_INTERVAL = 100;
const BUFFER_HTML_RESERVE_CAPACITY = 10 * 1024;
const BUFFER_LINES_RESERVE_CAPACITY = 1000;

// Standard capture names from the Rust implementation
const STANDARD_CAPTURE_NAMES = new Set([
  "attribute",
  "boolean",
  "carriage-return",
  "comment",
  "comment.documentation",
  "constant",
  "constant.builtin",
  "constructor",
  "constructor.builtin",
  "embedded",
  "error",
  "escape",
  "function",
  "function.builtin",
  "keyword",
  "markup",
  "markup.bold",
  "markup.heading",
  "markup.italic",
  "markup.link",
  "markup.link.url",
  "markup.list",
  "markup.list.checked",
  "markup.list.numbered",
  "markup.list.unchecked",
  "markup.list.unnumbered",
  "markup.quote",
  "markup.raw",
  "markup.raw.block",
  "markup.raw.inline",
  "markup.strikethrough",
  "module",
  "number",
  "operator",
  "property",
  "property.builtin",
  "punctuation",
  "punctuation.bracket",
  "punctuation.delimiter",
  "punctuation.special",
  "string",
  "string.escape",
  "string.regexp",
  "string.special",
  "string.special.symbol",
  "tag",
  "type",
  "type.builtin",
  "variable",
  "variable.builtin",
  "variable.member",
  "variable.parameter",
]);

// Error types from the Rust implementation
export enum HighlightError {
  Cancelled = "Cancelled",
  InvalidLanguage = "InvalidLanguage",
  Unknown = "Unknown",
}

// Highlight type from the Rust implementation
export class Highlight {
  constructor(public value: number) {}
}

// HighlightEvent types from the Rust implementation
export type HighlightEvent = 
  | { type: 'source'; start: number; end: number }
  | { type: 'highlightStart'; highlight: Highlight }
  | { type: 'highlightEnd' };

// LocalDef structure from the Rust implementation
interface LocalDef {
  name: string;
  valueRange: { start: number; end: number };
  highlight: Highlight | null;
}

// LocalScope structure from the Rust implementation
interface LocalScope {
  inherits: boolean;
  range: { start: number; end: number };
  localDefs: LocalDef[];
}

// Simple QueryCursor interface since it's not exported from web-tree-sitter
interface QueryCursor {
  captures(query: Query, node: Node, source: string): QueryCapture[];
  delete(): void;
}

// HighlightConfiguration from the Rust implementation
export class HighlightConfiguration {
  public query: Query;
  public combinedInjectionsQuery: Query | null;
  public localsPatternIndex: number;
  public highlightsPatternIndex: number;
  public highlightIndices: (Highlight | null)[];
  public nonLocalVariablePatterns: boolean[];
  public injectionContentCaptureIndex: number | null;
  public injectionLanguageCaptureIndex: number | null;
  public localScopeCaptureIndex: number | null;
  public localDefCaptureIndex: number | null;
  public localDefValueCaptureIndex: number | null;
  public localRefCaptureIndex: number | null;

  constructor(
    public language: Language,
    public languageName: string,
    highlightsQuery: string,
    injectionQuery: string,
    localsQuery: string,
  ) {

    // Concatenate the query strings, keeping track of the start offset of each section
    let querySource = '';
    querySource += injectionQuery;
    const localsQueryOffset = querySource.length;
    querySource += localsQuery;
    const highlightsQueryOffset = querySource.length;
    querySource += highlightsQuery;

    // Construct a single query by concatenating the three query strings
    this.query = new Query(language, querySource);
    
    let localsPatternIndex = 0;
    let highlightsPatternIndex = 0;
    
    const patternCount = this.query.patternCount();
    for (let i = 0; i < patternCount; i++) {
      const patternOffset = this.query.startIndexForPattern(i);
      if (patternOffset < highlightsQueryOffset) {
        if (patternOffset < highlightsQueryOffset) {
          highlightsPatternIndex += 1;
        }
        if (patternOffset < localsQueryOffset) {
          localsPatternIndex += 1;
        }
      }
    }

    this.localsPatternIndex = localsPatternIndex;
    this.highlightsPatternIndex = highlightsPatternIndex;

    // Construct a separate query just for dealing with the 'combined injections'
    let combinedInjectionsQuery: Query | null = null;
    let hasCombinedQueries = false;
    
    try {
      combinedInjectionsQuery = new Query(language, injectionQuery);
      // Note: propertySettings is not available in web-tree-sitter
      // This is a simplified implementation
      hasCombinedQueries = false;
    } catch (e) {
      // Query creation failed, ignore
    }

    this.combinedInjectionsQuery = hasCombinedQueries ? combinedInjectionsQuery : null;

    // Find all of the highlighting patterns that are disabled for nodes that
    // have been identified as local variables
    // Note: propertyPredicates is not available in web-tree-sitter
    this.nonLocalVariablePatterns = new Array<boolean>(patternCount).fill(false);

    // Store the numeric ids for all of the special captures
    this.injectionContentCaptureIndex = null;
    this.injectionLanguageCaptureIndex = null;
    this.localDefCaptureIndex = null;
    this.localDefValueCaptureIndex = null;
    this.localRefCaptureIndex = null;
    this.localScopeCaptureIndex = null;

    for (let i = 0; i < this.query.captureNames.length; i++) {
      const name = this.query.captureNames[i];
      switch (name) {
        case "injection.content":
          this.injectionContentCaptureIndex = i;
          break;
        case "injection.language":
          this.injectionLanguageCaptureIndex = i;
          break;
        case "local.definition":
          this.localDefCaptureIndex = i;
          break;
        case "local.definition-value":
          this.localDefValueCaptureIndex = i;
          break;
        case "local.reference":
          this.localRefCaptureIndex = i;
          break;
        case "local.scope":
          this.localScopeCaptureIndex = i;
          break;
      }
    }

    this.highlightIndices = new Array(this.query.captureNames.length).fill(null);
  }

  // Get a slice containing all of the highlight names used in the configuration
  get names(): string[] {
    return this.query.captureNames;
  }

  // Set the list of recognized highlight names
  configure(recognizedNames: string[]): void {
    this.highlightIndices = [];
    
    for (const captureName of this.query.captureNames) {
      const captureParts = captureName.split('.');
      
      let bestIndex: number | null = null;
      let bestMatchLen = 0;
      
      for (let i = 0; i < recognizedNames.length; i++) {
        const recognizedName = recognizedNames[i];
        const recognizedParts = recognizedName.split('.');
        
        let len = 0;
        let matches = true;
        
        for (const part of recognizedParts) {
          len += 1;
          if (!captureParts.includes(part)) {
            matches = false;
            break;
          }
        }
        
        if (matches && len > bestMatchLen) {
          bestIndex = i;
          bestMatchLen = len;
        }
      }
      
      this.highlightIndices.push(bestIndex !== null ? new Highlight(bestIndex) : null);
    }
  }

  // Return the list of this configuration's capture names that are neither present in the
  // list of predefined 'canonical' names nor start with an underscore
  nonconformantCaptureNames(captureNames: Set<string> = new Set()): string[] {
    const standardNames = captureNames.size === 0 ? STANDARD_CAPTURE_NAMES : captureNames;
    
    return this.names.filter(name => 
      !(name.startsWith('_') || standardNames.has(name))
    );
  }


}

// Highlighter from the Rust implementation
export class Highlighter {
  public parser: Parser;
  private cursors: QueryCursor[];

  constructor() {
    this.parser = new Parser();
    this.cursors = [];
  }

  // Iterate over the highlighted regions for a given slice of source code
  highlight(
    config: HighlightConfiguration,
    source: string,
    cancellationFlag?: { load: () => number },
    injectionCallback?: (name: string) => HighlightConfiguration | null,
  ): HighlightIter {
    const layers = HighlightIterLayer.new(
      source,
      null,
      this,
      cancellationFlag,
      injectionCallback || (() => null),
      config,
      0,
      [{
        startIndex: 0,
        endIndex: Number.MAX_SAFE_INTEGER,
        startPosition: { row: 0, column: 0 },
        endPosition: { row: Number.MAX_SAFE_INTEGER, column: Number.MAX_SAFE_INTEGER },
      }],
    );

    if (layers.length === 0) {
      throw new Error(HighlightError.InvalidLanguage);
    }

    return new HighlightIter(
      source,
      config.languageName,
      0,
      this,
      injectionCallback || (() => null),
      cancellationFlag,
      layers,
      0,
      null,
      null,
    );
  }
}

// HighlightIterLayer from the Rust implementation
class HighlightIterLayer {
  public captureIndex: number = 0;

  constructor(
    public tree: Tree,
    public cursor: QueryCursor,
    public captures: QueryCapture[],
    public config: HighlightConfiguration,
    public highlightEndStack: number[],
    public scopeStack: LocalScope[],
    public ranges: Range[],
    public depth: number,
  ) {}

  // Create a new 'layer' of highlighting for this document
  static new(
    source: string,
    parentName: string | null,
    highlighter: Highlighter,
    cancellationFlag: { load: () => number } | undefined,
    injectionCallback: (name: string) => HighlightConfiguration | null,
    config: HighlightConfiguration,
    depth: number,
    ranges: Range[],
  ): HighlightIterLayer[] {
    const result: HighlightIterLayer[] = [];
    const queue: Array<[HighlightConfiguration, number, Range[]]> = [];
    
    let currentConfig = config;
    let currentDepth = depth;
    let currentRanges = ranges;

    while (true) {
      try {
        // Note: setIncludedRanges is not available in web-tree-sitter
        // We'll use the default parsing behavior
        highlighter.parser.setLanguage(currentConfig.language);

        const tree = highlighter.parser.parse(source);
        if (!tree) {
          throw new Error(HighlightError.Cancelled);
        }

        // Create a simple cursor implementation
        const cursor: QueryCursor = {
          captures: (query: Query, node: Node, source: string) => {
            return query.captures(node);
          },
          delete: () => {
            // No cleanup needed for this simple implementation
          }
        };

        // Process combined injections
        if (currentConfig.combinedInjectionsQuery) {
          const combinedInjectionsQuery = currentConfig.combinedInjectionsQuery;
          const injectionsByPatternIndex = new Array(combinedInjectionsQuery.patternCount()).fill(null).map(() => ({
            languageName: null as string | null,
            contentNodes: [] as Node[],
            includesChildren: false
          }));

          const matches = combinedInjectionsQuery.matches(tree.rootNode);
          for (const mat of matches) {
            const entry = injectionsByPatternIndex[mat.patternIndex];
            const [languageName, contentNode, includeChildren] = injectionForMatch(
              currentConfig,
              parentName,
              combinedInjectionsQuery,
              mat,
              source,
            );
            if (languageName !== null) {
              entry.languageName = languageName;
            }
            if (contentNode !== null) {
              entry.contentNodes.push(contentNode);
            }
            entry.includesChildren = includeChildren;
          }

          for (const { languageName, contentNodes, includesChildren } of injectionsByPatternIndex) {
            if (languageName !== null && contentNodes.length > 0) {
              const nextConfig = injectionCallback(languageName);
              if (nextConfig) {
                const ranges = HighlightIterLayer.intersectRanges(
                  currentRanges,
                  contentNodes,
                  includesChildren,
                );
                if (ranges.length > 0) {
                  queue.push([nextConfig, currentDepth + 1, ranges]);
                }
              }
            }
          }
        }

        const captures = cursor.captures(currentConfig.query, tree.rootNode, source);

        result.push(new HighlightIterLayer(
          tree,
          cursor,
          captures,
          currentConfig,
          [],
          [{
            inherits: false,
            range: { start: 0, end: Number.MAX_SAFE_INTEGER },
            localDefs: [],
          }],
          currentRanges,
          currentDepth,
        ));
      } catch (e) {
        // Handle parsing errors
        break;
      }

      if (queue.length === 0) {
        break;
      }

      const [nextConfig, nextDepth, nextRanges] = queue.shift()!;
      currentConfig = nextConfig;
      currentDepth = nextDepth;
      currentRanges = nextRanges;
    }

    return result;
  }

  // Compute the ranges that should be included when parsing an injection
  static intersectRanges(
    parentRanges: Range[],
    nodes: Node[],
    includesChildren: boolean,
  ): Range[] {
    if (nodes.length === 0) return [];
    
    const result: Range[] = [];
    let parentRangeIndex = 0;
    let parentRange = parentRanges[parentRangeIndex];
    
    for (const node of nodes) {
      const nodeRange = {
        startIndex: node.startIndex,
        endIndex: node.endIndex,
        startPosition: node.startPosition,
        endPosition: node.endPosition,
      };

      // Get excluded ranges (children if includesChildren is false)
      const excludedRanges: Range[] = [];
      if (!includesChildren) {
        const cursor = node.walk();
        if (cursor.gotoFirstChild()) {
          do {
            excludedRanges.push({
              startIndex: cursor.startIndex,
              endIndex: cursor.endIndex,
              startPosition: cursor.startPosition,
              endPosition: cursor.endPosition,
            });
          } while (cursor.gotoNextSibling());
        }
      }

      // Add the range after the last excluded range
      excludedRanges.push({
        startIndex: nodeRange.endIndex,
        endIndex: Number.MAX_SAFE_INTEGER,
        startPosition: nodeRange.endPosition,
        endPosition: { row: Number.MAX_SAFE_INTEGER, column: Number.MAX_SAFE_INTEGER },
      });

      let precedingRange = {
        startIndex: 0,
        endIndex: nodeRange.startIndex,
        startPosition: { row: 0, column: 0 },
        endPosition: nodeRange.startPosition,
      };

      for (const excludedRange of excludedRanges) {
        let range = {
          startIndex: precedingRange.endIndex,
          endIndex: excludedRange.startIndex,
          startPosition: precedingRange.endPosition,
          endPosition: excludedRange.startPosition,
        };
        precedingRange = excludedRange;

        if (range.endIndex < parentRange.startIndex) {
          continue;
        }

        while (parentRange.startIndex <= range.endIndex) {
          if (parentRange.endIndex > range.startIndex) {
            if (range.startIndex < parentRange.startIndex) {
              range.startIndex = parentRange.startIndex;
              range.startPosition = parentRange.startPosition;
            }

            if (parentRange.endIndex < range.endIndex) {
              if (range.startIndex < parentRange.endIndex) {
                result.push({
                  startIndex: range.startIndex,
                  endIndex: parentRange.endIndex,
                  startPosition: range.startPosition,
                  endPosition: parentRange.endPosition,
                });
              }
              range.startIndex = parentRange.endIndex;
              range.startPosition = parentRange.endPosition;
            } else {
              if (range.startIndex < range.endIndex) {
                result.push(range);
              }
              break;
            }
          }

          parentRangeIndex++;
          if (parentRangeIndex < parentRanges.length) {
            parentRange = parentRanges[parentRangeIndex];
          } else {
            return result;
          }
        }
      }
    }
    
    return result;
  }

  // Get the sort key for this layer
  sortKey(): [number, boolean, number] | null {
    const depth = -this.depth;
    
    if (this.captureIndex < this.captures.length) {
      const nextCapture = this.captures[this.captureIndex];
      const start = nextCapture.node.startIndex;
      return [start, true, depth];
    }
    
    if (this.highlightEndStack.length > 0) {
      const end = this.highlightEndStack[this.highlightEndStack.length - 1];
      return [end, false, depth];
    }
    
    return null;
  }

  // Get the next capture
  nextCapture(): QueryCapture | null {
    if (this.captureIndex < this.captures.length) {
      return this.captures[this.captureIndex++];
    }
    return null;
  }

  // Peek at the next capture
  peekCapture(): QueryCapture | null {
    if (this.captureIndex < this.captures.length) {
      return this.captures[this.captureIndex];
    }
    return null;
  }


}

// HighlightIter from the Rust implementation
export class HighlightIter {
  constructor(
    public source: string,
    public languageName: string,
    public byteOffset: number,
    public highlighter: Highlighter,
    public injectionCallback: (name: string) => HighlightConfiguration | null,
    public cancellationFlag: { load: () => number } | undefined,
    public layers: HighlightIterLayer[],
    public iterCount: number,
    public nextEvent: HighlightEvent | null,
    public lastHighlightRange: [number, number, number] | null,
  ) {
    this.sortLayers();
  }

  // Emit an event
  private emitEvent(offset: number, event: HighlightEvent | null): HighlightEvent | null {
    let result: HighlightEvent | null = null;
    
    if (this.byteOffset < offset) {
      result = { type: 'source', start: this.byteOffset, end: offset };
      this.byteOffset = offset;
      this.nextEvent = event;
    } else {
      result = event;
    }
    
    this.sortLayers();
    return result;
  }

  // Sort layers by their sort keys
  private sortLayers(): void {
    while (this.layers.length > 0) {
      const sortKey = this.layers[0].sortKey();
      if (sortKey) {
        let i = 0;
        while (i + 1 < this.layers.length) {
          const nextOffset = this.layers[i + 1].sortKey();
          if (nextOffset && nextOffset[0] < sortKey[0]) {
            i += 1;
            continue;
          }
          break;
        }
        if (i > 0) {
          // Rotate left
          const first = this.layers[0];
          for (let j = 0; j < i; j++) {
            this.layers[j] = this.layers[j + 1];
          }
          this.layers[i] = first;
        }
        break;
      }
      const layer = this.layers.shift()!;
      // Note: cursors are not accessible from outside the class
      // This is a simplified implementation
    }
  }

  // Insert a new layer
  private insertLayer(layer: HighlightIterLayer): void {
    const sortKey = layer.sortKey();
    if (sortKey) {
      let i = 1;
      while (i < this.layers.length) {
        const sortKeyI = this.layers[i].sortKey();
        if (sortKeyI && sortKeyI[0] > sortKey[0]) {
          this.layers.splice(i, 0, layer);
          return;
        }
        i += 1;
      }
      this.layers.push(layer);
    }
  }

  // Get the next highlight event
  next(): HighlightEvent | null {
    while (true) {
      // If we've already determined the next highlight boundary, just return it
      if (this.nextEvent) {
        const event = this.nextEvent;
        this.nextEvent = null;
        return event;
      }

      // Periodically check for cancellation
      if (this.cancellationFlag) {
        this.iterCount += 1;
        if (this.iterCount >= CANCELLATION_CHECK_INTERVAL) {
          this.iterCount = 0;
          if (this.cancellationFlag.load() !== 0) {
            throw new Error(HighlightError.Cancelled);
          }
        }
      }

      // If none of the layers have any more highlight boundaries, terminate
      if (this.layers.length === 0) {
        if (this.byteOffset < this.source.length) {
          const result = { type: 'source' as const, start: this.byteOffset, end: this.source.length };
          this.byteOffset = this.source.length;
          return result;
        } else {
          return null;
        }
      }

      // Get the next capture from whichever layer has the earliest highlight boundary
      const layer = this.layers[0];
      const nextCapture = layer.peekCapture();
      
      if (nextCapture) {
        const range = nextCapture.node;

        // If any previous highlight ends before this node starts, then before
        // processing this capture, emit the source code up until the end of the
        // previous highlight, and an end event for that highlight
        const highlightEndStack = layer.highlightEndStack;
        if (highlightEndStack.length > 0) {
          const endByte = highlightEndStack[highlightEndStack.length - 1];
          if (endByte <= range.startIndex) {
            highlightEndStack.pop();
            return this.emitEvent(endByte, { type: 'highlightEnd' });
          }
        }

        // Process the capture
        const capture = layer.nextCapture()!;

        // Process injections, local variables, and highlights
        if (capture.patternIndex < layer.config.localsPatternIndex) {
          // This is an injection
          const [languageName, contentNode, includeChildren] = injectionForMatch(
            layer.config,
            this.languageName,
            layer.config.query,
            { pattern: capture.patternIndex, patternIndex: capture.patternIndex, captures: [capture] } as QueryMatch,
            this.source,
          );

          if (languageName !== null && contentNode !== null) {
            const nextConfig = this.injectionCallback(languageName);
            if (nextConfig) {
              const ranges = HighlightIterLayer.intersectRanges(
                layer.ranges,
                [contentNode],
                includeChildren,
              );
              if (ranges.length > 0) {
                const newLayers = HighlightIterLayer.new(
                  this.source,
                  this.languageName,
                  this.highlighter,
                  this.cancellationFlag,
                  this.injectionCallback,
                  nextConfig,
                  layer.depth + 1,
                  ranges,
                );
                for (const newLayer of newLayers) {
                  this.insertLayer(newLayer);
                }
              }
            }
          }
          this.sortLayers();
          continue;
        }

        // Remove from the local scope stack any local scopes that have already ended
        while (range.startIndex > layer.scopeStack[layer.scopeStack.length - 1].range.end) {
          layer.scopeStack.pop();
        }

        // Process local variables
        let referenceHighlight: Highlight | null = null;
        let definitionHighlight: Highlight | null = null;

        if (capture.patternIndex < layer.config.highlightsPatternIndex) {
          // This is a local variable capture
          if (capture.name === "local.scope" && layer.config.localScopeCaptureIndex === capture.patternIndex) {
            definitionHighlight = null;
            const scope: LocalScope = {
              inherits: true,
              range: { start: range.startIndex, end: range.endIndex },
              localDefs: [],
            };
            layer.scopeStack.push(scope);
          } else if (capture.name === "local.definition" && layer.config.localDefCaptureIndex === capture.patternIndex) {
            referenceHighlight = null;
            definitionHighlight = null;
            const scope = layer.scopeStack[layer.scopeStack.length - 1];

            let valueRange = { start: 0, end: 0 };
            // Note: QueryCapture doesn't have captures property, this would need to be handled differently
            // For now, we'll use a simplified approach

            const name = this.source.slice(range.startIndex, range.endIndex);
            scope.localDefs.push({
              name,
              valueRange,
              highlight: null,
            });
            definitionHighlight = scope.localDefs[scope.localDefs.length - 1].highlight;
          } else if (capture.name === "local.reference" && layer.config.localRefCaptureIndex === capture.patternIndex && definitionHighlight === null) {
            definitionHighlight = null;
            const name = this.source.slice(range.startIndex, range.endIndex);
            
            for (let i = layer.scopeStack.length - 1; i >= 0; i--) {
              const scope = layer.scopeStack[i];
              const highlight = scope.localDefs.find(def => 
                def.name === name && range.startIndex >= def.valueRange.end
              )?.highlight;
              
              if (highlight !== undefined) {
                referenceHighlight = highlight;
                break;
              }
              
              if (!scope.inherits) {
                break;
              }
            }
          }

          this.sortLayers();
          continue;
        }

        // This is a highlight capture
        // If this exact range has already been highlighted by an earlier pattern, or by
        // a different layer, then skip over this one
        if (this.lastHighlightRange) {
          const [lastStart, lastEnd, lastDepth] = this.lastHighlightRange;
          if (range.startIndex === lastStart && range.endIndex === lastEnd && layer.depth < lastDepth) {
            this.sortLayers();
            continue;
          }
        }

        // Once a highlighting pattern is found for the current node, keep iterating over
        // any later highlighting patterns that also match this node
        let currentCapture = capture;
        while (true) {
          const nextCapture = layer.peekCapture();
          if (nextCapture && nextCapture.node === currentCapture.node) {
            const followingCapture = layer.nextCapture()!;
            // If the current node was found to be a local variable, then ignore
            // the following match if it's a highlighting pattern that is disabled
            // for local variables
            if ((definitionHighlight !== null || referenceHighlight !== null) &&
                layer.config.nonLocalVariablePatterns[followingCapture.patternIndex]) {
              continue;
            }
            currentCapture = followingCapture;
          } else {
            break;
          }
        }

        const currentHighlight = layer.config.highlightIndices[currentCapture.patternIndex];

        // If this node represents a local definition, then store the current
        // highlight value on the local scope entry representing this node
        if (definitionHighlight !== null) {
          definitionHighlight = currentHighlight;
        }

        // Emit a scope start event and push the node's end position to the stack
        const finalHighlight = referenceHighlight || currentHighlight;
        if (finalHighlight) {
          this.lastHighlightRange = [range.startIndex, range.endIndex, layer.depth];
          layer.highlightEndStack.push(range.endIndex);
          return this.emitEvent(range.startIndex, { type: 'highlightStart', highlight: finalHighlight });
        }
      } else {
        // If there are no more captures, then emit any remaining highlight end events
        const highlightEndStack = layer.highlightEndStack;
        if (highlightEndStack.length > 0) {
          const endByte = highlightEndStack.pop()!;
          return this.emitEvent(endByte, { type: 'highlightEnd' });
        }
        return this.emitEvent(this.source.length, null);
      }

      this.sortLayers();
    }
  }
}

// HtmlRenderer from the Rust implementation
export class HtmlRenderer {
  public html: Uint8Array;
  public lineOffsets: number[];
  public carriageReturnHighlight: Highlight | null = null;
  public lastCarriageReturn: number | null = null;

  constructor() {
    this.html = new Uint8Array(BUFFER_HTML_RESERVE_CAPACITY);
    this.lineOffsets = new Array(BUFFER_LINES_RESERVE_CAPACITY);
    this.lineOffsets[0] = 0;
  }

  setCarriageReturnHighlight(highlight: Highlight | null): void {
    this.carriageReturnHighlight = highlight;
  }

  reset(): void {
    this.html = new Uint8Array(BUFFER_HTML_RESERVE_CAPACITY);
    this.lineOffsets = new Array(BUFFER_LINES_RESERVE_CAPACITY);
    this.lineOffsets[0] = 0;
  }

  render(
    highlighter: Iterable<HighlightEvent>,
    source: string,
    attributeCallback: (highlight: Highlight, html: Uint8Array) => void,
  ): void {
    const highlights: Highlight[] = [];
    
    for (const event of highlighter) {
      switch (event.type) {
        case 'highlightStart':
          highlights.push(event.highlight);
          this.startHighlight(event.highlight, attributeCallback);
          break;
        case 'highlightEnd':
          highlights.pop();
          this.endHighlight();
          break;
        case 'source':
          this.addText(source.slice(event.start, event.end), highlights, attributeCallback);
          break;
      }
    }

    if (this.lastCarriageReturn !== null) {
      this.addCarriageReturn(this.lastCarriageReturn, attributeCallback);
    }

    if (this.html[this.html.length - 1] !== 10) { // '\n'
      this.appendToHtml(new TextEncoder().encode('\n'));
    }

    if (this.lineOffsets[this.lineOffsets.length - 1] === this.html.length) {
      this.lineOffsets.pop();
    }
  }

  lines(): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.lineOffsets.length; i++) {
      const lineStart = this.lineOffsets[i];
      const lineEnd = i + 1 === this.lineOffsets.length ? this.html.length : this.lineOffsets[i + 1];
      const lineBytes = this.html.slice(lineStart, lineEnd);
      result.push(new TextDecoder().decode(lineBytes));
    }
    return result;
  }

  private addCarriageReturn(offset: number, attributeCallback: (highlight: Highlight, html: Uint8Array) => void): void {
    if (this.carriageReturnHighlight) {
      const rest = this.html.slice(offset);
      this.html = this.html.slice(0, offset);
      this.appendToHtml(new TextEncoder().encode('<span '));
      attributeCallback(this.carriageReturnHighlight, this.html);
      this.appendToHtml(new TextEncoder().encode('></span>'));
      this.appendToHtml(rest);
    }
  }

  private startHighlight(h: Highlight, attributeCallback: (highlight: Highlight, html: Uint8Array) => void): void {
    this.appendToHtml(new TextEncoder().encode('<span '));
    attributeCallback(h, this.html);
    this.appendToHtml(new TextEncoder().encode('>'));
  }

  private endHighlight(): void {
    this.appendToHtml(new TextEncoder().encode('</span>'));
  }

  private addText(
    src: string,
    highlights: Highlight[],
    attributeCallback: (highlight: Highlight, html: Uint8Array) => void,
  ): void {
    const htmlEscape = (c: number): Uint8Array | null => {
      switch (c) {
        case 62: return new TextEncoder().encode('&gt;'); // '>'
        case 60: return new TextEncoder().encode('&lt;'); // '<'
        case 38: return new TextEncoder().encode('&amp;'); // '&'
        case 39: return new TextEncoder().encode('&#39;'); // '\''
        case 34: return new TextEncoder().encode('&quot;'); // '"'
        default: return null;
      }
    };
    
    for (let i = 0; i < src.length; i++) {
      const c = src.charCodeAt(i);
      const byte = new Uint8Array([c]);

      // Don't render carriage return characters, but allow lone carriage returns to be styled
      if (c === 13) { // '\r'
        this.lastCarriageReturn = this.html.length;
        continue;
      }

      if (this.lastCarriageReturn !== null) {
        if (c !== 10) { // '\n'
          this.addCarriageReturn(this.lastCarriageReturn, attributeCallback);
        }
        this.lastCarriageReturn = null;
      }

      // At line boundaries, close and re-open all of the open tags
      if (c === 10) { // '\n'
        for (const _ of highlights) {
          this.endHighlight();
        }
        this.appendToHtml(byte);
        this.lineOffsets.push(this.html.length);
        for (const scope of highlights) {
          this.startHighlight(scope, attributeCallback);
        }
      } else {
        const escape = htmlEscape(c);
        if (escape) {
          this.appendToHtml(escape);
        } else {
          this.appendToHtml(byte);
        }
      }
    }
  }

  private appendToHtml(bytes: Uint8Array): void {
    const newHtml = new Uint8Array(this.html.length + bytes.length);
    newHtml.set(this.html);
    newHtml.set(bytes, this.html.length);
    this.html = newHtml;
  }
}

// Helper function for injection processing
function injectionForMatch(
  config: HighlightConfiguration,
  parentName: string | null,
  query: Query,
  queryMatch: QueryMatch,
  source: string,
): [string | null, Node | null, boolean] {
  const contentCaptureIndex = config.injectionContentCaptureIndex;
  const languageCaptureIndex = config.injectionLanguageCaptureIndex;

  let languageName: string | null = null;
  let contentNode: Node | null = null;

  for (const capture of queryMatch.captures) {
    if (capture.name === "injection.language" && languageCaptureIndex !== null) {
      languageName = capture.node.text;
    } else if (capture.name === "injection.content" && contentCaptureIndex !== null) {
      contentNode = capture.node;
    }
  }

  let includeChildren = false;
  
  // Check for property settings in the query match
  if (queryMatch.setProperties) {
    for (const [key, value] of Object.entries(queryMatch.setProperties)) {
      switch (key) {
        case "injection.language":
          if (languageName === null) {
            languageName = value;
          }
          break;
        case "injection.self":
          if (languageName === null) {
            languageName = config.languageName;
          }
          break;
        case "injection.parent":
          if (languageName === null) {
            languageName = parentName;
          }
          break;
        case "injection.include-children":
          includeChildren = true;
          break;
      }
    }
  }

  return [languageName, contentNode, includeChildren];
}
