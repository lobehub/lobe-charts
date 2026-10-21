import { createStaticStyles, cssVar, Flexbox, Text } from '@lobehub/ui';
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
    <Flexbox horizontal align={'center'} gap={32} justify={'space-between'}>
      <Text ellipsis className={styles.title} style={{ margin: 0 }}>
        {name}
      </Text>
      <Text className={styles.number} style={{ margin: 0 }}>
        {value}
      </Text>
    </Flexbox>
  );
});

export default ChartTooltipRow;
