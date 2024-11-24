import { ValueFormatter } from '@/types';
import { defaultValueFormatter, isOnSeverSide } from '@/utils/index';

export const getTextWidth = (text: string) => {
  if (isOnSeverSide) return 0;

  // 创建临时 span 元素
  const span = document.createElement('span');

  // 设置样式使其不可见
  span.style.fontSize = '12px';
  span.style.position = 'absolute';
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'nowrap';

  // 设置文本内容
  span.textContent = text;

  // 添加到 body
  document.body.append(span);

  // 获取宽度
  const width = span.getBoundingClientRect().width;

  // 移除临时元素
  span.remove();

  return width;
};

export const getMaxLabelLength = ({
  data,
  valueFormatter = defaultValueFormatter,
  index,
  layout = 'horizontal',
  margin = 24,
  isScatterChart,
}: {
  data: Array<Record<string, any>>;
  index: string;
  isScatterChart?: boolean;
  layout?: 'vertical' | 'horizontal';
  margin?: number;
  valueFormatter?: ValueFormatter;
}): number => {
  let maxLength = 0;
  let maxLabel = '';

  if (isScatterChart) {
    for (const item of data) {
      const formattedValue = valueFormatter(item[index]);
      if (formattedValue.length > maxLength) {
        maxLength = formattedValue.length;
        maxLabel = formattedValue;
      }
    }
  } else if (layout === 'vertical') {
    for (const item of data) {
      if (item[index].length > maxLength) {
        maxLength = item[index].length;
        maxLabel = item[index];
      }
    }
  } else {
    for (const item of data) {
      const categories = Object.keys(item).filter((key) => key !== index);
      for (const category of categories) {
        const value = item[category];
        if (value === undefined) continue; // Skip null or undefined values
        const formattedValue = valueFormatter(value);
        if (formattedValue.length > maxLength) {
          maxLength = formattedValue.length;
          maxLabel = formattedValue;
        }
      }
    }
  }

  return getTextWidth(maxLabel) + margin;
};
