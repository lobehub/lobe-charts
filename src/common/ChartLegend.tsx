import { Flexbox } from '@lobehub/ui';
import { Dispatch, SetStateAction, useRef } from 'react';

import Legend from '@/Legend';
import { useOnWindowResize } from '@/hooks/useOnWindowResize';

const calculateHeight = (height: number | undefined) =>
  height
    ? Number(height) + 20 // 20px extra padding
    : 60; // default height

const ChartLegend = (
  { payload }: any,
  categoryColors: Map<string, string>,
  setLegendHeight: Dispatch<SetStateAction<number>>,
  activeLegend: string | undefined,
  onClick?: (category: string, color: string) => void,
  enableLegendSlider?: boolean,
  customCategories?: {
    [key: string]: string;
  },
) => {
  const legendRef = useRef<HTMLDivElement>(null);

  useOnWindowResize(() => {
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
  });

  const filteredPayload = payload.filter((item: any) => item.type !== 'none');

  return (
    <Flexbox align={'center'} horizontal justify={'flex-end'} ref={legendRef}>
      <Legend
        activeLegend={activeLegend}
        categories={filteredPayload.map((entry: any) => entry.value)}
        colors={filteredPayload.map((entry: any) => categoryColors.get(entry.value))}
        customCategories={customCategories}
        enableLegendSlider={enableLegendSlider}
        onClickLegendItem={onClick}
      />
    </Flexbox>
  );
};

export default ChartLegend;
