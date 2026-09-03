import { calendarData, type CalendarDay } from '../../data/calendar-data';
import { Text } from '@chakra-ui/react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

type DateItem = keyof Pick<CalendarDay, 'lectures' | 'lab' | 'homework'>;

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

export function FormattedDate(id: string, item: DateItem): string {
    const date = DateFor(id, item);
    if (!date) {
        return 'Date unavailable';
    }
    return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function DateFor(id: string, item: DateItem): Date | null {
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
