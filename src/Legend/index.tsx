import type { FlexboxProps } from '@lobehub/ui';
import { createStaticStyles, cx, Flexbox } from '@lobehub/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useThemeColorRange } from '@/hooks/useThemeColorRange';

import LegendItem from './LegendItem';
import ScrollButton from './ScrollButton';

const styles = createStaticStyles(({ css }) => ({
  container: css`
    position: relative;
    overflow: hidden;
  `,
  enableLegendSlider: css`
    scrollbar-width: none;
    overflow: auto;
    align-items: center;
    padding-inline: 16px 48px;
  `,
  scrollButtons: css`
    inset-block: 0;
    inset-inline-end: 0;
  `,
}));

export interface LegendProps extends FlexboxProps {
  activeLegend?: string;
  categories: string[];
  colors?: string[];
  customCategories?: {
    [key: string]: string;
  };
  enableLegendSlider?: boolean;
  onClickLegendItem?: (category: string, color: string) => void;
}

type HasScrollProps = {
  left: boolean;
  right: boolean;
};

const Legend = ({ ref, ...props }: LegendProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const themeColorRange = useThemeColorRange();
  const {
    customCategories,
    categories,
    colors = themeColorRange,
    className,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider = false,
    ...rest
  } = props;
  const scrollableRef = useRef<HTMLInputElement>(null);
  const scrollButtonsRef = useRef<HTMLDivElement>(null);

  const [hasScroll, setHasScroll] = useState<HasScrollProps | null>(null);
  const [isKeyDowned, setIsKeyDowned] = useState<string | null>(null);
  const intervalRef = useRef<any | null>(null);

  const checkScroll = useCallback(() => {
    const scrollable = scrollableRef?.current;
    if (!scrollable) return;

    const hasLeftScroll = scrollable.scrollLeft > 0;
    const hasRightScroll = scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

    setHasScroll({ left: hasLeftScroll, right: hasRightScroll });
  }, [setHasScroll]); // dependencies are listed here in the array

  const scrollToTest = useCallback(
    (direction: 'left' | 'right') => {
      const element = scrollableRef?.current;
      const scrollButtons = scrollButtonsRef?.current;
      const width = element?.clientWidth ?? 0;
      const scrollButtonsWith = scrollButtons?.clientWidth ?? 0;

      if (element && enableLegendSlider) {
        element.scrollTo({
          behavior: 'smooth',
          left:
            direction === 'left'
              ? element.scrollLeft - width + scrollButtonsWith
              : element.scrollLeft + width - scrollButtonsWith,
        });
        setTimeout(() => {
          checkScroll();
        }, 400);
      }
    },
    [enableLegendSlider, checkScroll],
  );

  useEffect(() => {
    const keyDownHandler = (key: string) => {
      if (key === 'ArrowLeft') {
        scrollToTest('left');
      } else if (key === 'ArrowRight') {
        scrollToTest('right');
      }
    };
    if (isKeyDowned) {
      keyDownHandler(isKeyDowned);
      intervalRef.current = setInterval(() => {
        keyDownHandler(isKeyDowned);
      }, 300);
    } else {
      clearInterval(intervalRef.current as any);
    }
    return () => clearInterval(intervalRef.current as any);
  }, [isKeyDowned, scrollToTest]);

  const keyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      setIsKeyDowned(e.key);
    }
  };
  const keyUp = (e: KeyboardEvent) => {
    e.stopPropagation();
    setIsKeyDowned(null);
  };

  useEffect(() => {
    const scrollable = scrollableRef?.current;
    if (enableLegendSlider) {
      checkScroll();

      scrollable?.addEventListener('keydown', keyDown);
      scrollable?.addEventListener('keyup', keyUp);
    }

    return () => {
      scrollable?.removeEventListener('keydown', keyDown);
      scrollable?.removeEventListener('keyup', keyUp);
    };
  }, [checkScroll, enableLegendSlider]);

  // @ts-ignore
  return (
    <Flexbox horizontal className={cx(styles.container, className)} gap={8} ref={ref} {...rest}>
      <Flexbox
        horizontal
        flex={1}
        height={'100%'}
        ref={scrollableRef}
        style={{ overflow: 'hidden' }}
        tabIndex={0}
        wrap={enableLegendSlider ? 'nowrap' : 'wrap'}
        className={cx(
          enableLegendSlider && (hasScroll?.right || hasScroll?.left) && styles.enableLegendSlider,
        )}
      >
        {categories.map((category, idx) => (
          <LegendItem
            activeLegend={activeLegend}
            color={colors[idx % colors.length]}
            key={`item-${idx}`}
            label={customCategories?.[category] || category}
            name={category}
            onClick={onClickLegendItem}
          />
        ))}
      </Flexbox>
      {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
        <Flexbox
          horizontal
          align={'center'}
          className={styles.scrollButtons}
          flex={'none'}
          gap={4}
          height={'100%'}
          justify={'center'}
          ref={scrollButtonsRef}
        >
          <ScrollButton
            disabled={!hasScroll?.left}
            icon={ChevronLeft}
            onClick={() => {
              setIsKeyDowned(null);
              scrollToTest('left');
            }}
          />
          <ScrollButton
            disabled={!hasScroll?.right}
            icon={ChevronRight}
            onClick={() => {
              setIsKeyDowned(null);
              scrollToTest('right');
            }}
          />
        </Flexbox>
      ) : null}
    </Flexbox>
  );
};

Legend.displayName = 'Legend';

export default Legend;
