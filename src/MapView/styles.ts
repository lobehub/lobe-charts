import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `MapView` chip row.
export const styles = createStaticStyles(({ css, cssVar }) => ({
  chip: css`
    cursor: pointer;

    display: flex;
    flex-shrink: 0;
    gap: 8px;
    align-items: center;

    max-width: 220px;
    padding-block: 4px;
    padding-inline: 4px 12px;
    border: 1px solid var(--a2-line);
    border-radius: 999px;

    font: inherit;
    font-size: 12px;
    line-height: 1.5;
    color: var(--a2-muted-fg);
    text-align: start;

    background: ${cssVar.colorFillQuaternary};

    transition:
      color 150ms,
      background 150ms,
      border-color 150ms;

    &:hover {
      color: var(--a2-fg);
    }

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
      color: ${cssVar.colorTextSecondary};
    }

    [data-variant='default'] &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  chipActive: css`
    && {
      border-color: color-mix(in srgb, var(--map-accent) 40%, transparent);
      color: var(--a2-fg);
      background: color-mix(in srgb, var(--map-accent) 10%, transparent);
    }
  `,
  chipLabel: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  chips: css`
    scrollbar-width: none;

    overflow-x: auto;
    display: flex;
    gap: 6px;

    padding-block: 10px;
    padding-inline: 12px;
  `,
}));
