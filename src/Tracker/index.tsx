'use client';

import type { FlexboxProps } from '@lobehub/ui';
import { cx, Flexbox, TooltipGroup } from '@lobehub/ui';
import type { ReactNode } from 'react';

import { styles } from './styles';
import type { TrackerBlockProps } from './TrackerBlock';
import TrackerBlock from './TrackerBlock';

interface DataItem extends TrackerBlockProps {
  [key: string]: any;
}

export interface TrackerProps extends FlexboxProps {
  blockGap?: number | string;
  blockHeight?: number | string;
  blockWidth?: number | string;
  customTooltip?: (payload: DataItem) => ReactNode;
  data: DataItem[];
  leftLabel?: ReactNode;
  onValueChange?: (payload: DataItem) => void;
  rightLabel?: ReactNode;
}

const Tracker = ({ ref, ...props }: TrackerProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const {
    data = [],
    className,
    height,
    width = 'fit-content',
    blockWidth = 12,
    blockHeight = 40,
    blockGap = 4,
    customTooltip,
    onValueChange,
    leftLabel,
    rightLabel,
    style,
    ...rest
  } = props;

  const content = (
    <TooltipGroup>
      {data.map((item, idx) => (
        <TrackerBlock
          color={item.color}
          height={blockHeight}
          key={item.key ?? idx}
          tooltip={customTooltip ? customTooltip(item) : item.tooltip}
          width={blockWidth}
          style={{
            cursor: onValueChange ? 'pointer' : 'default',
          }}
          onClick={() => onValueChange?.(item)}
        />
      ))}
    </TooltipGroup>
  );

  if (leftLabel || rightLabel) {
    return (
      <Flexbox
        className={className}
        gap={8}
        height={height}
        ref={ref}
        style={{ position: 'relative', ...style }}
        width={width}
        {...rest}
      >
        <Flexbox horizontal align={'center'} justify={'space-between'} width={'100%'}>
          <div className={cx(styles.strongLabel, styles.emphasis)}>{leftLabel}</div>
          <div className={cx(styles.label, styles.emphasis)} style={{ textAlign: 'right' }}>
            {rightLabel}
          </div>
        </Flexbox>
        <Flexbox horizontal align={'center'} gap={blockGap} height={blockHeight} width={'100%'}>
          {content}
        </Flexbox>
      </Flexbox>
    );
  }

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={className}
      gap={blockGap}
      height={height || blockHeight}
      ref={ref}
      width={width}
      {...rest}
    >
      {content}
    </Flexbox>
  );
};

Tracker.displayName = 'Tracker';

export default Tracker;
