# docs.config.ts reference

Source of truth: `node_modules/@lobehub/docs-kit/src/config.ts` (`DocsConfig`, docs-kit 6.0.2).
The config is loaded once per process in a `node --import tsx` subprocess, so it must be a pure
module with a default export; restart `npm run dev` after edits.

This repo imports the helper with
`import { defineDocsConfig } from '@lobehub/docs-kit/src/config'` (the package has no root entry;
see SKILL.md §3).

## Top-level fields

| Field             | Type                                                                    | Notes                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `atomDirs`        | `{ dir: string; type?: string; subType?: string }[]`                    | Required. Roots scanned recursively for `index.mdx`. Here: `[{ dir: 'src', subType: 'components', type: 'component' }]` |
| `title`           | `string`                                                                | Required. Site name in `<title>`, OG, llms.txt                                                                          |
| `description`     | `string`                                                                | Required. Site summary                                                                                                  |
| `siteUrl`         | `string`                                                                | Required. Canonical origin (no trailing slash) for sitemap/OG/canonical                                                 |
| `alias`           | `Record<string, string>`                                                | Vite aliases. Here `@` and `@lobehub/charts` map to `src`, so demos import the package but run source                   |
| `homePage`        | `string`                                                                | Module whose default export is the landing page. Here `./docs/home/home.tsx`. Missing file = build error                |
| `publicDocs`      | `string[]`                                                              | Extra `docs/**/*.mdx` guide pages to publish (route = path without `docs/` and extension). Unused here                  |
| `navSections`     | `Record<string, string>`                                                | `{ 'src/foo/Bar/index.mdx': 'Section' }` — only for a page outside its section's folder. Here `{}`                      |
| `favicons`        | `Record<string, string>` (`icon`, `icon16`, `icon32`, `appleTouchIcon`) | Merged over the kit's `DEFAULT_FAVICONS`. Here only `icon` is set                                                       |
| `legacyRedirects` | `DocumentationInventory`                                                | Frozen old-URL inventory. Here `compatibility.json` (dumi-era URLs); every listed URL must still build                  |
| `stylex`          | `Record<string, unknown> \| string`                                     | Optional StyleX options. Unused here                                                                                    |

## `themeConfig`

| Field                      | Notes                                                                                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiHeader.packageName`    | Package shown in the component header import line and npm link. **Defaults to `@lobehub/ui`**; here `@lobehub/charts`                                                                   |
| `apiHeader.packageNames`   | `Record<subType, packageName>` for multi-package repos. Unused here                                                                                                                     |
| `apiHeader.github`         | Repo base URL; substituted for `{github}`                                                                                                                                               |
| `apiHeader.docUrl`         | Edit-link template, default `{github}/edit/master/{atomId}` (`{atomId}` = mdx path). This repo's branch is `master`                                                                     |
| `apiHeader.sourceUrl`      | Source-link template, default `{github}/tree/master/{atomId}`                                                                                                                           |
| `apiHeader.match`          | Pathname prefixes that get Source/Edit links. Here `['/components/']`                                                                                                                   |
| `navItems`                 | `{ href, label, external?, icon? }[]` top links after Home. `skills.md` and `llms.txt` are always added; `Changelog` is appended unless you list `/changelog` yourself (this repo does) |
| `actions`                  | `{ href, label, external? }[]` text links in the top bar                                                                                                                                |
| `socialLinks`              | `{ href, icon?, label }[]`; here GitHub, Discord and NPM                                                                                                                                |
| `prefersColor`             | `'auto'` (shows switcher) \| `'light'` \| `'dark'`. Here `'auto'`                                                                                                                       |
| `giscus`                   | `{ repo, repoId, category, categoryId }` comments at page end                                                                                                                           |
| `analytics.plausible`      | `{ domain, source }`                                                                                                                                                                    |
| `metadata.openGraph.image` | Default OG image URL                                                                                                                                                                    |
| `home`                     | Content for the kit's default landing page (`hero`, `features`, `install`, `ctaTitle`, `ctaFootnote`). **Ignored here** because `homePage` is set                                       |

A custom `homePage` module receives these props (see `docs/home/home.tsx`):

```tsx
export default function Home({
  description,
  getStartedPathname,
}: {
  description: string;
  getStartedPathname: string;
}) {
  /* … */
}
```

## Sections and sidebar

Sidebar = **section → category → pages** (sorted by `order`, then `title`).

Section is derived per page:

1. `navSections[source]` if set.
2. `atomDirs[].subType` if set, capitalized — in this repo `components` → `Components`, so every
   page lands in one section and `category` does the grouping.
3. The second path segment when it is one of the kit's built-in namespaces (`awesome`, `brand`,
   `chat`, `dashboard`, `color`, `icons`, `mdx`, `mobile`, `storybook`; see
   `src/packageNamespaces.ts`).
4. Otherwise `Components`.

Don't name component folders after those namespaces. With a single `atomDirs` root, URLs are
`/components/<kebab-folder>`; `subType` is only prefixed into the URL when there is more than one
root.

## React Router override (optional)

Only if you need e.g. a `basename`:

```ts
// react-router.config.ts
import { defineLobeDocsReactRouterConfig } from '@lobehub/docs-kit/react-router-config';

export default defineLobeDocsReactRouterConfig({ basename: '/docs' });
```

A consumer-authored `react-router.config.*` always wins and is never touched by the CLI. This
repo has none.

## Generated files

`lobedocs typegen` (`npm run setup`, run by `prepare`) writes route types to `.react-router/`.
`lobedocs build` writes `dist/`. Both are already in `.gitignore`; never commit them.
