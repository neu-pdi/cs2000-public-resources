import {
  calendarData,
  parseIsoDate,
  type HolidayInfo,
  type HomeworkInfo,
  type IsoDate,
  type LabInfo,
  type LectureInfo,
  type OfficeHourTime,
  type Weekday,
} from '../data/calendar-data';

type CalendarItem = 'lectures' | 'lab' | 'homework';

export type DateItem = CalendarItem | 'skills';

export interface SkillDateRange {
  start: Date;
  end: Date;
}

export interface CalendarLink {
  label: string;
  href: string;
}

export interface CalendarLab extends CalendarLink {
  note?: string;
}

/**
 * A single day of the calendar, derived from {@link calendarData} for rendering
 */
export interface CalendarDay {
  date: IsoDate;
  isHoliday: boolean;
  holidayName?: string;
  lectures: CalendarLink[];
  lab?: CalendarLab;
  homework?: CalendarLink;
  /** Whether online office hours run on this day */
  onlineOH: boolean;
  /** Hard-coded office hour times, if any. The scheduling sheet takes priority over these */
  officeHourTimes?: OfficeHourTime[];
  skills: number[];
}

/**
 * A week of the calendar. `days` is [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
 */
export interface CalendarWeek {
  label?: string;
  topic?: string;
  days: CalendarDay[];
}

export interface CalendarMonth {
  month: string;
  year: number;
  weeks: CalendarWeek[];
}

const SKILL_DAY_LINK: CalendarLink = { label: 'Skill Day', href: '/skills/#skill-days-in-class' };

const WEEKDAYS: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
  const expiryDate = parseIsoDate(calendarData.endDate);
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  return new Date() >= expiryDate;
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
 * Gets the latest href for the given calendar item. For homework, this is the next homework
 * that is due (or the first homework if there are none left), and for lectures and labs, this
 * is the most recent one that has happened
 *
 * @param item The item to get the latest href for (lectures, lab, homework)
 * @returns The latest href, or undefined if not found
 *
 * @author Logan Gill
 */
function getLatestCalendarHref(item: CalendarItem): string | undefined {
  // Today's date
  const today = new Date();
  // Set time to max since we do not care for it
  today.setHours(23, 59, 59, 999);

  if (item === 'homework') {
    const homework = sortByDate(calendarData.homework, ({ dueDate }) => dueDate);
    // If there is no next homework, use the first homework
    const nextHomework = homework.find(({ dueDate }) => parseIsoDate(dueDate) >= today) ?? homework[0];
    return nextHomework && homeworkLink(nextHomework).href;
  }

  if (item === 'lab') {
    const pastLabs = sortByDate(calendarData.labs, ({ date }) => date)
      .filter(({ date }) => parseIsoDate(date) <= today);
    const latestLab = pastLabs.at(-1);
    return latestLab && labLink(latestLab).href;
  }

  // We only show lectures that have days, since we do not want to show summary days
  const pastLectures = sortByDate(calendarData.lectures, ({ date }) => date)
    .map((lecture) => ({ date: lecture.date, href: lectureLink(lecture).href }))
    .filter(({ date, href }) => parseIsoDate(date) <= today && href.startsWith('/days/'));
  // If there are multiple lectures on the latest day, use the first one listed
  const latestDate = pastLectures.at(-1)?.date;
  return pastLectures.find(({ date }) => date === latestDate)?.href;
}

/**
 * Gets the date of the lecture, lab, or homework with the given ID
 *
 * @param id The document ID (the last part of the item's href)
 * @param item The type of item to look for
 * @returns The date of the item (due date for homework), or null if not found
 *
 * @author Logan Gill
 */
export function DateFor(
    id: string,
    item: Exclude<DateItem, 'skills'>,
): Date | null {
    const matchesId = (href: string) => getDocumentIdFromHref(href, '') === id;

    let date: IsoDate | undefined;
    if (item === 'lectures') {
        date = calendarData.lectures.find((lecture) => matchesId(lectureLink(lecture).href))?.date;
    } else if (item === 'lab') {
        date = calendarData.labs.find((lab) => matchesId(labLink(lab).href))?.date;
    } else {
        date = calendarData.homework.find((homework) => matchesId(homeworkLink(homework).href))?.dueDate;
    }

    return date ? parseIsoDate(date) : null;
}

/**
 * Gets the ranges at which a skill is available. Each range is trimmed so that it starts
 * and ends on a day the skill is actually available (see {@link isSkillDay})
 *
 * @param skill The skill to get the date ranges for
 * @returns The date ranges at which the skill is available, in order
 *
 * @author Logan Gill
 */
export function getSkillDateRanges(skill: number): SkillDateRange[] {
    return sortByDate(
        calendarData.skills.filter(({ number }) => number === skill),
        ({ startDate }) => startDate,
    ).flatMap(({ startDate, endDate }) => {
        let start = startDate;
        while (start <= endDate && !isSkillDay(start)) {
            start = addDays(start, 1);
        }
        let end = endDate;
        while (end >= start && !isSkillDay(end)) {
            end = addDays(end, -1);
        }

        return start <= end ? [{ start: parseIsoDate(start), end: parseIsoDate(end) }] : [];
    });
}

