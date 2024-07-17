import { BarList, BarListProps } from '@lobehub/charts';
import { Highlighter } from '@lobehub/ui';
import { useState } from 'react';

const data: BarListProps['data'] = [
  { name: '/home', value: 456 },
  { name: '/imprint', value: 351 },
  { name: '/cancellation', value: 51 },
];

export default () => {
  const [value, setValue] = useState({});
  return (
    <>
      <BarList data={data} onValueChange={(v) => setValue(v)} />
      <Highlighter language={'json'} style={{ marginTop: 16 }}>
        {JSON.stringify(value, null, 2)}
      </Highlighter>
    </>
  );
};
