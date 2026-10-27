import { Text } from '@chakra-ui/react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { DateItem, DateFor, FormatDate, getSkillDateRanges } from '../../utils/calendar';
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

function FormattedDate(id: string, item: DateItem): string {
    if (item === 'skills') {
        const skill = Number(id);
        const ranges = Number.isInteger(skill) ? getSkillDateRanges(skill) : [];

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
