import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  calendar: css`
    overflow: visible;
    display: block;

    text {
      fill: currentcolor;
    }
  `,
  container: css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    width: max-content;
    max-width: 100%;

    rect {
      stroke: ${token.colorFillTertiary};
      stroke-width: 1px;
      shape-rendering: geometricprecision;
    }
  `,
  footer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    white-space: nowrap;
  `,
  legendColors: css`
    display: flex;
    gap: 3px;
    align-items: center;
    margin-left: auto;
  `,
  scrollContainer: css`
    overflow: auto hidden;
    max-width: 100%;
    padding-block: 2px;
  `,
}));
