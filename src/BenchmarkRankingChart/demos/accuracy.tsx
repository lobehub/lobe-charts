import { BenchmarkRankingChart, type BenchmarkRecord } from '@lobehub/charts';
import { Claude, DeepSeek, Gemini, Grok, Meta, OpenAI, Qwen } from '@lobehub/icons';
import { useTheme } from 'antd-style';
import { useMemo } from 'react';

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

export default () => {
  const theme = useTheme();

  const data: BenchmarkRecord[] = useMemo(
    () => [
      {
        color: '#3186FF',
        error: 0.8,

        icon: <Gemini.Avatar size={22} />,
        name: 'Gemini 3.8 Live Extended Thinking (High)',
        provider: 'Google',
        score: 82.6,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        error: 1.1,
        icon: <OpenAI.Avatar size={22} />,
        name: 'GPT-6 Pro Extended Thinking (High)',
        provider: 'OpenAI',
        score: 73.9,
      },
      {
        color: adaptBrandColor(Grok.colorPrimary, theme.isDarkMode),
        error: 1,
        icon: <Grok.Avatar size={22} />,
        name: 'Grok 5.1 Extended Thinking (High)',
        provider: 'xAI',
        score: 73.6,
      },
      {
        color: adaptBrandColor(Qwen.colorPrimary, theme.isDarkMode),
        error: 1.2,
        icon: <Qwen.Avatar size={22} />,
        name: 'Qwen3.8 Max Thinking',
        provider: 'Alibaba Cloud',
        score: 73.2,
      },
      {
        color: adaptBrandColor(Grok.colorPrimary, theme.isDarkMode),
        error: 1.3,
        icon: <Grok.Avatar size={22} />,
        name: 'Grok 5 Extended Thinking (High)',
        provider: 'xAI',
        score: 72.5,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        error: 0.9,
        icon: <OpenAI.Avatar size={22} />,
        name: 'GPT-6 Extended Thinking (High)',
        provider: 'OpenAI',
        score: 71.5,
      },
      {
        color: '#3186FF',
        error: 1.1,
        icon: <Gemini.Avatar size={22} />,
        name: 'Gemini 3.8 Pro Extended Thinking (High)',
        provider: 'Google',
        score: 71.4,
      },
      {
        color: adaptBrandColor(Claude.colorPrimary, theme.isDarkMode),
        error: 1.4,
        icon: <Claude.Avatar size={22} />,
        name: 'Claude Fable 5.1 Extended Thinking',
        provider: 'Anthropic',
        score: 70.2,
      },
      {
        color: adaptBrandColor(Meta.colorPrimary, theme.isDarkMode),
        error: 1.5,
        icon: <Meta.Avatar size={22} />,
        name: 'Llama 5.1 405B Instruct',
        provider: 'Meta',
        score: 68.8,
      },
      {
        color: adaptBrandColor(DeepSeek.colorPrimary, theme.isDarkMode),
        error: 1.7,
        icon: <DeepSeek.Avatar size={22} />,
        name: 'DeepSeek V4.1 Thinking',
        provider: 'DeepSeek',
        score: 67.4,
      },
    ],
    [theme.isDarkMode],
  );

  return (
    <BenchmarkRankingChart
      accuracyFormatter={(value) => `${value.toFixed(1)}%`}
      data={data}
      showError
      showErrorBars
      showGridLines
      showXAxis
      showYAxis
      xAxisLabel="Accuracy (%)"
    />
  );
};
