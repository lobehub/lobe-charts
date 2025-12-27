---
nav: Components
group: Visualizations
description: A flexible React component to display activity data in a heatmaps chart.
---

<code iframe src="./demos/index.tsx" nopadding></code>

## Usage example

The example below shows a composition of a `Heatmaps` component.

<code iframe src="./demos/example.tsx"></code>

## Loading

<code iframe src="./demos/loading.tsx"></code>

## Activity Levels

Use the `maxLevel` prop to control the number of activity levels. This value is zero indexed (0 represents no activity),
so for example a maxLevel of 2 will total in 3 levels as above. Each activity level must be in the interval from 0 to `maxLevel`,
which is 4 per default.

<code iframe src="./demos/activityLevels.tsx"></code>

## Date Ranges

<code iframe src="./demos/dataRanges.tsx"></code>

## Usage example with click event

The example below shows an interacive chart using the `onValueChange` prop.

<code iframe src="./demos/clickEvent.tsx"></code>

## Usage example with custom tooltip

The example below shows a custom tooltip using `customTooltip` prop.

<code iframe src="./demos/customTooltip.tsx"></code>

## Usage example with a custom colors

The example below shows a chart with custom `colors`.

<code iframe src="./demos/customColors.tsx"></code>

## Customization

<code iframe src="./demos/customization.tsx"></code>

## Localization

<code iframe src="./demos/i18n.tsx"></code>

## API

<API></API>
