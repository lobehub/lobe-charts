import { Sector } from 'recharts';

export const renderInactiveShape = (props: any) => {
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
        opacity={0.3}
        outerRadius={outerRadius}
        startAngle={startAngle}
        style={{ outline: 'none' }}
      />
    </g>
  );
};
