import { createStaticStyles } from '@lobehub/ui';

// Card chrome shared by the map components. Adapted from CopilotKit a2ui-playground (MIT): maps.tsx
// (`Header`, `Rating`, `NumberDot`, `Frame`). Every element has one class; the default look overrides the
// a2ui one through the root's `data-variant="default"`.
export const cardStyles = createStaticStyles(({ css, cssVar }) => ({
  /** Root of the default look: an outlined LobeHub block, no shadow. */
  plain: css`
    position: relative;

    overflow: hidden;

    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgContainer};
  `,
  /** Root of the a2ui look, on top of `a2uiStyles.card`. */
  a2ui: css`
    color: var(--a2-fg);
  `,
  frame: css`
    position: relative;
    width: 100%;
    min-width: 0;
  `,
  frameLines: css`
    border-block: 1px solid var(--a2-line);

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
    }
  `,
  header: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    min-width: 0;
    padding-block: 14px 12px;
    padding-inline: 16px;

    [data-variant='default'] & {
      padding-block: 12px;
    }
  `,
  headerLead: css`
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
  `,
  headerIcon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;
    border-radius: 6px;

    color: var(--map-accent-ink);

    background: color-mix(in srgb, var(--map-accent) 15%, transparent);

    [data-variant='default'] & {
      width: auto;
      color: ${cssVar.colorTextSecondary};
      background: none;
    }
  `,
  headerMeta: css`
    flex-shrink: 0;

    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: var(--a2-muted-fg);

    [data-variant='default'] & {
      font-size: 12px;
      color: ${cssVar.colorTextDescription};
    }
  `,
  headerTitle: css`
    overflow: hidden;

    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    text-overflow: ellipsis;
    letter-spacing: -0.025em;
    white-space: nowrap;

    [data-variant='default'] & {
      font-weight: 500;
      letter-spacing: normal;
    }
  `,
  numberDot: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;
    border-radius: 50%;

    font-size: 10.5px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: var(--a2-muted-fg);

    background: ${cssVar.colorFillSecondary};

    transition:
      background 150ms,
      color 150ms;

    [data-variant='default'] & {
      color: ${cssVar.colorTextSecondary};
    }
  `,
  numberDotActive: css`
    && {
      color: ${cssVar.colorTextLightSolid};
      background: color-mix(in srgb, var(--map-accent) 80%, ${cssVar.colorWhite});
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--map-accent) 22%, transparent);
    }
  `,
  rating: css`
    display: inline-flex;
    flex-shrink: 0;
    gap: 2px;
    align-items: center;

    font-size: 11.5px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: ${cssVar.colorWarningText};

    [data-variant='default'] & {
      font-size: 12px;
    }
  `,
}));
