/**
 * A calendar date written as 'YYYY-MM-DD'. Dates are kept as strings rather than
 * `Date`s because `new Date('2026-09-06')` is parsed as midnight UTC, which is the
 * previous evening in Boston. Use {@link parseIsoDate} to get a local `Date`.
 */
export type IsoDate = `${number}-${number}-${number}`;

/**
 * Parses an {@link IsoDate} as local midnight
 *
 * @param date The date to parse
 * @returns The date at local midnight
 *
 * @author Logan Gill
 */
export function parseIsoDate(date: IsoDate): Date {
    return new Date(`${date}T00:00:00`);
}

export interface CalendarInfo {
    startDate: IsoDate;
    endDate: IsoDate;
    topics: TopicInfo[];
    lectures: LectureInfo[];
    skillDays: SkillDayInfo[];
    homework: HomeworkInfo[];
    labs: LabInfo[];
    skills: SkillInfo[];
    holidays: HolidayInfo[];
    officeHours: OfficeHourInfo[];
}

export interface TopicInfo {
    /** 1-based week number, counted from CalendarInfo.startDate */
    week: number;
    /** Last week this topic covers (inclusive). Defaults to `week` (one week) */
    endWeek?: number;
    /** Defaults to 'Week N' (or 'Weeks N–M') */
    label?: string;
    topic: string;
}

export interface LectureInfo {
    label?: string;
    number: number | string;
    date: IsoDate;
    href?: string;
}

export type SkillDayInfo = IsoDate;

export interface HomeworkInfo {
    label?: string;
    number: number;
    releaseDate?: IsoDate;
    dueDate: IsoDate;
    href?: string;
}

export interface LabInfo {
    label?: string;
    number: number;
    date: IsoDate;
    note?: string;
    href?: string;
}

export interface SkillInfo {
    number: number;
    startDate: IsoDate;
    endDate: IsoDate;
}

/**
 * - 'no-class': a day off (e.g. Labor Day), and is skipped when computing skill ranges and
 *   office hours
 * - 'note': an annotation on an otherwise normal day (e.g. 'No HW Due'), and is shown on
 *   the calendar but does not affect the schedule
 */
export type HolidayKind = 'no-class' | 'note';

export interface HolidayInfo {
    label?: string;
    /** Defaults to 'no-class' */
    kind?: HolidayKind;
    startDate: IsoDate;
    endDate?: IsoDate;
}

export type OfficeHourInfo = WeeklyOfficeHours | DateOfficeHours;
export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type OfficeHourType = 'online' | 'in-person' | 'both';


export interface WeeklyOfficeHours {
    kind: 'weekly';
    weekdays: Weekday[];
    startDate: IsoDate;
    endDate: IsoDate;
    skipDates?: IsoDate[]; // no-class holidays are skipped automatically
    times?: OfficeHourTime[];
}

export interface DateOfficeHours {
    kind: 'date';
    date: IsoDate; // replaces any weekly hours on this date
    times?: OfficeHourTime[];
}

/**
 * A time of day written as 'HH:MM' in 24-hour Eastern time (e.g. '19:00')
 */
export type IsoTime = `${number}:${number}`;

export interface OfficeHourTime {
    startTime: IsoTime;
    endTime: IsoTime;
    type?: OfficeHourType;
}

export const calendarData: CalendarInfo = {
    startDate: '2026-09-06',
    endDate: '2026-12-19',
    topics: [],
    lectures: [],
    skillDays: [],
    homework: [],
    labs: [],
    skills: [],
    holidays: [],
    officeHours: [],
}
