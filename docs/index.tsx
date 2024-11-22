import { Grid, Snippet } from '@lobehub/ui';
import { Card } from 'antd';
import { Center, Flexbox } from 'react-layout-kit';

import AreaChart from '@/AreaChart/demos/example';
import BarChart from '@/BarChart/demos/example';
import BarChartGroups from '@/BarChart/demos/groups';
import DonutChart from '@/DonutChart/demos/withLegend';
import LineChart from '@/LineChart/demos/customColors';
import ScatterChart from '@/ScatterChart/demos/example';

export default () => {
  return (
    <Flexbox gap={48}>
      <Center>
        <h2 style={{ fontSize: 20 }}>To install Lobe Charts, run the following command:</h2>
        <Snippet language={'bash'}>{'$ bun add @lobehub/charts'}</Snippet>
      </Center>
      <Grid gap={16} rows={2} style={{ maxWidth: 960 }} width={'100%'}>
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
    </Flexbox>
  );
};
