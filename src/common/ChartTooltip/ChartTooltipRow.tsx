import { Flexbox, Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStaticStyles } from 'antd-style';
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
    <Flexbox align={'center'} gap={32} horizontal justify={'space-between'} width={'max-content'}>
      <Flexbox align={'center'} gap={8} horizontal width={'auto'}>
        <Icon color={color} fill={color} icon={Circle} size={10} />
        <Typography.Paragraph className={styles.title} ellipsis style={{ margin: 0 }}>
          {name}
        </Typography.Paragraph>
      </Flexbox>
      <Typography.Paragraph className={styles.number} style={{ margin: 0 }}>
        {value}
      </Typography.Paragraph>
    </Flexbox>
  );
});

export default ChartTooltipRow;
