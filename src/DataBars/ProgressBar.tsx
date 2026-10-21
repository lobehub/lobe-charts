'use client';

import type { FlexboxProps } from '@lobehub/ui';
import { cssVar, cx, Flexbox, Tooltip } from '@lobehub/ui';
import type { ReactNode } from 'react';

import { styles } from './styles';

export interface ProgressBarProps extends FlexboxProps {
  bgColors?: string;
  color?: string;
  showAnimation?: boolean;
  size?: number;
  tooltip?: ReactNode;
  value: number;
}

const ProgressBar = ({ ref, ...props }: ProgressBarProps & { ref?: React.Ref<HTMLDivElement> }) => {
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
        <Flexbox
          className={cx(showAnimation && styles.showAnimation)}
          height={'100%'}
          width={`${value}%`}
          style={{
            background: color || cssVar.colorPrimary,
            borderRadius: size / 2,
            zIndex: 1,
          }}
        />
      </Flexbox>
    </Tooltip>
  );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
