import React from 'react';
import CalendarHighlighter from './CalendarHighlighter';

interface DayData {
  day: number;
  skills?: number[];
  classSkills?: number[];
  labSkills?: number[];
  isHoliday?: boolean;
}

interface MonthData {
  month: string;
  year: number;
  weeks: (DayData | null)[][];
}

const calendarData: MonthData[] = [
  {
    month: 'September',
    year: 2025,
    weeks: [
      [null, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, null],
      [null, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, null],
      [null, { day: 15, skills: [1] }, { day: 16, skills: [1] }, { day: 17, skills: [1] }, { day: 18, skills: [1] }, { day: 19, skills: [1] }, null],
      [null, { day: 22, skills: [1, 11, 12] }, { day: 23, skills: [1, 11, 12] }, { day: 24, skills: [1, 11, 12] }, { day: 25, skills: [1, 11, 12] }, { day: 26, skills: [1, 11, 12] }, null],
      [null, { day: 29, skills: [1, 2, 11, 12] }, { day: 30, skills: [1, 2, 11, 12] }, { day: 1, skills: [1, 2, 11, 12] }, { day: 2, skills: [1, 2, 11, 12], classSkills: [1, 2, 11, 12] }, { day: 3, skills: [1, 2, 11, 12] }, null],
    ],
  },
  {
    month: 'October',
    year: 2025,
    weeks: [
      [null, { day: 6, skills: [2, 11, 12] }, { day: 7, skills: [2, 11, 12] }, { day: 8, skills: [2, 11, 12] }, { day: 9, skills: [2, 11, 12] }, { day: 10, skills: [2, 11, 12] }, null],
      [null, { day: 13, isHoliday: true }, { day: 14, skills: [2, 3, 11, 12] }, { day: 15, skills: [2, 3, 11, 12] }, { day: 16, skills: [2, 3, 11, 12] }, { day: 17, skills: [2, 3, 11, 12] }, null],
      [null, { day: 20, skills: [3, 4, 11, 12] }, { day: 21, skills: [3, 4, 11, 12], labSkills: [1, 2, 3, 4, 11, 12] }, { day: 22, skills: [3, 4, 11, 12] }, { day: 23, skills: [3, 4, 11, 12] }, { day: 24, skills: [3, 4, 11, 12] }, null],
      [null, { day: 27, skills: [3, 4, 5, 11, 12] }, { day: 28, skills: [3, 4, 5, 11, 12] }, { day: 29, skills: [3, 4, 5, 11, 12] }, { day: 30, skills: [3, 4, 5, 11, 12], classSkills: [3, 4, 5, 11, 12] }, { day: 31, skills: [3, 4, 5, 11, 12] }, null],
    ],
  },
  {
    month: 'November',
    year: 2025,
    weeks: [
      [null, { day: 3, skills: [4, 5, 6] }, { day: 4, skills: [4, 5, 6] }, { day: 5, skills: [4, 5, 6] }, { day: 6, skills: [4, 5, 6] }, { day: 7, skills: [4, 5, 6] }, null],
      [null, { day: 10, skills: [4, 5, 6, 7, 8] }, { day: 11, isHoliday: true }, { day: 12, skills: [4, 5, 6, 7, 8] }, { day: 13, skills: [4, 5, 6, 7, 8] }, { day: 14, skills: [4, 5, 6, 7, 8] }, null],
      [null, { day: 17, skills: [6, 7, 8, 9, 10] }, { day: 18, skills: [6, 7, 8, 9, 10], labSkills: [6, 7, 8, 9, 10] }, { day: 19, skills: [6, 7, 8, 9, 10] }, { day: 20, skills: [6, 7, 8, 9, 10] }, { day: 21, skills: [6, 7, 8, 9, 10] }, null],
      [null, { day: 24, skills: [7, 8, 9, 10], classSkills: [6, 7, 8, 9, 10] }, { day: 25, skills: [7, 8, 9, 10] }, { day: 26, isHoliday: true }, { day: 27, isHoliday: true }, { day: 28, isHoliday: true }, null],
    ],
  },
  {
    month: 'December',
    year: 2025,
    weeks: [
      [null, { day: 1, skills: [7, 8, 9, 10] }, { day: 2, skills: [7, 8, 9, 10] }, { day: 3, skills: [7, 8, 9, 10] }, { day: 4, skills: [7, 8, 9, 10] }, { day: 5, skills: [7, 8, 9, 10] }, null],
    ],
  },
];

