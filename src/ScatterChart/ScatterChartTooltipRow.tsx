import { Flexbox } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStaticStyles, cssVar } from 'antd-style';
import React, { memo } from 'react';

const styles = createStaticStyles(({ css }) => ({
  number: css`
    font-weight: 500;
  `,
  title: css`
    color: ${cssVar.colorTextSecondary};
  `,
}));

export interface ChartTooltipRowProps {
  name: string;
  value: string;
}

const ChartTooltipRow = memo<ChartTooltipRowProps>(({ value, name }) => {
  return (
    <Flexbox align={'center'} gap={32} horizontal justify={'space-between'}>
      <Typography.Paragraph className={styles.title} ellipsis style={{ margin: 0 }}>
        {name}
      </Typography.Paragraph>
      <Typography.Paragraph className={styles.number} style={{ margin: 0 }}>
        {value}
      </Typography.Paragraph>
    </Flexbox>
  );
});

export default ChartTooltipRow;
