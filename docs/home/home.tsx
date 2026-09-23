import {
  AreaChart,
  type AreaChartProps,
  BenchmarkRankingChart,
  DonutChart,
  type DonutChartProps,
  Heatmaps,
  type HeatmapsProps,
  RadarChart,
  type RadarChartProps,
  Tracker,
  type TrackerProps,
} from '@lobehub/charts';
import {
  Claude,
  DeepSeek,
  Gemini,
  Grok,
  HuggingFace,
  Meta,
  Midjourney,
  Mistral,
  Ollama,
  OpenAI,
  OpenRouter,
  Qwen,
} from '@lobehub/icons';
import {
  AgentSkillCard,
  BentoCard,
  BentoGrid,
  CodeShowcase,
  FeatureGrid,
  InstallBanner,
  LANDING_GRADIENT_VAR,
  LANDING_PALETTE_DARK,
  LANDING_PALETTE_LIGHT,
  LandingHero,
  type LandingLinkRender,
  type LandingPalette,
  LandingSection,
  LogoMarquee,
} from '@lobehub/ui/awesome';
import { GithubIcon } from '@lobehub/ui/icons';
import { createGlobalStyle, useTheme, useThemeMode } from 'antd-style';
import {
  ArrowRight,
  Braces,
  ChartSpline,
  LoaderCircle,
  MousePointerClick,
  Palette,
  Trophy,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const SITE_URL = 'https://charts.lobehub.com';

const MODEL_ICONS = [
  { icon: OpenAI, label: 'OpenAI' },
  { icon: Claude, label: 'Claude' },
  { icon: Gemini, label: 'Gemini' },
  { icon: DeepSeek, label: 'DeepSeek' },
  { icon: Mistral, label: 'Mistral' },
  { icon: Qwen, label: 'Qwen' },
  { icon: Meta, label: 'Meta' },
  { icon: Grok, label: 'Grok' },
  { icon: Ollama, label: 'Ollama' },
  { icon: HuggingFace, label: 'Hugging Face' },
  { icon: OpenRouter, label: 'OpenRouter' },
  { icon: Midjourney, label: 'Midjourney' },
];

const renderLink: LandingLinkRender = ({ external, href, ...props }) =>
  external ? (
    <a href={href} rel="noreferrer" target="_blank" {...props} />
  ) : (
    <Link to={href} {...props} />
  );

const landingGradient = ([from, via, to]: LandingPalette) =>
  `linear-gradient(105deg, ${from} 8%, ${via} 55%, ${to} 95%)`;

const LandingAccent = createGlobalStyle`
  :root {
    ${LANDING_GRADIENT_VAR}: ${({ theme }) =>
      landingGradient(theme.isDarkMode ? LANDING_PALETTE_DARK : LANDING_PALETTE_LIGHT)};
  }
`;

const adaptBrandColor = (color: string, isDarkMode: boolean) => {
  const normalized = color.trim().toLowerCase();
  const isBlack = normalized === '#000' || normalized === '#000000' || normalized === 'black';
  const isWhite = normalized === '#fff' || normalized === '#ffffff' || normalized === 'white';
  if (isBlack || isWhite) return isDarkMode ? '#ffffff' : '#000000';
  return color;
};

const areaPreviewData: AreaChartProps['data'] = [
  { Inverters: 2338, Solar: 2890, month: 'Jan' },
  { Inverters: 2103, Solar: 2756, month: 'Feb' },
  { Inverters: 2194, Solar: 3322, month: 'Mar' },
  { Inverters: 2108, Solar: 3470, month: 'Apr' },
];

const areaGalleryData: AreaChartProps['data'] = [
  ...areaPreviewData,
  { Inverters: 1812, Solar: 3475, month: 'May' },
  { Inverters: 1726, Solar: 3129, month: 'Jun' },
  { Inverters: 1982, Solar: 3490, month: 'Jul' },
  { Inverters: 2012, Solar: 2903, month: 'Aug' },
];

const donutData: DonutChartProps['data'] = [
  { city: 'New York', sales: 980 },
  { city: 'London', sales: 456 },
  { city: 'Hong Kong', sales: 390 },
  { city: 'San Francisco', sales: 240 },
  { city: 'Singapore', sales: 190 },
];

const trackerData: TrackerProps['data'] = [
  { color: 'success', tooltip: 'Mon · API healthy' },
  { color: 'success', tooltip: 'Tue · API healthy' },
  { color: 'warning', tooltip: 'Wed · elevated latency' },
  { color: 'success', tooltip: 'Thu · API healthy' },
  { color: 'error', tooltip: 'Fri · checkout down' },
  { color: 'success', tooltip: 'Sat · API healthy' },
  { color: 'success', tooltip: 'Sun · API healthy' },
  { color: 'warning', tooltip: 'Mon · elevated latency' },
  { color: 'success', tooltip: 'Tue · API healthy' },
  { color: 'success', tooltip: 'Wed · API healthy' },
  { color: 'success', tooltip: 'Thu · API healthy' },
  { color: 'error', tooltip: 'Fri · search down' },
];

const radarData: RadarChartProps['data'] = [
  { 'Product A': 120, 'Product B': 110, 'subject': 'Sales' },
  { 'Product A': 98, 'Product B': 130, 'subject': 'Marketing' },
  { 'Product A': 86, 'Product B': 130, 'subject': 'Dev' },
  { 'Product A': 99, 'Product B': 100, 'subject': 'Support' },
  { 'Product A': 85, 'Product B': 90, 'subject': 'IT' },
  { 'Product A': 65, 'Product B': 85, 'subject': 'Ops' },
];

const heatmapData: HeatmapsProps['data'] = Array.from({ length: 16 * 7 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 0, 4 + index));
  const count = [0, 2, 4, 7, 9, 3, 1][index % 7] + (index % 5);
  return {
    count,
    date: date.toISOString().slice(0, 10),
    level: count === 0 ? 0 : Math.min(4, Math.ceil(count / 3)),
  };
});

