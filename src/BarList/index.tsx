'use client';

import { Flexbox } from '@lobehub/ui';
import A from '@lobehub/ui/es/A';
import { Skeleton } from 'antd';
import React, { HTMLAttributes, ReactNode, forwardRef, useMemo } from 'react';

import NoData, { NoDataProps } from '@/common/NoData';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { ValueFormatter } from '@/types/charts';
import { defaultValueFormatter } from '@/utils';

import { useStyles } from './styles';

export interface Bar {
  [key: string]: any;
  color?: string;
  href?: string;
  icon?: ReactNode;
  key?: string;
  name: ReactNode;
  target?: string;
  value: number;
}

export interface BarListProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  data: Bar[];
  height?: string | number;
  leftLabel?: ReactNode;
  loading?: boolean;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (payload: Bar) => void;
  rightLabel?: ReactNode;
  showAnimation?: boolean;
  sortOrder?: 'ascending' | 'descending' | 'none';
  valueFormatter?: ValueFormatter;
  width?: string | number;
}

const BarList = forwardRef<HTMLDivElement, BarListProps>((props, ref) => {
  const { cx, styles, prefixCls } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    color = themeColorRange[0],
    valueFormatter = defaultValueFormatter,
    showAnimation = false,
    onValueChange,
    sortOrder = 'descending',
    className,
    leftLabel,
    rightLabel,
    style,
    loading,
    width = '100%',
    height,
    noDataText,
    ...rest
  } = props;

  const sortedData = useMemo(() => {
    if (sortOrder === 'none') {
      return data;
    }
    return [...data].sort((a, b) => {
      return sortOrder === 'ascending' ? a.value - b.value : b.value - a.value;
    });
  }, [data, sortOrder]);

  const widths = useMemo(() => {
    const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
    return sortedData.map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2),
    );
  }, [sortedData]);

  if (loading || !data) return <Skeleton.Button active block style={{ height, width }} />;

  const rowHeight = 32;
  const labelHeight = 20;

  return (
    <Flexbox
      aria-sort={sortOrder}
      className={className}
      gap={24}
      horizontal
      justify={'space-between'}
      ref={ref}
      style={{ minHeight: height, position: 'relative', ...style }}
      width={width}
      {...rest}
    >
      <Flexbox flex={1} gap={8} style={{ overflow: 'hidden', position: 'relative' }}>
        {(leftLabel || rightLabel) && (
          <Flexbox className={cx(styles.label, styles.emphasis)} height={labelHeight} width="100%">
            {leftLabel}
          </Flexbox>
        )}
        {sortedData.map((item, index) => {
          return (
            <Flexbox
              align={'center'}
              className={cx(styles.barContainer, onValueChange && styles.barHover)}
              height={rowHeight}
              horizontal
              key={item.key ?? index}
              onClick={() => {
                onValueChange?.(item);
              }}
              style={{
                cursor: onValueChange ? 'pointer' : 'default',
              }}
              width={'100%'}
            >
              <div
                className={cx(`${prefixCls}-chart-bar-item`, styles.bar)}
                style={{
                  background: item.color ?? color,
                  transition: showAnimation ? undefined : 'none',
                  width: `${widths[index]}%`,
                  zIndex: 0,
                }}
              />
              <Flexbox
                align={'center'}
                gap={8}
                horizontal
                paddingInline={8}
                style={{ overflow: 'hidden', position: 'relative', width: '100%', zIndex: 1 }}
              >
                {item.icon}
                {item.href ? (
                  <A
                    className={cx(styles.sourceALabel, styles.emphasis)}
                    href={item.href}
                    onClick={(event) => event.stopPropagation()}
                    target={item.target}
                  >
                    {item.name}
                  </A>
                ) : (
                  <div className={cx(styles.sourceLabel, styles.emphasis)}>{item.name}</div>
                )}
              </Flexbox>
            </Flexbox>
          );
        })}
        {!data?.length && <NoData noDataText={noDataText} />}
      </Flexbox>
      <Flexbox gap={8}>
        {(leftLabel || rightLabel) && (
          <Flexbox
            className={cx(styles.label, styles.emphasis)}
            height={labelHeight}
            style={{ textAlign: 'right' }}
            width="100%"
          >
            {rightLabel}
          </Flexbox>
        )}
        {sortedData.map((item, index) => (
          <Flexbox
            align={'center'}
            height={rowHeight}
            horizontal
            justify={'flex-end'}
            key={item.key ?? index}
          >
            <div className={cx(styles.strongLabel, styles.emphasis)}>
              {valueFormatter(item.value)}
            </div>
          </Flexbox>
        ))}
      </Flexbox>
    </Flexbox>
  );
});

BarList.displayName = 'BarList';

export default BarList;
