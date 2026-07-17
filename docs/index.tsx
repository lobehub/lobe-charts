import { Center, Flexbox, Grid, Snippet } from '@lobehub/ui';
import { Hero } from '@lobehub/ui/awesome';
import { Card } from 'antd';
import { Link } from 'react-router';

import AreaChart from '@/AreaChart/demos/example';
import BarChart from '@/BarChart/demos/example';
import BarChartGroups from '@/BarChart/demos/groups';
import DonutChart from '@/DonutChart/demos/withLegend';
import LineChart from '@/LineChart/demos/customColors';
import ScatterChart from '@/ScatterChart/demos/example';

export default () => {
  return (
    <Flexbox gap={64} paddingBlock={64}>
      <Hero
        Link={Link}
        actions={[
          {
            github: true,
            link: 'https://github.com/lobehub/lobe-charts',
            openExternal: true,
            text: 'GitHub',
          },
          {
            link: '/components/area-chart',
            text: 'Get Started',
            type: 'primary',
          },
        ]}
        description="React modern charts components built on recharts"
        title="LobeHub <b>Charts</b>"
      />
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
