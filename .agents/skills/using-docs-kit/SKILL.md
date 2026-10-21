---
name: using-docs-kit
description: >
  Author and fix the lobe-charts documentation site, which is built with @lobehub/docs-kit (the
  `lobedocs` CLI, a React Router + Vite static site). Covers this repo's layout, docs.config.ts,
  package scripts, component doc pages (index.mdx frontmatter, `?demo` imports, <Demo>, <Api>),
  the home page, the changelog, and the build-time validations that reject bad docs. Trigger on
  docs-kit, lobedocs, defineDocsConfig, docs.config.ts, write component docs, add a demo, <Demo>,
  <Api>, index.mdx, docs build error, 文档站, 写文档, 组件文档.
---

# Using @lobehub/docs-kit in lobe-charts

This repo holds **only content + `docs.config.ts`**. The kit owns the Vite and React Router
config; there is no `vite.config.ts` or `react-router.config.ts` here, and you should not add one
unless you need an override (see [reference/config.md](reference/config.md)).

Installed version: `@lobehub/docs-kit` 6.0.2 (devDependency `^6.0.0`). Its source ships in
`node_modules/@lobehub/docs-kit/` (`src/config.ts`, `site/compiler/**`); read it when a rule here
is unclear.

## 1. Repo layout

```
lobe-charts/
├── docs.config.ts          # defineDocsConfig({...}) — required
├── compatibility.json      # frozen dumi-era URL inventory, passed as legacyRedirects
├── package.json            # lobedocs scripts
├── docs/
│   ├── index.mdx           # "/" — required (frontmatter feeds SEO even with a custom homePage)
│   ├── index.tsx           # demo imported by docs/index.mdx
│   ├── changelog.mdx       # "/changelog" — imports ../CHANGELOG.md
│   └── home/home.tsx       # custom landing page (config.homePage)
├── src/
│   └── RadarChart/
│       ├── index.tsx       # component + exported props type — <Api> resolves through it
│       ├── styles.ts       # createStaticStyles from @lobehub/ui
│       ├── index.mdx       # -> /components/radar-chart
│       └── demos/
│           ├── index.tsx   # StoryBook playground (default export)
│           └── example.tsx
├── public/                 # static assets served at "/"
└── CHANGELOG.md
```

Hard rules the compiler enforces:

- Only files named **`index.mdx`** under an `atomDirs` root become component pages
  (`index.md` and `README.md` are ignored).
- Demo files must live under **`src/**/demos/**`** — standalone `/~demos/:id` routes and
  `isolated` demos are globbed from that path only (plus `docs/index.tsx`).
- Other `docs/**/*.mdx` files are **not** discovered unless listed in `publicDocs`
  (this repo lists none; `docs/index.mdx` and `docs/changelog.mdx` are built in).

## 2. Scripts

Dependencies are already in `package.json`; install with `bun install` (what CI runs). Do not
add docs-kit, React Router or Vite again.

| Script                       | Runs                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| `npm run dev` (`npm start`)  | `lobedocs dev` — local docs server                         |
| `npm run docs:build`         | `lobedocs build` — static site in `dist/`, runs all audits |
| `npm run docs:build-analyze` | `ANALYZE=1 lobedocs build`                                 |
| `npm run setup`              | `lobedocs typegen` (also run by `prepare` on install)      |

There is no `docs:dev` script. `lobedocs build` generates Pagefind search, the sitemap,
`/llms.txt` and `/skills.md` automatically. The kit requires Node >= 22.22.

## 3. `docs.config.ts`

This repo's config (abridged):

