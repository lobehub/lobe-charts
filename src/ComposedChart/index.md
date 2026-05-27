---
nav: Components
group: Charts
description: ComposedChart renders bar and line series on the same chart with independent left and right y-axes, sharing a single x-axis and a unified tooltip.
order: 2
---

<code src="./demos/index.tsx" nopadding></code>

## Usage example

A classic dual-axes chart: request count (bar, left axis) + average cost (line, right axis).

<code src="./demos/example.tsx"></code>

## Usage example with axis labels

<code src="./demos/axis.tsx"></code>

## Custom y-axis domain

Recharts defaults number axes to `[0, auto]`, which flattens series in a narrow range (e.g. success rate 80–95%). Pass `domain` on `yAxisLeft` / `yAxisRight` to control the scale — same values as [recharts `YAxis.domain`](https://recharts.org/en-US/api/YAxis#domain).

<code src="./demos/domain.tsx"></code>

## No Data

<code src="./demos/noData.tsx"></code>

## Loading

<code src="./demos/loading.tsx"></code>

## API

<API></API>
