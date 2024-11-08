'use client';

import { css, useThemeMode } from 'antd-style';
import { CSSProperties, ComponentType, MouseEvent, forwardRef, useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Pie, PieChart as ReChartsDonutChart, ResponsiveContainer, Tooltip } from 'recharts';

import type BaseAnimationTimingProps from '@/common/BaseAnimationTimingProps';
import { CustomTooltipProps } from '@/common/CustomTooltipProps';
import NoData, { type NoDataProps } from '@/common/NoData';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import type { EventProps } from '@/types';
import { ValueFormatter } from '@/types';
import { defaultValueFormatter } from '@/utils';

import { DonutChartTooltip } from './DonutChartTooltip';
import { parseLabelInput } from './inputParser';
import { renderInactiveShape } from './renderInactiveShape';
import { useStyles } from './styles';

type DonutChartVariant = 'donut' | 'pie';

export interface DonutChartProps extends BaseAnimationTimingProps {
  category?: string;
  className?: string;
  colors?: string[];
  customCategories?: {
    [key: string]: string;
  };
  customTooltip?: ComponentType<CustomTooltipProps>;
  data: any[];
  donutLabel?: string;
  index?: string;
  label?: string;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (value: EventProps) => void;
  showAnimation?: boolean;
  showLabel?: boolean;
  showTooltip?: boolean;
  style?: CSSProperties;
  valueFormatter?: ValueFormatter;
  variant?: DonutChartVariant;
}

const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>((props, ref) => {
  const { cx, theme, styles } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    category = 'value',
    index = 'name',
    colors = themeColorRange,
    variant = 'donut',
    valueFormatter = defaultValueFormatter,
    label,
    showLabel = true,
    animationDuration = 900,
    showAnimation = false,
    showTooltip = true,
    noDataText,
    onValueChange,
    customTooltip,
    className,
    width = '100%',
    height = '10rem',
    style,
    customCategories,
    donutLabel,
    ...rest
  } = props;
  const { isDarkMode } = useThemeMode();
  const CustomTooltip = customTooltip;
  const isDonut = variant === 'donut';
  const parsedLabelInput = parseLabelInput(label, valueFormatter, data, category);

  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const hasOnValueChange = !!onValueChange;

  const onShapeClick = (data: any, index: number, event: MouseEvent) => {
    event.stopPropagation();

    if (!hasOnValueChange) return;
    if (activeIndex === index) {
      setActiveIndex(undefined);
      onValueChange?.(null);
    } else {
      setActiveIndex(index);
      onValueChange?.({
        eventType: 'slice',
        ...data.payload.payload,
      });
    }
  };

  useEffect(() => {
    const pieSectors = document.querySelectorAll('.recharts-pie-sector');
    if (pieSectors) {
      for (const sector of pieSectors) {
        sector.setAttribute('style', 'outline: none');
      }
    }
  }, [activeIndex]);

  const parseData = (data: any[], colors: string[]) =>
    data.map((dataPoint: any, idx: number) => {
      const baseColor = idx < colors.length ? colors[idx] : theme.colorPrimary;
      return {
        ...dataPoint,
        className: cx(css`
          fill: ${baseColor ?? theme.colorPrimary};
        `),
        color: baseColor,
        fill: '',
      };
    });

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
          <ReChartsDonutChart
            margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
            onClick={
              hasOnValueChange && activeIndex
                ? () => {
                    setActiveIndex(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
          >
            {showLabel && isDonut ? (
              <text
                className={cx(styles.strongLabel, styles.emphasis)}
                dominantBaseline="middle"
                textAnchor="middle"
                x="50%"
                y="50%"
              >
                {donutLabel || typeof activeIndex === 'number'
                  ? valueFormatter(data?.[activeIndex as any]?.[category])
                  : parsedLabelInput}
              </text>
            ) : null}
            <Pie
              activeIndex={activeIndex}
              animationDuration={animationDuration}
              cx="50%"
              cy="50%"
              data={parseData(data, colors)}
              dataKey={category}
              endAngle={-270}
              inactiveShape={renderInactiveShape}
              innerRadius={isDonut ? '75%' : '0%'}
              isAnimationActive={showAnimation}
              nameKey={index}
              onClick={onShapeClick}
              outerRadius="100%"
              startAngle={90}
              stroke=""
              strokeLinejoin="round"
              style={{
                cursor: onValueChange ? 'pointer' : undefined,
                outline: 'none',
                stroke: theme.colorBgContainer,
              }}
            />
            {isDonut && (
              <Pie
                activeIndex={activeIndex}
                animationDuration={animationDuration}
                cx="50%"
                cy="50%"
                data={parseData(
                  [{ [category]: 1 }],
                  [isDarkMode ? 'rgba(0,0,0,.33)' : 'rgba(0,0,0,.1)'],
                )}
                dataKey={category}
                endAngle={-270}
                inactiveShape={renderInactiveShape}
                innerRadius={isDonut ? '75%' : '0%'}
                isAnimationActive={false}
                nameKey={index}
                outerRadius="80%"
                startAngle={90}
                stroke=""
                strokeLinejoin="round"
                style={{
                  outline: 'none',
                  pointerEvents: 'none',
                }}
              />
            )}
            <Tooltip
              content={
                showTooltip
                  ? ({ active, payload }) =>
                      CustomTooltip ? (
                        <CustomTooltip
                          active={active}
                          customCategories={customCategories}
                          label={payload?.[0]?.name}
                          payload={payload?.map((payloadItem) => ({
                            ...payloadItem,
                            color: payload?.[0]?.payload?.color ?? theme.colorPrimary,
                          }))}
                        />
                      ) : (
                        <DonutChartTooltip
                          active={active}
                          customCategories={customCategories}
                          payload={payload}
                          valueFormatter={valueFormatter}
                        />
                      )
                  : undefined
              }
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none' }}
            />
          </ReChartsDonutChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

DonutChart.displayName = 'DonutChart';

export default DonutChart;
