import { cx } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';

import { styles } from './styles';

interface TotalCountProps {
  totalCount: number;
  totalCountText?: string;
  year: number;
}

// Simple component - memo not needed as props are primitives and component is lightweight
const TotalCount = ({ totalCount, year, totalCountText }: TotalCountProps) => {
  const text = useMemo(() => {
    if (totalCountText) {
      return totalCountText
        .replace('{{count}}', String(totalCount))
        .replace('{{year}}', String(year));
    }
    return `${totalCount} activities in ${year}`;
  }, [totalCountText, totalCount, year]);

  return <div className={cx('count')}>{text}</div>;
};

TotalCount.displayName = 'TotalCount';

interface ColorLegendProps {
  blockRadius: number;
  blockSize: number;
  colorScale: string[];
  lessLabel: string;
  maxLevel: number;
  moreLabel: string;
}

// Simple component - Footer already memoized, so this doesn't need memo
const ColorLegend = ({
  blockSize,
  blockRadius,
  colorScale,
  maxLevel,
  lessLabel,
  moreLabel,
}: ColorLegendProps) => {
  const colorLevels = useMemo(() => {
    return Array.from({ length: maxLevel + 1 }, (_, level) => level);
  }, [maxLevel]);

  return (
    <div className={cx('legend-colors', styles.legendColors)}>
      <span style={{ marginRight: '0.4em' }}>{lessLabel}</span>
      {colorLevels.map((level) => (
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
      <span style={{ marginLeft: '0.4em' }}>{moreLabel}</span>
    </div>
  );
};

ColorLegend.displayName = 'ColorLegend';

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
    // Memoize footer style
    const footerStyle = useMemo(() => {
      return { marginLeft: weekdayLabelOffset };
    }, [weekdayLabelOffset]);

    return (
      <footer className={cx('footer', styles.footer)} style={footerStyle}>
        {/* Placeholder */}
        {loading && <div>&nbsp;</div>}

        {!loading && !hideTotalCount && (
          <TotalCount totalCount={totalCount} totalCountText={labels.totalCount} year={year} />
        )}

        {!loading && !hideColorLegend && (
          <ColorLegend
            blockRadius={blockRadius}
            blockSize={blockSize}
            colorScale={colorScale}
            lessLabel={labels.legend.less}
            maxLevel={maxLevel}
            moreLabel={labels.legend.more}
          />
        )}
      </footer>
    );
  },
  isEqual,
);

Footer.displayName = 'Footer';

export default Footer;
