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
    month: 'January',
    year: 2026,
    weeks: [
      [null, { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, null],
      [null, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, skills: [1] }, { day: 16 }, null],
      [null, { day: 19, isHoliday: true }, { day: 20 }, { day: 21, skills: [1] }, { day: 22, skills: [1] }, { day: 23 }, null],
      [null, { day: 26, skills: [1, 11, 12] }, { day: 27}, { day: 28, skills: [1, 11, 12] }, { day: 29, skills: [1, 11, 12] }, { day: 30}, null],
    ],
  },
  {
    month: 'February',
    year: 2026,
    weeks: [
      [null, { day: 2, skills: [1, 2, 11, 12] }, { day: 3}, { day: 4, skills: [1, 2, 11, 12] }, { day: 5, skills: [1, 2, 11, 12], classSkills: [1, 2, 11, 12] }, { day: 6}, null],
      [null, { day: 9, skills: [2, 11, 12] }, { day: 10}, { day: 11, skills: [2, 11, 12] }, { day: 12, skills: [2, 11, 12] }, { day: 13}, null],
      [null, { day: 16, isHoliday: true }, { day: 17}, { day: 18, skills: [2, 3, 11, 12] }, { day: 19, skills: [2, 3, 11, 12] }, { day: 20}, null],
      [null, { day: 23, skills: [3, 4, 11, 12] }, { day: 24}, { day: 25, skills: [3, 4, 11, 12] }, { day: 26, skills: [3, 4, 11, 12] }, { day: 27, labSkills: [1, 2, 3, 4, 11, 12]  }, null],
    ],
  },
  {
    month: 'March',
    year: 2026,
    weeks: [
      [null, { day: 2, isHoliday: true }, { day: 3, isHoliday: true }, { day: 4, isHoliday: true }, { day: 5, isHoliday: true}, { day: 6, isHoliday: true}, null],
      [null, { day: 9, skills: [3, 4, 5, 11, 12] }, { day: 10}, { day: 11, skills: [3, 4, 5, 11, 12] }, { day: 12, skills: [3, 4, 5, 11, 12], classSkills: [3, 4, 5, 11, 12] }, { day: 13}, null],
      [null, { day: 16, skills: [4, 5, 6] }, { day: 17}, { day: 18, skills: [4, 5, 6] }, { day: 19, skills: [4, 5, 6] }, { day: 20}, null],
      [null, { day: 23, skills: [4, 5, 6, 7, 8] }, { day: 24}, { day: 25, skills: [4, 5, 6, 7, 8] }, { day: 26, skills: [4, 5, 6, 7, 8] }, { day: 27}, null],
      [null, { day: 30, skills: [6, 7, 8, 9, 10] }, { day: 31}, { day: 1, skills: [6, 7, 8, 9, 10] }, { day: 2, skills: [6, 7, 8, 9, 10] }, { day: 3, labSkills: [6, 7, 8, 9, 10] }, null],
    ],
  },
  {
    month: 'April',
    year: 2026,
    weeks: [
      [null, { day: 6, skills: [7, 8, 9, 10], classSkills: [6, 7, 8, 9, 10] }, { day: 7}, { day: 8, skills: [7, 8, 9, 10] }, { day: 9, skills: [7, 8, 9, 10] }, { day: 10}, null],
      [null, { day: 13, skills: [7, 8, 9, 10] }, { day: 14}, { day: 15, skills: [7, 8, 9, 10] }, { day: 16, skills: [7, 8, 9, 10] }, { day: 17}, null],

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

