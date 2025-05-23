import { memo } from 'react';

import type { Labels, Week } from '@/types/charts';
import { getMonthLabels } from '@/utils/calendar';

import { useStyles } from './styles';

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
    const { cx } = useStyles();

    return (
      <>
        {showWeekdayLabels && weeks[0] && (
          <g className={cx('legend-weekday')}>
            {weeks[0].map((_, index) => {
              if (index % 2 === 0) {
                return null;
              }

              const dayIndex = (index + weekStart) % 7;
              const maxLength = Math.floor((blockSize * 7 + blockMargin * 6) / 12);
              const label = labels?.weekdays?.[dayIndex] || '';

              return (
                <text
                  dominantBaseline="middle"
                  key={index}
                  textAnchor="end"
                  x={-labelMargin}
                  y={labelHeight + (blockSize + blockMargin) * index + blockSize / 2}
                >
                  {label.length > maxLength ? label.slice(0, maxLength) + '...' : label}
                </text>
              );
            })}
          </g>
        )}
        {!hideMonthLabels && (
          <g className={cx('legend-month')}>
            {getMonthLabels(weeks, labels.months).map(({ label, weekIndex }) => {
              const maxLength = Math.floor((blockSize * 4 + blockMargin * 3) / 12);
              return (
                <text
                  dominantBaseline="hanging"
                  key={weekIndex}
                  x={(blockSize + blockMargin) * weekIndex}
                >
                  {label.length > maxLength ? label.slice(0, maxLength) + '...' : label}
                </text>
              );
            })}
          </g>
        )}
      </>
    );
  },
);

export default ChartLabels;
