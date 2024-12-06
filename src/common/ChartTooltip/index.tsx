import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

import { ValueFormatter } from '@/types';

import ChartTooltipFrame from './ChartTooltipFrame';
import ChartTooltipRow from './ChartTooltipRow';

const useStyles = createStyles(({ css, token }) => ({
  header: css`
    font-weight: 500;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
}));

export interface ChartTooltipProps {
  active: boolean | undefined;
  categoryColors: Map<string, string>;
  customCategories?: {
    [key: string]: string;
  };
  label: string;
  payload: any;
  valueFormatter: ValueFormatter;
}

const ChartTooltip = ({
  active,
  payload,
  label,
  categoryColors,
  valueFormatter,
  customCategories,
}: ChartTooltipProps) => {
  const { cx, theme, styles } = useStyles();

  if (active && payload) {
    const filteredPayload = payload.filter((item: any) => item.type !== 'none');

    return (
      <ChartTooltipFrame>
        <Flexbox className={cx(styles.header)} paddingBlock={8} paddingInline={16}>
          <Typography.Paragraph ellipsis style={{ margin: 0 }}>
            {label}
          </Typography.Paragraph>
        </Flexbox>
        <Flexbox
          gap={4}
          paddingBlock={8}
          paddingInline={16}
          style={{ flexDirection: 'column-reverse', marginTop: 4 }}
        >
          {filteredPayload.map(({ value, name }: { name: string; value: number }, idx: number) => (
            <ChartTooltipRow
              color={categoryColors.get(name) ?? theme.colorPrimary}
              key={`id-${idx}`}
              name={customCategories?.[name] || name}
              value={valueFormatter(value)}
            />
          ))}
        </Flexbox>
      </ChartTooltipFrame>
    );
  }
  return null;
};

export default ChartTooltip;