export default function SkillCalendar() {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `
<style>
.skill-calendar {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
.skill-calendar th {
  background-color: #f0f0f0;
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
  font-weight: bold;
}
.skill-calendar td {
  border: 1px solid #ddd;
  padding: 0;
  vertical-align: top;
  width: 14.28%;
  height: 100px;
  position: relative;
}
.calendar-day {
  padding: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.day-number {
  font-weight: bold;
  margin-bottom: 4px;
}
.skill-stripes {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 2px;
}
.skill-stripe {
  height: 18px;
  flex: 1;
  min-width: 24px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: #000;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}
.month-header {
  background-color: #e8e8e8;
  font-weight: bold;
  font-size: 14px;
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}
.month-header th {
  background-color: #e8e8e8;
}
.skill-day-indicator {
  background-color: transparent;
  color: #000;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  margin-bottom: 2px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  border: 2px solid #000;
}
.skill-bundle-indicator {
  background-color: transparent;
  color: #000;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  margin-bottom: 2px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  border: 2px solid #000;
}
.badge-skill-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  border: 2px solid #000;
}
.holiday {
  background-color: #f9f9f9;
  color: #999;
}
.past-day {
  opacity: 0.4;
  background-color: #f5f5f5;
}
.current-day {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
  border-radius: 4px;
}
.skill-1 { background-color: #FF6B6B; }
.skill-2 { background-color: #4ECDC4; }
.skill-3 { background-color: #45B7D1; }
.skill-4 { background-color: #FFA07A; }
.skill-5 { background-color: #98D8C8; }
.skill-6 { background-color: #F7DC6F; }
.skill-7 { background-color: #BB8FCE; }
.skill-8 { background-color: #85C1E2; }
.skill-9 { background-color: #F8B739; }
.skill-10 { background-color: #52BE80; }
.skill-11 { background-color: #EC7063; }
.skill-12 { background-color: #5DADE2; }
</style>
`,
        }}
      />
      <table className="skill-calendar">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {calendarData.map((month, monthIdx) => (
            <React.Fragment key={monthIdx}>
              <tr className="month-header">
                <th colSpan={7}>
                  {month.month} {month.year}
                </th>
              </tr>
              {month.weeks.map((week, weekIdx) => (
                <tr key={weekIdx}>
                  {week.map((day, dayIdx) => {
                    if (day === null) {
                      return <td key={dayIdx}></td>;
                    }
                    const skills = day.skills || [];
                    const classSkills = day.classSkills;
                    const labSkills = day.labSkills;
                    const displaySkills = classSkills || labSkills || skills;
                    return (
                      <td
                        key={dayIdx}
                        className={day.isHoliday ? 'holiday' : ''}
                        data-year={month.year}
                        data-month={month.month}
                        data-day={day.day}
                      >
                        <div className="calendar-day">
                          <span className="day-number">{day.day}</span>
                          {day.isHoliday && (
                            <span style={{ fontSize: '10px', color: '#999' }}>Holiday</span>
                          )}
                          {classSkills && (
                            <span className="skill-day-indicator">
                              Class:{' '}
                              {classSkills.map((skill) => (
                                <React.Fragment key={skill}>
                                  <span className={`badge-skill-color skill-${skill}`}></span>
                                  {skill}{' '}
                                </React.Fragment>
                              ))}
                            </span>
                          )}
                          {labSkills && (
                            <span className="skill-bundle-indicator">
                              Lab:{' '}
                              {labSkills.map((skill) => (
                                <React.Fragment key={skill}>
                                  <span className={`badge-skill-color skill-${skill}`}></span>
                                  {skill}{' '}
                                </React.Fragment>
                              ))}
                            </span>
                          )}
                          {skills.length > 0 && (
                            <div className="skill-stripes">
                              {skills.map((skill) => (
                                <div key={skill} className={`skill-stripe skill-${skill}`}>
                                  {skill}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <CalendarHighlighter />
    </>
  );
}

