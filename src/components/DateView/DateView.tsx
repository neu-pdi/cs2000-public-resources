import { calendarData, type Skill } from '../../data/calendar-data';
import { Text } from '@chakra-ui/react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { DateItem, DateFor, FormatDate, SkillDateRange, isWeekend, isNextInstructionalDate } from '../../utils/calendar';
import UpcomingAnnotation from '../UpcomingAnnotation/UpcomingAnnotation';

interface CalendarPageFrontMatter {
    day_number?: number;
    lab_number?: number;
    homework_number?: number;
}

type DatePageFrontMatter = CalendarPageFrontMatter & Record<string, unknown>;

export interface DateViewProps {
    id: string;
    item: DateItem;
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
function SkillDateRanges(skill: Skill): SkillDateRange[] {
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

function FormattedDate(id: string, item: DateItem): string {
    if (item === 'skills') {
        const skill = Number(id);
        const ranges = Number.isInteger(skill) ? SkillDateRanges(skill) : [];

        return ranges.length > 0
            ? ranges.map(({ start, end }) => `${FormatDate(start)} - ${FormatDate(end)}`).join(', ')
            : 'Date unavailable';
    }

    const date = DateFor(id, item);
    return date ? FormatDate(date) : 'Date unavailable';
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
    return (<>
        <DateView id={String(day_number)} item="lectures" />

        <UpcomingAnnotation id={String(day_number)} />
    </>);
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
