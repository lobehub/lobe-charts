import { createStaticStyles, keyframes } from '@lobehub/ui';

const shimmer = keyframes`
  50% { opacity: 0.55; }
`;

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `PlaceList`. Two columns from 540 px of card
// width (container query), stacked with the map on top below that.
export const styles = createStaticStyles(({ css, cssVar }) => ({
  list: css`
    scrollbar-width: thin;

    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;

    max-height: var(--pl-h);
    padding: 6px;
  `,
  listColumn: css`
    order: 2;
    min-width: 0;

    @container (min-width: 540px) {
      order: 1;
      border-inline-end: 1px solid var(--a2-line);

      [data-variant='default'] & {
        border-color: ${cssVar.colorBorderSecondary};
      }
    }
  `,
  mapColumn: css`
    position: relative;

    order: 1;

    min-width: 0;
    height: 240px;
    border-block-end: 1px solid var(--a2-line);

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
    }

    @container (min-width: 540px) {
      order: 2;
      height: auto;
      min-height: var(--pl-h);
      border-block-end: 0;
    }
  `,
  mapInner: css`
    position: absolute;
    inset: 0;
  `,
  root: css`
    container-type: inline-size;
  `,
  row: css`
    cursor: pointer;

    display: flex;
    gap: 10px;
    align-items: flex-start;

    width: 100%;
    min-width: 0;
    padding-block: 6px;
    padding-inline: 10px;
    border: 1px solid transparent;
    border-radius: 10px;

    font: inherit;
    color: inherit;
    text-align: start;

    background: transparent;

    transition:
      background 150ms,
      border-color 150ms;

    &:hover {
      background: ${cssVar.colorFillQuaternary};
    }

    [data-variant='default'] & {
      border-radius: ${cssVar.borderRadius};
    }

    [data-variant='default'] &:hover {
      background: ${cssVar.colorFillTertiary};
    }
  `,
  rowActive: css`
    && {
      border-color: color-mix(in srgb, var(--map-accent) 30%, transparent);
      background: color-mix(in srgb, var(--map-accent) 9%, transparent);
    }
  `,
  rowBody: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;

    min-width: 0;
  `,
  rowCategory: css`
    display: none;

    @container (min-width: 420px) {
      display: inline;
    }
  `,
  rowDot: css`
    padding-block-start: 1px;
  `,
  rowLine: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    min-width: 0;
  `,
  rowName: css`
    overflow: hidden;

    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;

    [data-variant='default'] & {
      font-size: 14px;
    }
  `,
  rowSkeleton: css`
    height: 44px;
    margin: 4px;
    border-radius: 10px;

    background: ${cssVar.colorFillTertiary};

    animation: ${shimmer} 1.6s ease-in-out infinite;
  `,
  rowSub: css`
    font-size: 12px;
    line-height: 1.5;
    color: var(--a2-muted-fg);

    [data-variant='default'] & {
      color: ${cssVar.colorTextDescription};
    }
  `,
  rowTail: css`
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    align-items: center;

    font-size: 11px;

    opacity: 0.8;
  `,
  source: css`
    padding-block: 8px;
    padding-inline: 16px;
    border-block-start: 1px solid var(--a2-line);

    font-size: 11px;
    line-height: 1.5;
    color: color-mix(in srgb, var(--a2-muted-fg) 80%, transparent);

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
      font-size: 12px;
      color: ${cssVar.colorTextDescription};
    }
  `,
  split: css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-width: 0;
    border-block-start: 1px solid var(--a2-line);

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
    }

    @container (min-width: 540px) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    }
  `,
  tabular: css`
    font-variant-numeric: tabular-nums;
  `,
  truncate: css`
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));
