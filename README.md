<a name="readme-top"></a>

<div align="center">

![](https://github.com/user-attachments/assets/6170b84b-a83e-4876-91af-8298a60a2b78)

<h1>Lobe Charts</h1>

<h3>Charts for Dashboards and Model Leaderboards</h3>

Beautiful React charts for dashboards and AI benchmarks, themed with Lobe UI.

[Documents](https://charts.lobehub.com) · [Changelog](./CHANGELOG.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

<!-- SHIELD GROUP -->

[![][npm-release-shield]][npm-release-link]
[![][vercel-shield]][vercel-link]
[![][discord-shield]][discord-link]
[![][npm-downloads-shield]][npm-downloads-link]<br/>
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [💡 Why Lobe Charts?](#-why-lobe-charts)
- [🚀 Getting Started](#-getting-started)
- [🤖 AI-Powered Development](#-ai-powered-development)
- [📖 Documentation](#-documentation)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [🩷 Sponsor](#-sponsor)
- [🔗 Links](#-links)
  - [Credits](#credits)

####

</details>

## 💡 Why Lobe Charts?

Lobe Charts (`@lobehub/charts`) is a React chart library for dashboards and AI products, built on [recharts](https://github.com/recharts/recharts) and designed to fit [Lobe UI](https://github.com/lobehub/lobe-ui) apps.

- **Everything a dashboard needs** - business charts, sparklines, heatmaps and status trackers in one package
- **Made for AI products** - ready-made charts for model benchmarks and leaderboards, with your own brand icons
- **Fits your Lobe UI app** - charts follow the Lobe UI theme, so they look consistent without extra styling
- **Simple, data-first props** - pass an array of objects and choose which keys to plot
- **Fully typed** - TypeScript types for every component
- **Agent-ready** - coding agents can learn the library from [`skills.md`][skills-md-link] and [`llms.txt`][llms-txt-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🚀 Getting Started

```bash
$ bun add @lobehub/charts
```

`@lobehub/ui` (v6), `react` and `react-dom` (v19) are peer dependencies; install them too if your project does not have them yet. The package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```tsx
import { LineChart } from '@lobehub/charts';

const data = [
  { date: 'Jan 22', Inverters: 2338, SolarPanels: 2890 },
  { date: 'Feb 22', Inverters: 2103, SolarPanels: 2756 },
  { date: 'Mar 22', Inverters: 2194, SolarPanels: 3322 },
];

// `index` is the x-axis key, `categories` are the series to plot
export default () => (
  <LineChart categories={['SolarPanels', 'Inverters']} data={data} index="date" />
);
```

See the [documents](https://charts.lobehub.com) for every component, live demos and props.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤖 AI-Powered Development

Lobe Charts publishes agent-readable docs, generated from the same source as the documentation site.

| Resource                                                                           | What it is                                                                                                          | How to use it                                                                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Agent Skill** - [`skills.md`][skills-md-link]                                    | Skill entry point: setup, a recommended workflow and an index of every component page                               | Give the URL to your agent (Cursor, Claude Code, Codex, ...), or save it as a `SKILL.md` in your agent's skills folder |
| **llms.txt** - [`llms.txt`][llms-txt-link]                                         | [llms.txt](https://llmstxt.org/) index of every docs page                                                           | Point any llms.txt-aware tool at it                                                                                    |
| **Component reference** - `https://charts.lobehub.com/skills/components/<name>.md` | Markdown page for one component, e.g. [`line-chart.md`](https://charts.lobehub.com/skills/components/line-chart.md) | Fetch it before writing code with that component                                                                       |

Works with **Cursor**, **Claude Code**, **Codex**, **Windsurf**, **GitHub Copilot** and any tool that can read a URL or `llms.txt`. Copy-paste prompt:

```text
Use @lobehub/charts. Read https://charts.lobehub.com/skills.md first,
then fetch the reference page of each component you use before writing code.
```

> \[!NOTE]\
> There is no MCP server or skill install CLI yet; `skills.md` and `llms.txt` are the agent entry points.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📖 Documentation

- **Docs & live demos**: [charts.lobehub.com](https://charts.lobehub.com) - line, area, bar, composed, donut / pie, funnel, scatter, radar, sparklines, heatmaps, trackers, benchmark charts and more
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

```bash
$ git clone https://github.com/lobehub/lobe-charts.git
$ cd lobe-charts
$ bun install
$ bun start
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome, if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] to get stuck in to show us what you’re made of.

[![][pr-welcome-shield]][pr-welcome-link]

[![][contributors-contrib]][contributors-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🩷 Sponsor

Every bit counts and your one-time donation sparkles in our galaxy of support! You're a shooting star, making a swift and bright impact on our journey. Thank you for believing in us – your generosity guides us toward our mission, one brilliant flash at a time.

<a href="https://opencollective.com/lobehub" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/lobehub/.github/blob/main/static/sponsor-dark.png?raw=true">
    <img  src="https://github.com/lobehub/.github/blob/main/static/sponsor-light.png?raw=true">
  </picture>
</a>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 Links

- **[🤯 Lobe UI](https://github.com/lobehub/lobe-ui)** - React component library for AI applications
- **[🌈 Lobe Icons](https://github.com/lobehub/lobe-icons)** - AI / LLM brand logo and icon library
- **[📊 Lobe Charts](https://github.com/lobehub/lobe-charts)** - React chart component library
- **[✒️ Lobe Editor](https://github.com/lobehub/lobe-editor)** - Lexical-based rich text editor for React, with Markdown, plugins and a chat composer
- **[🗣️ Lobe TTS](https://github.com/lobehub/lobe-tts)** - TTS / STT speech library
- **[📐 Lobe Lint](https://github.com/lobehub/lobe-lint)** - ESLint, Prettier, Stylelint, Commitlint and more lint configs
- **[😊 Fluent Emoji](https://github.com/lobehub/fluent-emoji)** - Fluent Emoji asset library

### Credits

- **recharts** - <https://github.com/recharts/recharts>
- **tremor** - <https://github.com/tremorlabs/tremor>
- **react-activity-calendar** - <https://github.com/grubersjoe/react-activity-calendar>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<details><summary><h4>📝 License</h4></summary>

[![][github-license-shield]][github-license-link]

</details>

Copyright © 2023 [LobeHub][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[contributors-contrib]: https://contrib.rocks/image?repo=lobehub/lobe-charts
[contributors-link]: https://github.com/lobehub/lobe-charts/graphs/contributors
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[github-action-release-link]: https://github.com/lobehub/lobe-charts/actions/workflows/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-charts/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/lobehub/lobe-charts/actions/workflows/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-charts/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/lobehub/lobe-charts/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-charts?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/lobehub/lobe-charts/network/members
[github-forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-charts?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/lobehub/lobe-charts/issues
[github-issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-charts?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/lobehub/lobe-charts/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-charts?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/lobe-charts/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/lobe-charts?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/lobe-charts/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/lobe-charts?color=ffcb47&labelColor=black&style=flat-square
[llms-txt-link]: https://charts.lobehub.com/llms.txt
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/charts
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/charts?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/charts
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/charts?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/lobehub/lobe-charts/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[skills-md-link]: https://charts.lobehub.com/skills.md
[vercel-link]: https://charts.lobehub.com
[vercel-shield]: https://img.shields.io/website?down_message=offline&label=vercel&labelColor=black&logo=vercel&style=flat-square&up_message=online&url=https%3A%2F%2Fcharts.lobehub.com
