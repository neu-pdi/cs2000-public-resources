export interface CalendarInfo {
    startDate: Date;
    endDate: Date;
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
    label?: string;
    topic: string;
    startDate: Date;
    endDate?: Date;
}

export interface LectureInfo {
    label?: String;
    number: number | string;
    date: Date;
    href?: string;
}

export type SkillDayInfo = Date;

export interface HomeworkInfo {
    label?: String;
    number: number;
    releaseDate?: Date;
    dueDate: Date;
    href?: string;
}

export interface LabInfo {
    label?: String;
    number: number;
    date: Date;
    href?: string;
}

export interface SkillInfo {
    number: number;
    startDate: Date;
    endDate: Date;
}

export interface HolidayInfo {
    label?: string;
    startDate: Date;
    endDate?: Date;
}

export interface OfficeHourInfo {
    date: Date;
    type?: OfficeHourType;
    times?: OfficeHourTime[];
}

export type OfficeHourType = 'online' | 'in-person' | 'both';

export interface OfficeHourTime {
    startTime: string;
    endTime: string;
}

export const calendarData: CalendarInfo = {
    startDate: new Date('2026-09-06'),
    endDate: new Date('2026-12-19'),
    topics: [],
    lectures: [],
    skillDays: [],
    homework: [],
    labs: [],
    skills: [],
    holidays: [],
    officeHours: [],
}
