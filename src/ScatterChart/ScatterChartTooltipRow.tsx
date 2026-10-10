import { Flexbox, Text, createStaticStyles, cssVar } from '@lobehub/ui';
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
      <Text className={styles.title} ellipsis style={{ margin: 0 }}>
        {name}
      </Text>
      <Text className={styles.number} style={{ margin: 0 }}>
        {value}
      </Text>
    </Flexbox>
  );
});

export default ChartTooltipRow;
