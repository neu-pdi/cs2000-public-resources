import { useEffect, useLayoutEffect, useState } from 'react';
import { fetchSheetCsv, readStored, writeStored } from '../utils/sheets';

/** Rows fetched during this page session, keyed by URL, and survives client-side navigation */
const memoryCache = new Map<string, string[][]>();

/**
 * Rows of a sheet tab, shown from cache immediately when available and replaced once a
 * fresh fetch succeeds. `null` until either the cache or the network provides rows.
 * `failed` is only set when the fetch fails and there is nothing cached to show
 */
export function useSheetCsv(
  url: string,
  validate: (rows: string[][]) => void = () => {}
): { rows: string[][] | null; failed: boolean } {
    // First check memory cache
    const [rows, setRows] = useState<string[][] | null>(() => memoryCache.get(url) ?? null);
    const [failed, setFailed] = useState(false);

    // localStorage is read after hydration to avoid a server/client mismatch, but still before paint
    useLayoutEffect(() => {
        if (memoryCache.has(url)) return;
        const stored = readStored(url);
        if (stored) {
        memoryCache.set(url, stored);
        setRows(stored);
        }
    }, [url]);

    useEffect(() => {
        const controller = new AbortController();
        fetchSheetCsv(url, controller.signal, validate)
        .then((fresh) => {
            memoryCache.set(url, fresh);
            writeStored(url, fresh);
            setRows(fresh);
        })
        .catch((err) => {
            if (err.name === 'AbortError') return;
            console.error(`Could not load ${url}:`, err);
            // Keep showing cached rows if we have them
            if (!memoryCache.has(url)) setFailed(true);
        });
        return () => controller.abort();
    }, [url]);

    return { rows, failed };
}
