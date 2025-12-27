'use client';

import { Flexbox, FlexboxProps, Tooltip } from '@lobehub/ui';
import { cssVar, cx } from 'antd-style';
import { ReactNode, forwardRef } from 'react';

import { styles } from './styles';

export interface MarkerBarProps extends FlexboxProps {
  bgColors?: string;
  color?: string;
  markerTooltip?: ReactNode;
  maxValue?: number;
  minValue?: number;
  rangeColors?: string;
  rangeTooltip?: ReactNode;
  showAnimation?: boolean;
  size?: number;
  value: number;
}

const MarkerBar = forwardRef<HTMLDivElement, MarkerBarProps>((props, ref) => {
  const {
    value,
    minValue,
    maxValue,
    markerTooltip,
    rangeTooltip,
    showAnimation = false,
    color,
    bgColors,
    rangeColors,
    className,
    width = '100%',
    style,
    size = 8,
    ...rest
  } = props;
  return (
    <Flexbox
      align={'center'}
      className={className}
      height={size}
      horizontal
      ref={ref}
      style={{
        position: 'relative',
        ...style,
      }}
      width={width}
      {...rest}
    >
      <Flexbox
        height={'100%'}
        style={{
          background: bgColors || cssVar.colorFillTertiary,
          borderRadius: size / 2,
          inset: 0,
          opacity: bgColors ? 0.2 : 1,
          position: 'absolute',
          zIndex: 0,
        }}
        width={'100%'}
      />
      {minValue !== undefined && maxValue !== undefined ? (
        <Tooltip title={rangeTooltip}>
          <Flexbox
            className={cx(showAnimation && styles.showAnimation)}
            height={'100%'}
            style={{
              background: rangeColors || cssVar.colorFill,
              borderRadius: size / 2,
              inset: 0,
              left: `${minValue}%`,
              opacity: rangeColors ? 0.2 : 1,
              position: 'absolute',
              zIndex: 0,
            }}
            width={`${maxValue - minValue}%`}
          />
        </Tooltip>
      ) : null}
      <Tooltip title={markerTooltip}>
        <div
          className={cx(styles.markerWrapper, showAnimation && styles.showAnimation)}
          style={{
            left: `${value}%`,
          }}
        >
          <div
            className={styles.marker}
            style={{
              background: color || cssVar.colorPrimary,
              height: size + 8,
            }}
          />
        </div>
      </Tooltip>
    </Flexbox>
  );
});

MarkerBar.displayName = 'MarkerBar';

export default MarkerBar;
