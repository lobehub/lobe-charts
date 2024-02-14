import { useTheme } from 'antd-style';
import { memo } from 'react';
import { YAxis as RcYAxis, type YAxisProps as RcYAxisProps } from 'recharts';

export interface YAxisProps extends RcYAxisProps {
  withYTickLine?: boolean;
}

const YAxis = memo<YAxisProps>(({ unit, withYTickLine, ...rest }) => {
  const theme = useTheme();
  return (
    <RcYAxis
      allowDecimals
      stroke={theme.colorBorder}
      tick={{
        color: theme.colorTextSecondary,
        fill: theme.colorTextSecondary,
      }}
      tickLine={withYTickLine ? { stroke: theme.colorBorder } : false}
      unit={unit}
      {...rest}
    />
  );
});

YAxis.displayName = 'YAxis';
export default YAxis;
