import { calendarData, type CalendarDay } from '../data/calendar-data';

type CalendarItem = keyof Pick<CalendarDay, 'lectures' | 'lab' | 'homework'>;

/**
 * Gets the latest document ID for the given calendar item
 * 
 * @param item The item to get the latest document ID for (lectures, lab, homework)
 * @returns The latest document ID
 * 
 * @author Logan Gill
 */
export function getDocumentId(item: CalendarItem): string {
  const href = getLatestCalendarHref(item);
  const fallback = item === 'lectures' ? 'l0-summary' : '1';
  if (isCalendarExpired()) {
    return fallback;
  }
  return getDocumentIdFromHref(href, fallback);
}

/**
 * Checks whether the calendar is more than one month past its final date
 *
 * @returns Whether the calendar has expired
 *
 * @author Logan Gill
 */
function isCalendarExpired(): boolean {
  const calendarDays = calendarData.flatMap((month) =>
    month.weeks.flatMap((week) =>
      week.days.map(
        (calendarDay) =>
          new Date(`${calendarDay.date}T00:00:00`)
      )
    )
  );

  if (calendarDays.length === 0) {
    return false;
  }

  const lastCalendarDate = new Date(Math.max(...calendarDays.map((date) => date.getTime())));
  lastCalendarDate.setMonth(lastCalendarDate.getMonth() + 1);

  return new Date() >= lastCalendarDate;
}

/**
 * Gets the document ID from a given href
 * 
 * @param href The href to extract the document ID from
 * @param fallback The fallback value to use if the href is undefined or invalid
 * @returns The document ID
 * 
 * @author Logan Gill
 */
function getDocumentIdFromHref(href: string | undefined, fallback: string): string {
  return href?.split('/').pop() ?? fallback;
}

/**
 * Gets the latest href for the given calendar item
 * 
 * @param item The item to get the latest href for (lectures, lab, homework)
 * @returns The latest href, or undefined if not found
 * 
 * @author Logan Gill
 */
function getLatestCalendarHref(item: CalendarItem): string | undefined {
  const calendarDay = getLatestCalendarDay(item);

  if (!calendarDay) {
    return undefined;
  }

  if (item === 'lectures') {
    return calendarDay.lectures?.find(({ href }) => href.startsWith('/days/'))?.href;
  }

  return item === 'lab' ? calendarDay.lab?.href : calendarDay.homework?.href;
}

/**
 * Gets the latest calendar day for the given calendar item
 * 
 * @param item The item to get the latest calendar day for (lectures, lab, homework)
 * @returns The latest calendar day, or undefined if not found
 * 
 * @author Logan Gill
 */
function getLatestCalendarDay(item: CalendarItem): CalendarDay | undefined {
  // Today's date
  const today = new Date();
  // Set time to max since we do not care for it
  today.setHours(23, 59, 59, 999);

  const calendarDays = calendarData
    // Formats the calendar data into a flat array of {calendarDay, date} objects
    .flatMap((month) =>
      month.weeks.flatMap((week) =>
        week.days.map((calendarDay) => ({
          calendarDay,
            date: new Date(`${calendarDay.date}T00:00:00`),
        }))
      )
    );

  return calendarDays
    // Reverses since we want the last valid item
    .reverse()
    .find(({ calendarDay, date }) => {
      if (date > today) {
        return false;
      }

      // We only show lectures that have days, since we do not want to show skill days or summary days
      if (item === 'lectures') {
        return calendarDay.lectures?.some(({ href }) => href.startsWith('/days/')) ?? false;
      }

      return item === 'lab' ? calendarDay.lab !== undefined : calendarDay.homework !== undefined;
    })?.calendarDay;
}