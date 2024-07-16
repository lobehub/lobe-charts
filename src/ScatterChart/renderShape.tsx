import React from 'react';
import { Dot } from 'recharts';

import { deepEqual } from '@/common/utils';

export const renderShape = (
  props: any,
  activeNode: any | undefined,
  activeLegend: string | undefined,
) => {
  const { cx, cy, width, node, fillOpacity, name } = props;

  return (
    <Dot
      cx={cx}
      cy={cy}
      opacity={
        activeNode || (activeLegend && activeLegend !== name)
          ? deepEqual(activeNode, node)
            ? fillOpacity
            : 0.3
          : fillOpacity
      }
      r={width / 2}
    />
  );
};
