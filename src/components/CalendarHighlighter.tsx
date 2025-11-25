import { useEffect } from 'react';

export default function CalendarHighlighter() {
  useEffect(() => {
    function highlightCurrentDay() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const table = document.querySelector('.skill-calendar');
      if (!table) return;
      const rows = table.querySelectorAll('tbody tr');
      let currentMonthIndex = 8;
      let currentYearIndex = 2025;
      rows.forEach(function(row) {
        const monthHeader = row.querySelector('.month-header th');
        if (monthHeader) {
          const text = monthHeader.textContent.trim();
          if (text.includes('September')) {
            currentMonthIndex = 8;
            currentYearIndex = 2025;
          } else if (text.includes('October')) {
            currentMonthIndex = 9;
            currentYearIndex = 2025;
          } else if (text.includes('November')) {
            currentMonthIndex = 10;
            currentYearIndex = 2025;
          } else if (text.includes('December')) {
            currentMonthIndex = 11;
            currentYearIndex = 2025;
          }
          return;
        }
        const dayCells = row.querySelectorAll('td');
        dayCells.forEach(function(cell) {
          const dayDiv = cell.querySelector('.calendar-day');
          if (!dayDiv) return;
          const dayNumberSpan = dayDiv.querySelector('.day-number');
          if (!dayNumberSpan) return;
          const dayNumber = parseInt(dayNumberSpan.textContent.trim());
          if (isNaN(dayNumber)) return;
          const cellDate = new Date(currentYearIndex, currentMonthIndex, dayNumber);
          cellDate.setHours(0, 0, 0, 0);
          if (cellDate < today) {
            cell.classList.add('past-day');
          } else if (cellDate.getTime() === today.getTime()) {
            cell.classList.add('current-day');
          }
        });
      });
    }
    highlightCurrentDay();
    const timeout1 = setTimeout(highlightCurrentDay, 100);
    const timeout2 = setTimeout(highlightCurrentDay, 500);
    const timeout3 = setTimeout(highlightCurrentDay, 1000);
    return function() {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);
  return null;
}



