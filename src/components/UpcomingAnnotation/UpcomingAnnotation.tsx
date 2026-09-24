import { Text } from "@chakra-ui/react";
import { calendarData, type CalendarDay, type Skill } from '../../data/calendar-data';
import { FormatDate, DateFor, SkillDateRange, isWeekend, isNextInstructionalDate } from "../DateView/DateView";
import Admonition from '@theme/Admonition';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export interface UpcomingAnnotationProps {
    id: string;
}

interface SkillAnnotationInfo {
    // TODO: Maybe make first week first day/2 days?
    newSkills: Skill[];
    endingSkills: Skill[];
}

/**
 * Finds skills that are newly available this week and skills who's last week is this week
 * 
 * @param lectureDate The date of the lecture for which we want to find the skill annotation info
 * @returns Skills that are newly available this week and skills who's last week is this week
 */
export function SkillAnnotationInfo(lectureDate: Date): SkillAnnotationInfo {
    const days = calendarData
        .flatMap((month) => month.weeks.flatMap((week) => week.days))
        .filter((day) => day.skills && !day.isHoliday)
        .map((day) => ({
            day,
            date: new Date(`${day.date}T00:00:00`),
        }))
        .filter(({ date }) => date && !isWeekend(date))
        .sort(({ date: firstDate }, { date: secondDate }) => firstDate.getTime() - secondDate.getTime());

    const skillRanges: Map<Skill, SkillDateRange> = new Map();

    for (const { day, date } of days) {
        day.skills?.forEach((skill) => {
            const previousRange = skillRanges.get(skill);
            if (!previousRange || !isNextInstructionalDate(previousRange.end, date)) {
                skillRanges.set(skill, { start: date, end: date });
            } else {
                previousRange.end = date;
            }
        });
    }

    const newSkills: Skill[] = [];
    const endingSkills: Skill[] = [];
    const lectureDateTime = lectureDate.getTime();

    skillRanges.forEach((range, skill) => {
        const startDiff = lectureDateTime - range.start.getTime();
        const endDiff = range.end.getTime() - lectureDateTime;
        if (startDiff >= 0 && startDiff <= TWO_DAYS_MS) {
            newSkills.push(skill);
        } else if (endDiff >= 0 && endDiff <= ONE_WEEK_MS) {
            endingSkills.push(skill);
        }
    });

    return { newSkills: newSkills, endingSkills: endingSkills };
}

export default function UpcomingAnnotation({ id }: UpcomingAnnotationProps) {
    const lectureDate = DateFor(id, "lectures");
    const skillAnnotationInfo = SkillAnnotationInfo(lectureDate ? lectureDate : new Date());
    return (
        <>
            {skillAnnotationInfo.endingSkills.length > 0 && (
            <Admonition type="warning" title="Ending Skills">
                <Text as="span" className="text-sm text-gray-500">
                Last week for skills: {skillAnnotationInfo.endingSkills.map((skill) => skill).join(', ')}
                </Text>
            </Admonition>
            )}

            {skillAnnotationInfo.newSkills.length > 0 && (
            <Admonition type="tip" title="New Skills">
                <Text as="span" className="text-sm text-gray-500">
                First week for skills: {skillAnnotationInfo.newSkills.map((skill) => skill).join(', ')}
                </Text>
            </Admonition>
            )}
        </>
    );
}