import { Heatmaps, HeatmapsProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

import { yearData } from './data';

export default () => {
  const store = useCreateStore();

  const props: HeatmapsProps | any = useControls(
    {
      blockMargin: {
        step: 1,
        value: 4,
      },
      blockRadius: {
        step: 1,
        value: 2,
      },
      blockSize: {
        step: 1,
        value: 12,
      },
      fontSize: {
        step: 1,
        value: 14,
      },
      hideColorLegend: false,
      hideMonthLabels: false,
      hideTotalCount: false,
      loading: false,
      maxLevel: {
        max: 9,
        min: 1,
        step: 1,
        value: 4,
      },
      showTooltip: true,
      showWeekdayLabels: false,
      weekStart: {
        options: {
          [`(0) Sunday`]: 0,
          [`(1) Monday`]: 1,
          [`(2) Tuesday`]: 2,
          [`(3) Wednesday`]: 3,
          [`(4) Thursday`]: 4,
          [`(5) Friday`]: 5,
          [`(6) Saturday`]: 6,
        },
        value: 0,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Heatmaps data={yearData} {...props} />
    </StoryBook>
  );
};
