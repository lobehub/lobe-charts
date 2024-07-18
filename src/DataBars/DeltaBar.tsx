'use client';

import { Tooltip } from '@lobehub/ui';
import { ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { DeltaTypes } from '@/types';
import { mapInputsToDeltaType } from '@/utils';

import { useStyles } from './styles';

const getDeltaType = (value: number) => (value >= 0 ? DeltaTypes.Increase : DeltaTypes.Decrease);

export interface DeltaBarProps extends FlexboxProps {
  bgColors?: string;
  color?: string;
  isIncreasePositive?: boolean;
  showAnimation?: boolean;
  size?: number;
  tooltip?: ReactNode;
  value: number;
}

const DeltaBar = forwardRef<HTMLDivElement, DeltaBarProps>((props, ref) => {
  const { cx, styles, theme } = useStyles();
  const {
    value,
    bgColors,
    color,
    isIncreasePositive = true,
    showAnimation = false,
    className,
    tooltip,
    width = '100%',
    size = 8,
    style,
    ...rest
  } = props;
  const deltaType = mapInputsToDeltaType(getDeltaType(value), isIncreasePositive);

  const colors = {
    [DeltaTypes.Increase]: theme.colorSuccess,
    [DeltaTypes.ModerateIncrease]: theme.colorSuccess,
    [DeltaTypes.Decrease]: theme.colorError,
    [DeltaTypes.ModerateDecrease]: theme.colorError,
    [DeltaTypes.Unchanged]: theme.colorWarning,
  };

  return (
    <Tooltip title={tooltip}>
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
            background: bgColors || theme.colorFillTertiary,
            borderRadius: size / 2,
            inset: 0,
            opacity: bgColors ? 0.2 : 1,
            position: 'absolute',
            zIndex: 0,
          }}
          width={'100%'}
        />
        <Flexbox
          align={'center'}
          flex={1}
          height={'100%'}
          horizontal
          justify={'flex-end'}
          style={{ position: 'relative' }}
        >
          {value < 0 ? (
            <div
              className={cx(showAnimation && styles.showAnimation)}
              style={{
                background: colors[deltaType],
                borderBottomLeftRadius: size / 2,
                borderTopLeftRadius: size / 2,
                height: '100%',
                width: `${Math.abs(value)}%`,
              }}
            />
          ) : undefined}
        </Flexbox>
        <Flexbox
          className={styles.marker}
          flex={'none'}
          style={{
            background: color || theme.colorPrimary,
            height: size + 8,
            zIndex: 2,
          }}
        />
        <Flexbox
          align={'center'}
          flex={1}
          height={'100%'}
          horizontal
          justify={'flex-start'}
          style={{ position: 'relative' }}
        >
          {value >= 0 ? (
            <div
              className={cx(showAnimation && styles.showAnimation)}
              style={{
                background: colors[deltaType],
                borderBottomRightRadius: size / 2,
                borderTopRightRadius: size / 2,
                height: '100%',
                width: `${Math.abs(value)}%`,
              }}
            />
          ) : undefined}
        </Flexbox>
      </Flexbox>
    </Tooltip>
  );
});

DeltaBar.displayName = 'DeltaBar';

export default DeltaBar;
