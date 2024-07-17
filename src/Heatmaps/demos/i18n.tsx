import { Heatmaps } from '@lobehub/charts';

import { yearData } from './data';

export default () => (
  <Heatmaps
    data={yearData}
    labels={{
      legend: {
        less: '少',
        more: '多',
      },
      months: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
      tooltip: '{{count}} 项活动于 {{date}}',
      totalCount: '{{year}} 年共有 {{count}} 项活动',
      weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    }}
  />
);