const areaSnippet = `import { AreaChart } from '@lobehub/charts';

const data = [
  { month: 'Jan', Solar: 2890, Inverters: 2338 },
  { month: 'Feb', Solar: 2756, Inverters: 2103 },
  { month: 'Mar', Solar: 3322, Inverters: 2194 },
  { month: 'Apr', Solar: 3470, Inverters: 2108 },
];

export default () => (
  <AreaChart categories={['Solar', 'Inverters']} data={data} index="month" />
);`;

const donutSnippet = `import { DonutChart } from '@lobehub/charts';

const data = [
  { city: 'New York', sales: 980 },
  { city: 'London', sales: 456 },
  { city: 'Hong Kong', sales: 390 },
];

export default () => (
  <DonutChart category="sales" data={data} index="city" />
);`;

const trackerSnippet = `import { Tracker } from '@lobehub/charts';

const data = [
  { color: 'success', tooltip: 'Healthy' },
  { color: 'warning', tooltip: 'Degraded' },
  { color: 'error', tooltip: 'Down' },
  { color: 'success', tooltip: 'Healthy' },
];

export default () => <Tracker data={data} />;`;

const showcaseTrackerData: TrackerProps['data'] = [
  { color: 'success', tooltip: 'Healthy' },
  { color: 'warning', tooltip: 'Degraded' },
  { color: 'error', tooltip: 'Down' },
  { color: 'success', tooltip: 'Healthy' },
];

const showcaseDonutData: DonutChartProps['data'] = donutData.slice(0, 3);

