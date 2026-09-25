/**
 * Online (Discord) office hours, read from the scheduling sheet at runtime.
 *
 * Sheet shape: column A holds a day name ("Mondays", "Wednesday"), then one row per
 * one-hour slot, then a blank row before the next day. Remaining columns name the TA
 * covering the slot and are ignored here. Adjacent slots are merged, so four rows of
 * 7-8/8-9/9-10/10-11pm become a single "7-11pm".
 */
import { sheetCsvUrl } from '../utils/sheets';

/** The "online office hours" tab of the scheduling sheet. */
export const ONLINE_OH_CSV_URL = sheetCsvUrl('434058018');

/** Eastern is always three hours ahead of Pacific, so one offset covers the year. */
const ET_MINUS_PT_MINUTES = 3 * 60;

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const TIME_RANGE_RE =
  /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i;

export interface Range {
  /** Minutes since midnight. */
  start: number;
  end: number;
}

function to24(hour: number, minute: number, meridiem: 'am' | 'pm'): number {
  return ((hour % 12) + (meridiem === 'pm' ? 12 : 0)) * 60 + minute;
}

/**
 * Parse "6-7pm", "10-11pm", "12:15-1:15pm". The start often omits am/pm, so it is
 * inferred as the latest reading that still falls before the end.
 */
export function parseTimeRange(text: string): Range | null {
  const m = TIME_RANGE_RE.exec(text.trim());
  if (!m) return null;

  const [, sh, sm, sMer, eh, em, eMer] = m;
  const endMeridiem = (eMer?.toLowerCase() as 'am' | 'pm') ?? 'pm';
  const end = to24(Number(eh), Number(em ?? 0), endMeridiem);

  let start: number;
  if (sMer) {
    start = to24(Number(sh), Number(sm ?? 0), sMer.toLowerCase() as 'am' | 'pm');
  } else {
    const candidates = (['pm', 'am'] as const)
      .map((mer) => to24(Number(sh), Number(sm ?? 0), mer))
      .filter((value) => value < end);
    start =
      candidates.length > 0
        ? Math.max(...candidates)
        : to24(Number(sh), Number(sm ?? 0), endMeridiem);
  }
  return end > start ? { start, end } : null;
}

/** Sort and coalesce ranges that touch or overlap. */
export function mergeRanges(ranges: Range[]): Range[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: Range[] = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

function formatClock(minutes: number, withMeridiem: boolean): string {
  const total = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(total / 60);
  const minute = total % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const meridiem = hour24 < 12 ? 'am' : 'pm';
  return `${hour12}${minute ? `:${String(minute).padStart(2, '0')}` : ''}${
    withMeridiem ? meridiem : ''
  }`;
}

/** "6-8pm", or "11am-1pm" when the range straddles noon. */
export function formatRange({ start, end }: Range): string {
  const sameHalf = Math.floor(start / 720) === Math.floor(end / 720);
  return `${formatClock(start, !sameHalf)}-${formatClock(end, true)}`;
}

function shift(range: Range, minutes: number): Range {
  return { start: range.start + minutes, end: range.end + minutes };
}

/** "4-6pmET/1-3pmPT, 7-9pmET/4-6pmPT" -- the form the calendar cells display. */
export function formatDualZone(ranges: Range[]): string {
  return ranges
    .map(
      (range) =>
        `${formatRange(range)}ET/${formatRange(shift(range, -ET_MINUS_PT_MINUTES))}PT`
    )
    .join(', ');
}

/**
 * Map weekday (0=Sunday, matching `Date.getDay`) to the display string for that day.
 *
 * A blank row does not end the current day: the sheet separates Wednesday's afternoon
 * and evening blocks with one, and the later block carries no day header of its own.
 * Only a new day name switches days.
 */
export function parseOnlineOfficeHours(rows: string[][]): Record<number, string> {
  const byDay = new Map<number, Range[]>();
  let day: number | null = null;

  for (const row of rows) {
    const cell = (row[0] ?? '').trim();
    if (!cell) continue;

    const named = DAY_NAMES.indexOf(cell.toLowerCase().replace(/s$/, ''));
    if (named !== -1) {
      day = named;
      if (!byDay.has(day)) byDay.set(day, []);
      continue;
    }

    const range = parseTimeRange(cell);
    if (range && day !== null) {
      byDay.get(day)!.push(range);
    }
  }

  const result: Record<number, string> = {};
  for (const [dayIndex, ranges] of byDay) {
    if (ranges.length === 0) continue;
    result[dayIndex] = formatDualZone(mergeRanges(ranges));
  }
  return result;
}
