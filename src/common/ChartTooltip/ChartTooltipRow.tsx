import { Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Circle } from 'lucide-react';
import { memo } from 'react';
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
  color: string;
  name: string;
  value: string;
}

const ChartTooltipRow = memo<ChartTooltipRowProps>(({ value, name, color }) => {
  const { styles } = useStyles();
  return (
    <Flexbox align={'center'} gap={32} horizontal justify={'space-between'}>
      <Flexbox align={'center'} gap={8} horizontal>
        <Icon color={color} fill={color} icon={Circle} size={{ fontSize: 10 }} />
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
