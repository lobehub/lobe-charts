import { createStaticStyles, Flexbox, Icon, Text } from '@lobehub/ui';
import { Circle } from 'lucide-react';
import { memo } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  number: css`
    flex-shrink: 0;
    font-weight: 500;
    white-space: nowrap;
  `,
  title: css`
    color: ${cssVar.colorTextSecondary};
  `,
}));
export interface ChartTooltipRowProps {
  color: string;
  name: string;
  value: string;
}

const ChartTooltipRow = memo<ChartTooltipRowProps>(({ value, name, color }) => {
  return (
    <Flexbox horizontal align={'center'} gap={32} justify={'space-between'} width={'max-content'}>
      <Flexbox horizontal align={'center'} gap={8} width={'auto'}>
        <Icon color={color} fill={color} icon={Circle} size={10} />
        <Text ellipsis className={styles.title} style={{ margin: 0 }}>
          {name}
        </Text>
      </Flexbox>
      <Text className={styles.number} style={{ margin: 0 }}>
        {value}
      </Text>
    </Flexbox>
  );
});

export default ChartTooltipRow;
