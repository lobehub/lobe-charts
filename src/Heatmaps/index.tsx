'use client';

import { Flexbox, FlexboxProps, TooltipGroup } from '@lobehub/ui';
import { cx, useTheme, useThemeMode } from 'antd-style';
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
import { styles } from './styles';

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
  const theme = useTheme();

  // Note: defaultColors must use theme (actual color values) instead of cssVar
  // because createTheme() uses chroma.valid() which requires actual color values, not CSS variables
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

  // Memoize weeks calculation - expensive operation
  const weeks = useMemo(() => {
    if (activities.length === 0) return [];
    return groupByWeeks(activities, weekStart);
  }, [activities, weekStart]);

  // Memoize color scale calculation
  const colorScale = useMemo(() => {
    return createTheme(colors || defaultColors, maxLevel + 1);
  }, [colors, defaultColors, maxLevel]);

  // Memoize year calculation
  const year = useMemo(() => {
    if (activities.length === 0) return new Date().getFullYear();
    const firstActivity = activities[0] as Activity;
    return getYear(parseISO(firstActivity.date));
  }, [activities]);

  // Memoize labels object merge
  const labels = useMemo(() => {
    return Object.assign({}, DEFAULT_LABELS, labelsProp);
  }, [labelsProp]);

  // Memoize label height calculation
  const labelHeight = useMemo(() => {
    return hideMonthLabels ? 0 : fontSize + LABEL_MARGIN;
  }, [hideMonthLabels, fontSize]);

  // Memoize weekday label offset calculation
  const weekdayLabelOffset = useMemo(() => {
    if (!showWeekdayLabels || weeks.length === 0) return undefined;
    const firstWeek = weeks[0] as Week;
    return maxWeekdayLabelLength(firstWeek, weekStart, labels.weekdays, fontSize) + LABEL_MARGIN;
  }, [showWeekdayLabels, weeks, weekStart, labels.weekdays, fontSize]);

  // Memoize dimensions calculation
  const dimensions = useMemo(() => {
    return {
      height: labelHeight + (blockSize + blockMargin) * 7 - blockMargin,
      width: weeks.length * (blockSize + blockMargin) - blockMargin,
    };
  }, [labelHeight, blockSize, blockMargin, weeks.length]);

  const { width, height } = dimensions;

  // Memoize total count calculation
  const totalCount = useMemo(() => {
    if (typeof totalCountProp === 'number') return totalCountProp;
    return activities.reduce((sum, activity) => sum + activity.count, 0);
  }, [totalCountProp, activities]);

  // Memoize container styles
  const containerStyles = useMemo(() => {
    const zeroColor = colorScale[0];
    return {
      fontSize,
      ...(useAnimation && {
        [`--lobe-heatmaps-loading`]: zeroColor,
        [`--lobe-heatmaps-loading-active`]: theme.colorFill,
      }),
    };
  }, [fontSize, useAnimation, colorScale, theme.colorFill]);

  if (activities.length === 0) return <NoData noDataText={noDataText} />;

  if (showWeekdayLabels && isOnSeverSide) return null;

  return (
    <TooltipGroup>
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
            totalCount={totalCount}
            weekdayLabelOffset={weekdayLabelOffset}
            year={year}
          />
        )}
      </Flexbox>
    </TooltipGroup>
  );
});

Heatmaps.displayName = 'Heatmaps';

export default Heatmaps;
