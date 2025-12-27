import { cx } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';

import type { Labels, Week } from '@/types/charts';
import { getMonthLabels } from '@/utils/calendar';

interface WeekdayLabelItem {
  dayIndex: number;
  index: number;
  label: string;
  y: number;
}

interface WeekdayLabelsProps {
  blockMargin: number;
  blockSize: number;
  firstWeek: Week;
  labelHeight: number;
  labelMargin: number;
  weekStart: number;
  weekdays?: string[];
}

// Simple component - ChartLabels already memoized, so this doesn't need memo
const WeekdayLabels = ({
  blockMargin,
  blockSize,
  firstWeek,
  labelHeight,
  labelMargin,
  weekStart,
  weekdays,
}: WeekdayLabelsProps) => {
  const labels = useMemo(() => {
    const maxLength = Math.floor((blockSize * 7 + blockMargin * 6) / 12);

    return firstWeek
      .map((_, index) => {
        if (index % 2 === 0) return null;
        const dayIndex = (index + weekStart) % 7;
        const label = weekdays?.[dayIndex] || '';
        const truncatedLabel = label.length > maxLength ? label.slice(0, maxLength) + '...' : label;
        return {
          dayIndex,
          index,
          label: truncatedLabel,
          y: labelHeight + (blockSize + blockMargin) * index + blockSize / 2,
        };
      })
      .filter((item): item is WeekdayLabelItem => item !== null);
  }, [firstWeek, weekStart, blockSize, blockMargin, labelHeight, weekdays]);

  if (labels.length === 0) return null;

  return (
    <g className={cx('legend-weekday')}>
      {labels.map((item) => (
        <text
          dominantBaseline="middle"
          key={item.index}
          textAnchor="end"
          x={-labelMargin}
          y={item.y}
        >
          {item.label}
        </text>
      ))}
    </g>
  );
};

WeekdayLabels.displayName = 'WeekdayLabels';

interface MonthLabelsProps {
  blockMargin: number;
  blockSize: number;
  monthNames?: string[];
  weeks: Week[];
}

// Simple component - ChartLabels already memoized, so this doesn't need memo
const MonthLabels = ({ blockMargin, blockSize, monthNames, weeks }: MonthLabelsProps) => {
  const labels = useMemo(() => {
    if (weeks.length === 0) return [];
    return getMonthLabels(weeks, monthNames);
  }, [weeks, monthNames]);

  const maxLength = useMemo(() => {
    return Math.floor((blockSize * 4 + blockMargin * 3) / 12);
  }, [blockSize, blockMargin]);

  if (labels.length === 0) return null;

  return (
    <g className={cx('legend-month')}>
      {labels.map(({ label, weekIndex }) => {
        const truncatedLabel = label.length > maxLength ? label.slice(0, maxLength) + '...' : label;
        return (
          <text
            dominantBaseline="hanging"
            key={weekIndex}
            x={(blockSize + blockMargin) * weekIndex}
          >
            {truncatedLabel}
          </text>
        );
      })}
    </g>
  );
};

MonthLabels.displayName = 'MonthLabels';

interface ChartLabelsProps {
  blockMargin: number;
  blockSize: number;
  hideMonthLabels: boolean;
  labelHeight: number;
  labelMargin: number;
  labels: Labels;
  showWeekdayLabels: boolean;
  weekStart: number;
  weeks: Week[];
}

const ChartLabels = memo<ChartLabelsProps>(
  ({
    labels,
    blockSize,
    labelHeight,
    blockMargin,
    labelMargin,
    showWeekdayLabels,
    hideMonthLabels,
    weeks,
    weekStart,
  }) => {
    return (
      <>
        {showWeekdayLabels && weeks[0] && (
          <WeekdayLabels
            blockMargin={blockMargin}
            blockSize={blockSize}
            firstWeek={weeks[0]}
            labelHeight={labelHeight}
            labelMargin={labelMargin}
            weekStart={weekStart}
            weekdays={labels.weekdays}
          />
        )}
        {!hideMonthLabels && (
          <MonthLabels
            blockMargin={blockMargin}
            blockSize={blockSize}
            monthNames={labels.months}
            weeks={weeks}
          />
        )}
      </>
    );
  },
  isEqual,
);

ChartLabels.displayName = 'ChartLabels';

export default ChartLabels;
