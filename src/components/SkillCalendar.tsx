import React from 'react';
import Link from '@docusaurus/Link';
import CalendarHighlighter from './CalendarHighlighter';

export interface CalLink {
  label: string;
  href: string;
}

export interface DayData {
  day: number;
  skills?: number[];
  isHoliday?: boolean;
  holidayName?: string;
  lectures?: (CalLink | string)[];
  lab?: { label: string; href: string; note?: string };
  homework?: CalLink;
}

export interface WeekData {
  label?: string;
  topic?: string;
  days: (DayData | null)[];
}

export interface MonthData {
  month: string;
  year: number;
  weeks: WeekData[];
}


function isCalLink(item: CalLink | string): item is CalLink {
  return typeof item === 'object';
}

export default function SkillCalendar({ data }: { data: MonthData[] }) {
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
  table-layout: fixed;
  color: var(--ifm-font-color-base);
}
.skill-calendar th {
  background-color: var(--ifm-color-emphasis-200);
  color: var(--ifm-font-color-base);
  padding: 8px;
  text-align: center;
  border: 1px solid var(--ifm-color-emphasis-300);
  font-weight: bold;
}
.skill-calendar td {
  border: 1px solid var(--ifm-color-emphasis-300);
  padding: 0;
  vertical-align: top;
  width: 14.28%;
  min-height: 110px;
  position: relative;
  background-color: var(--ifm-background-color);
}
.calendar-day {
  padding: 4px 5px 6px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.day-number {
  font-weight: bold;
  margin-bottom: 1px;
}
.day-holiday-name {
  font-size: 10px;
  color: var(--ifm-color-emphasis-600);
  line-height: 1.2;
}
.day-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  line-height: 1.25;
}
.day-items a {
  text-decoration: none;
}
.day-items a:hover {
  text-decoration: underline;
}
.day-lecture a {
  color: inherit;
}
.day-lab a {
  color: inherit;
  font-weight: 600;
}
.day-hw a {
  color: inherit;
  font-weight: 600;
}
.day-note {
  font-size: 10px;
  color: var(--ifm-color-emphasis-600);
  font-weight: normal;
}
.skill-stripes {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding-top: 4px;
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
  font-weight: bold;
  font-size: 14px;
  padding: 8px;
  text-align: center;
  border: 1px solid var(--ifm-color-emphasis-300);
}
.month-header th {
  background-color: var(--ifm-color-emphasis-300);
  color: var(--ifm-font-color-base);
}
.week-topic-row td {
  border: 1px solid var(--ifm-color-emphasis-300);
  padding: 0;
  min-height: 0;
  background-color: var(--ifm-color-emphasis-200);
}
.week-topic-bar {
  background: var(--ifm-color-emphasis-200);
  color: var(--ifm-font-color-base);
  border-left: 4px solid var(--ifm-color-primary);
  padding: 5px 10px;
  font-size: 13px;
  line-height: 1.35;
}
.week-topic-bar strong {
  margin-right: 0.35em;
}
.holiday {
  background-color: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-emphasis-700);
}
.past-day {
  opacity: 0.45;
}
.current-day {
  background-color: color-mix(in srgb, var(--ifm-color-primary) 18%, var(--ifm-background-color));
  box-shadow: inset 0 0 0 2px var(--ifm-color-primary);
}
.skill-0 { background-color: #D946EF; }
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
          {data.map((month, monthIdx) => (
            <React.Fragment key={monthIdx}>
              <tr className="month-header">
                <th colSpan={7}>
                  {month.month} {month.year}
                </th>
              </tr>
              {month.weeks.map((week, weekIdx) => (
                <React.Fragment key={weekIdx}>
                  {(week.label || week.topic) && (
                    <tr className="week-topic-row">
                      <td colSpan={7}>
                        <div className="week-topic-bar">
                          {week.label && <strong>{week.label}</strong>}
                          {week.topic}
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    {week.days.map((day, dayIdx) => {
                      if (day === null) {
                        return <td key={dayIdx}></td>;
                      }
                      const skills = day.skills || [];
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
                              <span className="day-holiday-name">
                                {day.holidayName || 'Holiday'}
                              </span>
                            )}
                            <div className="day-items">
                              {day.homework && (
                                <div className="day-hw">
                                  <Link to={day.homework.href}>{day.homework.label}</Link>
                                </div>
                              )}
                              {day.lectures &&
                                day.lectures.map((item, i) =>
                                  isCalLink(item) ? (
                                    <div className="day-lecture" key={item.href}>
                                      <Link to={item.href}>{item.label}</Link>
                                    </div>
                                  ) : (
                                    <div className="day-lecture" key={`plain-${i}`}>
                                      {item}
                                    </div>
                                  )
                                )}
                              {day.lab && (
                                <div className="day-lab">
                                  <Link to={day.lab.href}>{day.lab.label}</Link>
                                  {day.lab.note && (
                                    <div className="day-note">{day.lab.note}</div>
                                  )}
                                </div>
                              )}
                            </div>
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
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <CalendarHighlighter />
    </>
  );
}
