import { useEffect } from 'react';

/**
 * Marks each calendar day as past or current, read from its `data-date`
 * (YYYY-MM-DD). This runs in the browser rather than at build time, so the
 * highlighting reflects the day the page is viewed, not the day it was built.
 */
export default function CalendarHighlighter() {
  useEffect(() => {
    function highlightCurrentDay() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      document
        .querySelectorAll('.skill-calendar td[data-date]')
        .forEach(function (cell) {
          const cellDate = new Date(`${cell.getAttribute('data-date')}T00:00:00`);
          cell.classList.remove('past-day', 'current-day');
          if (isNaN(cellDate.getTime())) return;
          if (cellDate < today) {
            cell.classList.add('past-day');
          } else if (cellDate.getTime() === today.getTime()) {
            cell.classList.add('current-day');
          }
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
