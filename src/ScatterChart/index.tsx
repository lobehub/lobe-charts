'use client';

import { css, cssVar, cx, Flexbox, Skeleton } from '@lobehub/ui';
import type { ComponentType, HTMLAttributes, MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart as ReChartsScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import ChartLegend from '@/common/ChartLegend';
import type { CustomTooltipProps } from '@/common/CustomTooltipProps';
import CustomYAxisTick from '@/common/CustomYAxisTick';
import {
  constructCategories,
  constructCategoryColors,
  deepEqual,
  getYAxisDomain,
} from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { renderShape } from '@/ScatterChart/renderShape';
import type { EventProps, IntervalType, ValueFormatter } from '@/types/charts';
import { defaultValueFormatter } from '@/utils';
import { getMaxLabelLength } from '@/utils/getMaxLabelLength';

import type BaseAnimationTimingProps from '../common/BaseAnimationTimingProps';
import NoData, { type NoDataProps } from '../common/NoData';
import ScatterChartTooltip from './ScatterChartTooltip';
import { styles } from './styles';

export type ScatterChartValueFormatter = {
  size?: ValueFormatter;
  x?: ValueFormatter;
  y?: ValueFormatter;
};

export interface ScatterChartProps
  extends BaseAnimationTimingProps, HTMLAttributes<HTMLDivElement> {
  allowDecimals?: boolean;
  autoMinXValue?: boolean;
  autoMinYValue?: boolean;
  category: string;
  colors?: string[];
  customCategories?: {
    [key: string]: string;
  };
  customTooltip?: ComponentType<CustomTooltipProps>;
  data: any[];
  enableLegendSlider?: boolean;
  intervalType?: IntervalType;
  loading?: boolean;
  maxXValue?: number;
  maxYValue?: number;
  minXValue?: number;
  minYValue?: number;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (value: EventProps) => void;
  rotateLabelX?: {
    angle: number;
    verticalShift: number;
    xAxisHeight: number;
  };
  showGridLines?: boolean;
  showLegend?: boolean;
  showOpacity?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  size?: string;
  sizeRange?: number[];
  startEndOnly?: boolean;
  tickGap?: number;
  valueFormatter?: ScatterChartValueFormatter;
  x: string;
  xAxisLabel?: string;
  y: string;
  yAxisAlign?: 'left' | 'right';
  yAxisLabel?: string;
  yAxisWidth?: number;
}

const ScatterChart = ({
  ref,
  ...props
}: ScatterChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    x,
    y,
    size,
    category,
    colors = themeColorRange,
    showOpacity = false,
    yAxisAlign = 'left',
    sizeRange = [1, 1000],
    valueFormatter = {
      size: defaultValueFormatter,
      x: defaultValueFormatter,
      y: defaultValueFormatter,
    },
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    yAxisWidth,
    intervalType = 'equidistantPreserveStart',
    animationDuration = 900,
    showAnimation = false,
    showTooltip = true,
    showLegend = true,
    loading,
    showGridLines = true,
    autoMinXValue = false,
    minXValue,
    maxXValue,
    autoMinYValue = false,
    minYValue,
    maxYValue,
    allowDecimals = true,
    noDataText,
    onValueChange,
    customTooltip,
    rotateLabelX,
    className,
    enableLegendSlider = false,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    width = '100%',
    height = 280,
    style,
    customCategories,
    ...rest
  } = props;

  const [legendHeight, setLegendHeight] = useState(60);
  const [activeNode, setActiveNode] = useState<any | undefined>();
  const [activeLegend, setActiveLegend] = useState<string | undefined>();
  const calculatedYAxisWidth: number | string = useMemo(() => {
    if (yAxisWidth) return yAxisWidth;
    return getMaxLabelLength({
      data,
      index: y,
      isScatterChart: true,
      margin: 0,
      valueFormatter: valueFormatter?.y,
    });
  }, [yAxisWidth, data, valueFormatter, y]);

  if (loading || !data) return <Skeleton height={height} width={width} />;

  const CustomTooltip = customTooltip;
  const hasOnValueChange = !!onValueChange;

  const onNodeClick = (data: any, index: number, event: MouseEvent) => {
    event.stopPropagation();
    if (!hasOnValueChange) return;
    if (deepEqual(activeNode, data.node)) {
      setActiveLegend(undefined);
      setActiveNode(undefined);
      onValueChange?.(null);
    } else {
      setActiveNode(data.node);
      setActiveLegend(data.payload[category]);
      onValueChange?.({
        categoryClicked: data.payload[category],
        eventType: 'bubble',
        ...data.payload,
      });
    }
  };

  const onCategoryClick = (dataKey: string) => {
    if (!hasOnValueChange) return;
    if (dataKey === activeLegend && !activeNode) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        categoryClicked: dataKey,
        eventType: 'category',
      });
    }
    setActiveNode(undefined);
  };

  const categories = constructCategories(data, category);
  const categoryColors = constructCategoryColors(categories, colors);

  //maybe rename getYAxisDomain to getAxisDomain
  const xAxisDomain = getYAxisDomain(autoMinXValue, minXValue, maxXValue);
  const yAxisDomain = getYAxisDomain(autoMinYValue, minYValue, maxYValue);

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
          <ReChartsScatterChart
            margin={{
              bottom: xAxisLabel ? 20 : undefined,
              left: 20,
              right: 20,
              top: 5,
            }}
            onClick={
              hasOnValueChange && (activeLegend || activeNode)
                ? () => {
                    setActiveNode(undefined);
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
          >
            {showGridLines ? (
              <CartesianGrid className={styles.gridLines} horizontal={true} vertical={true} />
            ) : null}
            {x ? (
              <XAxis
                allowDataOverflow={true}
                angle={rotateLabelX?.angle}
                axisLine={false}
                className={styles.label}
                dataKey={x}
                domain={xAxisDomain as AxisDomain}
                dy={rotateLabelX?.verticalShift}
                fill=""
                hide={!showXAxis}
                interval={startEndOnly ? 'preserveStartEnd' : intervalType}
                minTickGap={tickGap}
                name={x}
                stroke=""
                tick={{ transform: 'translate(0, 6)' }}
                tickFormatter={valueFormatter.x}
                tickLine={false}
                ticks={startEndOnly ? [data[0][x], data.at(-1)[x]] : undefined}
                type="number"
              >
                {xAxisLabel && (
                  <Label
                    className={cx(styles.strongLabel, styles.emphasis)}
                    offset={-20}
                    position="insideBottom"
                  >
                    {xAxisLabel}
                  </Label>
                )}
              </XAxis>
            ) : null}
            {y ? (
              <YAxis
                allowDataOverflow={true}
                allowDecimals={allowDecimals}
                axisLine={false}
                className={styles.label}
                dataKey={y}
                domain={yAxisDomain as AxisDomain}
                fill=""
                hide={!showYAxis}
                name={y}
                stroke=""
                tickFormatter={valueFormatter.y}
                tickLine={false}
                type="number"
                width={calculatedYAxisWidth}
                tick={(props) => (
                  <CustomYAxisTick
                    {...props}
                    align={yAxisAlign}
                    formatter={valueFormatter.y}
                    textAnchor={yAxisAlign === 'left' ? 'start' : 'end'}
                    yAxisLabel={Boolean(yAxisLabel)}
                  />
                )}
              >
                {yAxisLabel && (
                  <Label
                    angle={-90}
                    className={cx(styles.strongLabel, styles.emphasis)}
                    offset={-15}
                    position="insideLeft"
                    style={{ textAnchor: 'middle' }}
                  >
                    {yAxisLabel}
                  </Label>
                )}
              </YAxis>
            ) : null}
            <Tooltip
              cursor={{ stroke: cssVar.colorTextSecondary, strokeWidth: 1 }}
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none' }}
              content={
                showTooltip
                  ? ({ active, payload, label }) => {
                      const color = category ? payload?.[0]?.payload?.[category] : label;
                      return CustomTooltip ? (
                        <CustomTooltip
                          active={active}
                          customCategories={customCategories}
                          label={color}
                          valueFormatter={valueFormatter}
                          payload={payload?.map((payloadItem) => ({
                            ...payloadItem,
                            color: categoryColors.get(color) ?? cssVar.colorPrimary,
                          }))}
                        />
                      ) : (
                        <ScatterChartTooltip
                          active={active}
                          axis={{ size, x, y }}
                          category={category}
                          categoryColors={categoryColors}
                          customCategories={customCategories}
                          label={color}
                          payload={payload}
                          valueFormatter={valueFormatter}
                        />
                      );
                    }
                  : undefined
              }
            />
            {size ? <ZAxis dataKey={size} name={size} range={sizeRange} type="number" /> : null}
            {categories.map((cat) => {
              return (
                <Scatter
                  animationDuration={animationDuration}
                  data={category ? data.filter((d) => d[category] === cat) : data}
                  fill={`url(#${categoryColors.get(cat)})`}
                  fillOpacity={showOpacity ? 0.7 : 1}
                  isAnimationActive={showAnimation}
                  key={cat}
                  name={cat}
                  shape={(props: any) => renderShape(props, activeNode, activeLegend)}
                  className={cx(
                    css`
                      fill: ${categoryColors.get(cat) ?? cssVar.colorPrimary};
                    `,
                    showOpacity &&
                      css`
                        stroke: ${categoryColors.get(cat) ?? cssVar.colorPrimary};
                      `,
                  )}
                  style={{
                    cursor: onValueChange ? 'pointer' : undefined,
                  }}
                  onClick={onNodeClick}
                />
              );
            })}
            {showLegend ? (
              <Legend
                height={legendHeight}
                verticalAlign="top"
                content={({ payload }) =>
                  ChartLegend(
                    { payload },
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
              />
            ) : undefined}
          </ReChartsScatterChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
};

ScatterChart.displayName = 'ScatterChart';

export default ScatterChart;
