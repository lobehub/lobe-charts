'use client';

import { Flexbox, FlexboxProps } from '@lobehub/ui';
import { cx } from 'antd-style';
import { ReactNode, forwardRef } from 'react';

import TrackerBlock, { TrackerBlockProps } from './TrackerBlock';
import { styles } from './styles';

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

const Tracker = forwardRef<HTMLDivElement, TrackerProps>((props, ref) => {
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

  const content = data.map((item, idx) => (
    <TrackerBlock
      color={item.color}
      height={blockHeight}
      key={item.key ?? idx}
      onClick={() => onValueChange?.(item)}
      style={{
        cursor: onValueChange ? 'pointer' : 'default',
      }}
      tooltip={customTooltip ? customTooltip(item) : item.tooltip}
      width={blockWidth}
    />
  ));

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
        <Flexbox align={'center'} horizontal justify={'space-between'} width={'100%'}>
          <div className={cx(styles.strongLabel, styles.emphasis)}>{leftLabel}</div>
          <div className={cx(styles.label, styles.emphasis)} style={{ textAlign: 'right' }}>
            {rightLabel}
          </div>
        </Flexbox>
        <Flexbox align={'center'} gap={blockGap} height={blockHeight} horizontal width={'100%'}>
          {content}
        </Flexbox>
      </Flexbox>
    );
  }

  return (
    <Flexbox
      align={'center'}
      className={className}
      gap={blockGap}
      height={height || blockHeight}
      horizontal
      ref={ref}
      width={width}
      {...rest}
    >
      {content}
    </Flexbox>
  );
});

Tracker.displayName = 'Tracker';

export default Tracker;
