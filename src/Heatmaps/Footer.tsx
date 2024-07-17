import { memo } from 'react';

import { useStyles } from './styles';

interface FooterProps {
  blockRadius: number;
  blockSize: number;
  colorScale: string[];
  hideColorLegend?: boolean;
  hideTotalCount?: boolean;
  labels: {
    legend: {
      less: string;
      more: string;
    };
    totalCount?: string;
  };
  loading: boolean;
  maxLevel: number;
  totalCount: number;
  weekdayLabelOffset?: number;
  year: number;
}

const Footer = memo<FooterProps>(
  ({
    hideTotalCount,
    hideColorLegend,
    weekdayLabelOffset,
    loading,
    labels,
    year,
    maxLevel,
    blockSize,
    colorScale,
    blockRadius,
    totalCount,
  }) => {
    const { cx, styles } = useStyles();

    return (
      <footer className={cx('footer', styles.footer)} style={{ marginLeft: weekdayLabelOffset }}>
        {/* Placeholder */}
        {loading && <div>&nbsp;</div>}

        {!loading && !hideTotalCount && (
          <div className={cx('count')}>
            {labels.totalCount
              ? labels.totalCount
                  .replace('{{count}}', String(totalCount))
                  .replace('{{year}}', String(year))
              : `${totalCount} activities in ${year}`}
          </div>
        )}

        {!loading && !hideColorLegend && (
          <div className={cx('legend-colors', styles.legendColors)}>
            <span style={{ marginRight: '0.4em' }}>{labels.legend.less}</span>
            {Array.from({ length: maxLevel + 1 })
              .fill(null)
              .map((_, level) => (
                <svg height={blockSize} key={level} width={blockSize}>
                  <rect
                    fill={colorScale[level]}
                    height={blockSize}
                    rx={blockRadius}
                    ry={blockRadius}
                    width={blockSize}
                  />
                </svg>
              ))}
            <span style={{ marginLeft: '0.4em' }}>{labels.legend.more}</span>
          </div>
        )}
      </footer>
    );
  },
);

export default Footer;
