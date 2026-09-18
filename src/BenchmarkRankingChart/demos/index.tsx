import {
  BenchmarkRankingChart,
  type BenchmarkRankingChartProps,
  type BenchmarkRecord,
} from '@lobehub/charts';
import { Claude, DeepSeek, Gemini, Grok, Meta, OpenAI, Qwen } from '@lobehub/icons';
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

const BenchmarkRankingChartDemo: FC = () => {
  const store = useCreateStore();
  const theme = useTheme();

  const data: BenchmarkRecord[] = useMemo(
    () => [
      {
        color: '#3186FF',

        icon: <Gemini.Avatar size={22} />,
        name: 'Gemini 3.8 Live Extended Thinking (High)',
        provider: 'Google',
        score: 82.6,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        icon: <OpenAI.Avatar size={22} />,
        name: 'GPT-6 Pro Extended Thinking (High)',
        provider: 'OpenAI',
        score: 73.9,
      },
      {
        color: adaptBrandColor(Grok.colorPrimary, theme.isDarkMode),
        icon: <Grok.Avatar size={22} />,
        name: 'Grok 5.1 Extended Thinking (High)',
        provider: 'xAI',
        score: 73.6,
      },
      {
        color: adaptBrandColor(Qwen.colorPrimary, theme.isDarkMode),
        icon: <Qwen.Avatar size={22} />,
        name: 'Qwen3.8 Max Thinking',
        provider: 'Alibaba Cloud',
        score: 73.2,
      },
      {
        color: adaptBrandColor(Grok.colorPrimary, theme.isDarkMode),
        icon: <Grok.Avatar size={22} />,
        name: 'Grok 5 Extended Thinking (High)',
        provider: 'xAI',
        score: 72.5,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        icon: <OpenAI.Avatar size={22} />,
        name: 'GPT-6 Extended Thinking (High)',
        provider: 'OpenAI',
        score: 71.5,
      },
      {
        color: '#3186FF',
        icon: <Gemini.Avatar size={22} />,
        name: 'Gemini 3.8 Pro Extended Thinking (High)',
        provider: 'Google',
        score: 71.4,
      },
      {
        color: adaptBrandColor(Claude.colorPrimary, theme.isDarkMode),
        icon: <Claude.Avatar size={22} />,
        name: 'Claude Fable 5.1 Extended Thinking',
        provider: 'Anthropic',
        score: 70.2,
      },
      {
        color: adaptBrandColor(Meta.colorPrimary, theme.isDarkMode),
        icon: <Meta.Avatar size={22} />,
        name: 'Llama 5.1 405B Instruct',
        provider: 'Meta',
        score: 68.8,
      },
      {
        color: adaptBrandColor(DeepSeek.colorPrimary, theme.isDarkMode),
        icon: <DeepSeek.Avatar size={22} />,
        name: 'DeepSeek V4.1 Thinking',
        provider: 'DeepSeek',
        score: 67.4,
      },
    ],
    [theme.isDarkMode],
  );

  const props: BenchmarkRankingChartProps | any = useControls(
    {
      barSize: {
        max: 32,
        min: 4,
        step: 1,
        value: 24,
      },
      labelFontSize: {
        max: 20,
        min: 10,
        step: 1,
        value: 14,
      },
      labelWidth: {
        max: 480,
        min: 80,
        step: 10,
        value: 280,
      },
      maxValue: 100,
      rowHeight: {
        step: 2,
        value: 40,
      },
      showAnimation: false,
      showErrorBars: true,
      showGridLines: true,
      showRank: true,
      showTooltip: true,
      showValueLabel: true,
      showXAxis: false,
      showYAxis: true,
      sortOrder: {
        options: ['descending', 'ascending', 'none'],
        value: 'descending',
      },
      valueLabelFontSize: {
        max: 20,
        min: 10,
        step: 1,
        value: 14,
      },
      xAxisLabel: '',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <BenchmarkRankingChart data={data} onValueChange={(v) => console.log(v)} {...props} />
    </StoryBook>
  );
};

BenchmarkRankingChartDemo.displayName = 'BenchmarkRankingChartDemo';

export default BenchmarkRankingChartDemo;
