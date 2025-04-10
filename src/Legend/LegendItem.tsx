import { Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Circle } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: inline-flex;
    align-items: center;

    border-radius: ${token.borderRadius}px;

    color: ${token.colorTextDescription};
    white-space: nowrap;
  `,
  hasOnValueChange: css`
    transition: all 0.25s ${token.motionEaseInOut};

    &:hover {
      color: ${token.colorTextSecondary};
      background: ${token.colorFillTertiary};
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
  const { cx, styles, theme } = useStyles();
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
          color: activeLegend && activeLegend === name ? theme.colorTextSecondary : undefined,
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
