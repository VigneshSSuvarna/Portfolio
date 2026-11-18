export function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function formatDisplayDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const monthShort = dateObj.toLocaleString('en-US', { month: 'short' });
  const weekdayShort = dateObj.toLocaleString('en-US', { weekday: 'short' });
  return `${day}${getOrdinalSuffix(day)} ${monthShort} ${year} (${weekdayShort})`;
}

export function toLocalDateKey(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function computeMaxStreak(dateKeys) {
  if (!dateKeys || dateKeys.length === 0) return 0;
  const sorted = [...new Set(dateKeys)].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseLocalDateKey(sorted[i - 1]);
    const curr = parseLocalDateKey(sorted[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

export function buildDynamicRatingTicks(startTime, endTime) {
  const ticks = [];
  const count = 9;
  const padStart = startTime + (endTime - startTime) * 0.08;
  const padEnd = endTime - (endTime - startTime) * 0.02;

  for (let i = 0; i < count; i++) {
    const t = padStart + ((padEnd - padStart) * i) / (count - 1);
    const d = new Date(t);
    const dayStr = String(d.getDate()).padStart(2, '0');
    const monthStr = d.toLocaleString('en-US', { month: 'short' });
    ticks.push({
      labelTop: `${dayStr} ${monthStr}`,
      labelBottom: String(d.getFullYear()),
      time: t
    });
  }
  return ticks;
}

export function buildCalendarWeeks(yearFilter = 'rolling') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endDate = new Date(today);
  let startDate;

  if (yearFilter === 'rolling') {
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());
    currentWeekSunday.setHours(0, 0, 0, 0);

    startDate = new Date(currentWeekSunday);
    startDate.setDate(currentWeekSunday.getDate() - 52 * 7);
  } else {
    const yr = Number(yearFilter);
    const jan1 = new Date(yr, 0, 1);
    startDate = new Date(jan1);
    startDate.setDate(jan1.getDate() - jan1.getDay());

    const dec31 = new Date(yr, 11, 31);
    endDate = dec31 > today ? new Date(today) : dec31;
  }

  const weeks = [];
  let cursor = new Date(startDate);
  let weekIdx = 0;
  let lastLabeledWeekIdx = -10;

  while (cursor <= endDate) {
    const weekSunday = new Date(cursor);
    const days = [];
    let monthLabel = null;

    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(weekSunday);
      cellDate.setDate(weekSunday.getDate() + d);
      cellDate.setHours(0, 0, 0, 0);

      if (cellDate > endDate) {
        break;
      }

      if (yearFilter !== 'rolling' && cellDate.getFullYear() !== Number(yearFilter)) {
        days.push({
          dateStr: toLocalDateKey(cellDate),
          dateObj: cellDate,
          dayOfWeek: d,
          isPadding: true
        });
        continue;
      }

      const dateStr = toLocalDateKey(cellDate);

      if (cellDate.getDate() === 1) {
        monthLabel = cellDate.toLocaleString('en-US', { month: 'short' });
        lastLabeledWeekIdx = weekIdx;
      }

      days.push({
        dateStr,
        dateObj: cellDate,
        dayOfWeek: d,
        isPadding: false
      });
    }

    if (weekIdx === 0 && !monthLabel && days.length > 0) {
      const firstActive = days.find(x => !x.isPadding) || days[0];
      monthLabel = firstActive.dateObj.toLocaleString('en-US', { month: 'short' });
      lastLabeledWeekIdx = 0;
    } else if (monthLabel && weekIdx - lastLabeledWeekIdx < 2 && weekIdx !== lastLabeledWeekIdx) {
      monthLabel = null;
    }

    if (days.length > 0) {
      weeks.push({
        weekIdx,
        monthLabel,
        days
      });
    }

    cursor.setDate(cursor.getDate() + 7);
    weekIdx++;
  }

  return weeks;
}