import {
  BenchmarkColumnChart,
  type BenchmarkColumnChartProps,
  type BenchmarkRecord,
} from '@lobehub/charts';
import { Claude, DeepSeek, Gemini, Grok, Meta, Minimax, OpenAI, Qwen } from '@lobehub/icons';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useTheme } from 'antd-style';
import { FC, useMemo } from 'react';

/** Flip near-black / near-white brand colors for theme contrast (demo only). */
const adaptBrandColor = (color: string, isDarkMode: boolean) => {
  const normalized = color.trim().toLowerCase();
  const isBlack =
    normalized === '#000' ||
    normalized === '#000000' ||
    normalized === 'black' ||
    normalized === 'rgb(0,0,0)' ||
    normalized === 'rgb(0, 0, 0)';
  const isWhite =
    normalized === '#fff' ||
    normalized === '#ffffff' ||
    normalized === 'white' ||
    normalized === 'rgb(255,255,255)' ||
    normalized === 'rgb(255, 255, 255)';

  if (isBlack || isWhite) return isDarkMode ? '#ffffff' : '#000000';
  return color;
};

const BenchmarkColumnChartLineDemo: FC = () => {
  const store = useCreateStore();
  const theme = useTheme();

  const data: BenchmarkRecord[] = useMemo(
    () => [
      {
        color: adaptBrandColor(Claude.colorPrimary, theme.isDarkMode),
        icon: <Claude.Avatar size={20} />,
        line: 91.1,
        name: 'Claude Fable 5.1\n(max with fallback)',
        provider: 'Anthropic',
        score: 86.7,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        icon: <OpenAI.Avatar size={20} />,
        line: 90,
        name: 'GPT-6 Astra\n(max)',
        provider: 'OpenAI',
        score: 80,
      },
      {
        color: '#3186FF',
        icon: <Gemini.Avatar size={20} />,
        line: 87.8,
        name: 'Gemini 3.1 Pro\nPreview',
        provider: 'Google',
        score: 75.6,
      },
      {
        color: adaptBrandColor(Grok.colorPrimary, theme.isDarkMode),
        icon: <Grok.Avatar size={20} />,
        line: 86.7,
        name: 'Grok 5\nFast',
        provider: 'xAI',
        score: 73.3,
      },
      {
        color: adaptBrandColor(Qwen.colorPrimary, theme.isDarkMode),
        icon: <Qwen.Avatar size={20} />,
        line: 85.6,
        name: 'Qwen3.8\n2.4T A95B',
        provider: 'Alibaba Cloud',
        score: 72.2,
      },
      {
        color: adaptBrandColor(DeepSeek.colorPrimary, theme.isDarkMode),
        icon: <DeepSeek.Avatar size={20} />,
        line: 84.4,
        name: 'DeepSeek V4.1\nFlash (max)',
        provider: 'DeepSeek',
        score: 70,
      },
      {
        color: adaptBrandColor(Meta.colorPrimary, theme.isDarkMode),
        icon: <Meta.Avatar size={20} />,
        line: 81.1,
        name: 'Llama 5.1\n70B',
        provider: 'Meta',
        score: 64.4,
      },
      {
        color: adaptBrandColor(Minimax.colorPrimary, theme.isDarkMode),
        icon: <Minimax.Avatar size={20} />,
        line: 73.3,
        name: 'MiniMax\nM3',
        provider: 'MiniMax',
        score: 55.6,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        icon: <OpenAI.Avatar size={20} />,
        line: 82.2,
        name: 'Step*\nwater18-0910',
        provider: 'StepFun',
        score: 66.7,
        unranked: true,
      },
    ],
    [theme.isDarkMode],
  );

  const props: BenchmarkColumnChartProps | any = useControls(
    {
      barName: 'All 3 rounds passed / Pass³',
      labelAngle: {
        max: 0,
        min: -90,
        step: 1,
        value: -66,
      },
      labelFontSize: {
        max: 18,
        min: 8,
        step: 1,
        value: 11,
      },
      lineColor: theme.gold,
      lineName: 'Overall pass rate / Pass¹',
      maxValue: 100,
      showErrorBars: false,
      showGridLines: true,
      showLegend: true,
      showLine: true,
      showLineLabel: true,
      showRank: false,
      showTooltip: true,
      showValueLabel: true,
      showXAxis: false,
      showYAxis: false,
      sortOrder: {
        options: ['descending', 'ascending', 'none'],
        value: 'none',
      },
      unrankedLabel: 'Historical ranking retained · Step unranked',
      valueLabelFontSize: {
        max: 20,
        min: 8,
        step: 1,
        value: 12,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <BenchmarkColumnChart
        data={data}
        height={420}
        valueFormatter={(value) => value.toFixed(1)}
        {...props}
      />
    </StoryBook>
  );
};

BenchmarkColumnChartLineDemo.displayName = 'BenchmarkColumnChartLineDemo';

export default BenchmarkColumnChartLineDemo;
