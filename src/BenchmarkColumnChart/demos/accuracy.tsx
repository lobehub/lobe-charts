import { BenchmarkColumnChart, type BenchmarkRecord } from '@lobehub/charts';
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
        color: adaptBrandColor(Claude.colorPrimary, theme.isDarkMode),
        error: 1.2,
        icon: <Claude.Avatar size={20} />,
        name: 'Claude Fable 5.1\n(max with fallback)',
        provider: 'Anthropic',
        score: 57,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        error: 1.1,
        icon: <OpenAI.Avatar size={20} />,
        name: 'GPT-6 Astra\n(max)',
        provider: 'OpenAI',
        score: 55,
      },
      {
        color: adaptBrandColor(Claude.colorPrimary, theme.isDarkMode),
        error: 1.4,
        icon: <Claude.Avatar size={20} />,
        name: 'Claude Fable 5\n(max)',
        provider: 'Anthropic',
        score: 52,
      },
      {
        color: adaptBrandColor(OpenAI.colorPrimary, theme.isDarkMode),
        error: 0.9,
        icon: <OpenAI.Avatar size={20} />,
        name: 'GPT-6\n(max)',
        provider: 'OpenAI',
        score: 50,
      },
      {
        color: '#3186FF',
        error: 1.3,
        icon: <Gemini.Avatar size={20} />,
        name: 'Gemini 3.8 Flash\n(high)',
        provider: 'Google',
        score: 47,
      },
      {
        color: adaptBrandColor(DeepSeek.colorPrimary, theme.isDarkMode),
        error: 1.5,
        icon: <DeepSeek.Avatar size={20} />,
        name: 'DeepSeek V4.1 Flash\n(max)',
        provider: 'DeepSeek',
        score: 45,
      },
      {
        color: adaptBrandColor(Meta.colorPrimary, theme.isDarkMode),
        error: 1.1,
        icon: <Meta.Avatar size={20} />,
        name: 'Llama 5.1\n70B',
        provider: 'Meta',
        score: 44,
      },
      {
        color: adaptBrandColor(Qwen.colorPrimary, theme.isDarkMode),
        error: 1.6,
        icon: <Qwen.Avatar size={20} />,
        name: 'Qwen3.8\n2.4T A95B',
        provider: 'Alibaba Cloud',
        score: 43,
      },
      {
        color: adaptBrandColor(Grok.colorPrimary, theme.isDarkMode),
        error: 1.8,
        icon: <Grok.Avatar size={20} />,
        name: 'Grok 5\nFast',
        provider: 'xAI',
        score: 41,
      },
      {
        color: '#3186FF',
        error: 2.1,
        icon: <Gemini.Avatar size={20} />,
        name: 'Gemini 3.8\nFlash Lite',
        provider: 'Google',
        score: 39,
      },
    ],
    [theme.isDarkMode],
  );

  return (
    <BenchmarkColumnChart
      accuracyFormatter={(value) => `${value.toFixed(1)}%`}
      data={data}
      height={400}
      showError
      showErrorBars
    />
  );
};
