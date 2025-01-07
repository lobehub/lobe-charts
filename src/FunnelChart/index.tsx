'use client';

import { useSize } from 'ahooks';
import { Skeleton } from 'antd';
import { css } from 'antd-style';
import {
  Fragment,
  MouseEvent,
  Touch,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Flexbox } from 'react-layout-kit';

import ArrowRightIcon from '@/FunnelChart/ArrowRightIcon';
import BaseChartProps from '@/common/BaseChartProps';
import ChartTooltip from '@/common/ChartTooltip';
import NoData from '@/common/NoData';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { defaultValueFormatter } from '@/utils';
import { getMaxLabelLength } from '@/utils/getMaxLabelLength';

import { useStyles } from './styles';

type FormattedDataT = DataT & {
  barHeight: number;
  nextBarHeight: number;
  nextNormalizedValue: number;
  nextStartX: number;
  nextValue: number;
  normalizedValue: number;
  startX: number;
  startY: number;
};

type CalculateFrom = 'first' | 'previous';

type Tooltip = {
  data?: {
    className?: string;
    color?: string;
    dataKey: string;
    fill?: string;
    name: string;
    payload?: any;
    value: number;
  };
  index?: number;
  x: number;
  y: number;
};

type DataT = {
  name: string;
  value: number;
};

const GLOBAL_PADDING = 10;
const HALF_PADDING = GLOBAL_PADDING / 2;
const Y_AXIS_LABELS = ['100%', '75%', '50%', '25%', '0%'];

const validateData = (data: DataT[], calculatedFrom?: CalculateFrom): string | null => {
  if (data && data.length > 0) {
    if (calculatedFrom === 'previous' && data[0].value <= 0) {
      return `The value of the first item "${data[0].name}" is not greater than 0. This is not allowed when setting the "calculateFrom" prop to "previous". Please enter a value greater than 0.`;
    }

    for (const item of data) {
      if (item.value < 0) {
        return `Item "${item.name}" has a negative value: ${item.value}. This is not allowed. The value must be greater than or equal to 0.`;
      }
    }
  }
  return null;
};

export interface FunnelChartProps extends Omit<BaseChartProps, 'categories' | 'index'> {
  barGap?: number | `${number}%`;
  calculateFrom?: CalculateFrom;
  data: DataT[];
  evolutionGradient?: boolean;
  gradient?: boolean;
  showArrow?: boolean;
  variant?: 'base' | 'center';
  yAxisPadding?: number;
}

