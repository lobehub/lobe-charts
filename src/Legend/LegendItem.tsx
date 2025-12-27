import { Flexbox, Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStaticStyles, cssVar, cx } from 'antd-style';
import { Circle } from 'lucide-react';
import { memo } from 'react';

const styles = createStaticStyles(({ css }) => ({
  container: css`
    display: inline-flex;
    align-items: center;

    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorTextDescription};
    white-space: nowrap;
  `,
  hasOnValueChange: css`
    transition: all 0.25s ${cssVar.motionEaseInOut};

    &:hover {
      color: ${cssVar.colorTextSecondary};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  itemContent: css`
    font-size: 12px;
    color: inherit;
  `,
}));

export interface LegendItemProps {
  activeLegend?: string;
  color: string;
  label: string;
  name: string;
  onClick?: (name: string, color: string) => void;
}

const LegendItem = memo<LegendItemProps>(({ label, name, color, onClick, activeLegend }) => {
  const hasOnValueChange = !!onClick;

  return (
    <Flexbox
      className={cx(styles.container, hasOnValueChange && styles.hasOnValueChange)}
      gap={6}
      horizontal
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(name, color);
      }}
      paddingBlock={2}
      paddingInline={8}
      style={{
        cursor: hasOnValueChange ? 'pointer' : 'default',
      }}
    >
      <Icon
        color={color}
        fill={color}
        icon={Circle}
        size={10}
        style={{
          opacity: activeLegend && activeLegend !== name ? 0.4 : 1,
        }}
      />
      <Typography.Paragraph
        className={styles.itemContent}
        ellipsis
        style={{
          color: activeLegend && activeLegend === name ? cssVar.colorTextSecondary : undefined,
          margin: 0,
          opacity: activeLegend && activeLegend !== name ? 0.4 : 1,
        }}
      >
        {label}
      </Typography.Paragraph>
    </Flexbox>
  );
});

export default LegendItem;
