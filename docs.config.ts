import { defineDocsConfig } from '@lobehub/docs-kit/src/config';
import type { DocumentationInventory } from '@lobehub/docs-kit/src/types';

import compatibility from './compatibility.json';

const legacyRedirects = compatibility as DocumentationInventory;

export default defineDocsConfig({
  alias: {
    '@': 'src',
    '@lobehub/charts': 'src',
  },
  atomDirs: [{ dir: 'src', subType: 'components', type: 'component' }],
  description: 'React modern charts components built on recharts',
  favicons: {
    icon: 'https://lobehub.com/favicon.ico',
  },
  homePage: './docs/index.tsx',
  legacyRedirects,
  navSections: {},
  siteUrl: 'https://charts.lobehub.com',
  themeConfig: {
    analytics: {
      plausible: {
        domain: 'charts.lobehub.com',
        source: 'https://plausible.lobehub-inc.cn/js/script.js',
      },
    },
    apiHeader: {
      docUrl: '{github}/edit/master/{atomId}',
      github: 'https://github.com/lobehub/lobe-charts',
      match: ['/components/'],
      packageName: '@lobehub/charts',
      sourceUrl: '{github}/tree/master/{atomId}',
    },
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
    navItems: [
      { external: true, href: 'https://ui.lobehub.com', label: 'UI' },
      { external: true, href: 'https://icon.lobehub.com', label: 'Icons' },
      { href: '/changelog', label: 'Changelog' },
    ],
    prefersColor: 'dark',
    socialLinks: [
      {
        href: 'https://github.com/lobehub/lobe-charts',
        icon: 'github',
        label: 'GitHub',
      },
      { href: 'https://discord.gg/AYFPHvv2jT', icon: 'discord', label: 'Discord' },
      {
        href: 'https://www.npmjs.com/package/@lobehub/charts',
        icon: 'npm',
        label: 'NPM',
      },
    ],
  },
  title: 'Lobe Charts',
});