const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>((props, ref) => {
  const { cx, theme, styles } = useStyles();
  const themeColorRange = useThemeColorRange();

  const {
    data = [],
    evolutionGradient = true,
    gradient = false,
    valueFormatter = defaultValueFormatter,
    calculateFrom = 'first',
    color = themeColorRange[0],
    variant = 'base',
    showGridLines = true,
    showYAxis = calculateFrom === 'previous' ? false : true,
    showXAxis = true,
    showArrow = true,
    xAxisLabel = '',
    yAxisLabel = '',
    yAxisAlign = 'left',
    showTooltip = true,
    onValueChange,
    customTooltip,
    noDataText,
    rotateLabelX,
    barGap = '20%',
    loading,
    width = '100%',
    height = 280,
    className,
    style,
    yAxisWidth,
    ...rest
  } = props;

  const svgRef = useRef<HTMLDivElement>(ref as any);
  const size = useSize(svgRef);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [tooltip, setTooltip] = useState<Tooltip>({ x: 0, y: 0 });
  const [activeBar, setActiveBar] = useState<any | undefined>();

  const DEFAULT_X_AXIS_HEIGHT = showXAxis && xAxisLabel ? 25 : 15;

  const CustomTooltip = customTooltip;

  const calculatedYAxisWidth: number | string = useMemo(() => {
    if (yAxisWidth) return yAxisWidth;
    return getMaxLabelLength({ data, index: 'value', valueFormatter }) / 4 + (yAxisLabel ? 24 : 0);
  }, [yAxisWidth, data, valueFormatter, yAxisLabel]);

  useEffect(() => {
    const handleResize = () => {
      setSvgWidth(size?.width || 0);
      setSvgHeight(size?.height || 0);
    };
    handleResize();
  }, [size]);

  useEffect(() => {
    const handleTooltipOverflows = () => {
      if (tooltipRef.current) {
        const boundingBox = tooltipRef.current.getBoundingClientRect();
        if (boundingBox.right > window.innerWidth) {
          tooltipRef.current.style.left = `${svgWidth - boundingBox.width}px`;
        }
      }
    };

    handleTooltipOverflows();
    window.addEventListener('resize', handleTooltipOverflows);
    return () => window.removeEventListener('resize', handleTooltipOverflows);
  }, [tooltip, svgWidth]);

  const maxValue = useMemo(() => Math.max(...data.map((item) => item.value)), [data]);

  const widthWithoutPadding = svgWidth - GLOBAL_PADDING - calculatedYAxisWidth;
  const gap = useMemo(() => {
    if (typeof barGap === 'number') {
      return barGap;
    } else if (typeof barGap === 'string' && barGap.endsWith('%')) {
      const percentage = Number.parseFloat(barGap.slice(0, -1));
      const totalWidthForGaps = (widthWithoutPadding * percentage) / 100;
      const numberOfGaps = data.length - 1;
      return totalWidthForGaps / numberOfGaps;
    } else {
      console.error(
        'Invalid barGap value. It must be a number or a percentage string (e.g., "10%").',
      );
      return 30;
    }
  }, [widthWithoutPadding, data.length, barGap]);

  const barWidth = useMemo(
    () => (widthWithoutPadding - (data.length - 1) * gap - gap) / data.length,
    [widthWithoutPadding, gap, data.length],
  );

  const realHeight =
    svgHeight -
    GLOBAL_PADDING -
    (showXAxis
      ? (rotateLabelX?.xAxisHeight || DEFAULT_X_AXIS_HEIGHT) + (showXAxis && xAxisLabel ? 30 : 10)
      : 0);

  const isPreviousCalculation = calculateFrom === 'previous';
  const isVariantCenter = variant === 'center';

  const formattedData = useMemo(() => {
    if (realHeight <= 0) return [];
    return data.reduce((acc: FormattedDataT[], item, index) => {
      const prev = acc[index - 1];
      const value = item.value;
      const valueToCompareWith = isPreviousCalculation ? (prev?.value ?? maxValue) : maxValue;
      const calculationHeight = isPreviousCalculation
        ? (prev?.barHeight ?? realHeight)
        : realHeight;

      const normalizedValue = value / valueToCompareWith;
      const barHeight = normalizedValue * calculationHeight;
      const startX = index * (barWidth + gap) + 0.5 * gap;
      const startY =
        calculationHeight -
        barHeight +
        (isPreviousCalculation ? realHeight - (prev?.barHeight ?? realHeight) : 0);
      const nextValue = data[index + 1]?.value;
      const nextNormalizedValue = nextValue / valueToCompareWith;
      const nextBarHeight = nextNormalizedValue * calculationHeight;
      const nextStartX = (index + 1) * (barWidth + gap) + 0.5 * gap;

      acc.push({
        barHeight,
        name: item.name,
        nextBarHeight,
        nextNormalizedValue,
        nextStartX,
        nextValue,
        normalizedValue,
        startX,
        startY,
        value,
      });

      return acc;
    }, []);
  }, [data, realHeight, isPreviousCalculation, barWidth, gap, maxValue]);

  const handleTooltip = (touch: Touch) => {
    const chartBoundingRect = svgRef.current?.getBoundingClientRect();
    if (!chartBoundingRect) return;
    const chartX = chartBoundingRect.x;

    if (formattedData.length === 0) {
      return setTooltip({ x: 0, y: 0 });
    }

    const pageX = touch.pageX - chartX - barWidth / 2 - calculatedYAxisWidth - HALF_PADDING;
    const closestBar = formattedData.reduce((acc, current) => {
      const currentDistance = Math.abs(current.startX - pageX);
      const accDistance = Math.abs(acc.startX - pageX);
      return currentDistance < accDistance ? current : acc;
    }, formattedData[0]); // 提供初始值

    const closestBarIndex = formattedData.indexOf(closestBar);

    setTooltip({
      data: {
        className: cx(css`
          cursor: ${onValueChange ? 'pointer' : undefined};
          color: ${color ?? theme.colorPrimary};
        `),
        color: color ?? theme.colorPrimary,
        dataKey: closestBar.name,
        fill: '',
        name: closestBar.name,
        payload: closestBar,
        value: closestBar.value,
      },
      index: closestBarIndex,
      x: closestBar.startX,
      y: closestBar.startY,
    });
  };

  if (loading || !data) return <Skeleton.Button active block style={{ height, width }} />;

  const errorMessage = data ? validateData(data, calculateFrom) : null;

  if (errorMessage) {
    return <NoData noDataText={errorMessage} />;
  }

  const onBarClick = (data: any, idx: number, event: MouseEvent) => {
    event.stopPropagation();
    if (!onValueChange) return;
    if (idx === activeBar?.index) {
      setActiveBar(undefined);
      onValueChange?.(null);
    } else {
      setActiveBar({ data, index: idx });
      onValueChange?.({
        categoryClicked: data.name,
        eventType: 'bar',
        ...data,
      });
    }
  };

  return (
    <Flexbox
      className={className}
      height={height}
      ref={svgRef}
      style={{ position: 'relative', ...style }}
      width={width}
      {...rest}
    >
      {data?.length ? (
        <>
          <svg
            onMouseLeave={() => setTooltip({ x: 0, y: 0 })}
            onMouseMove={(e) => {
              const fakeTouch = {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
              } as Touch;
              handleTooltip(fakeTouch);
            }}
            onTouchEnd={() => setTooltip({ x: 0, y: 0 })}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              handleTooltip(touch);
            }}
            style={{
              height: '100%',
              width: '100%',
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Y axis labels and lines */}
            {Y_AXIS_LABELS.map((label, index) => (
              <Fragment key={`y-axis-${index}`}>
                {showGridLines && (
                  <line
                    className={styles.gridLines}
                    x1={calculatedYAxisWidth + HALF_PADDING}
                    x2={svgWidth - HALF_PADDING}
                    y1={(index * realHeight) / 4 + HALF_PADDING}
                    y2={(index * realHeight) / 4 + HALF_PADDING}
                  />
                )}
                <text
                  className={styles.label}
                  textAnchor={yAxisAlign === 'left' ? 'start' : 'end'}
                  x={
                    yAxisAlign === 'left'
                      ? yAxisLabel
                        ? 24
                        : 0
                      : calculatedYAxisWidth - 10 + HALF_PADDING
                  }
                  y={(index * realHeight) / 4 + 5 + HALF_PADDING}
                >
                  {label}
                </text>
              </Fragment>
            ))}
            {/* Bars and labels */}
            {formattedData.map((item, index) => (
              <g key={`bar-${index}`}>
                {/* Hover gray rect */}
                <rect
                  height={realHeight}
                  style={{
                    fill: tooltip.index === index ? theme.colorFillTertiary : 'transparent',
                    zIndex: 0,
                  }}
                  width={barWidth + gap}
                  x={item.startX - gap * 0.5 + HALF_PADDING + calculatedYAxisWidth}
                  y={HALF_PADDING}
                />
                {/* Gradient bar */}
                {gradient && (
                  <rect
                    fill={`url(#base-gradient)`}
                    height={
                      (realHeight -
                        item.barHeight -
                        (isPreviousCalculation
                          ? realHeight - formattedData[index - 1]?.barHeight || 0
                          : 0)) /
                      (isVariantCenter ? 2 : 1)
                    }
                    style={{
                      opacity: activeBar && activeBar.index !== index ? 0.3 : 1,
                    }}
                    width={barWidth}
                    x={item.startX + HALF_PADDING + calculatedYAxisWidth}
                    y={
                      realHeight -
                      (isPreviousCalculation
                        ? formattedData[index - 1]?.barHeight || realHeight
                        : realHeight) +
                      HALF_PADDING
                    }
                  />
                )}
                {/* Main bar */}
                <rect
                  height={item.barHeight}
                  onClick={(e) => onBarClick(item, index, e)}
                  style={{
                    cursor: onValueChange ? 'pointer' : undefined,
                    fill: color ?? theme.colorPrimary,
                    opacity: activeBar && activeBar.index !== index ? 0.3 : 1,
                  }}
                  width={barWidth}
                  x={item.startX + HALF_PADDING + calculatedYAxisWidth}
                  y={
                    (isVariantCenter ? realHeight / 2 - item.barHeight / 2 : item.startY) +
                    HALF_PADDING
                  }
                />
                {/* Bottom gradient bar */}
                {gradient && isVariantCenter && (
                  <rect
                    fill={`url(#base-gradient-revert)`}
                    height={(realHeight - item.barHeight) / 2}
                    style={{
                      opacity: activeBar && activeBar.index !== index ? 0.3 : 1,
                    }}
                    width={barWidth}
                    x={item.startX + HALF_PADDING + calculatedYAxisWidth}
                    y={realHeight / 2 + item.barHeight / 2 + HALF_PADDING}
                  />
                )}
                {/* X axis label */}
                {showXAxis && (
                  <foreignObject
                    height={rotateLabelX?.xAxisHeight || DEFAULT_X_AXIS_HEIGHT}
                    transform={
                      rotateLabelX
                        ? `rotate(${rotateLabelX?.angle}, ${
                            item.startX + barWidth / 2 + HALF_PADDING + calculatedYAxisWidth
                          }, ${
                            realHeight +
                            (rotateLabelX?.xAxisHeight || DEFAULT_X_AXIS_HEIGHT) / 2 +
                            HALF_PADDING +
                            (rotateLabelX?.verticalShift || 0)
                          })`
                        : undefined
                    }
                    width={barWidth}
                    x={item.startX + HALF_PADDING + calculatedYAxisWidth}
                    y={realHeight + HALF_PADDING + 10}
                  >
                    <div className={cx(styles.strongLabel, styles.emphasis)} title={item.name}>
                      {item.name}
                    </div>
                  </foreignObject>
                )}
              </g>
            ))}
            {/* Gradient polygons between bars */}
            {formattedData.map((item, index) => (
              <Fragment key={`gradient-${index}`}>
                {index < data.length - 1 &&
                  evolutionGradient &&
                  (isVariantCenter ? (
                    <>
                      <polygon
                        fill={`url(#base-gradient)`}
                        points={`
                            ${item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 + item.nextBarHeight / 4 + HALF_PADDING
                            }
                            ${item.nextStartX + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 + item.nextBarHeight / 4 + HALF_PADDING
                            }
                            ${item.nextStartX + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 - item.nextBarHeight / 2 + HALF_PADDING
                            }
                            ${item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 - item.barHeight / 2 + HALF_PADDING
                            }
                          `}
                        style={{
                          opacity: activeBar && activeBar.index !== index ? 0.3 : 1,
                          zIndex: 10,
                        }}
                      />
                      <polygon
                        fill={`url(#base-gradient-revert)`}
                        points={`
                            ${item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 + item.barHeight / 2 + HALF_PADDING
                            }
                            ${item.nextStartX + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 + item.nextBarHeight / 2 + HALF_PADDING
                            }
                            ${item.nextStartX + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 - item.nextBarHeight / 4 + HALF_PADDING
                            }
                            ${item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth}, ${
                              realHeight / 2 - item.nextBarHeight / 4 + HALF_PADDING
                            }
                          `}
                        style={{
                          opacity: activeBar && activeBar.index !== index ? 0.3 : 1,
                          zIndex: 10,
                        }}
                      />
                    </>
                  ) : (
                    <polygon
                      fill={`url(#base-gradient)`}
                      points={`
                          ${item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth}, ${
                            item.startY + HALF_PADDING
                          }
                          ${item.nextStartX + HALF_PADDING + calculatedYAxisWidth}, ${
                            realHeight - item.nextBarHeight + HALF_PADDING
                          }
                          ${item.nextStartX + HALF_PADDING + calculatedYAxisWidth}, ${
                            realHeight + HALF_PADDING
                          }
                          ${item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth}, ${
                            realHeight + HALF_PADDING
                          }
                        `}
                      style={{
                        opacity: activeBar && activeBar.index !== index ? 0.3 : 1,
                        zIndex: 10,
                      }}
                    />
                  ))}
                {/* Arrow between labels */}
                {index < data.length - 1 && showXAxis && showArrow && gap >= 14 && (
                  <foreignObject
                    height={rotateLabelX?.xAxisHeight || DEFAULT_X_AXIS_HEIGHT}
                    width={12}
                    x={item.startX + barWidth + HALF_PADDING + calculatedYAxisWidth - 6 + gap / 2}
                    y={realHeight + HALF_PADDING + 11}
                  >
                    <ArrowRightIcon />
                  </foreignObject>
                )}
              </Fragment>
            ))}
            {/* Gradients */}
            <linearGradient
              className={cx(css`
                stop {
                  stop-color: ${color ?? theme.colorPrimary};
                }
              `)}
              id={'base-gradient'}
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop offset="5%" stopOpacity={0.4} />
              <stop offset="95%" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              className={cx(css`
                stop {
                  stop-color: ${color ?? theme.colorPrimary};
                }
              `)}
              id={'base-gradient-revert'}
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop offset="5%" stopOpacity={0} />
              <stop offset="95%" stopOpacity={0.4} />
            </linearGradient>
            {/* X and Y axis labels */}
            {showXAxis && xAxisLabel && (
              <text
                className={cx(styles.strongLabel, styles.emphasis)}
                x={svgWidth / 2 + calculatedYAxisWidth / 2}
                y={realHeight + HALF_PADDING + 50}
              >
                {xAxisLabel}
              </text>
            )}
            {showYAxis && yAxisLabel && (
              <text
                className={cx(styles.strongLabel, styles.emphasis)}
                transform={`rotate(-90, 0, ${realHeight / 2})`}
                x={-5}
                y={realHeight / 2 + 10}
              >
                {yAxisLabel}
              </text>
            )}
          </svg>
          {/* Tooltip */}
          {showTooltip && (
            <div
              ref={tooltipRef}
              style={{
                display: tooltip.data ? 'block' : 'none',
                left: tooltip.x + barWidth * 0.66,
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
              }}
              tabIndex={-1}
            >
              {CustomTooltip ? (
                <CustomTooltip
                  active={!!tooltip.data}
                  label={tooltip.data?.name}
                  payload={tooltip.data ? [tooltip.data] : []}
                  valueFormatter={valueFormatter}
                />
              ) : (
                <ChartTooltip
                  active={!!tooltip.data}
                  categoryColors={new Map([[tooltip.data?.name ?? '', tooltip.data?.color ?? '']])}
                  label={tooltip.data?.name || ''}
                  payload={tooltip.data ? [tooltip.data] : []}
                  valueFormatter={valueFormatter}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <NoData noDataText={noDataText} />
      )}
    </Flexbox>
  );
});

FunnelChart.displayName = 'FunnelChart';

export default FunnelChart;
