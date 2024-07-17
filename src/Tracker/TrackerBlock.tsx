'use client';

import { Tooltip } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { ReactNode, forwardRef, useMemo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  block: css`
    background: ${token.colorFill};

    &:first-child {
      border-top-left-radius: ${token.borderRadiusSM}px;
      border-bottom-left-radius: ${token.borderRadiusSM}px;
    }

    &:last-child {
      border-top-right-radius: ${token.borderRadiusSM}px;
      border-bottom-right-radius: ${token.borderRadiusSM}px;
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
    const { styles, theme } = useStyles();

    const blockColor = useMemo(() => {
      switch (color) {
        case 'success': {
          return theme.colorSuccess;
        }
        case 'warning': {
          return theme.colorWarning;
        }
        case 'error': {
          return theme.colorError;
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
