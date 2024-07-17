import type { Day as WeekDay } from 'date-fns';
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfYear,
  formatISO,
  getDay,
  getMonth,
  nextDay,
  parseISO,
  startOfYear,
  subWeeks,
} from 'date-fns';

import type { Activity, Week } from '@/types';
import { isOnSeverSide } from '@/utils/index';

export const DEFAULT_MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const DEFAULT_LABELS = {
  legend: {
    less: 'Less',
    more: 'More',
  },
  months: DEFAULT_MONTH_LABELS,
  tooltip: '{{count}} activities on {{date}}',
  totalCount: '{{count}} activities in {{year}}',
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

interface MonthLabel {
  label: string;
  weekIndex: number;
}

const fillHoles = (activities: Array<Activity>): Array<Activity> => {
  if (activities.length === 0) {
    return [];
  }

  const calendar = new Map<string, Activity>(activities.map((a) => [a.date, a]));
  const firstActivity = activities[0] as Activity;
  const lastActivity = activities.at(-1) as Activity;

  return eachDayOfInterval({
    end: parseISO(lastActivity.date),
    start: parseISO(firstActivity.date),
  }).map((day) => {
    const date = formatISO(day, { representation: 'date' });

    if (calendar.has(date)) {
      return calendar.get(date) as Activity;
    }

    return {
      count: 0,
      date,
      level: 0,
    };
  });
};

const calcTextDimensions = (text: string, fontSize: number) => {
  if (isOnSeverSide) return;

  if (fontSize < 1) {
    throw new RangeError('fontSize must be positive');
  }

  if (text.length === 0) {
    return { height: 0, width: 0 };
  }

  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');

  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  svg.style.fontFamily = window.getComputedStyle(document.body).fontFamily;
  svg.style.fontSize = `${fontSize}px`;

  const textNode = document.createElementNS(namespace, 'text');
  textNode.textContent = text;

  svg.append(textNode);
  document.body.append(svg);
  const boundingBox = textNode.getBBox();

  svg.remove();

  return { height: boundingBox.height, width: boundingBox.width };
};

export const groupByWeeks = (
  activities: Array<Activity>,
  weekStart: WeekDay = 0, // 0 = Sunday
): Array<Week> => {
  if (activities.length === 0) {
    return [];
  }

  const normalizedActivities = fillHoles(activities);

  // Determine the first date of the calendar. If the first date is not the
  // set start weekday, the selected weekday one week earlier is used.
  const firstActivity = normalizedActivities[0] as Activity;
  const firstDate = parseISO(firstActivity.date);
  const firstCalendarDate =
    getDay(firstDate) === weekStart ? firstDate : subWeeks(nextDay(firstDate, weekStart), 1);

  // To correctly group activities by week, it is necessary to left-pad the list
  // because the first date might not be set start weekday.
  const paddedActivities = [
    ...(Array.from({ length: differenceInCalendarDays(firstDate, firstCalendarDate) }).fill(
      null,
    ) as Array<Activity>),
    ...normalizedActivities,
  ];

  const numberOfWeeks = Math.ceil(paddedActivities.length / 7);

  // Finally, group activities by week
  return Array.from({ length: numberOfWeeks })
    .fill(null)
    .map((_, weekIndex) => paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7));
};

export const getMonthLabels = (
  weeks: Array<Week>,
  monthNames: Array<string> = DEFAULT_MONTH_LABELS,
): Array<MonthLabel> => {
  return weeks
    .reduce<Array<MonthLabel>>((labels, week, weekIndex) => {
      const firstActivity = week.filter(Boolean).find((activity) => activity !== undefined);

      if (!firstActivity) {
        throw new Error(`Unexpected error: Week ${weekIndex + 1} is empty: [${week}].`);
      }

      const month = monthNames[getMonth(parseISO(firstActivity.date))];

      if (!month) {
        const monthName = new Date(firstActivity.date).toLocaleString('en-US', { month: 'short' });
        throw new Error(`Unexpected error: undefined month label for ${monthName}.`);
      }

      const prevLabel = labels.at(-1);

      if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
        return [...labels, { label: month, weekIndex }];
      }

      return labels;
    }, [])
    .filter(({ weekIndex }, index, labels) => {
      // Labels should only be shown if there is "enough" space (data).
      // This is a naive implementation that does not take the block size,
      // font size, etc. into account.
      const minWeeks = 3;

      // Skip the first month label if there is not enough space to the next one.
      if (index === 0) {
        return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks;
      }

      // Skip the last month label if there is not enough data in that month
      // to avoid overflowing the calendar on the right.
      if (index === labels.length - 1) {
        return weeks.slice(weekIndex).length >= minWeeks;
      }

      return true;
    });
};

export const generateEmptyData = (): Array<Activity> => {
  const year = new Date().getFullYear();
  const days = eachDayOfInterval({
    end: new Date(year, 11, 31),
    start: new Date(year, 0, 1),
  });

  return days.map((date) => ({
    count: 0,
    date: formatISO(date, { representation: 'date' }),
    level: 0,
  }));
};

export const generateTestData = (args: {
  interval?: { end: Date; start: Date };
  maxLevel?: number;
}): Array<Activity> => {
  const maxCount = 20;
  const maxLevel = args.maxLevel ? Math.max(1, args.maxLevel) : 4;
  const now = new Date();

  const days = eachDayOfInterval(
    args.interval ?? {
      end: endOfYear(now),
      start: startOfYear(now),
    },
  );

  return days.map((date) => {
    // The random activity count is shifted by up to 80% towards zero.
    const c = Math.round(Math.random() * maxCount - Math.random() * (0.8 * maxCount));
    const count = Math.max(0, c);
    const level = Math.ceil((count / maxCount) * maxLevel);

    return {
      count,
      date: formatISO(date, { representation: 'date' }),
      level,
    };
  });
};

export const maxWeekdayLabelLength = (
  firstWeek: Week,
  weekStart: number,
  labels: string[],
  fontSize: number,
): number => {
  if (isOnSeverSide) return 0;
  if (labels.length !== 7) {
    throw new Error('Exactly 7 labels, one for each weekday must be passed.');
  }

  return firstWeek.reduce((maxLength, _, index) => {
    if (index % 2 !== 0) {
      const dayIndex = (index + weekStart) % 7;
      const label = labels[dayIndex] as string;
      // @ts-ignore
      const curLength = Math.ceil(calcTextDimensions(label, fontSize).width);

      return Math.max(maxLength, curLength);
    }

    return maxLength;
  }, 0);
};
