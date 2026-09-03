import { calendarData, type CalendarDay, type Skill } from '../../data/calendar-data';
import { Text } from '@chakra-ui/react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

type DateItem = keyof Pick<CalendarDay, 'lectures' | 'lab' | 'homework' | 'skills'>;

interface CalendarPageFrontMatter {
    day_number?: number;
    lab_number?: number;
    homework_number?: number;
}

type DatePageFrontMatter = CalendarPageFrontMatter & Record<string, unknown>;

export interface SkillDateRange {
    start: Date;
    end: Date;
}

export interface DateViewProps {
    id: string;
    item: DateItem;
}

export function FormattedDate(id: string, item: DateItem): string {
    if (item === 'skills') {
        const skill = Number(id);
        const ranges = Number.isInteger(skill) ? SkillDateRanges(skill) : [];

        return ranges.length > 0
            ? ranges.map(({ start, end }) => `${formatDate(start)} - ${formatDate(end)}`).join(', ')
            : 'Date unavailable';
    }

    const date = DateFor(id, item);
    return date ? formatDate(date) : 'Date unavailable';
}

export function DateFor(
    id: string,
    item: Exclude<DateItem, 'skills'>,
): Date | null {
    const matchingDay = calendarData
        .flatMap((month) => month.weeks.flatMap((week) => week.days))
        .find((day) => {
            if (item === 'lectures') {
                return day.lectures?.some((lecture) => lecture.href.split('/').pop() === id) ?? false;
            }

            return day[item]?.href.split('/').pop() === id;
        });

    return matchingDay ? new Date(`${matchingDay.date}T00:00:00`) : null;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Gets the range at which a skill is available. This is determained by getting the consecutive days the skill is available, excluding weekends and holidays
 * 
 * @param skill The skill to get the date ranges for
 * 
 * @returns The date ranges at which the skill is available
 * 
 * @author Logan Gill
 */
export function SkillDateRanges(skill: Skill): SkillDateRange[] {
    const days = calendarData
        .flatMap((month) => month.weeks.flatMap((week) => week.days))
        .filter((day) => day.skills?.includes(skill) && !day.isHoliday)
        .map((day) => ({
            day,
            date: new Date(`${day.date}T00:00:00`),
        }))
        .filter(({ date }) => !isWeekend(date))
        .sort(({ date: firstDate }, { date: secondDate }) => firstDate.getTime() - secondDate.getTime());

    const ranges: SkillDateRange[] = [];

    for (const { date } of days) {
        const previousRange = ranges.at(-1);
        if (!previousRange || !isNextInstructionalDate(previousRange.end, date)) {
            ranges.push({ start: date, end: date });
        } else {
            previousRange.end = date;
        }
    }

    return ranges;
}

function isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
}

function isNextInstructionalDate(previousDate: Date, currentDate: Date): boolean {
    const nextDate = new Date(previousDate);
    nextDate.setDate(nextDate.getDate() + 1);

    while (isWeekend(nextDate) || isHoliday(nextDate)) {
        nextDate.setDate(nextDate.getDate() + 1);
    }

    return nextDate.getTime() === currentDate.getTime();
}

function isHoliday(date: Date): boolean {
    return calendarData
        .flatMap((month) => month.weeks.flatMap((week) => week.days))
        .some((day) => day.isHoliday && day.date === toIsoDate(date));
}

function toIsoDate(date: Date): string {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map((part, index) => index === 0 ? part.toString() : part.toString().padStart(2, '0'))
        .join('-');
}

export default function DateView({ id, item }: DateViewProps) {
    const date = FormattedDate(id, item);
    return (
        <Text as="span">
            {date}
        </Text>
    );
}

export function DayDate() {
    const { frontMatter } = useDoc();
    const { day_number } = frontMatter as DatePageFrontMatter;
    return <DateView id={String(day_number)} item="lectures" />;
}

export function LabDate() {
    const { frontMatter } = useDoc();
    const { lab_number } = frontMatter as DatePageFrontMatter;
    return <DateView id={String(lab_number)} item="lab" />;
}

export function HomeworkDate() {
    const { frontMatter } = useDoc();
    const { homework_number } = frontMatter as DatePageFrontMatter;
    return <DateView id={String(homework_number)} item="homework" />;
}
