import { parseCsv } from './csv';

/** Spreadsheet holding the staff scheduling tabs. */
export const SCHEDULE_SHEET_ID = '1kDfzuVIM3s-NDJVf6rdgna06Cl1MGMQAVSqm1XEHFyY';

/** CSV export URL for one tab (`gid`) of the scheduling sheet. */
export function sheetCsvUrl(gid: string, id: string = SCHEDULE_SHEET_ID): string {
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

/**
 * Origin of a path-preserving proxy for docs.google.com, used as a fallback: Google
 * Workspace policies (Northeastern's included) can block docs.google.com for signed-in
 * accounts, which breaks the direct fetch for exactly the students who need these
 * schedules. Swapping the origin and keeping the path reaches the same CSV.
 *
 * Verified working 2026-10-01: valid certificate, `Access-Control-Allow-Origin: *` on
 * both the redirect and the preflight, and any sheet id accepted (paths outside
 * /spreadsheets/ are refused). Set to '' to stop attempting the fallback.
 *
 * Caveat: the proxy passes Google's 307 through rather than following it, so the CSV
 * body itself is fetched from doc-*.googleusercontent.com. That shields the
 * docs.google.com hop only -- a policy blocking *.googleusercontent.com as well would
 * still break this. Having the proxy follow the redirect server-side and return the
 * body would close that gap.
 */
const PROXY_ORIGIN = 'https://metal.dbp.io:10321';

/** Route a docs.google.com URL through {@link PROXY_ORIGIN}, preserving path and query. */
function viaProxy(url: string): string | null {
  if (!PROXY_ORIGIN) return null;
  try {
    const parsed = new URL(url);
    return `${PROXY_ORIGIN}${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}

/**
 * Fetch and parse a sheet tab as CSV, trying Google directly first and only falling
 * back to the proxy if that fails -- so the common case never pays for the extra hop.
 *
 * `validate` is given the parsed rows and should throw if they don't look like the
 * expected sheet; that way a sign-in page or a captive-portal interstitial is treated
 * as a failure of this source and the next one is tried, rather than rendered.
 */
export async function fetchSheetCsv(
  url: string,
  signal: AbortSignal,
  validate: (rows: string[][]) => void = () => {}
): Promise<string[][]> {
  const sources = [url, viaProxy(url)].filter(Boolean) as string[];
  const errors: unknown[] = [];

  for (const source of sources) {
    try {
      const res = await fetch(source, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = parseCsv(await res.text());
      validate(rows);
      return rows;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      errors.push(err);
    }
  }
  throw new AggregateError(errors, `could not load ${url}`);
}
