import { useState, useEffect, useCallback } from 'react';
import { highlightWithTreeSitter, type HighlightResult } from './tree-sitter-highlighter';

export function useTreeSitterHighlight(code: string, language: string) {
  const [result, setResult] = useState<HighlightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const highlight = useCallback(async () => {
    if (!code || !language) {
      setResult(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const highlightResult = await highlightWithTreeSitter(code, language);
      setResult(highlightResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Highlighting failed');
      // Set a fallback result
      const fallbackLines = code.split('\n').map(line => ({
        tokens: [{ content: line, type: 'text', className: 'token' }]
      }));
      setResult({
        lines: fallbackLines,
        className: `language-${language}`,
        style: {},
      });
    } finally {
      setLoading(false);
    }
  }, [code, language]);

  useEffect(() => {
    highlight();
  }, [highlight]);

  return {
    result,
    loading,
    error,
    refresh: highlight,
  };
}
