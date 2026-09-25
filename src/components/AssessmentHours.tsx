import React, { useEffect, useState } from 'react';

import { parseCsv } from '@site/src/utils/csv';

/**
 * CSV export of the assessment-hours tab of the staff scheduling sheet.
 *
 * Google's export endpoint does send `Access-Control-Allow-Origin` (on both the 307
 * and the redirected response), so CORS itself is not an obstacle.
 */
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/1kDfzuVIM3s-NDJVf6rdgna06Cl1MGMQAVSqm1XEHFyY/export?format=csv&gid=1134536581';

/**
 * Origin of a path-preserving proxy for docs.google.com, used as a fallback: Google
 * Workspace policies (Northeastern's included) can block docs.google.com for signed-in
 * accounts, which breaks the direct fetch for exactly the students who need this table.
 * Swapping the origin and keeping the path reaches the same CSV.
 *
 * NOTE: as of 2026-09-17 this fallback cannot succeed yet. The proxy's TLS certificate
 * expired 2026-01-08 (so browsers refuse the connection), and it allowlists sheets by
 * id -- this sheet currently returns 403 while the older scheduling sheet returns 200.
 * Renew the certificate and allowlist this sheet id to activate the fallback; set to
 * '' to stop attempting it.
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
 * Matches a bare time range: "3-4pm", "10:30am-12:00pm", "12:15-1:15pm", "9-10am".
 * Such lines are bolded so the times stand out from the room/staff line under them.
 */
const TIME_RE =
  /^\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*[-–—]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?$/i;


/**
 * Keep only the leading block of rows, stopping at the first entirely blank row.
 *
 * The sheet holds working notes below the table (including TA names, which are
 * deliberately not published), separated from it by a blank row. Slicing at that
 * blank row means a campus can be added to the table without touching this code.
 */
export function tableRows(all: string[][]): string[][] {
  const blank = all.findIndex((row) => row.every((cell) => !cell.trim()));
  return blank === -1 ? all : all.slice(0, blank);
}

function CellLines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {TIME_RE.test(line.trim()) ? <strong>{line}</strong> : line}
        </React.Fragment>
      ))}
    </>
  );
}

export default function AssessmentHours({ csvUrl = CSV_URL }: { csvUrl?: string }) {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [failed, setFailed] = useState(false);

  // Fetched on mount rather than at build time so edits to the sheet show up without
  // a redeploy. Server-rendered output is therefore empty, and the table appears once
  // this resolves.
  useEffect(() => {
    const controller = new AbortController();

    async function load(url: string) {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const kept = tableRows(parseCsv(await res.text()));
      // A header plus at least one campus; anything less means we got something other
      // than the expected sheet (e.g. a sign-in page after a sharing change, or an
      // interstitial from a network that filters Google Docs).
      if (kept.length < 2) throw new Error('unexpected sheet contents');
      return kept;
    }

    (async () => {
      // Try Google directly first -- it is fastest and works for most people. Only if
      // that fails (e.g. a Workspace policy blocking docs.google.com) fall back to the
      // proxy, so the common case never pays for the extra hop.
      const sources = [csvUrl, viaProxy(csvUrl)].filter(Boolean) as string[];
      const errors: unknown[] = [];
      for (const url of sources) {
        try {
          setRows(await load(url));
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          errors.push(err);
        }
      }
      console.error('Could not load assessment hours:', errors);
      setFailed(true);
    })();

    return () => controller.abort();
  }, [csvUrl]);

  if (failed) {
    return (
      <p>
        <em>
          Could not load the assessment hours schedule. Please check Discord for
          current times.
        </em>
      </p>
    );
  }

  // Blank until the fetch resolves.
  if (!rows) return null;

  const [header, ...body] = rows;

  return (
    <table>
      <thead>
        <tr>
          {header.map((cell, i) => (
            <th key={i}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td key={c}>
                {c === 0 ? <strong>{cell}</strong> : <CellLines text={cell} />}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
