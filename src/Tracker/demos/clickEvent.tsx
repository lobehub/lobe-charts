import { Tracker, TrackerProps } from '@lobehub/charts';
import { Flexbox, Highlighter } from '@lobehub/ui';
import { useState } from 'react';

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
  const [value, setValue] = useState({});
  return (
    <Flexbox align={'center'} width={'100%'}>
      <Tracker data={data} onValueChange={(v) => setValue(v)} />
      <Highlighter language={'json'} style={{ marginTop: 16, width: '100%' }}>
        {JSON.stringify(value, null, 2)}
      </Highlighter>
    </Flexbox>
  );
};
