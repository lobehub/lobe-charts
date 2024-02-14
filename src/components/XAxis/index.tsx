import { useTheme } from 'antd-style';
import { memo } from 'react';
import { XAxis as RcXAxis, type XAxisProps as RcXAxisProps } from 'recharts';

export interface XAxisProps extends RcXAxisProps {
  withXTickLine?: boolean;
}

const XAxis = memo<XAxisProps>(({ withXTickLine, ...rest }) => {
  const theme = useTheme();
  return (
    <RcXAxis
      interval="preserveStartEnd"
      minTickGap={5}
      stroke={theme.colorBorder}
      tick={{
        color: theme.colorTextSecondary,
        fill: theme.colorTextSecondary,
      }}
      tickLine={withXTickLine ? { stroke: theme.colorBorder } : false}
      {...rest}
    />
  );
});

XAxis.displayName = 'XAxis';
export default XAxis;
