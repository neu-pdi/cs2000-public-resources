export interface CalendarMonth {
  month: string;
  year: number;
  weeks: CalendarWeek[];
};

export interface CalendarWeek {
  label: string;
  topic: string;
  days: CalendarDay[];
};

export interface CalendarDay {
  date: string;
  isHoliday?: boolean;
  holidayName?: string;
  lectures?: Lecture[];
  lab?: Lab;
  homework?: Homework;
  skills?: Skill[];
};

export interface Lecture {
  label: string;
  href: string;
};

export interface Lab {
  label: string;
  href: string;
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
 * - isHoliday, 
 * - holidayName.
 */
export const calendarData: CalendarMonth[] = [
  {
    month: 'September',
    year: 2026,
    weeks: [
      {
        label: 'Week 1',
        topic:
          'Programming with Numbers, strings, images: IDE, interactions, operations on standard values',
        days: [
          { date: '2026-09-06' },
          { date: '2026-09-07', isHoliday: true, holidayName: 'Labor Day' },
          { date: '2026-09-08' },
          { date: '2026-09-09', lectures: [{ label: 'Class 1', href: '/days/1' }] },
          { date: '2026-09-10', lectures: [{ label: 'Class 2', href: '/days/2' }] },
          { date: '2026-09-11' },
          { date: '2026-09-12' },
        ],
      },
      {
        label: 'Week 2',
        topic: 'Definitions, functions, conditionals: type annotations, test cases',
        days: [
          { date: '2026-09-13' },
          { date: '2026-09-14', lectures: [{ label: 'Class 3', href: '/days/3' }] },
          { date: '2026-09-15', lab: { label: 'Lab 1', href: '/lab/1' } },
          { date: '2026-09-16', lectures: [{ label: 'Class 4', href: '/days/4' }] },
          { date: '2026-09-17', lectures: [{ label: 'Class 5', href: '/days/5' }] },
          { date: '2026-09-18' },
          { date: '2026-09-19' },
        ],
      },
      {
        label: 'Week 3',
        topic: 'Ethics & Intro to tables: constructing, importing, extracting',
        days: [
          { date: '2026-09-20', homework: { label: 'HW 1 due', href: '/homework/1' } },
          { date: '2026-09-21', skills: [0], lectures: [{ label: 'Class 6', href: '/days/6' }] },
          { date: '2026-09-22', skills: [0], lab: { label: 'Lab 2', href: '/lab/2' } },
          { date: '2026-09-23', skills: [0], lectures: [{ label: 'Class 7', href: '/days/7' }] },
          { date: '2026-09-24', skills: [0], lectures: [{ label: 'Class 8', href: '/days/8' }] },
          { date: '2026-09-25', skills: [0] },
          { date: '2026-09-26' },
        ],
      },
      {
        label: 'Week 4',
        topic: 'More on tables: transforming, filtering',
        days: [
          { date: '2026-09-27', homework: { label: 'HW 2 due', href: '/homework/2' } },
          { date: '2026-09-28', skills: [0, 1, 11, 12], lectures: [{ label: 'Class 9', href: '/days/9' }] },
          { date: '2026-09-29', skills: [0, 1, 11, 12], lab: { label: 'Lab 3', href: '/lab/3' } },
          { date: '2026-09-30', skills: [0, 1, 11, 12], lectures: [{ label: 'Class 10', href: '/days/10' }] },
          { date: '2026-10-01', skills: [0, 1, 11, 12], lectures: [{ label: 'Class 11', href: '/days/11' }] },
          { date: '2026-10-02', skills: [0, 1, 11, 12] },
          { date: '2026-10-03' },
        ],
      },
    ],
  },
  {
    month: 'October',
    year: 2026,
    weeks: [
      {
        label: 'Week 5',
        topic:
          'From tables to lists: extracting columns, performing operations on them, visualizing data',
        days: [
          { date: '2026-10-04', homework: { label: 'HW 3 due', href: '/homework/3' } },
          { date: '2026-10-05', skills: [0, 1, 2, 11, 12], lectures: [{ label: 'Class 12', href: '/days/12' }] },
          { date: '2026-10-06', skills: [0, 1, 2, 11, 12], lab: { label: 'Lab 4', href: '/lab/4' } },
          { date: '2026-10-07', skills: [0, 1, 2, 11, 12], lectures: [{ label: 'Class 13', href: '/days/13' }] },
          {
            date: '2026-10-08',
            skills: [0, 1, 2, 11, 12],
            lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }],
          },
          { date: '2026-10-09', skills: [0, 1, 2, 11, 12] },
          { date: '2026-10-10' },
        ],
      },
      {
        label: 'Week 6',
        topic: 'Computing with lists: iteration & mutable local variables',
        days: [
          { date: '2026-10-11', homework: { label: 'HW 4 due', href: '/homework/4' } },
          { date: '2026-10-12', isHoliday: true, holidayName: "Indg. People's Day" },
          { date: '2026-10-13', skills: [1, 2, 11, 12], lab: { label: 'Lab 5', href: '/lab/5' } },
          { date: '2026-10-14', skills: [1, 2, 11, 12], lectures: [{ label: 'Class 14', href: '/days/14' }] },
          { date: '2026-10-15', skills: [1, 2, 11, 12], lectures: [{ label: 'Class 15', href: '/days/15' }] },
          { date: '2026-10-16', skills: [1, 2, 11, 12] },
          { date: '2026-10-17' },
        ],
      },
      {
        label: 'Week 7',
        topic: 'Structured data',
        days: [
          { date: '2026-10-18', homework: { label: 'HW 5 due', href: '/homework/5' } },
          { date: '2026-10-19', skills: [2, 3, 11, 12], lectures: [{ label: 'Class 16', href: '/days/16' }] },
          { date: '2026-10-20', skills: [2, 3, 11, 12], lab: { label: 'Lab 6', href: '/lab/6' } },
          { date: '2026-10-21', skills: [2, 3, 11, 12], lectures: [{ label: 'Class 17', href: '/days/17' }] },
          { date: '2026-10-22', skills: [2, 3, 11, 12], lectures: [{ label: 'Class 18', href: '/days/18' }] },
          { date: '2026-10-23', skills: [2, 3, 11, 12] },
          { date: '2026-10-24' },
        ],
      },
      {
        label: 'Week 8',
        topic: 'Conditional and recursive data',
        days: [
          { date: '2026-10-25', homework: { label: 'HW 6 due', href: '/homework/6' } },
          { date: '2026-10-26', skills: [3, 4, 11, 12], lectures: [{ label: 'Class 19', href: '/days/19' }] },
          {
            date: '2026-10-27',
            skills: [3, 4, 11, 12],
            lab: { label: 'Lab 7', href: '/lab/7' },
          },
          { date: '2026-10-28', skills: [3, 4, 11, 12], lectures: [{ label: 'Class 20', href: '/days/20' }] },
          { date: '2026-10-29', skills: [3, 4, 11, 12], lectures: [{ label: 'Class 21', href: '/days/21' }] },
          { date: '2026-10-30', skills: [3, 4, 11, 12] },
          { date: '2026-10-31' },
        ],
      },
    ],
  },
  {
    month: 'November',
    year: 2026,
    weeks: [
      {
        label: 'Week 9',
        topic: 'Trees',
        days: [
          { date: '2026-11-01', homework: { label: 'HW 7 due', href: '/homework/7' } },
          { date: '2026-11-02', skills: [3, 4, 5, 11, 12], lectures: [{ label: 'Class 22', href: '/days/22' }] },
          { date: '2026-11-03', skills: [3, 4, 5, 11, 12], lab: { label: 'Lab 8', href: '/lab/8' } },
          { date: '2026-11-04', skills: [3, 4, 5, 11, 12], lectures: [{ label: 'Class 23', href: '/days/23' }] },
          {
            date: '2026-11-05',
            skills: [3, 4, 5, 11, 12],
            lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }],
          },
          { date: '2026-11-06', skills: [3, 4, 5, 11, 12] },
          { date: '2026-11-07' },
        ],
      },
      {
        label: 'Week 10',
        topic: 'Transition to Python: IDE, files, definitions, testing',
        days: [
          { date: '2026-11-08', homework: { label: 'HW 8 due', href: '/homework/8' } },
          { date: '2026-11-09', skills: [4, 5, 6], lectures: [{ label: 'Class 24', href: '/days/24' }] },
          { date: '2026-11-10', skills: [4, 5, 6], lab: { label: 'Lab 9', href: '/lab/9' } },
          { date: '2026-11-11', isHoliday: true, holidayName: 'Veterans Day' },
          {
            date: '2026-11-12',
            skills: [4, 5, 6],
            lectures: [{ label: 'Class 25', href: '/days/25' }],
          },
          { date: '2026-11-13', skills: [4, 5, 6] },
          { date: '2026-11-14' },
        ],
      },
      {
        label: 'Week 11',
        topic: 'Python: iteration & scoping',
        days: [
          { date: '2026-11-15', homework: { label: 'HW 9 due', href: '/homework/9' } },
          { date: '2026-11-16', skills: [4, 5, 6, 7, 8], lectures: [{ label: 'Class 26', href: '/days/26' }] },
          { date: '2026-11-17', skills: [4, 5, 6, 7, 8], lab: { label: 'Lab 10', href: '/lab/10' } },
          { date: '2026-11-18', skills: [4, 5, 6, 7, 8], lectures: [{ label: 'Class 27', href: '/days/27' }] },
          { date: '2026-11-19', skills: [4, 5, 6, 7, 8], lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }] },
          {
            date: '2026-11-20',
            skills: [4, 5, 6, 7, 8],
          },
          { date: '2026-11-21' },
        ],
      },
      {
        label: 'Week 12',
        topic: 'Python: mutable data structures',
        days: [
          { date: '2026-11-22', isHoliday: true, holidayName: 'No HW Due' },
          {
            date: '2026-11-23',
            skills: [6, 7, 8, 9, 10],
            lectures: [{ label: 'Class 28', href: '/days/28' }],
          },
          {
            date: '2026-11-24',
            skills: [6, 7, 8, 9, 10],
            isHoliday: true, holidayName: 'No Lab'
          },
          { date: '2026-11-25', isHoliday: true, holidayName: 'Thanks. Break' },
          { date: '2026-11-26', isHoliday: true, holidayName: 'Thanks. Break' },
          { date: '2026-11-27', isHoliday: true, holidayName: 'Thanks. Break' },
          { date: '2026-11-28' },
        ],
      },
      {
        label: 'Week 13',
        topic: 'Tables in Python: pandas & csvs',
        days: [
          { date: '2026-11-29', homework: { label: 'HW 10 due', href: '/homework/10' } },
          { date: '2026-11-30', skills: [7, 8, 9, 10], lectures: [{ label: 'Class 29', href: '/days/29' }] },
          {
            date: '2026-12-01',
            skills: [7, 8, 9, 10],
            lab: { label: 'Lab 11', href: '/lab/11' }
          },
          { date: '2026-12-02', skills: [7, 8, 9, 10], lectures: [{ label: 'Class 30', href: '/days/30' }] },
          {
            date: '2026-12-03',
            skills: [7, 8, 9, 10],
            lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }],
          },
          { date: '2026-12-04', skills: [7, 8, 9, 10] },
          { date: '2026-12-05' },
        ],
      },
    ],
  },
  {
    month: 'December',
    year: 2026,
    weeks: [
      {
        label: 'Week 14',
        topic: 'Catch up, bonus content, etc. Depends on section / instructor.',
        days: [
          { date: '2026-12-06', homework: { label: 'HW 11 due', href: '/homework/11' } },
          {
            date: '2026-12-07',
            skills: [7, 8, 9, 10],
            lectures: [
              { label: 'Dictionaries', href: '/days/XDict' },
              { label: 'Datavis', href: '/days/XMatplotlib' },
              { label: 'λ Calculus', href: '/days/Xλ' },
              { label: 'Y Combinator', href: '/days/XλY' },],
          },
          { date: '2026-12-08', skills: [7, 8, 9, 10], lab: { label: 'Lab 12', href: '/lab/12' } },
          {
            date: '2026-12-09',
            skills: [7, 8, 9, 10],
            lectures: [
            ],
          },
          {
            date: '2026-12-10',
            skills: [7, 8, 9, 10],
          },
          { date: '2026-12-11', skills: [7, 8, 9, 10] },
          { date: '2026-12-12' },
        ],
      },
      {
        label: 'Week 15',
        topic: 'Finals Period',
        days: [
          { date: '2026-12-13' },
          { date: '2026-12-14' },
          { date: '2026-12-15' },
          { date: '2026-12-16' },
          { date: '2026-12-17' },
          { date: '2026-12-18' },
          { date: '2026-12-19' },
        ],
      },
    ],
  },
];