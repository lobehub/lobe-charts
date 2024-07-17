import { Tracker, TrackerProps } from '@lobehub/charts';

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
  return <Tracker data={data} leftLabel={'lobehub.com'} rightLabel={'uptime 99.1%'} />;
};
