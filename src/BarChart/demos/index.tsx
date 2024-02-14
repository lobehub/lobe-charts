import { BarChart } from '@lobehub/charts';
import { StoryBook } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { folder, useControls, useCreateStore } from 'leva';

import { data } from './data';

export default () => {
  const theme = useTheme();
  const store = useCreateStore();

  const options: any = useControls(
    {
      gridAxis: { options: ['x', 'y', 'xy', 'none'], value: 'xy' },
      tickLine: { options: ['x', 'y', 'xy', 'none'], value: 'xy' },
      withLegend: true,
      withTooltip: true,
      withXAxis: true,
      withYAxis: true,
    },
    { store },
  );

  const legendOptions: any = useControls(
    {
      legend: folder({ verticalAlign: { options: ['top', 'bottom', 'middle'], value: 'top' } }),
    },
    { store },
  );

  const yAxisOptions: any = useControls(
    {
      yAxis: folder({ orientation: { options: ['left', 'right'], value: 'left' } }),
    },
    { store },
  );

  const xAxisOptions: any = useControls(
    {
      xAxis: folder({
        verticalAlign: { orientation: ['top', 'bottom'], value: 'bottom' },
      }),
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <BarChart
        data={data}
        dataKey="month"
        legendProps={legendOptions}
        referenceLines={[
          {
            label: 'Profit reached',
            labelPosition: 'insideTopRight',
            y: 200,
          },
        ]}
        series={[
          { color: theme.blue, name: 'Smartphones' },
          { color: theme.green, name: 'Laptops' },
          { color: theme.orange, name: 'Tablets' },
        ]}
        xAxisProps={xAxisOptions}
        yAxisProps={yAxisOptions}
        {...options}
      />
    </StoryBook>
  );
};
