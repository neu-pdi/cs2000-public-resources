export interface CalendarMonth {
  month: string;
  year: number;
  weeks: CalendarWeek[];
};

export interface CalendarWeek {
  label: string;
  topic: string;
  /** Which of the three pair programming sessions with a TA students book this week, if any. */
  pairing?: number;
  days: CalendarDay[];
};

export interface CalendarDay {
  date: string;
  isHoliday?: boolean;
  holidayName?: string;
  /**
   * A short note shown on the day, such as "No Lab". Unlike a holiday, it changes nothing
   * else: the day keeps its office hours and any skills open on it.
   */
  note?: string;
  lectures?: Lecture[];
  /**
   * Lectures that might be given on other days, listed on this one, such as the bonus
   * lectures each section chooses from at the end. They are shown like lectures, but give
   * no class page a date, and never count as the current class.
   */
  possibleLectures?: Lecture[];
  lab?: Lab;
  homework?: Homework;
  /**
   * Set on days that online (Discord) office hours run. The times themselves are not
   * stored here -- they are read per weekday from the scheduling sheet at runtime (see
   * src/data/online-office-hours.ts), so this only records *which* days hold them, and
   * therefore which are skipped for holidays and the finals period.
   */
  onlineOH?: boolean;
  skills?: Skill[];
};

export interface Lecture {
  label: string;
  href: string;
};

export interface Lab {
  label: string;
  /** A practice lab's page. Crit labs have none. */
  href?: string;
  note?: string;
};

export interface Homework {
  label: string;
  href: string;
};

export type Skill = number;

/**
 * Calendar data: each week.days is [Sun, Mon, Tue, Wed, Thu, Fri, Sat]. A {@link CalendarDay} may include: 
 * - {@link Lecture}
 * - {@link Lab}
 * - {@link Homework}
 * - {@link Skill}
 * - onlineOH,
 * - isHoliday,
 * - holidayName,
 * - note.
 */
