import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `LocationCard`.
export const styles = createStaticStyles(({ css, cssVar }) => ({
  actions: css`
    display: flex;
    gap: 8px;
    margin-block-start: 4px;
  `,
  address: css`
    display: flex;
    gap: 4px;
    align-items: flex-start;

    min-width: 0;

    font-size: 12.5px;
    line-height: 1.5;
    color: var(--a2-muted-fg);

    [data-variant='default'] & {
      font-size: 13px;
      color: ${cssVar.colorTextSecondary};
    }
  `,
  addressIcon: css`
    flex-shrink: 0;
    margin-block-start: 3px;
  `,
  addressText: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  `,
  badge: css`
    flex-shrink: 0;

    padding-block: 1px;
    padding-inline: 8px;
    border: 1px solid var(--a2-line);
    border-radius: 999px;

    font-size: 11px;
    font-weight: 500;
    line-height: 1.6;
    color: var(--a2-muted-fg);
    white-space: nowrap;

    background: ${cssVar.colorFillTertiary};

    [data-variant='default'] & {
      border-color: transparent;
      border-radius: ${cssVar.borderRadiusSM};
      font-size: 12px;
      color: ${cssVar.colorTextSecondary};
    }
  `,
  body: css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    min-width: 0;
    padding-block: 12px 16px;
    padding-inline: 16px;
  `,
  /** A link drawn as a LobeHub default button (no ConfigProvider needed). */
  button: css`
    display: inline-flex;
    flex: 1;
    gap: 6px;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    min-width: 0;
    height: 32px;
    padding-inline: 12px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: ${cssVar.borderRadius};

    font-size: 12.5px;
    font-weight: 500;
    color: ${cssVar.colorText};
    text-decoration: none;
    white-space: nowrap;

    background: ${cssVar.colorBgContainer};

    transition:
      background 150ms,
      border-color 150ms;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    [data-variant='default'] & {
      font-size: 13px;
      font-weight: 400;
    }
  `,
  /** The LobeHub primary button. */
  buttonPrimary: css`
    border-color: ${cssVar.colorPrimary};
    color: ${cssVar.colorBgContainer};
    background: ${cssVar.colorPrimary};

    &:hover {
      border-color: ${cssVar.colorPrimaryHover};
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorPrimaryHover};
    }
  `,
  fade: css`
    pointer-events: none;

    position: absolute;
    z-index: 4;
    inset-block-end: 0;
    inset-inline: 0;

    height: 40px;

    background: linear-gradient(to top, var(--a2-surface), transparent);
  `,
  hours: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;
  `,
  map: css`
    border-block-end: 1px solid var(--a2-line);

    [data-variant='default'] & {
      border-color: ${cssVar.colorBorderSecondary};
    }
  `,
  meta: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: center;

    font-size: 12px;
    line-height: 1.5;
    color: var(--a2-muted-fg);

    [data-variant='default'] & {
      color: ${cssVar.colorTextSecondary};
    }
  `,
  name: css`
    overflow: hidden;

    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
    text-overflow: ellipsis;
    letter-spacing: -0.025em;
    white-space: nowrap;

    [data-variant='default'] & {
      font-size: 16px;
      letter-spacing: normal;
    }
  `,
  titleBlock: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  `,
  titleRow: css`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;

    min-width: 0;
  `,
}));
