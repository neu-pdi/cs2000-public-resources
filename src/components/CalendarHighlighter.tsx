import { useEffect } from 'react';

const MONTHS: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export default function CalendarHighlighter() {
  useEffect(() => {
    function highlightCurrentDay() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tables = document.querySelectorAll('.skill-calendar');
      tables.forEach(function (table) {
        table.querySelectorAll('tbody tr').forEach(function (row) {
          if (row.classList.contains('month-header')) return;

          let prevDay = 0;
          let overflowMonth = false;

          row.querySelectorAll('td').forEach(function (cell) {
            const dayNumber = parseInt(cell.getAttribute('data-day') || '', 10);
            const monthName = cell.getAttribute('data-month') || '';
            const year = parseInt(cell.getAttribute('data-year') || '', 10);
            if (isNaN(dayNumber) || isNaN(year) || !(monthName in MONTHS)) return;

            // Weeks can spill into the next month (e.g. Sept 28–30, Oct 1–2).
            if (prevDay > 0 && dayNumber < prevDay) overflowMonth = true;
            prevDay = dayNumber;

            let monthIndex = MONTHS[monthName] + (overflowMonth ? 1 : 0);
            let cellYear = year;
            if (monthIndex > 11) {
              monthIndex = 0;
              cellYear += 1;
            }

            const cellDate = new Date(cellYear, monthIndex, dayNumber);
            cellDate.setHours(0, 0, 0, 0);

            cell.classList.remove('past-day', 'current-day');
            if (cellDate < today) {
              cell.classList.add('past-day');
            } else if (cellDate.getTime() === today.getTime()) {
              cell.classList.add('current-day');
            }
          });
        });
      });
    }
    highlightCurrentDay();
    const timeout1 = setTimeout(highlightCurrentDay, 100);
    const timeout2 = setTimeout(highlightCurrentDay, 500);
    const timeout3 = setTimeout(highlightCurrentDay, 1000);
    return function () {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);
  return null;
}
