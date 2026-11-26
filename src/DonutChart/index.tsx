'use client';

import { css, cssVar, cx, Flexbox, Skeleton, useThemeMode } from '@lobehub/ui';
import type { ComponentType, CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import { useEffect, useState } from 'react';
import { Pie, PieChart as ReChartsDonutChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { ChartNumberFormat } from '@/common/a2ui';
import type BaseAnimationTimingProps from '@/common/BaseAnimationTimingProps';
import type { CustomTooltipProps } from '@/common/CustomTooltipProps';
import NoData, { type NoDataProps } from '@/common/NoData';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import type { EventProps, ValueFormatter } from '@/types/charts';
import { defaultValueFormatter, isOnSeverSide } from '@/utils';

import A2uiDonutChart from './A2uiDonutChart';
import { DonutChartTooltip } from './DonutChartTooltip';
import { parseLabelInput } from './inputParser';
import { renderInactiveShape } from './renderInactiveShape';
import { styles } from './styles';

/** `a2ui` draws the A2UI look: a framed donut (or pie, with `donut={false}`) beside a value list. */
type DonutChartVariant = 'donut' | 'pie' | 'a2ui';

export interface DonutChartProps extends BaseAnimationTimingProps {
  category?: string;
  /**
   * Caption under the centre total (a2ui only).
   * @default 'Total'
   */
  centerLabel?: string;
  className?: string;
  colors?: string[];
  /**
   * ISO 4217 code used when `format` is `currency` (a2ui only).
   * @default 'USD'
   */
  currency?: string;
  customCategories?: {
    [key: string]: string;
  };
  customTooltip?: ComponentType<CustomTooltipProps>;
  data: any[];
  /**
   * Draw a ring with the total in the centre; `false` draws a pie (a2ui only).
   * @default true
   */
  donut?: boolean;
  donutLabel?: string;
  /** How values read in the a2ui look. `percent` expects 0-100. */
  format?: ChartNumberFormat;
  index?: string;
  label?: string;
  loading?: boolean;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (value: EventProps) => void;
  showAnimation?: boolean;
  showLabel?: boolean;
  showTooltip?: boolean;
  /**
   * Diameter of the donut in px (a2ui only).
   * @default 200
   */
  size?: number;
  style?: CSSProperties;
  /** Secondary line under the title (a2ui only). */
  subtitle?: string;
  /** Card title (a2ui only). */
  title?: string;
  /** Unit appended to values (a2ui only). */
  unit?: string;
  valueFormatter?: ValueFormatter;
  variant?: DonutChartVariant;
}

const DefaultDonutChart = ({
  ref,
  ...props
}: DonutChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
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
    loading,
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

  useEffect(() => {
    if (isOnSeverSide) return;
    const pieSectors = document.querySelectorAll('.recharts-pie-sector');
    if (pieSectors) {
      for (const sector of pieSectors) {
        sector.setAttribute('style', 'outline: none');
      }
    }
  }, [activeIndex]);

  if (loading || !data) return <Skeleton height={height} width={width} />;

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

  const parseData = (data: any[], colors: string[]) =>
    data.map((dataPoint: any, idx: number) => {
      const baseColor = idx < colors.length ? colors[idx] : cssVar.colorPrimary;
      return {
        ...dataPoint,
        className: cx(css`
          fill: ${baseColor ?? cssVar.colorPrimary};
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
                {donutLabel ||
                  (typeof activeIndex === 'number'
                    ? valueFormatter(data?.[activeIndex as any]?.[category])
                    : parsedLabelInput)}
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
              outerRadius="100%"
              startAngle={90}
              stroke=""
              strokeLinejoin="round"
              style={{
                cursor: onValueChange ? 'pointer' : undefined,
                outline: 'none',
                stroke: cssVar.colorBgContainer,
              }}
              onClick={onShapeClick}
            />
            {isDonut && (
              <Pie
                activeIndex={activeIndex}
                animationDuration={animationDuration}
                cx="50%"
                cy="50%"
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
                data={parseData(
                  [{ [category]: 1 }],
                  [
                    isDarkMode
                      ? 'color-mix(in srgb, #000000 33%, transparent)'
                      : 'color-mix(in srgb, #000000 10%, transparent)',
                  ],
                )}
                style={{
                  outline: 'none',
                  pointerEvents: 'none',
                }}
              />
            )}
            <Tooltip
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none' }}
              content={
                showTooltip
                  ? ({ active, payload }) =>
                      CustomTooltip ? (
                        <CustomTooltip
                          active={active}
                          customCategories={customCategories}
                          label={payload?.[0]?.name}
                          valueFormatter={valueFormatter}
                          payload={payload?.map((payloadItem) => ({
                            ...payloadItem,
                            color: payload?.[0]?.payload?.color ?? cssVar.colorPrimary,
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
            />
          </ReChartsDonutChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
};

const DonutChart = ({
  centerLabel = 'Total',
  currency = 'USD',
  donut = true,
  format,
  size = 200,
  subtitle,
  title,
  unit,
  ref,
  ...props
}: DonutChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
  if (props.variant !== 'a2ui') return <DefaultDonutChart ref={ref} {...props} />;
  return (
    <A2uiDonutChart
      category={props.category ?? 'value'}
      centerLabel={centerLabel}
      className={props.className}
      colors={props.colors}
      currency={currency}
      customCategories={props.customCategories}
      data={props.data}
      donut={donut}
      format={format}
      index={props.index ?? 'name'}
      label={props.label}
      loading={props.loading}
      noDataText={props.noDataText as ReactNode}
      ref={ref as Ref<HTMLElement>}
      showAnimation={props.showAnimation}
      showLabel={props.showLabel}
      showTooltip={props.showTooltip}
      size={size}
      style={props.style}
      subtitle={subtitle}
      title={title}
      unit={unit}
      valueFormatter={props.valueFormatter}
      onValueChange={props.onValueChange}
    />
  );
};

DonutChart.displayName = 'DonutChart';

export default DonutChart;
