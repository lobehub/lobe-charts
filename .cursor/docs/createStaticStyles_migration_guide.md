# createStaticStyles 样式指南（@lobehub/ui v6）

## 📖 概述

lobe-charts 从 v6 起不再依赖 `antd` / `antd-style`，所有样式工具都从 `@lobehub/ui` 导入：

```ts
import {
  createGlobalStyle,
  createStaticStyles,
  css,
  cssVar,
  cx,
  keyframes,
  responsive,
  useTheme,
  useThemeMode,
} from '@lobehub/ui';
```

- `createStaticStyles(fn)` 在模块加载时**只执行一次** `fn`，返回 class 名对象，没有 hook、没有每次渲染的开销。
- `fn` 的参数是 `{ css, cssVar, cx, responsive }`（`StaticStyleUtils`）。
- `@lobehub/ui` **没有** `createStyles` hook，也没有 `token` 参数。旧的 `createStyles(({ css, token }) => …)` 写法必须改成 `createStaticStyles`。
- 底层是 emotion（实例 key 为 `acss`）。

当前 `src/` 中 `styles.ts` 全部使用这一模式，可直接参考 `src/RadarChart/styles.ts`。

## 🔄 基本写法

### 样式文件 `src/<Name>/styles.ts`

```ts
import { createStaticStyles } from '@lobehub/ui';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  gridLines: css`
    fill: none;
    stroke: ${cssVar.colorBorderSecondary};
    stroke-width: 1;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    fill: ${cssVar.colorTextDescription};
  `,
}));
```

### 组件文件

```tsx
import { cx } from '@lobehub/ui';

import { styles } from './styles';

const Component = ({ className }: { className?: string }) => (
  <div className={cx(styles.label, className)} />
);
```

## 🛠️ 常见场景

### 1. Token → `cssVar`

- 旧写法 `token.xxx` → `cssVar.xxx`。
- `cssVar.xxx` 的值是 CSS 变量引用，例如 `cssVar.colorText` 是 `var(--lobe-color-text)`。
- 数值类 token 在 CSS 变量中已经带 `px`（`lineHeight` 等无单位 token 除外），因此**不要再拼 `px`**：

```ts
// ❌ 错误
font-size: ${cssVar.fontSize}px;

// ✅ 正确
font-size: ${cssVar.fontSize};
width: calc(${cssVar.fontSize} * 2.5);
```

- 因为是 `var(...)` 字符串，`cssVar` 的值**不能**用于 JS 数值计算或传给颜色计算函数（见场景 7）。

### 2. 动态数值 props → CSS 自定义属性

样式里用带默认值的 `var(--xxx, 默认值)`，组件里通过 `style` 设置变量。仓库中的例子：`BenchmarkScatterChart`、`BenchmarkColumnChart`、`BenchmarkRankingChart` 通过 `style` 设置 `--benchmark-label-font-size` 等变量。

```tsx
<div
  className={styles.root}
  style={
    {
      '--benchmark-label-font-size': `${labelFontSize}px`,
      ...style,
    } as CSSProperties
  }
/>
```

### 3. 布尔 props / 暗色模式 → 拆分静态 class

把每种状态写成独立的静态 class，运行时用 `cx` 组合：

```ts
export const styles = createStaticStyles(({ css, cssVar }) => ({
  rootDark: css`
    background: ${cssVar.colorFillTertiary};
  `,
  rootLight: css`
    background: ${cssVar.colorFillQuaternary};
  `,
}));
```

```tsx
import { cx, useThemeMode } from '@lobehub/ui';

const { isDarkMode } = useThemeMode();
const className = cx(isDarkMode ? styles.rootDark : styles.rootLight);
```

`useThemeMode()` 只返回 `{ appearance, isDarkMode }`，只需要明暗模式时优先用它（`src/DonutChart/index.tsx` 就是这样做的）。仓库没有 `class-variance-authority`（`cva`），不要为此引入新依赖。

### 4. keyframes

两种写法仓库里都有：

- 在模块顶层用 `@lobehub/ui` 的 `keyframes` 定义，再在样式里插值（`src/Heatmaps/Calendar.tsx`）。
- 直接在 `css` 里写原生 `@keyframes`（`src/BenchmarkScatterChart/styles.ts`）。

不要在组件函数体内创建 keyframes。

### 5. 透明度 → `color-mix()`

不需要 `polished` 的 `rgba()`，用 CSS 原生 `color-mix()`：

```ts
background-color: color-mix(in srgb, ${cssVar.colorBgLayout} 40%, transparent);
```

`src/DonutChart/index.tsx` 使用了 `color-mix(in srgb, #000000 33%, transparent)`。

### 6. 响应式断点

`responsive` 既可从 `@lobehub/ui` 导入，也在 `createStaticStyles` 的参数里提供。可用键：

- `xs` / `sm` / `md` / `lg` / `xl`：`max-width` 查询。
- `xxl`：`min-width: 1200px`。
- 别名：`mobile` = `xs`，`tablet` = `md`，`laptop` = `lg`，`desktop` = `xxl`。

```ts
export const styles = createStaticStyles(({ css, responsive }) => ({
  root: css`
    ${responsive.sm} {
      padding: 12px;
    }
  `,
}));
```

当前 `src/` 未使用 `responsive`。

### 7. 什么时候保留 `useTheme()`

`useTheme()` 直接返回主题对象（`const theme = useTheme()`），包含 token 实际值、色板（`theme.gold`、`theme.green` 等）以及 `isDarkMode`。

只有需要**真实的 JS 值**时才用它：

- 把颜色传给 recharts 的 props。
- 生成默认色板：`src/hooks/useThemeColorRange.ts`。
- 用 `chroma-js` / `polished` 做颜色计算：`src/utils/theme.ts`、`src/Heatmaps/index.tsx`、`src/BenchmarkColumnChart/index.tsx`。

其余情况用 `cssVar`（写样式）或 `useThemeMode()`（只判断明暗）。

### 8. 遗留的 `prefixCls = 'ant'`

`src/BarList/index.tsx` 和 `src/BarList/styles.ts` 仍硬编码 `const prefixCls = 'ant'`，生成 `ant-chart-bar-item` 这个 class 名。它只是 BarList 自己的 class 名前缀，背后已经没有 antd 样式。新代码不要再引入 `ant-` 前缀。

## 📋 检查清单

### 样式文件

- [ ] 从 `@lobehub/ui` 导入，不出现 `antd` / `antd-style`
- [ ] 使用 `createStaticStyles(({ css, cssVar }) => ({ ... }))`
- [ ] 颜色、圆角、动效等取 `cssVar.*`，不要硬编码应随主题变化的颜色
- [ ] 不在 `cssVar` 后面再拼 `px`
- [ ] 动态数值用 CSS 自定义属性，状态用拆分的静态 class

### 组件文件

- [ ] `import { styles } from './styles'`，用 `cx` 合并外部 `className`
- [ ] 只判断明暗时用 `useThemeMode()`；需要 JS 实际值时才用 `useTheme()`

## 🔍 验证

```bash
npm run type-check
npm run lint:style
npx vitest run
npm run dev # 在明暗两种模式下目测组件
```
