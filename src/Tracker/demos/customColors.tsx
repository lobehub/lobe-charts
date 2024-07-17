import { Tracker, TrackerProps } from '@lobehub/charts';

const data: TrackerProps['data'] = [
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#f0652f', tooltip: 'Online' },
  { color: '#ffcc33', tooltip: 'Event' },
  { color: '#ffcc33', tooltip: 'Event' },
  { tooltip: 'Downtime' },
  { color: '#ffcc33', tooltip: 'Event' },
  { color: '#ffcc33', tooltip: 'Event' },
  { color: '#ffcc33', tooltip: 'Event' },
  { color: '#ffcc33', tooltip: 'Event' },
];

export default () => {
  return <Tracker data={data} />;
};
