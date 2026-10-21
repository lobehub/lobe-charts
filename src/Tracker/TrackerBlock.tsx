'use client';

import type { FlexboxProps } from '@lobehub/ui';
import { createStaticStyles, cssVar, Flexbox, Tooltip } from '@lobehub/ui';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

const styles = createStaticStyles(({ css }) => ({
  block: css`
    background: ${cssVar.colorFill};

    &:first-child {
      border-start-start-radius: ${cssVar.borderRadiusSM};
      border-end-start-radius: ${cssVar.borderRadiusSM};
    }

    &:last-child {
      border-start-end-radius: ${cssVar.borderRadiusSM};
      border-end-end-radius: ${cssVar.borderRadiusSM};
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

const TrackerBlock = ({
  ref,
  color,
  tooltip,
  width,
  style,
  ...rest
}: TrackerBlockProps & FlexboxProps & { ref?: React.Ref<HTMLDivElement> }) => {
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
};

export default TrackerBlock;
