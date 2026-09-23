import {
  type BenchmarkRecord,
  BenchmarkScatterChart,
  type BenchmarkScatterChartProps,
} from '@lobehub/charts';
import { ClaudeCode, Codex, DeepSeek, HermesAgent, Kimi, OpenCode, Pi } from '@lobehub/icons';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useTheme } from 'antd-style';
import { ComponentType, FC, useMemo } from 'react';

import { harnessData, harnessMetrics, passRateFormatter } from './data';

type AvatarIcon = { Avatar: ComponentType<any> };

/**
 * `color: undefined` means a monochrome brand that should follow the theme text color.
 * `dark: true` marks black-background avatars that need a lighter disc on dark themes.
 */
const brand: Record<string, { color?: string; dark?: boolean; icon?: AvatarIcon }> = {
  'Claude Code': { color: ClaudeCode.colorPrimary, icon: ClaudeCode },
  'Codex': { icon: Codex },
  'DSH Creator': { color: DeepSeek.colorPrimary, icon: DeepSeek },
  'DSH Minimal': { color: DeepSeek.colorPrimary, icon: DeepSeek },
  'DSH PTC': { color: DeepSeek.colorPrimary, icon: DeepSeek },
  'DSH Standard': { color: DeepSeek.colorPrimary, icon: DeepSeek },
  'Exo Harness': { color: '#a3a3a3' },
  'Hermes': { icon: HermesAgent },
  'Kimi Code': { dark: true, icon: Kimi },
  'Oh My Pi': { dark: true, icon: Pi },
  'OpenCode': { dark: true, icon: OpenCode },
  'Pi': { dark: true, icon: Pi },
};

const BenchmarkScatterChartDemo: FC = () => {
  const store = useCreateStore();
  const theme = useTheme();

  const props: BenchmarkScatterChartProps | any = useControls(
    {
      height: {
        max: 720,
        min: 240,
        step: 10,
        value: 440,
      },
      iconSize: {
        max: 36,
        min: 12,
        step: 1,
        value: 22,
      },
      labelFontSize: {
        max: 16,
        min: 10,
        step: 1,
        value: 12,
      },
      showAnimation: true,
      showDominatedArea: true,
      showFrontier: true,
      showGridLines: true,
      showLabels: true,
      showLegend: true,
      showTooltip: true,
      showValueLabel: true,
      showXAxis: true,
      showYAxis: true,
      yAxisLabel: 'Pass rate',
    },
    { store },
  );

  const data: BenchmarkRecord[] = useMemo(
    () =>
      harnessData.map((record) => {
        const meta = brand[record.name as string];
        const Icon = meta?.icon;
        return {
          ...record,
          color: meta?.color ?? theme.colorText,
          icon: Icon ? (
            <Icon.Avatar
              size={props.iconSize}
              {...(meta?.dark && theme.isDarkMode ? { background: '#303036' } : null)}
            />
          ) : undefined,
        };
      }),
    [props.iconSize, theme.colorText, theme.isDarkMode],
  );

  return (
    <StoryBook levaStore={store}>
      <BenchmarkScatterChart
        accuracyFormatter={passRateFormatter}
        data={data}
        metrics={harnessMetrics}
        onValueChange={(v) => console.log(v)}
        {...props}
      />
    </StoryBook>
  );
};

BenchmarkScatterChartDemo.displayName = 'BenchmarkScatterChartDemo';

export default BenchmarkScatterChartDemo;