const heatmapColors = {
  dark: ['#21262d', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
} as const;

function ActivityMap() {
  const { isDarkMode } = useThemeMode();

  return (
    <Heatmaps
      blockMargin={3}
      blockRadius={2}
      blockSize={12}
      colors={[...heatmapColors[isDarkMode ? 'dark' : 'light']]}
      data={heatmapData}
      fontSize={11}
    />
  );
}

function Leaderboard() {
  const theme = useTheme();
  const color = (brand: string) => adaptBrandColor(brand, theme.isDarkMode);

  return (
    <BenchmarkRankingChart
      barSize={16}
      data={[
        {
          color: color(Gemini.colorPrimary),
          icon: <Gemini.Avatar size={18} />,
          name: 'Gemini 3.8',
          provider: 'Google',
          score: 82.6,
        },
        {
          color: color(OpenAI.colorPrimary),
          icon: <OpenAI.Avatar size={18} />,
          name: 'GPT-6 Pro',
          provider: 'OpenAI',
          score: 73.9,
        },
        {
          color: color(Grok.colorPrimary),
          icon: <Grok.Avatar size={18} />,
          name: 'Grok 5.1',
          provider: 'xAI',
          score: 73.6,
        },
        {
          color: color(Qwen.colorPrimary),
          icon: <Qwen.Avatar size={18} />,
          name: 'Qwen3.8 Max',
          provider: 'Alibaba',
          score: 73.2,
        },
        {
          color: color(Claude.colorPrimary),
          icon: <Claude.Avatar size={18} />,
          name: 'Claude Fable 5',
          provider: 'Anthropic',
          score: 70.2,
        },
      ]}
      labelFontSize={13}
      maxValue={100}
      rowHeight={34}
      showError={false}
      valueLabelFontSize={13}
      width="100%"
    />
  );
}

interface HomePageProps {
  description: string;
  getStartedPathname: string;
}

export default function Home({ description, getStartedPathname }: HomePageProps) {
  const navigate = useNavigate();

  return (
    <>
      <LandingAccent />
      <LandingHero
        accent="Charts"
        actions={[
          {
            href: getStartedPathname,
            icon: ArrowRight,
            iconPlacement: 'end',
            label: 'Get Started',
            primary: true,
          },
          {
            href: 'https://github.com/lobehub/lobe-charts',
            icon: GithubIcon,
            label: 'GitHub',
          },
        ]}
        aside={
          <AgentSkillCard
            agent={{
              code: `Read ${SITE_URL}/skills.md and follow it to build charts with @lobehub/charts.`,
              description: 'Send this prompt to your agent to pick the right chart',
            }}
            footer={
              <>
                <a href="/skills.md" rel="noreferrer" target="_blank">
                  skills.md
                </a>
                <a href="/llms.txt" rel="noreferrer" target="_blank">
                  llms.txt
                </a>
              </>
            }
            human={{
              code: 'npx skills add lobehub/lobe-charts',
              description: 'Install the Lobe Charts skills into your project',
            }}
          />
        }
        badge={
          <a href="/skills.md" rel="noreferrer" target="_blank">
            New · Agent skills for every chart →
          </a>
        }
        description={<span data-pagefind-meta="description">{description}</span>}
        onNavigate={navigate}
        renderLink={renderLink}
        title={<span data-pagefind-meta="title">Lobe</span>}
      >
        <LogoMarquee
          caption={
            <a href="https://icon.lobehub.com" rel="noreferrer" target="_blank">
              Model icons for benchmark charts
            </a>
          }
          items={MODEL_ICONS}
        />
      </LandingHero>

      <LandingSection
        actions={[{ href: getStartedPathname, label: 'Browse components' }]}
        description="Ranking, area, donut, tracker, heatmap, and radar, rendered with real data."
        eyebrow="Components"
        eyebrowColor="blue"
        id="home-gallery"
        onNavigate={navigate}
        renderLink={renderLink}
        title="Live chart gallery"
      >
        <BentoGrid columns={4} rowHeight={168}>
          <BentoCard
            colSpan={2}
            hint="scores out of 100"
            href="/components/benchmark-ranking-chart"
            renderLink={renderLink}
            rowSpan={2}
            title="Leaderboard"
          >
            <Leaderboard />
          </BentoCard>
          <BentoCard
            colSpan={2}
            hint="Solar and inverters"
            href="/components/area-chart"
            renderLink={renderLink}
            title="Revenue"
          >
            <AreaChart
              categories={['Solar', 'Inverters']}
              data={areaGalleryData}
              height={168}
              index="month"
              width="100%"
            />
          </BentoCard>
          <BentoCard href="/components/donut-chart" renderLink={renderLink} title="Sales share">
            <DonutChart category="sales" data={donutData} height={150} index="city" />
          </BentoCard>
          <BentoCard
            hint="last 12 days"
            href="/components/tracker"
            renderLink={renderLink}
            title="Uptime"
          >
            <Tracker data={trackerData} />
          </BentoCard>
          <BentoCard
            colSpan={2}
            hint="Jan 2026"
            href="/components/heatmaps"
            renderLink={renderLink}
            title="Activity"
          >
            <ActivityMap />
          </BentoCard>
          <BentoCard
            colSpan={2}
            href="/components/radar-chart"
            renderLink={renderLink}
            title="Product compare"
          >
            <RadarChart
              categories={['Product A', 'Product B']}
              data={radarData}
              height={220}
              index="subject"
              maxValue={150}
              width="100%"
            />
          </BentoCard>
        </BentoGrid>
      </LandingSection>

      <LandingSection
        actions={[{ href: '/components/area-chart', label: 'Area chart API' }]}
        description="The snippet on the left is the component on the right."
        eyebrow="Usage"
        eyebrowColor="green"
        id="home-usage"
        onNavigate={navigate}
        renderLink={renderLink}
        title="A few lines each"
      >
        <CodeShowcase
          items={[
            {
              code: areaSnippet,
              key: 'area',
              label: 'Area',
              preview: (
                <AreaChart
                  categories={['Solar', 'Inverters']}
                  data={areaPreviewData}
                  index="month"
                />
              ),
            },
            {
              code: donutSnippet,
              key: 'donut',
              label: 'Donut',
              preview: <DonutChart category="sales" data={showcaseDonutData} index="city" />,
            },
            {
              code: trackerSnippet,
              key: 'tracker',
              label: 'Tracker',
              preview: <Tracker data={showcaseTrackerData} />,
            },
          ]}
          minHeight={320}
        />
      </LandingSection>

      <LandingSection
        description="Theme, interaction, and empty states come with the chart."
        eyebrow="Foundations"
        eyebrowColor="orange"
        id="home-foundations"
        title="Made for app UI"
      >
        <FeatureGrid
          items={[
            {
              description: 'Series colors follow the active Ant Design theme in light and dark.',
              icon: Palette,
              title: 'Theme colors',
            },
            {
              description: 'Area, bar, line, radar, and scatter charts share one data shape.',
              href: '/components/bar-chart',
              icon: ChartSpline,
              title: 'Shared props',
            },
            {
              description: 'Ranking charts take brand icons, scores, and error bars.',
              href: '/components/benchmark-ranking-chart',
              icon: Trophy,
              title: 'Benchmarks',
            },
            {
              description: 'Tooltips, legends, and click handlers are built into each chart.',
              href: '/components/area-chart',
              icon: MousePointerClick,
              title: 'Interaction',
            },
            {
              description: 'Every chart includes a loading skeleton and an empty state.',
              href: '/components/bar-chart',
              icon: LoaderCircle,
              title: 'Loading and empty',
            },
            {
              description: 'Formatters, events, and category keys are typed on each component.',
              icon: Braces,
              title: 'Typed props',
            },
          ]}
          renderLink={renderLink}
        />
      </LandingSection>

      <InstallBanner
        command="pnpm add @lobehub/charts"
        footnote={
          <>
            Open source · MIT license · <Link to={getStartedPathname}>Browse components</Link>
          </>
        }
        title="Start building"
      />
    </>
  );
}
