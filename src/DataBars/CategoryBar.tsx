'use client';

import { Flexbox, FlexboxProps, Tooltip } from '@lobehub/ui';
import { cssVar, cx } from 'antd-style';
import { forwardRef, memo, useMemo } from 'react';

import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { ValueFormatter } from '@/types/charts';
import { defaultValueFormatter, sumNumericArray } from '@/utils';

import { styles } from './styles';

const getMarkerBgColor = (
  markerValue: number | undefined,
  values: number[],
  colors: string[],
): string => {
  if (markerValue === undefined) return '';

  let prefixSum = 0;
  for (const [i, currentWidthPercentage] of values.entries()) {
    const currentBgColor = colors[i];

    prefixSum += currentWidthPercentage;
    if (prefixSum >= markerValue) return currentBgColor;
  }

  return '';
};

const getPositionLeft = (value: number | undefined, maxValue: number): number =>
  value ? (value / maxValue) * 100 : 0;

const BarLabels = memo<{ valueFormatter?: ValueFormatter; values: number[] }>(
  ({ values, valueFormatter }) => {
    const sumValues = useMemo(() => sumNumericArray(values), [values]);
    let prefixSum = 0;
    let sumConsecutiveHiddenLabels = 0;
    return (
      <Flexbox
        className={cx(styles.label, styles.emphasis)}
        horizontal
        style={{
          position: 'relative',
        }}
      >
        {values.slice(0, values.length).map((widthPercentage, idx) => {
          prefixSum += widthPercentage;
          const showLabel =
            (widthPercentage >= 0.1 * sumValues ||
              sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
            sumValues - prefixSum >= 0.15 * sumValues &&
            prefixSum >= 0.1 * sumValues;
          sumConsecutiveHiddenLabels = showLabel
            ? 0
            : (sumConsecutiveHiddenLabels += widthPercentage);

          const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

          if (prefixSum === sumValues) return null;

          return (
            <Flexbox
              align={'center'}
              horizontal
              justify={'flex-end'}
              key={`item-${idx}`}
              style={{ width: `${widthPositionLeft}%` }}
            >
              <span
                style={{
                  display: showLabel ? 'block' : 'hidden',
                  left: '50%',
                  transform: 'translateX(50%)',
                }}
              >
                {valueFormatter ? valueFormatter(prefixSum) : prefixSum}
              </span>
            </Flexbox>
          );
        })}
        <Flexbox align={'center'} horizontal style={{ bottom: 0, left: 0, position: 'absolute' }}>
          {valueFormatter ? valueFormatter(0) : 0}
        </Flexbox>
        <Flexbox align={'center'} horizontal style={{ bottom: 0, position: 'absolute', right: 0 }}>
          {valueFormatter ? valueFormatter(sumValues) : sumValues}
        </Flexbox>
      </Flexbox>
    );
  },
);

export interface CategoryBarProps extends FlexboxProps {
  colors?: string[];
  markerValue?: number;
  showAnimation?: boolean;
  showLabels?: boolean;
  size?: number;
  tooltip?: string;
  valueFormatter?: ValueFormatter;
  values: number[];
}

const CategoryBar = forwardRef<HTMLDivElement, CategoryBarProps>((props, ref) => {
  const themeColorRange = useThemeColorRange();
  const {
    values = [],
    colors = themeColorRange,
    valueFormatter = defaultValueFormatter,
    markerValue,
    showLabels = true,
    tooltip,
    showAnimation = false,
    className,
    width = '100%',
    size = 8,
    style,
    ...rest
  } = props;

  const colorGroup = colors.concat(themeColorRange);

  const markerBgColor = useMemo(
    () => getMarkerBgColor(markerValue, values, colorGroup),
    [markerValue, values, colorGroup],
  );

  const maxValue = useMemo(() => sumNumericArray(values), [values]);

  const markerPositionLeft: number = useMemo(
    () => getPositionLeft(markerValue, maxValue),
    [markerValue, maxValue],
  );

  return (
    <Tooltip title={tooltip}>
      <Flexbox
        className={className}
        gap={8}
        ref={ref}
        style={{
          position: 'relative',
          ...style,
        }}
        width={width}
        {...rest}
      >
        {showLabels && <BarLabels valueFormatter={valueFormatter} values={values} />}
        <Flexbox
          align={'center'}
          className={cx('relative w-full flex items-center h-2')}
          height={size}
          horizontal
          style={{
            position: 'relative',
          }}
        >
          <Flexbox
            align={'center'}
            height={'100%'}
            horizontal
            style={{
              borderRadius: size / 2,
              overflow: 'hidden',
            }}
            width={'100%'}
          >
            {values.map((value, idx) => {
              const baseColor = colorGroup[idx] ?? cssVar.colorPrimary;
              const percentage = (value / maxValue) * 100;
              return (
                <Flexbox
                  height={'100%'}
                  key={`item-${idx}`}
                  style={{ background: baseColor, width: `${percentage}%` }}
                />
              );
            })}
          </Flexbox>
          {markerValue === undefined ? undefined : (
            <div
              className={cx(styles.markerWrapper, showAnimation && styles.showAnimation)}
              style={{
                left: `${markerPositionLeft}%`,
              }}
            >
              <div
                className={styles.marker}
                style={{
                  background: markerBgColor || cssVar.colorPrimary,
                  height: size + 8,
                }}
              />
            </div>
          )}
        </Flexbox>
      </Flexbox>
    </Tooltip>
  );
});

CategoryBar.displayName = 'CategoryBar';

export default CategoryBar;
