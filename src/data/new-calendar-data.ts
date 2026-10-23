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
    topics: [
        { week: 1, topic: 'Programming with Numbers, strings, images: IDE, interactions, operations on standard values' },
        { week: 2, topic: 'Definitions, functions, conditionals: type annotations, test cases' },
        { week: 3, topic: 'Ethics & Intro to tables: constructing, importing, extracting' },
        { week: 4, topic: 'More on tables: transforming, filtering' },
        { week: 5, topic: 'From tables to lists: extracting columns, performing operations on them, visualizing data' },
        { week: 6, topic: 'Computing with lists: iteration & mutable local variables' },
        { week: 7, topic: 'Structured data' },
        { week: 8, topic: 'Conditional and recursive data' },
        { week: 9, topic: 'Trees' },
        { week: 10, topic: 'Transition to Python: IDE, files, definitions, testing' },
        { week: 11, topic: 'Python: iteration & scoping' },
        { week: 12, topic: 'Python: mutable data structures' },
        { week: 13, topic: 'Tables in Python: pandas & csvs' },
        { week: 14, topic: 'Catch up, bonus content, etc. Depends on section / instructor.' },
        { week: 15, topic: 'Finals Period' },
    ],
    lectures: [
        { number: 1, date: '2026-09-09' },
        { number: 2, date: '2026-09-10' },
        { number: 3, date: '2026-09-14' },
        { number: 4, date: '2026-09-16' },
        { number: 5, date: '2026-09-17' },
        { number: 6, date: '2026-09-21' },
        { number: 7, date: '2026-09-23' },
        { number: 8, date: '2026-09-24' },
        { number: 9, date: '2026-09-28' },
        { number: 10, date: '2026-09-30' },
        { number: 11, date: '2026-10-01' },
        { number: 12, date: '2026-10-05' },
        { number: 13, date: '2026-10-07' },
        { number: 14, date: '2026-10-14' },
        { number: 15, date: '2026-10-15' },
        { number: 16, date: '2026-10-19' },
        { number: 17, date: '2026-10-21' },
        { number: 18, date: '2026-10-22' },
        { number: 19, date: '2026-10-26' },
        { number: 20, date: '2026-10-28' },
        { number: 21, date: '2026-10-29' },
        { number: 22, date: '2026-11-02' },
        { number: 23, date: '2026-11-04' },
        { number: 24, date: '2026-11-09' },
        { number: 25, date: '2026-11-12' },
        { number: 26, date: '2026-11-16' },
        { number: 27, date: '2026-11-18' },
        { number: 28, date: '2026-11-23' },
        { number: 29, date: '2026-11-30' },
        { number: 30, date: '2026-12-02' },
        { label: 'Dictionaries', number: 'XDict', date: '2026-12-07' },
        { label: 'Datavis', number: 'XMatplotlib', date: '2026-12-07' },
        { label: 'λ Calculus', number: 'Xλ', date: '2026-12-07' },
        { label: 'Y Combinator', number: 'XλY', date: '2026-12-07' },
    ],
    skillDays: ['2026-10-08', '2026-11-05', '2026-11-19', '2026-12-03'],
    homework: [
        { number: 1, dueDate: '2026-09-20' },
        { number: 2, dueDate: '2026-09-27' },
        { number: 3, dueDate: '2026-10-04' },
        { number: 4, dueDate: '2026-10-11' },
        { number: 5, dueDate: '2026-10-18' },
        { number: 6, dueDate: '2026-10-25' },
        { number: 7, dueDate: '2026-11-01' },
        { number: 8, dueDate: '2026-11-08' },
        { number: 9, dueDate: '2026-11-15' },
        { number: 10, dueDate: '2026-11-29' },
        { number: 11, dueDate: '2026-12-06' },
    ],
    labs: [
        { number: 1, date: '2026-09-15' },
        { number: 2, date: '2026-09-22' },
        { number: 3, date: '2026-09-29' },
        { number: 4, date: '2026-10-06' },
        { number: 5, date: '2026-10-13' },
        { number: 6, date: '2026-10-20' },
        { number: 7, date: '2026-10-27' },
        { number: 8, date: '2026-11-03' },
        { number: 9, date: '2026-11-10' },
        { number: 10, date: '2026-11-17' },
        { number: 11, date: '2026-12-01' },
        { number: 12, date: '2026-12-08' },
    ],
    skills: [
        { number: 0, startDate: '2026-09-21', endDate: '2026-10-09' },
        { number: 1, startDate: '2026-09-28', endDate: '2026-10-16' },
        { number: 2, startDate: '2026-10-05', endDate: '2026-10-23' },
        { number: 3, startDate: '2026-10-19', endDate: '2026-11-06' },
        { number: 4, startDate: '2026-10-26', endDate: '2026-11-20' },
        { number: 5, startDate: '2026-11-02', endDate: '2026-11-20' },
        { number: 6, startDate: '2026-11-09', endDate: '2026-11-24' },
        { number: 7, startDate: '2026-11-16', endDate: '2026-12-11' },
        { number: 8, startDate: '2026-11-16', endDate: '2026-12-11' },
        { number: 9, startDate: '2026-11-23', endDate: '2026-12-11' },
        { number: 10, startDate: '2026-11-23', endDate: '2026-12-11' },
        { number: 11, startDate: '2026-09-28', endDate: '2026-11-06' },
        { number: 12, startDate: '2026-09-28', endDate: '2026-11-06' },
    ],
    holidays: [
        { label: 'Labor Day', startDate: '2026-09-07' },
        { label: "Indg. People's Day", startDate: '2026-10-12' },
        { label: 'Veterans Day', startDate: '2026-11-11' },
        { label: 'No HW Due', kind: 'note', startDate: '2026-11-22' },
        { label: 'No Lab', startDate: '2026-11-24' },
        { label: 'Thanks. Break', startDate: '2026-11-25', endDate: '2026-11-27' },
    ],
    officeHours: [
        { kind: 'weekly', weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'], startDate: '2026-09-09', endDate: '2026-12-11' },
    ],
}
