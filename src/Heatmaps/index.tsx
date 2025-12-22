'use client';

import { Flexbox, FlexboxProps } from '@lobehub/ui';
import { useThemeMode } from 'antd-style';
import type { Day as WeekDay } from 'date-fns';
import { getYear, parseISO } from 'date-fns';
import { ReactNode, forwardRef, useMemo } from 'react';

import NoData, { NoDataProps } from '@/common/NoData';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Activity, Labels, Week } from '@/types/charts';
import { isOnSeverSide } from '@/utils';
import {
  DEFAULT_LABELS,
  generateEmptyData,
  groupByWeeks,
  maxWeekdayLabelLength,
} from '@/utils/calendar';
import { createTheme } from '@/utils/theme';

import Calendar from './Calendar';
import ChartLabels from './ChartLabels';
import Footer from './Footer';
import { useStyles } from './styles';

const LABEL_MARGIN = 8;

export interface HeatmapsProps extends FlexboxProps {
  blockMargin?: number;
  blockRadius?: number;
  blockSize?: number;
  colors?: string[];
  customTooltip?: (activity: Activity) => ReactNode;
  data: Array<Activity>;
  fontSize?: number;
  hideColorLegend?: boolean;
  hideMonthLabels?: boolean;
  hideTotalCount?: boolean;
  labels?: Labels;
  loading?: boolean;
  maxLevel?: number;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (value: Activity) => void;
  showTooltip?: boolean;
  showWeekdayLabels?: boolean;
  totalCount?: number;
  weekStart?: WeekDay;
}

const Heatmaps = forwardRef<HTMLDivElement, HeatmapsProps>((props, ref) => {
  const {
    data,
    blockMargin = 4,
    blockRadius = 2,
    blockSize = 12,
    onValueChange,
    fontSize = 12,
    hideColorLegend = false,
    hideMonthLabels = false,
    hideTotalCount = false,
    labels: labelsProp,
    maxLevel = Math.max(1, props.maxLevel || 4),
    loading = false,
    showTooltip = true,
    customTooltip,
    showWeekdayLabels = false,
    style = {},
    colors,
    totalCount: totalCountProp,
    weekStart = 0, // Sunday
    className,
    noDataText,
    ...rest
  } = props;

  const activities = useMemo(() => {
    if (loading) return generateEmptyData();
    return data.map((item) => ({
      ...item,
      level: item.level > maxLevel ? maxLevel : item.level,
    }));
  }, [data, maxLevel, loading]);

  const { isDarkMode } = useThemeMode();
  const { cx, styles, theme } = useStyles();

  const defaultColors = useMemo(() => {
    switch (maxLevel) {
      case 1: {
        return [theme.colorFillSecondary, isDarkMode ? theme.lime8 : theme.green8];
      }
      case 2: {
        return [
          theme.colorFillSecondary,
          isDarkMode ? theme.lime4 : theme.green4,
          isDarkMode ? theme.lime8 : theme.green8,
        ];
      }
      case 3: {
        return [
          theme.colorFillSecondary,
          isDarkMode ? theme.lime3 : theme.green3,
          isDarkMode ? theme.lime6 : theme.green6,
          isDarkMode ? theme.lime9 : theme.green9,
        ];
      }
      case 4: {
        return [
          theme.colorFillSecondary,
          isDarkMode ? theme.lime2 : theme.green2,
          isDarkMode ? theme.lime4 : theme.green4,
          isDarkMode ? theme.lime6 : theme.green6,
          isDarkMode ? theme.lime8 : theme.green8,
        ];
      }
      default: {
        return [theme.colorFillSecondary, theme.colorSuccess];
      }
    }
  }, [theme, isDarkMode, maxLevel]);

  const useAnimation = !usePrefersReducedMotion();

  if (activities.length === 0) return <NoData noDataText={noDataText} />;

  if (showWeekdayLabels && isOnSeverSide) return null;

  const colorScale = createTheme(colors || defaultColors, maxLevel + 1);

  const firstActivity = activities[0] as Activity;
  const year = getYear(parseISO(firstActivity.date));
  const weeks = groupByWeeks(activities, weekStart);
  const firstWeek = weeks[0] as Week;

  const labels = Object.assign({}, DEFAULT_LABELS, labelsProp);
  const labelHeight = hideMonthLabels ? 0 : fontSize + LABEL_MARGIN;

  const weekdayLabelOffset = showWeekdayLabels
    ? maxWeekdayLabelLength(firstWeek, weekStart, labels.weekdays, fontSize) + LABEL_MARGIN
    : undefined;

  const getDimensions = () => ({
    height: labelHeight + (blockSize + blockMargin) * 7 - blockMargin,
    width: weeks.length * (blockSize + blockMargin) - blockMargin,
  });

  const { width, height } = getDimensions();

  const zeroColor = colorScale[0];
  const containerStyles = {
    fontSize,
    ...(useAnimation && {
      [`--lobe-heatmaps-loading`]: zeroColor,
      [`--lobe-heatmaps-loading-active`]: theme.colorFill,
    }),
  };

  return (
    <Flexbox
      className={cx(styles.container, className)}
      ref={ref}
      style={{ ...style, ...containerStyles }}
      {...rest}
    >
      <div className={styles.scrollContainer}>
        <svg
          className={styles.calendar}
          height={height}
          style={{ marginLeft: weekdayLabelOffset }}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          {!loading && !showWeekdayLabels && hideMonthLabels ? undefined : (
            <ChartLabels
              blockMargin={blockMargin}
              blockSize={blockSize}
              hideMonthLabels={hideMonthLabels}
              labelHeight={labelHeight}
              labelMargin={LABEL_MARGIN}
              labels={labels}
              showWeekdayLabels={showWeekdayLabels}
              weekStart={weekStart}
              weeks={weeks}
            />
          )}
          <Calendar
            blockMargin={blockMargin}
            blockRadius={blockRadius}
            blockSize={blockSize}
            colorScale={colorScale}
            customTooltip={customTooltip}
            enableAnimation={loading && useAnimation}
            labelHeight={labelHeight}
            labels={labels}
            maxLevel={maxLevel}
            onValueChange={onValueChange}
            showTooltip={showTooltip}
            weeks={weeks}
          />
        </svg>
      </div>
      {hideTotalCount && hideColorLegend ? undefined : (
        <Footer
          blockRadius={blockRadius}
          blockSize={blockSize}
          colorScale={colorScale}
          hideColorLegend={hideColorLegend}
          hideTotalCount={hideTotalCount}
          labels={labels}
          loading={loading}
          maxLevel={maxLevel}
          totalCount={
            typeof totalCountProp === 'number'
              ? totalCountProp
              : activities.reduce((sum, activity) => sum + activity.count, 0)
          }
          weekdayLabelOffset={weekdayLabelOffset}
          year={year}
        />
      )}
    </Flexbox>
  );
});

Heatmaps.displayName = 'Heatmaps';

export default Heatmaps;
