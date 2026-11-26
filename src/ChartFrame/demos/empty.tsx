import { ChartFrame } from '@lobehub/charts';

export default () => (
  <ChartFrame
    empty
    emptyText="Waiting for the first run"
    style={{ maxWidth: 560 }}
    title="Eval results"
  />
);
