export type CalendarMonth = {
  month: string;
  year: number;
  weeks: CalendarWeek[];
};

export type CalendarWeek = {
  label: string;
  topic: string;
  days: CalendarDay[];
};

export type CalendarDay = {
  day: number;
  isHoliday?: boolean;
  holidayName?: string;
  lectures?: Lecture[];
  lab?: Lab;
  homework?: Homework;
  skills?: Skill[];
};

export type Lecture = {
  label: string;
  href: string;
};

export type Lab = {
  label: string;
  href: string;
  note?: string;
};

export type Homework = {
  label: string;
  href: string;
};

export type Skill = number;

{/* Calendar data: each week.days is [Sun, Mon, Tue, Wed, Thu, Fri, Sat].
    A day may include: lectures [{label, href} | string], lab {label, href, note?},
    homework {label, href}, skills [n], isHoliday, holidayName. */}

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
          { day: 6 },
          { day: 7, isHoliday: true, holidayName: 'Labor Day' },
          { day: 8 },
          { day: 9, lectures: [{ label: 'Class 1', href: '/days/1' }] },
          { day: 10, lectures: [{ label: 'Class 2', href: '/days/2' }] },
          { day: 11 },
          { day: 12 },
        ],
      },
      {
        label: 'Week 2',
        topic: 'Definitions, functions, conditionals: type annotations, test cases',
        days: [
          { day: 13 },
          { day: 14, lectures: [{ label: 'Class 3', href: '/days/3' }] },
          { day: 15, lab: { label: 'Lab 1', href: '/lab/1' } },
          { day: 16, lectures: [{ label: 'Class 4', href: '/days/4' }] },
          { day: 17, lectures: [{ label: 'Class 5', href: '/days/5' }] },
          { day: 18 },
          { day: 19 },
        ],
      },
      {
        label: 'Week 3',
        topic: 'Ethics & Intro to tables: constructing, importing, extracting',
        days: [
          { day: 20, homework: { label: 'HW 1 due', href: '/homework/1' } },
          { day: 21, skills: [0], lectures: [{ label: 'Class 6', href: '/days/6' }] },
          { day: 22, skills: [0], lab: { label: 'Lab 2', href: '/lab/2' } },
          { day: 23, skills: [0], lectures: [{ label: 'Class 7', href: '/days/7' }] },
          { day: 24, skills: [0], lectures: [{ label: 'Class 8', href: '/days/8' }] },
          { day: 25, skills: [0] },
          { day: 26 },
        ],
      },
      {
        label: 'Week 4',
        topic: 'More on tables: transforming, filtering',
        days: [
          { day: 27, homework: { label: 'HW 2 due', href: '/homework/2' } },
          { day: 28, skills: [0, 1, 11, 12], lectures: [{ label: 'Class 9', href: '/days/9' }] },
          { day: 29, skills: [0, 1, 11, 12], lab: { label: 'Lab 3', href: '/lab/3' } },
          { day: 30, skills: [0, 1, 11, 12], lectures: [{ label: 'Class 10', href: '/days/10' }] },
          { day: 1, skills: [0, 1, 11, 12], lectures: [{ label: 'Class 11', href: '/days/11' }] },
          { day: 2, skills: [0, 1, 11, 12] },
          { day: 3 },
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
          { day: 4, homework: { label: 'HW 3 due', href: '/homework/3' } },
          { day: 5, skills: [0, 1, 2, 11, 12], lectures: [{ label: 'Class 12', href: '/days/12' }] },
          { day: 6, skills: [0, 1, 2, 11, 12], lab: { label: 'Lab 4', href: '/lab/4' } },
          { day: 7, skills: [0, 1, 2, 11, 12], lectures: [{ label: 'Class 13', href: '/days/13' }] },
          {
            day: 8,
            skills: [0, 1, 2, 11, 12],
            lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }],
          },
          { day: 9, skills: [0, 1, 2, 11, 12] },
          { day: 10 },
        ],
      },
      {
        label: 'Week 6',
        topic: 'Computing with lists: iteration & mutable local variables',
        days: [
          { day: 11, homework: { label: 'HW 4 due', href: '/homework/4' } },
          { day: 12, isHoliday: true, holidayName: "Indg. People's Day" },
          { day: 13, skills: [1, 2, 11, 12], lab: { label: 'Lab 5', href: '/lab/5' } },
          { day: 14, skills: [1, 2, 11, 12], lectures: [{ label: 'Class 14', href: '/days/14' }] },
          { day: 15, skills: [1, 2, 11, 12], lectures: [{ label: 'Class 15', href: '/days/15' }] },
          { day: 16, skills: [1, 2, 11, 12] },
          { day: 17 },
        ],
      },
      {
        label: 'Week 7',
        topic: 'Structured data',
        days: [
          { day: 18, homework: { label: 'HW 5 due', href: '/homework/5' } },
          { day: 19, skills: [2, 3, 11, 12], lectures: [{ label: 'Class 16', href: '/days/16' }] },
          { day: 20, skills: [2, 3, 11, 12], lab: { label: 'Lab 6', href: '/lab/6' } },
          { day: 21, skills: [2, 3, 11, 12], lectures: [{ label: 'Class 17', href: '/days/17' }] },
          { day: 22, skills: [2, 3, 11, 12], lectures: [{ label: 'Class 18', href: '/days/18' }] },
          { day: 23, skills: [2, 3, 11, 12] },
          { day: 24 },
        ],
      },
      {
        label: 'Week 8',
        topic: 'Conditional and recursive data',
        days: [
          { day: 25, homework: { label: 'HW 6 due', href: '/homework/6' } },
          { day: 26, skills: [3, 4, 11, 12], lectures: [{ label: 'Class 19', href: '/days/19' }] },
          {
            day: 27,
            skills: [3, 4, 11, 12],
            lab: { label: 'Lab 7', href: '/lab/7' },
          },
          { day: 28, skills: [3, 4, 11, 12], lectures: [{ label: 'Class 20', href: '/days/20' }] },
          { day: 29, skills: [3, 4, 11, 12], lectures: [{ label: 'Class 21', href: '/days/21' }] },
          { day: 30, skills: [3, 4, 11, 12] },
          { day: 31 },
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
          { day: 1, homework: { label: 'HW 7 due', href: '/homework/7' } },
          { day: 2, skills: [3, 4, 5, 11, 12], lectures: [{ label: 'Class 22', href: '/days/22' }] },
          { day: 3, skills: [3, 4, 5, 11, 12], lab: { label: 'Lab 8', href: '/lab/8' } },
          { day: 4, skills: [3, 4, 5, 11, 12], lectures: [{ label: 'Class 23', href: '/days/23' }] },
          {
            day: 5,
            skills: [3, 4, 5, 11, 12],
            lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }],
          },
          { day: 6, skills: [3, 4, 5, 11, 12] },
          { day: 7 },
        ],
      },
      {
        label: 'Week 10',
        topic: 'Transition to Python: IDE, files, definitions, testing',
        days: [
          { day: 8, homework: { label: 'HW 8 due', href: '/homework/8' } },
          { day: 9, skills: [4, 5, 6], lectures: [{ label: 'Class 24', href: '/days/24' }] },
          { day: 10, skills: [4, 5, 6], lab: { label: 'Lab 9', href: '/lab/9' } },
          { day: 11, isHoliday: true, holidayName: 'Veterans Day' },
          {
            day: 12,
            skills: [4, 5, 6],
            lectures: [{ label: 'Class 25', href: '/days/25' }],
          },
          { day: 13, skills: [4, 5, 6] },
          { day: 14 },
        ],
      },
      {
        label: 'Week 11',
        topic: 'Python: iteration & scoping',
        days: [
          { day: 15, homework: { label: 'HW 9 due', href: '/homework/9' } },
          { day: 16, skills: [4, 5, 6, 7, 8], lectures: [{ label: 'Class 26', href: '/days/26' }] },
          { day: 17, skills: [4, 5, 6, 7, 8], lab: { label: 'Lab 10', href: '/lab/10' } },
          { day: 18, skills: [4, 5, 6, 7, 8], lectures: [{ label: 'Class 27', href: '/days/27' }] },
          { day: 19, skills: [4, 5, 6, 7, 8], lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }] },
          {
            day: 20,
            skills: [4, 5, 6, 7, 8],
          },
          { day: 21 },
        ],
      },
      {
        label: 'Week 12',
        topic: 'Python: mutable data structures',
        days: [
          { day: 22,  isHoliday: true, holidayName: 'No HW Due' },
          {
            day: 23,
            skills: [6, 7, 8, 9, 10],
            lectures: [{ label: 'Class 28', href: '/days/28' }],
          },
          {
            day: 24,
            skills: [6, 7, 8, 9, 10],
            isHoliday: true, holidayName: 'No Lab'
          },
          { day: 25, isHoliday: true, holidayName: 'Thanks. Break' },
          { day: 26, isHoliday: true, holidayName: 'Thanks. Break' },
          { day: 27, isHoliday: true, holidayName: 'Thanks. Break' },
          { day: 28 },
        ],
      },
      {
        label: 'Week 13',
        topic: 'Tables in Python: pandas & csvs',
        days: [
          { day: 29, homework: { label: 'HW 10 due', href: '/homework/10' } },
          { day: 30, skills: [7, 8, 9, 10], lectures: [{ label: 'Class 29', href: '/days/29' }] },
          {
            day: 1,
            skills: [7, 8, 9, 10],
            lab: { label: 'Lab 11', href: '/lab/11' }
          },
          { day: 2, skills: [7, 8, 9, 10], lectures: [{ label: 'Class 30', href: '/days/30' }] },
          {
            day: 3,
            skills: [7, 8, 9, 10],
            lectures: [{ label: 'Skill Day', href: '/skills/#skill-days-in-class' }],
          },
          { day: 4, skills: [7, 8, 9, 10] },
          { day: 5 },
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
          { day: 6, homework: { label: 'HW 11 due', href: '/homework/11' } },
          {
            day: 7,
            skills: [7, 8, 9, 10],
            lectures: [
              { label: 'Dictionaries', href: '/days/XDict' },
              { label: 'Datavis', href: '/days/XMatplotlib' },
              { label: 'λ Calculus', href: '/days/Xλ' },
              { label: 'Y Combinator', href: '/days/XλY' },],
          },
          { day: 8, skills: [7, 8, 9, 10], lab: { label: 'Lab 12', href: '/lab/12' } },
          {
            day: 9,
            skills: [7, 8, 9, 10],
            lectures: [
            ],
          },
          {
            day: 10,
            skills: [7, 8, 9, 10],
          },
          { day: 11, skills: [7, 8, 9, 10] },
          { day: 12 },
        ],
      },
      {
        label: 'Week 15',
        topic: 'Finals Period',
        days: [
          { day: 13 },
          { day: 14 },
          { day: 15 },
          { day: 16 },
          { day: 17 },
          { day: 18 },
          { day: 19 },
        ],
      },
    ],
  },
];