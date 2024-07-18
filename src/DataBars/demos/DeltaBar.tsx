import { DeltaBar } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={24} width={'100%'}>
      <DeltaBar tooltip="30%" value={30} />
      <DeltaBar tooltip="-50%" value={-50} />
      <DeltaBar isIncreasePositive={false} value={30} />
    </Flexbox>
  );
};
