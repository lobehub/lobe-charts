'use client';

import { Flexbox, FlexboxProps, Tooltip } from '@lobehub/ui';
import { createStaticStyles, cssVar } from 'antd-style';
import { ReactNode, forwardRef, useMemo } from 'react';

const styles = createStaticStyles(({ css }) => ({
  block: css`
    background: ${cssVar.colorFill};

    &:first-child {
      border-top-left-radius: ${cssVar.borderRadiusSM};
      border-bottom-left-radius: ${cssVar.borderRadiusSM};
    }

    &:last-child {
      border-top-right-radius: ${cssVar.borderRadiusSM};
      border-bottom-right-radius: ${cssVar.borderRadiusSM};
    }

    &:hover {
      opacity: 0.5;
    }
  `,
}));

export interface TrackerBlockProps {
  color?: 'success' | 'warning' | 'error' | string;
  key?: string | number;
  tooltip?: ReactNode;
}

const TrackerBlock = forwardRef<HTMLDivElement, TrackerBlockProps & FlexboxProps>(
  ({ color, tooltip, width, style, ...rest }, ref) => {
    const blockColor = useMemo(() => {
      switch (color) {
        case 'success': {
          return cssVar.colorSuccess;
        }
        case 'warning': {
          return cssVar.colorWarning;
        }
        case 'error': {
          return cssVar.colorError;
        }
        default: {
          return color;
        }
      }
    }, [color]);

    return (
      <Tooltip title={tooltip}>
        <Flexbox
          className={styles.block}
          height={'100%'}
          ref={ref}
          style={{ background: blockColor, ...style }}
          width={width || '100%'}
          {...rest}
        />
      </Tooltip>
    );
  },
);

export default TrackerBlock;
