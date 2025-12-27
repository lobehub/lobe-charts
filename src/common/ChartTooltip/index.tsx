import { Flexbox } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStaticStyles, cssVar, cx } from 'antd-style';
import { ReactNode } from 'react';

import { ValueFormatter } from '@/types/charts';

import ChartTooltipFrame from './ChartTooltipFrame';
import ChartTooltipRow from './ChartTooltipRow';

const styles = createStaticStyles(({ css, cssVar }) => ({
  header: css`
    border-bottom: 1px solid ${cssVar.colorBorderSecondary};
    font-weight: 500;
  `,
}));

export interface ChartTooltipProps {
  active: boolean | undefined;
  categoryColors: Map<string, string>;
  customCategories?: {
    [key: string]: string;
  };
  footer?: ReactNode;
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
  footer,
}: ChartTooltipProps) => {
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
              color={categoryColors.get(name) ?? cssVar.colorPrimary}
              key={`id-${idx}`}
              name={customCategories?.[name] || name}
              value={valueFormatter(value)}
            />
          ))}
        </Flexbox>
        {footer}
      </ChartTooltipFrame>
    );
  }
  return null;
};

export default ChartTooltip;
