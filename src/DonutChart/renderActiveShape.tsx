import { Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

export const renderActiveShape = (props: PieSectorDataItem) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, className } = props;

  return (
    <g>
      <Sector
        className={className}
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill=""
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        style={{ outline: 'none' }}
      />
    </g>
  );
};
