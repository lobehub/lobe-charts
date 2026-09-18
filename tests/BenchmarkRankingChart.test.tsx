import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import BenchmarkRankingChart from '@/BenchmarkRankingChart';

vi.mock('@lobehub/ui', () => ({
  A: ({ children, ...rest }: any) => <a {...rest}>{children}</a>,
  Flexbox: ({ children, ...rest }: any) => {
    const domProps = { ...rest };
    for (const key of [
      'horizontal',
      'gap',
      'align',
      'justify',
      'width',
      'height',
      'paddingInline',
    ]) {
      delete domProps[key];
    }
    return <div {...domProps}>{children}</div>;
  },
  Skeleton: { Block: () => <div data-testid="skeleton" /> },
}));

describe('BenchmarkRankingChart', () => {
  it('renders ranks, names, providers and scores', () => {
    render(
      <BenchmarkRankingChart
        data={[
          {
            color: '#34A853',
            icon: <span data-testid="icon-google">G</span>,
            name: 'Gemini',
            provider: 'Google',
            score: 82.6,
          },
          {
            color: '#000',
            icon: <span data-testid="icon-openai">O</span>,
            name: 'GPT',
            provider: 'OpenAI',
            score: 73.9,
          },
        ]}
      />,
    );

    expect(screen.getByText('Gemini')).toBeTruthy();
    expect(screen.getByText('Google')).toBeTruthy();
    expect(screen.getAllByText('82.6').length).toBeGreaterThan(0);
    expect(screen.getByText('#1')).toBeTruthy();
    expect(screen.getByTestId('icon-google')).toBeTruthy();
  });

  it('supports custom rank rendering', () => {
    render(
      <BenchmarkRankingChart
        data={[{ name: 'Gemini', provider: 'Google', score: 82.6 }]}
        renderRank={(item) => <span data-testid="custom-rank">No.{item.rank}</span>}
      />,
    );

    expect(screen.getByTestId('custom-rank')).toBeTruthy();
    expect(screen.getByText('No.1')).toBeTruthy();
  });

  it('renders horizontal error bars when error is provided', () => {
    render(
      <BenchmarkRankingChart
        data={[
          {
            color: '#34A853',
            error: 1.2,
            name: 'Gemini',
            provider: 'Google',
            score: 82.6,
          },
        ]}
        showErrorBars
      />,
    );

    expect(screen.getByTestId('benchmark-error-bar')).toBeTruthy();
  });

  it('shows skeleton while loading', () => {
    render(<BenchmarkRankingChart data={[]} loading />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });

  it('hides the x-axis by default', () => {
    const { rerender } = render(
      <BenchmarkRankingChart data={[{ name: 'Gemini', score: 82.6 }]} maxValue={100} />,
    );

    expect(screen.queryByText('100')).toBeNull();

    rerender(
      <BenchmarkRankingChart data={[{ name: 'Gemini', score: 82.6 }]} maxValue={100} showXAxis />,
    );

    expect(screen.getByText('100')).toBeTruthy();
  });
});
