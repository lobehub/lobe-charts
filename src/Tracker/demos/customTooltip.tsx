import { Tracker, TrackerProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';

const data: TrackerProps['data'] = [
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'warning', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'error', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'warning', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'error', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'warning', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
  { color: 'success', tooltip: 'Tracker Info' },
];

export default () => {
  const theme = useTheme();
  const customTooltip: TrackerProps['customTooltip'] = (item) => {
    let color;
    switch (item.color) {
      case 'success': {
        color = theme.colorSuccess;
        break;
      }
      case 'warning': {
        color = theme.colorWarning;
        break;
      }
      case 'error': {
        color = theme.colorError;
        break;
      }
      default: {
        color = item.color;
        break;
      }
    }

    return (
      <Flexbox gap={8} horizontal style={{ position: 'relative' }}>
        <Flexbox
          flex={'none'}
          style={{ background: color, borderRadius: 2, minHeight: '100%' }}
          width={4}
        />
        <Flexbox>
          <Typography.Paragraph ellipsis style={{ color: theme.colorBgContainer, margin: 0 }}>
            {item.tooltip}
          </Typography.Paragraph>
          <Typography.Paragraph
            ellipsis
            style={{ color: theme.colorBgLayout, fontWeight: 'bold', margin: 0 }}
          >
            {item.color?.toUpperCase()}
          </Typography.Paragraph>
        </Flexbox>
      </Flexbox>
    );
  };

  return <Tracker customTooltip={customTooltip} data={data} />;
};
