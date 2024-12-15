import { Tooltip } from '@lobehub/ui';
import { keyframes } from 'antd-style';
import { Fragment, ReactNode, memo } from 'react';

import type { Activity, Labels, Week } from '@/types/charts';

interface CalendarProps {
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  colorScale: string[];
  customTooltip?: (activity: Activity) => ReactNode;
  enableAnimation: boolean;
  labelHeight: number;
  labels: Labels;
  maxLevel: number;
  onValueChange?: (value: Activity) => void;
  showTooltip: boolean;
  weeks: Week[];
}

const Calendar = memo<CalendarProps>(
  ({
    weeks,
    maxLevel,
    enableAnimation,
    colorScale,
    blockSize,
    blockRadius,
    blockMargin,
    labelHeight,
    showTooltip,
    customTooltip,
    labels,
    onValueChange,
  }) => {
    return (
      <>
        {weeks
          .map((week, weekIndex) =>
            week.map((activity, dayIndex) => {
              if (!activity) {
                return null;
              }

              if (activity.level < 0 || activity.level > maxLevel) {
                throw new RangeError(
                  `Provided activity level ${activity.level} for ${activity.date} is out of range. It must be between 0 and ${maxLevel}.`,
                );
              }

              const style = enableAnimation
                ? {
                    animation: `${keyframes`
                      0% {
                        fill: var(--lobe-heatmaps-loading);
                      }
                      50% {
                        fill: var(--lobe-heatmaps-loading-active);
                      }
                      100% {
                        fill: var(--lobe-heatmaps-loading);
                      }
                    `} 1.75s ease-in-out infinite`,
                    animationDelay: `${weekIndex * 20 + dayIndex * 20}ms`,
                  }
                : undefined;

              const block = (
                <rect
                  data-date={activity.date}
                  data-level={activity.level}
                  fill={colorScale[activity.level]}
                  height={blockSize}
                  onClick={() => onValueChange?.(activity)}
                  rx={blockRadius}
                  ry={blockRadius}
                  style={{
                    cursor: onValueChange ? 'pointer' : undefined,
                    ...style,
                  }}
                  width={blockSize}
                  x={0}
                  y={labelHeight + (blockSize + blockMargin) * dayIndex}
                />
              );

              return (
                <Fragment key={activity.date}>
                  {showTooltip ? (
                    <Tooltip
                      title={
                        customTooltip
                          ? customTooltip(activity)
                          : labels.tooltip
                            ? labels.tooltip
                                .replace('{{count}}', String(activity.count))
                                .replace('{{date}}', String(activity.date))
                            : `${activity.count} activities on ${activity.date}`
                      }
                    >
                      {block}
                    </Tooltip>
                  ) : (
                    block
                  )}
                </Fragment>
              );
            }),
          )
          .map((week, x) => (
            <g key={x} transform={`translate(${(blockSize + blockMargin) * x}, 0)`}>
              {week}
            </g>
          ))}
      </>
    );
  },
);

export default Calendar;
