# What fails the build

`npm run docs:build` (`lobedocs build`) fails fast on content errors, then runs a full artifact
audit on `dist/`. `npm run dev` surfaces the content errors too, so fix them before building.
The rules below come from `node_modules/@lobehub/docs-kit/site/compiler/`.

## Content manifest (`Invalid MDX documents:`)

| Rule                                                     | Fix                                                              |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| No YAML frontmatter / invalid YAML                       | Add a `---` block at the very top (`CHANGELOG.md` is exempt)     |
| `title` or `description` missing or empty                | Add both, as plain strings                                       |
| `category` missing on a component page                   | Add `category:`; reuse `Charts`, `Benchmark` or `Visualizations` |
| `category` / `route` / `since` present but empty         | Give it a non-empty string or remove it                          |
| `order` not a finite number                              | `order: 2`, not `order: "2"`                                     |
| `status` not `stable`/`beta`/`experimental`/`deprecated` | Use one of those or remove it                                    |
| `route` outside `/components/` for a component           | Remove `route` and let the folder decide the URL                 |
| Two documents resolve to the same pathname               | Rename a folder or set a distinct `route`                        |

## Demos (`Invalid demo references`)

- `<Demo of={X}>` where `X` is not a `?demo` import, or the imported file does not exist.
- Demo file without a single `export default`.
- Demo outside `src/**/demos/**` used with `isolated` or referenced by a standalone route →
  `Missing standalone demo descriptor loader`.
- Warnings (not failures) for dynamic `import()`, workers, unsupported local deps: add
  `editable={false}` to that `<Demo>`.

## `<Api>` (`site/compiler/api/`)

- Missing or empty `name`, `from=` present but empty, or any `data=` attribute.
- `name` does not resolve: export it by name from the nearest barrel (`index.ts`, `index.tsx`,
  `index.mts` or `index.cts`; this repo uses `src/<Name>/index.tsx`), or pass `from`.
- Ambiguous target (named vs default export, or several call signatures with different props) →
  set `from` to the intended module.
- The target is not callable (not a component).
- The component's **props type as a whole** resolves to `any` or `unknown` ("instead of a
  concrete props contract"). Individual props typed `any` are **not** rejected —
  `BaseChartProps.data: any[]` builds fine.
- TypeScript errors in files related to the props type ("incomplete TypeScript props graph"):
  fix them; `npm run type-check` shows them too.
- `@default` in JSDoc disagrees with the runtime default in the component's destructuring
  ("conflicting runtime default").

## Artifact audit (after build)

These are mostly guaranteed by the kit; they fail when content breaks them:

- **Broken internal links or `#hash` targets** — the most common author error. Link with
  site pathnames (`/components/bar-chart#api`), and hashes must match an actual heading slug.
- Missing HTML for a page or standalone demo; wrong title/description/canonical/OG tags.
- `llms.txt`, `skills.md`, sitemap, robots (must disallow `/~demos/`), Pagefind index, 404 page
  missing or inconsistent.
- Bundle isolation: doc pages must not pull `react-live`, giscus or Pagefind into their initial
  bundle; standalone demos must not include docs chrome. Don't import those from page MDX or
  demos directly.
- Because `legacyRedirects` is set (from `compatibility.json`), every legacy URL must still be
  produced. Renaming or deleting a component folder can break this.
