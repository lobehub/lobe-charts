'use client';

import { Flexbox, FlexboxProps, Tooltip } from '@lobehub/ui';
import { ReactNode, forwardRef } from 'react';

import { useStyles } from './styles';

export interface ProgressBarProps extends FlexboxProps {
  bgColors?: string;
  color?: string;
  showAnimation?: boolean;
  size?: number;
  tooltip?: ReactNode;
  value: number;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>((props, ref) => {
  const { cx, styles, theme } = useStyles();
  const {
    value,
    color,
    bgColors,
    tooltip,
    showAnimation = false,
    className,
    width = '100%',
    size = 8,
    style,
    ...rest
  } = props;

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
          className={cx(showAnimation && styles.showAnimation)}
          height={'100%'}
          style={{
            background: color || theme.colorPrimary,
            borderRadius: size / 2,
            zIndex: 1,
          }}
          width={`${value}%`}
        />
      </Flexbox>
    </Tooltip>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
