import { Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Circle } from 'lucide-react';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChartTooltipFrame } from '@/common/ChartTooltip/ChartTooltipFrame';
import { ScatterChartValueFormatter } from '@/types';
import { defaultValueFormatter } from '@/utils';

import ScatterChartTooltipRow from './ScatterChartTooltipRow';

const useStyles = createStyles(({ css, token }) => ({
  header: css`
    font-weight: 500;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
}));

export interface ScatterChartTooltipProps {
  active: boolean | undefined;
  axis: any;
  category?: string;
  categoryColors: Map<string, string>;
  customCategories?: {
    [key: string]: string;
  };
  label: string;
  payload: any;
  valueFormatter: ScatterChartValueFormatter;
}

const ScatterChartTooltip = memo<ScatterChartTooltipProps>(
  ({
    customCategories,
    label,
    active,
    payload,
    valueFormatter,
    axis,
    category,
    categoryColors,
  }) => {
    const { cx, theme, styles } = useStyles();

    const color = category
      ? (categoryColors.get(payload?.[0]?.payload[category]) ?? theme.colorPrimary)
      : theme.colorPrimary;
    if (active && payload) {
      return (
        <ChartTooltipFrame>
          <Flexbox
            align={'center'}
            className={cx(styles.header)}
            gap={8}
            horizontal
            paddingBlock={8}
            paddingInline={16}
          >
            <Icon color={color} fill={color} icon={Circle} size={{ fontSize: 10 }} />
            <Typography.Paragraph ellipsis style={{ margin: 0 }}>
              {label}
            </Typography.Paragraph>
          </Flexbox>
          <Flexbox gap={4} paddingBlock={8} paddingInline={16} style={{ marginTop: 4 }}>
            {payload.map(({ value, name }: { name: string; value: number }, idx: number) => {
              const valueFormatterKey = Object.keys(axis).find((key) => axis[key] === name) ?? '';
              const valueFormatterFn =
                valueFormatter[valueFormatterKey as keyof ScatterChartValueFormatter] ??
                defaultValueFormatter;
              return (
                <ScatterChartTooltipRow
                  key={`id-${idx}`}
                  name={customCategories?.[name] || name}
                  value={valueFormatter && valueFormatterFn ? valueFormatterFn(value) : `${value}`}
                />
              );
            })}
          </Flexbox>
        </ChartTooltipFrame>
      );
    }
    return null;
  },
);

export default ScatterChartTooltip;