export const calendarData: CalendarMonth[] = [
  {
    month: 'January',
    year: 2027,
    weeks: [
      {
        label: 'Week 1',
        topic:
          'Programming with Numbers, strings, images: IDE, interactions, operations on standard values',
        days: [
          { date: '2027-01-10' },
          { date: '2027-01-11' },
          { date: '2027-01-12' },
          { date: '2027-01-13', onlineOH: true, lectures: [{ label: 'Class 1', href: '/class/1' }] },
          { date: '2027-01-14', onlineOH: true, lectures: [{ label: 'Class 2', href: '/class/2' }] },
          { date: '2027-01-15', onlineOH: true, lab: { label: 'Lab 0: Python Setup', href: '/lab/0' } },
          { date: '2027-01-16' },
        ],
      },
      {
        label: 'Week 2',
        topic: 'Definitions, functions, conditionals: signatures, test cases',
        days: [
          { date: '2027-01-17' },
          { date: '2027-01-18', isHoliday: true, holidayName: 'MLK Day' },
          { date: '2027-01-19', onlineOH: true },
          { date: '2027-01-20', onlineOH: true, lectures: [{ label: 'Class 3', href: '/class/3' }] },
          { date: '2027-01-21', onlineOH: true, lectures: [{ label: 'Class 4', href: '/class/4' }] },
          { date: '2027-01-22', onlineOH: true, lab: { label: 'Lab: Intro to Crits' } },
          { date: '2027-01-23' },
        ],
      },
      {
        label: 'Week 3',
        topic: 'Ethics & Intro to tables: constructing, importing, extracting',
        days: [
          { date: '2027-01-24' },
          { date: '2027-01-25', onlineOH: true, skills: [0], lectures: [{ label: 'Class 5', href: '/class/5' }] },
          { date: '2027-01-26', onlineOH: true, skills: [0] },
          { date: '2027-01-27', onlineOH: true, skills: [0], lectures: [{ label: 'Class 6', href: '/class/6' }] },
          { date: '2027-01-28', onlineOH: true, skills: [0], lectures: [{ label: 'Class 7', href: '/class/7' }] },
          { date: '2027-01-29', onlineOH: true, skills: [0], lab: { label: 'Lab 1: Functions', href: '/lab/1' } },
          { date: '2027-01-30' },
        ],
      },
      {
        label: 'Week 4',
        pairing: 1,
        topic: 'More on tables: transforming, filtering',
        days: [
          { date: '2027-01-31' },
          { date: '2027-02-01', onlineOH: true, skills: [0, 1], lectures: [{ label: 'Class 8', href: '/class/8' }] },
          { date: '2027-02-02', onlineOH: true, skills: [0, 1] },
          { date: '2027-02-03', homework: { label: 'HW 1 due', href: '/homework/1' }, onlineOH: true, skills: [0, 1], lectures: [{ label: 'Class 9', href: '/class/9' }] },
          { date: '2027-02-04', onlineOH: true, skills: [0, 1], lectures: [{ label: 'Class 10', href: '/class/10' }] },
          { date: '2027-02-05', onlineOH: true, skills: [0, 1], lab: { label: 'Lab: Crit on HW 1' } },
          { date: '2027-02-06' },
        ],
      },
    ],
  },
  {
    month: 'February',
    year: 2027,
    weeks: [
      {
        label: 'Week 5',
        pairing: 1,
        topic: 'Cleaning data, task planning & visualization; Skill Day',
        days: [
          { date: '2027-02-07' },
          { date: '2027-02-08', onlineOH: true, skills: [0, 1, 2, 3], lectures: [{ label: 'Class 11', href: '/class/11' }] },
          { date: '2027-02-09', onlineOH: true, skills: [0, 1, 2, 3] },
          { date: '2027-02-10', onlineOH: true, skills: [0, 1, 2, 3], lectures: [{ label: 'Class 12', href: '/class/12' }] },
          { date: '2027-02-11', onlineOH: true, skills: [0, 1, 2, 3], lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }] },
          { date: '2027-02-12', onlineOH: true, skills: [0, 1, 2, 3], lab: { label: 'Lab 2: Tables', href: '/lab/2' } },
          { date: '2027-02-13' },
        ],
      },
      {
        label: 'Week 6',
        pairing: 1,
        topic: 'From tables to lists: extracting columns; map & filter',
        days: [
          { date: '2027-02-14' },
          { date: '2027-02-15', isHoliday: true, holidayName: 'Presidents Day' },
          { date: '2027-02-16', onlineOH: true, skills: [1, 2, 3, 4, 5] },
          { date: '2027-02-17', homework: { label: 'HW 2 due', href: '/homework/2' }, onlineOH: true, skills: [1, 2, 3, 4, 5], lectures: [{ label: 'Class 13', href: '/class/13' }] },
          { date: '2027-02-18', onlineOH: true, skills: [1, 2, 3, 4, 5], lectures: [{ label: 'Class 14', href: '/class/14' }] },
          { date: '2027-02-19', onlineOH: true, skills: [1, 2, 3, 4, 5], lab: { label: 'Lab: Crit on HW 2' } },
          { date: '2027-02-20' },
        ],
      },
      {
        label: 'Week 7',
        pairing: 2,
        topic: 'Reactors; loops & variables that change',
        days: [
          { date: '2027-02-21' },
          { date: '2027-02-22', onlineOH: true, skills: [2, 3, 4, 5], lectures: [{ label: 'Class 15', href: '/class/15' }] },
          { date: '2027-02-23', onlineOH: true, skills: [2, 3, 4, 5] },
          { date: '2027-02-24', onlineOH: true, skills: [2, 3, 4, 5], lectures: [{ label: 'Class 16', href: '/class/16' }] },
          { date: '2027-02-25', onlineOH: true, skills: [2, 3, 4, 5], lectures: [{ label: 'Class 17', href: '/class/17' }] },
          { date: '2027-02-26', onlineOH: true, skills: [2, 3, 4, 5], lab: { label: 'Lab 3: Lists', href: '/lab/3' } },
          { date: '2027-02-27' },
        ],
      },
      {
        label: 'Week 8',
        pairing: 2,
        topic: 'Variables that change & scope; Skill Day',
        days: [
          { date: '2027-02-28' },
          { date: '2027-03-01', onlineOH: true, skills: [4, 5, 6], lectures: [{ label: 'Class 18', href: '/class/18' }] },
          { date: '2027-03-02', onlineOH: true, skills: [4, 5, 6] },
          { date: '2027-03-03', homework: { label: 'HW 3 due', href: '/homework/3' }, onlineOH: true, skills: [4, 5, 6], lectures: [{ label: 'Class 19', href: '/class/19' }] },
          { date: '2027-03-04', onlineOH: true, skills: [4, 5, 6], lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }] },
          { date: '2027-03-05', onlineOH: true, skills: [4, 5, 6], lab: { label: 'Lab: Crit on HW 3' } },
          { date: '2027-03-06' },
        ],
      },
    ],
  },
  {
    month: 'March',
    year: 2027,
    weeks: [
      {
        label: 'Spring Break',
        topic: 'No classes',
        days: [
          { date: '2027-03-07' },
          { date: '2027-03-08', isHoliday: true, holidayName: 'Spring Break' },
          { date: '2027-03-09', isHoliday: true, holidayName: 'Spring Break' },
          { date: '2027-03-10', isHoliday: true, holidayName: 'Spring Break' },
          { date: '2027-03-11', isHoliday: true, holidayName: 'Spring Break' },
          { date: '2027-03-12', isHoliday: true, holidayName: 'Spring Break' },
          { date: '2027-03-13' },
        ],
      },
      {
        label: 'Week 9',
        pairing: 2,
        topic: 'Structured & conditional data; self-referential data',
        days: [
          { date: '2027-03-14' },
          { date: '2027-03-15', onlineOH: true, skills: [6, 7], lectures: [{ label: 'Class 20', href: '/class/20' }] },
          { date: '2027-03-16', onlineOH: true, skills: [6, 7] },
          { date: '2027-03-17', onlineOH: true, skills: [6, 7], lectures: [{ label: 'Class 21', href: '/class/21' }] },
          { date: '2027-03-18', onlineOH: true, skills: [6, 7], lectures: [{ label: 'Class 22', href: '/class/22' }] },
          { date: '2027-03-19', onlineOH: true, skills: [6, 7], lab: { label: 'Lab 4: Data & Scope', href: '/lab/4' } },
          { date: '2027-03-20' },
        ],
      },
      {
        label: 'Week 10',
        pairing: 3,
        topic: 'Lists by the recipe; polymorphism; trees',
        days: [
          { date: '2027-03-21' },
          { date: '2027-03-22', onlineOH: true, skills: [6, 7, 8, 9], lectures: [{ label: 'Class 23', href: '/class/23' }] },
          { date: '2027-03-23', onlineOH: true, skills: [6, 7, 8, 9] },
          { date: '2027-03-24', homework: { label: 'HW 4 due', href: '/homework/4' }, onlineOH: true, skills: [6, 7, 8, 9], lectures: [{ label: 'Class 24', href: '/class/24' }] },
          { date: '2027-03-25', onlineOH: true, skills: [6, 7, 8, 9], lectures: [{ label: 'Class 25', href: '/class/25' }] },
          { date: '2027-03-26', onlineOH: true, skills: [6, 7, 8, 9], lab: { label: 'Lab: Crit on HW 4' } },
          { date: '2027-03-27' },
        ],
      },
      {
        label: 'Week 11',
        pairing: 3,
        topic: 'Designing abstractions; mutable data & the heap; Skill Day',
        days: [
          { date: '2027-03-28' },
          { date: '2027-03-29', onlineOH: true, skills: [7, 8, 9, 10], lectures: [{ label: 'Class 26', href: '/class/26' }] },
          { date: '2027-03-30', onlineOH: true, skills: [7, 8, 9, 10] },
          { date: '2027-03-31', onlineOH: true, skills: [7, 8, 9, 10], lectures: [{ label: 'Class 27', href: '/class/27' }] },
          { date: '2027-04-01', onlineOH: true, skills: [7, 8, 9, 10], lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }] },
          { date: '2027-04-02', onlineOH: true, skills: [7, 8, 9, 10], lab: { label: 'Lab 5: Trees', href: '/lab/5' } },
          { date: '2027-04-03' },
        ],
      },
    ],
  },
  {
    month: 'April',
    year: 2027,
    weeks: [
      {
        label: 'Week 12',
        pairing: 3,
        topic: 'More trees; abstractions from templates; accumulators',
        days: [
          { date: '2027-04-04' },
          { date: '2027-04-05', onlineOH: true, skills: [8, 9, 10, 11, 12], lectures: [{ label: 'Class 28', href: '/class/28' }] },
          { date: '2027-04-06', onlineOH: true, skills: [8, 9, 10, 11, 12] },
          { date: '2027-04-07', homework: { label: 'HW 5 due', href: '/homework/5' }, onlineOH: true, skills: [8, 9, 10, 11, 12], lectures: [{ label: 'Class 29', href: '/class/29' }] },
          { date: '2027-04-08', onlineOH: true, skills: [8, 9, 10, 11, 12], lectures: [{ label: 'Class 30', href: '/class/30' }] },
          { date: '2027-04-09', onlineOH: true, skills: [8, 9, 10, 11, 12], lab: { label: 'Lab: Crit on HW 5' } },
          { date: '2027-04-10' },
        ],
      },
      {
        label: 'Week 13',
        topic: 'Accumulators on trees; to be determined; Skill Day',
        days: [
          { date: '2027-04-11' },
          { date: '2027-04-12', onlineOH: true, skills: [10, 11, 12], lectures: [{ label: 'Class 31', href: '/class/31' }] },
          { date: '2027-04-13', onlineOH: true, skills: [10, 11, 12] },
          { date: '2027-04-14', onlineOH: true, skills: [10, 11, 12], lectures: [{ label: 'Class 32', href: '/class/32' }] },
          { date: '2027-04-15', onlineOH: true, skills: [10, 11, 12], lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }] },
          { date: '2027-04-16', onlineOH: true, skills: [10, 11, 12], lab: { label: 'Lab 6: Accumulators & Abstraction', href: '/lab/6' } },
          { date: '2027-04-17' },
        ],
      },
      {
        label: 'Week 14',
        topic: 'Catch up, bonus content, etc. Depends on section / instructor.',
        days: [
          {
            date: '2027-04-18',
            note: 'Possible lectures this week:',
            possibleLectures: [
              { label: 'Dictionaries', href: '/class/XDict' },
              { label: 'Recommendation Systems', href: '/class/XRecommender' },
              { label: 'λ Calculus', href: '/class/Xλ' },
              { label: 'Y Combinator', href: '/class/XλY' },
            ],
          },
          { date: '2027-04-19', isHoliday: true, holidayName: "Patriots' Day" },
          { date: '2027-04-20', onlineOH: true, skills: [11, 12] },
          {
            date: '2027-04-21',
            note: "A lecture from Sunday's list, or something else",
            homework: { label: 'HW 6 due', href: '/homework/6' },
            onlineOH: true,
            skills: [11, 12],
          },
          { date: '2027-04-22', note: "A lecture from Sunday's list, or something else", onlineOH: true, skills: [11, 12] },
          { date: '2027-04-23', onlineOH: true, skills: [11, 12], lab: { label: 'Lab: Crit on HW 6' } },
          { date: '2027-04-24' },
        ],
      },
      {
        label: 'Week 15',
        topic: 'Finals Period',
        days: [
          { date: '2027-04-25' },
          { date: '2027-04-26' },
          { date: '2027-04-27' },
          { date: '2027-04-28' },
          { date: '2027-04-29' },
          { date: '2027-04-30' },
          { date: '2027-05-01' },
        ],
      },
    ],
  },
];
