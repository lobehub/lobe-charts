import { Tracker, TrackerProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

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
  const store = useCreateStore();

  const props: TrackerProps | any = useControls(
    {
      blockWidth: {
        step: 1,
        value: 12,
      },
      gap: {
        step: 1,
        value: 4,
      },
      height: {
        step: 1,
        value: 40,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Tracker data={data} {...props} />
    </StoryBook>
  );
};
