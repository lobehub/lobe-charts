import { Flexbox } from '@lobehub/ui';
import type { Dispatch, SetStateAction } from 'react';
import { useRef } from 'react';

import { useOnWindowResize } from '@/hooks/useOnWindowResize';
import Legend from '@/Legend';

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
    <Flexbox horizontal align={'center'} justify={'flex-end'} ref={legendRef}>
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
