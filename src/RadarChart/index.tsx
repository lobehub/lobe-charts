'use client';

import { Flexbox, Skeleton } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { ReactNode, forwardRef, useState } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as ReChartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import BaseChartProps from '@/common/BaseChartProps';
import ChartLegend from '@/common/ChartLegend';
import ChartTooltip from '@/common/ChartTooltip';
import NoData from '@/common/NoData';
import { constructCategoryColors, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { defaultValueFormatter } from '@/utils';

import { styles } from './styles';

export interface RadarChartProps extends BaseChartProps {
  /**
   * Format angle-axis labels. Receives the index value and the matching data row.
   * Can return a string or ReactNode (e.g. colored `<tspan>`).
   */
  angleAxisLabelFormatter?: (value: string | number, payload?: Record<string, any>) => ReactNode;
  /**
   * When true, series after the first are rendered at `secondaryOpacity`.
   * @default true
   */
  dimSecondarySeries?: boolean;
  fillOpacity?: number;
  /**
   * Opacity applied to series after the first when `dimSecondarySeries` is enabled.
   * @default 0.25
   */
  secondaryOpacity?: number;
  shape?: 'polygon' | 'circle';
  showRadiusAxis?: boolean;
}

const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>((props, ref) => {
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    categories = [],
    customCategories,
    index,
    colors = themeColorRange,
    valueFormatter = defaultValueFormatter,
    animationDuration = 900,
    showAnimation = false,
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    autoMinValue = false,
    minValue,
    maxValue,
    allowDecimals = true,
    noDataText,
    onValueChange,
    enableLegendSlider = false,
    customTooltip,
    loading,
    className,
    width = '100%',
    height = 280,
    style,
    shape = 'polygon',
    fillOpacity = 0.33,
    showRadiusAxis = false,
    dimSecondarySeries = true,
    secondaryOpacity = 0.25,
    angleAxisLabelFormatter,
    xAxisLabelFormatter,
    yAxisDomain: yAxisDomainOverride,
    ...rest
  } = props;

  const [activeLegend, setActiveLegend] = useState<string | undefined>();
  const [legendHeight, setLegendHeight] = useState(60);

  if (loading || !data) return <Skeleton.Block active height={height} width={width} />;

  const CustomTooltip = customTooltip;
  const categoryColors = constructCategoryColors(categories, colors);
  const hasOnValueChange = !!onValueChange;
  const yAxisDomain = (yAxisDomainOverride ??
    getYAxisDomain(autoMinValue, minValue, maxValue)) as AxisDomain;

  const onCategoryClick = (dataKey: string) => {
    if (!hasOnValueChange) return;
    if (dataKey === activeLegend) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        categoryClicked: dataKey,
        eventType: 'category',
      });
    }
  };

  return (
    <Flexbox
      className={className}
      height={height}
      ref={ref}
      style={{ position: 'relative', ...style }}
      width={width}
      {...rest}
    >
      <ResponsiveContainer>
        {data?.length ? (
          <ReChartsRadarChart
            data={data}
            margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onClick={
              hasOnValueChange && activeLegend
                ? () => {
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
          >
            {showGridLines ? (
              <PolarGrid
                className={styles.gridLines}
                fill="none"
                gridType={shape}
                stroke={cssVar.colorBorderSecondary}
              />
            ) : undefined}
            <PolarAngleAxis
              axisLine={false}
              className={styles.label}
              dataKey={index}
              tick={(tickProps: any) => {
                const { x, y, textAnchor, payload: tickPayload } = tickProps;
                const value = tickPayload?.value;
                const row = data.find((item) => item[index] === value);
                let content: ReactNode = value;
                if (angleAxisLabelFormatter) {
                  content = angleAxisLabelFormatter(value, row);
                } else if (xAxisLabelFormatter) {
                  content = xAxisLabelFormatter(value);
                }
                return (
                  <text
                    className="recharts-polar-angle-axis-tick-value"
                    fill={cssVar.colorTextDescription}
                    fontSize={12}
                    textAnchor={textAnchor}
                    x={x}
                    y={y}
                  >
                    {content}
                  </text>
                );
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              allowDecimals={allowDecimals}
              axisLine={false}
              className={styles.radiusLabel}
              domain={yAxisDomain}
              stroke={cssVar.colorTextQuaternary}
              tick={showRadiusAxis}
              tickFormatter={valueFormatter}
              tickLine={false}
            />
            <Tooltip
              content={
                showTooltip
                  ? ({ active, payload, label }) =>
                      CustomTooltip ? (
                        <CustomTooltip
                          active={active}
                          customCategories={customCategories}
                          label={label}
                          payload={payload?.map((payloadItem: any) => ({
                            ...payloadItem,
                            color: categoryColors.get(payloadItem.dataKey) ?? cssVar.colorPrimary,
                          }))}
                          valueFormatter={valueFormatter}
                        />
                      ) : (
                        <ChartTooltip
                          active={active}
                          categoryColors={categoryColors}
                          customCategories={customCategories}
                          label={label}
                          payload={payload}
                          valueFormatter={valueFormatter}
                        />
                      )
                  : undefined
              }
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none' }}
            />
            {showLegend ? (
              <Legend
                content={({ payload }) =>
                  ChartLegend(
                    { payload: payload?.slice().reverse() },
                    categoryColors,
                    setLegendHeight,
                    activeLegend,
                    hasOnValueChange
                      ? (clickedLegendItem: string) => onCategoryClick(clickedLegendItem)
                      : undefined,
                    enableLegendSlider,
                    customCategories,
                  )
                }
                height={legendHeight}
                verticalAlign="top"
              />
            ) : undefined}
            {/* Render later categories first so earlier ones (e.g. A) paint on top */}
            {[...categories].reverse().map((category) => {
              const isInactive = Boolean(activeLegend && activeLegend !== category);
              const isSecondary = dimSecondarySeries && category !== categories[0];
              const seriesFillOpacity = isSecondary ? fillOpacity * secondaryOpacity : fillOpacity;
              const seriesStrokeOpacity = isSecondary ? secondaryOpacity : 1;
              const color = categoryColors.get(category) ?? cssVar.colorPrimary;
              return (
                <Radar
                  animationDuration={animationDuration}
                  dataKey={category}
                  fill={color}
                  fillOpacity={isInactive ? seriesFillOpacity * 0.3 : seriesFillOpacity}
                  isAnimationActive={showAnimation}
                  key={category}
                  name={category}
                  stroke={color}
                  strokeOpacity={isInactive ? seriesStrokeOpacity * 0.3 : seriesStrokeOpacity}
                  strokeWidth={2}
                  style={{
                    cursor: onValueChange ? 'pointer' : undefined,
                  }}
                />
              );
            })}
          </ReChartsRadarChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

RadarChart.displayName = 'RadarChart';

export default RadarChart;