/**
 * Builds the calendar as months of weeks of days, for rendering. Weeks start on
 * {@link calendarData}'s start date, and each week belongs to the month its Sunday is in
 *
 * @returns The calendar months
 *
 * @author Logan Gill
 */
export function getCalendarMonths(): CalendarMonth[] {
    const months: CalendarMonth[] = [];

    for (
        let sunday = calendarData.startDate, weekNumber = 1;
        sunday <= calendarData.endDate;
        sunday = addDays(sunday, 7), weekNumber++
    ) {
        const sundayDate = parseIsoDate(sunday);
        const month = MONTHS[sundayDate.getMonth()];
        const year = sundayDate.getFullYear();
        if (months.at(-1)?.month !== month || months.at(-1)?.year !== year) {
            months.push({ month, year, weeks: [] });
        }

        // Multi-week topics are only labeled on their first week
        const topic = calendarData.topics.find(({ week }) => week === weekNumber);
        const endWeek = topic?.endWeek ?? topic?.week;
        const defaultLabel = endWeek !== weekNumber ? `Weeks ${weekNumber}–${endWeek}` : `Week ${weekNumber}`;

        months.at(-1)!.weeks.push({
            label: topic && (topic.label ?? defaultLabel),
            topic: topic?.topic,
            days: Array.from({ length: 7 }, (_, index) => getCalendarDay(addDays(sunday, index))),
        });
    }

    return months;
}

/**
 * Builds everything that happens on a single day
 *
 * @param date The date to build
 * @returns The calendar day
 *
 * @author Logan Gill
 */
function getCalendarDay(date: IsoDate): CalendarDay {
    const holiday = holidayOn(date);
    const lab = calendarData.labs.find((lab) => lab.date === date);
    const homework = calendarData.homework.find(({ dueDate }) => dueDate === date);
    const officeHours = officeHoursOn(date);

    return {
        date,
        isHoliday: holiday !== undefined,
        holidayName: holiday?.label,
        lectures: [
            ...calendarData.lectures.filter((lecture) => lecture.date === date).map(lectureLink),
            ...calendarData.skillDays.filter((skillDay) => skillDay === date).map(() => SKILL_DAY_LINK),
        ],
        lab: lab && { ...labLink(lab), note: lab.note },
        homework: homework && homeworkLink(homework),
        onlineOH: officeHours !== undefined,
        officeHourTimes: officeHours?.times,
        skills: isSkillDay(date)
            ? calendarData.skills
                .filter(({ startDate, endDate }) => isInRange(date, startDate, endDate))
                .map(({ number }) => number)
            : [],
    };
}

function lectureLink({ label, number, href }: LectureInfo): CalendarLink {
    return { label: label ?? `Class ${number}`, href: href ?? `/days/${number}` };
}

function labLink({ label, number, href }: LabInfo): CalendarLink {
    return { label: label ?? `Lab ${number}`, href: href ?? `/lab/${number}` };
}

function homeworkLink({ label, number, href }: HomeworkInfo): CalendarLink {
    return { label: label ?? `HW ${number} due`, href: href ?? `/homework/${number}` };
}

function holidayOn(date: IsoDate): HolidayInfo | undefined {
    return calendarData.holidays.find(({ startDate, endDate }) => isInRange(date, startDate, endDate));
}

function isNoClassDay(date: IsoDate): boolean {
    const holiday = holidayOn(date);
    return holiday !== undefined && (holiday.kind ?? 'no-class') === 'no-class';
}

/**
 * Skills are available on weekdays, except no-class holidays that do not set `skillsAvailable`
 */
function isSkillDay(date: IsoDate): boolean {
    const holiday = holidayOn(date);
    return !isWeekend(parseIsoDate(date)) && !(isNoClassDay(date) && !holiday?.skillsAvailable);
}

/**
 * Gets the office hours on a date. A date-specific entry replaces any weekly hours, and
 * weekly hours skip no-class holidays and their own skip dates
 *
 * @returns The office hours, or undefined if there are none that day
 */
function officeHoursOn(date: IsoDate): { times?: OfficeHourTime[] } | undefined {
    const dateHours = calendarData.officeHours.find((hours) => hours.kind === 'date' && hours.date === date);
    if (dateHours) {
        return dateHours;
    }

    const weekday = WEEKDAYS[parseIsoDate(date).getDay()];
    return calendarData.officeHours.find((hours) =>
        hours.kind === 'weekly'
        && hours.weekdays.includes(weekday)
        && isInRange(date, hours.startDate, hours.endDate)
        && !hours.skipDates?.includes(date)
        && !isNoClassDay(date)
    );
}

function isInRange(date: IsoDate, startDate: IsoDate, endDate: IsoDate = startDate): boolean {
    return date >= startDate && date <= endDate;
}

function sortByDate<T>(items: T[], getDate: (item: T) => IsoDate): T[] {
    return [...items].sort((first, second) => getDate(first).localeCompare(getDate(second)));
}

function addDays(date: IsoDate, days: number): IsoDate {
    const result = parseIsoDate(date);
    result.setDate(result.getDate() + days);
    return toIsoDate(result);
}

export function FormatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
}

function toIsoDate(date: Date): IsoDate {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map((part, index) => index === 0 ? part.toString() : part.toString().padStart(2, '0'))
        .join('-') as IsoDate;
}
