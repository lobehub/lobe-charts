'use client';

import type { FlexboxProps } from '@lobehub/ui';
import { cssVar, cx, Flexbox, Tooltip } from '@lobehub/ui';
import type { ReactNode } from 'react';

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

const MarkerBar = ({ ref, ...props }: MarkerBarProps & { ref?: React.Ref<HTMLDivElement> }) => {
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
      horizontal
      align={'center'}
      className={className}
      height={size}
      ref={ref}
      width={width}
      style={{
        position: 'relative',
        ...style,
      }}
      {...rest}
    >
      <Flexbox
        height={'100%'}
        width={'100%'}
        style={{
          background: bgColors || cssVar.colorFillTertiary,
          borderRadius: size / 2,
          inset: 0,
          opacity: bgColors ? 0.2 : 1,
          position: 'absolute',
          zIndex: 0,
        }}
      />
      {minValue !== undefined && maxValue !== undefined ? (
        <Tooltip title={rangeTooltip}>
          <Flexbox
            className={cx(showAnimation && styles.showAnimation)}
            height={'100%'}
            width={`${maxValue - minValue}%`}
            style={{
              background: rangeColors || cssVar.colorFill,
              borderRadius: size / 2,
              inset: 0,
              left: `${minValue}%`,
              opacity: rangeColors ? 0.2 : 1,
              position: 'absolute',
              zIndex: 0,
            }}
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
};

MarkerBar.displayName = 'MarkerBar';

export default MarkerBar;