```ts
import { defineDocsConfig } from '@lobehub/docs-kit/src/config';
import type { DocumentationInventory } from '@lobehub/docs-kit/src/types';

import compatibility from './compatibility.json';

export default defineDocsConfig({
  alias: { '@': 'src', '@lobehub/charts': 'src' }, // demos import the package, run the source
  atomDirs: [{ dir: 'src', subType: 'components', type: 'component' }],
  description: 'React modern charts components built on recharts',
  homePage: './docs/home/home.tsx',
  legacyRedirects: compatibility as DocumentationInventory,
  navSections: {},
  siteUrl: 'https://charts.lobehub.com',
  themeConfig: {
    apiHeader: {
      github: 'https://github.com/lobehub/lobe-charts',
      packageName: '@lobehub/charts', // defaults to @lobehub/ui — keep it set
      /* docUrl, sourceUrl, match */
    },
    navItems: [{ href: '/changelog', label: 'Changelog' }],
    /* analytics, giscus, metadata, prefersColor, socialLinks */
  },
  title: 'Lobe Charts',
});
```

> **Import path:** `@lobehub/docs-kit` has no `main` or `exports` field, so there is no root
> import; `defineDocsConfig` lives in `src/config.ts` and this repo deep-imports it from
> `@lobehub/docs-kit/src/config`. The kit's README lists only the `lobedocs` CLI and
> `@lobehub/docs-kit/react-router-config` as supported entry points and calls other deep imports
> "intentionally unstabilized". `defineDocsConfig` is an identity function, so if that path ever
> moves, exporting the plain object works the same.

**Restart `npm run dev` after editing `docs.config.ts`** — config is loaded once and cached per
process.

All fields are in [reference/config.md](reference/config.md).

## 4. Writing a component page (`src/<Name>/index.mdx`)

Template (abridged from `src/RadarChart/index.mdx`):

```mdx
---
title: RadarChart
description: Radar charts compare multiple quantitative variables across categories on a polar grid.
category: Charts
order: 6
---

import DemoExample from './demos/example.tsx?demo';
import DemoIndex from './demos/index.tsx?demo';

<Demo of={DemoIndex} layout="bare" />

## Usage example

One sentence on what this demo shows.

<Demo of={DemoExample} />

## API

<Api name="RadarChart" />
```

### Frontmatter

| Field         | Required        | Effect                                                                                                                        |
| ------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `title`       | yes             | H1, `<title>`, sidebar label. If PascalCase, the header shows `import { Title } from '<packageName>'` — match the export name |
| `description` | yes             | Subtitle, meta/OG description, search, llms.txt. One or two plain sentences, no markdown                                      |
| `category`    | yes (component) | Sidebar group. This repo uses `Charts`, `Benchmark` and `Visualizations`; reuse one                                           |
| `order`       | no              | Finite number, lower first within category                                                                                    |
| `status`      | no              | `stable` \| `beta` \| `experimental` \| `deprecated`                                                                          |
| `since`       | no              | Non-empty version string                                                                                                      |
| `route`       | no              | Override the URL; component pages must stay under `/components/`                                                              |

Pages in this repo use only `title`, `description`, `category` and `order`.

URL is derived from the folder: `src/BenchmarkScatterChart/index.mdx` →
`/components/benchmark-scatter-chart` (kebab-cased).

### Headings

The page renders `title` as the H1. Start body sections at `##`; a stray `#` is rendered as an
H2. Every heading gets an anchor and appears in the outline and llms.txt, so use short, stable,
noun-style headings (`## Usage example`, `## No Data`, `## API`).

### Demos

```mdx
import DemoIndex from './demos/index.tsx?demo';

<Demo of={DemoIndex} title="Basic usage" description="Optional caption." layout="center" />
```

| Prop                    | Default     | Use                                                                                     |
| ----------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `of`                    | —           | Required. The `?demo` import (without `?demo` you get the raw component and it fails)   |
| `title` / `description` | —           | Caption above the demo                                                                  |
| `layout`                | `'default'` | `'bare'` no padding/frame (playgrounds, full-width); `'center'` centered small elements |
| `isolated`              | `false`     | Render in an iframe — for fixed/portal/global-CSS demos that would leak into the page   |
| `editable`              | `true`      | Set `false` if the demo uses dynamic `import()`, workers, or odd local deps             |
| `height`                | —           | Frame height (number = px), e.g. for isolated demos                                     |

