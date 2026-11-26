import { ChartFrame, useThemeColorRange } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const stages = [
  { label: 'Queued', value: 18 },
  { label: 'Running', value: 42 },
  { label: 'Review', value: 27 },
  { label: 'Done', value: 113 },
];
const total = stages.reduce((s, d) => s + d.value, 0);

export default () => {
  const colors = useThemeColorRange();
  return (
    <ChartFrame
      legend={stages.map((s) => ({ label: s.label, value: String(s.value) }))}
      style={{ maxWidth: 560 }}
      subtitle="Tasks by stage, this sprint"
      title="Agent task board"
    >
      <Flexbox horizontal gap={2} height={10}>
        {stages.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: colors[i],
              borderRadius: 3,
              flex: s.value / total,
            }}
          />
        ))}
      </Flexbox>
    </ChartFrame>
  );
};
