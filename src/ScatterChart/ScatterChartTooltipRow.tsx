import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  number: css`
    font-weight: 500;
  `,
  title: css`
    color: ${token.colorTextSecondary};
  `,
}));

export interface ChartTooltipRowProps {
  name: string;
  value: string;
}

const ChartTooltipRow = memo<ChartTooltipRowProps>(({ value, name }) => {
  const { styles } = useStyles();
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