Demo file rules:

- Exactly one `export default` component; import the library by its **package name**
  (`import { RadarChart } from '@lobehub/charts'`) so the shown source is copy-pasteable — the
  `alias` maps it back to `src/`.
- One idea per demo; name files after the idea (`example.tsx`, `customColors.tsx`,
  `customTooltip.tsx`, `noData.tsx`). `index.tsx` is the playground.
- Keep it self-contained: no fetching, no reliance on site state; mock data inline or in a local
  `demos/data.ts`.
- Playgrounds use `StoryBook`, `useControls` and `useCreateStore` from `@lobehub/ui/storybook`
  and are shown with `layout="bare"` (every component in this repo has one).

### API table

```mdx
<Api name="RadarChart" />                 <!-- resolves via the nearest index.tsx / index.ts barrel -->
<Api name="Name" from="./Name" />         <!-- module path relative to this index.mdx -->
```

Only static `name` and `from` are allowed (`data` is compiler-owned). Props are extracted from
TypeScript, so the quality of the table is the quality of your types:

```ts
export interface RadarChartProps extends BaseChartProps {
  /**
   * When true, series after the first are rendered at `secondaryOpacity`.
   * @default true
   */
  dimSecondarySeries?: boolean;
}
```

- The JSDoc body is the description; supported tags: `@default`, `@deprecated`, `@since`.
- `@default` must match the runtime destructuring default, or the build fails.
- The props type **as a whole** must be concrete: if the component's props resolve to `any` or
  `unknown`, the build fails. Individual props typed `any` are not rejected (for example
  `BaseChartProps.data: any[]`), but a precise type gives a better table.
- TypeScript errors in files related to the props type also fail the build.
- Props starting with `_` are hidden; inherited props are labelled with the type they come from.

### Other MDX content

- Globals available without import: only `Demo` and `Api`. Import anything else explicitly.
- GFM is on (tables, task lists, strikethrough). No `:::` callout syntax.
- Code fences are highlighted only — never executed.
- `.md` files can be imported as components: `docs/changelog.mdx` does
  `import Changelog from '../CHANGELOG.md'`.

## 5. Home and changelog

- **Home**: `docs/index.mdx` needs frontmatter. Because `homePage: './docs/home/home.tsx'` is
  set, that module's default export renders the landing page and receives
  `{ description: string; getStartedPathname: string }`. See the `building-landing-home` skill.
- **Changelog**: `docs/changelog.mdx` imports `../CHANGELOG.md`. `CHANGELOG.md` is generated by
  semantic-release — do not edit it by hand.
- **Guide pages** (none yet): add `docs/<path>.mdx` with `title` + `description` and list it in
  `publicDocs: ['docs/<path>.mdx']` → served at `/<path>`; link it via `themeConfig.navItems`.

## 6. Workflow for adding or changing a page

```
- [ ] index.mdx exists at src/<Name>/index.mdx with title, description, category
- [ ] every <Demo of={X}> has a matching `import X from './demos/….tsx?demo'`
- [ ] demos default-export and import the package as '@lobehub/charts'
- [ ] <Api name> matches a component exported from src/<Name>/index.tsx; props typed with JSDoc
- [ ] the component is exported from src/index.ts
- [ ] `npm run dev`, open the page, check demos + API table render
- [ ] `npm run docs:build` passes (it runs all audits)
```

When the build fails, the error lists the offending file and rule; see
[reference/validations.md](reference/validations.md) for every rule and the fix.

## Additional resources

- [reference/config.md](reference/config.md) — every `docs.config.ts` field, sections/navigation,
  React Router overrides
- [reference/validations.md](reference/validations.md) — what fails `lobedocs build` and why
