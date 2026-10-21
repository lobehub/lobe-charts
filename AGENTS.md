# AGENTS.md

Guidance for AI coding agents working in this repository.

## Overview

`@lobehub/charts` is a React chart component library built on recharts and styled with `@lobehub/ui` (v6). Each component lives in its own folder under `src/` and doubles as a docs page on [charts.lobehub.com](https://charts.lobehub.com), built with `@lobehub/docs-kit` (`lobedocs`).

| Path                       | What it is                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `src/<Component>/`         | One component: `index.tsx`, `styles.ts`, `index.mdx` (docs page), `demos/`                    |
| `src/common/`              | Shared props (`BaseChartProps`), tooltip, legend, `NoData`, benchmark types/utils             |
| `src/hooks/`, `src/utils/` | Shared hooks (`useThemeColorRange`, ...) and helpers                                          |
| `src/index.ts`             | Public exports. Anything not exported here is not part of the package API                     |
| `tests/`                   | Vitest + Testing Library tests                                                                |
| `docs/`                    | Site home (`docs/index.mdx`, `docs/index.tsx`, `docs/home/home.tsx`) and `docs/changelog.mdx` |
| `docs.config.ts`           | docs-kit config (`atomDirs: src`, aliases `@` and `@lobehub/charts` -> `src`)                 |
| `.agents/skills/`          | Agent skills for this repo (see below)                                                        |
| `.cursor/docs/`            | `createStaticStyles_migration_guide.md`: styling guide for `@lobehub/ui` v6 (Chinese)         |

## Using Skills

Skills live in `.agents/skills/<name>/SKILL.md`. Read the whole `SKILL.md` (and the `reference/` files it links) before starting a matching task.

| Skill                   | Use it when                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `using-docs-kit`        | Writing or fixing a component docs page (`index.mdx`, `<Demo>`, `<Api>`, frontmatter), editing `docs.config.ts`, or debugging a docs build error |
| `building-landing-home` | Changing the docs landing page (`docs/home/home.tsx`) with `@lobehub/ui/awesome` components                                                      |

Both skills describe this repo: its scripts, paths and the installed `@lobehub/docs-kit` 6.0.2. For styles, read `.cursor/docs/createStaticStyles_migration_guide.md`.

`https://charts.lobehub.com/skills.md` and `https://charts.lobehub.com/llms.txt` are generated from the docs for **consumers** of the package. Don't edit them by hand; they change when `index.mdx` pages change. To look up a `@lobehub/ui` component while working here, use `https://ui.lobehub.com/skills.md`.

## Writing Docs

- **One page per component:** `src/<Component>/index.mdx`. Only files named `index.mdx` become pages; the URL comes from the folder (`src/BenchmarkScatterChart/index.mdx` -> `/components/benchmark-scatter-chart`).

- **Frontmatter:** `title` (the export name, e.g. `RadarChart`), `description` (one or two plain sentences, used in search, `llms.txt` and `skills.md`), `category` (reuse one of `Charts`, `Benchmark`, `Visualizations`), and optional `order` (a number).

- **Body:** start with the playground demo, then `##` sections, then the API table:

  ```mdx
  import DemoExample from './demos/example.tsx?demo';
  import DemoIndex from './demos/index.tsx?demo';

  <Demo of={DemoIndex} layout="bare" />

  ## Usage example

  The example below shows ...

  <Demo of={DemoExample} />

  ## API

  <Api name="RadarChart" />
  ```

- **Demos:** live in `src/<Component>/demos/`, one idea per file with exactly one `export default`. Import the library by package name (`import { RadarChart } from '@lobehub/charts'`) so the shown code can be copied; the alias maps it to `src/`. Keep data inline (or in a local `demos/data.ts`). `index.tsx` is the interactive playground: `StoryBook`, `useControls` and `useCreateStore` from `@lobehub/ui/storybook`.

- **Common demo names:** `example`, `clickEvent`, `customTooltip`, `customColors`, `axis`, `noData`, `loading`. Reuse them where they apply.

- **API table:** `<Api name="...">` is generated from the TypeScript props. Document props with JSDoc; keep `@default` equal to the default value in the component's destructuring, or the docs build fails. The build also fails if the whole props type resolves to `any`/`unknown` or has TypeScript errors.

- **Preview:** `npm run dev` (`lobedocs dev`). Restart it after editing `docs.config.ts`. Full check: `npm run docs:build`.

- **Style:** short noun-style headings ("Usage example with click event", "No Data", "API"); one sentence per demo explaining which prop it shows. Write in English, with no marketing language.

## Adding a New Chart Component

Recent examples to copy from: `b8ea74a` (BenchmarkScatterChart), `a207a62` (BenchmarkColumnChart / BenchmarkRankingChart), `d67c822` (RadarChart).

1. **Create `src/<Name>/index.tsx`.**
   - Start with `'use client';`.
   - Use `forwardRef<HTMLDivElement, <Name>Props>` and set a `displayName`.
   - Export `interface <Name>Props` and give it JSDoc.
   - Cartesian charts extend `BaseChartProps` from `@/common/BaseChartProps`.
   - Reuse `ChartTooltip`, `ChartLegend` and `NoData`.
   - Use `useThemeColorRange()` as the default `colors`.
   - Benchmark charts share types and helpers from `@/common/benchmark`.
2. **Create `src/<Name>/styles.ts`.** Use `createStaticStyles(({ css, cssVar }) => ({ ... }))` from `@lobehub/ui`, with `cssVar.*` theme tokens. Don't hard-code colors that should follow the theme, and don't add antd or antd-style. Use `useTheme()` only when a real JS value is needed (colors passed to recharts, color math), and `useThemeMode()` when you only need `isDarkMode`. Put complex pure logic in `src/<Name>/utils.ts` so it can be unit-tested.
3. **Export it from `src/index.ts`**, e.g. `export { default as <Name>, type <Name>Props } from './<Name>';`. Add any public types too, keeping the alphabetical order.
4. **Add demos** in `src/<Name>/demos/`: `index.tsx` playground first, then one file per feature. Include `noData` / `loading` if the component supports `loading` / empty data.
5. **Add docs** in `src/<Name>/index.mdx` (see [Writing Docs](#writing-docs)). Placement in the sidebar comes from `category` + `order`; there is no separate nav file to edit.
6. **Add tests** in `tests/<Name>.test.tsx`. Cover rendering, props/events and any `utils.ts` logic. Import from `@/<Name>`, and mock `@lobehub/ui` pieces when needed, as `tests/BenchmarkScatterChart.test.tsx` does.
7. **Run the final checks** below, then open the page in `npm run dev` and check every demo and the API table.

## Conventions & Checks

| Task                    | Command                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| Install                 | `bun install` (what CI uses)                                        |
| Docs dev server         | `npm run dev`                                                       |
| Docs production build   | `npm run docs:build`                                                |
| Type check              | `npm run type-check`                                                |
| Lint (ESLint, auto-fix) | `npm run lint`                                                      |
| Lint styles             | `npm run lint:style`                                                |
| Circular deps           | `npm run lint:circular`                                             |
| Tests (single run)      | `npx vitest run` (`npm test` starts watch mode in a terminal)       |
| Tests + coverage        | `npm run test:coverage`                                             |
| Library build           | `npm run build` (tsdown -> `es/`, then generates the `exports` map) |

- **Hooks:** pre-commit runs `type-check`, `lint:circular` and lint-staged (`*.{ts,tsx,js,jsx}`: Prettier, Stylelint, ESLint; `*.md`: remark, Prettier; `*.json`: Prettier; `.mdx` is not covered). commit-msg runs commitlint. Never use `--no-verify`; fix the reported problem instead.
- **Commits:** gitmoji + conventional commit, lowercase type and scope, e.g. `✨ feat: add RadarChart`, `🐛 fix(tooltip): ...`, `📝 docs: ...`. Releases and `CHANGELOG.md` are generated by semantic-release, so don't edit them by hand.
- **Fix it here:** this repo is the upstream for chart components. Fix a component or style issue in its `src/<Component>` files and the theme tokens it uses. Don't work around it in a downstream app by overriding theme variables or class names.
- **Public API:** don't rename or remove props or exports without an explicit request; that is a breaking change for consumers.
