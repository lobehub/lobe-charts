import { defineConfig } from 'dumi';
import { SiteThemeConfig } from 'dumi-theme-lobehub';
import { INavItem } from 'dumi/dist/client/theme-api/types';

import { description, homepage, name } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isWin = process.platform === 'win32';

const nav: INavItem[] = [
  { link: '/components/bar-chart', title: 'Charts' },
  { link: 'https://ui.lobehub.com', mode: 'override', title: 'UI' },
  { link: 'https://icon.lobehub.com', mode: 'override', title: 'Icons' },
  { link: '/changelog', title: 'Changelog' },
];

const themeConfig: SiteThemeConfig = {
  actions: [
    {
      icon: 'Github',
      link: homepage,
      openExternal: true,
      text: 'Github',
    },
    {
      link: '/components/area-chart',
      text: 'Get Started',
      type: 'primary',
    },
  ],
  analytics: {
    plausible: {
      domain: 'charts.lobehub.com',
      scriptBaseUrl: 'https://plausible.lobehub-inc.cn',
    },
  },
  apiHeader: {
    docUrl: `{github}/tree/master/src/{atomId}/index.md`,
    match: ['/components'],
    pkg: name,
    sourceUrl: `{github}/tree/master/src/{atomId}/index.tsx`,
  },
  description: description,
  giscus: {
    category: 'Q&A',
    categoryId: 'DIC_kwDOLNrpbc4Cin_G',
    repo: 'lobehub/lobe-charts',
    repoId: 'R_kgDOLNrpbQ',
  },
  metadata: {
    openGraph: {
      image:
        'https://repository-images.githubusercontent.com/752544109/5bb43f23-aed9-44b0-b08e-91776eadfe1c',
    },
  },
  name: 'Charts',
  nav,
  prefersColor: {
    default: 'dark',
    switch: false,
  },
  socialLinks: {
    discord: 'https://discord.gg/AYFPHvv2jT',
    github: homepage,
  },
  title: 'Lobe Charts',
};

export default defineConfig({
  apiParser: isProduction ? {} : false,
  base: '/',
  define: {
    'process.env': process.env,
  },
  exportStatic: {},
  extraBabelPlugins: ['antd-style'],
  favicons: ['https://lobehub.com/favicon.ico'],
  jsMinifier: 'swc',
  locales: [{ id: 'en-US', name: 'English' }],
  mako: {},
  mfsu: isWin ? undefined : {},
  npmClient: 'pnpm',
  publicPath: '/',
  resolve: isProduction
    ? {
        entryFile: './src/index.ts',
      }
    : undefined,
  sitemap: {
    hostname: 'https://charts.lobehub.com',
  },
  ssr: isProduction ? {} : false,
  styles: [
    `html, body { background: transparent;  }

  @media (prefers-color-scheme: dark) {
    html, body { background: #000; }
  }`,
  ],
  themeConfig,
  title: 'Lobe Charts',
});
