import { Text } from "@chakra-ui/react";
import { calendarData, parseIsoDate } from '../../data/calendar-data';
import { FormatDate, DateFor, getSkillDateRanges } from '../../utils/calendar';
import Admonition from '@theme/Admonition';

const ANNOTATION_EXCLUSION_DAYS: String[] = ["1", "2"]

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export interface UpcomingAnnotationProps {
    id: string;
}

interface SkillAnnotationInfo {
    newSkills: number[];
    endingSkills: number[];
}

/**
 * Finds skills that are newly available this week and skills who's last week is this week
 * 
 * @param lectureDate The date of the lecture for which we want to find the skill annotation info
 * @returns Skills that are newly available this week and skills who's last week is this week
 * 
 * @author Logan Gill
 */
function SkillAnnotationInfo(lectureDate: Date): SkillAnnotationInfo {
    // Every range of every skill, ordered by when it starts
    const skillRanges = [...new Set(calendarData.skills.map(({ number }) => number))]
        .flatMap((skill) => getSkillDateRanges(skill).map((range) => ({ skill, range })))
        .sort((first, second) =>
            first.range.start.getTime() - second.range.start.getTime() || first.skill - second.skill
        );

    const newSkills: number[] = [];
    const endingSkills: number[] = [];
    const lectureDateTime = lectureDate.getTime();

    skillRanges.forEach(({ skill, range }) => {
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

/**
 * Gets the next homework date after the given lecture date
 * 
 * @param lectureDate The date of the lecture for which we want to find the next homework date
 * @returns The next homework date after the given lecture date, or null if there is no homework after the lecture date
 * 
 * @author Logan Gill
 */
function NextHomeworkDate(lectureDate: Date) : [number, Date] | null {
    const nextHomework = [...calendarData.homework]
        .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
        .find(({ dueDate }) => parseIsoDate(dueDate) >= lectureDate);

    if (!nextHomework) {
        return null;
    }

    return [nextHomework.number, parseIsoDate(nextHomework.dueDate)];
}

export default function UpcomingAnnotation({ id }: UpcomingAnnotationProps) {
    if (ANNOTATION_EXCLUSION_DAYS.includes(id)) {
        return null;
    }

    const lectureDate = DateFor(id, "lectures");
    const skillAnnotationInfo = SkillAnnotationInfo(lectureDate ? lectureDate : new Date());
    const upcomingHomework = NextHomeworkDate(lectureDate ? lectureDate : new Date());
    return (
        <>
            {upcomingHomework && (
            <Admonition type="warning" icon="⚠️" title="Homework">
                <Text as="span" className="text-sm text-gray-500">
                Homework {upcomingHomework[0]} due {FormatDate(upcomingHomework[1])}
                </Text>
            </Admonition>
            )}

            {skillAnnotationInfo.endingSkills.length > 0 && (
            <Admonition type="danger" icon="‼️" title="Ending Skills">
                <Text as="span" className="text-sm text-gray-500">
                Last week for skills: {skillAnnotationInfo.endingSkills.map((skill) => skill).join(', ')}
                </Text>
            </Admonition>
            )}

            {skillAnnotationInfo.newSkills.length > 0 && (
            <Admonition type="tip" icon="🆕" title="New Skills">
                <Text as="span" className="text-sm text-gray-500">
                First week for skills: {skillAnnotationInfo.newSkills.map((skill) => skill).join(', ')}
                </Text>
            </Admonition>
            )}
        </>
    );
}