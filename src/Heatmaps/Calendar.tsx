import { Tooltip } from '@lobehub/ui';
import { keyframes } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { CSSProperties, ReactNode, memo, useMemo } from 'react';

import type { Activity, Labels, Week } from '@/types/charts';

// Move keyframes outside component to avoid recreation on each render
const loadingAnimation = keyframes`
  0% {
    fill: var(--lobe-heatmaps-loading);
  }
  50% {
    fill: var(--lobe-heatmaps-loading-active);
  }
  100% {
    fill: var(--lobe-heatmaps-loading);
  }
`;

// Helper function to generate tooltip title (moved outside component)
const getTooltipTitle = (
  activity: Activity,
  customTooltip?: (activity: Activity) => ReactNode,
  labels?: Labels,
): ReactNode => {
  if (customTooltip) {
    return customTooltip(activity);
  }
  if (labels?.tooltip) {
    return labels.tooltip
      .replace('{{count}}', String(activity.count))
      .replace('{{date}}', String(activity.date));
  }
  return `${activity.count} activities on ${activity.date}`;
};

interface CalendarBlockProps {
  activity: Activity;
  animationDelay: number;
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  color: string;
  customTooltip?: (activity: Activity) => ReactNode;
  dayIndex: number;
  enableAnimation: boolean;
  labelHeight: number;
  labels?: Labels;
  onValueChange?: (value: Activity) => void;
  showTooltip: boolean;
}

// Memoized block component - only re-renders when its own props change
const CalendarBlock = memo<CalendarBlockProps>(
  ({
    activity,
    blockSize,
    blockRadius,
    color,
    labelHeight,
    blockMargin,
    dayIndex,
    enableAnimation,
    animationDelay,
    onValueChange,
    showTooltip,
    customTooltip,
    labels,
  }) => {
    const style = useMemo<CSSProperties>(
      () => ({
        cursor: onValueChange ? 'pointer' : undefined,
        ...(enableAnimation && {
          animation: `${loadingAnimation} 1.75s ease-in-out infinite`,
          animationDelay: `${animationDelay}ms`,
        }),
      }),
      [enableAnimation, animationDelay, onValueChange],
    );

    const y = labelHeight + (blockSize + blockMargin) * dayIndex;
    const tooltipTitle = useMemo(
      () => getTooltipTitle(activity, customTooltip, labels),
      [activity, customTooltip, labels],
    );

    const block = (
      <rect
        data-date={activity.date}
        data-level={activity.level}
        fill={color}
        height={blockSize}
        onClick={onValueChange ? () => onValueChange(activity) : undefined}
        rx={blockRadius}
        ry={blockRadius}
        style={style}
        width={blockSize}
        x={0}
        y={y}
      />
    );

    return showTooltip ? <Tooltip title={tooltipTitle}>{block}</Tooltip> : block;
  },
  isEqual,
);

CalendarBlock.displayName = 'CalendarBlock';

interface CalendarWeekProps {
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
  week: Week;
  weekIndex: number;
}

// Memoized week component - only re-renders when its own week data changes
const CalendarWeek = memo<CalendarWeekProps>(
  ({
    week,
    weekIndex,
    blockMargin,
    blockRadius,
    blockSize,
    colorScale,
    customTooltip,
    enableAnimation,
    labelHeight,
    labels,
    maxLevel,
    onValueChange,
    showTooltip,
  }) => {
    return (
      <g transform={`translate(${(blockSize + blockMargin) * weekIndex}, 0)`}>
        {week.map((activity, dayIndex) => {
          if (!activity) {
            return null;
          }

          if (activity.level < 0 || activity.level > maxLevel) {
            throw new RangeError(
              `Provided activity level ${activity.level} for ${activity.date} is out of range. It must be between 0 and ${maxLevel}.`,
            );
          }

          const animationDelay = weekIndex * 20 + dayIndex * 20;
          const color = colorScale[activity.level];

          return (
            <CalendarBlock
              activity={activity}
              animationDelay={animationDelay}
              blockMargin={blockMargin}
              blockRadius={blockRadius}
              blockSize={blockSize}
              color={color}
              customTooltip={customTooltip}
              dayIndex={dayIndex}
              enableAnimation={enableAnimation}
              key={activity.date}
              labelHeight={labelHeight}
              labels={labels}
              onValueChange={onValueChange}
              showTooltip={showTooltip}
            />
          );
        })}
      </g>
    );
  },
  isEqual,
);

CalendarWeek.displayName = 'CalendarWeek';

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
        {weeks.map((week, weekIndex) => (
          <CalendarWeek
            blockMargin={blockMargin}
            blockRadius={blockRadius}
            blockSize={blockSize}
            colorScale={colorScale}
            customTooltip={customTooltip}
            enableAnimation={enableAnimation}
            key={weekIndex}
            labelHeight={labelHeight}
            labels={labels}
            maxLevel={maxLevel}
            onValueChange={onValueChange}
            showTooltip={showTooltip}
            week={week}
            weekIndex={weekIndex}
          />
        ))}
      </>
    );
  },
  isEqual,
);

Calendar.displayName = 'Calendar';

export default Calendar;
