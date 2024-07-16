import { Grid } from '@lobehub/ui';
import { Card } from 'antd';
import { createStyles } from 'antd-style';

import AreaChart from '@/AreaChart/demos/example';
import BarChart from '@/BarChart/demos/example';
import BarChartGroups from '@/BarChart/demos/groups';
import DonutChart from '@/DonutChart/demos/withLegend';
import LineChart from '@/LineChart/demos/customColors';
import ScatterChart from '@/ScatterChart/demos/example';

const useStyles = createStyles(({ css }) => ({
  container: css`
    margin-top: -4%;
  `,
}));

export default () => {
  const { styles } = useStyles();

  return (
    <Grid className={styles.container} gap={16} style={{ maxWidth: 1280 }} width={'100%'}>
      <Card>
        <BarChart />
      </Card>
      <Card>
        <AreaChart />
      </Card>
      <Card>
        <LineChart />
      </Card>
      <Card>
        <DonutChart />
      </Card>
      <Card>
        <ScatterChart />
      </Card>
      <Card>
        <BarChartGroups />
      </Card>
    </Grid>
  );
};
