import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): domain.tsx `StockTicker`. Padding lives on the rows so the
// sparkline can run edge to edge in the card.
export const styles = createStaticStyles(({ css, cssVar }) => ({
  baseline: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    overflow: visible;

    color: ${cssVar.colorBorder};
  `,
  card: css`
    container-type: inline-size;
    color: var(--a2-fg);
  `,
  change: css`
    display: inline-flex;
    gap: 2px;
    align-items: center;

    font-size: 13px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
  `,
  down: css`
    color: ${cssVar.colorErrorText};
  `,
  head: css`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;

    padding-block-start: 16px;
    padding-inline: 16px;

    [data-variant='default'] & {
      padding-block-start: 0;
      padding-inline: 0;
    }
  `,
  identity: css`
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  `,
  mark: css`
    display: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    min-width: 32px;
    height: 32px;
    padding-inline: 6px;
    border: 1px solid var(--a2-line);
    border-radius: 9px;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 10.5px;
    font-weight: 700;

    background: ${cssVar.colorFillTertiary};

    @container (min-width: 300px) {
      display: flex;
    }

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
      border-radius: ${cssVar.borderRadius};
    }
  `,
  name: css`
    overflow: hidden;

    font-size: 11.5px;
    line-height: 1.5;
    color: var(--a2-muted-fg);
    text-overflow: ellipsis;
    white-space: nowrap;

    [data-variant='default'] & {
      font-size: 12px;
      color: ${cssVar.colorTextDescription};
    }
  `,
  names: css`
    display: flex;
    flex-direction: column;
    min-width: 0;
  `,
  plain: css`
    container-type: inline-size;
    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    width: 100%;
    min-width: 0;

    color: ${cssVar.colorText};
  `,
  price: css`
    font-size: 30px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    letter-spacing: -0.025em;

    [data-variant='default'] & {
      font-size: 28px;
      letter-spacing: normal;
    }
  `,
  quote: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: baseline;

    padding-block-start: 12px;
    padding-inline: 16px;

    [data-variant='default'] & {
      padding-inline: 0;
    }
  `,
  sample: css`
    flex-shrink: 0;

    padding-block: 2px;
    padding-inline: 8px;
    border: 1px solid ${cssVar.colorWarningBorder};
    border-radius: 999px;

    font-size: 10.5px;
    font-weight: 500;
    line-height: 1.5;
    color: ${cssVar.colorWarningText};
    white-space: nowrap;

    background: ${cssVar.colorWarningBg};

    [data-variant='default'] & {
      border-radius: ${cssVar.borderRadiusSM};
      font-size: 12px;
    }
  `,
  spark: css`
    position: relative;
    width: 100%;
    margin-block-start: 12px;
  `,
  sparkEmpty: css`
    height: 16px;
  `,
  stat: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    padding-block: 4px;

    font-size: 12px;
    line-height: 1.5;

    [data-variant='default'] & {
      font-size: 13px;
    }
  `,
  statLabel: css`
    overflow: hidden;
    color: var(--a2-muted-fg);
    text-overflow: ellipsis;
    white-space: nowrap;

    [data-variant='default'] & {
      color: ${cssVar.colorTextDescription};
    }
  `,
  stats: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    column-gap: 16px;

    padding-block: 12px;
    padding-inline: 16px;
    border-block-start: 1px solid var(--a2-line);

    [data-variant='default'] & {
      padding-block-end: 0;
      padding-inline: 0;
      border-color: ${cssVar.colorBorderSecondary};
    }
  `,
  statValue: css`
    flex-shrink: 0;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  `,
  symbol: css`
    overflow: hidden;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    text-overflow: ellipsis;
    letter-spacing: -0.025em;
    white-space: nowrap;
  `,
  up: css`
    color: ${cssVar.colorSuccessText};
  `,
}));
